import PersonalDetails from "./PersonalDetails";
import AdmissionHistory from "./AdmissionHistory";
import AppointmentLog from "./AppointmentLog";
import BookAppointment from "./BookAppointment";

function Profile() {
  const username = localStorage.getItem('username') || "Patient";
  const userId = localStorage.getItem('userId') || "---";

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 pt-4 px-4">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8 opacity-50"></div>
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-200 relative z-10">
          {username.substring(0, 1).toUpperCase()}
        </div>
        <div className="text-center md:text-left relative z-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{username}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <p className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
              Patient ID: {userId}
            </p>
            <p className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
              Status: Recovering
            </p>
          </div>
        </div>
      </div>

      {/* Linear Layout of Components */}
      <div className="space-y-10">
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <PersonalDetails />
        </section>

        <section className="animate-in slide-in-from-bottom-4 duration-700">
          <AdmissionHistory />
        </section>

        <section className="animate-in slide-in-from-bottom-4 duration-1000">
          <AppointmentLog />
        </section>

        <section className="animate-in slide-in-from-bottom-4 duration-1000">
          <BookAppointment />
        </section>
      </div>
    </div>
  );
}

export default Profile;