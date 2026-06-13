const heroSlides = document.querySelectorAll(".hero-bg");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const unitButtons = document.querySelectorAll(".unit-btn");
const lengthInput = document.querySelector("#lengthInput");
const widthInput = document.querySelector("#widthInput");
const materialInput = document.querySelector("#materialInput");
const estimateValue = document.querySelector("#estimateValue");
const areaValue = document.querySelector("#areaValue");
const calculatorForm = document.querySelector(".calculator");

let activeSlide = 0;
let activeUnit = "ft";

function rotateHero() {
  heroSlides[activeSlide].classList.remove("is-active");
  activeSlide = (activeSlide + 1) % heroSlides.length;
  heroSlides[activeSlide].classList.add("is-active");
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 60);
}

function getRatePerSqFt(material) {
  const rates = {
    granite: 450,
    tiles: 220,
    premium: 720
  };

  return rates[material] || rates.granite;
}

function formatIndianCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function calculateEstimate() {
  const length = Number(lengthInput.value) || 0;
  const width = Number(widthInput.value) || 0;
  const rawArea = length * width;
  const areaInSqFt = activeUnit === "m" ? rawArea * 10.7639 : rawArea;
  const estimate = Math.round(areaInSqFt * getRatePerSqFt(materialInput.value));
  const displayArea = activeUnit === "m"
    ? `${rawArea.toFixed(1)} sq m / ${areaInSqFt.toFixed(0)} sq ft`
    : `${areaInSqFt.toFixed(0)} sq ft`;

  estimateValue.textContent = formatIndianCurrency(estimate);
  areaValue.textContent = displayArea;
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

unitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeUnit = button.dataset.unit;
    unitButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    calculateEstimate();
  });
});

[lengthInput, widthInput, materialInput].forEach((input) => {
  input.addEventListener("input", calculateEstimate);
});

calculatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

window.addEventListener("scroll", updateHeader, { passive: true });

setInterval(rotateHero, 5200);
updateHeader();
calculateEstimate();
