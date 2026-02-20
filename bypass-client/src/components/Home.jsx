function Home() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Good Afternoon, {localStorage.getItem('username')}</h2>

      {/* Medication Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <p className="text-gray-500">Next Medication</p>
          <h3 className="text-2xl font-semibold">2:00 PM</h3>
          <p className="text-gray-600">Lisinopril 10mg</p>
        </div>

        <button className="text-white px-6 py-3 rounded-full hover:bg-blue-700 bg-blue-600">
          Mark as Taken
        </button>
      </div>

      {/* Status */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
        <p className="text-green-700 font-semibold">
          Recovery Status: Stable
        </p>
        <p className="text-gray-500">
          All vitals are within normal range
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-2">Days Since Discharge</h3>
          <p className="text-4xl font-bold text-blue-600">14</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-2">Medication Adherence</h3>
          <p className="text-4xl font-bold text-green-600">95%</p>
        </div>
      </div>
    </div>
  );
}

export default Home;