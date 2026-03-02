# 🌍 K-AI BRIDGE — Tanzania AI Vision System

> **Week 1 Submission** · AI Programme Vibe Coding  
> **Auditor**: Antigravity · **Date**: February 2026

---

## What is This?

**K-AI Bridge** is a Quality Assurance and Adaptation System for AI training data.

Its job: take AI datasets built for Korean roads and audit + adapt them so autonomous driving AI works in **Tanzania** — specifically for the **Daladala** (local minibus).

Currently an **Offline Data Processing System** — Python scripts that run on your local machine. The final goal is a **Progressive Web App (PWA)** using TensorFlow.js so the AI runs offline on phones.

---

## Project Structure

```
Submission_Week1/
│
├── Audit_System_Summary.README.docx   ← Full audit report (Word)
│
└── The Files/
    ├── process_week1_data.py          ← Main audit/visualization script
    ├── vibe_logic_demo.py             ← Level 7 risk assessment demo
    ├── zip_project.py                 ← ZIP file processing utility
    ├── Week1_Project_Audit.zip        ← Packaged audit outputs
    ├── daladala_1.jpg                 ← Reference: Daladala image 1
    ├── daladala_2.jpg                 ← Reference: Daladala image 2
    └── daladala_3.jpg                 ← Reference: Daladala image 3
```

---

## Web App (This Dashboard)

The `index.html` file is a single-file responsive web dashboard that presents the entire Week 1 audit visually.

### Features
- **Responsive** — works on mobile, tablet, and desktop
- **Live Risk Engine** — interactive Level 7 proximity calculator with canvas visualization
- **Audit Results** — Levels 1, 2, 3, and 7 status cards
- **Gap Analysis Table** — Korea vs Tanzania comparison
- **Source Code Viewer** — syntax-highlighted Python snippets
- **3-Phase Roadmap** — Re-labeling → Logic Adaptation → PWA Deployment
- **Animated Stats** — counter animations on scroll
- **Dark Theme** — African tech aesthetic with noise texture overlay

### To Open
Just double-click `index.html` — no server or build step needed. Works fully offline.

---

## Audit Results Summary

| Level | Name | Status |
|-------|------|--------|
| 1 | Basic Detection (Bounding Boxes) | ✅ PASSED |
| 2 | Standard JSON Format | ✅ PASSED |
| 3 | Multi-Class Distinction | ✅ PASSED |
| 7 | Risk Assessment / CoT Logic | ✅ DEMONSTRATED |

### Level 1 — Hello World
Found bounding boxes in both Korean ZIP datasets:
```json
"bbox": [1054, 391, 628, 392]
```
That's a real car, at those exact pixel coordinates.

### Level 2 — JSON Ready
Handles both `bbox` format AND complex `points` polygon arrays found in the Korean annotation standard. Output is standardized for any downstream AI model.

### Level 3 — Multi-Class
Correctly distinguishes:
- General Vehicle (SUV/Van)
- Purpose Vehicle (Ambulance)
- Truck

Using the `attributes` key inside the Korean JSON schema.

### Level 7 — Risk Assessment (Vibe Logic Demo)
```python
def calculate_risk(obj1, obj2):
    # Euclidean distance between bounding box centers
    dist = math.sqrt((c1x - c2x)**2 + (c1y - c2y)**2)
    if dist < 100:   return "HIGH (Collision Risk)", dist
    elif dist < 300: return "MEDIUM (Caution)", dist
    else:            return "LOW", dist
```
**Demo Result**: Car 1 at [1054, 391] vs Car 2 at [1499, 502] → Distance ~236px → **MEDIUM RISK**

---

## Gap Analysis: Korea 🇰🇷 vs Tanzania 🇹🇿

| Feature | Korean AI | Tanzanian Reality | Problem |
|---------|-----------|-------------------|---------|
| Object Name | "Bus" | "Daladala" | Misclassification |
| Passenger Load | Legal occupancy limits | Overloaded, hanging passengers | Safety data treated as noise |
| Road Behaviour | Designated stops | Stops anywhere | Prediction failure |
| Vehicle Visuals | Clean, standardized paint | Vibrant murals, custom decals | Detection failure (misread as billboard) |

---

## Roadmap

### Phase 1 — Re-Labeling
- Write script to batch-rename `"Bus"` → `"Daladala"` in all JSON annotation files
- Collect 50+ real Daladala photos to retrain visual detection layer
- Tools: Python, JSON parsing, PIL/Pillow

### Phase 2 — Logic Adaptation
- Add `is_overloaded: true` boolean attribute to vehicle JSON when Person bounding boxes overlap vehicle by >50%
- Teaches AI to recognize overloading as safety-relevant, not noise
- Tools: IoU calculation, attribute schema extension

### Phase 3 — PWA Deployment
- Package as Progressive Web App
- TensorFlow.js runs AI model in mobile browser — offline capable
- Target users: Daladala inspectors, road safety officers, drivers
- Tools: TensorFlow.js, Service Workers, PWA manifest

---

## Dependencies

### Python Scripts
```
Pillow (PIL)    — Image processing and bounding box visualization
zipfile         — Built-in: reads Korean ZIP datasets
json            — Built-in: parses annotation files
math            — Built-in: Euclidean distance for risk calculation
os, sys, io     — Built-in: file handling and encoding
```

Install Pillow:
```bash
pip install Pillow
```

### Web App (`index.html`)
- **Zero dependencies** — pure HTML, CSS, and vanilla JavaScript
- Google Fonts (loads from CDN, optional — degrades gracefully offline)
- No npm, no build step, no framework

---

## How to Run the Python Scripts

1. Place your Korean ZIP datasets in the path defined in `process_week1_data.py`:
   ```python
   BASE_DIR = r"C:\Users\YOUR_NAME\Desktop\...\Week1_Data"
   ```
2. Run the audit:
   ```bash
   python process_week1_data.py
   ```
3. Check `processed_samples/` folder for PNG visualizations with bounding boxes drawn.

4. Run the risk demo:
   ```bash
   python vibe_logic_demo.py
   ```

---

## Notes

- The Korean dataset uses **Korean-language filenames** (UTF-8 encoded). The scripts use `encode('ascii', 'replace')` for safe console printing on Windows.
- Source ZIP filenames: `1주차_데이터.zip` (2D Bounding Box), `1주차_보이데이터.zip` (2D/3D Supplementary)
- Output visualizations (PNG + HTML) go to `processed_samples/` directory

---

## Next Step

**Capture 50 photos of Daladalas** — from the side, front, rear, overloaded, at informal stops.  
These will replace the Korean Bus data in the local model retrain. This is the foundation of the entire Tanzania adaptation.

---

*K-AI Bridge — Teaching machines to see Tanzania.*
