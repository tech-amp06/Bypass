function RecoveryCategory() {
  // This would ideally pull from the 'threats' or 'status' column in your DB
  const status = "Phase 2: Active Recovery";
  
  return (
    <div className="p-4">
      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Current Phase</h4>
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
        <p className="text-blue-700 font-bold text-lg">{status}</p>
        <p className="text-blue-600/70 text-sm font-medium mt-1">
          Focus: Gradual mobility and vital stabilization.
        </p>
      </div>
    </div>
  );
}

export default RecoveryCategory;