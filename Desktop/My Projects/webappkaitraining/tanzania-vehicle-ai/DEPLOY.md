# 🚀 GitHub Deployment Guide

## Hatua ya 1 — Create GitHub Account
Nenda https://github.com → Sign up (bure kabisa)

## Hatua ya 2 — Create New Repository

1. Click **"+"** (top right) → **"New repository"**
2. Repository name: `tanzania-vehicle-ai`
3. Description: `AI system for classifying Tanzania traffic vehicles — Bajaj, Daladala, Bodaboda`
4. Chagua **Public** (ili GitHub Pages ifanye kazi bure)
5. Click **"Create repository"**

## Hatua ya 3 — Upload Files

### Option A: Web Upload (Rahisi zaidi)
1. Katika repo yako mpya, click **"uploading an existing file"**
2. Drag all files kutoka folder ya `tanzania-vehicle-ai/`
3. Commit message: `Initial release - Tanzania Vehicle AI v2.0`
4. Click **"Commit changes"**

### Option B: Git Command Line
```bash
cd tanzania-vehicle-ai
git init
git add .
git commit -m "Initial release - Tanzania Vehicle AI v2.0"
git branch -M main
git remote add origin https://github.com/JINA-LAKO/tanzania-vehicle-ai.git
git push -u origin main
```

## Hatua ya 4 — Enable GitHub Pages

1. Nenda **Settings** (tab ya juu)
2. Left sidebar → **Pages**
3. Source: **"Deploy from a branch"**
4. Branch: **main** → Folder: **/ (root)**
5. Click **Save**

## Hatua ya 5 — Get Your Link

Baada ya dakika 2-5, link yako itakuwa:
```
https://JINA-LAKO.github.io/tanzania-vehicle-ai/
```

**Share link hii via WhatsApp, email, au platform yoyote!**

---

## 📱 Jinsi ya Kushare

### WhatsApp
```
Tanzania Vehicle AI 🇹🇿
Mfumo wa AI wa kugundua magari ya DSM

Demo (bila API key):
https://JINA-LAKO.github.io/tanzania-vehicle-ai/

Full App (Gemini AI):
https://JINA-LAKO.github.io/tanzania-vehicle-ai/classifier.html

Inagundua: Bajaj | Daladala | Bodaboda + Rangi!
```

### Email / LinkedIn
Subject: Tanzania Vehicle AI Classifier — Open Source

Body:
I built an AI system that classifies Dar es Salaam vehicles 
(Bajaj, Daladala, Bodaboda) with color detection and auto-renaming.

Live demo: https://JINA-LAKO.github.io/tanzania-vehicle-ai/
GitHub: https://github.com/JINA-LAKO/tanzania-vehicle-ai

Built with Google Gemini Vision API.
No installation required — works in any browser.
