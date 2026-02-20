import PersonalDetails from "./PersonalDetails";
import AdmissionHistory from "./AdmissionHistory";
import RecoveryCategory from "./RecoveryCategory";
import RecoveryTimeline from "./RecoveryTimeline";

function Profile() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <h2 className="text-3xl font-bold">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
          SJ
        </div>
        <div>
          <h3 className="text-xl font-semibold">Sarah Johnson</h3>
          <p className="text-gray-500">65 years old • Female</p>
        </div>
      </div>

      {/* Other Sections */}
      <PersonalDetails />
      <AdmissionHistory />
      <RecoveryCategory />
      <RecoveryTimeline />
    </div>
  );
}

export default Profile;