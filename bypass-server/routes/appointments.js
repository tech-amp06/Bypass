import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/:patientId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', req.params.patientId)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { patientId, doctor_id, scheduled_at, type, notes } = req.body;
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ 
        patient_id: patientId, 
        doctor_id: doctor_id || 'dr_default_001', 
        scheduled_at, 
        type, 
        status: 'scheduled', 
        notes 
      }]);

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;