/* src/render/renderInfoPanel.js */

import { componentPresets } from "../data/componentPresets.js";
import { calculateRamanIntensity, calculateValleyPL, calculateSHGIntensity } from "../utils/opticsMath.js";
import state from "../state.js";

/**
 * Renders the right sidebar panels (parameters control and scientific explanations).
 */
export function renderInfoPanel(paramsContainer, theoryContainer, detailContainer, layout) {
  if (!paramsContainer || !theoryContainer || !detailContainer) return;

  // 1. Render Interactive Parameters & Sliders
  renderParameters(paramsContainer, layout);

  // 2. Render Experiment and Physics Theory Text
  renderTheory(theoryContainer, layout);

  // 3. Render Hovered Component Details
  renderComponentDetails(detailContainer);
}

/**
 * Build parameters panel.
 */
function renderParameters(container, layout) {
  container.innerHTML = "";

  const controls = [];

  // Identify sliders to build based on active interactive components in layout
  const interactiveComps = layout.components.filter(c => c.params?.isInteractive);
  const sliderIds = new Set(interactiveComps.map(c => c.params.sliderId));

  // A. Input Polarizer angle
  if (sliderIds.has("inputAngle")) {
    controls.push({
      label: "起偏线偏振角 (Polarizer Axis θ_in)",
      key: "inputAngle",
      min: 0,
      max: 180,
      step: 1,
      unit: "°",
      desc: "设置激光入射路径起偏器的透射轴角度"
    });
  }

  // B. HWP angle
  if (sliderIds.has("hwpAngle")) {
    controls.push({
      label: "半波片快轴夹角 (HWP Angle)",
      key: "hwpAngle",
      min: 0,
      max: 180,
      step: 0.5,
      unit: "°",
      desc: "旋转半波片快轴，出射线偏振角旋转 2 * θ_hwp"
    });
  }

  // C. QWP angle
  if (sliderIds.has("qwpAngle")) {
    controls.push({
      label: "波片快轴夹角 (QWP Angle)",
      key: "qwpAngle",
      min: 0,
      max: 180,
      step: 0.5,
      unit: "°",
      desc: "四分之一波片快轴。在夹角为 45° 或 135° 时可获得圆偏振光"
    });
  }

  // D. Analyzer angle
  if (sliderIds.has("analyzerAngle")) {
    controls.push({
      label: "检偏器透射轴夹角 (Analyzer Axis)",
      key: "analyzerAngle",
      min: 0,
      max: 180,
      step: 1,
      unit: "°",
      desc: "设置收集路径检偏器的偏振截止透射方向"
    });
  }

  // E. Crystal orientation (SHG / Raman)
  if (sliderIds.has("sampleAngle")) {
    controls.push({
      label: "样品晶格偏角 (Crystal Angle)",
      key: "crystalAngle",
      min: 0,
      max: 180,
      step: 1,
      unit: "°",
      desc: "旋转晶格基轴，影响偏振分辨 Raman 和 SHG 的强度分布"
    });
  }

  // E2. Lifetime tau parameter (for TRPL)
  if (sliderIds.has("tauValue")) {
    controls.push({
      label: "激发态衰减寿命 (Lifetime τ)",
      key: "tauValue",
      min: 0.5,
      max: 8.0,
      step: 0.1,
      unit: " ns",
      desc: "设置激子的本征辐射复合荧光寿命"
    });
  }

  // F. Low temperature / Magnetic field (for plValley)
  if (layout.id === "plValley") {
    controls.push({
      label: "液氦制冷低温 (Cryostat Temp)",
      key: "temperature",
      min: 1.7,
      max: 300,
      step: 0.5,
      unit: " K",
      desc: "调控激子的热退极化速率与谷极化寿命"
    });
    controls.push({
      label: "垂直超导磁场 (Magnetic Field B_z)",
      key: "magneticField",
      min: -9,
      max: 9,
      step: 0.1,
      unit: " T",
      desc: "施加垂直磁场以诱导 Zeeman 谷能级分裂与居里平衡破缺"
    });
  }

  // G. Wavelength selector (for Raman / PL)
  if (layout.category === "Raman" || layout.category === "PL") {
    const selectorDiv = document.createElement("div");
    selectorDiv.className = "control-group";
    
    const labelRow = document.createElement("div");
    labelRow.className = "control-label-row";
    labelRow.innerHTML = `<span>激发激光波长 (Laser λ)</span><span class="control-value">${state.laserWavelength}</span>`;
    selectorDiv.appendChild(labelRow);

    const select = document.createElement("select");
    select.className = "control-select";
    
    const waveOptions = layout.category === "Raman" 
      ? ["532 nm", "633 nm", "785 nm", "488 nm"] 
      : ["488 nm", "532 nm", "633 nm"];

    waveOptions.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt;
      el.textContent = opt;
      if (opt === state.laserWavelength) el.selected = true;
      select.appendChild(el);
    });

    select.addEventListener("change", (e) => {
      state.setParam("laserWavelength", e.target.value);
    });

    selectorDiv.appendChild(select);
    container.appendChild(selectorDiv);
  }

  // Append control elements
  if (controls.length === 0) {
    const placeholder = document.createElement("p");
    placeholder.className = "placeholder-text";
    placeholder.textContent = "当前光路无交互式微调参数";
    container.appendChild(placeholder);
    return;
  }

  controls.forEach(c => {
    const group = document.createElement("div");
    group.className = "control-group";

    const labelRow = document.createElement("div");
    labelRow.className = "control-label-row";
    
    // Format float values cleanly
    const formattedVal = typeof state[c.key] === "number" 
      ? state[c.key].toFixed(c.step % 1 === 0 ? 0 : 1) 
      : state[c.key];

    labelRow.innerHTML = `<span>${c.label}</span><span class="control-value">${formattedVal}${c.unit}</span>`;
    group.appendChild(labelRow);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "control-slider";
    slider.min = c.min;
    slider.max = c.max;
    slider.step = c.step;
    slider.value = state[c.key];

    slider.addEventListener("input", (e) => {
      state.setParam(c.key, Number(e.target.value));
    });

    group.appendChild(slider);
    container.appendChild(group);
  });
}

/**
 * Build theory notes list.
 */
function renderTheory(container, layout) {
  container.innerHTML = "";

  const purposeDiv = document.createElement("div");
  purposeDiv.className = "info-para";
  purposeDiv.innerHTML = `<p>${layout.info.purpose}</p>`;
  container.appendChild(purposeDiv);

  // Add polar config summary
  const polarSummary = document.createElement("div");
  polarSummary.className = "info-para";
  polarSummary.style.color = "var(--primary-color)";
  polarSummary.style.fontWeight = "600";
  polarSummary.innerHTML = `<p><strong>偏振配置：</strong>${layout.info.polarization}</p>`;
  container.appendChild(polarSummary);

  // Show formulas calculation preview
  if (state.showFormulas) {
    const calG = renderLiveMathPreview(layout.id);
    if (calG) container.appendChild(calG);
  }

  // Display notes list
  const notesTitle = document.createElement("div");
  notesTitle.className = "info-notes-title";
  notesTitle.textContent = "实验技术细节";
  container.appendChild(notesTitle);

  const notesList = document.createElement("ul");
  notesList.className = "info-notes-list";
  layout.info.notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    notesList.appendChild(li);
  });
  container.appendChild(notesList);

  // SECTION III: Four circular polarization modes grid (addon.md)
  if (layout.id === "plValley") {
    const divider = document.createElement("hr");
    divider.style.border = "none";
    divider.style.borderTop = "1px dashed var(--border-card)";
    divider.style.margin = "16px 0";
    container.appendChild(divider);

    const circTitle = document.createElement("div");
    circTitle.className = "info-notes-title";
    circTitle.textContent = "圆偏振激发/探测模式组合";
    container.appendChild(circTitle);

    const grid = document.createElement("div");
    grid.className = "circular-mode-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "8px";
    grid.style.marginTop = "8px";

    const modes = [
      {
        exc: "σ⁺", det: "σ⁺",
        type: "σ⁺ / σ⁺ (同手性)",
        app: "Co-circular: 测量自旋谷极化率、磁圆二色性 (MCD)",
        color: "var(--success)"
      },
      {
        exc: "σ⁺", det: "σ⁻",
        type: "σ⁺ / σ⁻ (正交手性)",
        app: "Cross-circular: 谷相干态退极化、间隔层自旋散射",
        color: "var(--warning)"
      },
      {
        exc: "σ⁻", det: "σ⁺",
        type: "σ⁻ / σ⁺ (正交手性)",
        app: "Cross-circular: 探测层间激子动量转移与谷间跃迁",
        color: "var(--warning)"
      },
      {
        exc: "σ⁻", det: "σ⁻",
        type: "σ⁻ / σ⁻ (同手性)",
        app: "Co-circular: 探测反向 Zeeman 能级谷极化本征阻尼",
        color: "var(--success)"
      }
    ];

    modes.forEach(m => {
      const card = document.createElement("div");
      card.style.background = "var(--line-soft)";
      card.style.border = "1px solid var(--border-card)";
      card.style.borderRadius = "6px";
      card.style.padding = "8px";
      card.style.fontSize = "10.5px";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "4px";

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:18px; height:18px; line-height:18px; text-align:center; border-radius:50%; background:var(--primary-glow-bg); color:var(--primary-color); font-weight:800; font-size:10px;">${m.exc}</span>
          <span style="color:var(--text-muted); font-size:8px;">⪢</span>
          <span style="display:inline-block; width:18px; height:18px; line-height:18px; text-align:center; border-radius:50%; background:rgba(245,158,11,0.15); color:var(--warning); font-weight:800; font-size:10px;">${m.det}</span>
        </div>
        <div style="font-weight:700; color:${m.color}; font-size:11px;">${m.type}</div>
        <div style="color:var(--text-secondary); font-size:9.5px; line-height:1.3;">${m.app}</div>
      `;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }
}

/**
 * Helper to build live math text block inside theory panel.
 */
function renderLiveMathPreview(layoutId) {
  const div = document.createElement("div");
  div.style.padding = "10px 12px";
  div.style.borderRadius = "8px";
  div.style.backgroundColor = "var(--line-soft)";
  div.style.marginTop = "8px";
  div.style.fontFamily = "'JetBrains Mono', monospace";
  div.style.fontSize = "0.75rem";

  let html = "";
  if (layoutId === "ramanStandard") {
    html = `
      <div style="color:var(--text-main); font-weight:600; margin-bottom:4px;">标准拉曼光谱测量：</div>
      <div>激发波长 : 532 nm</div>
      <div>分光光栅 : 1800 g/mm</div>
      <div style="margin-top:4px; color:var(--success)">主要声子模式 : E' (~383 cm⁻¹), A₁g (~408 cm⁻¹)</div>
    `;
  } else if (layoutId.startsWith("raman")) {
    const incPol = (2 * state.hwpAngle - 90) % 180;
    const angleIn = incPol < 0 ? incPol + 180 : incPol;
    const mode = (layoutId === "ramanVV" || layoutId === "ramanPolarized" && state.analyzerAngle === 90) ? "A1g (全对称)" : "E' (剪切)";
    const res = calculateRamanIntensity({
      mode: (layoutId === "ramanVV" || layoutId === "ramanPolarized" && state.analyzerAngle === 90) ? "A1g" : "E",
      inputPolAngle: angleIn,
      analyzerPolAngle: state.analyzerAngle,
      crystalAngle: state.crystalAngle
    });
    
    html = `
      <div style="color:var(--text-main); font-weight:600; margin-bottom:4px;">拉曼选择定则仿真：</div>
      <div>激发偏振角 θ_i : ${angleIn.toFixed(1)}°</div>
      <div>检偏分析角 θ_s : ${state.analyzerAngle}°</div>
      <div>主要贡献声子 : ${mode}</div>
      <div style="margin-top:4px; color:var(--success)">理论探测光强 I ∝ ${res.toFixed(4)}</div>
    `;
  } else if (layoutId === "plValley") {
    const isSp = state.qwpAngle === 45;
    const isSm = state.qwpAngle === 135 || state.qwpAngle === -45;
    const excChirality = isSp ? 1 : (isSm ? -1 : 0);
    const v = calculateValleyPL({
      excitationChirality: excChirality,
      temperature: state.temperature,
      magneticField: state.magneticField
    });

    html = `
      <div style="color:var(--text-main); font-weight:600; margin-bottom:4px;">谷偏振自旋动力学仿真：</div>
      <div>激发极化 : ${excChirality > 0 ? "右旋圆偏振 σ⁺" : (excChirality < 0 ? "左旋圆偏振 σ⁻" : "线偏振")}</div>
      <div>Zeeman 能级分裂 : ${v.zeemanSplitting.toFixed(3)} meV</div>
      <div>K 谷发射强度 I(σ⁺) : ${v.iPlus.toFixed(3)}</div>
      <div>K'谷发射强度 I(σ⁻) : ${v.iMinus.toFixed(3)}</div>
      <div style="margin-top:4px; color:var(--success)">圆偏振度 DOCP : ${(v.docp * 100).toFixed(1)}%</div>
    `;
  } else if (layoutId.startsWith("shg")) {
    const incPol = (2 * state.hwpAngle - 90) % 180;
    const angleIn = incPol < 0 ? incPol + 180 : incPol;
    const isCrossed = layoutId === "shgStandard" ? true : (state.analyzerAngle !== incPol);
    const modeText = isCrossed ? "VH 交叉偏振" : "VV 平行偏振";
    const res = calculateSHGIntensity({
      inputPolAngle: angleIn,
      analyzerPolAngle: state.analyzerAngle,
      crystalAngle: state.crystalAngle,
      mode: isCrossed ? "crossed" : "parallel"
    });

    html = `
      <div style="color:var(--text-main); font-weight:600; margin-bottom:4px;">非线性二次谐波仿真：</div>
      <div>基频偏振 θ_in : ${angleIn.toFixed(1)}°</div>
      <div>倍频分析 θ_out : ${state.analyzerAngle}°</div>
      <div>测试几何 : ${modeText}</div>
      <div style="margin-top:4px; color:var(--success)">倍频光强 I(2ω) ∝ ${res.toFixed(4)}</div>
    `;
  } else if (layoutId === "linearPolDemo") {
    const outAngle = (2 * state.hwpAngle - state.inputAngle) % 180;
    const normalizedOut = outAngle < 0 ? outAngle + 180 : outAngle;
    const trans = Math.pow(Math.cos((normalizedOut - state.analyzerAngle) * Math.PI / 180), 2);
    
    html = `
      <div style="color:var(--text-main); font-weight:600; margin-bottom:4px;">偏振传播分析：</div>
      <div>输入偏振 θ_in : ${state.inputAngle}°</div>
      <div>半波片偏角 θ_hwp : ${state.hwpAngle}°</div>
      <div>波片输出偏振 : ${normalizedOut.toFixed(1)}°</div>
      <div style="margin-top:4px; color:var(--success)">检偏输出率 I/I_0 : ${(trans * 100).toFixed(1)}%</div>
    `;
  } else if (layoutId === "circularPolDemo") {
    const diff = (state.inputAngle - state.qwpAngle) % 180;
    const isCirc = Math.abs(Math.abs(diff) - 45) < 1 || Math.abs(Math.abs(diff) - 135) < 1;
    const trans = isCirc ? 0.5 : Math.pow(Math.cos((state.inputAngle - state.analyzerAngle) * Math.PI / 180), 2); // simplified
    
    html = `
      <div style="color:var(--text-main); font-weight:600; margin-bottom:4px;">圆偏振状态分析：</div>
      <div>输入线偏振 : ${state.inputAngle}°</div>
      <div>四分之一波片快轴 : ${state.qwpAngle}°</div>
      <div>波片输出状态 : ${isCirc ? "圆偏振 (Circular)" : "椭圆/线偏振"}</div>
      <div style="margin-top:4px; color:var(--success)">检偏输出率 I/I_0 : ${(trans * 100).toFixed(1)}%</div>
    `;
  }

  if (!html) return null;
  div.innerHTML = html;
  return div;
}

/**
 * Render hovered component details card.
 */
function renderComponentDetails(container) {
  const compId = state.hoveredComponentId;
  if (!compId || !componentPresets[compId]) {
    container.innerHTML = `<p class="placeholder-text">将鼠标悬停在光路中的光学元件上以查看其详细技术规范。</p>`;
    return;
  }

  const preset = componentPresets[compId];
  container.innerHTML = "";

  const title = document.createElement("h4");
  title.className = "detail-title";
  title.textContent = preset.name;
  container.appendChild(title);

  const desc = document.createElement("p");
  desc.style.marginTop = "4px";
  desc.textContent = preset.desc;
  container.appendChild(desc);

  // Add specifications table
  const table = document.createElement("table");
  table.className = "detail-spec-table";
  
  Object.keys(preset.specs).forEach(key => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${key}</td><td>${preset.specs[key]}</td>`;
    table.appendChild(tr);
  });
  
  container.appendChild(table);
}
