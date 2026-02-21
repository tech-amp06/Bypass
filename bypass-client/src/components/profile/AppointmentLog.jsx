import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../apis/appointmentService';

const AppointmentLog = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if (userId) {
                    const data = await getAppointments(userId);
                    setAppointments(data);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();

        // Listen for new bookings
        const handleRefresh = () => fetchAppointments();
        window.addEventListener('appointment-booked', handleRefresh);
        return () => window.removeEventListener('appointment-booked', handleRefresh);
    }, [userId]);

    if (loading) return <div className="p-4 text-slate-500 animate-pulse font-medium text-sm">Loading appointments...</div>;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pre-Discharge Appointment Log</h3>
                    <p className="text-sm font-semibold text-slate-500">Track your upcoming and past medical consultations</p>
                </div>
            </div>

            <div className="relative">
                <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                <div className="space-y-8">
                    {appointments.length === 0 ? (
                        <div className="pl-16 py-8">
                            <p className="text-slate-400 text-sm font-medium italic">No appointment history found.</p>
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt.id} className="relative pl-16 group">
                                <div className="absolute left-[22px] top-2 w-3 h-3 rounded-full border-2 border-white bg-blue-600 ring-4 ring-blue-50 z-10 group-hover:scale-125 transition-transform duration-300"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:border-blue-200 group-hover:bg-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                                    <div className="mb-3 md:mb-0">
                                        <p className="text-sm font-black text-slate-900 mb-1">
                                            {new Date(apt.scheduled_at).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-xs font-bold text-slate-600">
                                                {apt.doctor_name || 'Dr. Alexander Pierce'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${(apt.status || 'Scheduled').toLowerCase() === 'completed'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-blue-600 text-white'
                                            }`}>
                                            {apt.status || 'Scheduled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentLog;
