/* src/render/renderAnnotation.js */

import state from "../state.js";
import { calculateRamanIntensity, calculateValleyPL, calculateSHGIntensity, calculatePolarizationChain } from "../utils/opticsMath.js";

/**
 * Renders annotations (formulas, badges, and rotating stage indicators) onto the SVG canvas.
 */
export function renderAnnotation(annotation, layoutId) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", `ann-${annotation.id}`);
  g.setAttribute("transform", `translate(${annotation.x}, ${annotation.y})`);

  if (!state.showFormulas) return g;

  if (annotation.type === "badge") {
    const textStr = annotation.text;
    const textLen = textStr.length * 7.5 + 24;
    
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", (-textLen / 2).toString());
    bg.setAttribute("y", "-14");
    bg.setAttribute("width", textLen.toString());
    bg.setAttribute("height", "28");
    bg.setAttribute("class", "polarization-badge-bg");
    g.appendChild(bg);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.textContent = textStr;
    txt.setAttribute("x", "0");
    txt.setAttribute("y", "4");
    txt.setAttribute("class", "polarization-badge-text");
    txt.setAttribute("text-anchor", "middle");
    g.appendChild(txt);
  } 
  
  else if (annotation.type === "formula") {
    let mathText = annotation.text;
    let computedDetail = "";

    // Live calculation updates based on layout
    if (layoutId.startsWith("raman")) {
      const isVV = layoutId === "ramanVV";
      const intensity = calculateRamanIntensity({
        mode: isVV ? "A1g" : "E",
        inputPolAngle: 90, // V input
        hwpAngle: state.hwpAngle,
        analyzerPolAngle: state.analyzerAngle,
        crystalAngle: state.crystalAngle,
        isDoublePass: true
      });
      computedDetail = `I = ${intensity.toFixed(3)}`;
    } else if (layoutId === "plValley") {
      const excChirality = state.qwpAngle === 45 ? 1 : (state.qwpAngle === 135 || state.qwpAngle === -45 ? -1 : 0);
      const v = calculateValleyPL({
        excitationChirality: excChirality,
        temperature: state.temperature,
        magneticField: state.magneticField
      });
      computedDetail = `DOCP = ${v.docp.toFixed(3)}`;
    } else if (layoutId.startsWith("shg")) {
      const isCrossed = layoutId === "shgStandard" ? true : (state.analyzerAngle !== (2 * state.hwpAngle - 90) % 180);
      const intensity = calculateSHGIntensity({
        inputPolAngle: 90, // V input
        hwpAngle: state.hwpAngle,
        analyzerPolAngle: state.analyzerAngle,
        crystalAngle: state.crystalAngle,
        isDoublePass: true
      });
      computedDetail = `I(2ω) = ${intensity.toFixed(3)}`;
    } else if (layoutId === "linearPolDemo") {
      const out = calculateRamanIntensity({
        mode: "A1g",
        inputPolAngle: 2 * state.hwpAngle - state.inputAngle,
        analyzerPolAngle: state.analyzerAngle,
        isDoublePass: false
      });
      computedDetail = `I = ${out.toFixed(3)}`;
    } else if (layoutId === "circularPolDemo") {
      const out = calculatePolarizationChain({
        inputAngle: state.inputAngle,
        qwpAngle: state.qwpAngle,
        hasQwp: true,
        analyzerAngle: state.analyzerAngle,
        hasAnalyzer: true,
        isDoublePass: false
      });
      computedDetail = `I = ${out.transmission.toFixed(3)}`;
    }

    const cardWidth = 280;
    const cardHeight = 66;
    
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", (-cardWidth / 2).toString());
    bg.setAttribute("y", (-cardHeight / 2).toString());
    bg.setAttribute("width", cardWidth.toString());
    bg.setAttribute("height", cardHeight.toString());
    bg.setAttribute("class", "formula-badge-bg");
    g.appendChild(bg);

    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.textContent = "理论公式 & 仿真强度";
    titleText.setAttribute("x", (-cardWidth / 2 + 15).toString());
    titleText.setAttribute("y", "-14");
    titleText.setAttribute("class", "formula-badge-text");
    titleText.setAttribute("font-size", "9.5px");
    titleText.setAttribute("fill", "var(--text-muted)");
    g.appendChild(titleText);

    const math = document.createElementNS("http://www.w3.org/2000/svg", "text");
    math.textContent = mathText;
    math.setAttribute("x", (-cardWidth / 2 + 15).toString());
    math.setAttribute("y", "6");
    math.setAttribute("class", "formula-math-text");
    math.setAttribute("font-size", "11px");
    g.appendChild(math);

    if (computedDetail) {
      const val = document.createElementNS("http://www.w3.org/2000/svg", "text");
      val.textContent = `仿真计算值 ⪢ ${computedDetail}`;
      val.setAttribute("x", (-cardWidth / 2 + 15).toString());
      val.setAttribute("y", "22");
      val.setAttribute("class", "formula-math-text");
      val.setAttribute("fill", "var(--success)");
      val.setAttribute("font-size", "11px");
      g.appendChild(val);
    }
  } 
  
  else if (annotation.type === "rotator") {
    // Render rotating mechanical stage indicator
    const isHwp = annotation.id.includes("hwp") || annotation.id.includes("qwp");
    const color = isHwp ? "#a855f7" : "#ea580c"; // Purple for waveplates, Orange for analyzer
    
    // 1. Draw circular arrow path
    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc.setAttribute("d", "M -12 -5 A 12 12 0 1 1 -12 5");
    arc.setAttribute("fill", "none");
    arc.setAttribute("stroke", color);
    arc.setAttribute("stroke-width", "2");
    g.appendChild(arc);

    // 2. Arrowhead
    const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M -12 5 L -16 1 L -8 1 Z");
    head.setAttribute("fill", color);
    g.appendChild(head);

    // 3. Info text box next to the arrow
    const paddingX = 18;
    
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.textContent = annotation.text;
    txt.setAttribute("x", paddingX.toString());
    txt.setAttribute("y", "-4");
    txt.setAttribute("font-family", "'Outfit', sans-serif");
    txt.setAttribute("font-size", "11px");
    txt.setAttribute("font-weight", "700");
    txt.setAttribute("fill", color);
    g.appendChild(txt);

    // Add smaller scanning angle indicator
    const subTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let angleVal = "";
    if (isHwp) {
      angleVal = annotation.id.includes("qwp") ? `快轴 θ = ${state.qwpAngle.toFixed(1)}°` : `快轴扫描 θ = ${state.hwpAngle.toFixed(1)}°`;
    } else {
      angleVal = `偏振轴 θ = ${state.analyzerAngle}°`;
    }
    subTxt.textContent = angleVal;
    subTxt.setAttribute("x", paddingX.toString());
    subTxt.setAttribute("y", "9");
    subTxt.setAttribute("font-family", "'JetBrains Mono', monospace");
    subTxt.setAttribute("font-size", "9px");
    subTxt.setAttribute("font-weight", "500");
    subTxt.setAttribute("fill", "var(--text-muted)");
    g.appendChild(subTxt);

    // Add border background box behind text for readability
    const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const textLengthEstimate = Math.max(annotation.text.length * 10, angleVal.length * 6) + 12;
    box.setAttribute("x", (paddingX - 6).toString());
    box.setAttribute("y", "-16");
    box.setAttribute("width", textLengthEstimate.toString());
    box.setAttribute("height", "30");
    box.setAttribute("fill", "var(--bg-card)");
    box.setAttribute("stroke", color);
    box.setAttribute("stroke-width", "0.5");
    box.setAttribute("opacity", "0.85");
    box.setAttribute("rx", "4");
    box.setAttribute("ry", "4");
    
    g.insertBefore(box, txt); // Insert background box under text
  }

  return g;
}
