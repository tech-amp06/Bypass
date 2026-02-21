function PersonalDetails() {
  const details = [
    { label: "Blood Group", value: "O+ Positive", icon: "🩸", color: "bg-red-50 text-red-600" },
    { label: "Height", value: "178 cm", icon: "📏", color: "bg-blue-50 text-blue-600" },
    { label: "Weight", value: "72 kg", icon: "⚖️", color: "bg-amber-50 text-amber-600" },
    { label: "Allergies", value: "Penicillin", icon: "⚠️", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Details</h3>
          <p className="text-sm font-semibold text-slate-500">Core physiological metrics and profile data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-300 group">
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-sm font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalDetails;