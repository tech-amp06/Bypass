import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { sendQuery } from '../apis/sendQuery'
import { FaPlus } from 'react-icons/fa'

function Chat() {
  const { register, handleSubmit, reset } = useForm()

  const [conversation, setConversation] = useState(() => {
    try {
      const raw = localStorage.getItem('chat_conversation')
      return raw ? JSON.parse(raw) : ['Hello Sarah! How are you feeling today?']
    } catch (e) {
      return ['Hello Sarah! How are you feeling today?']
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('chat_conversation', JSON.stringify(conversation))
    } catch (e) {
      // ignore storage errors
    }
  }, [conversation])

  const generateReply = (msg) => {
    const m = (msg || '').toLowerCase()
    if (!m) return "I didn't get that — can you rephrase?"
    if (m.includes('short') || m.includes('breath') || m.includes('breathing'))
      return 'I\'m concerned. Please consult your doctor within 24 hours.'
    if (m.includes('pain')) return 'Understood — please rate your pain 1 to 10 and note swelling.'
  }

  const onSubmit = async (data) => {
    const message = (data.query || '').trim()
    console.log(message);
    if (!message) return

    // append user message immediately (odd index)
    setConversation((prev) => [...prev, message])
    reset()

    try {
      // Call sendQuery with only the message string
      const resp = await sendQuery(message)

      let reply;
      if (!resp) reply = generateReply(message)
      else if (typeof resp === 'string') reply = resp

      // append reply (even index)
      setConversation((prev) => [...prev, reply])
    } catch (e) {
      setConversation((prev) => [...prev, "Server Error, could not fetch details. Inconvenience sincerely regretted."])
    }
  }

  return (
    <div className="max-w-3xl flex flex-col h-full">
      <h2 className="text-3xl font-bold mb-6">AI Health Assistant</h2>

      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-4 overflow-y-auto">
        {conversation.map((text, i) => (
          <div
            key={i}
            className={
              i % 2 === 0
                ? 'bg-gray-100 p-4 rounded-xl w-fit max-w-sm'
                : 'bg-blue-600 text-white p-4 rounded-xl w-fit max-w-sm ml-auto'
            }
          >
            {text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-4">
        <div className="m-auto p-3 items-center cursor-pointer">
          <FaPlus/>
        </div>

        <input
          {...register('query')}
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 rounded-full">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat