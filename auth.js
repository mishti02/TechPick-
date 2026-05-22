// ========================
//  TECHPICK — AUTH SYSTEM
//  auth.js
//
//  Handles:
//  - Login / Sign Up modal (blocks page on load)
//  - localStorage user accounts (tp_users, tp_current_user)
//  - Navbar user chip + dropdown
//  - Profile page integration
// ========================

// ========================
//  CONSTANTS
// ========================
const USERS_KEY   = "tp_users";        // stores all registered users
const SESSION_KEY = "tp_current_user"; // stores currently logged-in user email

// ========================
//  HELPERS — user store
// ========================
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrentUser() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const users = getUsers();
  return users[email] || null;
}
function setCurrentUser(email) {
  localStorage.setItem(SESSION_KEY, email);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ========================
//  MODAL HTML — injected into body
// ========================
function injectAuthModal() {
  const html = `
  <div class="auth-backdrop" id="authBackdrop">
    <div class="auth-modal" role="dialog" aria-modal="true" aria-label="Sign in to TechPick">

      <!-- Branding strip -->
      <div class="auth-modal-top">
        <div class="auth-brand">Tech<span>Pick</span></div>
        <div class="auth-tagline">Your smart gadget recommendation platform</div>
      </div>

      <!-- Tab switcher -->
      <div class="auth-tabs">
        <button class="auth-tab active" id="tabLogin" onclick="switchAuthTab('login')">
          🔑 Sign In
        </button>
        <button class="auth-tab" id="tabSignup" onclick="switchAuthTab('signup')">
          ✨ Create Account
        </button>
      </div>

      <!-- Form body -->
      <div class="auth-body" id="authBody">

        <!-- ===== LOGIN PANEL ===== -->
        <div class="auth-panel active" id="panelLogin">
          <div class="auth-welcome">Welcome back! 👋</div>
          <div class="auth-sub">Sign in with your email and password.</div>

          <div class="auth-error" id="loginError"></div>

          <div class="auth-field">
            <label>Email Address</label>
            <input class="auth-input" type="email" id="loginEmail"
              placeholder="you@example.com" autocomplete="email"/>
          </div>
          <div class="auth-field">
            <label>Password</label>
            <input class="auth-input" type="password" id="loginPassword"
              placeholder="Enter your password" autocomplete="current-password"/>
          </div>

          <button class="auth-submit" onclick="handleLogin()">Sign In →</button>

          <div class="auth-switch">
            Don't have an account? <a onclick="switchAuthTab('signup')">Create one free</a>
          </div>
        </div>

        <!-- ===== SIGNUP PANEL ===== -->
        <div class="auth-panel" id="panelSignup">
          <div class="auth-welcome">Create your account 🚀</div>
          <div class="auth-sub">Join TechPick — it's free and takes 30 seconds.</div>

          <!-- Live avatar preview -->
          <div class="auth-avatar-pick">
            <div class="auth-avatar-circle" id="signupAvatarPreview">?</div>
            <div class="auth-avatar-hint">
              <strong>Your avatar</strong><br/>
              Updates as you type your name
            </div>
          </div>

          <div class="auth-error" id="signupError"></div>

          <div class="auth-name-row">
            <div class="auth-field">
              <label>First Name</label>
              <input class="auth-input" type="text" id="signupFirst"
                placeholder="Arjun" oninput="updateAvatarPreview()"
                autocomplete="given-name"/>
            </div>
            <div class="auth-field">
              <label>Last Name</label>
              <input class="auth-input" type="text" id="signupLast"
                placeholder="Sharma" autocomplete="family-name"/>
            </div>
          </div>

          <div class="auth-field">
            <label>Email Address</label>
            <input class="auth-input" type="email" id="signupEmail"
              placeholder="you@example.com" autocomplete="email"/>
          </div>

          <div class="auth-field">
            <label>Password</label>
            <input class="auth-input" type="password" id="signupPassword"
              placeholder="Min. 6 characters" oninput="updatePasswordStrength()"
              autocomplete="new-password"/>
            <!-- Password strength bars -->
            <div class="auth-strength" id="strengthBars">
              <div class="auth-strength-bar" id="sb1"></div>
              <div class="auth-strength-bar" id="sb2"></div>
              <div class="auth-strength-bar" id="sb3"></div>
              <div class="auth-strength-bar" id="sb4"></div>
            </div>
          </div>

          <div class="auth-field">
            <label>Default Budget (₹) — optional</label>
            <input class="auth-input" type="number" id="signupBudget"
              placeholder="e.g. 50000"/>
          </div>

          <div class="auth-field">
            <label>Favourite Category — optional</label>
            <select class="auth-input" id="signupCategory">
              <option value="">Select a category...</option>
              <option value="smartphone">📱 Smartphones</option>
              <option value="laptop">💻 Laptops</option>
              <option value="headphones">🎧 Audio</option>
              <option value="tablet">📟 Tablets</option>
              <option value="smartwatch">⌚ Smartwatches</option>
            </select>
          </div>

          <button class="auth-submit" onclick="handleSignup()">Create Account →</button>

          <div class="auth-switch">
            Already have an account? <a onclick="switchAuthTab('login')">Sign in here</a>
          </div>

          <!-- Scroll down button — visible when content overflows -->
          <button
            class="auth-scroll-btn"
            id="signupScrollBtn"
            onclick="scrollSignupToBottom()"
            title="Scroll to submit"
            aria-label="Scroll down to submit button"
          >&#8595;</button>
        </div>

      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML("afterbegin", html);

  // Allow Enter key to submit
  document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const loginPanel = document.getElementById("panelLogin");
      if (loginPanel && loginPanel.classList.contains("active")) handleLogin();
      else handleSignup();
    }
  });

  // Wire up scroll listener for scroll button visibility
  const authBody = document.getElementById("authBody");
  if (authBody) {
    authBody.addEventListener("scroll", updateScrollBtn);
  }
}

// ========================
//  SHOW / HIDE MODAL
// ========================
function showAuthModal(defaultTab = "login") {
  const backdrop = document.getElementById("authBackdrop");
  if (backdrop) {
    backdrop.style.display = "flex";
    switchAuthTab(defaultTab);
  } else {
    injectAuthModal();
    switchAuthTab(defaultTab);
  }
  // Prevent body scroll while modal is open
  document.body.style.overflow = "hidden";
}

function hideAuthModal() {
  const backdrop = document.getElementById("authBackdrop");
  if (backdrop) {
    backdrop.style.animation = "none";
    backdrop.style.opacity = "0";
    backdrop.style.transition = "opacity 0.25s";
    setTimeout(() => {
      backdrop.style.display = "none";
      backdrop.style.opacity = "";
    }, 250);
  }
  document.body.style.overflow = "";
}

// ========================
//  SWITCH TABS
// ========================
function switchAuthTab(tab) {
  document.getElementById("tabLogin").classList.toggle("active", tab === "login");
  document.getElementById("tabSignup").classList.toggle("active", tab === "signup");
  document.getElementById("panelLogin").classList.toggle("active", tab === "login");
  document.getElementById("panelSignup").classList.toggle("active", tab === "signup");
  // Clear errors on switch
  document.getElementById("loginError").classList.remove("show");
  document.getElementById("signupError").classList.remove("show");
  // Reset scroll position and update scroll button when switching to signup
  const authBody = document.getElementById("authBody");
  if (authBody) {
    authBody.scrollTop = 0;
  }
  if (tab === "signup") {
    setTimeout(updateScrollBtn, 50);
  } else {
    // Hide scroll button on login tab
    const btn = document.getElementById("signupScrollBtn");
    if (btn) btn.classList.add("hidden");
  }
}

// ========================
//  SCROLL DOWN BUTTON
// ========================
function scrollSignupToBottom() {
  const authBody = document.getElementById("authBody");
  if (authBody) {
    authBody.scrollTo({ top: authBody.scrollHeight, behavior: "smooth" });
  }
}

function updateScrollBtn() {
  const authBody = document.getElementById("authBody");
  const btn      = document.getElementById("signupScrollBtn");
  if (!authBody || !btn) return;
  // Hide the button when user is within 40px of the bottom
  const nearBottom = authBody.scrollTop + authBody.clientHeight >= authBody.scrollHeight - 40;
  btn.classList.toggle("hidden", nearBottom);
}

// ========================
//  AVATAR PREVIEW (signup)
// ========================
function updateAvatarPreview() {
  const first = document.getElementById("signupFirst").value.trim();
  const preview = document.getElementById("signupAvatarPreview");
  if (preview) {
    preview.textContent = first ? first.charAt(0).toUpperCase() : "?";
  }
}

// ========================
//  PASSWORD STRENGTH
// ========================
function updatePasswordStrength() {
  const pw = document.getElementById("signupPassword").value;
  const bars = [
    document.getElementById("sb1"),
    document.getElementById("sb2"),
    document.getElementById("sb3"),
    document.getElementById("sb4"),
  ];
  // Reset
  bars.forEach(b => { b.className = "auth-strength-bar"; });

  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const cls = score <= 1 ? "weak" : score <= 2 ? "medium" : "strong";
  for (let i = 0; i < score; i++) {
    bars[i].classList.add(cls);
  }
}

// ========================
//  HANDLE LOGIN
// ========================
function handleLogin() {
  const email    = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const errEl    = document.getElementById("loginError");

  // Clear previous error
  errEl.classList.remove("show");

  if (!email || !password) {
    showAuthError("loginError", "Please fill in all fields.");
    return;
  }

  const users = getUsers();

  if (!users[email]) {
    showAuthError("loginError", "No account found with that email. Create one below!");
    return;
  }

  if (users[email].password !== btoa(password)) {
    showAuthError("loginError", "Incorrect password. Please try again.");
    return;
  }

  // ✅ Login success
  setCurrentUser(email);
  hideAuthModal();
  updateNavbar();
  showToast("Welcome back, " + users[email].firstName + "! 👋");

  // Sync profile data from user record
  syncProfileFromUser(users[email]);
}

// ========================
//  HANDLE SIGNUP
// ========================
function handleSignup() {
  const firstName = document.getElementById("signupFirst").value.trim();
  const lastName  = document.getElementById("signupLast").value.trim();
  const email     = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password  = document.getElementById("signupPassword").value;
  const budget    = document.getElementById("signupBudget").value;
  const category  = document.getElementById("signupCategory").value;

  // Validation
  if (!firstName || !lastName) {
    showAuthError("signupError", "Please enter your first and last name.");
    return;
  }
  if (!email || !email.includes("@") || !email.includes(".")) {
    showAuthError("signupError", "Please enter a valid email address.");
    return;
  }
  if (password.length < 6) {
    showAuthError("signupError", "Password must be at least 6 characters.");
    return;
  }

  const users = getUsers();

  if (users[email]) {
    showAuthError("signupError", "An account with that email already exists. Sign in instead!");
    return;
  }

  // Create user record
  const newUser = {
    firstName,
    lastName,
    email,
    password: btoa(password), // base64 encode (obfuscation only — no real server)
    budget,
    category,
    joinDate: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" }),
    savedDevices: [],
    searchHistory: []
  };

  users[email] = newUser;
  saveUsers(users);
  setCurrentUser(email);

  // Also write to tp_profile so profile.js picks it up
  syncProfileFromUser(newUser);

  hideAuthModal();
  updateNavbar();
  showToast("Account created! Welcome, " + firstName + " 🎉");
}

// ========================
//  SYNC USER → tp_profile
//  So profile.js works with the auth system
// ========================
function syncProfileFromUser(user) {
  const profile = {
    name:     user.firstName + " " + user.lastName,
    budget:   user.budget   || "",
    category: user.category || "",
    email:    user.email    || ""
  };
  localStorage.setItem("tp_profile", JSON.stringify(profile));
}

// ========================
//  LOGOUT
// ========================
function handleLogout() {
  clearSession();
  closeUserDropdown();
  updateNavbar();
  showToast("Signed out. See you soon!");

  // Show auth modal again after logout
  setTimeout(() => {
    showAuthModal("login");
  }, 600);
}

// ========================
//  ERROR DISPLAY
// ========================
function showAuthError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = "⚠️  " + msg;
  el.classList.add("show");
}

// ========================
//  UPDATE NAVBAR
//  Shows user chip when logged in, auth buttons when logged out
// ========================
function updateNavbar() {
  const navRight = document.querySelector(".nav-right");
  if (!navRight) return;

  const user = getCurrentUser();

  if (user) {
    // Logged in: show avatar chip + dropdown
    navRight.innerHTML = `
       <a href="contact.html" class="nav-contact-btn">📬 Contact</a>
      <div class="nav-user-wrap">
        <div class="nav-user-chip" onclick="toggleUserDropdown()">
          <div class="nav-user-avatar">${user.firstName.charAt(0).toUpperCase()}</div>
          ${user.firstName}
        </div>
        <div class="nav-user-dropdown" id="userDropdown">
          <a href="profile.html">👤 My Profile</a>
          <a href="saved.html">🔖 Saved Devices</a>
          <a href="finder.html">🔍 Find Devices</a>
          <div class="dropdown-sep"></div>
          <button class="logout-btn" onclick="handleLogout()">🚪 Sign Out</button>
        </div>
      </div>
    `;
  } else {
    // Logged out: show Login + Sign Up buttons
    navRight.innerHTML = `
  <a href="contact.html" class="nav-contact-btn">📬 Contact</a>
  <div class="nav-auth-btns">
    <button class="btn-ghost" onclick="showAuthModal('login')">Sign In</button>
    <button class="btn-fill" onclick="showAuthModal('signup')">Create Account</button>
  </div>
`;
  }

  // Re-attach saved badge update
  updateSavedBadge();

  // Close dropdown when clicking outside
  document.addEventListener("click", handleOutsideClick, { once: false });
}

function toggleUserDropdown() {
  const dd = document.getElementById("userDropdown");
  if (dd) dd.classList.toggle("open");
}

function closeUserDropdown() {
  const dd = document.getElementById("userDropdown");
  if (dd) dd.classList.remove("open");
}

function handleOutsideClick(e) {
  if (!e.target.closest(".nav-user-wrap")) {
    closeUserDropdown();
  }
}

// ========================
//  PAGE GATE
//  Blocks the page if not logged in
// ========================
function gatePageWithAuth() {
  const user = getCurrentUser();
  if (!user) {
    // Inject modal immediately — no flicker
    injectAuthModal();
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    // Check scroll button state after modal is rendered
    setTimeout(updateScrollBtn, 100);
  } else {
    updateNavbar();
  }
}

// ========================
//  INIT — runs on every page load
// ========================
document.addEventListener("DOMContentLoaded", () => {
  gatePageWithAuth();
});