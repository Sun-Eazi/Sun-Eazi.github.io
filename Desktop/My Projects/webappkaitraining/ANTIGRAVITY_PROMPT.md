# ============================================================
# TANZANIA VEHICLE AI — ANTIGRAVITY DEPLOYMENT PROMPT
# Copy this ENTIRE prompt and paste into Antigravity
# ============================================================

I have a full-stack AI web application that I need you to deploy completely.
The project is Tanzania Vehicle AI — a system that classifies Dar es Salaam
traffic vehicles (Bajaj, Daladala, Bodaboda) using Google Gemini Vision AI.

Here is everything you need to know. Please complete ALL steps in order.

---

## PROJECT OVERVIEW

Architecture:
- Frontend: Static HTML files → GitHub Pages (free)
- Backend: Python FastAPI → Render.com (free)
- Database: PostgreSQL → Supabase (free)
- AI: Google Gemini 1.5 Flash Vision API

I have TWO zip files already ready:
1. `tanzania-vehicle-ai-frontend.zip` → GitHub Pages (index.html + classifier.html)
2. `tanzania-vehicle-ai-backend.zip`  → FastAPI backend (main.py + app/ folder)

---

## STEP 1 — SET UP SUPABASE DATABASE

1. Open https://supabase.com in browser
2. Sign in or create free account
3. Create a new project (name: "tanzania-vehicle-ai", any password, any region)
4. Wait for project to initialize (about 1 minute)
5. Go to: Project → SQL Editor → New Query
6. Run this exact SQL:

```sql
CREATE TABLE IF NOT EXISTS classifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename TEXT NOT NULL,
    new_filename      TEXT NOT NULL,
    team_no           TEXT NOT NULL DEFAULT 'T01',
    location          TEXT NOT NULL DEFAULT 'DSM',
    vehicle_class     TEXT NOT NULL CHECK (vehicle_class IN ('Bajaj','Daladala','Bodaboda','Unknown')),
    primary_color     TEXT NOT NULL DEFAULT 'Unknown',
    confidence        INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
    reasoning         TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classifications_team ON classifications(team_no);
CREATE INDEX IF NOT EXISTS idx_classifications_class ON classifications(vehicle_class);
CREATE INDEX IF NOT EXISTS idx_classifications_created ON classifications(created_at DESC);

ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON classifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select" ON classifications FOR SELECT TO anon USING (true);
```

7. After running, go to: Settings → API
8. Copy and SAVE these two values:
   - `Project URL` (looks like: https://abcdefgh.supabase.co)
   - `anon public` key (long string starting with eyJ...)

---

## STEP 2 — GET GEMINI API KEY

1. Open https://aistudio.google.com/app/apikey in browser
2. Sign in with any Google account
3. Click "Create API Key"
4. Copy and SAVE the key (starts with AIza...)

Note: Free tier = 15 requests/minute, 1500/day. No credit card needed.

---

## STEP 3 — DEPLOY BACKEND TO RENDER.COM

First, prepare the backend code:

1. Extract `tanzania-vehicle-ai-backend.zip`
2. The folder structure should be:
```
tanzania-ai-backend/
├── main.py
├── requirements.txt
├── render.yaml
├── .env.example
├── supabase_schema.sql
└── app/
    ├── config.py
    ├── models/schemas.py
    ├── routers/classify.py
    ├── routers/health.py
    ├── routers/stats.py
    ├── services/gemini.py
    └── services/database.py
```

3. Create a new GitHub repository named `tanzania-vehicle-ai-backend`
4. Push ALL files from the extracted folder to this repository
5. Make sure the repo is PUBLIC

Then deploy on Render:

6. Open https://render.com in browser
7. Sign up / sign in (free account)
8. Click "New" → "Web Service"
9. Connect your GitHub account
10. Select the `tanzania-vehicle-ai-backend` repository
11. Configure these settings:
    - Name: `tanzania-vehicle-ai-backend`
    - Region: Oregon (US West)
    - Branch: main
    - Runtime: Python 3
    - Build Command: `pip install -r requirements.txt`
    - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    - Plan: Free
12. Click "Advanced" → "Add Environment Variable" — add ALL of these:

    Key: GEMINI_API_KEY
    Value: [paste your Gemini key from Step 2]

    Key: SUPABASE_URL
    Value: [paste your Supabase Project URL from Step 1]

    Key: SUPABASE_KEY
    Value: [paste your Supabase anon key from Step 1]

    Key: ALLOWED_ORIGINS
    Value: https://yourusername.github.io,http://localhost:3000

    Key: APP_ENV
    Value: production

13. Click "Create Web Service" — wait for deployment (3-5 minutes)
14. When done, copy your Render URL (looks like: https://tanzania-vehicle-ai-backend.onrender.com)

15. TEST the deployment — open this URL in browser:
    https://YOUR-RENDER-URL.onrender.com/health

    You should see JSON like:
    {"status":"ok","gemini":"✅ Connected","database":"✅ Connected","version":"2.0.0"}

    If gemini or database shows ❌, check the environment variables in Render settings.

16. Also test the API docs:
    https://YOUR-RENDER-URL.onrender.com/docs

---

## STEP 4 — DEPLOY FRONTEND TO GITHUB PAGES

1. Extract `tanzania-vehicle-ai-frontend.zip`
2. The folder should contain:
   - index.html
   - classifier.html
   - README.md
   - LICENSE
   - DEPLOY.md
   - supabase_schema.sql
   - assets/images/ (11 vehicle images)

3. Create a new GitHub repository named `tanzania-vehicle-ai`
4. Push ALL files to this repository (make it PUBLIC)
5. Go to: Repository Settings → Pages
6. Under "Source": Select "Deploy from a branch"
7. Branch: main, Folder: / (root)
8. Click Save
9. Wait 2-3 minutes
10. Your live URL will be: https://YOURUSERNAME.github.io/tanzania-vehicle-ai/

---

## STEP 5 — UPDATE FRONTEND WITH BACKEND URL

After both are deployed:

1. Open `classifier.html` from the frontend folder
2. Find this line (around line 50):
   `<input class="urlinput" id="burl" placeholder="https://your-app.onrender.com">`
3. Change `value=""` to `value="https://YOUR-ACTUAL-RENDER-URL.onrender.com"`
4. Save the file
5. Commit and push to GitHub — GitHub Pages will auto-update

Also update ALLOWED_ORIGINS on Render:
- Go to Render → Your service → Environment
- Update ALLOWED_ORIGINS to include your actual GitHub Pages URL:
  `https://YOURUSERNAME.github.io`

---

## STEP 6 — FINAL VERIFICATION CHECKLIST

Test everything works end-to-end:

[ ] Open https://YOURUSERNAME.github.io/tanzania-vehicle-ai/
    → Demo page loads with 11 vehicle images
    → Filter buttons work (Bajaj / Daladala / Bodaboda)
    → Images show class + color + confidence

[ ] Open https://YOURUSERNAME.github.io/tanzania-vehicle-ai/classifier.html
    → Page loads without errors
    → Paste Render URL → Click Connect
    → Status shows: "✅ Gemini Connected | DB: ✅ Connected"
    → Upload any vehicle photo
    → Click "Classify All Images"
    → Result shows: class, color, confidence, new filename
    → "DB History" tab shows the classification was saved to Supabase

[ ] Open https://YOUR-RENDER-URL.onrender.com/docs
    → FastAPI auto-generated docs page loads
    → Try POST /api/classify with a test image
    → Try GET /api/stats
    → Try GET /api/health

[ ] Open Supabase → Table Editor → classifications table
    → Should see rows being inserted as you classify images

---

## NOTES FOR THE AGENT

- All three services (GitHub Pages, Render.com, Supabase) are 100% FREE
- Render free tier sleeps after 15 minutes of inactivity — first request after sleep takes ~30 seconds to wake up. This is normal.
- If Render deployment fails, check the logs in Render dashboard for errors
- The backend API key (Gemini) is stored ONLY on the server — never exposed to the browser
- CORS is configured — only requests from ALLOWED_ORIGINS are accepted
- The frontend demo (index.html) works completely OFFLINE — no backend needed for the demo
- The classifier (classifier.html) requires the backend to be running

---

## SHARING AFTER DEPLOYMENT

Once everything is live, share these links:

Demo link (works for anyone, no setup):
https://YOURUSERNAME.github.io/tanzania-vehicle-ai/

Full classifier link (requires backend URL):
https://YOURUSERNAME.github.io/tanzania-vehicle-ai/classifier.html

Backend API docs:
https://YOUR-RENDER-URL.onrender.com/docs

GitHub repositories:
https://github.com/YOURUSERNAME/tanzania-vehicle-ai
https://github.com/YOURUSERNAME/tanzania-vehicle-ai-backend

---

Please complete all 6 steps in order. Let me know when each step is done
before moving to the next one. If you encounter any error, show me the
full error message and suggest how to fix it.
