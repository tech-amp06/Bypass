import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

import { connectMongoDB } from './config/database.js'
import './config/supabase.js' 
import authRoutes from './routes/authRoutes.js'
import symptomRoutes from './routes/symptomRoutes.js'
import multimodalRoutes from './routes/multimodalRoutes.js'
import appointmentRoutes from './routes/appointments.js'
import { verifyAuth } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

connectMongoDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/', verifyAuth)

app.use('/api/symptoms', symptomRoutes)
app.use('/api/multimodal', multimodalRoutes)
app.use('/api/appointments', appointmentRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))