// explore.js
document.addEventListener("DOMContentLoaded", () => {
  renderPodium();
  renderTrendingGrid();
  renderBrands();
  updateSavedBadge();

  // Check if a tab was requested via URL ?tab=brands
  const params = new URLSearchParams(window.location.search);
  if (params.get("tab") === "brands") {
    switchTab("brands", document.querySelectorAll(".explore-tab")[1]);
  }
  // Check if a brand was requested via URL ?brand=Apple
  if (params.get("brand")) {
    switchTab("brands", document.querySelectorAll(".explore-tab")[1]);
    showBrand(params.get("brand"));
  }
});

// Switch between Trending and Brands tabs
function switchTab(tab, btn) {
  // Hide all tab contents
  document.querySelectorAll(".explore-tab-content").forEach(t => t.style.display = "none");
  // Remove active from all tab buttons
  document.querySelectorAll(".explore-tab").forEach(b => b.classList.remove("active"));
  // Show selected tab
  document.getElementById("tab-" + tab).style.display = "block";
  btn.classList.add("active");
}

// TRENDING PODIUM — top 3
function renderPodium() {
  const trending = products.filter(p => p.trending).sort((a, b) => b.rating - a.rating);
  const medals  = ["🥇", "🥈", "🥉"];
  const classes = ["gold", "silver", "bronze"];

  document.getElementById("podium").innerHTML = trending.slice(0, 3).map((p, i) => `
    <div class="podium-card ${classes[i]}">
      <div class="podium-medal">${medals[i]}</div>
      <img src="${p.image}" class="podium-image">
      <div class="podium-name">${p.name}</div>
      <div class="podium-brand">${p.brand} · ${p.category}</div>
      <div class="podium-price">${formatPrice(p.price)}</div>
      <div class="podium-rating">⭐ ${p.rating} (${p.reviews.toLocaleString()})</div>
      ${p.exploreUrl ? `<a href="${p.exploreUrl}" target="_blank" class="explore-btn">Explore →</a>` : ""}
    </div>
  `).join("");
}

// ALL TRENDING GRID
function renderTrendingGrid() {
  const trending = products.filter(p => p.trending).sort((a, b) => b.rating - a.rating);
  document.getElementById("trendingGrid").innerHTML =
    trending.map((p, i) => buildProductCard(p, i * 0.04)).join("");
}

// BRANDS GRID
function renderBrands() {
  document.getElementById("brandsGrid").innerHTML = brands.map(b => {
    const count = products.filter(p => p.brand === b.name).length;
    return `
      <div class="brand-card" onclick="showBrand('${b.name}')" id="bc-${b.name}">
      <div class="brand-logo-wrap"><img src="${b.logo}" alt="${b.name}" class="brand-logo"></div>
        <div class="brand-name">${b.name}</div>
        <div class="brand-tagline">${b.tagline}</div>
        <div class="brand-count">${count} device${count !== 1 ? "s" : ""}</div>
      </div>
    `;
  }).join("");
}

// SHOW BRAND PRODUCTS
function showBrand(brandName) {
  // Highlight selected brand card
  document.querySelectorAll(".brand-card").forEach(c => c.classList.remove("selected"));
  const card = document.getElementById("bc-" + brandName);
  if (card) card.classList.add("selected");

  const brand = brands.find(b => b.name === brandName);
  const brandProducts = products.filter(p => p.brand === brandName);

  // Show brand hero banner
  document.getElementById("brandHero").innerHTML = `
   <div class="brand-hero-logo-wrap"><img src="${brand.logo}" class="brand-hero-img"></div>
    <div class="brand-hero-info">
      <h2>${brandName}</h2>
      <p>${brand ? brand.tagline : ""} · ${brandProducts.length} devices on TechPick</p>
    </div>
  `;

  document.getElementById("brandTitle").textContent = brandName + " Devices";
  document.getElementById("brandSub").textContent =
    brandProducts.length + " device" + (brandProducts.length !== 1 ? "s" : "") + " available";

  document.getElementById("brandGrid").innerHTML =
    brandProducts.map((p, i) => buildProductCard(p, i * 0.04)).join("");

  // Show the section and scroll to it
  const section = document.getElementById("brandProductsSection");
  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearBrandFilter() {
  document.querySelectorAll(".brand-card").forEach(c => c.classList.remove("selected"));
  document.getElementById("brandProductsSection").style.display = "none";
}
function buildProductCard(p, delay = 0) {
  const isSaved = getSaved().includes(p.id);
  return `
    <div class="product-card" style="animation-delay:${delay}s">
      <img src="${p.image}" alt="${p.name}" class="products-images">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-price">₹${p.price.toLocaleString()}</div>
      <div class="product-rating">⭐ ${p.rating} (${p.reviews.toLocaleString()})</div>
      <div class="product-card-actions">
        ${p.exploreUrl ? `<a href="${p.exploreUrl}" target="_blank" class="explore-btn" onclick="event.stopPropagation()">Explore →</a>` : ""}
        <button class="save-btn ${isSaved ? "saved" : ""}" onclick="handleSave(${p.id}, this)">🔖</button>
      </div>
    </div>
  `;
}
