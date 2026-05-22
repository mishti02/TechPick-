// ========================
// CONTACT PAGE — contact.js
// ========================

// FAQ TOGGLE
function toggleFaq(item) {

  item.classList.toggle("open");
}

// CHARACTER COUNTER
function updateCharCount() {

  const textarea = document.getElementById("contactMessage");
  const counter = document.getElementById("charCount");

  counter.textContent =
    `${textarea.value.length} / 500`;
}

// RESET ERRORS
function clearErrors() {

  document.getElementById("errFirst").textContent = "";
  document.getElementById("errLast").textContent = "";
  document.getElementById("errEmail").textContent = "";
  document.getElementById("errSubject").textContent = "";
  document.getElementById("errMessage").textContent = "";
}

// EMAIL VALIDATION
function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// HANDLE FORM SUBMIT
function handleContactSubmit(event) {

  event.preventDefault();

  clearErrors();

  const first =
    document.getElementById("contactFirst").value.trim();

  const last =
    document.getElementById("contactLast").value.trim();

  const email =
    document.getElementById("contactEmail").value.trim();

  const subject =
    document.getElementById("contactSubject").value;

  const message =
    document.getElementById("contactMessage").value.trim();

  let valid = true;

  // FIRST NAME
  if (!first) {

    document.getElementById("errFirst").textContent =
      "Please enter your first name";

    valid = false;
  }

  // LAST NAME
  if (!last) {

    document.getElementById("errLast").textContent =
      "Please enter your last name";

    valid = false;
  }

  // EMAIL
  if (!email) {

    document.getElementById("errEmail").textContent =
      "Please enter your email";

    valid = false;

  } else if (!isValidEmail(email)) {

    document.getElementById("errEmail").textContent =
      "Enter a valid email address";

    valid = false;
  }

  // SUBJECT
  if (!subject) {

    document.getElementById("errSubject").textContent =
      "Please select a subject";

    valid = false;
  }

  // MESSAGE
  if (!message) {

    document.getElementById("errMessage").textContent =
      "Please enter your message";

    valid = false;

  } else if (message.length < 10) {

    document.getElementById("errMessage").textContent =
      "Message should be at least 10 characters";

    valid = false;
  }

  // STOP IF INVALID
  if (!valid) return;

  // BUTTON LOADING STATE
  const submitBtn =
    document.getElementById("submitBtn");

  const submitBtnText =
    document.getElementById("submitBtnText");

  submitBtn.classList.add("loading");

  submitBtnText.textContent = "Sending...";

  // SIMULATE SUBMIT
  setTimeout(() => {

    // HIDE FORM
    document.getElementById("contactForm").style.display = "none";

    // SHOW SUCCESS
    document.getElementById("contactSuccess").style.display = "block";

    // RESET BUTTON
    submitBtn.classList.remove("loading");

    submitBtnText.textContent = "Send Message →";

    // SAVE ACTIVITY (optional)
    addContactActivity();

  }, 1400);
}

// RESET FORM AFTER SUCCESS
function resetContactForm() {

  document.getElementById("contactForm").reset();

  document.getElementById("contactForm").style.display = "block";

  document.getElementById("contactSuccess").style.display = "none";

  updateCharCount();

  clearErrors();
}

// OPTIONAL ACTIVITY LOGGER
function addContactActivity() {

  const activities =
    JSON.parse(localStorage.getItem("tp_activities") || "[]");

  activities.unshift({
    icon: "📬",
    title: "Contact Form Submitted",
    desc: "You sent a message to TechPick support",
    time: new Date().toLocaleString()
  });

  localStorage.setItem(
    "tp_activities",
    JSON.stringify(activities.slice(0, 20))
  );
}

// AUTO-FILL EMAIL IF USER LOGGED IN
document.addEventListener("DOMContentLoaded", () => {

  updateCharCount();

  // Autofill email from auth.js
  if (typeof getCurrentUser === "function") {

    const user = getCurrentUser();

    if (user && user.email) {

      document.getElementById("contactEmail").value =
        user.email;
    }

    if (user && user.firstName) {

      document.getElementById("contactFirst").value =
        user.firstName;
    }

    if (user && user.lastName) {

      document.getElementById("contactLast").value =
        user.lastName;
    }
  }
});