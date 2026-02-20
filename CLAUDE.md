# CLAUDE.md — Recovery Companion
> Drop this file in your project root. This is the single source of truth for Cursor,
> Claude, and any AI builder working on this codebase.

---

## Project Identity

**Name:** Recovery Companion  
**Purpose:** Intelligent post-discharge monitoring that bridges the gap between
hospital discharge and first follow-up appointment.  
**Core Insight:** Static discharge papers fail patients. Dynamic, personalized
risk assessment + timely nudges prevent re-admissions.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | SPA, fast HMR |
| Routing | React Router v6 | Page navigation |
| State | Zustand | Lightweight global store |
| Backend | Node.js + Express | REST API server |
| Auth + SQL | Supabase | Users, doctors, appointments |
| Unstructured DB | MongoDB (Mongoose) | Symptom logs, risk events |
| AI — Vision | Google Gemini Vision API | Wound photo analysis |
| AI — Voice | Web Speech API (browser-native) | Voice symptom input |
| Maps | Google Maps JS API + Directions | ER pre-arrival ETA |
| Notifications | Supabase Realtime + Web Push | Doctor alerts, nudges |
| File Storage | Supabase Storage | Wound photos, audio |

---

## Repository Structure
```
recovery-companion/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── api/                   # Axios instances per service
│   │   │   ├── supabaseClient.js
│   │   │   └── apiClient.js       # Express backend calls
│   │   ├── components/
│   │   │   ├── vitals/            # VitalsForm, VitalsChart
│   │   │   ├── symptoms/          # SymptomLogger, VoiceCapture, PhotoUpload
│   │   │   ├── risk/              # RiskBadge, RiskAlert, ERDirections
│   │   │   ├── nudges/            # NudgeCard, NudgeTimeline
│   │   │   └── shared/            # Button, Modal, Spinner
│   │   ├── pages/
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── SymptomCheckIn.jsx
│   │   │   ├── WoundAnalysis.jsx
│   │   │   └── ERNavigation.jsx
│   │   ├── store/                 # Zustand slices
│   │   │   ├── authStore.js
│   │   │   ├── patientStore.js
│   │   │   └── riskStore.js
│   │   └── utils/
│   │       ├── riskEngine.js      # Client-side score preview
│   │       └── nudgeScheduler.js
├── server/                        # Express backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── symptoms.js
│   │   ├── risk.js
│   │   ├── appointments.js
│   │   └── multimodal.js
│   ├── services/
│   │   ├── riskEngine.js          # Canonical S formula lives HERE
│   │   ├── geminiService.js       # Gemini Vision API wrapper
│   │   ├── mapsService.js         # Google Maps Directions API
│   │   ├── nudgeService.js        # Day-offset nudge scheduler
│   │   └── notificationService.js # Push + Supabase Realtime
│   ├── models/                    # Mongoose schemas
│   │   ├── SymptomLog.js
│   │   ├── MultimodalData.js
│   │   └── RiskAnalytics.js
│   └── middleware/
│       ├── auth.js                # Supabase JWT verification
│       └── rateLimit.js
├── supabase/
│   └── migrations/                # SQL migration files
├── CLAUDE.md                      ← YOU ARE HERE
└── .env.example
```

---

## State Management Strategy

**Tool: Zustand** (chosen over Redux for low boilerplate, over Context for
performance — no prop drilling, no re-render cascades on unrelated state).

### Store Slices

**`authStore.js`**
```javascript
// Holds: session, user profile, role ('patient' | 'doctor' | 'hospital_admin')
// Actions: login(), logout(), refreshSession()
// Hydrates from: Supabase Auth on app mount
```

**`patientStore.js`**
```javascript
// Holds: patientProfile, baselineVitals, dischargeDate, surgeryCategory
// Holds: daysSinceDischarge (computed), nudges[], appointmentList[]
// Actions: fetchProfile(), fetchNudges(), fetchAppointments()
// Note: baselineVitals is READ-ONLY after admission — never mutated client-side
```

**`riskStore.js`**
```javascript
// Holds: latestLog, currentRiskLevel (1|2|3), currentScore (0-10)
// Holds: riskHistory[], activeFlag (doctor review pending)
// Actions: submitSymptomLog(), fetchRiskHistory()
// Side effects: on Level 3 score → auto-trigger ERNavigation page push
```

### Data Flow Rule
> All write operations go through the Express backend. Never write directly
> to Supabase or MongoDB from the client. The backend is the single validator.

---

## Risk Engine — Canonical Implementation

**File:** `server/services/riskEngine.js`
```javascript
// S = w1*σ(sev) + w2*ρ(cat) + w3*δ(vitals)

const WEIGHTS = { severity: 0.35, relevance: 0.35, deviation: 0.30 };

// ρ table — extend per category
const RELEVANCE_TABLE = {
  cardiac: { chest_pain: 0.95, shortness_of_breath: 0.90, fever: 0.75, wound_redness: 0.50 },
  ortho:   { joint_swelling: 0.95, wound_redness: 0.85, fever: 0.80, chest_pain: 0.55 },
  general: { wound_redness: 0.90, fever: 0.88, chest_pain: 0.60, shortness_of_breath: 0.55 }
};

function computeRelevance(symptoms, category) {
  const table = RELEVANCE_TABLE[category] || {};
  const scores = symptoms.map(s => (table[s.name] || 0.40) * (s.severity / 10));
  return scores.length ? Math.max(...scores) * 10 : 0;
}

function computeDeviation(current, baseline) {
  const bpDev  = Math.abs(current.systolic_bp - baseline.systolic_bp) / 15;
  const hrDev  = Math.abs(current.heart_rate  - baseline.heart_rate)  / 12;
  const spo2Dev= Math.abs(current.oxygen_sat  - baseline.oxygen_sat)  / 2;
  return Math.min(((bpDev + hrDev + spo2Dev) / 3) * 10, 10);
}

function computeSeverity(symptoms) {
  if (!symptoms.length) return 0;
  return symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
}

export function scoreRisk({ symptoms, currentVitals, baselineVitals, surgeryCategory }) {
  const sev = computeSeverity(symptoms);
  const rel = computeRelevance(symptoms, surgeryCategory);
  const dev = computeDeviation(currentVitals, baselineVitals);

  const S = WEIGHTS.severity * sev
          + WEIGHTS.relevance * rel
          + WEIGHTS.deviation * dev;

  return {
    score: parseFloat(S.toFixed(2)),
    level: S <= 3.0 ? 1 : S <= 6.5 ? 2 : 3,
    breakdown: { severity_component: sev, relevance_component: rel, deviation_component: dev }
  };
}
```

---

## API Contract (Key Endpoints)
```
POST   /api/symptoms/log          → Submit check-in; returns {score, level, actions}
GET    /api/patients/:id/nudges   → Return today's stage-appropriate nudges
POST   /api/multimodal/wound      → Upload photo; returns Gemini analysis
POST   /api/multimodal/voice      → Submit transcript; returns parsed symptoms
GET    /api/risk/flags            → Doctor: get pending Level 2 flags
PATCH  /api/risk/flags/:id        → Doctor: resolve or escalate flag
GET    /api/maps/er-route         → Returns {eta_minutes, route_url, hospital}
POST   /api/appointments          → Create urgent appointment from Level 2/3 trigger
```

---

## The Nudge Engine

**Logic:** On every app open, `nudgeService.js` queries:
```sql
SELECT * FROM nudge_schedule
WHERE surgery_category = $1 AND day_offset = $2
```
where `day_offset = TODAY - discharge_date`.

Nudges are **additive**: Day 3 shows Day 3 content. Day 7 shows Day 7 content.
Past nudges are archived to `riskStore.nudgeHistory[]` for patient review.

**Sample nudge content structure:**
```json
{ "day_offset": 3, "surgery_category": "ortho",
  "title": "Your first short walk 🚶",
  "body": "Today aim for 5-minute walks twice. Stop if you feel sharp knee pain.",
  "nudge_type": "activity" }
```

---

## Multimodal Input Pipeline

### Voice (Web Speech API)
```
User taps mic → SpeechRecognition starts → transcript captured →
POST /api/multimodal/voice → server parses symptoms via Gemini text →
structured symptoms array → passed into riskEngine.scoreRisk()
```

### Wound Photo (Gemini Vision)
```
User uploads photo → Supabase Storage (private bucket) →
signed URL passed to Gemini Vision with prompt:
  "Analyze this post-surgical wound. Rate redness (0-10),
   swelling (0-10), discharge presence (boolean), 
   and flag any signs of infection." →
findings stored in MultimodalData →
severity_estimate injected as extra symptom into risk score
```

---

## Magic Demo Flow (For Presentations)

> This is the 3-minute demo script. Build around this exact sequence.

**Act 1 — Hospital Onboarding (Doctor view)**
1. Login as `doctor@demo.com`
2. Create patient "Alex Chen", Cardiac surgery, admit baseline: BP 125/82, HR 71, SpO2 98%
3. Click "Trigger Discharge" → system sets discharge_date = today

**Act 2 — Patient Day 3 Check-In**
1. Login as `patient@demo.com`
2. Dashboard shows "Day 3 — Your Recovery Journey" + nudge card: "Short walk goal"
3. Tap "Log Symptoms" → select Chest Tightness (severity 7), Shortness of Breath (severity 6)
4. Enter vitals: BP 145/90, HR 95, SpO2 94%
5. Submit → Score computes to ~7.8 → **Level 3 Alert fires**

**Act 3 — Level 3 Response**
1. Red alert banner: "Please go to the ER immediately"
2. Tap "Get Directions" → Google Maps opens with ETA to nearest ER
3. Backend fires notification to doctor dashboard

**Act 4 — Wound Photo (bonus wow moment)**
1. Switch to "Wound Check" tab
2. Upload sample wound photo
3. Gemini returns: redness 6/10, swelling detected → injected into score
4. Show MultimodalData document in MongoDB Compass

---

## Environment Variables
```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MongoDB
MONGODB_URI=

# Google APIs
GOOGLE_MAPS_API_KEY=
GEMINI_API_KEY=

# App
PORT=3001
JWT_SECRET=
NODE_ENV=development
```

---

## 24-Hour Sprint Plan (Team of 5)

| Engineer | Hours 0-8 | Hours 8-16 | Hours 16-24 |
|----------|-----------|------------|-------------|
| **E1 — Backend Lead** | Supabase schema + migrations, Auth middleware | Risk engine service, Symptom log endpoints | Doctor flag system, Nudge scheduler cron |
| **E2 — Frontend Lead** | Vite setup, Zustand stores, routing | Patient Dashboard, SymptomCheckIn page | Risk alert UI, ERNavigation page |
| **E3 — Data/Mongo** | MongoDB + Mongoose setup, SymptomLog model | Log API endpoints, RiskAnalytics aggregator | Doctor dashboard data, Analytics charts |
| **E4 — AI/Maps** | Gemini Vision service wrapper | Voice pipeline + transcript parser | Google Maps ER route endpoint + UI |
| **E5 — UX/Integration** | Figma → component library setup | Nudge cards, VitalsForm, RiskBadge | End-to-end demo flow, bug fixes, DEMO SCRIPT |

---

## Key Architectural Decisions & Rationale

**Why Supabase + MongoDB (not one or the other)?**
Supabase handles identity, relationships, and row-level security cleanly.
MongoDB handles high-velocity, schema-flexible symptom logs where each
entry's structure evolves (voice vs. form vs. photo have different shapes).

**Why is baseline immutable?**
The δ(vitals) component only works as a deviation metric if the reference
never shifts. Baseline is written once at admission and is read-only
thereafter — enforced by the backend (no PATCH route for baseline_vitals).

**Why Zustand over Context/Redux?**
Risk state needs to trigger navigation side-effects (Level 3 → auto-push
to ERNavigation). Zustand's subscribe() pattern handles this cleanly
without prop drilling or sagas.

**Why client-side score preview?**
`client/utils/riskEngine.js` mirrors the server formula so the UI can
show a live score estimate as the patient fills in symptoms, improving
engagement. The server result is always authoritative and overwrites the preview.