import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import BaselineVitals from '../models/BaselineVitals.js'; // MongoDB model
import SymptomLog from '../models/SymptomLog.js';
import { scoreRisk } from '../services/riskEngine.js';

const router = Router();

// Helper to normalize vitals from various naming conventions
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

// Validation helper
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
    const {
      patientId,
      symptoms = [], // Array of { name: string, severity: number } from Gemini
      currentVitals,
      surgeryCategory,
      source = 'form'
    } = req.body;

    if (!patientId || !surgeryCategory || !currentVitals) {
      return res.status(400).json({ error: 'Missing patientId, surgeryCategory, or currentVitals' });
    }

    const normalizedCurrent = normalizeVitals(currentVitals);
    if (!hasRequiredVitals(normalizedCurrent)) {
      return res.status(400).json({ error: 'currentVitals missing required numeric fields' });
    }

    // 1. Fetch 'threats' from Supabase 'users' table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('threats')
      .eq('id', patientId)
      .single();

    if (userError) {
      console.error('Supabase User Fetch Error:', userError);
      return res.status(404).json({ error: 'Patient profile not found in Supabase' });
    }

    // 2. Fetch Baseline from MongoDB
    const baselineRaw = await BaselineVitals.findOne({ patientId }).lean();
    const baselineVitals = normalizeVitals(baselineRaw);

    if (!baselineVitals) {
      return res.status(400).json({ error: 'Baseline vitals not found for this patient' });
    }

    // 3. Compute Risk with Predictive Escalation logic
    const riskResult = scoreRisk({
      symptoms,
      currentVitals: normalizedCurrent,
      baselineVitals,
      surgeryCategory,
      patientThreats: userData.threats || [] // Used for 1.5x multiplier in engine
    });

    // 4. Save the log to MongoDB
    const log = await SymptomLog.create({
      patientId,
      symptoms,
      vitals: normalizedCurrent,
      riskScore: riskResult,
      source,
      submittedAt: new Date()
    });

    // 5. Automatic Action logic
    const actions = [];
    if (riskResult.level === 3) {
      actions.push({ type: 'emergency', message: 'CRITICAL: Please contact your surgeon or go to the ER immediately.' });
    } else if (riskResult.isPredictiveEscalation) {
      actions.push({ type: 'warning', message: 'Note: Reported symptoms match your specific surgical risk profile.' });
    }

    return res.status(201).json({ 
      success: true, 
      log, 
      score: riskResult, 
      actions 
    });

  } catch (error) {
    console.error('POST /log failed:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

export default router;