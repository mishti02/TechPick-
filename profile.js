// ========================
//  PROFILE PAGE — profile.js
//  Integrates with auth.js (tp_current_user, tp_users)
// ========================

// ========================
//  LOAD PROFILE FROM auth + localStorage
// ========================
function loadProfile() {
  // First try the authenticated user record
  const user = getCurrentUser(); // from auth.js
  const profile = JSON.parse(localStorage.getItem("tp_profile") || "null");

  const source = user || profile;
  if (!source) return;

  // Fill name
  const name = user
    ? (user.firstName + " " + user.lastName)
    : (profile.name || "");

  if (name && document.getElementById("profileName")) {
    document.getElementById("profileName").value = name;
  }
  if ((user?.budget || profile?.budget) && document.getElementById("profileBudget")) {
    document.getElementById("profileBudget").value = user?.budget || profile?.budget;
  }
  if ((user?.category || profile?.category) && document.getElementById("profileCategory")) {
    document.getElementById("profileCategory").value = user?.category || profile?.category;
  }
  const savedPhone = user?.phone || profile?.phone || "";
if (savedPhone && document.getElementById("profilePhone")) {
  document.getElementById("profilePhone").value = savedPhone;
}

  // Update avatar letter
  const avatarEl = document.getElementById("profileAvatar");
  if (avatarEl && name) {
    avatarEl.textContent = name.charAt(0).toUpperCase();
  }

  // Show auth user info strip
  if (user) {
    const infoEl = document.getElementById("profileUserInfo");
    if (infoEl) infoEl.style.display = "block";

    const fullNameEl = document.getElementById("profileFullName");
    if (fullNameEl) fullNameEl.textContent = user.firstName + " " + user.lastName;

    const emailEl = document.getElementById("profileEmailDisplay");
    if (emailEl) emailEl.textContent = user.email;

    const joinEl = document.getElementById("profileJoinDate");
    if (joinEl && user.joinDate) joinEl.textContent = "Member since " + user.joinDate;
  }
}

// ========================
//  SAVE PROFILE
//  Updates both tp_profile and the user record in tp_users
// ========================
function saveProfile() {
  const name     = document.getElementById("profileName").value.trim();
  const budget   = document.getElementById("profileBudget").value;
  const category = document.getElementById("profileCategory").value;

  if (!name) {
    showToast("Please enter your name");
    return;
  }

  // Update tp_profile (used by profile.js functions)
  const phone = document.getElementById("profilePhone")?.value.trim() || "";
const profile = { name, budget, category, phone };
  localStorage.setItem("tp_profile", JSON.stringify(profile));

  // Also update the user record in tp_users if logged in
  const email = localStorage.getItem("tp_current_user");
  if (email) {
    const users = JSON.parse(localStorage.getItem("tp_users") || "{}");
    if (users[email]) {
      // Split name into first/last if possible
      const parts = name.split(" ");
      users[email].firstName = parts[0] || name;
      users[email].lastName  = parts.slice(1).join(" ") || "";
      users[email].budget    = budget;
      users[email].category  = category;
      localStorage.setItem("tp_users", JSON.stringify(users));
    }
  }

  // Update avatar letter
  document.getElementById("profileAvatar").textContent = name.charAt(0).toUpperCase();

  // Show success message
  const msg = document.getElementById("profileMsg");
  msg.style.display = "block";
  setTimeout(() => { msg.style.display = "none"; }, 2500);

  renderPrefSummary();
  updateNavbar(); // refresh navbar chip name
addActivity(
  "💾",
  "Profile Saved",
  "Your profile information was updated"
);
  showToast("Profile saved! 👋");
}

// ========================
// EDIT PROFILE MODAL
// ========================

function openEditModal() {
  document.getElementById("profileModal").classList.add("active");

  document.getElementById("modalProfileName").value =
    document.getElementById("profileName").value;

  document.getElementById("modalProfileBudget").value =
    document.getElementById("profileBudget").value;

  document.getElementById("modalProfileCategory").value =
    document.getElementById("profileCategory").value;

  const phoneInput = document.getElementById("profilePhone");
  if (phoneInput) {
    document.getElementById("modalProfilePhone").value =
      phoneInput.value;
  }
}

function closeEditModal() {
  document.getElementById("profileModal").classList.remove("active");
}

function saveProfileFromModal() {

  document.getElementById("profileName").value =
    document.getElementById("modalProfileName").value;

  document.getElementById("profileBudget").value =
    document.getElementById("modalProfileBudget").value;

  document.getElementById("profileCategory").value =
    document.getElementById("modalProfileCategory").value;

  const phoneInput = document.getElementById("profilePhone");
  if (phoneInput) {
    phoneInput.value =
      document.getElementById("modalProfilePhone").value;
  }

  saveProfile();

  addActivity(
    "✏️",
    "Profile Updated",
    "You updated your profile information"
  );

  closeEditModal();
}

// ========================
//  RENDER SAVED DEVICES LIST
// ========================
function renderSavedDevices() {
  const saved = getSaved();
  const container = document.getElementById("savedDevicesList");
  if (!container) return;

  if (saved.length === 0) {
    container.innerHTML = `<p class="empty-msg">No saved devices yet.<br/>Go to <a href="finder.html" style="color:var(--accent)">Finder</a> and bookmark some!</p>`;
    return;
  }

  const savedProducts = products.filter(p => saved.includes(p.id));

  container.innerHTML = savedProducts.map(p => `
    <div class="saved-device-item">
    <div class="sdi-icon"><img src="${p.image}" alt="${p.name}" style="width:40px;height:40px;object-fit:contain;"/></div>
      <div class="sdi-info">
        <strong>${p.name}</strong>
        <span>${formatPrice(p.price)}</span>
      </div>
      <button class="sdi-remove" onclick="removeSaved(${p.id})">✕</button>
    </div>
  `).join("");
}

function removeSaved(id, name) {

  toggleSave(id);

  addActivity(
    "📱",
    "Device Removed",
    `${name} was removed from saved devices`
  );

  renderSavedDevices();
  renderStats();
  renderPrefSummary();
}

// ========================
//  PROFILE STATS
// ========================
function renderStats() {
  const profile = JSON.parse(localStorage.getItem("tp_profile") || "null");
const user    = getCurrentUser();

// Read live from inputs first, fall back to saved data
const name     = document.getElementById("profileName")?.value.trim()
                 || (user ? (user.firstName + " " + user.lastName).trim() : "")
                 || profile?.name || "";
const budget   = document.getElementById("profileBudget")?.value.trim()
                 || user?.budget || profile?.budget || "";
const category = document.getElementById("profileCategory")?.value
                 || user?.category || profile?.category || "";
const phone    = document.getElementById("profilePhone")?.value.trim()
                 || user?.phone || profile?.phone || "";

  const checks = [
    { label: "Name set",       done: !!name },
    { label: "Budget set",     done: !!budget },
    { label: "Category chosen",done: !!category },
    { label: "Phone added",    done: !!phone },
  ];

  const score = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  // Ring
  const pctEl = document.getElementById("profileScorePct");
  const ringEl = document.getElementById("scoreRingFill");
  if (pctEl) pctEl.textContent = score + "%";
  if (ringEl) {
    const circumference = 201;
    ringEl.style.strokeDashoffset = circumference - (score / 100) * circumference;
  }

  // Checklist
  const listEl = document.getElementById("profileScoreChecklist");
  if (listEl) {
    listEl.innerHTML = checks.map(c => `
      <div class="psb-check-row ${c.done ? "done" : ""}">
        <div class="psb-check-dot ${c.done ? "done" : ""}"></div>
        ${c.label}
      </div>
    `).join("");
  }

  // Next step
  const nextEl = document.getElementById("profileScoreNextText");
  if (nextEl) {
    const missing = checks.find(c => !c.done);
    nextEl.textContent = missing
      ? `Add your ${missing.label.toLowerCase()} to improve your score.`
      : "Your profile is complete! 🎉";
  }
}


// ========================
//  PREFERENCES SUMMARY
// ========================
function renderPrefSummary() {
  const el = document.getElementById("prefSummary");
  if (!el) return;

  const saved         = getSaved();
  const savedProducts = products.filter(p => saved.includes(p.id));
  const user          = getCurrentUser();
  const profile       = JSON.parse(localStorage.getItem("tp_profile") || "null");

  if (savedProducts.length === 0 && !user && !profile) {
    el.textContent = "Save your profile and bookmark devices to see your preferences summary.";
    return;
  }

  let summary = "";

  // Greeting with name
  const name = user ? user.firstName : (profile && profile.name ? profile.name.split(" ")[0] : null);
  if (name) summary += `👋 Hey <strong>${name}</strong>! `;

  if (savedProducts.length > 0) {
    const catCount = {};
    savedProducts.forEach(p => {
      catCount[p.category] = (catCount[p.category] || 0) + 1;
    });
    const topCat = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a])[0];

    const brandCount = {};
    savedProducts.forEach(p => {
      brandCount[p.brand] = (brandCount[p.brand] || 0) + 1;
    });
    const topBrand = Object.keys(brandCount).sort((a, b) => brandCount[b] - brandCount[a])[0];

    const avg = Math.round(savedProducts.reduce((s, p) => s + p.price, 0) / savedProducts.length);

    summary += `You mostly save <strong>${topCat}s</strong>, you seem to like <strong>${topBrand}</strong> devices, and your average budget is around <strong>${formatPrice(avg)}</strong>.`;
  } else {
    summary += "Start bookmarking devices in the Finder to build your preferences profile.";
  }

  el.innerHTML = summary;
}

// ========================
//  SEARCH HISTORY
// ========================
function renderSearchHistory() {
  const history   = JSON.parse(localStorage.getItem("tp_searches") || "[]");
  const container = document.getElementById("recentSearchesList");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `<p class="empty-msg">No recent searches.</p>`;
    return;
  }

  container.innerHTML = history.map(term => `
    <div class="search-history-item" onclick="window.location.href='finder.html'">
      <span>🔍</span> ${term}
    </div>
  `).join("");
}

// ========================
// ACTIVITY LOG
// ========================

function getActivities() {
  return JSON.parse(localStorage.getItem("tp_activities") || "[]");
}

function addActivity(icon, title, desc) {

  const activities = getActivities();

  activities.unshift({
    icon,
    title,
    desc,
    time: new Date().toLocaleString()
  });

  localStorage.setItem(
    "tp_activities",
    JSON.stringify(activities.slice(0, 20))
  );

  renderActivityFeed();
}

function renderActivityFeed() {

  const container = document.getElementById("activityFeed");
  if (!container) return;

  const activities = getActivities();

  if (activities.length === 0) {
    container.innerHTML =
      `<p class="empty-msg">No recent activity.</p>`;
    return;
  }

  container.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>

      <div class="activity-text">
        <strong>${a.title}</strong>
        ${a.desc}

        <div class="activity-time">
          ${a.time}
        </div>
      </div>
    </div>
  `).join("");
}

function clearSearches() {
  localStorage.removeItem("tp_searches");
  renderSearchHistory();
  showToast("Search history cleared");
  addActivity(
  "🔍",
  "Search History Cleared",
  "Recent searches were deleted"
);
}

// ========================
//  CLEAR ALL SAVED DEVICES
// ========================
function clearAllSaved() {
  if (getSaved().length === 0) {
    showToast("Nothing to clear!");
    return;
  }
  const confirmed = confirm("Are you sure you want to remove all saved devices?");
  if (confirmed) {
    setSaved([]);
    updateSavedBadge();
    renderSavedDevices();
    renderStats();
    renderPrefSummary();
    showToast("All saved devices cleared");
  }
  addActivity(
  "🗑️",
  "Saved Devices Cleared",
  "All saved devices were removed"
);
}

// ========================
//  DARK MODE TOGGLE
// ========================
function toggleDarkMode() {

  const isDark =
    document.getElementById("darkModeToggle").checked;

  document.body.classList.toggle(
    "dark-mode",
    isDark
  );

  localStorage.setItem(
    "tp_darkmode",
    isDark
  );

  addActivity(
    "🌙",
    "Theme Changed",
    isDark
      ? "Dark mode enabled"
      : "Dark mode disabled"
  );
}

function loadDarkModeToggle() {
  if (localStorage.getItem("tp_darkmode") === "true") {
    const toggle = document.getElementById("darkModeToggle");
    if (toggle) toggle.checked = true;
    document.body.classList.add("dark-mode");
  }
}

// ========================
//  INIT
// ========================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  renderSavedDevices();
  renderSearchHistory();
  renderStats();
  // Live update score ring as user types
["profileName", "profileBudget", "profilePhone"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", renderStats);
});
// select needs "change" not "input"
const catEl = document.getElementById("profileCategory");
if (catEl) catEl.addEventListener("change", renderStats);
  renderPrefSummary();
  renderActivityFeed();
  loadDarkModeToggle();
  updateSavedBadge();
  loadSettings();
  ["profileName", "profileBudget", "profileCategory", "profilePhone"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", renderStats);
});
  fakeDealAlert();
  updateBudgetPlanner();

  setInterval(() => {
    const current = parseInt(localStorage.getItem("tp_time_on_site") || "0");
    localStorage.setItem("tp_time_on_site", current + 1);
    // refresh display live
    const el = document.getElementById("statTimeOnSite");
    if (el) {
      const mins = Math.floor((current + 1) / 60);
      const hrs  = Math.floor(mins / 60);
      el.textContent = hrs > 0 ? hrs + "h " + (mins % 60) + "m" : mins + "m";
    }
  }, 1000);
});

function saveSetting(key, value) {

  localStorage.setItem(`tp_setting_${key}`, value);

  showToast(`${key} updated`);

  addActivity(
    "⚙️",
    "Settings Updated",
    `${key} preference changed`
  );
}

function loadSettings() {

  const alerts =
    localStorage.getItem("tp_setting_alerts");

  const trending =
    localStorage.getItem("tp_setting_trending");

  const lakhs =
    localStorage.getItem("tp_setting_lakhs");

  if(alerts === "true") {
    document.getElementById("alertsToggle").checked = true;
  }

  if(trending === "true") {
    document.getElementById("trendingToggle").checked = true;
  }

  if(lakhs === "true") {
    document.getElementById("lakhsToggle").checked = true;
  }
}

function fakeDealAlert() {

  const alertsEnabled =
    localStorage.getItem("tp_setting_alerts");

  if(alertsEnabled === "true") {

    setTimeout(() => {

      showToast("🔥 New iPhone deal under ₹80K");

    }, 4000);
  }
}

function deleteAccount() {

  const confirmed = confirm(
    "Are you sure you want to permanently delete your account?"
  );

  if (!confirmed) return;

  // Get current user
  const currentUserEmail =
    localStorage.getItem("tp_current_user");

  // Get all users
  const users =
    JSON.parse(localStorage.getItem("tp_users") || "{}");

  // Delete current user account
  if (currentUserEmail && users[currentUserEmail]) {

    delete users[currentUserEmail];

    localStorage.setItem(
      "tp_users",
      JSON.stringify(users)
    );
  }

  // Remove all user-related data
  localStorage.removeItem("tp_current_user");
  localStorage.removeItem("tp_profile");
  localStorage.removeItem("tp_saved");
  localStorage.removeItem("tp_searches");
  localStorage.removeItem("tp_activities");

  // Optional settings cleanup
  localStorage.removeItem("tp_darkmode");
  localStorage.removeItem("tp_setting_alerts");
  localStorage.removeItem("tp_setting_trending");
  localStorage.removeItem("tp_setting_lakhs");

  showToast("Account deleted successfully");

  // Redirect
  setTimeout(() => {

    window.location.href = "index.html";

  }, 1200);
}


function updateBudgetPlanner() {
  const budget  = parseInt(document.getElementById("bpSlider").value);
  const display = document.getElementById("bpDisplay");
  const results = document.getElementById("bpResults");
  const link    = document.getElementById("bpFinderLink");

  // Update display
  display.textContent = budget >= 100000
    ? "₹" + (budget / 100000).toFixed(1) + "L"
    : "₹" + (budget / 1000).toFixed(0) + "K";

  // Update finder link
  link.href = "finder.html?budget=" + budget;

  const categories = [
    { key: "smartphone", label: "Smartphones", icon: "📱" },
    { key: "laptop",     label: "Laptops",     icon: "💻" },
    { key: "headphones", label: "Audio",        icon: "🎧" },
    { key: "tablet",     label: "Tablets",      icon: "📟" },
    { key: "smartwatch", label: "Smartwatches", icon: "⌚" },
  ];

  let totalCount = 0;

  results.innerHTML = categories.map(cat => {
    const matching = products.filter(p => p.category === cat.key && p.price <= budget);
    const allInCat = products.filter(p => p.category === cat.key);
    const minPrice = Math.min(...allInCat.map(p => p.price));
    const count    = matching.length;
    totalCount    += count;

    const hasDevices = count > 0;

    return `
      <div class="bp-row ${hasDevices ? "has-devices" : "no-devices"}">
        <div class="bp-row-icon">${cat.icon}</div>
        <div class="bp-row-info">
          <div class="bp-row-name">${cat.label}</div>
          <div class="bp-row-range">
            ${hasDevices
              ? "Starting from " + formatPrice(minPrice)
              : "Min. " + formatPrice(minPrice) + " needed"}
          </div>
        </div>
        <div class="bp-row-count">
          ${hasDevices ? count + " device" + (count !== 1 ? "s" : "") : "—"}
        </div>
      </div>
    `;
  }).join("");

  // Total summary bar
  results.innerHTML += `
    <div class="bp-total-bar">
      <span>Total devices in budget</span>
      <span>${totalCount} / ${products.length}</span>
    </div>
  `;
}