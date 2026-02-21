import { useState, useEffect } from 'react';
import { getAppointments, bookAppointment } from '../../apis/appointmentService';

function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const userId = localStorage.getItem('userId');

  const fetchLogs = async () => {
    if (!userId) return;
    try {
      const data = await getAppointments(userId);
      setAppointments(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => { fetchLogs(); }, [userId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    const payload = {
      patientId: userId,
      type: formData.get('type'),
      scheduled_at: formData.get('date'),
      notes: formData.get('notes'),
      doctor_id: "dr_default_001"
    };

    try {
      await bookAppointment(payload);
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      alert("Booking failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Appointments</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          {showForm ? "View Logs" : "Book New"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleBook} className="space-y-4 p-5 bg-slate-50 rounded-3xl border border-blue-100">
          <select name="type" required className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none">
            <option value="Check-up">Routine Check-up</option>
            <option value="Surgical Review">Surgical Review</option>
            <option value="Nurse Visit">Nurse Visit</option>
          </select>
          <input name="date" type="datetime-local" required className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none" />
          <textarea name="notes" placeholder="Notes for the doctor..." className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none h-24" />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Appointment"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">No appointment history found.</p>
            </div>
          ) : (
            appointments.map((app) => (
              <div key={app.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div>
                  <p className="font-bold text-slate-800">{app.type}</p>
                  <p className="text-xs text-slate-500">{new Date(app.scheduled_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${
                  app.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AppointmentManager;