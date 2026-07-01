/* src/render/renderInfoPages.js */

import state from "../state.js";
import { componentPresets } from "../data/componentPresets.js";

/**
 * Renders custom interactive SVG dashboards for the educational info-pages.
 */
export function renderInfoPage(svg, pageId) {
  svg.innerHTML = "";

  // Set background card style
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", "1600");
  bg.setAttribute("height", "900");
  bg.setAttribute("fill", "var(--bg-page)");
  svg.appendChild(bg);

  // Border frame
  const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  border.setAttribute("x", "0");
  border.setAttribute("y", "0");
  border.setAttribute("width", "1600");
  border.setAttribute("height", "900");
  border.setAttribute("fill", "none");
  border.setAttribute("stroke", "var(--border-card)");
  border.setAttribute("stroke-width", "2");
  svg.appendChild(border);

  // Create defs
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="laser-grad-cw" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--laser-green)" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="var(--laser-green)" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="laser-grad-fs" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--laser-ir)" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="var(--laser-ir)" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="dispersion-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  `;
  svg.appendChild(defs);

  switch (pageId) {
    case "overview":
      renderOverviewPage(svg);
      break;
    case "laserIntro":
      renderLaserIntroPage(svg);
      break;
    case "spectrometerIntro":
      renderSpectrometerIntroPage(svg);
      break;
    case "componentLib":
      renderComponentLibPage(svg);
      break;
    case "signalFlow":
      renderSignalFlowPage(svg);
      break;
    case "ramanIntro":
      renderRamanIntroPage(svg);
      break;
    case "plIntro":
      renderPlIntroPage(svg);
      break;
    case "shgIntro":
      renderShgIntroPage(svg);
      break;
    default:
      renderDefaultInfoPage(svg, pageId);
  }
}

// 1. Overview Page
function renderOverviewPage(svg) {
  // Title
  drawText(svg, "多功能共焦显微光谱系统总览 (Confocal Platform Overview)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "集成式 Raman / PL / SHG 显微测试平台基本架构", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  // Draw experimental table breadboard
  const table = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  table.setAttribute("x", "100");
  table.setAttribute("y", "160");
  table.setAttribute("width", "1400");
  table.setAttribute("height", "660");
  table.setAttribute("fill", "#111827");
  table.setAttribute("stroke", "#1f2937");
  table.setAttribute("stroke-width", "4");
  table.setAttribute("rx", "12");
  svg.appendChild(table);

  // Draw some optical breadboard hole patterns
  for (let x = 150; x <= 1450; x += 100) {
    for (let y = 200; y <= 780; y += 80) {
      const hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      hole.setAttribute("cx", x);
      hole.setAttribute("cy", y);
      hole.setAttribute("r", "2");
      hole.setAttribute("fill", "rgba(255,255,255,0.06)");
      svg.appendChild(hole);
    }
  }

  // Draw Laser Modules on left
  drawBoxCard(svg, 150, 220, 220, 100, "532nm CW Laser", "拉曼/稳态PL激发源", "var(--laser-green)");
  drawBoxCard(svg, 150, 360, 220, 100, "1064nm fs Pulsed Laser", "二次谐波 (SHG) 超快激发源", "var(--laser-ir)");
  drawBoxCard(svg, 150, 500, 220, 100, "ps/fs Pulsed Laser", "荧光寿命测量激发源", "#ec4899");

  // Draw Central Confocal Microscope
  drawConfocalScope(svg, 750, 430);

  // Draw Detection modules on right
  drawBoxCard(svg, 1200, 250, 250, 120, "高分辨光谱仪 (Spectrometer)", "1800 g/mm (Raman) / 150 g/mm (PL)\nCzerny-Turner 反射式色散结构", "var(--beam-raman)");
  drawBoxCard(svg, 1200, 430, 250, 100, "Scientific CCD / Detector", "高灵敏度背感光深冷 CCD\n用于捕获微弱光谱特征", "var(--success)");
  drawBoxCard(svg, 1200, 580, 250, 110, "SPAD / TCSPC 寿命采集", "单光子雪崩二极管探测器\n时间相关单光子统计计时", "#ec4899");

  // Draw light path lines connecting them
  // 532nm path
  drawBeamPath(svg, [[370, 270], [550, 270], [550, 430], [670, 430]], "var(--laser-green)", 3, true);
  // 1064nm path
  drawBeamPath(svg, [[370, 410], [500, 410], [500, 430], [670, 430]], "var(--laser-ir)", 3.5, true);
  // Pulsed path
  drawBeamPath(svg, [[370, 550], [600, 550], [600, 450], [670, 430]], "#ec4899", 3, true);

  // Microscope vertical arm down to sample
  drawBeamPath(svg, [[750, 430], [750, 680]], "var(--laser-green)", 3.5, false);
  drawBeamPath(svg, [[750, 680], [750, 430]], "var(--beam-raman)", 3.5, false);

  // Signal collection lines to detectors
  drawBeamPath(svg, [[750, 430], [1050, 430]], "var(--beam-raman)", 3.5, true);
  // to Spectrometer
  drawBeamPath(svg, [[1050, 430], [1050, 310], [1200, 310]], "var(--beam-raman)", 3, true);
  // to Lifetime APD
  drawBeamPath(svg, [[1050, 430], [1050, 635], [1200, 635]], "#ec4899", 3, true);
}

// 2. Laser Intro Page
function renderLaserIntroPage(svg) {
  drawText(svg, "激发光源与激光器分类说明 (Laser Source & Selection)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });

  // 3 Laser Cards
  const lasers = [
    {
      title: "1. 连续激光器 (CW Laser)",
      color: "var(--laser-green)",
      desc: "输出功率恒定、光谱纯净、相干长度长。是最常用的光谱激发源。",
      waveType: "cw",
      specs: [
        ["典型波长", "532 nm, 633 nm, 785 nm"],
        ["脉冲宽度", "连续波 (CW) / 无脉冲"],
        ["主要用途", "稳态拉曼光谱 (Raman)、发光光谱 (PL)"],
        ["适用模块", "标准拉曼、偏振拉曼、标准 PL"]
      ]
    },
    {
      title: "2. 皮秒激光器 (Picosecond Laser)",
      color: "#ec4899",
      desc: "发射 ps 量级的超短脉冲，具有很高的时间分辨能力，且光谱宽度适中。",
      waveType: "ps",
      specs: [
        ["典型波长", "405 nm, 515 nm, 800 nm"],
        ["脉冲宽度", "1 ps - 100 ps"],
        ["主要用途", "时间分辨发光光谱 (TRPL)、寿命测量"],
        ["适用模块", "时间分辨荧光寿命测量"]
      ]
    },
    {
      title: "3. 飞秒激光器 (Femtosecond Laser)",
      color: "var(--laser-ir)",
      desc: "发射 fs 量级的超快脉冲，拥有极高的峰值功率，能诱导强非线性效应。",
      waveType: "fs",
      specs: [
        ["典型波长", "1064 nm, 800 nm (Ti:Sapphire)"],
        ["脉冲宽度", "50 fs - 150 fs"],
        ["主要用途", "二次谐波 (SHG)、超快非线性光学"],
        ["适用模块", "标准二倍频、极分辨 SHG 偏振"]
      ]
    }
  ];

  lasers.forEach((laser, idx) => {
    const startX = 120 + idx * 460;
    
    // Draw card background
    const card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    card.setAttribute("x", startX);
    card.setAttribute("y", 150);
    card.setAttribute("width", "420");
    card.setAttribute("height", "620");
    card.setAttribute("fill", "var(--bg-card)");
    card.setAttribute("stroke", "var(--border-card)");
    card.setAttribute("stroke-width", "2");
    card.setAttribute("rx", "12");
    svg.appendChild(card);

    // Title
    drawText(svg, laser.title, startX + 24, 195, { fontSize: "18px", fontWeight: "700", fill: laser.color });
    
    // Description text
    drawWrappedText(svg, laser.desc, startX + 24, 225, 370, 18, { fontSize: "13px", fill: "var(--text-secondary)" });

    // Draw wave packet representation
    const waveY = 320;
    const waveW = 370;
    drawWaveRepresentation(svg, startX + 24, waveY, waveW, laser.waveType, laser.color);

    // Table specifications
    let currentY = 400;
    laser.specs.forEach(([key, val]) => {
      // Draw key
      drawText(svg, key, startX + 24, currentY, { fontSize: "12.5px", fontWeight: "700", fill: "var(--text-muted)" });
      // Draw value
      drawWrappedText(svg, val, startX + 24, currentY + 18, 370, 16, { fontSize: "13px", fill: "var(--text-main)" });
      currentY += 52;
    });
  });
}

// Helper to draw wave packet visual
function drawWaveRepresentation(svg, x, y, w, type, color) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Draw base line
  const base = document.createElementNS("http://www.w3.org/2000/svg", "line");
  base.setAttribute("x1", x);
  base.setAttribute("y1", y);
  base.setAttribute("x2", x + w);
  base.setAttribute("y2", y);
  base.setAttribute("stroke", "rgba(255,255,255,0.06)");
  base.setAttribute("stroke-width", "1");
  g.appendChild(base);

  // Draw wave path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  let d = "";

  if (type === "cw") {
    // Continuous Sine wave
    d = `M ${x} ${y}`;
    for (let dx = 0; dx <= w; dx++) {
      const cy = y + 15 * Math.sin(dx * 0.15);
      d += ` L ${x + dx} ${cy}`;
    }
  } else if (type === "ps") {
    // Picosecond pulses
    d = `M ${x} ${y}`;
    for (let dx = 0; dx <= w; dx++) {
      let cy = y;
      // 3 pulses
      const p1 = w * 0.25;
      const p2 = w * 0.5;
      const p3 = w * 0.75;
      const sigma = 12; // ps pulse width
      
      const val = Math.exp(-Math.pow(dx - p1, 2) / (2 * sigma * sigma)) +
                  Math.exp(-Math.pow(dx - p2, 2) / (2 * sigma * sigma)) +
                  Math.exp(-Math.pow(dx - p3, 2) / (2 * sigma * sigma));
      
      cy = y - 25 * val * Math.sin(dx * 0.4);
      d += ` L ${x + dx} ${cy}`;
    }
  } else if (type === "fs") {
    // Femtosecond ultra-short pulse envelope
    d = `M ${x} ${y}`;
    for (let dx = 0; dx <= w; dx++) {
      let cy = y;
      const center = w * 0.5;
      const sigma = 4; // ultra-short fs pulse width
      const val = Math.exp(-Math.pow(dx - center, 2) / (2 * sigma * sigma));
      
      cy = y - 30 * val * Math.sin(dx * 0.9);
      d += ` L ${x + dx} ${cy}`;
    }
  }

  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "2");
  if (type === "fs") {
    path.setAttribute("filter", `drop-shadow(0 0 3px ${color})`);
  }
  g.appendChild(path);

  // Label
  drawText(svg, type.toUpperCase() + " waveform", x + w, y - 22, { fontSize: "10px", fill: "var(--text-muted)", textAnchor: "end", fontFamily: "JetBrains Mono" });

  svg.appendChild(g);
}

// 3. Spectrometer Intro Page
function renderSpectrometerIntroPage(svg) {
  drawText(svg, "光谱仪基本结构与反射式光栅分光原理 (Spectrometer Optical Paths)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "经典 Czerny-Turner 反射式光谱仪内部光路仿真", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  // Draw main optical chamber of spectrometer
  const chamber = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  chamber.setAttribute("x", "120");
  chamber.setAttribute("y", "170");
  chamber.setAttribute("width", "1360");
  chamber.setAttribute("height", "640");
  chamber.setAttribute("fill", "rgba(17, 24, 39, 0.9)");
  chamber.setAttribute("stroke", "var(--border-card)");
  chamber.setAttribute("stroke-width", "3");
  chamber.setAttribute("rx", "16");
  svg.appendChild(chamber);

  // Draw Entrance Slit
  drawSpectrometerSlit(svg, 120, 480, "光信号输入狭缝");

  // Draw Collimator mirror (concave, left-center bottom)
  drawConcaveMirror(svg, 260, 720, -45, "M1 准直物镜");

  // Draw Plane Diffraction Grating (center-top)
  drawGratingMirror(svg, 800, 260, 12, "平面衍射光栅");

  // Draw Focusing mirror (concave, right bottom)
  drawConcaveMirror(svg, 1340, 720, -135, "M2 聚焦成像物镜");

  // Draw CCD array detector (middle right)
  drawCcdArray(svg, 980, 540, "CCD 阵列探测器");

  // Draw Light beams inside the spectrometer
  // 1. Entering Beam (mixed color)
  drawSpectrometerBeams(svg);

  // Draw Explanation notes box
  const noteBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  noteBox.setAttribute("x", "350");
  noteBox.setAttribute("y", "580");
  noteBox.setAttribute("width", "420");
  noteBox.setAttribute("height", "200");
  noteBox.setAttribute("fill", "var(--bg-page)");
  noteBox.setAttribute("stroke", "var(--primary-glow-border)");
  noteBox.setAttribute("stroke-width", "1.5");
  noteBox.setAttribute("rx", "8");
  svg.appendChild(noteBox);

  drawText(svg, "光栅刻线与测试分辨率选择:", 370, 615, { fontSize: "14px", fontWeight: "700", fill: "var(--primary-color)" });
  drawText(svg, "• 1800 lines/mm (拉曼专用):", 370, 645, { fontSize: "12.5px", fontWeight: "700", fill: "var(--text-main)" });
  drawText(svg, "  色散能力极强，光谱分辨率高（~cm⁻¹），适合精细峰位与劈裂分析。", 370, 665, { fontSize: "12px", fill: "var(--text-secondary)" });
  drawText(svg, "• 150 lines/mm (PL/SHG 常用):", 370, 705, { fontSize: "12.5px", fontWeight: "700", fill: "var(--text-main)" });
  drawText(svg, "  色散较小但通光范围宽广，适合 PL（宽带荧光）与二倍频快速搜寻。", 370, 725, { fontSize: "12px", fill: "var(--text-secondary)" });
}

// Spec drawing functions
function drawSpectrometerSlit(svg, x, y, name) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);
  
  // Draw blades
  const blade1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  blade1.setAttribute("x", "-4");
  blade1.setAttribute("y", "-40");
  blade1.setAttribute("width", "8");
  blade1.setAttribute("height", "32");
  blade1.setAttribute("fill", "var(--mount-fill)");
  g.appendChild(blade1);

  const blade2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  blade2.setAttribute("x", "-4");
  blade2.setAttribute("y", "8");
  blade2.setAttribute("width", "8");
  blade2.setAttribute("height", "32");
  blade2.setAttribute("fill", "var(--mount-fill)");
  g.appendChild(blade2);

  drawText(g, name, 15, 4, { fontSize: "11px", fill: "var(--text-muted)", textAnchor: "start" });
  svg.appendChild(g);
}

function drawConcaveMirror(svg, x, y, angle, name) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);

  // Curved base
  const mount = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  mount.setAttribute("x", "-40");
  mount.setAttribute("y", "6");
  mount.setAttribute("width", "80");
  mount.setAttribute("height", "14");
  mount.setAttribute("fill", "var(--mount-fill)");
  mount.setAttribute("stroke", "var(--mount-stroke)");
  mount.setAttribute("stroke-width", "1.5");
  g.appendChild(mount);

  // Curved silver surface
  const mirror = document.createElementNS("http://www.w3.org/2000/svg", "path");
  mirror.setAttribute("d", "M -40 6 A 150 150 0 0 1 40 6");
  mirror.setAttribute("fill", "none");
  mirror.setAttribute("stroke", "#e2e8f0");
  mirror.setAttribute("stroke-width", "4");
  g.appendChild(mirror);

  // Label
  drawText(g, name, 0, 42, { fontSize: "12px", fill: "var(--text-main)", textAnchor: "middle", transform: `rotate(${-angle})` });
  svg.appendChild(g);
}

function drawGratingMirror(svg, x, y, angle, name) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);

  const block = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  block.setAttribute("x", "-50");
  block.setAttribute("y", "-10");
  block.setAttribute("width", "100");
  block.setAttribute("height", "20");
  block.setAttribute("fill", "var(--mount-fill)");
  block.setAttribute("stroke", "var(--mount-stroke)");
  block.setAttribute("stroke-width", "1.5");
  g.appendChild(block);

  // Grating ruled lines pattern
  const lines = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  lines.setAttribute("x", "-40");
  lines.setAttribute("y", "-10");
  lines.setAttribute("width", "80");
  lines.setAttribute("height", "2");
  lines.setAttribute("fill", "url(#grating-lines)");
  g.appendChild(lines);

  // Reflective grating film
  const film = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  film.setAttribute("x", "-40");
  film.setAttribute("y", "-8");
  film.setAttribute("width", "80");
  film.setAttribute("height", "3");
  film.setAttribute("fill", "url(#dichroic-grad)");
  g.appendChild(film);

  drawText(g, name, 0, -20, { fontSize: "12px", fill: "var(--text-main)", textAnchor: "middle", transform: `rotate(${-angle})` });
  svg.appendChild(g);
}

function drawCcdArray(svg, x, y, name) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  const body = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  body.setAttribute("x", "-60");
  body.setAttribute("y", "-15");
  body.setAttribute("width", "120");
  body.setAttribute("height", "30");
  body.setAttribute("fill", "var(--bg-page)");
  body.setAttribute("stroke", "var(--mount-stroke)");
  body.setAttribute("stroke-width", "2");
  body.setAttribute("rx", "4");
  g.appendChild(body);

  // Pixels row
  for (let px = -50; px <= 50; px += 10) {
    const pixel = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    pixel.setAttribute("x", px.toString());
    pixel.setAttribute("y", "-10");
    pixel.setAttribute("width", "8");
    pixel.setAttribute("height", "20");
    pixel.setAttribute("fill", "rgba(59, 130, 246, 0.2)");
    pixel.setAttribute("stroke", "rgba(59, 130, 246, 0.5)");
    pixel.setAttribute("stroke-width", "0.5");
    g.appendChild(pixel);
  }

  drawText(g, name, 0, 36, { fontSize: "12px", fill: "var(--text-main)", textAnchor: "middle" });
  svg.appendChild(g);
}

function drawSpectrometerBeams(svg) {
  // Trace beam paths:
  // Slit is at (120, 480).
  // M1 (collimator) is at (260, 720). Curved reflection angle points up-right to Grating at (800, 260).
  // Grating at (800, 260) splits beam into blue, green, and red rays going to M2 at (1340, 720).
  // M2 at (1340, 720) focuses these dispersed beams onto CCD at (980, 540).

  // 1. Entrance mixed beam (pinkish/white)
  drawBeamPath(svg, [[120, 480], [260, 720]], "#f1f5f9", 3, false);
  // Collimated beam (white, flat, parallel)
  drawBeamPath(svg, [[260, 720], [800, 260]], "#f1f5f9", 3.5, false);

  // 2. Dispersed beams from Grating
  // Blue ray
  drawBeamPath(svg, [[800, 260], [1300, 700], [940, 540]], "#3b82f6", 1.5, false);
  // Green ray
  drawBeamPath(svg, [[800, 260], [1340, 720], [980, 540]], "#10b981", 1.5, false);
  // Red ray
  drawBeamPath(svg, [[800, 260], [1380, 740], [1020, 540]], "#ef4444", 1.5, false);
}

// 4. Optical Component Library Page
function renderComponentLibPage(svg) {
  drawText(svg, "精密显微光谱共焦光学元器件库 (Confocal Optics Library)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "系统内置 12 类科研级核心光电与机械调节模组，可鼠标悬浮展示其详细指标说明", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  const types = Object.keys(componentPresets);
  types.forEach((type, idx) => {
    // 4x3 Grid layout
    const col = idx % 4;
    const row = Math.floor(idx / 4);

    const x = 150 + col * 340;
    const y = 170 + row * 210;

    // Background Card
    const card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    card.setAttribute("x", x);
    card.setAttribute("y", y);
    card.setAttribute("width", "300");
    card.setAttribute("height", "180");
    card.setAttribute("fill", "var(--bg-card)");
    card.setAttribute("stroke", "var(--border-card)");
    card.setAttribute("stroke-width", "1.5");
    card.setAttribute("rx", "10");
    
    // Hover highlight
    card.addEventListener("mouseenter", () => {
      card.setAttribute("stroke", "var(--primary-color)");
      card.style.filter = "drop-shadow(0 0 8px var(--primary-glow-shadow))";
    });
    card.addEventListener("mouseleave", () => {
      card.setAttribute("stroke", "var(--border-card)");
      card.style.filter = "none";
    });

    svg.appendChild(card);

    const preset = componentPresets[type];
    
    // Icon badge representation
    const badge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    badge.setAttribute("cx", x + 40);
    badge.setAttribute("cy", y + 40);
    badge.setAttribute("r", "22");
    badge.setAttribute("fill", "var(--primary-glow-bg)");
    badge.setAttribute("stroke", "var(--primary-color)");
    badge.setAttribute("stroke-width", "1");
    svg.appendChild(badge);

    // Initial letter as icon
    drawText(svg, type[0].toUpperCase(), x + 40, y + 45, { fontSize: "16px", fontWeight: "800", fill: "var(--primary-color)", textAnchor: "middle", fontFamily: "JetBrains Mono" });

    // Name
    drawText(svg, preset.name.split(" (")[0], x + 80, y + 36, { fontSize: "14px", fontWeight: "700", fill: "var(--text-main)" });
    drawText(svg, type.toUpperCase(), x + 80, y + 54, { fontSize: "10px", fontWeight: "500", fill: "var(--text-muted)", fontFamily: "JetBrains Mono" });

    // Desc
    drawWrappedText(svg, preset.desc, x + 20, y + 84, 260, 16, { fontSize: "11.5px", fill: "var(--text-secondary)" });
  });
}

// 5. Signal Flow & Data Acquisition Page
function renderSignalFlowPage(svg) {
  drawText(svg, "显微共焦光谱系统电子信号流向与采集控制 (Signal Flow & DAQ)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "从微观光子到计算机离散光谱曲线的完整物理信号转换链路", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  const nodes = [
    { name: "1. 激发调控", sub: "激光能量辐射在样品晶面上", color: "var(--laser-green)", x: 150, y: 350 },
    { name: "2. 光电信号收集", sub: "拉曼/荧光发射聚焦进入狭缝", color: "var(--beam-raman)", x: 450, y: 350 },
    { name: "3. 物理色散", sub: "光栅多级衍射角区分不同波长", color: "#38bdf8", x: 750, y: 350 },
    { name: "4. 光电转换", sub: "CCD像素势垒累积电荷并读出", color: "var(--success)", x: 1050, y: 350 },
    { name: "5. 数据采集 (DAQ)", sub: "A/D数字化编码上传至上位机", color: "var(--warning)", x: 1350, y: 350 }
  ];

  nodes.forEach((node, idx) => {
    // Render Box block
    const block = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    block.setAttribute("x", node.x - 110);
    block.setAttribute("y", node.y - 70);
    block.setAttribute("width", "220");
    block.setAttribute("height", "140");
    block.setAttribute("fill", "var(--bg-card)");
    block.setAttribute("stroke", node.color);
    block.setAttribute("stroke-width", "2");
    block.setAttribute("rx", "12");
    svg.appendChild(block);

    // Node header text
    drawText(svg, node.name, node.x, node.y - 25, { fontSize: "14px", fontWeight: "700", fill: "var(--text-main)", textAnchor: "middle" });
    
    // Subtext
    drawWrappedText(svg, node.sub, node.x - 90, node.y, 180, 16, { fontSize: "11px", fill: "var(--text-secondary)", textAnchor: "middle" });

    // Draw connection arrows to next node
    if (idx < nodes.length - 1) {
      const nextNode = nodes[idx + 1];
      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      arrow.setAttribute("d", `M ${node.x + 120} ${node.y} L ${nextNode.x - 130} ${node.y}`);
      arrow.setAttribute("stroke", "var(--text-muted)");
      arrow.setAttribute("stroke-width", "2");
      arrow.setAttribute("stroke-dasharray", "4 4");
      svg.appendChild(arrow);

      // Arrow head
      const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
      head.setAttribute("d", `M ${nextNode.x - 130} ${node.y} L ${nextNode.x - 138} ${node.y - 5} L ${nextNode.x - 138} ${node.y + 5} Z`);
      head.setAttribute("fill", "var(--text-muted)");
      svg.appendChild(head);
    }
  });

  // Display diagram representing flow mapping underneath
  const flowRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  flowRect.setAttribute("x", "150");
  flowRect.setAttribute("y", "560");
  flowRect.setAttribute("width", "1300");
  flowRect.setAttribute("height", "220");
  flowRect.setAttribute("fill", "rgba(255,255,255,0.01)");
  flowRect.setAttribute("stroke", "var(--border-card)");
  flowRect.setAttribute("stroke-width", "1.5");
  flowRect.setAttribute("rx", "12");
  svg.appendChild(flowRect);

  drawText(svg, "采集控制流说明:", 180, 600, { fontSize: "14px", fontWeight: "700", fill: "var(--primary-color)" });
  drawText(svg, "1. 连续/脉冲激发: 激光辐照诱导晶格振动(Raman)或激子复合并向外辐射波长不一的散射/发光光子流。", 180, 630, { fontSize: "12.5px", fill: "var(--text-secondary)" });
  drawText(svg, "2. 色散分光成像: 光谱仪准直镜将发散光变为平行光投射到衍射光栅, 光栅按 Bragg 条件将不同频率成分色散成像于 CCD 像素面上。", 180, 665, { fontSize: "12.5px", fill: "var(--text-secondary)" });
  drawText(svg, "3. 积分读出: 电荷耦合器件 CCD 将光子转化为电子, 像素势阱积攒电荷电量。A/D 转换电路将电压量化并打包上传计算机分析。", 180, 700, { fontSize: "12.5px", fill: "var(--text-secondary)" });
  drawText(svg, "4. 软件处理: LabVIEW/Python 主控界面解析同步触发时钟，生成以频率为横轴、计数为纵轴的实际光谱数据图线。", 180, 735, { fontSize: "12.5px", fill: "var(--text-secondary)" });
}

// 6. Default Fallback Page
function renderDefaultInfoPage(svg, pageId) {
  drawText(svg, `章节: ${pageId} 介绍`, 800, 200, { fontSize: "24px", fontWeight: "700", textAnchor: "middle", fill: "var(--primary-color)" });
}

// Basic SVG Utilities inside pages
function drawText(parent, text, x, y, attrs = {}) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.textContent = text;
  t.setAttribute("x", x.toString());
  t.setAttribute("y", y.toString());
  t.setAttribute("font-family", attrs.fontFamily || "'Outfit', sans-serif");
  t.setAttribute("font-size", attrs.fontSize || "12px");
  t.setAttribute("font-weight", attrs.fontWeight || "normal");
  t.setAttribute("fill", attrs.fill || "var(--text-main)");
  t.setAttribute("text-anchor", attrs.textAnchor || "start");
  if (attrs.transform) t.setAttribute("transform", attrs.transform);
  parent.appendChild(t);
  return t;
}

function drawWrappedText(parent, text, x, y, width, lineHeight, attrs = {}) {
  const words = text.split(""); // Split Chinese characters or space-delimited English words
  let line = "";
  let currentY = y;
  
  const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  tempText.setAttribute("font-size", attrs.fontSize || "12px");
  tempText.setAttribute("font-family", attrs.fontFamily || "'Outfit', sans-serif");
  tempText.style.visibility = "hidden";
  parent.appendChild(tempText);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    tempText.textContent = line + char;
    
    // Estimate text width in SVG
    const textWidth = tempText.getComputedTextLength() || (line.length + 1) * 7.5;
    
    if (textWidth > width) {
      drawText(parent, line, x, currentY, attrs);
      line = char;
      currentY += lineHeight;
    } else {
      line += char;
    }
  }
  if (line) {
    drawText(parent, line, x, currentY, attrs);
  }
  parent.removeChild(tempText);
}

function drawBoxCard(parent, x, y, w, h, title, sub, color) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", w.toString());
  rect.setAttribute("height", h.toString());
  rect.setAttribute("fill", "var(--bg-card)");
  rect.setAttribute("stroke", "var(--border-card)");
  rect.setAttribute("stroke-width", "1.5");
  rect.setAttribute("rx", "8");
  g.appendChild(rect);

  // Left stripe
  const stripe = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  stripe.setAttribute("x", "0");
  stripe.setAttribute("y", "0");
  stripe.setAttribute("width", "6");
  stripe.setAttribute("height", h.toString());
  stripe.setAttribute("fill", color);
  stripe.setAttribute("rx", "2");
  g.appendChild(stripe);

  drawText(g, title, 20, 28, { fontSize: "14px", fontWeight: "700", fill: "var(--text-main)" });
  
  const sublines = sub.split("\n");
  sublines.forEach((line, idx) => {
    drawText(g, line, 20, 52 + idx * 20, { fontSize: "11px", fill: "var(--text-secondary)" });
  });

  parent.appendChild(g);
}

function drawConfocalScope(parent, x, y) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  // Draw scope body cube represent
  const cube = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  cube.setAttribute("x", "-40");
  cube.setAttribute("y", "-40");
  cube.setAttribute("width", "80");
  cube.setAttribute("height", "80");
  cube.setAttribute("fill", "var(--mount-fill)");
  cube.setAttribute("stroke", "var(--mount-stroke)");
  cube.setAttribute("stroke-width", "2");
  cube.setAttribute("rx", "6");
  g.appendChild(cube);

  // Diagonal dichroic mirror inside
  const mirror = document.createElementNS("http://www.w3.org/2000/svg", "line");
  mirror.setAttribute("x1", "-30");
  mirror.setAttribute("y1", "30");
  mirror.setAttribute("x2", "30");
  mirror.setAttribute("y2", "-30");
  mirror.setAttribute("stroke", "url(#dichroic-grad)");
  mirror.setAttribute("stroke-width", "3");
  g.appendChild(mirror);

  drawText(g, "共焦显微镜头", 0, -50, { fontSize: "13px", fontWeight: "700", fill: "var(--text-main)", textAnchor: "middle" });
  drawText(g, "DM / BS 反射镜", 0, 52, { fontSize: "10.5px", fill: "var(--text-muted)", textAnchor: "middle" });

  parent.appendChild(g);
}

function drawBeamPath(parent, points, color, width, hasArrow) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0]} ${points[i][1]}`;
  }
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", width.toString());
  path.setAttribute("opacity", "0.75");
  path.setAttribute("filter", `drop-shadow(0 0 2px ${color})`);
  parent.appendChild(path);

  if (hasArrow && points.length >= 2) {
    // Draw arrow at midpoint
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    const mx = (p1[0] + p2[0]) / 2;
    const my = (p1[1] + p2[1]) / 2;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", "M -6 -4 L 6 0 L -6 4 Z");
    arrow.setAttribute("transform", `translate(${mx}, ${my}) rotate(${angle})`);
    arrow.setAttribute("fill", color);
    parent.appendChild(arrow);
  }
}

// 6. Raman Intro Page - Testing Principle
function renderRamanIntroPage(svg) {
  drawText(svg, "拉曼非弹性散射测试原理 (Raman Scattering Principle)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "光子与晶格声子相互作用能级图及共焦检测示意", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  // Draw two split panels: Left (Energy Levels), Right (Confocal Filter path)
  const leftPanel = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  leftPanel.setAttribute("x", "120");
  leftPanel.setAttribute("y", "170");
  leftPanel.setAttribute("width", "650");
  leftPanel.setAttribute("height", "620");
  leftPanel.setAttribute("fill", "var(--bg-card)");
  leftPanel.setAttribute("stroke", "var(--border-card)");
  leftPanel.setAttribute("stroke-width", "2");
  leftPanel.setAttribute("rx", "12");
  svg.appendChild(leftPanel);

  // --- Draw Energy Levels on Left ---
  drawText(svg, "拉曼散射能级跃迁图 (Jablonski Diagram)", 445, 210, { fontSize: "16px", fontWeight: "700", textAnchor: "middle", fill: "var(--primary-color)" });

  // Level lines
  const ground0 = 620;
  const ground1 = 540;
  const virtual = 260;

  // Draw Solid Level Lines
  drawLevelLine(svg, 160, ground0, 570, "基态能级 v = 0");
  drawLevelLine(svg, 160, ground1, 570, "基态振动激发态 v = 1");
  drawDashedLevelLine(svg, 160, virtual, 570, "虚能级 (Virtual State)");

  // Arrows
  // 1. Excitation (532nm Green)
  drawArrowUp(svg, 210, ground0, virtual, "var(--laser-green)", "hν₀ 激发");
  // 2. Rayleigh (532nm Green)
  drawArrowDown(svg, 290, virtual, ground0, "var(--laser-green)", "hν₀ 弹性反射");
  // 3. Stokes (Purple)
  drawArrowDown(svg, 380, virtual, ground1, "var(--beam-raman)", "hν₀ - hν_ph (Stokes)");
  // 4. Anti-Stokes
  drawArrowUp(svg, 480, ground1, virtual, "#38bdf8", "");
  drawArrowDown(svg, 520, virtual, ground0, "#38bdf8", "hν₀ + hν_ph (Anti-Stokes)");

  // Legend Text
  drawText(svg, "频移量 Δν = |ν₀ - ν_scattered| 对应声子能量", 445, 750, { fontSize: "13px", fontWeight: "600", textAnchor: "middle", fill: "var(--text-secondary)" });

  renderPrincipleBrief(svg, {
    title: "拉曼测试如何读懂",
    subtitle: "Raman = 用非弹性散射读晶格振动",
    color: "var(--beam-raman)",
    equation: "Δν = |ν₀ - νs| ；峰位对应声子能量，强度受 Raman 张量与偏振几何控制",
    readouts: [
      { label: "峰位 Δν", value: "声子能量 / 应力" },
      { label: "峰宽 FWHM", value: "缺陷 / 温度 / 寿命" },
      { label: "VV / VH 极图", value: "晶轴与对称性" }
    ],
    cards: [
      {
        title: "1. 测量对象",
        short: "晶格振动声子；峰位就是振动能量坐标",
        body: "Raman 不直接测带隙，而是测晶格振动声子。峰位反映振动能量，峰宽反映散射寿命、缺陷、应力和温度，峰强受材料取向与散射张量影响。"
      },
      {
        title: "2. 物理机制",
        short: "虚能级非弹性散射；Stokes 少一个声子能量",
        body: "入射光先诱导虚能级极化，再以 Stokes 或 Anti-Stokes 光子散射出来。Stokes 光能量降低，差值正好等于一个声子的能量。"
      },
      {
        title: "3. 光路逻辑",
        short: "Notch 去瑞利光；1800 g/mm 解析 cm⁻¹ 频移",
        body: "532 nm 激光经物镜聚焦到样品；回程信号中瑞利散射远强于 Raman，因此必须用 Notch 滤片阻断激发波长，再用 1800 g/mm 光栅解析 cm⁻¹ 级频移。"
      },
      {
        title: "4. 读数方法",
        body: "先读峰位和峰宽，再比较强度比、峰位移动和劈裂。应力、层数、相变、掺杂和温度变化通常会改变这些谱线参数。"
      },
      {
        title: "5. 偏振扩展",
        body: "VV/VH 或 HWP 扫描是在改变入射/散射偏振矢量。不同声子模式的 Raman 张量不同，因此偏振依赖可用来判别晶格对称性和晶轴方向。"
      }
    ]
  });
}

// 7. PL Intro Page - Testing Principle
function renderPlIntroPage(svg) {
  drawText(svg, "光致发光测试电子跃迁原理 (Photoluminescence Principle)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "半导体能带带隙吸收与辐射发射复合过程", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  const leftPanel = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  leftPanel.setAttribute("x", "120");
  leftPanel.setAttribute("y", "170");
  leftPanel.setAttribute("width", "650");
  leftPanel.setAttribute("height", "620");
  leftPanel.setAttribute("fill", "var(--bg-card)");
  leftPanel.setAttribute("stroke", "var(--border-card)");
  leftPanel.setAttribute("stroke-width", "2");
  leftPanel.setAttribute("rx", "12");
  svg.appendChild(leftPanel);

  // --- Draw Bands on Left ---
  drawText(svg, "半导体能带结构吸收与荧光发射 (Band Diagram)", 445, 215, { fontSize: "16px", fontWeight: "700", textAnchor: "middle", fill: "var(--primary-color)" });

  // CB (Conduction Band)
  const cb = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  cb.setAttribute("x", "180");
  cb.setAttribute("y", "260");
  cb.setAttribute("width", "380");
  cb.setAttribute("height", "80");
  cb.setAttribute("fill", "rgba(56, 189, 248, 0.08)");
  cb.setAttribute("stroke", "#38bdf8");
  cb.setAttribute("stroke-width", "1.5");
  cb.setAttribute("rx", "6");
  svg.appendChild(cb);
  drawText(svg, "导带 (Conduction Band)", 370, 310, { fontSize: "13px", fontWeight: "700", fill: "#38bdf8", textAnchor: "middle" });

  // VB (Valence Band)
  const vb = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  vb.setAttribute("x", "180");
  vb.setAttribute("y", "540");
  vb.setAttribute("width", "380");
  vb.setAttribute("height", "80");
  vb.setAttribute("fill", "rgba(239, 68, 68, 0.08)");
  vb.setAttribute("stroke", "#ef4444");
  vb.setAttribute("stroke-width", "1.5");
  vb.setAttribute("rx", "6");
  svg.appendChild(vb);
  drawText(svg, "价带 (Valence Band)", 370, 590, { fontSize: "13px", fontWeight: "700", fill: "#ef4444", textAnchor: "middle" });

  // Band Gap Label
  drawText(svg, "带隙 Eg (Band Gap)", 370, 445, { fontSize: "13px", fontWeight: "700", fill: "var(--text-muted)", textAnchor: "middle" });

  // Arrows
  // 1. Excitation (532nm Green)
  drawArrowUp(svg, 240, 540, 260, "var(--laser-green)", "hν_exc (吸收)");
  // 2. Non-radiative relaxation (Curly loops)
  drawRelaxationHelix(svg, 240, 260, 340);
  drawRelaxationHelix(svg, 500, 620, 540);
  // 3. Recombination PL (Red emission)
  drawArrowDown(svg, 500, 340, 540, "var(--beam-pl)", "hν_PL 发射");

  drawText(svg, "能级守恒: 发射荧光能量 hν_PL = E_g (小于激发能 hν_exc)", 445, 750, { fontSize: "13px", fontWeight: "600", textAnchor: "middle", fill: "var(--text-secondary)" });

  renderPrincipleBrief(svg, {
    title: "PL 测试如何读懂",
    subtitle: "PL = 用辐射复合读电子态、激子态和缺陷态",
    color: "var(--beam-pl)",
    equation: "hνexc > Eg；发光峰 hνPL 来自激子、Trion 或缺陷态辐射复合",
    readouts: [
      { label: "峰能量", value: "带隙 / 激子态" },
      { label: "强度与半峰宽", value: "辐射效率 / 无序" },
      { label: "DOLP / DOCP", value: "各向异性 / 谷极化" }
    ],
    cards: [
      {
        title: "1. 测量对象",
        short: "激子、Trion 和缺陷态的辐射复合发光",
        body: "PL 测的是样品被光激发后自己发出的光。峰位对应发光跃迁能量，强度反映吸收、辐射效率和非辐射损耗，峰宽反映无序、温度和相互作用。"
      },
      {
        title: "2. 物理机制",
        short: "hνexc > Eg 产生载流子；弛豫后从低能态发光",
        body: "激发光能量高于带隙时产生电子-空穴对；载流子先快速弛豫到低能态，再以激子、带电激子或缺陷态形式复合发光。"
      },
      {
        title: "3. 光路逻辑",
        short: "DM / LP 分离激发与发光；150 g/mm 覆盖宽谱",
        body: "二向色镜反射 532 nm 激发光进入物镜，同时让长波长 PL 回程透过；长通滤光片进一步去除残余激发光，150 g/mm 光栅用于一次捕获宽发光带。"
      },
      {
        title: "4. 读数方法",
        body: "先判断主峰能量和峰宽，再比较强度、肩峰、低能尾和温度/功率依赖。A 激子、Trion、局域态和缺陷峰需要按能量位置与响应规律区分。"
      },
      {
        title: "5. 偏振扩展",
        body: "线偏振 PL 用 HWP 与检偏器读 DOLP，反映低对称晶体的发光各向异性；圆偏振 PL 用 QWP 产生/解析 σ⁺、σ⁻，读谷选择定则和 DOCP。"
      }
    ]
  });
}

// 8. SHG Intro Page - Testing Principle
function renderShgIntroPage(svg) {
  drawText(svg, "非线性光学二次谐波发生原理 (Second Harmonic Theory)", 800, 80, { fontSize: "28px", fontWeight: "800", textAnchor: "middle", fill: "var(--primary-color)" });
  drawText(svg, "双光子相干合成与晶格空间反演对称性破缺探测机制", 800, 115, { fontSize: "15px", fill: "var(--text-secondary)", textAnchor: "middle" });

  const leftPanel = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  leftPanel.setAttribute("x", "120");
  leftPanel.setAttribute("y", "170");
  leftPanel.setAttribute("width", "650");
  leftPanel.setAttribute("height", "620");
  leftPanel.setAttribute("fill", "var(--bg-card)");
  leftPanel.setAttribute("stroke", "var(--border-card)");
  leftPanel.setAttribute("stroke-width", "2");
  leftPanel.setAttribute("rx", "12");
  svg.appendChild(leftPanel);

  // --- Draw SHG energy levels on Left ---
  drawText(svg, "SHG 能级图与虚拟激发过程 (SHG Levels)", 445, 215, { fontSize: "16px", fontWeight: "700", textAnchor: "middle", fill: "var(--primary-color)" });

  const shgGround = 600;
  const shgVirt1 = 425;
  const shgVirt2 = 250;

  drawLevelLine(svg, 160, shgGround, 570, "基态 E_0");
  drawDashedLevelLine(svg, 160, shgVirt1, 570, "虚拟能级 1");
  drawDashedLevelLine(svg, 160, shgVirt2, 570, "虚拟能级 2");

  // Arrows
  // Two omega photons
  drawArrowUp(svg, 260, shgGround, shgVirt1, "var(--laser-ir)", "基频 ω (1064nm)");
  drawArrowUp(svg, 260, shgVirt1, shgVirt2, "var(--laser-ir)", "基频 ω (1064nm)");
  // One 2omega photon return
  drawArrowDown(svg, 460, shgVirt2, shgGround, "var(--laser-green)", "倍频二倍频 2ω (532nm)");

  drawText(svg, "瞬间相干能量融合过程: E_SHG = 2 · E_fundamental", 445, 750, { fontSize: "13px", fontWeight: "600", textAnchor: "middle", fill: "var(--text-secondary)" });

  renderPrincipleBrief(svg, {
    title: "SHG 测试如何读懂",
    subtitle: "SHG = 用二阶非线性响应读反演对称性和晶轴",
    color: "var(--laser-ir)",
    equation: "P(2ω) = ε₀ χ(2) : E(ω)E(ω)；中心反演对称材料的电偶极 χ(2) 近似为 0",
    readouts: [
      { label: "I₂ω 强度", value: "χ(2) / 共振增强" },
      { label: "层数与晶区", value: "反演对称性" },
      { label: "六瓣极图", value: "晶轴与镜面对称方向" }
    ],
    cards: [
      {
        title: "1. 测量对象",
        short: "二阶非线性 χ(2)；对反演对称性最敏感",
        body: "SHG 测的是材料在强光场下把两个基频光子相干合成为一个二倍频光子的能力。信号强弱直接受 χ(2)、层数、取向和共振增强影响。"
      },
      {
        title: "2. 物理机制",
        short: "两个 ω 相干合成一个 2ω；不是 PL 或 Raman",
        body: "两个 ω 光子通过虚能级瞬时耦合成一个 2ω 光子。它不是 PL 的真实能级复合，也不是 Raman 的能量频移，而是相干非线性极化辐射。"
      },
      {
        title: "3. 光路逻辑",
        short: "1064 nm 入射；滤出 532 nm 二倍频信号",
        body: "1064 nm 飞秒激光提供高峰值电场；样品产生 532 nm 二倍频光；短通和窄带滤片去除残余 1064 nm，只让 532 nm SHG 进入探测器。"
      },
      {
        title: "4. 读数方法",
        body: "先确认 2ω 波长，再比较强度随层数、晶区、功率和偏振角的变化。理想二阶过程常表现为 I₂ω 随入射功率近似二次增长。"
      },
      {
        title: "5. 偏振扩展",
        body: "旋转 HWP 与检偏器得到极角图。单层 D₃h TMD 常见六瓣花形，瓣方向和节点位置可用于确定晶轴与镜面对称方向。"
      }
    ]
  });
}

function renderPrincipleBrief(svg, config) {
  const x = 830;
  const y = 170;
  const w = 650;
  const h = 620;
  const panel = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  panel.setAttribute("x", x.toString());
  panel.setAttribute("y", y.toString());
  panel.setAttribute("width", w.toString());
  panel.setAttribute("height", h.toString());
  panel.setAttribute("fill", "var(--bg-card)");
  panel.setAttribute("stroke", "var(--border-card)");
  panel.setAttribute("stroke-width", "2");
  panel.setAttribute("rx", "10");
  svg.appendChild(panel);

  const accent = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  accent.setAttribute("x", x.toString());
  accent.setAttribute("y", y.toString());
  accent.setAttribute("width", "6");
  accent.setAttribute("height", h.toString());
  accent.setAttribute("fill", config.color);
  accent.setAttribute("rx", "3");
  accent.setAttribute("opacity", "0.9");
  svg.appendChild(accent);

  drawText(svg, "PRINCIPLE MAP", x + 34, y + 38, {
    fontSize: "12px",
    fontWeight: "800",
    textAnchor: "start",
    fill: config.color
  });
  drawText(svg, config.title, x + 34, y + 76, {
    fontSize: "28px",
    fontWeight: "800",
    textAnchor: "start",
    fill: "var(--text-main)"
  });
  drawWrappedText(svg, config.subtitle, x + 34, y + 104, w - 68, 22, {
    fontSize: "17px",
    fontWeight: "650",
    fill: "var(--text-secondary)"
  });

  const primaryCards = config.cards.slice(0, 3);
  primaryCards.forEach((card, index) => {
    const cardX = x + 34;
    const cardY = y + 146 + index * 102;
    const cardW = w - 68;
    const cardH = 84;
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", cardX.toString());
    bg.setAttribute("y", cardY.toString());
    bg.setAttribute("width", cardW.toString());
    bg.setAttribute("height", cardH.toString());
    bg.setAttribute("fill", "rgba(255,255,255,0.028)");
    bg.setAttribute("stroke", "var(--border-card)");
    bg.setAttribute("stroke-width", "1");
    bg.setAttribute("rx", "8");
    svg.appendChild(bg);

    const rail = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rail.setAttribute("x", cardX.toString());
    rail.setAttribute("y", cardY.toString());
    rail.setAttribute("width", "4");
    rail.setAttribute("height", cardH.toString());
    rail.setAttribute("fill", config.color);
    rail.setAttribute("rx", "2");
    rail.setAttribute("opacity", "0.85");
    svg.appendChild(rail);

    const indexDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    indexDot.setAttribute("cx", (cardX + 34).toString());
    indexDot.setAttribute("cy", (cardY + 42).toString());
    indexDot.setAttribute("r", "15");
    indexDot.setAttribute("fill", config.color);
    indexDot.setAttribute("opacity", "0.92");
    svg.appendChild(indexDot);

    drawText(svg, String(index + 1), cardX + 34, cardY + 47, {
      fontSize: "16px",
      fontWeight: "800",
      fill: "#fff",
      textAnchor: "middle"
    });

    drawText(svg, card.title.replace(/^\d+\.\s*/, ""), cardX + 66, cardY + 32, {
      fontSize: "22px",
      fontWeight: "800",
      fill: "var(--text-main)",
      textAnchor: "start"
    });
    drawWrappedText(svg, card.short || card.body, cardX + 66, cardY + 58, cardW - 92, 22, {
      fontSize: "17px",
      fontWeight: "600",
      fill: "var(--text-secondary)"
    });
  });

  const eq = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  eq.setAttribute("x", (x + 34).toString());
  eq.setAttribute("y", (y + 470).toString());
  eq.setAttribute("width", (w - 68).toString());
  eq.setAttribute("height", "52");
  eq.setAttribute("fill", "rgba(99,102,241,0.09)");
  eq.setAttribute("stroke", "var(--primary-glow-border)");
  eq.setAttribute("stroke-width", "1");
  eq.setAttribute("rx", "8");
  svg.appendChild(eq);

  drawText(svg, "核心关系", x + 54, y + 492, {
    fontSize: "13px",
    fontWeight: "800",
    fill: config.color,
    textAnchor: "start"
  });
  drawWrappedText(svg, config.equation, x + 126, y + 492, w - 180, 21, {
    fontSize: "16px",
    fontWeight: "700",
    fill: "var(--text-main)"
  });

  const readouts = config.readouts || [];
  readouts.forEach((item, index) => {
    const chipW = 182;
    const chipX = x + 34 + index * 200;
    const chipY = y + 548;
    const chip = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    chip.setAttribute("x", chipX.toString());
    chip.setAttribute("y", chipY.toString());
    chip.setAttribute("width", chipW.toString());
    chip.setAttribute("height", "58");
    chip.setAttribute("fill", "rgba(255,255,255,0.025)");
    chip.setAttribute("stroke", "var(--border-card)");
    chip.setAttribute("stroke-width", "1");
    chip.setAttribute("rx", "8");
    svg.appendChild(chip);

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", (chipX + 16).toString());
    dot.setAttribute("cy", (chipY + 20).toString());
    dot.setAttribute("r", "4");
    dot.setAttribute("fill", config.color);
    svg.appendChild(dot);

    drawText(svg, item.label, chipX + 28, chipY + 24, {
      fontSize: "15px",
      fontWeight: "800",
      fill: "var(--text-main)",
      textAnchor: "start"
    });
    drawWrappedText(svg, item.value, chipX + 16, chipY + 46, chipW - 28, 18, {
      fontSize: "12px",
      fontWeight: "650",
      fill: "var(--text-secondary)"
    });
  });
}

// Helpers for the new drawings
function drawLevelLine(parent, x1, y, x2, label) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", y.toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", y.toString());
  line.setAttribute("stroke", "var(--text-main)");
  line.setAttribute("stroke-width", "2.5");
  parent.appendChild(line);

  drawText(parent, label, x2 + 10, y + 4, { fontSize: "11px", fill: "var(--text-muted)" });
}

function drawDashedLevelLine(parent, x1, y, x2, label) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", y.toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", y.toString());
  line.setAttribute("stroke", "var(--text-muted)");
  line.setAttribute("stroke-width", "1.5");
  line.setAttribute("stroke-dasharray", "4 4");
  parent.appendChild(line);

  drawText(parent, label, x2 + 10, y + 4, { fontSize: "11px", fill: "var(--text-secondary)" });
}

function drawArrowUp(parent, x, yStart, yEnd, color, label) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x} ${yStart} L ${x} ${yEnd}`);
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("fill", "none");
  parent.appendChild(path);

  const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
  head.setAttribute("d", `M ${x} ${yEnd} L ${x - 5} ${yEnd + 10} L ${x + 5} ${yEnd + 10} Z`);
  head.setAttribute("fill", color);
  parent.appendChild(head);

  if (label) {
    drawText(parent, label, x - 12, (yStart + yEnd) / 2, { fontSize: "11px", fill: color, textAnchor: "end" });
  }
}

function drawArrowDown(parent, x, yStart, yEnd, color, label) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x} ${yStart} L ${x} ${yEnd}`);
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("fill", "none");
  parent.appendChild(path);

  const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
  head.setAttribute("d", `M ${x} ${yEnd} L ${x - 5} ${yEnd - 10} L ${x + 5} ${yEnd - 10} Z`);
  head.setAttribute("fill", color);
  parent.appendChild(head);

  if (label) {
    drawText(parent, label, x + 12, (yStart + yEnd) / 2, { fontSize: "11px", fill: color, textAnchor: "start" });
  }
}

function drawRelaxationHelix(parent, x, yStart, yEnd) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  let d = `M ${x} ${yStart}`;
  let cy = yStart;
  const step = 4;
  const amplitude = 5;
  let rad = 0;
  while (cy < yEnd) {
    cy += step;
    rad += 0.5;
    const cx = x + amplitude * Math.sin(rad);
    d += ` L ${cx} ${cy}`;
  }
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "var(--text-muted)");
  path.setAttribute("stroke-width", "1.5");
  parent.appendChild(path);
}

function drawConfocalConf(parent, lx, ly, cx, cy, rx, ry) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Draw lens
  const lens = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  lens.setAttribute("cx", cx.toString());
  lens.setAttribute("cy", cy.toString());
  lens.setAttribute("rx", "12");
  lens.setAttribute("ry", "40");
  lens.setAttribute("class", "component-glass");
  g.appendChild(lens);
  drawText(g, "物镜", cx, cy - 50, { fontSize: "11px", textAnchor: "middle" });

  // Draw Sample
  const sample = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sample.setAttribute("x", (cx - 40).toString());
  sample.setAttribute("y", (cy + 120).toString());
  sample.setAttribute("width", "80");
  sample.setAttribute("height", "10");
  sample.setAttribute("fill", "var(--primary-glow-bg)");
  sample.setAttribute("stroke", "var(--primary-color)");
  g.appendChild(sample);
  drawText(g, "焦平面样品", cx, cy + 150, { fontSize: "11.5px", textAnchor: "middle", fill: "var(--primary-color)" });

  // Beam cone converging
  const coneExc = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  coneExc.setAttribute("points", `${cx - 10},${cy} ${cx + 10},${cy} ${cx},${cy + 120}`);
  coneExc.setAttribute("fill", "rgba(16, 185, 129, 0.15)");
  g.appendChild(coneExc);

  // Draw Rayleigh vs Raman beam separation
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  filter.setAttribute("x", rx.toString());
  filter.setAttribute("y", (ry - 30).toString());
  filter.setAttribute("width", "10");
  filter.setAttribute("height", "60");
  filter.setAttribute("fill", "rgba(239, 68, 68, 0.2)");
  filter.setAttribute("stroke", "#ef4444");
  g.appendChild(filter);
  drawText(g, "Notch 陷波滤片", rx + 5, ry - 38, { fontSize: "10.5px", textAnchor: "middle", fill: "#ef4444" });

  // Rayleigh blocked ray
  const rayBlocked = document.createElementNS("http://www.w3.org/2000/svg", "line");
  rayBlocked.setAttribute("x1", cx.toString());
  rayBlocked.setAttribute("y1", cy.toString());
  rayBlocked.setAttribute("x2", rx.toString());
  rayBlocked.setAttribute("y2", ry.toString());
  rayBlocked.setAttribute("stroke", "var(--laser-green)");
  rayBlocked.setAttribute("stroke-width", "3");
  g.appendChild(rayBlocked);

  // Raman pass ray
  const ramPass = document.createElementNS("http://www.w3.org/2000/svg", "line");
  ramPass.setAttribute("x1", rx.toString());
  ramPass.setAttribute("y1", ry.toString());
  ramPass.setAttribute("x2", (rx + 60).toString());
  ramPass.setAttribute("y2", ry.toString());
  ramPass.setAttribute("stroke", "var(--beam-raman)");
  ramPass.setAttribute("stroke-width", "2");
  g.appendChild(ramPass);

  parent.appendChild(g);
}

function drawPlconf(parent, lx, ly, cx, cy, rx, ry) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Lens
  const lens = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  lens.setAttribute("cx", cx.toString());
  lens.setAttribute("cy", cy.toString());
  lens.setAttribute("rx", "12");
  lens.setAttribute("ry", "40");
  lens.setAttribute("class", "component-glass");
  g.appendChild(lens);

  // Sample
  const sample = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sample.setAttribute("x", (cx - 40).toString());
  sample.setAttribute("y", (cy + 120).toString());
  sample.setAttribute("width", "80");
  sample.setAttribute("height", "10");
  sample.setAttribute("fill", "var(--primary-glow-bg)");
  sample.setAttribute("stroke", "var(--primary-color)");
  g.appendChild(sample);

  // Exciton drawing schematic (electron + hole paired)
  const electron = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  electron.setAttribute("cx", (cx - 10).toString());
  electron.setAttribute("cy", (cy + 125).toString());
  electron.setAttribute("r", "3");
  electron.setAttribute("fill", "#38bdf8");
  g.appendChild(electron);

  const hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  hole.setAttribute("cx", (cx + 10).toString());
  hole.setAttribute("cy", (cy + 125).toString());
  hole.setAttribute("r", "3");
  hole.setAttribute("fill", "#ef4444");
  g.appendChild(hole);

  const bond = document.createElementNS("http://www.w3.org/2000/svg", "line");
  bond.setAttribute("x1", (cx - 10).toString());
  bond.setAttribute("y1", (cy + 125).toString());
  bond.setAttribute("x2", (cx + 10).toString());
  bond.setAttribute("y2", (cy + 125).toString());
  bond.setAttribute("stroke", "#f59e0b");
  bond.setAttribute("stroke-width", "1");
  bond.setAttribute("stroke-dasharray", "1 1");
  g.appendChild(bond);
  drawText(g, "绑定激子 (Exciton)", cx, cy + 112, { fontSize: "10.5px", textAnchor: "middle", fill: "#f59e0b" });

  // Green excitation laser
  const beamExc = document.createElementNS("http://www.w3.org/2000/svg", "line");
  beamExc.setAttribute("x1", lx.toString());
  beamExc.setAttribute("y1", ly.toString());
  beamExc.setAttribute("x2", cx.toString());
  beamExc.setAttribute("y2", cy.toString());
  beamExc.setAttribute("stroke", "var(--laser-green)");
  beamExc.setAttribute("stroke-width", "3");
  g.appendChild(beamExc);

  // Red PL emission out to right
  const beamPl = document.createElementNS("http://www.w3.org/2000/svg", "line");
  beamPl.setAttribute("x1", cx.toString());
  beamPl.setAttribute("y1", cy.toString());
  beamPl.setAttribute("x2", rx.toString());
  beamPl.setAttribute("y2", ry.toString());
  beamPl.setAttribute("stroke", "var(--beam-pl)");
  beamPl.setAttribute("stroke-width", "4.5");
  g.appendChild(beamPl);
  drawText(g, "荧光 (PL) 激发与多路收集", cx + 100, cy - 20, { fontSize: "11px", fill: "var(--beam-pl)" });

  parent.appendChild(g);
}

function drawShgSymmetryGraph(parent, cx, cy) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Hexagonal lattice points representing MoS2 monolayer
  // Center atom (Mo, blue) and outer 6 atoms (S, yellow)
  const r = 50;
  
  // Draw inversion center indicator (crossed out center!)
  const centerCross = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  centerCross.setAttribute("cx", cx.toString());
  centerCross.setAttribute("cy", cy.toString());
  centerCross.setAttribute("r", "16");
  centerCross.setAttribute("fill", "rgba(239, 68, 68, 0.15)");
  centerCross.setAttribute("stroke", "#ef4444");
  centerCross.setAttribute("stroke-width", "1");
  centerCross.setAttribute("stroke-dasharray", "2 2");
  g.appendChild(centerCross);
  drawText(g, "无对称中心!", cx, cy - 8, { fontSize: "10.5px", textAnchor: "middle", fill: "#ef4444", fontWeight: "700" });

  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const ax = cx + r * Math.cos(angle);
    const ay = cy + r * Math.sin(angle);

    const atom = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    atom.setAttribute("cx", ax.toString());
    atom.setAttribute("cy", ay.toString());
    atom.setAttribute("r", "10");
    // Alternate Mo and S atoms representing inversion breaking
    const isMo = i % 2 === 0;
    atom.setAttribute("fill", isMo ? "rgba(56, 189, 248, 0.8)" : "rgba(245, 158, 11, 0.8)");
    atom.setAttribute("stroke", isMo ? "#38bdf8" : "#f59e0b");
    g.appendChild(atom);

    const bond = document.createElementNS("http://www.w3.org/2000/svg", "line");
    bond.setAttribute("x1", cx.toString());
    bond.setAttribute("y1", cy.toString());
    bond.setAttribute("x2", ax.toString());
    bond.setAttribute("y2", ay.toString());
    bond.setAttribute("stroke", "rgba(255,255,255,0.15)");
    bond.setAttribute("stroke-width", "2");
    g.insertBefore(bond, centerCross);
  }

  // Draw a label representing D3h structure
  drawText(g, "MoS₂ 单层晶格 (D₃ₕ)", cx, cy + 90, { fontSize: "12px", textAnchor: "middle", fill: "var(--text-main)", fontWeight: "700" });
  drawText(g, "空间反演对称性破缺 (Inversion Symmetry Broken)", cx, cy + 110, { fontSize: "10.5px", textAnchor: "middle", fill: "var(--text-secondary)" });

  parent.appendChild(g);
}
