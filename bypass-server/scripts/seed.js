// // ... (keep your imports and MongoDB schema as they are)

// async function seed() {
//   try {
//     console.log('🌱 Starting seed script...\n');
//     await connectMongoDB();

//     // 1. Authenticate / Create User in Supabase Auth
//     const email = 'alex.chen@demo.com';
//     const password = 'Demo123!@#';
//     const { data: existingUsers } = await supabase.auth.admin.listUsers();
//     const existingUser = existingUsers?.users?.find(u => u.email === email);
    
//     let userId = existingUser ? existingUser.id : null;
//     if (!existingUser) {
//       const { data: authData } = await supabase.auth.admin.createUser({
//         email, password, email_confirm: true
//       });
//       userId = authData.user.id;
//       console.log(` ✅ Created auth user: ${email}`);
//     }

//     // 2. UPDATED: Syncing with 'users' table and adding 'threats'
//     console.log('📝 Updating user profile in Supabase users table...');
//     const userData = {
//       id: userId,
//       email,
//       full_name: 'Alex Chen',
//       surgery_category: 'cardiac',
//       admission_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
//       discharge_date: new Date().toISOString(),
//       is_active: true,
//       password: password, // Storing in public.users as per your schema
//       threats: ['Heart Failure', 'Arrhythmia', 'Cardiac Distress'] // FOR PREDICTIVE ENGINE
//     };

//     // Note: Table name changed from 'patients' to 'users'
//     const { error: userError } = await supabase
//       .from('users') 
//       .upsert(userData, { onConflict: 'id' });

//     if (userError) throw userError;
//     console.log(' ✅ User profile synced with predictive threats');

//     // 3. Seed baseline vitals in MongoDB
//     const baselineVitals = {
//       patientId: userId,
//       systolic_bp: 125,
//       diastolic_bp: 82,
//       heart_rate: 71,
//       oxygen_sat: 98,
//       temperature: 98.6,
//       recordedAt: new Date()
//     };

//     await BaselineVitals.findOneAndUpdate(
//       { patientId: userId }, 
//       baselineVitals, 
//       { upsert: true, new: true }
//     );
//     console.log(' ✅ Baseline vitals stored in MongoDB');

//     // ... (rest of the logging)
//   } catch (error) {
//     console.error('❌ Seed script failed:', error);
//     process.exit(1);
//   } finally {
//     await mongoose.connection.close();
//     process.exit(0);
//   }
// }

// seed();



import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { connectMongoDB } from '../config/database.js';
import { supabase } from '../config/supabase.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

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
});

const BaselineVitals = mongoose.models.BaselineVitals || mongoose.model('BaselineVitals', BaselineVitalsSchema);

async function seed() {
  try {
    console.log('🌱 Starting seed script...\n');

    // 1. Connect to MongoDB
    await connectMongoDB();
    console.log('✅ MongoDB connection verified\n');

    // 2. Create/Get Auth User in Supabase
    const email = 'alex.chen@demo.com';
    const password = 'Demo123!@#';
    
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let userId;
    const existingUser = authUsers.users.find(u => u.email === email);

    if (existingUser) {
      console.log(`   User ${email} already exists, using existing ID`);
      userId = existingUser.id;
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (authError) throw authError;
      userId = authData.user.id;
      console.log(`   ✅ Created auth user: ${email} (${userId})`);
    }

    // // 3. Sync Profile to 'users' table with Predictive Threats
    // console.log('📝 Syncing profile to Supabase users table...');
    // const userData = {
    //   id: userId,
    //   email,
    //   full_name: 'Alex Chen',
    //   surgery_category: 'cardiac',
    //   discharge_date: new Date().toISOString().split('T')[0],
    //   role: 'patient',

// Sync Profile to 'users' table using ONLY existing columns
    console.log('📝 Syncing profile to Supabase users table...');
    const userData = {
      id: userId,
      email,
      full_name: 'Alex Chen',
      surgery_category: 'cardiac',
      discharge_date: new Date().toISOString().split('T')[0],
      // REMOVED 'role' as it does not exist in your schema
      threats: ['Heart Failure', 'Arrhythmia', 'Cardiac Distress'] 
    };
    //   // These threats trigger the 1.5x multiplier in riskEngine.js
    //   threats: ['Heart Failure', 'Arrhythmia', 'Cardiac Distress'] 
    // };

    const { error: upsertError } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' });

    if (upsertError) throw upsertError;
    console.log('   ✅ User profile synced with predictive threats\n');

    // 4. Seed Baseline Vitals in MongoDB
    console.log('💓 Seeding baseline vitals in MongoDB...');
    const baselineData = {
      patientId: userId,
      systolic_bp: 125,
      diastolic_bp: 82,
      heart_rate: 71,
      oxygen_sat: 98,
      temperature: 98.6
    };

    await BaselineVitals.findOneAndUpdate(
      { patientId: userId },
      baselineData,
      { upsert: true, new: true }
    );
    console.log(`   ✅ Baseline stored: 125/82 mmHg, 71 bpm, 98% SpO2\n`);

    console.log('✅ Seed script completed successfully!');

  } catch (error) {
    console.error('❌ Seed script failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

seed();