# Optical Path Diagram

A polished static Web system for teaching and documenting Raman, PL, SHG, polarization-resolved spectroscopy, circular-polarization modes, and lifetime-measurement optical paths.

## Contents

- `index.html` — single-file interactive optical-path diagram system.
- `.github/workflows/deploy-pages.yml` — optional GitHub Pages deployment workflow.
- `.gitignore` — common local/cache exclusions.

## Instrument configuration encoded in the page

- Raman laser: 532 nm.
- PL laser: 532 nm.
- SHG laser: 1064 nm.
- Raman grating: 1800 gr/mm.
- PL / SHG grating: 150 gr/mm.
- Raman includes a standard intensity Raman measurement schematic.
- Polarization module includes linear polarization, crossed/parallel detection, and four circular-polarization modes.
- Each optical element card shows the output polarization state after that element.

## Run locally

Open `index.html` directly in a browser, or serve it locally:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

The repository includes a GitHub Pages workflow. In GitHub, enable Pages with **Build and deployment → Source: GitHub Actions**. After the workflow runs, the site can be visited from the Pages URL.

## Design principle

The system uses a virtual coordinate system and reusable optical-component primitives. The goal is to keep all Raman / PL / SHG / lifetime diagrams visually consistent, compact, and suitable for research teaching slides or laboratory documentation.
