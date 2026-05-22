// =====================
//  TECHPICK — SHARED JS
//  Runs on every page
// =====================

// --- Format price to Indian style ---
function formatPrice(price) {
  if (price >= 100000) return "₹" + (price / 100000).toFixed(1) + "L";
  if (price >= 1000)   return "₹" + Math.round(price / 1000) + "K";
  return "₹" + price;
}

// --- Show a toast notification ---
function showToast(msg) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// --- Get saved items from localStorage ---
function getSaved() {
  return JSON.parse(localStorage.getItem("tp_saved") || "[]");
}

// --- Save items to localStorage ---
function setSaved(arr) {
  localStorage.setItem("tp_saved", JSON.stringify(arr));
}

// --- Toggle save a product by id ---
function toggleSave(id) {
  const saved = getSaved();
  const idx = saved.indexOf(id);
  if (idx > -1) {
    saved.splice(idx, 1);
    showToast("Removed from saved");
  } else {
    saved.push(id);
    showToast("Saved! 🔖");
  }
  setSaved(saved);
  updateSavedBadge();
  return saved;
}

// --- Update the saved count badge in navbar ---
function updateSavedBadge() {
  const badge = document.getElementById("savedBadge");
  if (badge) {
    const count = getSaved().length;
    badge.textContent = count;
    badge.style.display = count === 0 ? "none" : "inline";
  }
}

// --- Build stars string ---
function buildStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "");
}

// --- Build a product card HTML string ---
function buildProductCard(p, delay = 0) {
  const isSaved = getSaved().includes(p.id);
  return `
    <div class="product-card" style="animation-delay:${delay}s">
      <div class="product-card-img">
        ${p.emoji}
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
      </div>
      <div class="product-card-body">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-rating">
          <span class="stars">${buildStars(p.rating)}</span>
          <span class="rating-val">${p.rating}</span>
          <span class="rating-count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">${formatPrice(p.price)}</div>
          <button class="save-btn ${isSaved ? "saved" : ""}" onclick="handleSave(${p.id}, this)">🔖</button>
        </div>
      </div>
    </div>
  `;
}

// --- Handle save button click ---
function handleSave(id, btn) {
  const saved = toggleSave(id);
  btn.classList.toggle("saved", saved.includes(id));
}

// --- Hamburger menu toggle ---
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.toggle("open");
}

// --- Apply dark mode on every page load ---
function applyDarkModeOnLoad() {
  if (localStorage.getItem("tp_darkmode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

// --- Single DOMContentLoaded for shared tasks ---
document.addEventListener("DOMContentLoaded", () => {
  updateSavedBadge();
  applyDarkModeOnLoad();
});