/* src/render/renderBeam.js */

import { calculatePolarizationChain, calculateRamanIntensity, calculateValleyPL, calculateSHGIntensity } from "../utils/opticsMath.js";
import { opticalLayouts } from "../data/layouts.js";

/**
 * Renders an optical beam path, focusing cones, and polarization state arrows.
 */
export function renderBeam(beam, layoutId, state) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", `g-${beam.id}`);

  const points = beam.points;
  if (!points || points.length < 2) return g;

  // 1. Check if we need to render a focusing cone (between Objective and Sample)
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i+1];
    
    // Vertical center at x=700, DM at y=350, Sample at y=720
    const isObjectiveSample = p1[0] === 700 && p1[1] === 350 && p2[0] === 700 && p2[1] === 720;
    const isSampleObjective = p1[0] === 700 && p1[1] === 720 && p2[0] === 700 && p2[1] === 350;

    if (isObjectiveSample || isSampleObjective) {
      const layout = opticalLayouts[layoutId];
      const objective = layout?.components?.find(c => c.type === "objective");
      const objY = objective ? objective.y : 580;
      const coneTopY = objY + 40; // tip of objective housing

      if (isObjectiveSample && beam.type === "excitation") {
        const cone = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        cone.setAttribute("points", `680,${coneTopY} 720,${coneTopY} 700,710`);
        cone.setAttribute("class", "focusing-beam-excitation");
        g.appendChild(cone);
      } else if (isSampleObjective && beam.type === "signal") {
        const cone = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        cone.setAttribute("points", `700,710 678,${coneTopY} 722,${coneTopY}`);
        
        let coneClass = "focusing-beam-emission";
        if (layoutId.startsWith("shg")) coneClass = "focusing-beam-shg";
        else if (layoutId.startsWith("raman") || layoutId === "lifetime") fillRamanCone(cone);
        
        cone.setAttribute("class", coneClass);
        g.appendChild(cone);
      }
    }
  }

  function fillRamanCone(el) {
    el.setAttribute("fill", "rgba(192, 132, 252, 0.15)");
    el.setAttribute("stroke", "rgba(192, 132, 252, 0.4)");
    el.setAttribute("stroke-width", "1");
  }

  // 2. Draw the main path line
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0]} ${points[i][1]}`;
  }
  
  path.setAttribute("d", d);
  
  // Apply specific styles
  let beamClass = "optical-beam";
  if (beam.type === "excitation") beamClass += " beam-excitation";
  else if (beam.type === "signal") {
    if (layoutId.startsWith("pl") || layoutId === "lifetime") beamClass += " beam-pl-emission";
    else if (layoutId.startsWith("raman")) beamClass += " beam-raman-signal";
    else if (layoutId.startsWith("shg")) beamClass += " beam-shg-2omega";
  } else if (beam.type === "blocked") {
    beamClass += " beam-blocked-line";
  }
  path.setAttribute("class", beamClass);
  path.setAttribute("stroke-width", beam.width || 4);
  
  // Set wavelength color dynamically for excitation
  if (beam.type === "excitation") {
    let color = "var(--laser-green)";
    if (layoutId.startsWith("shg")) {
      color = "var(--laser-ir)"; // 1064nm
    } else if (layoutId === "plValley") {
      color = "var(--laser-green)"; // unified 532nm green excitation
    } else if (layoutId === "plStandard") {
      color = "var(--laser-green)"; // 532nm excitation in PL
    }
    path.style.stroke = color;
  }
  
  g.appendChild(path);

  // 3. Draw direction arrows along segments (at midpoints)
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i+1];
    if (beam.type === "blocked") continue;

    const mx = (p1[0] + p2[0]) / 2;
    const my = (p1[1] + p2[1]) / 2;
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const dist = Math.hypot(dx, dy);
    if (dist > 40) {
      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      arrow.setAttribute("d", "M -5 -4 L 5 0 L -5 4 Z");
      arrow.setAttribute("transform", `translate(${mx}, ${my}) rotate(${angle})`);
      
      let color = "var(--primary-color)";
      if (beam.type === "excitation") {
        color = "var(--laser-green)";
        if (layoutId.startsWith("shg")) color = "var(--laser-ir)";
        else if (layoutId === "plValley") color = "var(--laser-green)";
      } else if (beam.type === "signal") {
        if (layoutId.startsWith("pl") || layoutId === "lifetime") color = "var(--beam-pl)";
        else if (layoutId.startsWith("raman")) color = "var(--beam-raman)";
        else if (layoutId.startsWith("shg")) color = "var(--laser-green)"; // SHG 2w signal is 532nm green!
      }
      arrow.setAttribute("fill", color);
      g.appendChild(arrow);
    }
  }

  // 4. Draw Polarization Indicators
  if (beam.hasPolarization) {
    const polPoints = beam.polarizationPoints || [];
    polPoints.forEach(pt => {
      const polG = renderPolarizationIndicator(pt[0], pt[1], beam, layoutId, state);
      g.appendChild(polG);
    });
  }

  return g;
}

function renderPolarizationIndicator(x, y, beam, layoutId, state) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  const pol = getPolarizationAtCoordinates(x, y, beam, layoutId, state);
  
  // 1. Draw white background bubble
  const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bubble.setAttribute("cx", "0");
  bubble.setAttribute("cy", "0");
  bubble.setAttribute("r", "16");
  bubble.setAttribute("fill", "var(--bg-card)");
  bubble.setAttribute("stroke", "var(--border-card)");
  bubble.setAttribute("stroke-width", "0.5");
  bubble.setAttribute("opacity", "0.85");
  g.appendChild(bubble);

  // Apply intensity opacity if defined
  if (pol.intensity !== undefined) {
    g.setAttribute("opacity", Math.max(0.2, pol.intensity).toString());
  }

  // 2. Draw polarization symbols based on state
  if (pol.stateText === "Unpolarized" || pol.stateText === "Partially polarized") {
    // Unpolarized/Partially polarized: crossed V and H double arrows
    const lineH = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineH.setAttribute("x1", "-11");
    lineH.setAttribute("y1", "0");
    lineH.setAttribute("x2", "11");
    lineH.setAttribute("y2", "0");
    lineH.setAttribute("class", "polarization-indicator");
    g.appendChild(lineH);

    const lineV = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineV.setAttribute("x1", "0");
    lineV.setAttribute("y1", "-11");
    lineV.setAttribute("x2", "0");
    lineV.setAttribute("y2", "11");
    lineV.setAttribute("class", "polarization-indicator");
    g.appendChild(lineV);

    // Arrow heads
    const arrows = [
      "M 11 0 L 7.5 -2.5 L 7.5 2.5 Z",   // Right
      "M -11 0 L -7.5 -2.5 L -7.5 2.5 Z", // Left
      "M 0 11 L -2.5 7.5 L 2.5 7.5 Z",   // Down
      "M 0 -11 L -2.5 -7.5 L 2.5 -7.5 Z"  // Up
    ];
    arrows.forEach(d => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", d);
      p.setAttribute("class", "polarization-arrow");
      g.appendChild(p);
    });
  } else if (pol.isCircular) {
    const circ = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    if (pol.chirality > 0) {
      circ.setAttribute("d", "M -10 -4 A 10 10 0 1 1 -10 4");
      circ.setAttribute("class", "polarization-indicator");
      
      const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
      head.setAttribute("d", "M -10 4 L -14 0 L -6 0 Z");
      head.setAttribute("class", "polarization-arrow");
      g.appendChild(head);
    } else {
      circ.setAttribute("d", "M -10 4 A 10 10 0 1 0 -10 -4");
      circ.setAttribute("class", "polarization-indicator");
      
      const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
      head.setAttribute("d", "M -10 -4 L -6 0 L -14 0 Z");
      head.setAttribute("class", "polarization-arrow");
      g.appendChild(head);
    }
    
    circ.setAttribute("stroke-width", "1.5");
    g.appendChild(circ);
    g.classList.add("rotating-pol-state");
  } else if (pol.ellipticity > 0.1) {
    const ell = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    ell.setAttribute("cx", "0");
    ell.setAttribute("cy", "0");
    ell.setAttribute("rx", "12");
    ell.setAttribute("ry", (12 * pol.ellipticity).toString());
    ell.setAttribute("class", "polarization-indicator");
    ell.setAttribute("transform", `rotate(${pol.angle})`);
    g.appendChild(ell);
    
    const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M 12 0 L 8 -4 L 8 4 Z");
    head.setAttribute("class", "polarization-arrow");
    head.setAttribute("transform", `rotate(${pol.angle})`);
    g.appendChild(head);
  } else {
    // Linear representation
    const subG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    subG.setAttribute("transform", `rotate(${-pol.angle})`);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "-12");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", "12");
    line.setAttribute("y2", "0");
    line.setAttribute("class", "polarization-indicator");
    subG.appendChild(line);
    
    const head1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head1.setAttribute("d", "M 12 0 L 7 -3.5 L 7 3.5 Z");
    head1.setAttribute("class", "polarization-arrow");
    subG.appendChild(head1);
    
    const head2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head2.setAttribute("d", "M -12 0 L -7 -3.5 L -7 3.5 Z");
    head2.setAttribute("class", "polarization-arrow");
    subG.appendChild(head2);

    g.appendChild(subG);
  }

  return g;
}

/**
 * Calculates the local polarization state based on T-shaped setup coordinates.
 * Horizontal axis at y=350, vertical microscope arm at x=700.
 */
function getPolarizationAtCoordinates(x, y, beam, layoutId, state) {
  // A. Excitation path polarization
  if (beam.type === "excitation") {
    // 1. Basic Demos
    if (layoutId === "linearPolDemo") {
      if (x < 380) {
        return { angle: 90, isCircular: false, stateText: "Linear-V" };
      } else if (x < 620) {
        const theta = state.inputAngle;
        return { angle: theta, isCircular: false, stateText: `Linear-${theta}°` };
      } else if (x < 920) {
        const out = calculatePolarizationChain({
          inputAngle: state.inputAngle,
          hwpAngle: state.hwpAngle,
          hasHwp: true
        });
        return { angle: out.angle, isCircular: false, stateText: `Linear-${out.angle.toFixed(0)}°` };
      } else {
        const out = calculatePolarizationChain({
          inputAngle: state.inputAngle,
          hwpAngle: state.hwpAngle,
          hasHwp: true,
          analyzerAngle: state.analyzerAngle,
          hasAnalyzer: true
        });
        return { angle: state.analyzerAngle, isCircular: false, intensity: out.transmission, stateText: `Linear-${state.analyzerAngle}°` };
      }
    }
    
    if (layoutId === "circularPolDemo") {
      if (x < 380) {
        return { angle: 90, isCircular: false, stateText: "Linear-V" };
      } else if (x < 620) {
        const theta = state.inputAngle;
        return { angle: theta, isCircular: false, stateText: `Linear-${theta}°` };
      } else if (x < 920) {
        const out = calculatePolarizationChain({
          inputAngle: state.inputAngle,
          qwpAngle: state.qwpAngle,
          hasQwp: true
        });
        let txt = "Elliptical";
        if (out.isCircular) txt = out.chirality > 0 ? "σ⁺" : "σ⁻";
        return { 
          angle: out.angle, 
          isCircular: out.isCircular, 
          chirality: out.chirality, 
          ellipticity: out.ellipticity,
          stateText: txt
        };
      } else {
        const out = calculatePolarizationChain({
          inputAngle: state.inputAngle,
          qwpAngle: state.qwpAngle,
          hasQwp: true,
          analyzerAngle: state.analyzerAngle,
          hasAnalyzer: true
        });
        return { angle: state.analyzerAngle, isCircular: false, intensity: out.transmission, stateText: `Linear-${state.analyzerAngle}°` };
      }
    }

    // 2. Non-polarized standard setups
    if (layoutId === "ramanStandard" || layoutId === "ramanIntro" || layoutId === "plStandard" || layoutId === "plIntro" || layoutId === "lifetime" || layoutId === "shgStandard") {
      if (x < 420) {
        return { angle: 90, isCircular: false, stateText: "Linear-V" };
      } else if (x < 700) {
        return { angle: 90, isCircular: false, stateText: "Linear-V" };
      } else {
        return { angle: 90, isCircular: false, stateText: "Linear-V" };
      }
    }

    if (layoutId === "ramanVV" || layoutId === "ramanVH") {
      return { angle: 90, isCircular: false, stateText: "Linear-V" };
    }

    if (layoutId === "ramanLinear") {
      if (x < 420) {
        return { angle: 90, isCircular: false, stateText: "Linear-V" };
      }
      return { angle: state.inputAngle, isCircular: false, stateText: `Linear-${state.inputAngle.toFixed(0)}°` };
    }

    // 3. Polarized microscope setups
    if (x < 420) {
      return { angle: 0, isCircular: false, stateText: "Linear-H" };
    } else if (x < 700) {
      return { angle: 90, isCircular: false, stateText: "Linear-V" };
    } else if (y < 470) {
      return { angle: 90, isCircular: false, stateText: "Linear-V" };
    } else {
      // after QWP/HWP in vertical arm
      if (layoutId === "plValley") {
        const out = calculatePolarizationChain({
          inputAngle: 90,
          qwpAngle: state.qwpAngle,
          hasQwp: true
        });
        let txt = "Elliptical";
        if (out.isCircular) txt = out.chirality > 0 ? "σ⁺" : "σ⁻";
        return { ...out, stateText: txt };
      } else {
        const hwpPol = (2 * state.hwpAngle - 90) % 180;
        const angle = hwpPol < 0 ? hwpPol + 180 : hwpPol;
        return { angle, isCircular: false, stateText: `Linear-${angle.toFixed(0)}°` };
      }
    }
  }

  // B. Signal path polarization
  if (beam.type === "signal") {
    // 1. Raman signals
    if (layoutId === "ramanVV") {
      return { angle: 90, isCircular: false, stateText: "Linear-V" };
    }
    if (layoutId === "ramanVH") {
      return { angle: 0, isCircular: false, stateText: "Linear-H" };
    }
    if (layoutId === "ramanLinear") {
      if (y > 350 || x < 1180) {
        return { angle: state.inputAngle, isCircular: false, stateText: `Linear-${state.inputAngle.toFixed(0)}°` };
      } else {
        return { angle: state.analyzerAngle, isCircular: false, stateText: `Linear-${state.analyzerAngle.toFixed(0)}°` };
      }
    }
    if (layoutId === "ramanPolarized") {
      const mode = (state.analyzerAngle === 90) ? "A1g" : "E";
      const incPol = (2 * state.hwpAngle - 90) % 180;
      
      if (y > 470) {
        const angle = incPol < 0 ? incPol + 180 : incPol;
        return { angle, isCircular: false, stateText: `Linear-${angle.toFixed(0)}°` };
      } else if (y > 350 || x < 1180) {
        const theta_return = mode === "A1g" ? 90 : (4 * state.hwpAngle - 90) % 180;
        const finalReturn = theta_return < 0 ? theta_return + 180 : theta_return;
        return { angle: finalReturn, isCircular: false, stateText: `Linear-${finalReturn.toFixed(0)}°` };
      } else {
        const intensity = calculateRamanIntensity({
          mode,
          inputPolAngle: 90,
          hwpAngle: state.hwpAngle,
          analyzerPolAngle: state.analyzerAngle,
          crystalAngle: state.crystalAngle,
          isDoublePass: true
        });
        return { angle: state.analyzerAngle, isCircular: false, intensity, stateText: `Linear-${state.analyzerAngle}°` };
      }
    }

    // 2. Non-polarized standard signals (Raman, PL, Lifetime)
    if (layoutId === "ramanStandard") {
      if (y > 350 || x < 1260) {
        return { angle: 90, isCircular: false, stateText: "Partially polarized" };
      } else {
        return { angle: 90, isCircular: false, stateText: "Unpolarized" };
      }
    }
    if (layoutId === "plStandard" || layoutId === "lifetime") {
      return { angle: 90, isCircular: false, stateText: "Unpolarized" };
    }
    if (layoutId === "shgStandard") {
      if (y > 350 || x < 980) {
        return { angle: 90, isCircular: false, stateText: "Partially polarized" };
      } else {
        return { angle: 90, isCircular: false, stateText: "Unpolarized" };
      }
    }

    // 3. PL Polarized
    if (layoutId === "plPolarized") {
      if (y > 470) {
        return { angle: 45, isCircular: false, stateText: "Linear-45°" };
      } else if (y > 350 || x < 1180) {
        const outAngle = (2 * state.hwpAngle - 45) % 180;
        const angle = outAngle < 0 ? outAngle + 180 : outAngle;
        return { angle, isCircular: false, stateText: `Linear-${angle.toFixed(0)}°` };
      } else {
        const outAngle = (2 * state.hwpAngle - 45) % 180;
        const transmission = Math.pow(Math.cos((outAngle - state.analyzerAngle) * Math.PI / 180), 2);
        return { angle: state.analyzerAngle, isCircular: false, intensity: transmission, stateText: `Linear-${state.analyzerAngle}°` };
      }
    }

    // 4. Valley PL (Circular)
    if (layoutId === "plValley") {
      const excChirality = state.qwpAngle === 45 ? 1 : (state.qwpAngle === 135 || state.qwpAngle === -45 ? -1 : 0);
      const v = calculateValleyPL({
        excitationChirality: excChirality,
        temperature: state.temperature,
        magneticField: state.magneticField
      });

      if (y > 470) {
        const docpSign = v.docp >= 0 ? 1 : -1;
        return { isCircular: true, chirality: docpSign, ellipticity: 1.0, stateText: docpSign > 0 ? "σ⁺" : "σ⁻" };
      } else if (y > 350 || x < 1180) {
        const majorityAngle = v.docp >= 0 ? 45 : 135;
        return { angle: majorityAngle, isCircular: false, ellipticity: 0, stateText: `Linear-${majorityAngle}°` };
      } else {
        const majorityAngle = v.docp >= 0 ? 45 : 135;
        const intensity = v.docp >= 0 ? v.iPlus : v.iMinus;
        const transmission = intensity * Math.pow(Math.cos((majorityAngle - state.analyzerAngle) * Math.PI / 180), 2);
        return { angle: state.analyzerAngle, isCircular: false, ellipticity: 0, intensity: transmission, stateText: `Linear-${state.analyzerAngle}°` };
      }
    }

    // 5. SHG Polarized
    if (layoutId.startsWith("shg")) {
      const incPol = (2 * state.hwpAngle - 90) % 180;
      const crystalAngle = state.crystalAngle;
      
      if (y > 470) {
        const angle = incPol < 0 ? incPol + 180 : incPol;
        return { angle, isCircular: false, stateText: `Linear-${angle.toFixed(0)}°` };
      } else if (y > 350 || x < 1280) {
        const theta_return = (6 * state.hwpAngle - 3 * crystalAngle) % 180;
        const finalReturn = theta_return < 0 ? theta_return + 180 : theta_return;
        return { angle: finalReturn, isCircular: false, stateText: `Linear-${finalReturn.toFixed(0)}°` };
      } else {
        const intensity = calculateSHGIntensity({
          inputPolAngle: 90,
          hwpAngle: state.hwpAngle,
          analyzerPolAngle: state.analyzerAngle,
          crystalAngle: crystalAngle,
          isDoublePass: true
        });
        return { angle: state.analyzerAngle, isCircular: false, intensity, stateText: `Linear-${state.analyzerAngle}°` };
      }
    }
  }

  return { angle: 90, isCircular: false, ellipticity: 0, stateText: "Linear-V" };
}
