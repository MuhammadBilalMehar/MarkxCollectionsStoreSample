/* =========================================================
   MARKXCOLLECTIONS — shop.js
   ========================================================= */

const shopState = {
  category: "All",
  sizes: [],
  colors: [],
  maxPrice: 2500,
  sort: "featured",
  query: ""
};

function applyShopFilters() {
  let list = PRODUCTS.slice();

  if (shopState.query) {
    const q = shopState.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (shopState.category !== "All") {
    list = list.filter((p) => p.category === shopState.category);
  }
  if (shopState.sizes.length) {
    list = list.filter((p) => p.sizes.some((s) => shopState.sizes.includes(s)));
  }
  if (shopState.colors.length) {
    list = list.filter((p) => p.colors.some((c) => shopState.colors.includes(c)));
  }
  list = list.filter((p) => p.price <= shopState.maxPrice);

  switch (shopState.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      list.sort((a, b) => b.id - a.id);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break; // featured = catalog order
  }

  renderProductGrid("shopGrid", list);
  const countEl = document.getElementById("shopCount");
  if (countEl) countEl.textContent = `Showing ${list.length} product${list.length === 1 ? "" : "s"}`;
}

function initShopPage() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("category")) shopState.category = params.get("category");
  if (params.get("q")) shopState.query = params.get("q");

  // category filter radios
  document.querySelectorAll("[data-filter-category]").forEach((input) => {
    if (input.value === shopState.category) input.checked = true;
    input.addEventListener("change", () => {
      shopState.category = input.value;
      applyShopFilters();
    });
  });

  // size checkboxes
  document.querySelectorAll("[data-filter-size]").forEach((input) => {
    input.addEventListener("change", () => {
      shopState.sizes = Array.from(document.querySelectorAll("[data-filter-size]:checked")).map((i) => i.value);
      applyShopFilters();
    });
  });

  // color checkboxes
  document.querySelectorAll("[data-filter-color]").forEach((input) => {
    input.addEventListener("change", () => {
      shopState.colors = Array.from(document.querySelectorAll("[data-filter-color]:checked")).map((i) => i.value);
      applyShopFilters();
    });
  });

  // price range
  const priceRange = document.getElementById("priceRange");
  if (priceRange) {
    priceRange.value = shopState.maxPrice;
    document.getElementById("priceRangeVal").textContent = formatMoney(shopState.maxPrice);
    priceRange.addEventListener("input", () => {
      shopState.maxPrice = Number(priceRange.value);
      document.getElementById("priceRangeVal").textContent = formatMoney(shopState.maxPrice);
      applyShopFilters();
    });
  }

  // sort
  const sortSelect = document.getElementById("sortSelect");
  sortSelect?.addEventListener("change", () => {
    shopState.sort = sortSelect.value;
    applyShopFilters();
  });

  // on-page search box (optional)
  const shopSearch = document.getElementById("shopSearchInput");
  if (shopSearch) {
    shopSearch.value = shopState.query;
    shopSearch.addEventListener("input", () => {
      shopState.query = shopSearch.value.trim();
      applyShopFilters();
    });
  }

  // mobile filter drawer
  const drawerBtn = document.getElementById("filterDrawerBtn");
  const drawer = document.getElementById("filterDrawer");
  const drawerClose = document.getElementById("filterDrawerClose");
  drawerBtn?.addEventListener("click", () => drawer.classList.add("open-drawer"));
  drawerClose?.addEventListener("click", () => drawer.classList.remove("open-drawer"));

  applyShopFilters();
}

document.addEventListener("DOMContentLoaded", initShopPage);
