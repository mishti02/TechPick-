// ================================
//  FINDER PAGE — finder.js
//  Uses: fetch(), Promises, .then(),
//  .catch(), async/await
//
//  API: Wikipedia REST API 
//  Docs: https://en.wikipedia.org/api/rest_v1/
// ================================

// Current filter state
let finderState = {
  category: "laptop",
  budget: 100000,
  brand: "all",
  ram: "any",
  storage: "any",
  cpu: "any",
  fiveG: false,
  camera: "any"
};

// Config options per category
const configOptions = {
  laptop: `
    <div class="config-row">
      <select class="config-select" id="cfgRam" onchange="finderState.ram=this.value">
        <option value="any">Any RAM</option>
        <option value="4">4GB RAM</option>
        <option value="8">8GB RAM</option>
        <option value="16">16GB RAM</option>
        <option value="32">32GB RAM</option>
      </select>
      <select class="config-select" id="cfgStorage" onchange="finderState.storage=this.value">
        <option value="any">Any Storage</option>
        <option value="256">256GB SSD</option>
        <option value="512">512GB SSD</option>
        <option value="1000">1TB SSD</option>
      </select>
      <select class="config-select" id="cfgCpu" onchange="finderState.cpu=this.value">
        <option value="any">Any CPU</option>
        <option value="intel">Intel</option>
        <option value="amd">AMD</option>
        <option value="apple">Apple Silicon</option>
      </select>
    </div>
  `,
  smartphone: `
    <div class="config-row">
      <select class="config-select" id="cfgRam" onchange="finderState.ram=this.value">
        <option value="any">Any RAM</option>
        <option value="4">4GB RAM</option>
        <option value="6">6GB RAM</option>
        <option value="8">8GB RAM</option>
        <option value="12">12GB RAM</option>
      </select>
      <select class="config-select" id="cfgStorage" onchange="finderState.storage=this.value">
        <option value="any">Any Storage</option>
        <option value="64">64GB</option>
        <option value="128">128GB</option>
        <option value="256">256GB</option>
      </select>
      <label class="config-toggle">
        <input type="checkbox" id="cfg5g" onchange="finderState.fiveG=this.checked"/>
        5G Only
      </label>
    </div>
  `,
  headphones: `<div class="config-row"><span style="font-size:0.82rem;color:var(--text-muted)">Showing all audio devices from our collection</span></div>`,
  tablet:     `<div class="config-row"><span style="font-size:0.82rem;color:var(--text-muted)">Showing all tablets from our collection</span></div>`,
  smartwatch: `<div class="config-row"><span style="font-size:0.82rem;color:var(--text-muted)">Showing all smartwatches from our collection</span></div>`
};

// ================================
//  PAGE INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  updateSavedBadge();

  // Check for ?cat= URL param from other pages
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat");
  if (catParam) {
    finderState.category = catParam;
    highlightCatChip(catParam);
  }

  renderConfigOptions();
  setupListeners();

  // Auto-run search on load
  runSearch();

  trackCategoryView(finderState.category);
});

// ================================
//  LISTENERS
// ================================
function setupListeners() {
  // Budget slider
  document.getElementById("budgetSlider").addEventListener("input", function() {
    finderState.budget = parseInt(this.value);
    document.getElementById("budgetDisplay").textContent = formatPrice(finderState.budget);
  });

  // Category chips
  document.getElementById("catChips").addEventListener("click", function(e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#catChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    finderState.category = chip.dataset.cat;
    // Reset configs when category changes
    finderState.ram = "any"; finderState.storage = "any";
    finderState.cpu = "any"; finderState.fiveG = false;
    renderConfigOptions();
    trackCategoryView(chip.dataset.cat);
  });

  // Brand chips
  document.getElementById("brandChips").addEventListener("click", function(e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#brandChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    finderState.brand = chip.dataset.brand;
  });
}

// Render the config dropdowns for the selected category
function renderConfigOptions() {
  document.getElementById("configOptions").innerHTML =
    configOptions[finderState.category] || "";
}

function highlightCatChip(cat) {
  document.querySelectorAll("#catChips .chip").forEach(c => {
    c.classList.toggle("active", c.dataset.cat === cat);
  });
}

// ================================
//  MAIN SEARCH — runs on button click
// ================================
function runSearch() {
  // Update button to show loading
  document.getElementById("searchBtnText").textContent = "Searching...";

  // Read latest budget value
  finderState.budget = parseInt(document.getElementById("budgetSlider").value);

  // Filter local products first, then enrich with Wikipedia
  fetchWithWikipedia();
}

// ================================
//  FILTER LOCAL DATA
//  Applies all active filters from finderState
// ================================
function getFilteredProducts() {
  return products.filter(p => {
    const catOk    = p.category === finderState.category;
    const budgetOk = p.price <= finderState.budget;
    const brandOk  = finderState.brand === "all" || p.brand === finderState.brand;
    return catOk && budgetOk && brandOk;
  });
}

// ================================
//  WIKIPEDIA-POWERED FETCH
//  Uses: fetch(), Promises, .then(), .catch()
//
//  Strategy:
//  1. Filter products from data.js using finderState
//  2. For each product, fetch a Wikipedia summary
//  3. Render an enriched card with the wiki image + description
//  4. Falls back gracefully if Wikipedia has no article
// ================================
function fetchWithWikipedia() {
  showLoading(true);
  hideError();

  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    showLoading(false);
    showNoResults();
    document.getElementById("searchBtnText").textContent = "Find Devices";
    return;
  }

  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  // Show status bar
  document.getElementById("resultsStatus").style.display = "flex";
  document.getElementById("resultsStatusText").innerHTML =
    `Found <strong>${filtered.length}</strong> device${filtered.length !== 1 ? "s" : ""}`;
  document.getElementById("apiBadge").style.display = "flex";
  document.getElementById("noResults").style.display = "none";

  showLoading(false);
  document.getElementById("searchBtnText").textContent = "Find Devices";

  // For each product, fetch Wikipedia summary — Promise chain 
  filtered.forEach((product, index) => {
    // Build a good Wikipedia search term from the product name
    const searchTerm = encodeURIComponent(product.name);
    const wikiUrl = WIKI_API + searchTerm;

    fetch(wikiUrl)
      .then(response => {
        // Check if response was successful
        if (!response.ok) {
          throw new Error("Wikipedia request failed: " + response.status);
        }
        return response.json();
      })
      .then(wikiData => {
        // wikiData contains: title, extract (description), thumbnail, content_urls
        renderEnrichedCard(product, wikiData, index);
      })
      .catch(() => {
        // If Wikipedia fetch fails, render card using only local data
        renderEnrichedCard(product, null, index);
      });
  });

  // Save search to history
  saveSearch(finderState.category + " under " + formatPrice(finderState.budget));
}

// ================================
//  RENDER AN ENRICHED PRODUCT CARD
//  Combines local data.js info with Wikipedia data
// ================================
function renderEnrichedCard(product, wikiData, index) {
  const grid = document.getElementById("productsGrid");

  // Use Wikipedia thumbnail if available, otherwise show emoji
const imgHTML = wikiData && wikiData.thumbnail
    ? `<img src="${wikiData.thumbnail.source}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;"/>
       <div class="api-source-badge">Wikipedia</div>`
    : `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;padding:12px;"/>`;
  // Use Wikipedia extract (first sentence) if available, otherwise use local desc
  const desc = wikiData && wikiData.extract && !wikiData.extract.startsWith("may refer to")
    ? wikiData.extract.split(".")[0] + "."
    : product.desc;

  // Encode all data for the modal (used when card is clicked)
  const modalData = encodeURIComponent(JSON.stringify({
    name:       product.name,
    brand:      product.brand,
    emoji:      product.emoji,
    price:      formatPrice(product.price),
    desc:       desc,
    rating:     product.rating,
    reviews:    product.reviews,
    badge:      product.badge,
    img:        (wikiData && wikiData.thumbnail) ? wikiData.thumbnail.source : (product.image || null),
    exploreUrl: product.exploreUrl || null
  }));

  const card = document.createElement("div");
  card.className = "api-card";
  card.style.animationDelay = (index * 0.04) + "s";

  const isSaved = getSaved().includes(product.id);

  card.innerHTML = `
    <div class="api-card-img">${imgHTML}</div>
    <div class="api-card-body">
      <div class="api-card-brand">${product.brand}</div>
      <div class="api-card-name">${product.name}</div>
      <div class="api-card-specs">
        ${product.badge ? `<div class="spec-chip">${product.badge}</div>` : ""}
        <div class="spec-chip">⭐ ${product.rating}</div>
        <div class="spec-chip">${product.reviews.toLocaleString()} reviews</div>
      </div>
      <div class="api-card-desc">${desc}</div>
      <div class="api-card-footer">
        <div class="api-card-price">${formatPrice(product.price)}</div>
        <div class="api-card-footer-right">
          ${product.exploreUrl ? `<a href="${product.exploreUrl}" target="_blank" class="explore-btn" onclick="event.stopPropagation()">Explore →</a>` : ""}
          <button class="save-btn ${isSaved ? "saved" : ""}"
            onclick="event.stopPropagation(); handleSave(${product.id}, this)">🔖</button>
        </div>
      </div>
    </div>
  `;

  // Click card to open detail modal
  card.addEventListener("click", () => openDeviceModal(modalData));

  grid.appendChild(card);
}

// ================================
//  DEVICE DETAIL MODAL
// ================================
function openDeviceModal(encodedData) {
  const d = JSON.parse(decodeURIComponent(encodedData));
  const modal = document.getElementById("deviceModal");
  const body  = document.getElementById("modalBody");

  body.innerHTML = `
    ${d.img
      ? `<img class="modal-img" src="${d.img}" alt="${d.name}"/>`
      : `<div class="modal-emoji">${d.emoji}</div>`
    }
    <div class="modal-brand">${d.brand}</div>
    <div class="modal-name">${d.name}</div>
    <div class="modal-desc">${d.desc}</div>
    <div class="modal-specs-grid">
      <div class="modal-spec-item">
        <div class="modal-spec-label">Price</div>
        <div class="modal-spec-val">${d.price}</div>
      </div>
      <div class="modal-spec-item">
        <div class="modal-spec-label">Rating</div>
        <div class="modal-spec-val">⭐ ${d.rating} (${d.reviews ? d.reviews.toLocaleString() : "—"} reviews)</div>
      </div>
      ${d.badge ? `
      <div class="modal-spec-item">
        <div class="modal-spec-label">Badge</div>
        <div class="modal-spec-val">${d.badge}</div>
      </div>` : ""}
    </div>
    <div class="modal-actions">
      <div class="btn-primary" style="pointer-events:none">${d.price}</div>
      ${d.exploreUrl ? `<a href="${d.exploreUrl}" target="_blank" class="explore-btn explore-btn-modal">Explore →</a>` : ""}
    </div>
  `;

  modal.style.display = "flex";
}

function closeModal(e) {
  if (e.target === document.getElementById("deviceModal")) {
    document.getElementById("deviceModal").style.display = "none";
  }
}

// ================================
//  LOCAL DATA RESULTS (fallback)
//  Used when Wikipedia is completely unavailable
// ================================
function showLocalResults() {
  const filtered = getFilteredProducts();
  const grid = document.getElementById("productsGrid");

  document.getElementById("resultsStatus").style.display = "flex";
  document.getElementById("apiBadge").style.display = "none";
  document.getElementById("noResults").style.display = "none";

  if (filtered.length === 0) {
    grid.innerHTML = "";
    showNoResults();
    document.getElementById("resultsStatus").style.display = "none";
    return;
  }

  document.getElementById("resultsStatusText").innerHTML =
    `Showing <strong>${filtered.length}</strong> device${filtered.length !== 1 ? "s" : ""} from local data`;

  grid.innerHTML = filtered.map((p, i) => buildProductCard(p, i * 0.04)).join("");
}

// ================================
//  UI HELPERS
// ================================
function showLoading(show) {
  document.getElementById("loadingState").style.display = show ? "block" : "none";
  document.getElementById("productsGrid").style.display = show ? "none" : "grid";
}

function hideError() {
  document.getElementById("errorState").style.display = "none";
}

function showNoResults() {
  document.getElementById("noResults").style.display = "block";
  document.getElementById("resultsStatus").style.display = "none";
}

function resetFinder() {
  finderState = {
    category: "laptop", budget: 100000, brand: "all",
    ram: "any", storage: "any", cpu: "any", fiveG: false
  };
  document.getElementById("budgetSlider").value = 100000;
  document.getElementById("budgetDisplay").textContent = "₹1L";
  document.querySelectorAll("#catChips .chip").forEach(c =>
    c.classList.toggle("active", c.dataset.cat === "laptop")
  );
  document.querySelectorAll("#brandChips .chip").forEach(c =>
    c.classList.toggle("active", c.dataset.brand === "all")
  );
  renderConfigOptions();
  runSearch();
}

// Save search term to history
function saveSearch(term) {
  let history = JSON.parse(localStorage.getItem("tp_searches") || "[]");
  if (!history.includes(term)) {
    history.unshift(term);
    history = history.slice(0, 10);
    localStorage.setItem("tp_searches", JSON.stringify(history));
  }
}


function trackCategoryView(category) {
  if (!category) return;
  const views = JSON.parse(localStorage.getItem("tp_cat_views") || "{}");
  views[category] = (views[category] || 0) + 1;
  localStorage.setItem("tp_cat_views", JSON.stringify(views));
}