# Linus Lucas Rwechoka — AI Engineer Portfolio v4.0

A premium, fully-functional portfolio powered by **real Claude AI** (Anthropic) — not a keyword bot. Visitors can have genuine conversations with an AI that knows Linus's entire engineering story.

---

## 🗂️ Project Structure

```
portfolio/
├── index.html          ← Frontend (deploy to GitHub Pages)
├── style.css           ← All styles
├── app.js              ← Frontend JS — connects to backend AI
│
├── server.js           ← 🔴 Backend (deploy to Render/Railway)
├── package.json        ← Node.js dependencies
├── .env.example        ← Environment variable template
└── .env                ← 🔴 YOUR secrets (NEVER commit this!)
```

---

## ⚠️ One Change Required Before Anything Works

In **`app.js`**, find this line near the top:

```javascript
BACKEND_URL: 'https://linus-portfolio-backend.onrender.com',
```

**Change it** to your actual deployed backend URL after you deploy the server (Step 2 below).

---

## 🚀 Deployment Guide (Step by Step)

### STEP 1 — Get Your Claude API Key

1. Go to **https://console.anthropic.com/**
2. Sign up / log in
3. Go to **API Keys** → click **Create Key**
4. Copy and save it somewhere safe — you'll only see it once

> 💡 Note: Anthropic offers free credits to new accounts. After that, usage is pay-per-use and very cheap for a portfolio chatbot (typically < $1/month).

---

### STEP 2 — Deploy the Backend (Render — Free Tier)

Render is the easiest free backend host. Follow these steps:

1. **Create a Render account**: https://render.com
2. In your GitHub repo, make sure `server.js` and `package.json` are committed
3. On Render dashboard → click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: `linus-portfolio-backend` (or any name)
   - **Root Directory**: leave blank (or point to folder if in subfolder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Under **Environment Variables**, add:
   ```
   ANTHROPIC_API_KEY = your_actual_key_here
   ALLOWED_ORIGIN   = https://sun-eazi.github.io
   PORT             = 3000
   ```
7. Click **Deploy**
8. Wait ~2 minutes. Your backend URL will look like:
   `https://linus-portfolio-backend.onrender.com`

> ⚠️ Free Render instances "sleep" after 15 minutes of inactivity. First request after sleep takes ~10-30 seconds. Upgrade to Starter ($7/month) to keep it always awake.

---

### STEP 3 — Update Your Frontend

In `app.js`, change the `BACKEND_URL`:

```javascript
const CONFIG = {
  BACKEND_URL: 'https://linus-portfolio-backend.onrender.com', // ← Your Render URL
  ENABLE_FALLBACK: true
};
```

---

### STEP 4 — Deploy Frontend to GitHub Pages

Your frontend files (`index.html`, `style.css`, `app.js`) go in your GitHub repo as usual.

1. Push changes to your `main` branch:
   ```bash
   git add index.html style.css app.js
   git commit -m "feat: upgrade to Claude AI v4.0"
   git push
   ```
2. GitHub Pages will auto-deploy at `https://sun-eazi.github.io/`

---

### STEP 5 — Test Everything

1. Visit your GitHub Pages site
2. Scroll to **AI BRAIN** section
3. The status should show **"Claude AI · Online"** (green)
4. Ask a question — you should get a real AI response within 2-3 seconds

If it shows "Standalone Mode", the backend is unreachable — check your Render deployment logs.

---

## 🔒 Security Notes

| What | Status | Details |
|------|--------|---------|
| API Key | ✅ Safe | Stored only in Render env vars, never in code |
| .env file | ✅ Safe | Listed in .gitignore — never committed |
| Rate Limiting | ✅ Active | 30 requests/minute per IP |
| CORS | ✅ Configured | Only your GitHub Pages URL can call the backend |
| User data | ✅ Clean | No user data is stored or logged |

**CRITICAL**: Never commit your `.env` file. Add it to `.gitignore`:
```
echo ".env" >> .gitignore
```

---

## 🛠️ Local Development

To run the full stack locally:

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Run backend
npm run dev   # Uses nodemon for auto-reload
# OR
npm start     # Production mode

# 4. Open frontend
# Open index.html in browser, OR:
# Change app.js BACKEND_URL to 'http://localhost:3000'
```

---

## 🤖 How the AI Works

```
User types message
      ↓
app.js (frontend)
      ↓ POST /api/chat
server.js (backend on Render)
      ↓ Injects SYSTEM_CONTEXT (who Linus is)
Anthropic Claude API
      ↓ Real AI response
server.js returns reply
      ↓
Frontend displays response
```

The system context (Linus's bio, projects, skills) is **injected server-side** — users never see it, it never changes, and it always sets the tone for how Claude responds.

**Fallback**: If backend is unreachable, the frontend falls back to a keyword-based standalone mode so the chat never breaks entirely.

---

## 🔧 Customization

### Add more about yourself in `server.js`:
Find the `SYSTEM_CONTEXT` constant and add to it — new projects, new skills, new achievements.

### Change AI model:
In `server.js`, change the model:
```javascript
model: 'claude-haiku-4-5-20251001',  // Faster, cheaper
// or
model: 'claude-sonnet-4-6',          // Smarter, slightly more expensive
```

### Change AI personality:
Edit the `PERSONALITY` section in `SYSTEM_CONTEXT`.

---

## 📦 Dependencies

**Backend:**
- `express` — HTTP server
- `cors` — Cross-origin requests
- `dotenv` — Environment variables

No frontend dependencies — pure HTML/CSS/JS.

---

## 🌐 Live

**Portfolio**: https://sun-eazi.github.io/  
**GitHub**: https://github.com/Sun-Eazi

---

Built by **Linus Lucas Rwechoka** — AI Engineer · UAUT · Tanzania 🇹🇿
