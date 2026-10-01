/* =========================================================
   MARKXCOLLECTIONS — cart.js
   ========================================================= */

function getCart() {
  return storeGet(MARKX_KEYS.cart, []);
}
function saveCart(cart) {
  storeSet(MARKX_KEYS.cart, cart);
  paintCartCount();
}

function addToCart(product, options = {}) {
  const { size = product.sizes[0], color = product.colors[0], qty = 1 } = options;
  const cart = getCart();
  const lineId = `${product.id}-${size}-${color}`;
  const existing = cart.find((i) => i.lineId === lineId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      lineId,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.oldPrice ? product.price : product.price,
      size,
      color,
      qty
    });
  }
  saveCart(cart);
  showToast(`Added to your cart`, "fa-solid fa-circle-check");
}

function removeFromCart(lineId) {
  const cart = getCart().filter((i) => i.lineId !== lineId);
  saveCart(cart);
  showToast("Product removed from cart", "fa-solid fa-trash");
  renderCartPage();
}

function updateQuantity(lineId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.lineId === lineId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartPage();
}

function clearCart() {
  saveCart([]);
}

function calculateSubtotal(cart = getCart()) {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}
function calculateDiscount(subtotal, paymentMethod) {
  return paymentMethod === "card" ? subtotal * MARKX_CONFIG.cardDiscount : 0;
}
function calculateDelivery(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= MARKX_CONFIG.freeDeliveryOver ? 0 : MARKX_CONFIG.deliveryCharges;
}
function calculateTotal(subtotal, discount, delivery) {
  return subtotal - discount + delivery;
}

/* ---------------- cart page rendering ---------------- */
let currentPaymentMethod = "cod";

function renderCartPage() {
  const listEl = document.getElementById("cartList");
  const emptyEl = document.getElementById("cartEmpty");
  const sideEl = document.getElementById("cartSide");
  if (!listEl) return;

  const cart = getCart();
  if (!cart.length) {
    listEl.innerHTML = "";
    if (sideEl) sideEl.style.display = "none";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";
  if (sideEl) sideEl.style.display = "block";

  listEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-line="${item.lineId}">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <div style="font-weight:600;">${item.name}</div>
        <div class="cart-item-meta">Size: ${item.size} &middot; Color: ${item.color}</div>
        <div class="qty-stepper">
          <button aria-label="Decrease quantity" onclick="updateQuantity('${item.lineId}', -1)">&minus;</button>
          <span>${item.qty}</span>
          <button aria-label="Increase quantity" onclick="updateQuantity('${item.lineId}', 1)">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:700;">${formatMoney(item.price * item.qty)}</div>
        <button class="remove-link" onclick="removeFromCart('${item.lineId}')">Remove</button>
      </div>
    </div>`
    )
    .join("");

  paintCartSummary();
}

function paintCartSummary() {
  const cart = getCart();
  const subtotal = calculateSubtotal(cart);
  const discount = calculateDiscount(subtotal, currentPaymentMethod);
  const delivery = calculateDelivery(subtotal);
  const total = calculateTotal(subtotal, discount, delivery);

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setText("sumSubtotal", formatMoney(subtotal));
  setText("sumDiscount", discount > 0 ? "-" + formatMoney(discount) : formatMoney(0));
  setText("sumDelivery", delivery === 0 ? "FREE" : formatMoney(delivery));
  setText("sumTotal", formatMoney(total));

  const discountRow = document.getElementById("sumDiscountRow");
  if (discountRow) discountRow.style.display = discount > 0 ? "flex" : "none";

  return { subtotal, discount, delivery, total };
}

function wireCartPayment() {
  document.querySelectorAll("input[name=cartPayment]").forEach((radio) => {
    radio.addEventListener("change", () => {
      currentPaymentMethod = radio.value;
      document.querySelectorAll(".radio-card").forEach((c) => c.classList.remove("selected"));
      radio.closest(".radio-card")?.classList.add("selected");
      paintCartSummary();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cartList")) {
    renderCartPage();
    wireCartPayment();
    document.getElementById("proceedCheckoutBtn")?.addEventListener("click", () => {
      sessionStorage.setItem("markxPaymentMethod", currentPaymentMethod);
      window.location.href = "checkout.html";
    });
  }
});
