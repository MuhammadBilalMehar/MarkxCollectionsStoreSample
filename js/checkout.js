/* =========================================================
   MARKXCOLLECTIONS — checkout.js
   ========================================================= */

let checkoutPaymentMethod = "cod";
let checkoutScreenshot = null;
let checkoutNoScreenshot = false;

function generateOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MXC-${ymd}-${rand}`;
}

function renderCheckoutSummary() {
  const cart = getCart();
  const wrap = document.getElementById("checkoutItems");
  if (!wrap) return;
  wrap.innerHTML = cart
    .map(
      (i) => `
    <div class="checkout-summary-item">
      <span>${i.name} <span style="color:#77715f;">&times;${i.qty}</span><br><span style="font-size:.76rem;color:#77715f;">${i.size} / ${i.color}</span></span>
      <span>${formatMoney(i.price * i.qty)}</span>
    </div>`
    )
    .join("");

  const subtotal = calculateSubtotal(cart);
  const discount = calculateDiscount(subtotal, checkoutPaymentMethod);
  const delivery = calculateDelivery(subtotal);
  const total = calculateTotal(subtotal, discount, delivery);

  document.getElementById("coSubtotal").textContent = formatMoney(subtotal);
  document.getElementById("coDiscount").textContent = discount > 0 ? "-" + formatMoney(discount) : formatMoney(0);
  document.getElementById("coDeliveryFee").textContent = delivery === 0 ? "FREE" : formatMoney(delivery);
  document.getElementById("coTotal").textContent = formatMoney(total);
  document.getElementById("coDiscountRow").style.display = discount > 0 ? "flex" : "none";

  return { cart, subtotal, discount, delivery, total };
}

function wirePaymentSelection() {
  document.querySelectorAll("input[name=checkoutPayment]").forEach((radio) => {
    radio.addEventListener("change", () => {
      checkoutPaymentMethod = radio.value;
      document.querySelectorAll(".radio-card").forEach((c) => c.classList.remove("selected"));
      radio.closest(".radio-card")?.classList.add("selected");
      const cardBlock = document.getElementById("cardPaymentBlock");
      if (cardBlock) cardBlock.style.display = checkoutPaymentMethod === "card" ? "block" : "none";
      renderCheckoutSummary();
    });
  });
}

function wireScreenshotUpload() {
  const zone = document.getElementById("screenshotZone");
  const input = document.getElementById("screenshotInput");
  const preview = document.getElementById("screenshotPreview");
  const noScreenshotBtn = document.getElementById("noScreenshotBtn");
  if (!zone) return;

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      showToast("Please upload a PNG, JPG or WEBP screenshot", "fa-solid fa-triangle-exclamation");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      checkoutScreenshot = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="Payment screenshot">`;
    };
    reader.readAsDataURL(file);
  };
  zone.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => handleFiles(e.target.files));

  noScreenshotBtn?.addEventListener("click", () => {
    checkoutNoScreenshot = !checkoutNoScreenshot;
    noScreenshotBtn.classList.toggle("selected", checkoutNoScreenshot);
    zone.style.opacity = checkoutNoScreenshot ? ".4" : "1";
    zone.style.pointerEvents = checkoutNoScreenshot ? "none" : "auto";
  });
}

function validateCheckoutForm() {
  const requiredIds = ["custName", "custPhone", "custAddress", "custCity"];
  let valid = true;
  requiredIds.forEach((id) => {
    const el = document.getElementById(id);
    const errorEl = el.parentElement.querySelector(".field-error");
    if (!el.value.trim()) {
      el.parentElement.classList.add("has-error");
      if (errorEl) errorEl.textContent = id === "custPhone" ? "Please enter your phone number." : "This field is required.";
      valid = false;
    } else {
      el.parentElement.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  });
  if (!document.querySelector("input[name=checkoutPayment]:checked")) {
    document.getElementById("paymentError").textContent = "Please select a payment method.";
    valid = false;
  } else {
    document.getElementById("paymentError").textContent = "";
  }
  return valid;
}

function initCheckoutPage() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const cart = getCart();
  if (!cart.length) {
    window.location.href = "cart.html";
    return;
  }

  const saved = sessionStorage.getItem("markxPaymentMethod");
  if (saved) {
    checkoutPaymentMethod = saved;
    const radio = document.querySelector(`input[name=checkoutPayment][value=${saved}]`);
    if (radio) {
      radio.checked = true;
      radio.closest(".radio-card")?.classList.add("selected");
      document.getElementById("cardPaymentBlock").style.display = saved === "card" ? "block" : "none";
    }
  }

  renderCheckoutSummary();
  wirePaymentSelection();
  wireScreenshotUpload();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCheckoutForm()) {
      showToast("Please complete the required fields", "fa-solid fa-triangle-exclamation");
      return;
    }
    const { subtotal, discount, delivery, total } = renderCheckoutSummary();

    const order = {
      orderNumber: generateOrderNumber(),
      date: new Date().toISOString(),
      customer: {
        name: document.getElementById("custName").value,
        phone: document.getElementById("custPhone").value,
        email: document.getElementById("custEmail").value,
        address: document.getElementById("custAddress").value,
        city: document.getElementById("custCity").value,
        postalCode: document.getElementById("custPostal").value,
        notes: document.getElementById("custNotes").value
      },
      paymentMethod: checkoutPaymentMethod,
      items: cart,
      subtotal,
      discount,
      delivery,
      total
    };

    const orders = storeGet(MARKX_KEYS.orders, []);
    orders.push(order);
    storeSet(MARKX_KEYS.orders, orders);
    storeSet(MARKX_KEYS.customer, order.customer);
    sessionStorage.setItem("markxLastOrder", JSON.stringify(order));

    clearCart();
    window.location.href = "order-success.html";
  });
}

document.addEventListener("DOMContentLoaded", initCheckoutPage);
