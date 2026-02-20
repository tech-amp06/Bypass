import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Ensure dotenv is loaded
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

export async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    // Add database name if not present in URI
    const dbName = 'recovery_companion'
    const uriWithDb = mongoUri.includes('/?') 
      ? mongoUri.replace('/?', `/${dbName}?`)
      : mongoUri.endsWith('/')
        ? `${mongoUri}${dbName}`
        : `${mongoUri}/${dbName}`

    await mongoose.connect(uriWithDb)
    console.log(`✅ MongoDB connected successfully to database: ${dbName}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})
