import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const client = axios.create({
  baseURL: API_URL.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
})

// Attach Authorization header automatically from localStorage
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token')
    if (token) {
      // If token already includes Bearer prefix, don't double it
      config.headers = config.headers || {}
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

export default client
