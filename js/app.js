/* =========================================================
   MARKXCOLLECTIONS — app.js
   Global config + shared chrome (header/footer) + utilities
   ========================================================= */

const MARKX_CONFIG = {
  brandName: "MarkxCollections",
  currency: "Rs. ",
  cardDiscount: 0.15,
  deliveryCharges: 200,
  whatsappNumber: "923001234567",
  freeDeliveryOver: 6000
};

const MARKX_KEYS = {
  cart: "markxCart",
  wishlist: "markxWishlist",
  orders: "markxOrders",
  newsletter: "markxNewsletter",
  customer: "markxCustomer",
  customRequests: "markxCustomRequests",
  bulkRequests: "markxBulkRequests"
};

/* ---------------- storage helpers ---------------- */
function storeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function storeSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------- money formatting ---------------- */
function formatMoney(n) {
  return MARKX_CONFIG.currency + Math.round(n).toLocaleString("en-PK");
}

/* ---------------- toast notifications ---------------- */
function ensureToastStack() {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  return stack;
}
function showToast(message, icon) {
  const stack = ensureToastStack();
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${icon ? `<i class="${icon}"></i> ` : ""}${message}`;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  }, 2600);
}

/* ---------------- wishlist ---------------- */
function getWishlist() {
  return storeGet(MARKX_KEYS.wishlist, []);
}
function toggleWishlist(productId) {
  let list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx > -1) {
    list.splice(idx, 1);
    showToast("Removed from wishlist", "fa-solid fa-heart-crack");
  } else {
    list.push(productId);
    showToast("Added to wishlist", "fa-solid fa-heart");
  }
  storeSet(MARKX_KEYS.wishlist, list);
  refreshWishButtons();
  return list;
}
function refreshWishButtons() {
  const list = getWishlist();
  document.querySelectorAll("[data-wish-btn]").forEach((btn) => {
    const id = Number(btn.dataset.wishBtn);
    btn.classList.toggle("active", list.includes(id));
  });
}

/* ---------------- cart badge (definitions live in cart.js, this just paints) ---------------- */
function paintCartCount() {
  const cart = storeGet(MARKX_KEYS.cart, []);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

/* ---------------- header / footer markup ---------------- */
const NAV_LINKS = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "shop.html", label: "Shop", key: "shop" },
  { href: "customize.html", label: "Customized", key: "customize" },
  { href: "shop.html?category=DTF+Printed", label: "DTF Printing", key: "dtf" },
  { href: "bulk-order.html", label: "Bulk Orders", key: "bulk" },
  { href: "about.html", label: "About", key: "about" },
  { href: "contact.html", label: "Contact", key: "contact" }
];

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const active = document.body.dataset.nav || "";

  const navHtml = NAV_LINKS.map(
    (l) => `<a href="${l.href}" class="${l.key === active ? "active" : ""}">${l.label}</a>`
  ).join("");

  mount.innerHTML = `
    <div class="announce" id="announceBar"></div>
    <header class="site-header">
      <div class="container header-row">
        <a href="index.html" class="logo">Markx<span>Collections</span></a>
        <nav class="main-nav" aria-label="Main">${navHtml}</nav>
        <div class="header-actions">
          <button class="icon-btn" id="searchToggle" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
          <a href="cart.html" class="icon-btn" aria-label="Account"><i class="fa-regular fa-user"></i></a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">
            <i class="fa-solid fa-bag-shopping"></i>
            <span class="cart-count" data-cart-count>0</span>
          </a>
          <button class="hamburger" id="hamburgerBtn" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
      <div class="search-panel" id="searchPanel">
        <div class="container">
          <div style="display:flex;align-items:center;gap:14px;">
            <input type="text" id="siteSearchInput" placeholder="Search t-shirts, prints, categories..." />
            <button class="icon-btn" id="searchClose" style="color:var(--bone);font-size:1.2rem;"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>
    </header>
    <div class="mobile-nav" id="mobileNav">
      <div class="mobile-nav-top">
        <span class="logo" style="font-size:1.2rem;">Markx<span>Collections</span></span>
        <button class="icon-btn" id="mobileNavClose" style="color:var(--bone);font-size:1.4rem;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      ${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}
    </div>
  `;
}

const FOOTER_HTML = `
  <div class="container footer-grid">
    <div>
      <a href="index.html" class="logo" style="color:var(--bone);">Markx<span>Collections</span></a>
      <p style="margin-top:14px;font-size:.88rem;color:#B7B0A0;max-width:30ch;">Premium T-shirts. Custom prints. Made for you.</p>
      <div class="footer-social">
        <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
        <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        <a href="#" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
      </div>
    </div>
    <div>
      <h4>Shop</h4>
      <a href="shop.html">All Products</a>
      <a href="shop.html?category=Plain">Plain T-Shirts</a>
      <a href="shop.html?category=DTF+Printed">DTF Printed</a>
      <a href="shop.html?category=Customized">Customized</a>
      <a href="shop.html?category=Trousers">Trousers</a>
      <a href="bulk-order.html">Bulk Orders</a>
    </div>
    <div>
      <h4>Customer Care</h4>
      <a href="contact.html">Contact</a>
      <a href="about.html#shipping">Shipping</a>
      <a href="about.html#returns">Returns</a>
      <a href="contact.html#faq">FAQs</a>
      <a href="product.html#size-guide">Size Guide</a>
      <a href="admin-login.html">Admin Login</a>
    </div>
    <div>
      <h4>Follow Us</h4>
      <a href="#">Facebook</a>
      <a href="#">Instagram</a>
      <a href="#">TikTok</a>
      <a href="#">YouTube</a>
      <a href="#">WhatsApp</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; 2026 MarkxCollections. All Rights Reserved.</span>
    <span>Karachi · Lahore · Islamabad</span>
  </div>
`;

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.innerHTML = `<footer class="site-footer">${FOOTER_HTML}</footer>
  <a class="wa-float" id="waFloat" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
  </a>`;
  const wa = document.getElementById("waFloat");
  const msg = encodeURIComponent("Hello MarkxCollections, I want to know about your T-shirts.");
  wa.href = `https://wa.me/${MARKX_CONFIG.whatsappNumber}?text=${msg}`;
}

/* ---------------- announcement bar rotator ---------------- */
const ANNOUNCEMENTS = [
  "\uD83D\uDD25 GET 15% OFF — PAY BY CARD",
  "\uD83D\uDE9A Cash on Delivery Available",
  "\uD83D\uDC55 Single Piece Orders Available",
  "\uD83D\uDCE6 Bulk Orders Welcome",
  "\uD83C\uDFA8 Customize Your Own T-Shirt",
  "\uD83C\uDFE2 Organization & Corporate Orders Available"
];
function startAnnouncementBar() {
  const bar = document.getElementById("announceBar");
  if (!bar) return;
  let i = 0;
  const paint = () => {
    bar.innerHTML = `<span>${ANNOUNCEMENTS[i]}</span>`;
    i = (i + 1) % ANNOUNCEMENTS.length;
  };
  paint();
  setInterval(paint, 3200);
}

/* ---------------- header interactions ---------------- */
function wireHeaderInteractions() {
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("siteSearchInput");
  const searchResults = document.getElementById("searchResults");

  const openSearch = () => {
    searchPanel.classList.add("open");
    setTimeout(() => searchInput.focus(), 80);
  };
  const closeSearch = () => {
    searchPanel.classList.remove("open");
    searchResults.innerHTML = "";
    searchInput.value = "";
  };
  searchToggle?.addEventListener("click", () => {
    searchPanel.classList.contains("open") ? closeSearch() : openSearch();
  });
  searchClose?.addEventListener("click", closeSearch);

  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q || typeof PRODUCTS === "undefined") {
      searchResults.innerHTML = "";
      return;
    }
    const hits = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!hits.length) {
      searchResults.innerHTML = `<p style="color:#B7B0A0;padding:14px 0;">No products found for "${q}".</p>`;
      return;
    }
    searchResults.innerHTML = hits
      .map(
        (p) => `
      <a class="search-hit" href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <div style="font-weight:600;">${p.name}</div>
          <div style="font-size:.78rem;color:#B7B0A0;">${p.category} &middot; ${formatMoney(p.price)}</div>
        </div>
      </a>`
      )
      .join("");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });

  // mobile nav
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavClose = document.getElementById("mobileNavClose");
  hamburger?.addEventListener("click", () => mobileNav.classList.add("open"));
  mobileNavClose?.addEventListener("click", () => mobileNav.classList.remove("open"));
  mobileNav?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mobileNav.classList.remove("open"))
  );
}

/* ---------------- scroll reveal ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------------- newsletter (shared component) ---------------- */
function wireNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const note = form.parentElement.querySelector(".note") || form.nextElementSibling;
      const email = input.value.trim();
      if (!email) return;
      const list = storeGet(MARKX_KEYS.newsletter, []);
      if (!list.includes(email)) list.push(email);
      storeSet(MARKX_KEYS.newsletter, list);
      if (note) note.textContent = "You're subscribed!";
      showToast("Successfully subscribed", "fa-solid fa-envelope-circle-check");
      input.value = "";
    });
  });
}

/* ---------------- modal helpers ---------------- */
function openModal(id) {
  document.getElementById(id)?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
  document.body.style.overflow = "";
}
function wireModalDismiss() {
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
    overlay.querySelectorAll("[data-modal-close]").forEach((btn) =>
      btn.addEventListener("click", () => closeModal(overlay.id))
    );
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach((o) => closeModal(o.id));
    }
  });
}

/* ---------------- init on every page ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  startAnnouncementBar();
  wireHeaderInteractions();
  paintCartCount();
  refreshWishButtons();
  wireNewsletterForms();
  wireModalDismiss();
  setTimeout(initScrollReveal, 30);
});
