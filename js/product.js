/* =========================================================
   MARKXCOLLECTIONS — product.js (product details page)
   ========================================================= */

function initProductPage() {
  const root = document.getElementById("pdRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || PRODUCTS[0].id;
  const p = getProductById(id) || PRODUCTS[0];

  document.title = `${p.name} | MarkxCollections`;

  root.innerHTML = `
    <div class="pd-layout">
      <div>
        <div class="pd-main-img"><img id="pdMainImg" src="${p.image}" alt="${p.name}"></div>
        <div class="pd-thumbs" id="pdThumbs">
          ${p.images.map((img, i) => `<img src="${img}" class="${i === 0 ? "active" : ""}" data-img="${img}">`).join("")}
        </div>
      </div>
      <div>
        <div class="product-cat">${p.category}</div>
        <h1 style="font-size:2rem;text-transform:none;font-family:var(--font-body);font-weight:700;margin-top:6px;">${p.name}</h1>
        <div class="rating" style="margin-top:10px;">${starString(p.rating)} <span class="count">(${p.reviews} reviews)</span></div>
        <div class="pd-price-row">
          <span class="pd-price">${formatMoney(p.price)}</span>
          ${p.oldPrice ? `<span class="pd-old">${formatMoney(p.oldPrice)}</span><span class="tag tag-accent">SAVE ${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}
        </div>
        <p class="pd-desc">${p.description}</p>

        <div class="field"><label>Color</label>
          <div class="chip-group" id="pdColors">
            ${p.colors.map((c, i) => `<button type="button" class="chip swatch-chip ${i === 0 ? "selected" : ""}" data-color="${c}"><span class="swatch-dot" style="background:${COLOR_HEX[c] || "#ccc"}"></span>${c}</button>`).join("")}
          </div>
        </div>
        <div class="field"><label>Size <a href="#size-guide" style="font-weight:400;color:var(--accent-deep);margin-left:6px;">Size guide</a></label>
          <div class="chip-group" id="pdSizes">
            ${p.sizes.map((s, i) => `<button type="button" class="chip ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}
          </div>
        </div>
        <div class="qty-selector">
          <span style="font-weight:600;font-size:.85rem;">Quantity</span>
          <div class="qty-stepper" id="pdQtyStepper">
            <button type="button" data-pd-qty="-1">&minus;</button><span id="pdQty">1</span><button type="button" data-pd-qty="1">+</button>
          </div>
        </div>
        <div class="pd-actions">
          <button class="btn btn-solid" id="pdAddCart">Add to Cart</button>
          <button class="btn btn-accent" id="pdBuyNow">Buy Now</button>
          ${p.customizable ? `<a href="customize.html?product=${p.id}" class="btn btn-ghost">Customize This</a>` : ""}
        </div>

        <div class="tabs" id="pdTabs">
          <button class="tab-btn active" data-tab="desc">Description</button>
          <button class="tab-btn" data-tab="size">Size Guide</button>
          <button class="tab-btn" data-tab="print">Printing Details</button>
          <button class="tab-btn" data-tab="delivery">Delivery</button>
          <button class="tab-btn" data-tab="returns">Returns</button>
        </div>
        <div class="tab-panel active" data-panel="desc">${p.description} Fabric: 100% combed cotton, 190–240gsm depending on style. Pre-shrunk and garment-washed.</div>
        <div class="tab-panel" data-panel="size" id="size-guide">
          S: Chest 36" &middot; M: Chest 38" &middot; L: Chest 40" &middot; XL: Chest 42" &middot; XXL: Chest 44". Oversized styles run one size larger than usual — size down if you prefer a fitted look.
        </div>
        <div class="tab-panel" data-panel="print">DTF prints are cured at high temperature for durability and can withstand 40+ home washes when washed inside-out on a cold, gentle cycle.</div>
        <div class="tab-panel" data-panel="delivery">Orders are dispatched within 2–4 working days. Standard delivery takes 3–6 working days nationwide. Free delivery on orders above ${formatMoney(MARKX_CONFIG.freeDeliveryOver)}.</div>
        <div class="tab-panel" data-panel="returns">Unworn items in original condition can be exchanged within 7 days of delivery. Customized and bulk orders are made-to-order and are non-returnable unless defective.</div>
      </div>
    </div>
  `;

  // thumbnails
  root.querySelectorAll("#pdThumbs img").forEach((img) => {
    img.addEventListener("click", () => {
      document.getElementById("pdMainImg").src = img.dataset.img;
      root.querySelectorAll("#pdThumbs img").forEach((t) => t.classList.remove("active"));
      img.classList.add("active");
    });
  });

  // color / size chips
  root.querySelectorAll("#pdColors .chip").forEach((c) =>
    c.addEventListener("click", () => {
      root.querySelectorAll("#pdColors .chip").forEach((x) => x.classList.remove("selected"));
      c.classList.add("selected");
    })
  );
  root.querySelectorAll("#pdSizes .chip").forEach((c) =>
    c.addEventListener("click", () => {
      root.querySelectorAll("#pdSizes .chip").forEach((x) => x.classList.remove("selected"));
      c.classList.add("selected");
    })
  );

  // quantity
  let qty = 1;
  root.querySelectorAll("[data-pd-qty]").forEach((btn) =>
    btn.addEventListener("click", () => {
      qty = Math.max(1, qty + Number(btn.dataset.pdQty));
      document.getElementById("pdQty").textContent = qty;
    })
  );

  const getSelection = () => ({
    size: root.querySelector("#pdSizes .chip.selected").dataset.size,
    color: root.querySelector("#pdColors .chip.selected").dataset.color,
    qty
  });

  document.getElementById("pdAddCart").addEventListener("click", () => {
    addToCart(p, getSelection());
  });
  document.getElementById("pdBuyNow").addEventListener("click", () => {
    addToCart(p, getSelection());
    window.location.href = "cart.html";
  });

  // tabs
  root.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      root.querySelectorAll(".tab-panel").forEach((p2) => p2.classList.remove("active"));
      btn.classList.add("active");
      root.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
    });
  });

  refreshWishButtons();

  // related products
  const related = PRODUCTS.filter((rp) => rp.category === p.category && rp.id !== p.id).slice(0, 4);
  renderProductGrid("relatedGrid", related.length ? related : PRODUCTS.filter((rp) => rp.id !== p.id).slice(0, 4));
}

document.addEventListener("DOMContentLoaded", initProductPage);
