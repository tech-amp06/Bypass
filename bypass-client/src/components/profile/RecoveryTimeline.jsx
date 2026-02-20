function RecoveryTimeline() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="font-semibold mb-4 text-lg">Recovery Timeline</h3>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
        <div className="bg-green-500 h-3 rounded-full w-2/5"></div>
      </div>

      {/* Timeline */}
      <ul className="space-y-2 text-gray-700">
        <li className="text-green-600 font-medium">
          Week 1-2 ✓
        </li>
        <li className="text-orange-500 font-semibold">
          Week 3-4 (Current)
        </li>
        <li>Week 5-12</li>
        <li>Week 13+</li>
      </ul>
    </div>
  );
}

export default RecoveryTimeline;