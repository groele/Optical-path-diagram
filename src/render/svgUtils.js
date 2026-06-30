/* src/render/svgUtils.js */

/**
 * Standard markers, filters, patterns and gradient definitions for SVG.
 */
export function createSvgDefs() {
  return `
    <!-- Glowing beam filters -->
    <filter id="beam-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <filter id="laser-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="var(--primary-color)" flood-opacity="0.5" />
    </filter>

    <!-- Grating lines pattern -->
    <pattern id="grating-lines" width="4" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="4" stroke="var(--text-muted)" stroke-width="1" />
    </pattern>

    <!-- Dichroic thin-film gradient -->
    <linearGradient id="dichroic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#ec4899" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.8" />
    </linearGradient>

    <!-- 2D Flake glowing gradient -->
    <radialGradient id="flake-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d946ef" stop-opacity="1" />
      <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.8" />
      <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.1" />
    </radialGradient>
  `;
}

/**
 * Renders an optomechanical breadboard grid.
 * Draws lines and realistic threaded screw holes.
 */
export function renderGrid(width, height, spacing, majorSpacing) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", "grid-group");

  // 1. Solid breadboard background
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", width);
  bg.setAttribute("height", height);
  bg.setAttribute("class", "breadboard-base");
  g.appendChild(bg);

  // 2. Draw Grid Lines
  const pathLines = document.createElementNS("http://www.w3.org/2000/svg", "path");
  let dMinor = "";
  let dMajor = "";

  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    if (x % majorSpacing === 0) {
      dMajor += `M ${x} 0 L ${x} ${height} `;
    } else {
      dMinor += `M ${x} 0 L ${x} ${height} `;
    }
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    if (y % majorSpacing === 0) {
      dMajor += `M 0 ${y} L ${width} ${y} `;
    } else {
      dMinor += `M 0 ${y} L ${width} ${y} `;
    }
  }

  const minorPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  minorPath.setAttribute("d", dMinor);
  minorPath.setAttribute("class", "grid-line-minor");
  g.appendChild(minorPath);

  const majorPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  majorPath.setAttribute("d", dMajor);
  majorPath.setAttribute("class", "grid-line-major");
  g.appendChild(majorPath);

  // 3. Draw Breadboard Threaded Screw Holes (M6 holes at 80px virtual spacing)
  // This gives a stunning optomechanics look!
  const holeSpacing = 80;
  const holesG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  holesG.setAttribute("id", "grid-holes");
  
  for (let x = holeSpacing; x < width; x += holeSpacing) {
    for (let y = holeSpacing; y < height; y += holeSpacing) {
      // Draw M6 socket
      const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      outerCircle.setAttribute("cx", x);
      outerCircle.setAttribute("cy", y);
      outerCircle.setAttribute("r", "3.5");
      outerCircle.setAttribute("class", "breadboard-hole-circle");
      holesG.appendChild(outerCircle);
      
      const innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      innerCircle.setAttribute("cx", x);
      innerCircle.setAttribute("cy", y);
      innerCircle.setAttribute("r", "1.5");
      innerCircle.setAttribute("fill", "#000");
      holesG.appendChild(innerCircle);
    }
  }
  g.appendChild(holesG);

  // 4. Add outer border
  const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  border.setAttribute("x", "0");
  border.setAttribute("y", "0");
  border.setAttribute("width", width);
  border.setAttribute("height", height);
  border.setAttribute("fill", "none");
  border.setAttribute("class", "breadboard-border-line");
  g.appendChild(border);

  return g;
}
