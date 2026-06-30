/* src/utils/exportSvg.js */

/**
 * Packs the active SVG canvas along with all CSS styles, Design Tokens,
 * and fonts, then prompts a browser download for the SVG file.
 */
export function exportSVG(svgElement) {
  if (!svgElement) return;

  // 1. Clone the SVG element to avoid modifying the screen DOM
  const clone = svgElement.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // 2. Fetch computed CSS variables from current document root
  // This ensures the SVG carries the active theme's colors
  const rootStyles = getComputedStyle(document.documentElement);
  const colorVars = [
    "--bg-page", "--text-main", "--text-secondary", "--text-muted", "--line-soft",
    "--primary-color", "--laser-red", "--laser-green", "--laser-cyan", "--laser-deepred", "--laser-ir",
    "--beam-raman", "--beam-pl", "--beam-shg", "--beam-blocked",
    "--mount-fill", "--mount-stroke", "--glass-fill", "--glass-stroke",
    "--breadboard-bg", "--breadboard-border", "--breadboard-grid", "--breadboard-grid-major", "--breadboard-hole", "--breadboard-hole-glow",
    "--component-body", "--component-border", "--component-accent", "--optics-glass", "--optics-glass-border"
  ];

  let rootCssVars = ":root {\n";
  colorVars.forEach(v => {
    const val = rootStyles.getPropertyValue(v).trim();
    if (val) rootCssVars += `  ${v}: ${val};\n`;
  });
  rootCssVars += "}\n";

  // 3. Extract relevant CSS rules from active document stylesheets
  let inlineStylesText = rootCssVars + "\n";
  
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    try {
      // Look for custom local stylesheets, ignore third-party ones if any
      if (sheet.href && !sheet.href.includes(window.location.origin)) continue;
      
      const rules = sheet.cssRules || sheet.rules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          const ruleText = rules[j].cssText;
          // Only package SVG-related rules to keep size optimal
          if (
            ruleText.includes(".component") ||
            ruleText.includes(".beam") ||
            ruleText.includes(".optical") ||
            ruleText.includes(".grid") ||
            ruleText.includes(".breadboard") ||
            ruleText.includes(".polarization") ||
            ruleText.includes(".formula") ||
            ruleText.includes("indicator") ||
            ruleText.includes("badge")
          ) {
            inlineStylesText += ruleText + "\n";
          }
        }
      }
    } catch (e) {
      console.warn("Could not read stylesheet rules for export:", e);
    }
  }

  // 4. Inject styles into cloned SVG <defs>
  let defs = clone.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    clone.insertBefore(defs, clone.firstChild);
  }

  const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
  styleEl.textContent = inlineStylesText;
  defs.appendChild(styleEl);

  // 5. Serialize and download
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(clone);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `optical-path-${clone.id || "schematic"}.svg`;
  a.click();

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
export default exportSVG;
