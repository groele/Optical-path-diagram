/* src/state.js */

import { opticalLayouts } from "./data/layouts.js";

class AppState {
  constructor() {
    this.listeners = [];
    
    // Default system settings
    this.currentLayoutId = "overview"; // Starts at page 1: Overview
    this.showGrid = true;
    this.showFormulas = false;
    this.theme = "dark";
    
    // Physical Optics Simulation parameters
    this.hwpAngle = 0;       // Half-wave plate angle (deg)
    this.qwpAngle = 45;      // Quarter-wave plate angle (deg)
    this.analyzerAngle = 90; // Analyzer angle (deg)
    this.inputAngle = 90;    // Laser input polarizer angle (deg)
    this.crystalAngle = 0;   // Sample crystal axis angle (deg)
    this.tauValue = 1.5;     // Exciton decay lifetime tau (ns)
    
    // Material & Low-temp parameters
    this.laserWavelength = "532 nm";
    this.material = "MoS₂";
    this.temperature = 300; // Kelvin
    this.magneticField = 0;  // Tesla
    
    // Hover details
    this.hoveredComponentId = null;
    
    // Initial load parameters from storage if exists
    this.loadFromLocalStorage();
  }

  // Register listener for state changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Trigger all subscribers
  notify() {
    this.listeners.forEach(callback => callback(this));
    this.saveToLocalStorage();
  }

  // Switch to a new optical path layout
  setLayout(layoutId) {
    if (!opticalLayouts[layoutId]) return;
    
    this.currentLayoutId = layoutId;
    const layout = opticalLayouts[layoutId];
    
    // Apply layout-specific defaults
    if (layoutId === "overview") {
      this.laserWavelength = "532 nm";
      this.material = "MoS₂";
    } else if (layoutId === "ramanStandard") {
      this.laserWavelength = "532 nm";
      this.material = "MoS₂";
      this.temperature = 300;
      this.magneticField = 0;
    } else if (layoutId === "ramanPolarized") {
      this.analyzerAngle = 90;
      this.hwpAngle = 0;
      this.laserWavelength = "532 nm";
      this.material = "MoS₂";
      this.temperature = 300;
      this.magneticField = 0;
    } else if (layoutId === "plStandard") {
      this.laserWavelength = "532 nm";
      this.material = "MoS₂";
      this.temperature = 300;
      this.magneticField = 0;
    } else if (layoutId === "plPolarized") {
      this.laserWavelength = "532 nm";
      this.hwpAngle = 0;
      this.analyzerAngle = 90;
      this.material = "ReS₂";
      this.temperature = 300;
      this.magneticField = 0;
    } else if (layoutId === "plValley") {
      this.laserWavelength = "532 nm"; // Shared 532nm in valley circular PL too
      this.qwpAngle = 45;
      this.analyzerAngle = 90;
      this.material = "WSe₂";
      this.temperature = 1.7; // cryogenic
      this.magneticField = 0;
    } else if (layoutId === "shgStandard") {
      this.laserWavelength = "1064 nm";
      this.material = "MoS₂";
    } else if (layoutId === "shgPolarized") {
      this.laserWavelength = "1064 nm"; // Fundamental excitation
      this.hwpAngle = 0;
      this.analyzerAngle = 90;
      this.crystalAngle = 0;
      this.material = "MoS₂";
    } else if (layoutId === "lifetime") {
      this.laserWavelength = "532 nm";
      this.material = "WS₂";
      this.temperature = 300;
      this.magneticField = 0;
      this.tauValue = 1.5;
    }
    
    // Auto sync material name from layout if present
    const mainSample = layout.components.find(c => c.type === "sample");
    if (mainSample) {
      this.material = mainSample.params?.material || this.material;
    }

    this.notify();
  }

  // Update a single parameter value
  setParam(key, value) {
    if (this[key] !== value) {
      // Cast numeric parameters
      if (typeof this[key] === "number") {
        this[key] = Number(value);
      } else {
        this[key] = value;
      }
      this.notify();
    }
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.notify();
  }

  toggleFormulas() {
    this.showFormulas = !this.showFormulas;
    this.notify();
  }

  setTheme(themeName) {
    if (themeName === "dark" || themeName === "light") {
      this.theme = themeName;
      document.documentElement.setAttribute("data-theme", themeName);
      this.notify();
    }
  }

  setHoveredComponent(componentId) {
    if (this.hoveredComponentId !== componentId) {
      this.hoveredComponentId = componentId;
      this.notify();
    }
  }

  // LocalStorage integration
  saveToLocalStorage() {
    try {
      const configToSave = {
        theme: this.theme,
        showGrid: this.showGrid,
        showFormulas: this.showFormulas,
        currentLayoutId: this.currentLayoutId
      };
      localStorage.setItem("modular_optics_state", JSON.stringify(configToSave));
    } catch (e) {
      console.warn("Could not save state to localStorage:", e);
    }
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem("modular_optics_state");
      if (saved) {
        const config = JSON.parse(saved);
        this.theme = config.theme || "dark";
        this.showGrid = config.showGrid !== undefined ? config.showGrid : true;
        this.showFormulas = config.showFormulas !== undefined ? config.showFormulas : true;
        this.currentLayoutId = config.currentLayoutId || "overview";
        
        document.documentElement.setAttribute("data-theme", this.theme);
      }
    } catch (e) {
      console.warn("Could not load state from localStorage:", e);
    }
  }
}

// Export singleton appState
export const appState = new AppState();
export default appState;
