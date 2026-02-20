function Profile() {
  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-3xl font-bold">My Profile</h2>

      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
          SJ
        </div>
        <div>
          <h3 className="text-xl font-semibold">Sarah Johnson</h3>
          <p className="text-gray-500">65 years old • Female</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-4">Personal Details</h3>
        <p>Date of Birth: March 15, 1961</p>
        <p>Blood Type: A+</p>
        <p>Emergency Contact: Michael Johnson</p>
      </div>
    </div>
  );
}

export default Profile;