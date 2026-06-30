/* src/utils/opticsMath.js */

/**
 * Optics Mathematics Utility using Jones calculus concepts.
 * Handles polarization states and intensities for Raman, PL, and SHG setups.
 * Supports both single-pass (transmission basics) and double-pass (T-shaped microscope common-path) waveplates.
 */

/**
 * Calculates output of a polarizer + HWP + QWP + Analyzer chain.
 * Returns the state description and intensity transmission.
 */
export function calculatePolarizationChain(params) {
  const {
    inputAngle = 90,   // Linear polarizer angle (0 = Horizontal, 90 = Vertical)
    hwpAngle = 0,      // HWP fast-axis angle
    hasHwp = false,
    qwpAngle = 0,      // QWP fast-axis angle
    hasQwp = false,
    analyzerAngle = 90, // Analyzer angle
    hasAnalyzer = false,
    isDoublePass = false // If true, light passes back through the same waveplate
  } = params;

  // Initial state is linear polarized along inputAngle
  let polAngle = inputAngle; 
  let isCircular = false;
  let chirality = 0; // 0 = linear, 1 = RHC (s+), -1 = LHC (s-)
  let ellipticity = 0; // b/a ratio

  // 1. Pass through HWP (forward)
  if (hasHwp) {
    polAngle = (2 * hwpAngle - polAngle) % 180;
    if (polAngle < 0) polAngle += 180;
  }

  // 2. Pass through QWP (forward)
  if (hasQwp) {
    const diff = (polAngle - qwpAngle) % 180;
    const absDiff = Math.abs(diff);

    if (Math.abs(absDiff - 45) < 2 || Math.abs(absDiff - 135) < 2) {
      isCircular = true;
      ellipticity = 1.0;
      const sinVal = Math.sin(2 * (polAngle - qwpAngle) * Math.PI / 180);
      chirality = sinVal > 0 ? 1 : -1;
    } else if (Math.abs(absDiff % 90) < 2) {
      isCircular = false;
      ellipticity = 0;
      chirality = 0;
    } else {
      isCircular = false;
      ellipticity = Math.abs(Math.sin(2 * (polAngle - qwpAngle) * Math.PI / 180));
      const sinVal = Math.sin(2 * (polAngle - qwpAngle) * Math.PI / 180);
      chirality = sinVal > 0 ? 0.5 : -0.5;
    }
  }

  // 3. Double-pass return path
  if (isDoublePass) {
    // For symmetric Raman scattering, return polarization before HWP is equal to the incident polarization (polAngle)
    // If it passes back through the QWP/HWP, the polarization is transformed again
    if (hasQwp) {
      // Circular light σ+ returning through QWP becomes linear at +45/135 depending on QWP angle
      if (isCircular) {
        isCircular = false;
        ellipticity = 0;
        polAngle = (qwpAngle + (chirality > 0 ? 45 : -45)) % 180;
        if (polAngle < 0) polAngle += 180;
      }
    }
    
    if (hasHwp) {
      // Return linear polarization polAngle through HWP: out = 2 * hwp - polAngle
      // For symmetric mode, polAngle was 2 * hwp - inputAngle.
      // So return = 2 * hwp - (2 * hwp - inputAngle) = inputAngle!
      polAngle = (2 * hwpAngle - polAngle) % 180;
      if (polAngle < 0) polAngle += 180;
    }
  }

  // 4. Pass through Analyzer (Transmission)
  let transmission = 1.0;
  if (hasAnalyzer) {
    if (isCircular) {
      transmission = 0.5;
    } else {
      const psi = polAngle * Math.PI / 180;
      const phi = analyzerAngle * Math.PI / 180;
      const chi = Math.atan(ellipticity);
      
      transmission = Math.pow(Math.cos(chi), 2) * Math.pow(Math.cos(psi - phi), 2) +
                     Math.pow(Math.sin(chi), 2) * Math.pow(Math.sin(psi - phi), 2);
    }
  }

  return {
    angle: polAngle,
    isCircular,
    chirality,
    ellipticity,
    transmission
  };
}

/**
 * Calculates Raman Scattering Intensity based on Raman Tensor projection.
 * Supports the common-path HWP configuration (double-pass).
 */
export function calculateRamanIntensity(params) {
  const {
    mode = "A1g",        // mode: "A1g" (isotropic/symmetric) or "E" (shear/anisotropic)
    inputPolAngle = 0,   // Incident polarization e_i (deg) - now 0 for horizontal P
    hwpAngle = 0,        // HWP angle (deg)
    analyzerPolAngle = 0, // Analyzer angle e_s (deg)
    crystalAngle = 0,    // Crystal orientation (deg)
    hasAnalyzer = true,
    isDoublePass = true
  } = params;

  if (!isDoublePass) {
    // Single pass basics
    const theta_i = (inputPolAngle - crystalAngle) * Math.PI / 180;
    const theta_s = (analyzerPolAngle - crystalAngle) * Math.PI / 180;
    if (mode === "A1g") {
      return hasAnalyzer ? Math.pow(Math.cos(theta_s - theta_i), 2) : 1.0;
    } else {
      return hasAnalyzer ? Math.pow(Math.cos(theta_i + theta_s), 2) : 0.5;
    }
  }

  // Common-path Double-pass calculations:
  // 1. Excitation light starts horizontal (inputPolAngle = 0).
  // 2. Passes HWP -> linear polarization on sample is 2 * hwpAngle.
  // 3. Scattering by sample:
  if (mode === "A1g") {
    // Symmetric mode: scattered polarization matches excitation polarization (2 * hwpAngle).
    // 4. Passes back through HWP -> rotates back to 2 * hwp - 2 * hwp = 0 (horizontal).
    // 5. Through analyzer at analyzerPolAngle:
    const theta_return = 0; // always horizontal
    return hasAnalyzer ? Math.pow(Math.cos((analyzerPolAngle - theta_return) * Math.PI / 180), 2) : 1.0;
  } else if (mode === "E") {
    // Shear mode: scattered polarization relative to excitation is reflected (angle = -2 * hwp).
    // 4. Passes back through HWP -> rotates to 2 * hwp - (-2 * hwp) = 4 * hwp.
    // 5. Through analyzer at analyzerPolAngle:
    const theta_return = 4 * hwpAngle;
    return hasAnalyzer ? Math.pow(Math.cos((theta_return - analyzerPolAngle) * Math.PI / 180), 2) : 0.5;
  }

  return 1.0;
}

/**
 * Simulates Valley PL and Degree of Circular Polarization (DOCP) in TMDs.
 */
export function calculateValleyPL(params) {
  const {
    excitationChirality = 1,
    temperature = 1.7,
    magneticField = 0
  } = params;

  const tempFactor = Math.exp(-(temperature - 1.7) / 40);
  let baseDocp = 0.85 * tempFactor;
  
  if (excitationChirality === 0) {
    baseDocp = 0;
  } else {
    baseDocp = baseDocp * (excitationChirality > 0 ? 1 : -1);
  }

  const g = -4.0;
  const u_B = 0.05788;
  const k_B = 0.08617;
  
  const splitting = g * u_B * magneticField;
  const thermalEnergy = k_B * Math.max(temperature, 0.5);
  const bFieldImbalance = Math.tanh(splitting / (2 * thermalEnergy));
  
  let finalDocp = baseDocp + (1 - Math.abs(baseDocp)) * bFieldImbalance;
  finalDocp = Math.max(-1.0, Math.min(1.0, finalDocp));

  const iPlus = 0.5 * (1 + finalDocp);
  const iMinus = 0.5 * (1 - finalDocp);

  return {
    docp: finalDocp,
    iPlus,
    iMinus,
    zeemanSplitting: splitting
  };
}

/**
 * Calculates Second Harmonic Generation (SHG) intensity.
 * Handles the common-path HWP configuration (double-pass).
 */
export function calculateSHGIntensity(params) {
  const {
    inputPolAngle = 0,     // Laser polarizer P (deg) - usually 0 (horizontal)
    hwpAngle = 0,          // HWP fast axis (deg)
    analyzerPolAngle = 0,  // Analyzer angle A (deg)
    crystalAngle = 0,      // Crystal armchair direction (deg)
    hasAnalyzer = true,
    isDoublePass = true
  } = params;

  if (!isDoublePass) {
    // Single pass basics
    const theta = (inputPolAngle - crystalAngle) * Math.PI / 180;
    return Math.pow(Math.cos(3 * theta), 2);
  }

  // Common-path Double-pass SHG:
  // 1. Excitation polarization on sample is alpha = 2 * hwpAngle.
  // 2. Relative to crystal axis: alpha - crystalAngle.
  // 3. SHG polarization relative to crystal axis: -2 * (alpha - crystalAngle) = -4 * hwp + 2 * crystal.
  // 4. SHG polarization in lab coordinates: -4 * hwp + 3 * crystal.
  // 5. Passes back through HWP -> output polarization in lab is:
  //    theta_return = 2 * hwp - (-4 * hwp + 3 * crystal) = 6 * hwp - 3 * crystal.
  // 6. Intensity through Analyzer:
  const theta_return = 6 * hwpAngle - 3 * crystalAngle;
  return hasAnalyzer ? Math.pow(Math.cos((theta_return - analyzerPolAngle) * Math.PI / 180), 2) : 0.5;
}
