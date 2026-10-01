/* =========================================================
   MARKXCOLLECTIONS — products.js
   Static product catalog for the frontend demo.
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Black Oversized Tee",
    category: "Oversized",
    type: "plain",
    price: 1499,
    oldPrice: 1799,
    rating: 4.8,
    reviews: 42,
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product1.svg",
    images: ["assets/products/product1.svg", "assets/products/product1-back.svg"],
    customizable: true,
    description:
      "A heavyweight 240gsm cotton oversized tee with a dropped shoulder and boxy fit. Garment-washed for a soft, broken-in feel from the first wear."
  },
  {
    id: 2,
    name: "Premium White Cotton Tee",
    category: "Plain",
    type: "plain",
    price: 1299,
    oldPrice: null,
    rating: 4.7,
    reviews: 65,
    colors: ["White", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product2.svg",
    images: ["assets/products/product2.svg", "assets/products/product2-back.svg"],
    customizable: true,
    description:
      "The everyday essential. Combed cotton, tag-free neck label and a relaxed regular fit built to layer or wear solo."
  },
  {
    id: 3,
    name: "Minimal Logo Tee",
    category: "Plain",
    type: "plain",
    price: 1399,
    oldPrice: 1599,
    rating: 4.6,
    reviews: 31,
    colors: ["Grey", "Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    image: "assets/products/product3.svg",
    images: ["assets/products/product3.svg", "assets/products/product3-back.svg"],
    customizable: false,
    description: "A small chest-print wordmark on soft 190gsm cotton. Clean, quiet, and built for daily rotation."
  },
  {
    id: 4,
    name: "Urban Graphic Tee",
    category: "DTF Printed",
    type: "dtf",
    price: 1699,
    oldPrice: 1999,
    rating: 4.9,
    reviews: 88,
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product4.svg",
    images: ["assets/products/product4.svg", "assets/products/product4-back.svg"],
    customizable: true,
    description:
      "Full-front DTF street art print with sharp edges and rich saturation that holds up wash after wash."
  },
  {
    id: 5,
    name: "Custom Name T-Shirt",
    category: "Customized",
    type: "customized",
    price: 1599,
    oldPrice: null,
    rating: 4.8,
    reviews: 54,
    colors: ["Black", "White", "Grey"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product5.svg",
    images: ["assets/products/product5.svg", "assets/products/product5-back.svg"],
    customizable: true,
    description: "Add your own name, initials or short text to a premium tee — printed to order, one at a time."
  },
  {
    id: 6,
    name: "DTF Street Art Tee",
    category: "DTF Printed",
    type: "dtf",
    price: 1799,
    oldPrice: 2099,
    rating: 4.7,
    reviews: 39,
    colors: ["Black"],
    sizes: ["M", "L", "XL", "XXL"],
    image: "assets/products/product6.svg",
    images: ["assets/products/product6.svg", "assets/products/product6-back.svg"],
    customizable: true,
    description: "Bold graffiti-inspired artwork rendered in high-density DTF print on a heavyweight base tee."
  },
  {
    id: 7,
    name: "Oversized Vintage Tee",
    category: "Oversized",
    type: "plain",
    price: 1549,
    oldPrice: null,
    rating: 4.5,
    reviews: 22,
    colors: ["Sand", "Grey"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product7.svg",
    images: ["assets/products/product7.svg", "assets/products/product7-back.svg"],
    customizable: true,
    description: "Stonewashed cotton with a lived-in vintage hand-feel and a slightly cropped oversized silhouette."
  },
  {
    id: 8,
    name: "Custom Corporate Shirt",
    category: "Corporate",
    type: "corporate",
    price: 1899,
    oldPrice: null,
    rating: 4.9,
    reviews: 27,
    colors: ["Navy", "Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product8.svg",
    images: ["assets/products/product8.svg", "assets/products/product8-back.svg"],
    customizable: true,
    description: "Logo-printed uniform shirt for teams and organizations, priced better at bulk quantities."
  },
  {
    id: 9,
    name: "Navy Polo Tee",
    category: "Corporate",
    type: "corporate",
    price: 1999,
    oldPrice: 2299,
    rating: 4.6,
    reviews: 18,
    colors: ["Navy", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product9.svg",
    images: ["assets/products/product9.svg", "assets/products/product9-back.svg"],
    customizable: true,
    description: "A structured pique polo suited for staff uniforms and corporate gifting, with logo embroidery option."
  },
  {
    id: 10,
    name: "Red Signature Tee",
    category: "Plain",
    type: "plain",
    price: 1449,
    oldPrice: null,
    rating: 4.7,
    reviews: 46,
    colors: ["Red", "Black"],
    sizes: ["S", "M", "L", "XL"],
    image: "assets/products/product10.svg",
    images: ["assets/products/product10.svg", "assets/products/product10-back.svg"],
    customizable: true,
    description: "Our signature accent colour on a soft-hand cotton tee — a statement piece with a plain, clean cut."
  },
  {
    id: 11,
    name: "Grey Marl Essential Tee",
    category: "Plain",
    type: "plain",
    price: 1349,
    oldPrice: 1499,
    rating: 4.5,
    reviews: 29,
    colors: ["Grey", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product11.svg",
    images: ["assets/products/product11.svg", "assets/products/product11-back.svg"],
    customizable: false,
    description: "Marl-textured cotton blend that keeps its shape wash after wash. A quiet everyday basic."
  },
  {
    id: 12,
    name: "Full Sleeve Layer Tee",
    category: "Plain",
    type: "plain",
    price: 1699,
    oldPrice: null,
    rating: 4.6,
    reviews: 15,
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product12.svg",
    images: ["assets/products/product12.svg", "assets/products/product12-back.svg"],
    customizable: true,
    description: "A full-sleeve layering tee in brushed cotton, built for cooler days and street layering."
  },
  {
    id: 13,
    name: "Charcoal Jogger Pants",
    category: "Trousers",
    type: "trousers",
    price: 1899,
    oldPrice: 2199,
    rating: 4.7,
    reviews: 24,
    colors: ["Charcoal", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product13.svg",
    images: ["assets/products/product13.svg", "assets/products/product13-back.svg"],
    customizable: false,
    description: "Tapered fleece joggers with an elastic drawstring waist and zip side pocket. Pairs naturally with any tee in the range."
  },
  {
    id: 14,
    name: "Corporate Formal Trousers",
    category: "Trousers",
    type: "corporate",
    price: 2299,
    oldPrice: null,
    rating: 4.6,
    reviews: 12,
    colors: ["Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/products/product14.svg",
    images: ["assets/products/product14.svg", "assets/products/product14-back.svg"],
    customizable: false,
    description: "A tailored straight-leg trouser in durable poly-cotton twill, built to pair with our corporate shirts for a complete uniform."
  }
];

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

const COLOR_HEX = {
  Black: "#2B241C",
  White: "#F3ECDD",
  Grey: "#ABA089",
  Navy: "#3C4F63",
  Red: "#B4502F",
  Charcoal: "#4E4433",
  Sand: "#C9BB98"
};

/* =========================================================
   Shared product-card / quick-view rendering
   Used by index.html (featured), shop.html (grid) and search.
   ========================================================= */

function starString(rating) {
  const full = Math.round(rating);
  return "&#9733;".repeat(full) + "&#9734;".repeat(5 - full);
}

function renderProductCard(p) {
  const wishlist = typeof getWishlist === "function" ? getWishlist() : [];
  const isWished = wishlist.includes(p.id);
  return `
  <div class="product-card reveal in" data-id="${p.id}">
    <div class="product-media">
      <a href="product.html?id=${p.id}">
        <img class="img-primary" src="${p.image}" alt="${p.name}">
        <img class="img-secondary" src="${p.images[1] || p.image}" alt="">
      </a>
      <div class="product-badges">
        ${p.oldPrice ? `<span class="tag tag-accent">SALE</span>` : ""}
        ${p.customizable ? `<span class="tag">CUSTOMIZABLE</span>` : ""}
      </div>
      <button class="wish-btn ${isWished ? "active" : ""}" data-wish-btn="${p.id}" aria-label="Toggle wishlist">
        <i class="fa-solid fa-heart"></i>
      </button>
      <button class="btn btn-solid btn-sm quick-view-btn" data-quick-view="${p.id}">Quick View</button>
    </div>
    <div class="product-info">
      <div class="product-cat">${p.category}</div>
      <div class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></div>
      <div class="rating">${starString(p.rating)} <span class="count">(${p.reviews})</span></div>
      <div class="price-row">
        <span class="price">${formatMoney(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatMoney(p.oldPrice)}</span>` : ""}
      </div>
      <div class="swatches">
        ${p.colors.map((c) => `<span class="swatch" style="background:${COLOR_HEX[c] || "#ccc"}" title="${c}"></span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="btn btn-solid btn-sm btn-block" data-add-cart="${p.id}">Add to Cart</button>
        ${p.customizable ? `<a href="customize.html?product=${p.id}" class="btn btn-ghost btn-sm">Customize</a>` : ""}
      </div>
    </div>
  </div>`;
}

function renderProductGrid(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products.length) {
    el.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <i class="fa-solid fa-shirt"></i>
        <h2>No Products Found</h2>
        <p>Try searching for another style.</p>
        <a href="shop.html" class="btn btn-solid">View All Products</a>
      </div>`;
    return;
  }
  el.innerHTML = products.map(renderProductCard).join("");
  wireProductCardEvents(el);
}

function wireProductCardEvents(scope = document) {
  scope.querySelectorAll("[data-add-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = getProductById(btn.dataset.addCart);
      addToCart(p);
    });
  });
  scope.querySelectorAll("[data-wish-btn]").forEach((btn) => {
    btn.addEventListener("click", () => toggleWishlist(Number(btn.dataset.wishBtn)));
  });
  scope.querySelectorAll("[data-quick-view]").forEach((btn) => {
    btn.addEventListener("click", () => openQuickView(Number(btn.dataset.quickView)));
  });
}

/* ---------------- quick view modal ---------------- */
function ensureQuickViewModal() {
  if (document.getElementById("quickViewModal")) return;
  const el = document.createElement("div");
  el.className = "modal-overlay";
  el.id = "quickViewModal";
  el.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" data-modal-close aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <div id="quickViewBody" style="display:grid;grid-template-columns:1fr 1fr;gap:0;"></div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener("click", (e) => {
    if (e.target === el) closeModal("quickViewModal");
  });
  el.querySelector("[data-modal-close]").addEventListener("click", () => closeModal("quickViewModal"));
}

function openQuickView(id) {
  const p = getProductById(id);
  if (!p) return;
  ensureQuickViewModal();
  const body = document.getElementById("quickViewBody");
  body.innerHTML = `
    <div><img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"></div>
    <div style="padding:34px;">
      <div class="product-cat">${p.category}</div>
      <h3 style="text-transform:none;font-family:var(--font-body);font-size:1.3rem;margin:6px 0;">${p.name}</h3>
      <div class="rating">${starString(p.rating)} <span class="count">(${p.reviews})</span></div>
      <div class="price-row" style="margin-top:10px;">
        <span class="price" style="font-size:1.3rem;">${formatMoney(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatMoney(p.oldPrice)}</span>` : ""}
      </div>
      <p class="lede" style="margin:14px 0;">${p.description}</p>
      <div class="field"><label>Size</label>
        <div class="chip-group" id="qvSizes">
          ${p.sizes.map((s, i) => `<button type="button" class="chip ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}
        </div>
      </div>
      <div class="field"><label>Color</label>
        <div class="chip-group" id="qvColors">
          ${p.colors.map((c, i) => `<button type="button" class="chip swatch-chip ${i === 0 ? "selected" : ""}" data-color="${c}"><span class="swatch-dot" style="background:${COLOR_HEX[c] || "#ccc"}"></span>${c}</button>`).join("")}
        </div>
      </div>
      <div class="qty-selector">
        <div class="qty-stepper" id="qvQtyStepper">
          <button type="button" data-qv-qty="-1">&minus;</button><span id="qvQty">1</span><button type="button" data-qv-qty="1">+</button>
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-solid" id="qvAddCart">Add to Cart</button>
        <a href="product.html?id=${p.id}" class="btn btn-ghost">View Full Details</a>
      </div>
    </div>`;

  body.querySelectorAll("#qvSizes .chip").forEach((c) =>
    c.addEventListener("click", () => {
      body.querySelectorAll("#qvSizes .chip").forEach((x) => x.classList.remove("selected"));
      c.classList.add("selected");
    })
  );
  body.querySelectorAll("#qvColors .chip").forEach((c) =>
    c.addEventListener("click", () => {
      body.querySelectorAll("#qvColors .chip").forEach((x) => x.classList.remove("selected"));
      c.classList.add("selected");
    })
  );
  let qty = 1;
  body.querySelectorAll("[data-qv-qty]").forEach((btn) =>
    btn.addEventListener("click", () => {
      qty = Math.max(1, qty + Number(btn.dataset.qvQty));
      body.querySelector("#qvQty").textContent = qty;
    })
  );
  body.querySelector("#qvAddCart").addEventListener("click", () => {
    const size = body.querySelector("#qvSizes .chip.selected").dataset.size;
    const color = body.querySelector("#qvColors .chip.selected").dataset.color;
    addToCart(p, { size, color, qty });
    closeModal("quickViewModal");
  });

  openModal("quickViewModal");
}
