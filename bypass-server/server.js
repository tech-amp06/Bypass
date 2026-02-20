import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root (one level up from server/)
dotenv.config({ path: join(__dirname, '..', '.env') })

// Import after dotenv is configured
import { connectMongoDB } from './config/database.js'
import './config/supabase.js' // Initialize Supabase client after dotenv
import authRoutes from './routes/authRoutes.js'
import symptomRoutes from './routes/symptomRoutes.js'
import multimodalRoutes from './routes/multimodalRoutes.js'
import { verifyAuth } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

// Connect to databases
connectMongoDB()

// Middleware
app.use(cors())
app.use(express.json())
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

// Public auth routes (no auth required)
app.use('/api/auth', authRoutes)

// Global auth middleware — verify token on all other /api/* routes
app.use('/api/', verifyAuth)

// Protected API routes
app.use('/api/symptoms', symptomRoutes)
app.use('/api/multimodal', multimodalRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})