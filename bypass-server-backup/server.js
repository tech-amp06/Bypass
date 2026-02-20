import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
// import './config/supabase.js'

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root (one level up from server/)
dotenv.config({ path: join(__dirname, '..', '.env') })

// Import after dotenv is configured
// import { connectMongoDB } from './config/database.js'


const app = express()
const PORT = process.env.PORT || 3001

// Connect to databases
// connectMongoDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes (to be added)
// app.use('/api/auth', authRoutes)
// app.use('/api/patients', patientRoutes)
// app.use('/api/symptoms', symptomRoutes)
// app.use('/api/risk', riskRoutes)
// app.use('/api/appointments', appointmentRoutes)
// app.use('/api/multimodal', multimodalRoutes)
// app.use('/api/maps', mapsRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})