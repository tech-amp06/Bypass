import { useState } from 'react';
import axios from 'axios';

function QuickVitalsForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);

    const payload = {
      patientId: localStorage.getItem('userId'),
      surgeryCategory: 'cardiac',
      currentVitals: {
        systolic_bp: Number(fd.get('sbp')),
        heart_rate: Number(fd.get('hr')),
        oxygen_sat: Number(fd.get('spo2')),
      },
      symptoms: [{ name: fd.get('symptom'), severity: 5 }]
    };

    try {
      const { data } = await axios.post('http://localhost:3001/api/symptoms/log', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus(data.score.level === 3 ? "CRITICAL" : "STABLE");
    } catch (err) {
      console.error("API Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
      <h3 className="font-black text-slate-900 uppercase text-xs mb-4">Vitals Analysis</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="sbp" type="number" placeholder="Systolic BP" required className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none" />
        <input name="hr" type="number" placeholder="Heart Rate" required className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none" />
        <input name="spo2" type="number" placeholder="SpO2 %" required className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none" />
        <select name="symptom" className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none">
          <option value="none">No Symptoms</option>
          <option value="chest_pain">Chest Pain</option>
          <option value="fever">Fever</option>
        </select>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
          {loading ? "Checking..." : "Submit Vitals"}
        </button>
      </form>
      {status && (
        <p className={`mt-4 text-center font-bold text-xs ${status === 'CRITICAL' ? 'text-red-600' : 'text-emerald-600'}`}>
          STATUS: {status}
        </p>
      )}
    </div>
  );
}

export default QuickVitalsForm;