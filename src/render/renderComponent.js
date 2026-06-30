/* src/render/renderComponent.js */

import { componentPresets } from "../data/componentPresets.js";
import state from "../state.js";

/**
 * Main router to render any optical component as an SVG group.
 * Wraps everything in a group <g transform="translate(x, y) rotate(rot)"> and adds mouse event listeners.
 */
export function renderComponent(component) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", `optical-component component-${component.type}`);
  g.setAttribute("id", component.id);
  
  // Set translation and rotation
  const rotation = component.rotation || 0;
  g.setAttribute("transform", `translate(${component.x}, ${component.y}) rotate(${rotation})`);

  // Render specific shape
  let content = "";
  switch (component.type) {
    case "laser":
      content = renderLaserShape(component);
      break;
    case "polarizer":
      content = renderPolarizerShape(component);
      break;
    case "waveplate":
      content = renderWaveplateShape(component);
      break;
    case "beamsplitter":
      content = renderBeamSplitterShape(component);
      break;
    case "mirror":
      content = renderMirrorShape(component);
      break;
    case "dichroic":
      content = renderDichroicShape(component);
      break;
    case "objective":
      content = renderObjectiveShape(component);
      break;
    case "sample":
      content = renderSampleShape(component);
      break;
    case "filter":
      content = renderFilterShape(component);
      break;
    case "analyzer":
      content = renderAnalyzerShape(component);
      break;
    case "spectrometer":
      content = renderSpectrometerShape(component);
      break;
    case "detector":
      content = renderDetectorShape(component);
      break;
    default:
      content = renderUnknownShape(component);
  }
  g.innerHTML = content;

  // Add event listeners for hover details and tooltip popup
  g.addEventListener("mouseenter", (e) => {
    state.setHoveredComponent(component.type);
    g.classList.add("active-tweaking");

    // Show floating tooltip popup
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      const preset = componentPresets[component.type] || { name: component.label || "未知元件", desc: "暂无说明", specs: {} };
      
      let nameText = preset.name;
      let descText = preset.desc;
      let specsMap = { ...preset.specs };

      // Customize spectrometer grating based on layout
      if (component.type === "spectrometer") {
        const layoutId = state.currentLayoutId;
        const grating = layoutId.startsWith("raman") ? "1800 g/mm" : "150 g/mm";
        specsMap["光栅规格"] = grating;
        specsMap["光谱范围"] = layoutId.startsWith("raman") ? "拉曼频移 100 - 4000 cm⁻¹" : (layoutId.startsWith("shg") ? "倍频光谱 300 - 700 nm" : "PL荧光 400 - 1100 nm");
      }

      // Customize laser wavelength if SHG
      if (component.type === "laser" && state.currentLayoutId.startsWith("shg")) {
        nameText = "1064nm 飞秒红外超快激光器";
        descText = "提供超强飞秒红外脉冲激发光源（1064 nm），诱导单层 TMD 二维材料发生二次谐波发生（SHG）非线性光学倍频效应。";
        specsMap["工作波长"] = "1064 nm (近红外)";
        specsMap["脉冲宽度"] = "120 fs";
        specsMap["重复频率"] = "80 MHz";
        specsMap["偏振状态"] = "线偏振 (> 100:1)";
      }

      let specHtml = Object.entries(specsMap)
        .map(([key, val]) => `<div style="margin-top:2px;"><strong>${key}:</strong> ${val}</div>`)
        .join("");

      tooltip.innerHTML = `
        <div class="tooltip-title" style="font-weight:700; color:var(--primary-color); border-bottom:1px solid var(--border-card); padding-bottom:4px; margin-bottom:6px; font-size:12.5px;">${nameText}</div>
        <div class="tooltip-desc" style="color:var(--text-secondary); font-size:11px; line-height:1.4; margin-bottom:6px;">${descText}</div>
        ${specHtml ? `<div class="tooltip-specs" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-card); border-radius:4px; padding:6px; font-size:10.5px; font-family:'JetBrains Mono', monospace; color:var(--text-main);">${specHtml}</div>` : ""}
      `;
      tooltip.style.display = "block";
    }
  });

  g.addEventListener("mousemove", (e) => {
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      // Offset position relative to the cursor
      tooltip.style.left = (e.pageX + 18) + "px";
      tooltip.style.top = (e.pageY + 18) + "px";
    }
  });

  g.addEventListener("mouseleave", () => {
    state.setHoveredComponent(null);
    g.classList.remove("active-tweaking");
    
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      tooltip.style.display = "none";
    }
  });

  return g;
}

// 1. Laser Source
function renderLaserShape(c) {
  const width = 110;
  const height = 54;
  
  let wavelength = c.params?.wavelength || "532 nm";
  let isFs = c.params?.mode === "fs";
  
  // Choose LED indicator color and override wavelength label if SHG layout active
  let ledColor = "var(--laser-green)";
  if (state.currentLayoutId.startsWith("shg")) {
    wavelength = "1064 nm";
    isFs = true;
    ledColor = "var(--laser-ir)";
  } else if (state.currentLayoutId === "plStandard" || state.currentLayoutId === "plValley") {
    wavelength = state.currentLayoutId === "plValley" ? "633 nm" : "488 nm";
    ledColor = state.currentLayoutId === "plValley" ? "var(--laser-red)" : "var(--laser-cyan)";
  } else {
    // Raman or basic linear pol
    wavelength = "532 nm";
    ledColor = "var(--laser-green)";
  }
  
  return `
    <!-- Main Laser Box housing -->
    <rect x="-55" y="-27" width="${width}" height="${height}" rx="6" class="component-body-metal" />
    
    <!-- Heat Sink Fins -->
    <line x1="-40" y1="-27" x2="-40" y2="-20" stroke="var(--mount-stroke)" stroke-width="2" />
    <line x1="-30" y1="-27" x2="-30" y2="-20" stroke="var(--mount-stroke)" stroke-width="2" />
    <line x1="-20" y1="-27" x2="-20" y2="-20" stroke="var(--mount-stroke)" stroke-width="2" />
    <line x1="-10" y1="-27" x2="-10" y2="-20" stroke="var(--mount-stroke)" stroke-width="2" />
    <line x1="0" y1="-27" x2="0" y2="-20" stroke="var(--mount-stroke)" stroke-width="2" />
    
    <!-- Snout / Aperture -->
    <rect x="55" y="-12" width="12" height="24" rx="2" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1" />
    <circle cx="61" cy="0" r="4" fill="#000" />
    
    <!-- LED Glow Indicator -->
    <circle cx="40" cy="-14" r="3.5" fill="${ledColor}" filter="drop-shadow(0 0 2px ${ledColor})" />
    
    <!-- Label in-housing -->
    <text x="-5" y="4" class="component-label-text" fill="var(--text-main)" font-size="10.5px" font-weight="700" style="transform: rotate(${-c.rotation || 0}deg)">${wavelength} ${isFs ? "fs" : "CW"}</text>
    <!-- Label outside -->
    <text x="0" y="52" class="component-label-text" style="transform: rotate(${-c.rotation || 0}deg)">${c.label}</text>
  `;
}

// 2. Polarizer
function renderPolarizerShape(c) {
  let angle = c.params?.angleDeg || 0;
  if (c.params?.isInteractive) {
    angle = state.inputAngle;
  }
  
  const rad = angle * Math.PI / 180;

  return `
    <!-- Polarizer Mount -->
    <circle cx="0" cy="0" r="32" fill="none" stroke="var(--component-border)" stroke-width="3" />
    <rect x="-36" y="-6" width="72" height="12" rx="2" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1.5" transform="rotate(90)" />
    
    <!-- Inner Glass -->
    <circle cx="0" cy="0" r="24" class="component-glass" />
    
    <!-- Transmission Axis (Dynamic Rotation) -->
    <g transform="rotate(${angle})">
      <line x1="-24" y1="0" x2="24" y2="0" stroke="var(--primary-color)" stroke-width="2.5" stroke-dasharray="3 2" />
      <path d="M 24 0 L 16 -4 L 16 4 Z" fill="var(--primary-color)" />
      <path d="M -24 0 L -16 -4 L -16 4 Z" fill="var(--primary-color)" />
    </g>

    <!-- Angle Ticks -->
    <line x1="0" y1="-32" x2="0" y2="-28" stroke="var(--text-muted)" stroke-width="1.5" />
    <line x1="0" y1="32" x2="0" y2="28" stroke="var(--text-muted)" stroke-width="1.5" />
    <line x1="-32" y1="0" x2="-28" y2="0" stroke="var(--text-muted)" stroke-width="1.5" />
    <line x1="32" y1="0" x2="28" y2="0" stroke="var(--text-muted)" stroke-width="1.5" />

    <!-- Label -->
    <text x="0" y="-48" class="component-label-text">${c.label} (${angle}°)</text>
  `;
}

// 3. Half-wave / Quarter-wave plates (HWP / QWP)
function renderWaveplateShape(c) {
  const isQwp = c.subtype === "QWP";
  
  let angle = c.params?.angleDeg || 0;
  if (c.params?.isInteractive) {
    if (c.params.sliderId === "hwpAngle") {
      angle = state.hwpAngle;
    } else if (c.params.sliderId === "qwpAngle") {
      angle = state.qwpAngle;
    }
  }

  return `
    <!-- Waveplate Ring Frame -->
    <circle cx="0" cy="0" r="34" fill="none" stroke="var(--component-border)" stroke-width="4" />
    <circle cx="0" cy="0" r="30" fill="none" stroke="var(--mount-fill)" stroke-width="1.5" />
    <rect x="-38" y="-5" width="76" height="10" rx="2" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1" transform="rotate(45)" />

    <!-- Quartz Glass Inner -->
    <circle cx="0" cy="0" r="24" class="component-glass" fill="rgba(14, 165, 233, 0.1)" />
    
    <!-- Fast Axis Vector Indicator (Dynamic Rotation) -->
    <g transform="rotate(${angle})">
      <line x1="-24" y1="0" x2="24" y2="0" stroke="#f59e0b" stroke-width="2" />
      <path d="M 24 0 L 17 -3 L 17 3 Z" fill="#f59e0b" />
      <path d="M -24 0 L -17 -3 L -17 3 Z" fill="#f59e0b" />
      <text x="0" y="-6" fill="#f59e0b" font-family="'JetBrains Mono'" font-size="9px" font-weight="700" text-anchor="middle">FA</text>
    </g>

    <!-- Subtype Annotation in-glass -->
    <text x="0" y="4" class="component-label-text" font-size="10.5px" font-weight="700" fill="var(--text-main)" transform="rotate(${-c.rotation || 0})">${isQwp ? "λ/4" : "λ/2"}</text>
    <!-- Label outside -->
    <text x="0" y="-50" class="component-label-text">${c.label} (${angle}°)</text>
  `;
}

// 4. Beam Splitter Cube
function renderBeamSplitterShape(c) {
  const size = 50;
  return `
    <!-- Glass Cube Base -->
    <rect x="-25" y="-25" width="${size}" height="${size}" rx="4" class="component-glass" />
    <!-- Diagonal Splitting Film Coating -->
    <line x1="-25" y1="25" x2="25" y2="-25" stroke="var(--primary-color)" stroke-width="2" opacity="0.8" />
    <!-- Metal Mount Clips -->
    <path d="M -26 -20 L -26 -26 L -20 -26" fill="none" stroke="var(--mount-stroke)" stroke-width="2" />
    <path d="M 26 20 L 26 26 L 20 26" fill="none" stroke="var(--mount-stroke)" stroke-width="2" />
    
    <!-- Label -->
    <text x="0" y="-42" class="component-label-text">${c.label}</text>
  `;
}

// 5. Reflector Mirror
function renderMirrorShape(c) {
  return `
    <!-- Back Mount Support -->
    <path d="M -22 18 L 22 -26" fill="none" stroke="var(--mount-fill)" stroke-width="6" stroke-linecap="round" />
    <!-- Mirror substrate -->
    <line x1="-20" y1="20" x2="20" y2="-20" stroke="var(--component-border)" stroke-width="3" />
    <!-- Reflective silver film coating -->
    <line x1="-18" y1="18" x2="18" y2="-18" stroke="var(--text-main)" stroke-width="1.5" />
    <!-- Hatching Lines representing mounting block -->
    <line x1="-15" y1="19" x2="-19" y2="15" stroke="var(--mount-stroke)" stroke-width="1" />
    <line x1="-5" y1="9" x2="-9" y2="5" stroke="var(--mount-stroke)" stroke-width="1" />
    <line x1="5" y1="-1" x2="1" y2="-5" stroke="var(--mount-stroke)" stroke-width="1" />
    <line x1="15" y1="-11" x2="11" y2="-15" stroke="var(--mount-stroke)" stroke-width="1" />

    <!-- Label -->
    <text x="0" y="-40" class="component-label-text">${c.label}</text>
  `;
}

// 6. Dichroic Mirror
function renderDichroicShape(c) {
  return `
    <!-- Plate Holder -->
    <path d="M -24 24 L -28 28" stroke="var(--mount-fill)" stroke-width="4" />
    <path d="M 24 -24 L 28 -28" stroke="var(--mount-fill)" stroke-width="4" />
    
    <!-- Multilayer Thin-film glass -->
    <rect x="-24" y="-3" width="48" height="6" rx="1" fill="url(#dichroic-grad)" stroke="var(--optics-glass-border)" stroke-width="1" transform="rotate(-45)" />
    
    <!-- Label -->
    <text x="0" y="-42" class="component-label-text">${c.label}</text>
  `;
}

// 7. Microscope Objective
function renderObjectiveShape(c) {
  const na = c.params?.NA || "0.75";
  return `
    <!-- Upper connector adapter -->
    <rect x="-26" y="-45" width="52" height="10" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1.5" />
    <!-- Main Lens Housing -->
    <path d="M -28 -35 L 28 -35 L 20 25 L -20 25 Z" class="component-body-metal" />
    <!-- Nosecone tip -->
    <path d="M -20 25 L 20 25 L 12 40 L -12 40 Z" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1.5" />
    <!-- Inner Lens outline -->
    <path d="M -10 38 A 12 12 0 0 1 10 38" fill="none" stroke="var(--optics-glass-border)" stroke-width="1.5" />
    
    <!-- Decorative band -->
    <rect x="-25" y="-15" width="50" height="6" fill="var(--primary-color)" />
    
    <!-- Specification Label -->
    <text x="0" y="8" class="component-label-text" font-size="9px" fill="#fff" font-weight="700">50× / NA ${na}</text>
    <text x="0" y="-65" class="component-label-text">${c.label}</text>
  `;
}

// 8. Sample and Cryogenic Stage
function renderSampleShape(c) {
  const hasCryo = c.params?.hasCryostat || false;
  const hasB = c.params?.hasBField || false;
  let temp = c.params?.temperature || "300 K";
  let fieldVal = c.params?.field || "0 T";

  // Dynamic values sync
  if (state.currentLayoutId === "plValley") {
    temp = `${state.temperature} K`;
    fieldVal = `${state.magneticField} T`;
  }

  let html = "";

  // 1. Cryostat chamber drawing (if cryogenic enabled)
  const isCryoActive = hasCryo || state.currentLayoutId === "plValley";
  if (isCryoActive) {
    html += `
      <!-- Cryostat Double-Walled Vacuum Shield -->
      <circle cx="0" cy="0" r="70" class="cryostat-chamber" />
      <circle cx="0" cy="0" r="56" class="cryostat-shield" />
      
      <!-- Optical Windows -->
      <line x1="-70" y1="0" x2="-56" y2="0" class="cryostat-window" />
      <line x1="70" y1="0" x2="56" y2="0" class="cryostat-window" />
      <line x1="0" y1="-70" x2="0" y2="-56" class="cryostat-window" />
      
      <!-- Temperature Label -->
      <text x="0" y="-76" class="component-label-text" font-family="'JetBrains Mono'" fill="var(--primary-color)" font-weight="700">${temp}</text>
    `;
  }

  // 2. Magnetic field lines (if magnetic field enabled)
  if (hasB || state.currentLayoutId === "plValley") {
    const isZero = state.magneticField === 0;
    if (!isZero) {
      const isUp = state.magneticField > 0;
      const y1 = isUp ? 50 : -50;
      const y2 = isUp ? -50 : 50;
      html += `
        <!-- Magnetic Field Vector Arrows -->
        <g opacity="0.65">
          <line x1="-35" y1="${y1}" x2="-35" y2="${y2}" class="magnetic-field-arrow" />
          <path d="M -35 ${y2} L -38 ${y2 + (isUp ? 6 : -6)} L -32 ${y2 + (isUp ? 6 : -6)} Z" class="magnetic-field-head" />
          
          <line x1="35" y1="${y1}" x2="35" y2="${y2}" class="magnetic-field-arrow" />
          <path d="M 35 ${y2} L 32 ${y2 + (isUp ? 6 : -6)} L 38 ${y2 + (isUp ? 6 : -6)} Z" class="magnetic-field-head" />
          
          <text x="-48" y="5" class="magnetic-field-label">B: ${fieldVal}</text>
        </g>
      `;
    }
  }

  // 3. Central sample wafer and holder
  const labelY = isCryoActive ? 92 : 46;
  html += `
    <!-- Stage Block -->
    <rect x="-35" y="-12" width="70" height="24" rx="2" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1.5" />
    <!-- Substrate SiO2/Si -->
    <rect x="-24" y="-16" width="48" height="8" fill="#52525b" stroke="#71717a" stroke-width="1" />
    <rect x="-24" y="-18" width="48" height="2" fill="#0891b2" /> <!-- 300nm oxide layer -->
    
    <!-- TMD Flake (Flashing Irregular Polygon) -->
    <polygon points="-8,-20 2,-23 10,-19 4,-17 -6,-18" fill="url(#flake-glow)" stroke="var(--primary-color)" stroke-width="1" />
    
    <!-- Label shifted vertically to avoid overlaps -->
    <text x="0" y="${labelY}" class="component-label-text" font-weight="700">${c.label}</text>
  `;

  return html;
}

// 9. Edge or Notch Filters
function renderFilterShape(c) {
  const isNotch = c.subtype === "notch";
  const isLp = c.subtype === "long-pass";
  const isSp = c.subtype === "short-pass";
  
  let labelText = "Notch";
  let filterColor = "rgba(244, 63, 94, 0.25)"; // pink/red
  let filterStroke = "#f43f5e";
  
  if (isLp) {
    labelText = "LP > 532nm";
    filterColor = "rgba(245, 158, 11, 0.25)"; // orange
    filterStroke = "#f59e0b";
  } else if (isSp) {
    labelText = "SP < 750nm";
    filterColor = "rgba(59, 130, 246, 0.25)"; // blue
    filterStroke = "#3b82f6";
  }

  // Handle SHG specific short-pass label (1064nm blocker)
  if (isSp && state.currentLayoutId.startsWith("shg")) {
    labelText = "SP < 600nm";
    filterColor = "rgba(59, 130, 246, 0.25)";
    filterStroke = "#3b82f6";
  }
  // Handle SHG bandpass label
  if (c.subtype === "band-pass" && state.currentLayoutId.startsWith("shg")) {
    labelText = "BP @ 532nm";
    filterColor = "rgba(16, 185, 129, 0.25)"; // green
    filterStroke = "#10b981";
  }

  return `
    <!-- Metal filter ring holder -->
    <rect x="-12" y="-36" width="24" height="72" rx="4" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1.5" />
    
    <!-- Dielectric Glass Window -->
    <rect x="-6" y="-28" width="12" height="56" rx="1" fill="${filterColor}" stroke="${filterStroke}" stroke-width="1.5" />
    
    <!-- Coating reflective lines -->
    <line x1="-3" y1="-20" x2="-3" y2="20" stroke="${filterStroke}" stroke-width="0.5" stroke-dasharray="2 2" />
    <line x1="3" y1="-20" x2="3" y2="20" stroke="${filterStroke}" stroke-width="0.5" stroke-dasharray="2 2" />

    <!-- Specifications outside -->
    <text x="0" y="-48" class="component-label-text" font-size="10px" font-weight="700" fill="var(--text-muted)">${labelText}</text>
    <!-- Label -->
    <text x="0" y="56" class="component-label-text">${c.label}</text>
  `;
}

// 10. Analyzer
function renderAnalyzerShape(c) {
  let angle = c.params?.angleDeg || 0;
  if (c.params?.isInteractive) {
    angle = state.analyzerAngle;
  }

  const axisLabel = (angle === 90 || angle === 270) ? "V" : ((angle === 0 || angle === 180) ? "H" : `${angle}°`);

  return `
    <!-- Analyzer Frame Ring -->
    <circle cx="0" cy="0" r="32" fill="none" stroke="var(--component-border)" stroke-width="3" />
    <rect x="-36" y="-6" width="72" height="12" rx="2" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1.5" transform="rotate(90)" />
    
    <!-- Glass Inner -->
    <circle cx="0" cy="0" r="24" class="component-glass" />
    
    <!-- Analyzer Transmission Axis (Dynamic Rotation) -->
    <g transform="rotate(${angle})">
      <line x1="-24" y1="0" x2="24" y2="0" stroke="var(--primary-color)" stroke-width="2.5" />
      <path d="M 24 0 L 17 -3 L 17 3 Z" fill="var(--primary-color)" />
      <path d="M -24 0 L -17 -3 L -17 3 Z" fill="var(--primary-color)" />
    </g>

    <!-- Angle Ticks -->
    <circle cx="0" cy="0" r="28" fill="none" stroke="var(--text-muted)" stroke-dasharray="1 3" stroke-width="1" />

    <!-- Label -->
    <text x="0" y="-48" class="component-label-text">${c.label} (${axisLabel})</text>
  `;
}

// 11. Grating Spectrometer
function renderSpectrometerShape(c) {
  const width = 130;
  const height = 80;
  
  // Dynamic grating density text
  const grating = state.currentLayoutId.startsWith("raman") ? "1800" : "150";

  return `
    <!-- Instrument Enclosure -->
    <rect x="-65" y="-40" width="${width}" height="${height}" rx="6" class="component-body-metal" />
    
    <!-- Entrance Slit Port -->
    <rect x="-73" y="-12" width="8" height="24" rx="1" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1" />
    <line x1="-69" y1="-8" x2="-69" y2="8" stroke="#000" stroke-width="1.5" />
    
    <!-- Internal Grating lines schematic -->
    <g transform="translate(10, 0)">
      <rect x="-20" y="-20" width="30" height="40" rx="2" fill="url(#grating-lines)" stroke="var(--text-muted)" stroke-width="1" />
      <text x="-5" y="4" class="component-label-text" font-family="'JetBrains Mono'" font-size="8px" fill="var(--text-muted)">${grating} g/mm</text>
    </g>

    <!-- Dispersion spectrum schematic -->
    <path d="M -45 0 L -10 -15" stroke="var(--beam-raman)" stroke-width="1" opacity="0.6" />
    <path d="M -45 0 L -10 15" stroke="var(--laser-red)" stroke-width="1" opacity="0.6" />
    
    <!-- Label shifted up to avoid overlap -->
    <text x="0" y="-52" class="component-label-text">${c.label}</text>
  `;
}

// 12. Detector (CCD, PMT, Power Meter)
function renderDetectorShape(c) {
  const isCcd = c.subtype === "CCD";
  const isPmt = c.subtype === "PMT";
  const width = 80;
  const height = 60;
  
  let labelText = "Power Meter";
  if (isCcd) labelText = "Scientific CCD";
  else if (isPmt) labelText = "PMT Sensor";

  return `
    <!-- Detector Housing -->
    <rect x="-40" y="-30" width="${width}" height="${height}" rx="4" class="component-body-metal" />
    
    <!-- Input flange -->
    <rect x="-48" y="-14" width="8" height="28" rx="1" fill="var(--mount-fill)" stroke="var(--mount-stroke)" stroke-width="1" />
    
    <!-- Cooling fans outline -->
    <circle cx="20" cy="-10" r="10" fill="none" stroke="var(--line-soft)" stroke-width="1.5" />
    <path d="M 20 -20 L 20 0 M 10 -10 L 30 -10 M 13 -17 L 27 -3 M 13 -3 L 27 -17" stroke="var(--line-soft)" stroke-width="1" />
    
    <!-- Electrical socket BNC -->
    <circle cx="28" cy="18" r="4" fill="#1e293b" stroke="#94a3b8" stroke-width="1" />

    <!-- Status indicator LED -->
    <circle cx="-25" cy="-16" r="2.5" fill="#22c55e" filter="drop-shadow(0 0 2px #22c55e)" />
    
    <!-- Label in-housing -->
    <text x="0" y="4" class="component-label-text" font-size="9px" font-weight="700" fill="var(--text-muted)">${labelText}</text>
    <!-- Label outside -->
    <text x="0" y="-42" class="component-label-text">${c.label}</text>
  `;
}

// Unknown fallback
function renderUnknownShape(c) {
  return `
    <rect x="-20" y="-20" width="40" height="40" rx="4" fill="none" stroke="red" stroke-width="2" stroke-dasharray="3 3" />
    <text x="0" y="4" class="component-label-text" fill="red">${c.label}</text>
  `;
}
