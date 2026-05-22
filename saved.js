// ========================
//  SAVED DEVICES PAGE — saved.js
// ========================

let savedView       = "grid";   // "grid" | "list"
let savedCatFilter  = "all";
let savedCompareIds = [];

// ========================
//  INIT
// ========================
document.addEventListener("DOMContentLoaded", () => {
  updateSavedBadge();
  setupCatFilterChips();
  renderSavedPage();
});

// ========================
//  CATEGORY FILTER CHIPS
// ========================
function setupCatFilterChips() {
  document.getElementById("savedCatFilter").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#savedCatFilter .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    savedCatFilter = chip.dataset.cat;
    savedCompareIds = [];
    renderSavedPage();
  });
}

// ========================
//  MAIN RENDER
// ========================
function renderSavedPage() {
  const savedIds = getSaved();
  const grid     = document.getElementById("savedGrid");
  const emptyEl  = document.getElementById("savedEmpty");
  const sort     = document.getElementById("savedSort").value;

  // Update header stats regardless of filter
  updateHeaderStats(savedIds);

  if (savedIds.length === 0) {
    grid.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  // Filter
  let list = products.filter(p => savedIds.includes(p.id));
  if (savedCatFilter !== "all") {
    list = list.filter(p => p.category === savedCatFilter);
  }

  // Sort
  if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "rating")     list.sort((a, b) => b.rating - a.rating);
  if (sort === "name")       list.sort((a, b) => a.name.localeCompare(b.name));
  // "saved" keeps insertion order (already filtered from savedIds order)

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">🔍</div>
      <p>No saved devices in this category.</p>
    </div>`;
    return;
  }

  // Apply view class
  grid.className = savedView === "list" ? "saved-grid list-view" : "saved-grid";

  grid.innerHTML = list.map((p, i) => buildSavedCard(p, i)).join("");
}

// ========================
//  BUILD CARD HTML
// ========================
function buildSavedCard(p, index) {
  const isPicked  = savedCompareIds.includes(p.id);
  const stars     = "★".repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? "½" : "");

  return `
    <div class="saved-card ${isPicked ? "compare-picked" : ""}"
         style="animation-delay:${index * 0.04}s"
         onclick="openSavedDetail(${p.id})">

      <!-- Compare toggle checkbox -->
      <div class="saved-card-check"
           onclick="event.stopPropagation(); toggleSavedCompare(${p.id})"
           title="Add to compare">
        ${isPicked ? "✓" : ""}
      </div>

      <div class="saved-card-img">
  <img src="${p.image}" alt="${p.name}" style="width:80px;height:80px;object-fit:contain;"/>
  ${p.badge ? `<div class="saved-card-badge">${p.badge}</div>` : ""}
</div>

      <div class="saved-card-body">
        <div class="saved-card-brand">${p.brand}</div>
        <div class="saved-card-name">${p.name}</div>
        <div class="saved-card-desc">${p.desc}</div>
        <div class="saved-card-rating">
          <span style="color:#f0a500;font-size:0.78rem">${stars}</span>
          <span style="font-weight:600">${p.rating}</span>
          <span style="color:var(--text-muted)">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="saved-card-footer">
          <div class="saved-card-price">${formatPrice(p.price)}</div>
          <button class="saved-card-remove"
                  onclick="event.stopPropagation(); removeSavedDevice(${p.id})"
                  title="Remove from saved">✕</button>
        </div>
      </div>
    </div>
  `;
}

// ========================
//  HEADER STATS
// ========================
function updateHeaderStats(savedIds) {
  const list = products.filter(p => savedIds.includes(p.id));
  document.getElementById("hdStatCount").textContent = list.length;
  if (list.length === 0) {
    document.getElementById("hdStatTotal").textContent = "₹0";
    document.getElementById("hdStatAvg").textContent   = "₹0";
    return;
  }
  const total = list.reduce((s, p) => s + p.price, 0);
  document.getElementById("hdStatTotal").textContent = formatPrice(total);
  document.getElementById("hdStatAvg").textContent   = formatPrice(Math.round(total / list.length));
}

// ========================
//  REMOVE DEVICE
// ========================
function removeSavedDevice(id) {
  toggleSave(id); // shared.js
  // also remove from compare if selected
  savedCompareIds = savedCompareIds.filter(x => x !== id);
  updateCompareBar();
  renderSavedPage();
}

// ========================
//  CLEAR ALL
// ========================
function clearAllSavedPage() {
  const saved = getSaved();
  if (saved.length === 0) { showToast("Nothing to clear!"); return; }
  if (!confirm("Remove all saved devices?")) return;
  setSaved([]);
  savedCompareIds = [];
  updateSavedBadge();
  updateCompareBar();
  renderSavedPage();
  showToast("All saved devices cleared");
}

// ========================
//  VIEW TOGGLE
// ========================
function setView(v) {
  savedView = v;
  document.getElementById("viewGrid").classList.toggle("active", v === "grid");
  document.getElementById("viewList").classList.toggle("active", v === "list");
  renderSavedPage();
}

// ========================
//  COMPARE
// ========================
function toggleSavedCompare(id) {
  const idx = savedCompareIds.indexOf(id);
  if (idx > -1) {
    savedCompareIds.splice(idx, 1);
  } else {
    if (savedCompareIds.length >= 2) {
      showToast("You can only compare 2 devices at a time");
      return;
    }
    savedCompareIds.push(id);
  }
  updateCompareBar();
  renderSavedPage();
}

function updateCompareBar() {
  const bar  = document.getElementById("savedCompareBar");
  const text = document.getElementById("savedCompareText");
if (savedCompareIds.length === 0) {
  bar.style.display = "none";
} else {
  bar.style.display = "flex";

  if (savedCompareIds.length === 1) {
    text.textContent = "1 device selected — select one more";
  } else {
    text.textContent = "2 devices selected — ready to compare";
  }
}
}

function clearSavedCompare() {
  savedCompareIds = [];
  updateCompareBar();
  renderSavedPage();
}

function openSavedCompare() {
  if (savedCompareIds.length < 2) { showToast("Select 2 devices first"); return; }
  const p1 = products.find(p => p.id === savedCompareIds[0]);
  const p2 = products.find(p => p.id === savedCompareIds[1]);

  const rows = [
    ["Device", p1.name,  p2.name],
    ["Brand",     p1.brand,                    p2.brand],
    ["Category",  p1.category,                 p2.category],
    ["Price",     formatPrice(p1.price),        formatPrice(p2.price)],
    ["Rating",    `⭐ ${p1.rating}`,           `⭐ ${p2.rating}`],
    ["Reviews",   p1.reviews.toLocaleString(),  p2.reviews.toLocaleString()],
    ["Badge",     p1.badge || "—",             p2.badge || "—"],
  ];

  let html = `<thead><tr><th></th><th>${p1.name}</th><th>${p2.name}</th></tr></thead><tbody>`;
  rows.forEach(([label, v1, v2]) => {
    let c1 = "", c2 = "";
    if (label === "Price")  { if (p1.price < p2.price) c1="better"; else if (p2.price < p1.price) c2="better"; }
    if (label === "Rating") { if (p1.rating > p2.rating) c1="better"; else if (p2.rating > p1.rating) c2="better"; }
    html += `<tr><td class="row-label">${label}</td><td class="${c1}">${v1}</td><td class="${c2}">${v2}</td></tr>`;
  });
  html += "</tbody>";

  document.getElementById("savedCompareTable").innerHTML = html;
  const modal = document.getElementById("savedCompareModal");
modal.classList.add("open");
document.body.style.overflow = "hidden";
}

function closeSavedCompare() {
  document.getElementById("savedCompareModal").classList.remove("open");
  document.body.style.overflow = "";
}

// ========================
//  DETAIL MODAL
// ========================
function openSavedDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const stars = "★".repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? "½" : "");

  document.getElementById("savedDetailBody").innerHTML = `
    <img src="${p.image}" alt="${p.name}" 
         style="width:130px;height:130px;object-fit:contain;margin:0 auto 1.25rem;display:block;
                background:var(--surface2);border-radius:16px;padding:0.75rem;"/>
    
    <div style="text-align:center;margin-bottom:1.25rem">
      <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                  color:var(--accent);margin-bottom:0.3rem">${p.brand} · ${p.category}</div>
      <div style="font-family:var(--font-head);font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">${p.name}</div>
      <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.5">${p.desc}</div>
    </div>

    <div style="display:flex;justify-content:center;align-items:center;gap:1.5rem;
                background:var(--surface2);border-radius:12px;padding:1rem;margin-bottom:1.25rem">
      <div style="text-align:center">
        <div style="font-family:var(--font-head);font-size:1.2rem;font-weight:700">${formatPrice(p.price)}</div>
        <div style="font-size:0.68rem;color:var(--text-muted)">Price</div>
      </div>
      <div style="width:1px;height:32px;background:var(--border)"></div>
      <div style="text-align:center">
        <div style="font-size:1.2rem;font-weight:700">⭐ ${p.rating}</div>
        <div style="font-size:0.68rem;color:var(--text-muted)">${p.reviews.toLocaleString()} reviews</div>
      </div>
      ${p.badge ? `
      <div style="width:1px;height:32px;background:var(--border)"></div>
      <div style="text-align:center">
        <div style="background:var(--accent);color:#fff;font-size:0.65rem;font-weight:700;
                    padding:0.25rem 0.6rem;border-radius:6px;text-transform:uppercase">${p.badge}</div>
        <div style="font-size:0.68rem;color:var(--text-muted);margin-top:0.3rem">Badge</div>
      </div>` : ""}
    </div>
<div id="priceBreakdown_${p.id}" style="display:none;margin-bottom:1.25rem;
     background:var(--surface2);border-radius:12px;padding:1rem">
  <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;
              letter-spacing:0.8px;color:var(--text-muted);margin-bottom:0.75rem">💳 Price Breakdown</div>
  <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.85rem">
    <div style="display:flex;justify-content:space-between">
      <span style="color:var(--text-muted)">Base Price</span>
      <span style="font-weight:600">${formatPrice(p.price)}</span>
    </div>
    <div style="display:flex;justify-content:space-between">
      <span style="color:var(--text-muted)">GST (18%)</span>
      <span style="font-weight:600">${formatPrice(Math.round(p.price * 0.18))}</span>
    </div>
    <div style="height:1px;background:var(--border);margin:0.25rem 0"></div>
    <div style="display:flex;justify-content:space-between">
      <span style="font-weight:700">Total</span>
      <span style="font-weight:700;color:var(--accent)">${formatPrice(Math.round(p.price * 1.18))}</span>
    </div>
    <div style="height:1px;background:var(--border);margin:0.25rem 0"></div>
    <div style="display:flex;justify-content:space-between">
      <span style="color:var(--text-muted)">EMI (6 months)</span>
      <span style="font-weight:600">${formatPrice(Math.round(p.price * 1.18 / 6))}/mo</span>
    </div>
    <div style="display:flex;justify-content:space-between">
      <span style="color:var(--text-muted)">EMI (12 months)</span>
      <span style="font-weight:600">${formatPrice(Math.round(p.price * 1.18 / 12))}/mo</span>
    </div>
    <div style="display:flex;justify-content:space-between">
      <span style="color:var(--text-muted)">EMI (24 months)</span>
      <span style="font-weight:600">${formatPrice(Math.round(p.price * 1.18 / 24))}/mo</span>
    </div>
  </div>
</div>
    <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
      <a href="finder.html?cat=${p.category}" class="btn-dark" style="text-decoration:none">🔍 Find Similar</a>
      <button class="btn-outline" onclick="togglePriceBreakdown(${p.id})">📊 Price Breakdown</button>
      <button class="btn-outline" onclick="removeSavedDevice(${p.id}); document.getElementById('savedDetailModal').style.display='none'"
              style="border-color:#dc2626;color:#dc2626">🗑️ Remove</button>
    </div>
  `;

  document.getElementById("savedDetailModal").style.display = "flex";
}

function togglePriceBreakdown(id) {
  const el = document.getElementById(`priceBreakdown_${id}`);
  if (!el) return;
  el.style.display = el.style.display === "none" ? "block" : "none";
}

function closeSavedDetail(e) {
  if (e.target === document.getElementById("savedDetailModal")) {
    document.getElementById("savedDetailModal").style.display = "none";
  }
}