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

  const groups = [
    {
      title: "Ⅰ. 平台总览与理论基础",
      color: "#3b82f6", // Blue
      layouts: ["overview", "laserIntro", "spectrometerIntro", "componentLib"]
    },
    {
      title: "Ⅱ. 显微拉曼光谱测试",
      color: "#10b981", // Green (532nm)
      layouts: ["ramanIntro", "ramanStandard", "ramanVV", "ramanVH", "ramanPolarized"]
    },
    {
      title: "Ⅲ. 光致发光与寿命测试",
      color: "#ec4899", // Pink
      layouts: ["plIntro", "plStandard", "plPolarized", "plValley", "lifetime"]
    },
    {
      title: "Ⅳ. 非线性倍频测试 (SHG)",
      color: "#f97316", // Orange (1064nm -> 532nm)
      layouts: ["shgIntro", "shgStandard", "shgPolarized"]
    },
    {
      title: "Ⅴ. 硬件数据集成链路",
      color: "#8b5cf6", // Purple
      layouts: ["signalFlow"]
    }
  ];

  let absoluteIndex = 1;

  groups.forEach(group => {
    // 1. Render Group Header
    const header = document.createElement("div");
    header.className = "category-title";
    header.style.color = group.color;
    header.style.marginTop = "14px";
    header.style.marginBottom = "6px";
    header.style.fontWeight = "800";
    header.style.fontSize = "0.75rem";
    header.style.letterSpacing = "0.5px";
    header.textContent = group.title;
    container.appendChild(header);

    // 2. Render Cards in this Group
    group.layouts.forEach(layoutId => {
      const layout = opticalLayouts[layoutId];
      if (!layout) return;

      const card = document.createElement("div");
      card.className = `layout-card ${state.currentLayoutId === layout.id ? "active" : ""}`;
      card.setAttribute("data-id", layout.id);
      
      // Color-coding left border for differentiation
      card.style.borderLeft = `4px solid ${group.color}`;

      // Number prefix
      const numPrefix = document.createElement("div");
      numPrefix.className = "syllabus-number";
      numPrefix.style.color = group.color;
      numPrefix.textContent = absoluteIndex.toString().padStart(2, "0");
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
      absoluteIndex++;
    });
  });

  // Update layout total count in sidebar header badge
  const countBadge = document.querySelector("#layout-count");
  if (countBadge) {
    countBadge.textContent = "17 个专题";
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
