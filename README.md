Vitalis — Know what's wrong.
Know who to see. Know what's
safe.
Live URL: add your deployed Vercel URL here after step
4 below
Built by: Hamad · University of Malakand · AI App final
project

What it does, and for whom
Vitalis is a health-navigation companion for people
who feel lost between "something's
wrong" and "the right doctor's office." It merges three
common frustrations into one app:
1. Deciding which type of specialist to book (people
often see the wrong one first).
2. Checking whether their medications interact,
without wading through dense
pharmacology sites or ad-cluttered apps.
3. Tracking a chronic condition day to day so
patterns are visible instead of
forgotten, and turning that log into a report they
can hand to a doctor.

It's built for anyone managing their own or a family
member's health day-to-day —
students juggling new symptoms away from home,
people newly diagnosed with a chronic
condition, or anyone on multiple medications who
wants a plain-language sanity check.

Features
Symptom → Specialist Router — describe
symptoms, duration, and severity; get a
suggested specialist type, confidence level,
reasoning, an alternative option when
genuinely ambiguous, and questions to bring to
the appointment. Automatically flags
potential emergencies and tells the person to
seek urgent care instead.
Medication Interaction Checker — list any number
of medications/supplements and
get known interaction categories explained in
plain language, with an overall risk
level and a per-pair breakdown.
Daily Condition Logger — pick a condition, log
severity (1–10) and triggers each
day, saved locally in the browser. Request AI
pattern insights across your entries,
and export a clean .txt report to share with a
clinician.

Calm, purpose-built interface: a warm paper
background, a pine-green/amber palette,
Fraunces display type paired with Inter, and a
recurring heartbeat-line motif used as
a section divider and loading cue throughout.
The AI feature
Vitalis calls the Google Gemini API ( gemini-2.5-
flash , free tier) from three
server-side routes, each with its own hand-written
system prompt so the model returns
a fixed JSON shape the UI can render directly:
app/api/specialist/route.js — routes
symptoms to a specialist type, forces JSON
output, hard-codes emergency detection, and
explicitly forbids naming a diagnosis or
giving treatment instructions.
app/api/medications/route.js — explains
interaction categories, forbids inventing
interactions it isn't confident about, and forbids
suggesting dose or schedule changes.
app/api/insights/route.js — looks for real
patterns in the user's own logged
entries only, and says explicitly when there isn't
enough data yet.

All three prompts require the model to stay within
general/educational information and
to defer to a licensed professional — see the full
prompt text in each route file.

Tools, services, and models used
Next.js 14 (App Router) + React 18 — framework
Tailwind CSS — styling
Google Gemini API ( gemini-2.5-flash , free tier,
no credit card) — the AI feature
Vercel — hosting/deployment
Browser localStorage — stores daily log entries
locally, no database needed
Screenshots
Add 3+ screenshots here after running the app locally
(step 3 below): the dashboard,
the specialist router result, and the daily logger with a
couple of entries. Drag the
images into this README on GitHub, or add them to a
/screenshots folder and link them:
![Dashboard](screenshots/dashboard.png)
![Specialist Router]
(screenshots/specialist.png)
![Daily Logger](screenshots/logger.png)

How to run it
1. Install dependencies
npm install

2. Add your API key
cp .env.example .env.local
Open .env.local and paste in a free key from
https://aistudio.google.com/app/apikey
3. Run locally
npm run dev
Visit http://localhost:3000
4. Deploy (get your public URL)
Push this repo to a public GitHub repository, then:
1. Go to https://vercel.com and sign in with GitHub.
2. Click Add New → Project, select this repo.
3. Under Environment Variables, add
GEMINI_API_KEY with your key.

4. Click Deploy. Vercel gives you a live
https://your-app.vercel.app URL —
paste it at the top of this README and into the
QuizlyHub submission portal.

Project structure
app/
page.js dashboard
specialist/page.js Symptom →
Specialist Router UI
medications/page.js Medication
Interaction Checker UI
logger/page.js Daily Condition
Logger UI
api/specialist/route.js AI route + system
prompt
api/medications/route.js AI route +
system prompt
api/insights/route.js AI route + system
prompt
components/ Navbar,
PulseDivider, Disclaimer, FeatureCard
lib/ai.js shared Gemini
fetch helper + JSON parsing

Notes on safety
Vitalis never provides diagnoses, dosing, or treatment
instructions — every system
