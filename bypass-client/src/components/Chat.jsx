function Chat() {
  return (
    <div className="max-w-3xl flex flex-col h-full">
      <h2 className="text-3xl font-bold mb-6">AI Health Assistant</h2>

      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-4 overflow-y-auto">
        <div className="bg-gray-100 p-4 rounded-xl w-fit max-w-sm">
          Hello Sarah! How are you feeling today?
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-xl w-fit max-w-sm ml-auto">
          I feel shortness of breath while walking upstairs.
        </div>

        <div className="bg-gray-100 p-4 rounded-xl w-fit max-w-sm">
          Please consult your doctor within 24 hours.
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2"
        />
        <button className="bg-blue-600 text-white px-6 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;