function AdmissionHistory() {
  const events = [
    {
      date: "Feb 18, 2026",
      title: "Discharged",
      location: "VNRVJIET Medical Center",
      description: "Post-operative Cardiac Care - Discharge successful.",
      status: "completed",
      icon: "🎉"
    },
    {
      date: "Feb 02, 2026",
      title: "Admitted",
      location: "Emergency Unit",
      description: "Emergency admission for acute cardiac monitoring.",
      status: "past",
      icon: "🏥"
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinical History</h3>
          <p className="text-sm font-semibold text-slate-500">Chronological record of your hospital visits</p>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-slate-100">
        {events.map((event, idx) => (
          <div key={idx} className="relative pl-12">
            <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-lg shadow-sm ${event.status === 'completed' ? 'bg-blue-600 border-blue-100' : 'bg-slate-200'
              }`}>
              {event.icon}
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{event.date}</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${event.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {event.title}
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-1">{event.location}</h4>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdmissionHistory;