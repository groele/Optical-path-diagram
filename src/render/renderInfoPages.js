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
