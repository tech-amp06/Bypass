import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get directory path for ES modules to load .env correctly
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Maintains your previous logic for injecting the database name.
 * Ensures named export is available for seed.js and server.js.
 */
export async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    // Your previous logic to ensure the correct database is used
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
    // Exit process with failure if connection fails during startup
    process.exit(1)
  }
}

// Handle connection events for better debugging
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})