/* src/render/renderCanvas.js */

import { createSvgDefs, renderGrid } from "./svgUtils.js";
import { renderComponent } from "./renderComponent.js";
import { renderBeam } from "./renderBeam.js";
import { renderAnnotation } from "./renderAnnotation.js";
import { renderInfoPage } from "./renderInfoPages.js";

/**
 * Renders the entire optical pathway schematic or the educational info page.
 */
export function renderCanvas(svg, layout, state) {
  if (!svg || !layout) return;

  // 1. Clear previous drawings
  svg.innerHTML = "";

  // 2. Check if this layout is actually a documentation/educational page
  if (layout.type === "info-page") {
    renderInfoPage(svg, layout.id);
    return;
  }

  // 3. Append <defs> for styles, gradients, and filters
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = createSvgDefs();
  svg.appendChild(defs);

  // 4. Render Optics Breadboard Grid (underlay)
  const gridLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridLayer.setAttribute("id", "layer-grid");
  if (state.showGrid) {
    gridLayer.appendChild(renderGrid(1600, 900, 20, 80));
  } else {
    // If grid is disabled, draw a solid dark page background
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", "1600");
    bg.setAttribute("height", "900");
    bg.setAttribute("fill", "var(--bg-page)");
    gridLayer.appendChild(bg);
    
    // Draw simple frame border
    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", "0");
    border.setAttribute("y", "0");
    border.setAttribute("width", "1600");
    border.setAttribute("height", "900");
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "var(--border-card)");
    border.setAttribute("stroke-width", "2");
    gridLayer.appendChild(border);
  }
  svg.appendChild(gridLayer);

  // 5. Render light beams (middle layer)
  const beamLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  beamLayer.setAttribute("id", "layer-beams");
  if (layout.beams) {
    layout.beams.forEach(beam => {
      beamLayer.appendChild(renderBeam(beam, layout.id, state));
    });
  }
  svg.appendChild(beamLayer);

  // 6. Render optical components (top layer)
  const componentLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  componentLayer.setAttribute("id", "layer-components");
  if (layout.components) {
    layout.components.forEach(comp => {
      componentLayer.appendChild(renderComponent(comp));
    });
  }
  svg.appendChild(componentLayer);

  // 7. Render labels and annotations (uppermost layer)
  const annotationLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  annotationLayer.setAttribute("id", "layer-annotations");
  if (layout.annotations) {
    layout.annotations.forEach(ann => {
      annotationLayer.appendChild(renderAnnotation(ann, layout.id));
    });
  }
  svg.appendChild(annotationLayer);
}

export default renderCanvas;
