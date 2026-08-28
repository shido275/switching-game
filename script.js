/**
 * Game-Switch OBS Overlay — JavaScript Logic
 * Structured like the starting-soon screen: a CONFIG object at the top,
 * then everything initialized on DOMContentLoaded.
 */

// ------------------------------------------------------------------
// 1. CONFIGURATION — edit these to customize without touching CSS/HTML
// ------------------------------------------------------------------
const CONFIG = {
  // Headline as two stacked lines. Line 2 renders in amber.
  line1: "SWITCHING",
  line2: "GAME",

  // Eyebrow label above the title
  eyebrow: "PLEASE STAND BY",

  // Scrolling marquee + boot ticker lines (Fallout terminal flavour)
  marquee: [
    "TERMINAL LINK ESTABLISHED",
    "LOADING GAME ASSETS",
    "PLEASE STAND BY",
    "NO SIGNAL — TRY SWITCHING CHANNELS",
  ],
  bootLines: [
    "> ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL",
    "> ENTERING GAME...",
    "> CHECKING AUDIO... OK",
    "> INITIALIZING SAVE DATA... OK",
    "> CONNECTED — GOOD LUCK, OPERATOR",
  ],

  // Loading bar configuration
  barCells: 24,        // number of pixel blocks in the bar
  barInterval: 240,    // ms between fills
};

// ------------------------------------------------------------------
// 2. BOOT — apply config and initialize systems
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  applyStaticText();
  initMarquee();
  initBootTicker();
  initLoadingBar();
});

// ------------------------------------------------------------------
// 3. APPLY STATIC TEXT
// ------------------------------------------------------------------
function applyStaticText() {
  document.getElementById("line1").textContent = CONFIG.line1;
  document.getElementById("line2").textContent = CONFIG.line2;
  document.getElementById("eyebrow").textContent = CONFIG.eyebrow;
}

// ------------------------------------------------------------------
// 4. SCROLLING MARQUEE
// ------------------------------------------------------------------
function initMarquee() {
  const marqueeEl = document.getElementById("marquee");
  const items = (Array.isArray(CONFIG.marquee) && CONFIG.marquee.length)
    ? CONFIG.marquee
    : ["GAME SWITCHING"];
  marqueeEl.innerHTML = items
    .slice(0, 3)
    .map((t) => `<span class="m">★ ${t}</span>`)
    .join("");
}

// ------------------------------------------------------------------
// 5. BOOT TICKER — typewriter that cycles through boot lines
// ------------------------------------------------------------------
function initBootTicker() {
  const bootEl = document.getElementById("boot");
  const items = (Array.isArray(CONFIG.bootLines) && CONFIG.bootLines.length)
    ? CONFIG.bootLines
    : ["> BOOT OK"];

  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    const line = items[lineIndex % items.length];
    bootEl.classList.add("prompt");

    const interval = setInterval(() => {
      charIndex++;
      bootEl.textContent = line.slice(0, charIndex);
      if (charIndex >= line.length) {
        clearInterval(interval);
        charIndex = 0;
        lineIndex++;
        setTimeout(typeLine, 1100); // pause between lines
      }
    }, 55);
  }

  typeLine();
}

// ------------------------------------------------------------------
// 6. PIXEL LOADING BAR — fills block by block, then wipes & reloops
// ------------------------------------------------------------------
function initLoadingBar() {
  const barEl = document.getElementById("pixelbar");
  const pctEl = document.getElementById("pct");
  const cells = CONFIG.barCells;

  for (let i = 0; i < cells; i++) {
    barEl.appendChild(document.createElement("i"));
  }

  const fillIcons = ["█", "▓", "▒", "░"];
  let filled = 0;

  const loadStep = () => {
    filled++;
    const el = barEl.children[(filled - 1) % cells];
    el.textContent = fillIcons[(filled - 1) % fillIcons.length];
    el.classList.add("fill");
    el.style.width = 0.6 + (((filled - 1) % cells) / cells) * 100 + "%";
    pctEl.textContent = (filled % (cells + 1)) + "%";

    if (filled % cells === 0) {
      setTimeout(() => {
        Array.from(barEl.children).forEach((c) => c.classList.remove("fill"));
        pctEl.textContent = "0%";
        filled = 0;
      }, 900);
    }
  };

  setInterval(loadStep, CONFIG.barInterval);
}