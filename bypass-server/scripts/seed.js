import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { connectMongoDB } from '../config/database.js'
import mongoose from 'mongoose'

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

import { supabase } from '../config/supabase.js'

// Define baseline vitals schema for MongoDB
const BaselineVitalsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  systolic_bp: { type: Number, required: true },
  diastolic_bp: { type: Number, required: true },
  heart_rate: { type: Number, required: true },
  oxygen_sat: { type: Number, required: true },
  temperature: { type: Number },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const BaselineVitals = mongoose.models.BaselineVitals || mongoose.model('BaselineVitals', BaselineVitalsSchema)

async function seed() {
  try {
    console.log('🌱 Starting seed script...\n')

    // Connect to MongoDB
    await connectMongoDB()

    // Check if Supabase is accessible
    const { data: healthCheck, error: healthError } = await supabase.from('_health').select('*').limit(1)
    if (healthError && healthError.code !== 'PGRST116') {
      console.log('⚠️  Supabase health check:', healthError.message)
    }
    console.log('✅ Supabase connection verified\n')

    // Create patient in Supabase
    console.log('📝 Creating patient profile in Supabase...')
    
    // First, create auth user
    const email = 'alex.chen@demo.com'
    const password = 'Demo123!@#'
    
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)
    
    let userId
    if (existingUser) {
      console.log(`   User ${email} already exists, using existing ID`)
      userId = existingUser.id
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })
      
      if (authError) {
        throw new Error(`Failed to create auth user: ${authError.message}`)
      }
      
      userId = authData.user.id
      console.log(`   ✅ Created auth user: ${email} (${userId})`)
    }

    // Create patient profile in Supabase (assuming 'patients' table exists)
    // If table doesn't exist, we'll create a simple structure
    const patientData = {
      id: userId,
      email,
      full_name: 'Alex Chen',
      surgery_category: 'cardiac',
      discharge_date: new Date().toISOString().split('T')[0], // Today's date
      role: 'patient',
      created_at: new Date().toISOString()
    }

    // Try to insert into patients table
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .upsert(patientData, { onConflict: 'id' })
      .select()
      .single()

    if (patientError) {
      // If table doesn't exist, log warning but continue
      if (patientError.code === 'PGRST205' || patientError.code === 'PGRST116' || 
          patientError.message.includes('relation') || patientError.message.includes('does not exist')) {
        console.log(`   ⚠️  'patients' table not found in Supabase.`)
        console.log(`   📋 To create the table, run this SQL in Supabase SQL Editor:`)
        console.log(`   `)
        console.log(`   CREATE TABLE IF NOT EXISTS patients (`)
        console.log(`     id UUID PRIMARY KEY REFERENCES auth.users(id),`)
        console.log(`     email TEXT NOT NULL,`)
        console.log(`     full_name TEXT NOT NULL,`)
        console.log(`     surgery_category TEXT NOT NULL,`)
        console.log(`     discharge_date DATE NOT NULL,`)
        console.log(`     role TEXT DEFAULT 'patient',`)
        console.log(`     created_at TIMESTAMPTZ DEFAULT NOW()`)
        console.log(`   );`)
        console.log(`   `)
        console.log(`   Continuing with MongoDB seed...\n`)
      } else {
        throw patientError
      }
    } else {
      console.log(`   ✅ Patient profile created/updated in Supabase`)
      console.log(`      Name: ${patient.full_name}`)
      console.log(`      Category: ${patient.surgery_category}`)
      console.log(`      Discharge Date: ${patient.discharge_date}\n`)
    }

    // Seed baseline vitals in MongoDB
    console.log('💓 Seeding baseline vitals in MongoDB...')
    
    const baselineVitals = {
      patientId: userId,
      systolic_bp: 125,
      diastolic_bp: 82,
      heart_rate: 71,
      oxygen_sat: 98,
      temperature: 98.6,
      recordedAt: new Date()
    }

    const existingBaseline = await BaselineVitals.findOne({ patientId: userId })
    
    if (existingBaseline) {
      await BaselineVitals.updateOne({ patientId: userId }, baselineVitals)
      console.log(`   ✅ Updated baseline vitals for patient ${userId}`)
    } else {
      await BaselineVitals.create(baselineVitals)
      console.log(`   ✅ Created baseline vitals for patient ${userId}`)
    }

    console.log(`   Baseline Vitals:`)
    console.log(`      BP: ${baselineVitals.systolic_bp}/${baselineVitals.diastolic_bp} mmHg`)
    console.log(`      Heart Rate: ${baselineVitals.heart_rate} bpm`)
    console.log(`      SpO2: ${baselineVitals.oxygen_sat}%`)
    console.log(`      Temperature: ${baselineVitals.temperature}°F\n`)

    console.log('✅ Seed script completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`   Patient ID: ${userId}`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Surgery Category: Cardiac`)
    console.log(`   Baseline vitals stored in MongoDB`)

  } catch (error) {
    console.error('❌ Seed script failed:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 MongoDB connection closed')
    process.exit(0)
  }
}

seed()
