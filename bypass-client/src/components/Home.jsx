import QuickVitalsForm from "./vitals/QuickVitalsForm";

function Home() {
  const username = localStorage.getItem('username') || 'Patient';

  return (
    <div className="space-y-8 p-4 md:p-0">
      <header>
        <h2 className="text-3xl font-black text-slate-900">
          Welcome, <span className="text-blue-600">{username}</span>
        </h2>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Daily Goal</p>
            <h3 className="text-2xl font-bold text-slate-900">Complete 15 min Walking</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-center">
              <p className="text-4xl font-black text-blue-600">14</p>
              <p className="text-slate-400 font-bold text-[10px] uppercase">Days Post-Op</p>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-center">
              <p className="text-4xl font-black text-emerald-500">Stable</p>
              <p className="text-slate-400 font-bold text-[10px] uppercase">Condition</p>
            </div>
          </div>
        </div>

        {/* This is where the error usually triggers if the import is wrong */}
        <div className="lg:col-span-1">
          <QuickVitalsForm />
        </div>
      </div>
    </div>
  );
}

export default Home;