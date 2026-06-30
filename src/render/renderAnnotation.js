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

  if (!state.showFormulas && annotation.type !== "rotator") return g;

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

    if (layoutId === "ramanLinear") {
      const res = Math.pow(Math.cos((state.inputAngle - state.analyzerAngle) * Math.PI / 180), 2);
      computedDetail = `I = ${res.toFixed(3)}`;
    } else if (layoutId.startsWith("raman") && layoutId !== "ramanStandard" && layoutId !== "ramanIntro") {
      const mode = (layoutId === "ramanVV" || layoutId === "ramanPolarized" && state.analyzerAngle === 90) ? "A1g" : "E";
      const isFixed = layoutId === "ramanVV" || layoutId === "ramanVH";
      const intensity = calculateRamanIntensity({
        mode,
        inputPolAngle: 90, // V input
        hwpAngle: isFixed ? 0 : state.hwpAngle,
        analyzerPolAngle: layoutId === "ramanVV" ? 90 : (layoutId === "ramanVH" ? 0 : state.analyzerAngle),
        crystalAngle: state.crystalAngle,
        isDoublePass: !isFixed
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
    } else if (layoutId === "lifetime") {
      computedDetail = `τ = ${state.tauValue.toFixed(1)} ns`;
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
    const isWaveplateStage = annotation.id.includes("hwp") || annotation.id.includes("qwp");
    const isQwp = annotation.id.includes("qwp");
    const color = isWaveplateStage ? "#a855f7" : "#ea580c";
    const accent = isWaveplateStage ? "#f59e0b" : "#38bdf8";
    const targetDx = annotation.targetX !== undefined ? annotation.targetX - annotation.x : (isWaveplateStage ? -40 : -20);
    const targetDy = annotation.targetY !== undefined ? annotation.targetY - annotation.y : (isWaveplateStage ? 0 : 80);
    const labelX = annotation.labelX ?? 22;
    const labelY = annotation.labelY ?? -18;
    const labelWidth = annotation.labelWidth ?? 236;
    const labelHeight = annotation.detail ? 76 : 54;
    const title = annotation.title || annotation.text;
    const detail = annotation.detail || "";

    // Leader points directly to the motorized rotating mount.
    const leader = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leader.setAttribute("d", `M ${targetDx} ${targetDy} L 0 0 L ${labelX - 6} ${labelY + labelHeight / 2}`);
    leader.setAttribute("fill", "none");
    leader.setAttribute("stroke", color);
    leader.setAttribute("stroke-width", "2");
    leader.setAttribute("stroke-dasharray", "7 5");
    leader.setAttribute("opacity", "0.85");
    g.appendChild(leader);

    const targetRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    targetRing.setAttribute("cx", targetDx.toString());
    targetRing.setAttribute("cy", targetDy.toString());
    targetRing.setAttribute("r", isWaveplateStage ? "44" : "40");
    targetRing.setAttribute("fill", "none");
    targetRing.setAttribute("stroke", color);
    targetRing.setAttribute("stroke-width", "2.8");
    targetRing.setAttribute("stroke-dasharray", "9 5");
    targetRing.setAttribute("opacity", "0.75");
    g.appendChild(targetRing);

    const hub = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hub.setAttribute("cx", targetDx.toString());
    hub.setAttribute("cy", targetDy.toString());
    hub.setAttribute("r", isWaveplateStage ? "10" : "9");
    hub.setAttribute("fill", "var(--bg-card)");
    hub.setAttribute("stroke", color);
    hub.setAttribute("stroke-width", "2");
    g.appendChild(hub);

    // Circular arrow marks the movable rotation mechanism.
    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc.setAttribute("d", "M -12 -5 A 12 12 0 1 1 -12 5");
    arc.setAttribute("fill", "none");
    arc.setAttribute("stroke", color);
    arc.setAttribute("stroke-width", "3");
    g.appendChild(arc);

    const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M -12 5 L -16 1 L -8 1 Z");
    head.setAttribute("fill", color);
    g.appendChild(head);

    const card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    card.setAttribute("x", labelX.toString());
    card.setAttribute("y", labelY.toString());
    card.setAttribute("width", labelWidth.toString());
    card.setAttribute("height", labelHeight.toString());
    card.setAttribute("class", "rotator-card-bg");
    card.setAttribute("stroke", color);
    g.appendChild(card);

    const tag = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tag.setAttribute("x", (labelX + 8).toString());
    tag.setAttribute("y", (labelY + 10).toString());
    tag.setAttribute("width", isWaveplateStage ? "50" : "78");
    tag.setAttribute("height", "22");
    tag.setAttribute("rx", "4");
    tag.setAttribute("fill", color);
    tag.setAttribute("opacity", "0.9");
    g.appendChild(tag);

    const tagText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tagText.textContent = isQwp ? "QWP" : (isWaveplateStage ? "HWP" : "Analyzer");
    tagText.setAttribute("x", (labelX + (isWaveplateStage ? 33 : 47)).toString());
    tagText.setAttribute("y", (labelY + 25).toString());
    tagText.setAttribute("font-family", "'JetBrains Mono', monospace");
    tagText.setAttribute("font-size", "11px");
    tagText.setAttribute("font-weight", "800");
    tagText.setAttribute("fill", "#ffffff");
    tagText.setAttribute("text-anchor", "middle");
    g.appendChild(tagText);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.textContent = title;
    txt.setAttribute("x", (labelX + (isWaveplateStage ? 68 : 96)).toString());
    txt.setAttribute("y", (labelY + 26).toString());
    txt.setAttribute("font-family", "'Outfit', sans-serif");
    txt.setAttribute("font-size", "16px");
    txt.setAttribute("font-weight", "800");
    txt.setAttribute("fill", "var(--text-main)");
    g.appendChild(txt);

    if (detail) {
      const detailTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      detailTxt.textContent = detail;
      detailTxt.setAttribute("x", (labelX + 10).toString());
      detailTxt.setAttribute("y", (labelY + 47).toString());
      detailTxt.setAttribute("font-family", "'Outfit', sans-serif");
      detailTxt.setAttribute("font-size", "13px");
      detailTxt.setAttribute("font-weight", "700");
      detailTxt.setAttribute("fill", accent);
      g.appendChild(detailTxt);
    }

    const subTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let angleVal = "";
    if (isWaveplateStage) {
      angleVal = annotation.id.includes("qwp") ? `快轴 θ = ${state.qwpAngle.toFixed(1)}°` : `快轴扫描 θ = ${state.hwpAngle.toFixed(1)}°`;
    } else {
      angleVal = `偏振轴 θ = ${state.analyzerAngle}°`;
    }
    subTxt.textContent = angleVal;
    subTxt.setAttribute("x", (labelX + 10).toString());
    subTxt.setAttribute("y", (labelY + labelHeight - 10).toString()); // Inside card
    subTxt.setAttribute("font-family", "'JetBrains Mono', monospace");
    subTxt.setAttribute("font-size", "11.5px");
    subTxt.setAttribute("font-weight", "700");
    subTxt.setAttribute("fill", "var(--text-main)");
    g.appendChild(subTxt);

    // Glowing LED status indicator dot
    const led = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    led.setAttribute("cx", (labelX + labelWidth - 16).toString());
    led.setAttribute("cy", (labelY + labelHeight - 14).toString());
    led.setAttribute("r", "4");
    led.setAttribute("fill", "#10b981"); // glowing emerald active green
    led.setAttribute("style", "filter: drop-shadow(0 0 2px #10b981)");
    g.appendChild(led);
  }

  return g;
}
