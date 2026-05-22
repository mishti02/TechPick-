// ========================
//  HOME PAGE — home.js
// ========================

// ========================
//  QUIZ
// ========================
let quizAnswers = {};

function quizAnswer(step, value) {
  quizAnswers["step" + step] = value;
  document.getElementById("step" + step).classList.remove("active");

  if (step < 3) {
    document.getElementById("step" + (step + 1)).classList.add("active");
    document.getElementById("dot" + (step + 1)).classList.add("active");
  } else {
    document.getElementById("quizProgress").style.display = "none";
    showQuizResult();
  }
}

function showQuizResult() {
  const use    = quizAnswers.step1;
  const budget = quizAnswers.step2;
  let category, icon, title, desc;

  if (use === "fitness") {
    category = "smartwatch"; icon = "⌚"; title = "Smartwatch";
    desc = "Based on your fitness goals, a smartwatch is your best pick. Track workouts, heart rate, and sleep all in one.";
  } else if (use === "work" && (budget === "high" || budget === "premium")) {
    category = "laptop"; icon = "💻"; title = "Laptop";
    desc = "For work and study with a higher budget, a powerful laptop will serve you best for productivity.";
  } else if (use === "work" && (budget === "low" || budget === "mid")) {
    category = "tablet"; icon = "📟"; title = "Tablet";
    desc = "A tablet is a great affordable pick for work and study — portable, lightweight, and capable.";
  } else if (use === "entertainment") {
    category = "headphones"; icon = "🎧"; title = "Premium Audio";
    desc = "For entertainment, great headphones or earbuds will transform your experience. Start here!";
  } else if (use === "photography") {
    category = "smartphone"; icon = "📱"; title = "Smartphone";
    desc = "Modern smartphones have incredible cameras. A flagship phone will be your best photography companion.";
  } else {
    category = "smartphone"; icon = "📱"; title = "Smartphone";
    desc = "A smartphone is the most versatile gadget — great for almost anything you need.";
  }

  document.getElementById("quizResultIcon").textContent  = icon;
  document.getElementById("quizResultTitle").textContent = "We recommend: " + title;
  document.getElementById("quizResultDesc").textContent  = desc;
  document.getElementById("quizResultLink").href = "finder.html?cat=" + category;
  document.getElementById("quizResult").classList.add("active");
}

function resetQuiz() {
  quizAnswers = {};
  document.querySelectorAll(".quiz-step").forEach(s => s.classList.remove("active"));
  document.getElementById("step1").classList.add("active");
  document.querySelectorAll(".qp-dot").forEach(d => d.classList.remove("active"));
  document.getElementById("dot1").classList.add("active");
  document.getElementById("quizProgress").style.display = "flex";
}

// ========================
//  DEAL OF THE DAY TIMER
//  setInterval — BOM lecture 31-34
// ========================
function startDealTimer() {
  // Check element exists before starting
  if (!document.getElementById("tHours")) return;

  const interval = setInterval(() => {
    const now      = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    const diff = midnight - now;

    if (diff <= 0) {
      clearInterval(interval);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("tHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("tMins").textContent  = String(mins).padStart(2, "0");
    document.getElementById("tSecs").textContent  = String(secs).padStart(2, "0");
  }, 1000);
}

// ========================
//  COMPARE DEVICES
//  Arrays + DOM — lectures 17-26
// ========================
let compareSelected = [];

function renderCompareCards() {
  const grid = document.getElementById("comparePickGrid");
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="compare-pick-card" id="cpc-${p.id}" onclick="toggleCompare(${p.id})">
      <div class="cpc-emoji"><img src="${p.image}" alt="${p.name}" style="width:60px;height:60px;object-fit:contain;"/></div>
      <div class="cpc-info">
        <strong>${p.name}</strong>
        <span>${p.brand} · ${formatPrice(p.price)}</span>
      </div>
    </div>
  `).join("");
}

function toggleCompare(id) {
  const idx = compareSelected.indexOf(id);

  if (idx > -1) {
    compareSelected.splice(idx, 1);
    document.getElementById("cpc-" + id).classList.remove("picked");
  } else {
    if (compareSelected.length >= 2) {
      showToast("You can only compare 2 devices at a time");
      return;
    }
    compareSelected.push(id);
    document.getElementById("cpc-" + id).classList.add("picked");
  }

  const info = document.getElementById("compareInfo");
  if (!info) return;
  if (compareSelected.length === 0)      info.innerHTML = "Select 2 devices to compare";
  else if (compareSelected.length === 1) info.innerHTML = "<strong>1</strong> selected — pick one more";
  else                                   info.innerHTML = "<strong>2</strong> selected — ready to compare!";
}

function openCompare() {
  if (compareSelected.length < 2) {
    showToast("Please select 2 devices first");
    return;
  }

  const p1 = products.find(p => p.id === compareSelected[0]);
  const p2 = products.find(p => p.id === compareSelected[1]);

  // Comparison rows without emoji, category, badge
  const rows = [
    ["Device",    p1.name,                    p2.name],
    ["Brand",     p1.brand,                   p2.brand],
    ["Price",     formatPrice(p1.price),      formatPrice(p2.price)],
    ["Rating",    "⭐ " + p1.rating,           "⭐ " + p2.rating],
    ["Reviews",   p1.reviews.toLocaleString(), p2.reviews.toLocaleString()]
  ];

  // Build table
  let tableHTML = `
    <thead>
      <tr>
        <th></th>
        <th>${p1.name}</th>
        <th>${p2.name}</th>
      </tr>
    </thead>
    <tbody>
  `;

  rows.forEach(([label, val1, val2]) => {
    let class1 = "", class2 = "";

    // Better value highlighting
    if (label === "Price") {
      if (p1.price < p2.price) class1 = "better";
      else if (p2.price < p1.price) class2 = "better";
    }
    if (label === "Rating") {
      if (p1.rating > p2.rating) class1 = "better";
      else if (p2.rating > p1.rating) class2 = "better";
    }

    tableHTML += `
      <tr>
        <td class="row-label">${label}</td>
        <td class="${class1}">${val1}</td>
        <td class="${class2}">${val2}</td>
      </tr>
    `;
  });

  tableHTML += `</tbody>`;
  document.getElementById("compareTable").innerHTML = tableHTML;
  document.getElementById("compareModal").classList.add("open");
}

function closeCompare() {
  document.getElementById("compareModal").classList.remove("open");
}

function clearCompare() {
  compareSelected = [];
  document.querySelectorAll(".compare-pick-card").forEach(c => c.classList.remove("picked"));
  const info = document.getElementById("compareInfo");
  if (info) info.innerHTML = "Select 2 devices to compare";
}

// ========================
//  TESTIMONIALS
// ========================
const testimonials = [
  { name: "Aarav M.",  initial: "A", device: "Bought MacBook Air M3",      stars: 5, text: "TechPick helped me choose between 6 laptops in under 5 minutes. The budget slider is so intuitive — found exactly what I needed without going over budget." },
  { name: "Priya S.",  initial: "P", device: "Bought iPhone 15 Pro",        stars: 5, text: "The comparison feature is brilliant. I was torn between iPhone 15 and 15 Pro — seeing them side by side made the decision obvious." },
  { name: "Rohan K.",  initial: "R", device: "Bought Sony WH-1000XM5",      stars: 5, text: "Took the quiz, it recommended Audio — browsed for 2 minutes and ordered the XM5. Absolute game changer." },
  { name: "Sneha T.",  initial: "S", device: "Bought OnePlus 12",           stars: 4, text: "Filtered by brand and budget and found the OnePlus 12 within my range. Clean site, no ads, just straight recommendations." },
  { name: "Dev P.",    initial: "D", device: "Bought iPad Air M1",          stars: 5, text: "As a student I needed something affordable but powerful. The budget slider narrowed it down perfectly." },
  { name: "Kavya R.",  initial: "K", device: "Bought Samsung Galaxy S24",   stars: 4, text: "Loved how I could filter by Samsung only and see all their devices in one place. Very helpful site!" },
];

function renderTestimonials() {
  const track = document.getElementById("testimonialsTrack");
  if (!track) return;

  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="t-stars">${"★".repeat(t.stars)}</div>
      <p class="t-text">"${t.text}"</p>
      <div class="t-author">
        <div class="t-avatar">${t.initial}</div>
        <div>
          <div class="t-name">${t.name}</div>
          <div class="t-device">${t.device}</div>
        </div>
      </div>
    </div>
  `).join("");
}




// ========================
//  NEWSLETTER
// ========================
function subscribeNewsletter() {
  const email = document.getElementById("newsletterEmail").value.trim();
  if (!email) {
    showToast("Please enter your email address");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    showToast("Please enter a valid email address");
    return;
  }
  document.getElementById("newsletterSuccess").style.display = "block";
  document.getElementById("newsletterEmail").value = "";
  showToast("Subscribed successfully! 🎉");
}

// ========================
//  SINGLE DOMContentLoaded
//  All home page init here
// ========================
document.addEventListener("DOMContentLoaded", () => {
  startDealTimer();
  renderCompareCards();
  renderTestimonials();
});
