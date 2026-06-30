/* src/app.js */

import { opticalLayouts } from "./data/layouts.js";
import state from "./state.js";

/**
 * Renders the left sidebar list of optical layouts as a flat, numbered educational syllabus.
 * Matches Section VIII of addon.md exactly.
 */
export function renderLayoutList(container, setLayoutCallback) {
  if (!container) return;
  container.innerHTML = "";

  // The 12-item syllabus order
  const syllabusOrder = [
    "overview",
    "ramanStandard",
    "ramanPolarized",
    "plStandard",
    "plPolarized",
    "plValley",
    "shgPolarized",
    "lifetime",
    "laserIntro",
    "spectrometerIntro",
    "componentLib",
    "signalFlow"
  ];

  syllabusOrder.forEach((layoutId, idx) => {
    const layout = opticalLayouts[layoutId];
    if (!layout) return;

    const card = document.createElement("div");
    card.className = `layout-card ${state.currentLayoutId === layout.id ? "active" : ""}`;
    card.setAttribute("data-id", layout.id);

    // Number prefix
    const numPrefix = document.createElement("div");
    numPrefix.className = "syllabus-number";
    numPrefix.textContent = (idx + 1).toString().padStart(2, "0");
    card.appendChild(numPrefix);

    const textContainer = document.createElement("div");
    textContainer.className = "syllabus-text";

    const h4 = document.createElement("h4");
    h4.textContent = layout.title;
    textContainer.appendChild(h4);

    const p = document.createElement("p");
    p.textContent = layout.subtitle;
    textContainer.appendChild(p);

    card.appendChild(textContainer);

    // Event listener to switch layout
    card.addEventListener("click", () => {
      document.querySelectorAll(".layout-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      setLayoutCallback(layout.id);
    });

    container.appendChild(card);
  });

  // Update layout total count in sidebar header badge
  const countBadge = document.querySelector("#layout-count");
  if (countBadge) {
    countBadge.textContent = "12 个专题";
  }
}

/**
 * Dynamic legends based on current layout category.
 */
export function updateCanvasLegend(container, layout) {
  if (!container) return;
  container.innerHTML = "";

  const legends = [];
  
  if (layout.id === "overview") {
    legends.push({ name: "激光发射源", color: "var(--laser-green)" });
    legends.push({ name: "共焦发光路径", color: "var(--beam-raman)" });
  } else if (layout.id.startsWith("raman") || layout.id.includes("Raman")) {
    legends.push({ name: "532nm 激发激光 (CW)", color: "var(--laser-green)" });
    legends.push({ name: "Raman 散射信号", color: "var(--beam-raman)" });
  } else if (layout.id.startsWith("pl") || layout.id === "lifetime") {
    legends.push({ name: "532nm 激发光 (CW/ps)", color: "var(--laser-green)" });
    legends.push({ name: "PL 荧光信号", color: "var(--beam-pl)" });
  } else if (layout.id.startsWith("shg")) {
    legends.push({ name: "1064nm 基频红外 (ω)", color: "var(--laser-ir)" });
    legends.push({ name: "532nm 二倍频绿光 (2ω)", color: "var(--laser-green)" });
    legends.push({ name: "被滤除基频波段", color: "var(--beam-blocked)" });
  } else {
    legends.push({ name: "工作测试光路", color: "var(--laser-red)" });
  }

  legends.forEach(item => {
    const el = document.createElement("div");
    el.className = "legend-item";

    const colorBar = document.createElement("span");
    colorBar.className = "legend-color";
    colorBar.style.backgroundColor = item.color;
    colorBar.style.boxShadow = `0 0 6px ${item.color}`;
    el.appendChild(colorBar);

    const name = document.createElement("span");
    name.textContent = item.name;
    el.appendChild(name);

    container.appendChild(el);
  });
}
