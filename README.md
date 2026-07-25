# Vitalis — Know what's wrong. Know who to see. Know what's safe.

**Live URL:** _add your deployed Vercel URL here_
**Built by:** Hamad · University of Malakand · AI App final project

## What it does, and for whom

Vitalis is a health-navigation companion for people who feel lost between "something's
wrong" and "the right doctor's office." It brings four AI-powered tools and a set of
supporting features into one calm, purpose-built app:

1. Deciding **which type of specialist** to book (people often see the wrong one first).
2. Checking whether their **medications interact**, without wading through dense
   pharmacology sites or ad-cluttered apps.
3. **Tracking a chronic condition day to day** so patterns are visible instead of
   forgotten, and turning that log into a doctor-ready report.
4. Getting a **plain-language read on a visible symptom or a lab report photo** —
   observations only, never a confirmed diagnosis.

It's built for anyone managing their own or a family member's health day-to-day —
students juggling new symptoms away from home, people newly diagnosed with a chronic
condition, or anyone on multiple medications who wants a plain-language sanity check.

## Features

### The four AI tools
- **Symptom → Specialist Router** — describe symptoms (by typing or by voice), duration,
  and severity; get a suggested specialist type, confidence level, reasoning, an
  alternative option when genuinely ambiguous, and questions to bring to the
  appointment. Automatically flags potential emergencies.
- **Medication Interaction Checker** — list any number of medications/supplements and
  get known interaction categories explained in plain language, with an overall risk
  level, a per-pair breakdown, and emergency flagging for dangerous combinations.
- **Daily Condition Logger** — pick a condition, log severity (1–10) and triggers each
  day (with voice input for notes), saved locally in the browser. Includes:
  - AI pattern insights across entries, with emergency escalation detection
  - A visual **severity trend chart**
  - A calculated **health score** (0–100) from logging consistency and trend — pure
    arithmetic on your own data, not an AI claim
  - Export as plain text **or** a formatted **doctor-ready PDF**
  - Optional browser **reminders** to log while the tab is open
- **Health Scan** — upload a photo of a visible symptom (skin, eyes, tongue, nails) or a
  lab report page. Returns plain-language observations and patterns worth discussing
  with a doctor — never a named diagnosis, with urgent-finding detection built in.

### Supporting features
- **Voice input** on the Symptom Router and Logger notes, using the browser's built-in
  speech recognition (no extra API, Chrome/Edge).
- **Result history** for the Specialist Router and Medication Checker, saved locally so
  past answers can be revisited without re-running them.
- **Dark mode** toggle, persisted across visits.
- **Language toggle (English / Urdu)** — AI responses adapt to the selected language;
  interface labels remain in English for now.
- **Vercel Analytics** for basic usage visibility.
- Calm, purpose-built interface: a warm paper background, a pine-green/amber palette,
  Fraunces display type paired with Inter, and a recurring heartbeat-line motif used as
  a section divider and loading cue throughout.

## The AI feature

Vitalis calls the **Google Gemini API** (`gemini-3.5-flash-lite`, free tier) from four
server-side routes, each with its own hand-written system prompt so the model returns a
fixed JSON shape the UI can render directly:

- `app/api/specialist/route.js` — routes symptoms to a specialist type, forces JSON
  output, hard-codes emergency detection, and explicitly forbids naming a diagnosis or
  giving treatment instructions.
- `app/api/medications/route.js` — explains interaction categories, forbids inventing
  interactions it isn't confident about, forbids suggesting dose or schedule changes,
  and flags dangerous combinations as emergencies.
- `app/api/insights/route.js` — looks for real patterns in the user's own logged
  entries only, says explicitly when there isn't enough data yet, and escalates sharp,
  dangerous-sounding trends.
- `app/api/scan/route.js` — analyzes an uploaded image (visible symptom or lab report),
  restricted to plain observations rather than diagnostic claims, with urgent-finding
  detection for acutely concerning images.

All four prompts require the model to stay within general/educational information and
to defer to a licensed professional — see the full prompt text in each route file. A
shared helper (`lib/ai.js`) also supports an optional language parameter, allowing the
same prompts to return Urdu-language responses on request.

## Tools, services, and models used

- **Next.js 14** (App Router) + **React 18** — framework
- **Tailwind CSS** (class-based dark mode via CSS variables) — styling
- **Google Gemini API** (`gemini-3.5-flash-lite`, free tier, no credit card) — all four
  AI features, including image understanding for Health Scan
- **recharts** — the severity trend chart
- **jsPDF** — the doctor-ready PDF report export
- **Web Speech API** (browser built-in) — voice input
- **Vercel Analytics** — basic usage tracking
- **Vercel** — hosting/deployment
- Browser `localStorage` — stores daily log entries, tool history, and preferences
  locally; no database or account system yet

## Screenshots

_Add 4+ screenshots here: the dashboard, a Specialist Router result, the Daily Logger
(with chart and health score visible), and Health Scan. Drag images into this README on
GitHub, or add them to a `/screenshots` folder and link them:_

```
![Dashboard](screenshots/dashboard.png)
![Specialist Router](screenshots/specialist.png)
![Daily Logger](screenshots/logger.png)
![Health Scan](screenshots/scan.png)
```

## How to run it

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
```bash
cp .env.example .env.local
```
Open `.env.local` and paste in a free key from https://aistudio.google.com/app/apikey

### 3. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

### 4. Deploy (get your public URL)
Push this repo to a **public** GitHub repository, then:
1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New → Project**, select this repo.
3. Under **Environment Variables**, add `GEMINI_API_KEY` with your key.
4. Click **Deploy**. Vercel gives you a live `https://your-app.vercel.app` URL —
   paste it at the top of this README and into the submission portal.

## Project structure

```
app/
  page.js                    dashboard
  specialist/page.js         Symptom → Specialist Router UI
  medications/page.js        Medication Interaction Checker UI
  logger/page.js             Daily Condition Logger UI
  scan/page.js                Health Scan UI
  api/specialist/route.js    AI route + system prompt
  api/medications/route.js   AI route + system prompt
  api/insights/route.js      AI route + system prompt
  api/scan/route.js          AI route + system prompt (image input)
components/                  Navbar, PulseDivider, Disclaimer, FeatureCard,
                              MicButton, SeverityChart, HealthScoreCard,
                              ThemeToggle, LanguageToggle
lib/ai.js                    shared Gemini fetch helper (text + image), JSON parsing
lib/healthScore.js           health score calculation (pure math, no AI)
```

## Notes on safety

Vitalis never provides diagnoses, dosing, or treatment instructions — every system
prompt explicitly forbids this and requires deferring to a licensed clinician or
pharmacist. Health Scan describes observations only and never names a condition as
confirmed. Emergency-sounding symptoms, medication combinations, log trends, and scan
images are all flagged to seek urgent care immediately. This is an educational student
project, not a certified medical device.

## Known limitations

- Log entries, history, and preferences are stored per-browser (`localStorage`), not
  in an account — they don't sync across devices and clear if browser data is cleared.
- The Urdu toggle translates AI-generated responses but not static interface labels yet.
- Voice input requires a Chromium-based browser (Chrome/Edge); it hides itself
  gracefully elsewhere.
- Reminders only fire while the app tab is open in the browser, not in the background.
