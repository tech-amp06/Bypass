// Canonical risk engine implementation
// S = w1*σ(sev) + w2*ρ(cat) + w3*δ(vitals)

const WEIGHTS = { severity: 0.35, relevance: 0.35, deviation: 0.30 }

// ρ table — extend per category
const RELEVANCE_TABLE = {
  cardiac: { chest_pain: 0.95, shortness_of_breath: 0.90, fever: 0.75, wound_redness: 0.50 },
  ortho: { joint_swelling: 0.95, wound_redness: 0.85, fever: 0.80, chest_pain: 0.55 },
  general: { wound_redness: 0.90, fever: 0.88, chest_pain: 0.60, shortness_of_breath: 0.55 }
}

function computeRelevance(symptoms, category) {
  const table = RELEVANCE_TABLE[category] || {}
  const scores = symptoms.map(s => (table[s.name] || 0.40) * (s.severity / 10))
  return scores.length ? Math.max(...scores) * 10 : 0
}

function computeDeviation(current, baseline) {
  if (!current || !baseline) return 0
  const sbp = Number(current.systolic_bp)
  const sbp0 = Number(baseline.systolic_bp)
  const hr = Number(current.heart_rate)
  const hr0 = Number(baseline.heart_rate)
  const spo2 = Number(current.oxygen_sat)
  const spo20 = Number(baseline.oxygen_sat)

  // Avoid NaN propagation; route should validate, but keep engine safe.
  if (![sbp, sbp0, hr, hr0, spo2, spo20].every(Number.isFinite)) return 0

  const bpDev = Math.abs(sbp - sbp0) / 15
  const hrDev = Math.abs(hr - hr0) / 12
  const spo2Dev = Math.abs(spo2 - spo20) / 2
  return Math.min(((bpDev + hrDev + spo2Dev) / 3) * 10, 10)
}

function computeSeverity(symptoms) {
  if (!symptoms.length) return 0
  return symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length
}

export function scoreRisk({ symptoms, currentVitals, baselineVitals, surgeryCategory }) {
  const sev = computeSeverity(symptoms)
  const rel = computeRelevance(symptoms, surgeryCategory)
  const dev = computeDeviation(currentVitals, baselineVitals)

  const S = WEIGHTS.severity * sev
          + WEIGHTS.relevance * rel
          + WEIGHTS.deviation * dev

  return {
    score: parseFloat(S.toFixed(2)),
    level: S <= 3.0 ? 1 : S <= 6.5 ? 2 : 3,
    breakdown: { severity_component: sev, relevance_component: rel, deviation_component: dev }
  }
}
