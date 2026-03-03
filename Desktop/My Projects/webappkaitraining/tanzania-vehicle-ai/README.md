# 🇹🇿 Tanzania Vehicle AI Classifier

<div align="center">

![Tanzania Vehicle AI](https://img.shields.io/badge/AI-Gemini%20Vision-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-22c55e?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Any%20Browser-0d1117?style=for-the-badge)

**An AI vision system that classifies Dar es Salaam vehicles, detects their color, and auto-renames files to competition standard.**

[🎯 Live Demo](https://yourusername.github.io/tanzania-vehicle-ai/) · [⚡ Full App](https://yourusername.github.io/tanzania-vehicle-ai/classifier.html) · [📋 Report](docs/Tanzania_AI_Report.docx)

</div>

---

## ✨ What It Does

Upload any Tanzania traffic photo — any filename — and the AI instantly tells you:

| What It Detects | Example Output |
|----------------|----------------|
| 🛺 Vehicle Class | `Bajaj` / `Daladala` / `Bodaboda` |
| 🎨 Primary Color | `Blue` / `Green/White` / `Black` |
| 📊 Confidence | `95%` |
| 💬 AI Reasoning | `"3-wheel shape + blue cabin confirms Bajaj"` |
| 📝 New Filename | `T01_Buguruni_Bajaj_Blue_001.jpg` |

---

## 🚀 Quick Start

### Option 1 — Demo (No Setup)
```
Open index.html in any browser
```
11 pre-classified real Dar es Salaam images. No API key, no internet needed.

### Option 2 — Full App (Gemini AI)
```
1. Open classifier.html in any browser
2. Get a free Gemini API key → https://aistudio.google.com/app/apikey
3. Paste your key → Click Connect
4. Drop your images → Click Classify
5. Download CSV or JSON report
```

### Option 3 — GitHub Pages (Online Link)
```bash
# Fork this repo → Settings → Pages → Deploy from main branch
# Your link: https://yourusername.github.io/tanzania-vehicle-ai/
```

---

## 📁 Repository Structure

```
tanzania-vehicle-ai/
│
├── index.html              ← 🎯 Demo page (no API needed, runs offline)
├── classifier.html         ← ⚡ Full app with Gemini AI integration
├── README.md               ← This file
├── LICENSE                 ← MIT License
│
└── assets/
    └── images/             ← 11 sample Tanzania traffic images
        ├── bajaj_1.jpg
        ├── bajaj_2.jpg
        ├── bajaj_3_blue.jpg
        ├── daladala_1.jpg
        ├── daladala_2_buguruni.jpg
        ├── daladala_3_mbezi.jpg
        ├── daladala_4_traffic.jpg
        ├── daladala_5_bus.jpg
        ├── bodaboda_1_buguruni.jpg
        ├── bodaboda_2_bicycle.jpg
        └── bodaboda_3_traffic.jpg
```

---

## 🎯 Vehicle Classes

| Class | Description | Key Features |
|-------|-------------|--------------|
| 🛺 **Bajaj** | 3-wheel motorized tuk-tuk taxi | Distinct triangular shape, small covered cabin, 3 wheels |
| 🚌 **Daladala** | Local minibus for public transport | Toyota Hiace/Coaster size, often decorated with stickers |
| 🏍️ **Bodaboda** | Motorcycle + rider (+ possible passenger) | One bounding box covers bike, rider, and passenger together |
| ❓ **Unknown** | Regular car, truck, or unclear image | Anything not in the 3 classes above |

---

## 🎨 Color Detection

The AI identifies the **primary color** of each vehicle and includes it in the renamed filename:

```
T01_Buguruni_Bajaj_Blue_001.jpg
T01_Mbezi_Daladala_Green_002.jpg  
T01_Posta_Bodaboda_Black_001.jpg
```

**Supported colors:** Blue, Red, Green, Yellow, White, Black, Orange, Brown, Gray, Silver, Teal, Gold, Maroon, Cream, Purple

> 💡 **Why this matters:** The UAUT hackathon competition specifically targets the *blue Bajaj* in the test video. Color detection helps the model learn color-specific features, not just shape.

---

## 🌐 Cross-Platform Compatibility

| Platform | How to Open |
|----------|-------------|
| 💻 Windows | Double-click `index.html` |
| 🍎 Mac | Double-click `index.html` |
| 📱 Android | Share via WhatsApp/Email → open in Chrome |
| 🍎 iPhone | Share via AirDrop/Email → open in Safari |
| ☁️ Online | Upload to Google Drive → share link |
| 🔗 GitHub Pages | `yourusername.github.io/tanzania-vehicle-ai/` |

**No installation. No account. No server.** Just open the HTML file.

---

## 🔑 Getting a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with any Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)
5. Paste into the app → Click **Connect**

**Free tier:** 15 requests/minute · 1,500 requests/day · No credit card needed

---

## 📊 Export Formats

### CSV Report
```csv
Original Filename,New Filename,Class,Primary Color,Confidence (%),AI Reasoning
IMG_9384.jpg,T01_Buguruni_Bajaj_Blue_001.jpg,Bajaj,Blue,95,"3-wheel shape confirms Bajaj"
photo.png,T01_Buguruni_Daladala_Green_001.jpg,Daladala,Green,91,"Minibus with typical DSM markings"
```

### JSON Data
```json
{
  "team": "T01",
  "location": "Buguruni",
  "summary": {
    "total": 20,
    "by_class": { "Bajaj": 6, "Daladala": 8, "Bodaboda": 6 },
    "by_color": { "Blue": 4, "Green": 5, "Black": 3 }
  },
  "images": [...]
}
```

---

## 🏆 UAUT Hackathon Context

This system was built for the **UAUT Ultimate AI Hackathon** in Dar es Salaam, Tanzania.

**Competition Goal:** Train a YOLOv5 model to accurately detect and track Bajaj, Daladala, and Bodaboda in a secret 1-minute Dar es Salaam dashcam video.

**Naming Convention:** `T[team]_[location]_[class]_[color]_[id].jpg`

**Winning Tips:**
- 🎯 Tight bounding boxes — right to vehicle edges, no asphalt inside the box
- 🏍️ Bodaboda Rule — one box for motorcycle + rider + passenger
- 🔵 Blue Bajaj priority — the test video specifically tracks a blue Bajaj
- 📈 Augmentation — Flip Horizontal + Brightness ±30% in Roboflow

---

## 🔧 Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Pure HTML/CSS/JavaScript — no frameworks |
| AI (Full App) | Google Gemini 1.5 Flash Vision |
| AI (Demo) | Pre-computed results — offline |
| Fonts | IBM Plex Mono + Fraunces (Google Fonts) |
| Export | Browser-native Blob API |
| Hosting | GitHub Pages (static, free) |

---

## 🚀 Deploy to GitHub Pages

```bash
# 1. Fork or clone this repo
git clone https://github.com/yourusername/tanzania-vehicle-ai.git

# 2. Push to GitHub
git add .
git commit -m "Initial deploy"
git push origin main

# 3. Enable GitHub Pages
# Settings → Pages → Source: Deploy from branch → main → / (root) → Save

# 4. Your live URL:
# https://yourusername.github.io/tanzania-vehicle-ai/
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

Built with 🇹🇿 for Dar es Salaam · UAUT AI Hackathon 2025
