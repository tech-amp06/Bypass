export const getRiskLevel = (symptom, preExistingThreats) => {
  // Normalize inputs
  const input = symptom.toLowerCase();
  const threats = preExistingThreats.map(t => t.toLowerCase());

  // 1. Direct Critical Match
  const critical = ['chest pain', 'shortness of breath', 'severe bleeding'];
  if (critical.some(c => input.includes(c))) return 'HIGH';

  // 2. Cross-reference with Supabase Threats
  // If user has "Hypertension" and reports "Headache", elevate risk.
  const isMatch = threats.some(threat => input.includes(threat) || threat.includes(input));
  
  return isMatch ? 'MODERATE' : 'STABLE';
};