import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import BaselineVitals from '../models/BaselineVitals.js';
import SymptomLog from '../models/SymptomLog.js';
import { scoreRisk } from '../services/riskEngine.js';

const router = Router();

function normalizeVitals(v) {
  if (!v || typeof v !== 'object') return null;
  return {
    systolic_bp: v.systolic_bp ?? v.systolicBp,
    diastolic_bp: v.diastolic_bp ?? v.diastolicBp,
    heart_rate: v.heart_rate ?? v.heartRate,
    oxygen_sat: v.oxygen_sat ?? v.oxygenSat ?? v.spo2 ?? v.SpO2,
    temperature: v.temperature ?? v.temp,
  };
}

function hasRequiredVitals(v) {
  return (
    v &&
    typeof v.systolic_bp === 'number' &&
    typeof v.heart_rate === 'number' &&
    typeof v.oxygen_sat === 'number'
  );
}

router.post('/log', async (req, res) => {
  try {
    const { patientId, symptoms = [], currentVitals, surgeryCategory, source = 'form' } = req.body;

    if (!patientId || !surgeryCategory || !currentVitals) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedCurrent = normalizeVitals(currentVitals);
    if (!hasRequiredVitals(normalizedCurrent)) {
      return res.status(400).json({ error: 'Vitals missing required numeric fields' });
    }

    const baselineRaw = await BaselineVitals.findOne({ patientId }).lean();
    const baselineVitals = normalizeVitals(baselineRaw);

    if (!baselineVitals) return res.status(400).json({ error: 'Baseline not found' });

    const riskResult = await scoreRisk({
      patientId,
      symptoms,
      currentVitals: normalizedCurrent,
      baselineVitals,
      surgeryCategory
    });

    const log = await SymptomLog.create({
      patientId,
      symptoms,
      vitals: normalizedCurrent,
      riskScore: riskResult,
      source,
      submittedAt: new Date()
    });

    const actions = [];
    if (riskResult.level === 3) {
      actions.push({ type: 'emergency', message: 'CRITICAL: Contact ER immediately.' });
    } else if (riskResult.isPredictiveEscalation) {
      actions.push({ type: 'warning', message: 'Symptoms match your surgical risk profile.' });
    }

    return res.status(201).json({ success: true, log, score: riskResult, actions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;