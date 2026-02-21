import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'

function Chat() {
  const { register, handleSubmit, reset } = useForm()
  const messagesEndRef = useRef(null)
  const username = localStorage.getItem('username') || 'Patient'

  const [conversation, setConversation] = useState([
    { type: 'bot', text: `Hello ${username}! I'm your recovery assistant. How are you feeling today?` }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const onSubmit = (data) => {
    const msg = data.query?.trim()
    if (!msg) return

    // Append user message
    setConversation(prev => [...prev, { type: 'user', text: msg }])

    // Simulate bot reply
    setTimeout(() => {
      setConversation(prev => [...prev, {
        type: 'bot',
        text: "Understood. I've noted that down. If your symptoms worsen, please use the Emergency button immediately. Our medical team has been alerted of your update."
      }])
    }, 1000)

    reset()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto py-4">
      <div className="flex items-center gap-4 mb-8 px-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recovery AI Assistant</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active & Monitoring</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 overflow-y-auto shadow-sm mx-4">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[1.8rem] text-sm font-semibold tracking-wide leading-relaxed ${msg.type === 'bot'
                ? 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                : 'bg-blue-600 text-white shadow-xl shadow-blue-100 rounded-tr-none'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex gap-4 px-4 sticky bottom-0">
        <div className="flex-1 relative">
          <input
            {...register('query')}
            type="text"
            autoComplete="off"
            placeholder="Report a symptom or ask a recovery question..."
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-[2rem] font-black shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          Send
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default Chat;