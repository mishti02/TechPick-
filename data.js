// ========================
//  TECHPICK — PRODUCT DATA
// ========================

const products = [
  // --- SMARTPHONES ---
  { id: 1,  name: "iPhone 15 Pro",            image:"./products-images/iphone 15 pro.jpg",    brand: "Apple",   category: "smartphone",  price: 134900, rating: 4.8, reviews: 3241, desc: "Titanium build, A17 Pro chip, 48MP ProCamera system",      badge: "Best Seller", trending: true,  exploreUrl: "https://www.apple.com/iphone-15-pro/" },
  { id: 2,  name: "iPhone 15",                image:"./products-images/iphone 15.jpg",         brand: "Apple",   category: "smartphone",  price: 79900,  rating: 4.6, reviews: 2100, desc: "Dynamic Island, USB-C, 48MP main camera, A16 Bionic",      badge: null,          trending: false, exploreUrl: "https://www.apple.com/iphone-15/" },
  { id: 3,  name: "Samsung Galaxy S24 Ultra", image:"./products-images/s24 ultra.jpg",         brand: "Samsung", category: "smartphone",  price: 129999, rating: 4.7, reviews: 2890, desc: "200MP camera, built-in S Pen, Snapdragon 8 Gen 3",          badge: "Top Rated",   trending: true,  exploreUrl: "https://www.samsung.com/global/galaxy/galaxy-s24-ultra/" },
  { id: 4,  name: "Samsung Galaxy S24",       image:"./products-images/s24.jpg",               brand: "Samsung", category: "smartphone",  price: 74999,  rating: 4.5, reviews: 1870, desc: "Galaxy AI features, 50MP camera, 7-year update promise",   badge: null,          trending: false, exploreUrl: "https://www.samsung.com/global/galaxy/galaxy-s24/" },
  { id: 5,  name: "OnePlus 12",               image:"./products-images/oneplus 12.jpg",        brand: "OnePlus", category: "smartphone",  price: 64999,  rating: 4.5, reviews: 1450, desc: "Snapdragon 8 Gen 3, 100W charging, Hasselblad camera",     badge: "Value Pick",  trending: true,  exploreUrl: "https://www.oneplus.com/oneplus-12" },
  { id: 6,  name: "OnePlus 12R",              image:"./products-images/oneplus 12 r.jpg",      brand: "OnePlus", category: "smartphone",  price: 39999,  rating: 4.3, reviews: 980,  desc: "Snapdragon 8 Gen 2, 100W SuperVOOC, 5000mAh battery",    badge: null,          trending: false, exploreUrl: "https://www.oneplus.com/oneplus-12r" },
  { id: 7,  name: "Google Pixel 8 Pro",       image:"./products-images/pixel 8 pro.jpg",       brand: "Google",  category: "smartphone",  price: 106999, rating: 4.6, reviews: 1230, desc: "Tensor G3, best-in-class computational photography",       badge: null,          trending: false, exploreUrl: "https://store.google.com/product/pixel_8_pro" },
  { id: 8,  name: "Realme GT 6",              image:"./products-images/realme gt.jpg",         brand: "Realme",  category: "smartphone",  price: 34999,  rating: 4.2, reviews: 760,  desc: "Snapdragon 8s Gen 3, 120Hz AMOLED, 5500mAh battery",     badge: "Budget Pick", trending: false, exploreUrl: "https://www.realme.com/in/realme-gt6" },

  // --- LAPTOPS ---
  { id: 9,  name: "MacBook Air M3",           image:"./products-images/mackbook air m3.jpeg",  brand: "Apple",   category: "laptop",      price: 114900, rating: 4.9, reviews: 2760, desc: "Apple M3 chip, 18-hr battery, silent fanless design",       badge: "Editor's Choice", trending: true,  exploreUrl: "https://www.apple.com/macbook-air/" },
  { id: 10, name: "MacBook Pro 14\" M3",      image:"./products-images/m14.jpg",               brand: "Apple",   category: "laptop",      price: 168900, rating: 4.8, reviews: 1980, desc: "M3 Pro, Liquid Retina XDR display, 22-hr battery",        badge: null,          trending: false, exploreUrl: "https://www.apple.com/macbook-pro-14-and-16/" },
  { id: 11, name: "Dell XPS 15",              image:"./products-images/dell xps 15.jpg",       brand: "Dell",    category: "laptop",      price: 139900, rating: 4.6, reviews: 1340, desc: "Intel Core i7, RTX 4060, 15.6\" OLED, 32GB RAM",          badge: null,          trending: false, exploreUrl: "https://www.dell.com/en-us/shop/dell-laptops/xps-15-laptop/spd/xps-15-9530-laptop" },
  { id: 12, name: "Dell XPS 13",              image:"./products-images/dell xps 13.jpg",       brand: "Dell",    category: "laptop",      price: 89900,  rating: 4.4, reviews: 870,  desc: "Compact ultrabook, Core i5, 13.4\" IPS, all-day battery", badge: null,          trending: false, exploreUrl: "https://www.dell.com/en-us/shop/dell-laptops/xps-13-laptop/spd/xps-13-9340-laptop" },
  { id: 13, name: "Lenovo ThinkPad X1 Carbon",image:"./products-images/thinkpad.jpg",          brand: "Lenovo",  category: "laptop",      price: 124900, rating: 4.7, reviews: 1560, desc: "Ultra-light business laptop, Core i7, MIL-SPEC durability", badge: "Business",  trending: false, exploreUrl: "https://www.lenovo.com/in/en/laptops/thinkpad/thinkpad-x1/thinkpad-x1-carbon-gen-11/p/len101t0009" },
  { id: 14, name: "Lenovo IdeaPad Slim 5",    image:"./products-images/ideapad.jpg",           brand: "Lenovo",  category: "laptop",      price: 49990,  rating: 4.3, reviews: 1020, desc: "AMD Ryzen 5, 8GB RAM, 16\" display — great everyday value", badge: "Budget Pick", trending: true,  exploreUrl: "https://www.lenovo.com/in/en/laptops/ideapad/ideapad-500-series/IdeaPad-Slim-5-Gen-8-16-inch-AMD/p/LEN101I0050" },
  { id: 15, name: "ASUS ROG Zephyrus G14",    image:"./products-images/asus rog.jpg",          brand: "ASUS",    category: "laptop",      price: 124990, rating: 4.7, reviews: 1340, desc: "Ryzen 9, RX 7900S GPU, best gaming ultrabook available",  badge: "Gaming Pick", trending: true,  exploreUrl: "https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g14-2024/" },

  // --- HEADPHONES / AUDIO ---
  { id: 16, name: "AirPods Pro (2nd Gen)",    image:"./products-images/airpods pro 2nd gen.jpg", brand: "Apple",  category: "headphones",  price: 24900,  rating: 4.8, reviews: 5430, desc: "Best-in-class ANC, Transparency mode, MagSafe charging",  badge: "Best Seller", trending: true,  exploreUrl: "https://www.apple.com/airpods-pro/" },
  { id: 17, name: "Sony WH-1000XM5",          image:"./products-images/sony wh.jpg",            brand: "Sony",   category: "headphones",  price: 26990,  rating: 4.8, reviews: 4210, desc: "Industry-leading ANC, 30-hr playback, multipoint connect", badge: "Top Rated",   trending: true,  exploreUrl: "https://www.sony.co.in/en/headphones/products/wh-1000xm5" },
  { id: 18, name: "Sony WF-1000XM5",          image:"./products-images/sony wf.jpg",            brand: "Sony",   category: "headphones",  price: 19990,  rating: 4.7, reviews: 2780, desc: "Flagship earbuds, best ANC, LDAC Hi-Res audio",           badge: null,          trending: false, exploreUrl: "https://www.sony.co.in/en/headphones/products/wf-1000xm5" },
  { id: 19, name: "Samsung Galaxy Buds3 Pro", image:"./products-images/galaxy buds 3 pro.jpg",  brand: "Samsung",category: "headphones",  price: 17999,  rating: 4.4, reviews: 1230, desc: "Blade-tip design, intelligent ANC, 360 Audio, IPX7 rated", badge: null,         trending: false, exploreUrl: "https://www.samsung.com/global/galaxy/galaxy-buds3-pro/" },
  { id: 20, name: "Bose QuietComfort 45",     image:"./products-images/bose quietcomfort.jpg",  brand: "Bose",   category: "headphones",  price: 22900,  rating: 4.6, reviews: 3120, desc: "Premium comfort, world-class ANC, 24-hr battery life",     badge: null,          trending: false, exploreUrl: "https://www.bose.com/headphones/over-ear-headphones/quietcomfort-headphones" },
  { id: 21, name: "OnePlus Buds Pro 2",       image:"./products-images/oneplus buds pro2.jpg",  brand: "OnePlus",category: "headphones",  price: 9999,   rating: 4.3, reviews: 890,  desc: "ANC, 9-hr playback, Dynaudio tuning, great value pick",   badge: "Value Pick",  trending: false, exploreUrl: "https://www.oneplus.com/oneplus-buds-pro-2" },

  // --- TABLETS ---
  { id: 22, name: "iPad Pro 12.9\" M2",       image:"./products-images/12.9.jpg",              brand: "Apple",   category: "tablet",      price: 112900, rating: 4.8, reviews: 2100, desc: "M2 chip, ProMotion, Liquid Retina XDR, USB4 Thunderbolt",  badge: "Top Rated",   trending: true,  exploreUrl: "https://www.apple.com/ipad-pro/" },
  { id: 23, name: "iPad Air M1",              image:"./products-images/air.jpg",               brand: "Apple",   category: "tablet",      price: 59900,  rating: 4.6, reviews: 1780, desc: "M1 chip, 10.9\" Liquid Retina display, USB-C, Touch ID",  badge: "Best Value",  trending: false, exploreUrl: "https://www.apple.com/ipad-air/" },
  { id: 24, name: "Samsung Galaxy Tab S9",    image:"./products-images/s9.jpg",               brand: "Samsung", category: "tablet",      price: 72999,  rating: 4.5, reviews: 1430, desc: "Snapdragon 8 Gen 2, Dynamic AMOLED, S Pen included",      badge: null,          trending: false, exploreUrl: "https://www.samsung.com/global/galaxy/galaxy-tab-s9/" },
  { id: 25, name: "Lenovo Tab P12 Pro",       image:"./products-images/p12.jpg",              brand: "Lenovo",  category: "tablet",      price: 44990,  rating: 4.2, reviews: 670,  desc: "12.6\" AMOLED, Snapdragon 870, Precision Pen 3 included", badge: "Budget Pick", trending: false, exploreUrl: "https://www.lenovo.com/in/en/tablets/lenovo/lenovo-tab-series/Lenovo-Tab-P12-Pro/p/ZZITZTBP2A3" },

  // --- SMARTWATCHES ---
  { id: 26, name: "Apple Watch Series 9",     image:"./products-images/series 9.jpg",         brand: "Apple",   category: "smartwatch",  price: 41900,  rating: 4.7, reviews: 2980, desc: "S9 chip, double-tap gesture, full health sensor suite",     badge: "Best Seller", trending: true,  exploreUrl: "https://www.apple.com/apple-watch-series-9/" },
  { id: 27, name: "Apple Watch Ultra 2",      image:"./products-images/ultra 2.jpg",          brand: "Apple",   category: "smartwatch",  price: 89900,  rating: 4.8, reviews: 1540, desc: "Titanium, 60-hr battery, built for adventure & diving",    badge: null,          trending: false, exploreUrl: "https://www.apple.com/apple-watch-ultra-2/" },
  { id: 28, name: "Samsung Galaxy Watch 6",   image:"./products-images/watch 6.jpg",          brand: "Samsung", category: "smartwatch",  price: 26999,  rating: 4.4, reviews: 1120, desc: "Blood pressure & ECG, 40-hr battery, BioActive sensor",   badge: null,          trending: false, exploreUrl: "https://www.samsung.com/global/galaxy/galaxy-watch6/" },
  { id: 29, name: "OnePlus Watch 2",          image:"./products-images/watch 2.jpg",          brand: "OnePlus", category: "smartwatch",  price: 24999,  rating: 4.2, reviews: 780,  desc: "Wear OS, 100-hr battery life, dual-chip architecture",     badge: "Value Pick",  trending: false, exploreUrl: "https://www.oneplus.com/oneplus-watch-2" },
];

// ========================
//  BRANDS DATA
// ========================
const brands =[
   {
    name: "Apple",
    logo: "apple.jpg",
    tagline: "Think Different",
    color: "#555"
  },
  {
    name: "Samsung",
    logo: "samsung.png",
    tagline: "Do What You Can't",
    color: "#1428A0"
  },
  {
    name: "Sony",
    logo: "sony.jpg",
    tagline: "Be Moved",
    color: "#000"
  },
   {
    name: "Lenovo",
    logo: "lenovo.jpg",
    tagline: "Smarter Technology",
    color: "#E2231A"
  },
  {
    name: "OnePlus",
    logo: "oneplus.jpg",
    tagline: "Never Settle",
    color: "#F5010C"
  },
  {
    name: "Dell",
    logo: "dell.jpg",
    tagline: "The Power to Do More",
    color: "#007DB8"
  },
  {
    name: "Google",
    logo: "google.webp",
    tagline: "Helpful by Default",
    color: "#4285F4"
  },
  {
    name: "ASUS",
    logo: "asus.jpg",
    tagline: "In Search of Incredible",
    color: "#00539B"
  },
  {
    name: "Bose",
    logo: "bose.jpg",
    tagline: "Better Sound Through Research",
    color: "#000"
  },
  {
    name: "Realme",
    logo: "realme.jpg",
    tagline: "Dare to Leap",
    color: "#FFD700"
  }
] 
