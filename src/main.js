/* src/main.js */

import state from "./state.js";
import { opticalLayouts } from "./data/layouts.js";
import { renderCanvas } from "./render/renderCanvas.js";
import { renderLayoutList, updateCanvasLegend } from "./app.js";
import { renderInfoPanel } from "./render/renderInfoPanel.js";
import { exportSVG } from "./utils/exportSvg.js";

// DOM cache
const svgCanvas = document.querySelector("#optical-canvas");
const layoutListContainer = document.querySelector("#layout-list");
const legendContainer = document.querySelector("#canvas-legend");

const paramsPanel = document.querySelector("#params-panel");
const theoryPanel = document.querySelector("#theory-panel");
const detailPanel = document.querySelector("#component-detail");

const btnTheme = document.querySelector("#toggle-theme");
const btnGrid = document.querySelector("#toggle-grid");
const btnFormulas = document.querySelector("#toggle-formulas");
const btnExport = document.querySelector("#export-svg");

const textCategory = document.querySelector("#current-category");
const textTitle = document.querySelector("#current-title");

/**
 * Perform layout transition. Updates top header titles, active states,
 * and redraws both the canvas and parameters side panel.
 */
function setLayout(layoutId) {
  state.setLayout(layoutId);
}

/**
 * Unified render function called on state change.
 */
function updateUI(currentState) {
  const currentLayout = opticalLayouts[currentState.currentLayoutId];
  if (!currentLayout) return;

  // 1. Sync header titles
  if (textCategory) textCategory.textContent = currentLayout.category;
  if (textTitle) textTitle.textContent = currentLayout.title;

  // 2. Redraw canvas
  renderCanvas(svgCanvas, currentLayout, currentState);

  // 3. Update legends
  updateCanvasLegend(legendContainer, currentLayout);

  // 4. Update parameter sliders & physical theory texts & hovered details
  renderInfoPanel(paramsPanel, theoryPanel, detailPanel, currentLayout);

  // 5. Sync toolbar button visual active states
  if (btnGrid) {
    btnGrid.classList.toggle("active", currentState.showGrid);
  }
  if (btnFormulas) {
    btnFormulas.classList.toggle("active", currentState.showFormulas);
  }
}

// -------------------------------------------------------------
// Bind Toolbar Buttons & Controls
// -------------------------------------------------------------

// Toggle Grid
if (btnGrid) {
  btnGrid.addEventListener("click", () => {
    state.toggleGrid();
  });
}

// Toggle Formulas
if (btnFormulas) {
  btnFormulas.addEventListener("click", () => {
    state.toggleFormulas();
  });
}

// Toggle Theme
if (btnTheme) {
  btnTheme.addEventListener("click", () => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    state.setTheme(nextTheme);
  });
}

// Export SVG
if (btnExport) {
  btnExport.addEventListener("click", () => {
    exportSVG(svgCanvas);
  });
}

// -------------------------------------------------------------
// Initialization
// -------------------------------------------------------------

// 1. Subscribe to state changes for reactive drawing updates
state.subscribe(updateUI);

// 2. Initialize left sidebar navigation items
renderLayoutList(layoutListContainer, setLayout);

// 3. Trigger initial render
setLayout(state.currentLayoutId);

// 4. Sync HTML attribute for theme
document.documentElement.setAttribute("data-theme", state.theme);
