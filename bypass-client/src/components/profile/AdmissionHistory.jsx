function AdmissionHistory() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="font-semibold mb-4 text-lg">
        Recent Admission History
      </h3>

      <div className="space-y-2 text-gray-700">
        <p>Diagnosis: CABG</p>
        <p>Surgery Date: Feb 6, 2026</p>
        <p>Admission Date: Feb 5, 2026</p>
        <p>Discharge Date: Feb 12, 2026</p>
        <p>Hospital: St. Mary’s Medical Center</p>
      </div>
    </div>
  );
}

export default AdmissionHistory;