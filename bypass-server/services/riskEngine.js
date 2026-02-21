import { supabase } from '../config/supabase.js';

const THREAT_MAP = {
  chest_pain: ['Heart Failure', 'Arrhythmia'],
  shortness_of_breath: ['Heart Failure', 'Hypoxia'],
  fever: ['Infection', 'Sepsis']
};

/**
 * Predictive engine to score risk based on symptoms and pre-existing patient threats.
 * Fetches threats from Supabase users table and applies a 1.5x multiplier if matches found.
 */
export async function scoreRisk({ patientId, symptoms = [], currentVitals, baselineVitals, surgeryCategory }) {
  // 1. Fetch threats array from the Supabase users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('threats')
    .eq('id', patientId)
    .single();

  const patientThreats = userData?.threats || [];

  // 2. Logic to calculate base severity
  let sev = symptoms.length ? symptoms.reduce((sum, s) => sum + (s.severity || 0), 0) / symptoms.length : 0;

  // 3. Match symptoms against THREAT_MAP and patientThreats
  const isMatch = symptoms.some(s =>
    THREAT_MAP[s.name]?.some(t => patientThreats.includes(t))
  );

  // 4. Apply 1.5x multiplier if match exists
  if (isMatch) {
    sev = Math.min(sev * 1.5, 10);
  }

  // 5. Calculate final score
  const S = (0.7 * sev) + (0.3 * 5); // Simplified weighted score for hackathon stability

  return {
    score: parseFloat(S.toFixed(2)),
    level: S <= 3.0 ? 1 : S <= 6.5 ? 2 : 3,
    isPredictiveEscalation: isMatch
  };
}