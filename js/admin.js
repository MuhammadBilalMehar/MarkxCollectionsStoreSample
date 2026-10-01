/* =========================================================
   MARKXCOLLECTIONS — admin.js
   Frontend-only demo admin panel. Reads/writes the SAME
   localStorage keys the storefront already uses — no backend,
   no database. Placing a real order on the site will make it
   show up here immediately.
   ========================================================= */

const ADMIN_CREDENTIALS = { email: "admin@markxcollections.pk", password: "admin123" };
const ADMIN_AUTH_KEY = "markxAdminAuth";

const ADMIN_KEYS = {
  orders: "markxOrders",
  newsletter: "markxNewsletter",
  customRequests: "markxCustomRequests",
  bulkRequests: "markxBulkRequests"
};

function adminStoreGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function adminStoreSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function adminFormatMoney(n) {
  return "Rs. " + Math.round(n).toLocaleString("en-PK");
}
function adminFormatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" });
  } catch (e) {
    return iso;
  }
}

/* ---------------- login page ---------------- */
function initAdminLoginPage() {
  const form = document.getElementById("adminLoginForm");
  if (!form) return;

  // already signed in? skip straight to dashboard
  if (sessionStorage.getItem(ADMIN_AUTH_KEY) === "1") {
    window.location.href = "admin-dashboard.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const errorEl = document.getElementById("adminLoginError");

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
      window.location.href = "admin-dashboard.html";
    } else {
      errorEl.textContent = "Incorrect email or password. Try the demo credentials shown above.";
    }
  });
}

/* ---------------- dashboard page ---------------- */
function requireAdminAuth() {
  if (sessionStorage.getItem(ADMIN_AUTH_KEY) !== "1") {
    window.location.href = "admin-login.html";
    return false;
  }
  return true;
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  window.location.href = "admin-login.html";
}

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function getOrders() {
  const orders = adminStoreGet(ADMIN_KEYS.orders, []);
  let changed = false;
  orders.forEach((o) => {
    if (!o.status) {
      o.status = "Pending";
      changed = true;
    }
  });
  if (changed) adminStoreSet(ADMIN_KEYS.orders, orders);
  return orders;
}

function renderOverview() {
  const orders = getOrders();
  const customReqs = adminStoreGet(ADMIN_KEYS.customRequests, []);
  const bulkReqs = adminStoreGet(ADMIN_KEYS.bulkRequests, []);
  const subs = adminStoreGet(ADMIN_KEYS.newsletter, []);

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const cardOrders = orders.filter((o) => o.paymentMethod === "card").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: "fa-bag-shopping" },
    { label: "Total Revenue", value: adminFormatMoney(revenue), icon: "fa-sack-dollar" },
    { label: "Pending Orders", value: pending, icon: "fa-hourglass-half" },
    { label: "Card Payments", value: cardOrders, icon: "fa-credit-card" },
    { label: "Custom Requests", value: customReqs.length, icon: "fa-palette" },
    { label: "Bulk Quote Requests", value: bulkReqs.length, icon: "fa-people-group" },
    { label: "Newsletter Subscribers", value: subs.length, icon: "fa-envelope" }
  ];

  document.getElementById("adminStats").innerHTML = stats
    .map(
      (s) => `
    <div class="admin-stat-card">
      <i class="fa-solid ${s.icon}"></i>
      <div class="admin-stat-value">${s.value}</div>
      <div class="admin-stat-label">${s.label}</div>
    </div>`
    )
    .join("");
}

function renderOrdersTable() {
  const orders = getOrders().slice().reverse();
  const tbody = document.getElementById("ordersTbody");
  const empty = document.getElementById("ordersEmpty");
  if (!orders.length) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  tbody.innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td><strong>${o.orderNumber}</strong></td>
      <td>${adminFormatDate(o.date)}</td>
      <td>${o.customer.name}<br><span class="admin-sub">${o.customer.phone}</span></td>
      <td>${o.paymentMethod === "card" ? "Card (15% off)" : "COD"}</td>
      <td>${o.items.length} item${o.items.length === 1 ? "" : "s"}</td>
      <td><strong>${adminFormatMoney(o.total)}</strong></td>
      <td>
        <select class="admin-status-select" data-order="${o.orderNumber}">
          ${ORDER_STATUSES.map((s) => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td><button class="btn btn-ghost btn-sm" data-view-order="${o.orderNumber}">View</button></td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll(".admin-status-select").forEach((sel) => {
    sel.addEventListener("change", () => {
      const orders = getOrders();
      const order = orders.find((o) => o.orderNumber === sel.dataset.order);
      if (order) {
        order.status = sel.value;
        adminStoreSet(ADMIN_KEYS.orders, orders);
        renderOverview();
      }
    });
  });
  tbody.querySelectorAll("[data-view-order]").forEach((btn) => {
    btn.addEventListener("click", () => openOrderModal(btn.dataset.viewOrder));
  });
}

function openOrderModal(orderNumber) {
  const order = getOrders().find((o) => o.orderNumber === orderNumber);
  if (!order) return;
  const body = document.getElementById("orderModalBody");
  body.innerHTML = `
    <div class="admin-modal-head">
      <div>
        <h3 style="font-size:1.3rem;">${order.orderNumber}</h3>
        <p style="color:#8a8268;font-size:.85rem;margin-top:4px;">${adminFormatDate(order.date)} &middot; ${order.paymentMethod === "card" ? "Card Payment (15% discount)" : "Cash on Delivery"}</p>
      </div>
      <span class="tag ${order.status === "Delivered" ? "tag-accent" : ""}">${order.status}</span>
    </div>
    <div class="form-grid" style="margin:20px 0;">
      <div>
        <h4 class="admin-block-title">Customer</h4>
        <p style="font-size:.9rem;">${order.customer.name}<br>${order.customer.phone}${order.customer.email ? "<br>" + order.customer.email : ""}</p>
      </div>
      <div>
        <h4 class="admin-block-title">Delivery Address</h4>
        <p style="font-size:.9rem;">${order.customer.address}<br>${order.customer.city} ${order.customer.postalCode || ""}</p>
      </div>
    </div>
    ${order.customer.notes ? `<p style="font-size:.85rem;color:#58503F;margin-bottom:16px;"><strong>Notes:</strong> ${order.customer.notes}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead><tr><th style="text-align:left;padding:8px 4px;border-bottom:1px solid var(--line);font-size:.8rem;">Item</th><th style="text-align:left;padding:8px 4px;border-bottom:1px solid var(--line);font-size:.8rem;">Qty</th><th style="text-align:left;padding:8px 4px;border-bottom:1px solid var(--line);font-size:.8rem;">Total</th></tr></thead>
      <tbody>
        ${order.items.map((i) => `<tr><td style="padding:8px 4px;border-bottom:1px solid var(--line);font-size:.85rem;">${i.name} (${i.size}/${i.color})</td><td style="padding:8px 4px;border-bottom:1px solid var(--line);font-size:.85rem;">${i.qty}</td><td style="padding:8px 4px;border-bottom:1px solid var(--line);font-size:.85rem;">${adminFormatMoney(i.price * i.qty)}</td></tr>`).join("")}
      </tbody>
    </table>
    <div style="max-width:260px;margin-left:auto;">
      <div class="sum-row"><span>Subtotal</span><span>${adminFormatMoney(order.subtotal)}</span></div>
      ${order.discount > 0 ? `<div class="sum-row discount"><span>Discount</span><span>-${adminFormatMoney(order.discount)}</span></div>` : ""}
      <div class="sum-row"><span>Delivery</span><span>${order.delivery === 0 ? "FREE" : adminFormatMoney(order.delivery)}</span></div>
      <div class="sum-row total"><span>Total</span><span>${adminFormatMoney(order.total)}</span></div>
    </div>
  `;
  openModal("orderDetailModal");
}

function renderCustomTable() {
  const list = adminStoreGet(ADMIN_KEYS.customRequests, []).slice().reverse();
  const tbody = document.getElementById("customTbody");
  const empty = document.getElementById("customEmpty");
  if (!list.length) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  tbody.innerHTML = list
    .map(
      (r) => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${adminFormatDate(r.date)}</td>
      <td>${r.contactName}<br><span class="admin-sub">${r.contactPhone}</span></td>
      <td>${r.tshirt}</td>
      <td>${r.color}</td>
      <td>${r.printing}</td>
      <td>${r.size}</td>
      <td>${r.quantity}</td>
      <td><button class="btn btn-ghost btn-sm" data-view-custom="${r.id}">View</button></td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll("[data-view-custom]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = list.find((x) => x.id === btn.dataset.viewCustom);
      const body = document.getElementById("customModalBody");
      body.innerHTML = `
        <h3 style="font-size:1.2rem;margin-bottom:14px;">${r.id}</h3>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Contact:</strong> ${r.contactName} &middot; ${r.contactPhone}</p>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Style:</strong> ${r.tshirt} &middot; ${r.color} &middot; Size ${r.size} &middot; Qty ${r.quantity}</p>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Printing:</strong> ${r.printing}</p>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Custom text:</strong> ${r.text || "—"}</p>
        <p style="font-size:.9rem;margin-bottom:14px;"><strong>Notes:</strong> ${r.notes || "—"}</p>
        ${r.imageDataUrl ? `<img src="${r.imageDataUrl}" alt="Uploaded design" style="max-width:220px;border:1px solid var(--line);border-radius:var(--radius-tag);">` : `<p style="font-size:.82rem;color:#8a8268;">No design file uploaded.</p>`}
      `;
      openModal("customDetailModal");
    });
  });
}

function renderBulkTable() {
  const list = adminStoreGet(ADMIN_KEYS.bulkRequests, []).slice().reverse();
  const tbody = document.getElementById("bulkTbody");
  const empty = document.getElementById("bulkEmpty");
  if (!list.length) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  tbody.innerHTML = list
    .map(
      (r) => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${adminFormatDate(r.date)}</td>
      <td>${r.organization}<br><span class="admin-sub">${r.orderType}</span></td>
      <td>${r.contactPerson}<br><span class="admin-sub">${r.phone}</span></td>
      <td>${r.tshirtType}</td>
      <td>${r.printing}</td>
      <td>${r.quantity}</td>
      <td><button class="btn btn-ghost btn-sm" data-view-bulk="${r.id}">View</button></td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll("[data-view-bulk]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = list.find((x) => x.id === btn.dataset.viewBulk);
      const body = document.getElementById("bulkModalBody");
      body.innerHTML = `
        <h3 style="font-size:1.2rem;margin-bottom:14px;">${r.id}</h3>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Organization:</strong> ${r.organization} (${r.orderType})</p>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Contact:</strong> ${r.contactPerson} &middot; ${r.phone} &middot; ${r.email}</p>
        <p style="font-size:.9rem;margin-bottom:6px;"><strong>Order:</strong> ${r.tshirtType} &middot; ${r.printing} &middot; Qty ${r.quantity}</p>
        <p style="font-size:.9rem;margin-bottom:14px;"><strong>Requirements:</strong> ${r.requirements || "—"}</p>
        ${r.hasUpload ? `<p style="font-size:.82rem;color:#8a8268;">Logo file was attached to this request.</p>` : ""}
      `;
      openModal("bulkDetailModal");
    });
  });
}

function renderNewsletterList() {
  const subs = adminStoreGet(ADMIN_KEYS.newsletter, []).slice().reverse();
  const wrap = document.getElementById("newsletterList");
  const empty = document.getElementById("newsletterEmpty");
  if (!subs.length) {
    wrap.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  wrap.innerHTML = subs.map((email) => `<div class="admin-chip">${email}</div>`).join("");
}

function wireAdminTabs() {
  document.querySelectorAll("[data-admin-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-tab]").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll("[data-admin-panel]").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`[data-admin-panel="${btn.dataset.adminTab}"]`).classList.add("active");
    });
  });
}

function wireResetDemoData() {
  document.getElementById("resetDemoBtn")?.addEventListener("click", () => {
    if (!confirm("This clears all demo orders, requests and subscribers stored in this browser. Continue?")) return;
    [ADMIN_KEYS.orders, ADMIN_KEYS.newsletter, ADMIN_KEYS.customRequests, ADMIN_KEYS.bulkRequests].forEach((k) =>
      localStorage.removeItem(k)
    );
    renderOverview();
    renderOrdersTable();
    renderCustomTable();
    renderBulkTable();
    renderNewsletterList();
  });
}

function initAdminDashboard() {
  const root = document.getElementById("adminStats");
  if (!root) return;
  if (!requireAdminAuth()) return;

  document.getElementById("adminLogoutBtn")?.addEventListener("click", adminLogout);
  wireAdminTabs();
  wireResetDemoData();

  renderOverview();
  renderOrdersTable();
  renderCustomTable();
  renderBulkTable();
  renderNewsletterList();

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
    overlay.querySelectorAll("[data-modal-close]").forEach((b) => b.addEventListener("click", () => closeModal(overlay.id)));
  });
}

function openModal(id) {
  document.getElementById(id)?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLoginPage();
  initAdminDashboard();
});
