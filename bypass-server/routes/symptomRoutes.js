import { Router } from 'express'
import SymptomLog from '../models/SymptomLog.js'
import BaselineVitals from '../models/BaselineVitals.js'
import { scoreRisk } from '../services/riskEngine.js'

const router = Router()

function normalizeVitals(v) {
  if (!v || typeof v !== 'object') return null
  return {
    systolic_bp: v.systolic_bp ?? v.systolicBp,
    diastolic_bp: v.diastolic_bp ?? v.diastolicBp,
    heart_rate: v.heart_rate ?? v.heartRate,
    oxygen_sat: v.oxygen_sat ?? v.oxygenSat ?? v.spo2 ?? v.SpO2,
    temperature: v.temperature ?? v.temp,
  }
}

function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n)
}

function hasRequiredDeviationVitals(v) {
  return (
    v &&
    isFiniteNumber(v.systolic_bp) &&
    isFiniteNumber(v.heart_rate) &&
    isFiniteNumber(v.oxygen_sat)
  )
}

router.post('/log', async (req, res) => {
  try {
    const {
      patientId,
      symptoms = [],
      currentVitals,
      baselineVitals: baselineVitalsFromBody,
      surgeryCategory,
      source = 'form',
    } = req.body || {}

    if (!patientId) return res.status(400).json({ error: 'patientId is required' })
    if (!surgeryCategory) return res.status(400).json({ error: 'surgeryCategory is required' })
    if (!currentVitals) return res.status(400).json({ error: 'currentVitals is required' })

    const normalizedCurrentVitals = normalizeVitals(currentVitals)
    if (!hasRequiredDeviationVitals(normalizedCurrentVitals)) {
      return res.status(400).json({
        error:
          'currentVitals must include numeric systolic_bp (or systolicBp), heart_rate (or heartRate), and oxygen_sat (or oxygenSat/spo2).',
      })
    }

    const normalizedBaselineFromBody = normalizeVitals(baselineVitalsFromBody)
    const baselineVitals =
      (hasRequiredDeviationVitals(normalizedBaselineFromBody) ? normalizedBaselineFromBody : null) ||
      normalizeVitals(await BaselineVitals.findOne({ patientId }).lean())

    if (!baselineVitals) {
      return res.status(400).json({
        error:
          'baselineVitals missing. Provide baselineVitals in request body or seed BaselineVitals in MongoDB for this patientId.',
      })
    }

    const score = scoreRisk({
      symptoms,
      currentVitals: normalizedCurrentVitals,
      baselineVitals,
      surgeryCategory,
    })

    const log = await SymptomLog.create({
      patientId,
      symptoms,
      vitals: normalizedCurrentVitals,
      riskScore: score,
      source,
      submittedAt: new Date(),
    })

    const actions = []
    if (score.level === 3) actions.push({ type: 'er', message: 'Please go to the ER immediately' })

    return res.status(201).json({ log, score, actions })
  } catch (error) {
    console.error('POST /api/symptoms/log failed:', error)
    return res.status(500).json({ error: 'Failed to submit symptom log' })
  }
})

export default router

