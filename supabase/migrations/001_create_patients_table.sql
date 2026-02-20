-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  surgery_category TEXT NOT NULL CHECK (surgery_category IN ('cardiac', 'ortho', 'general')),
  discharge_date DATE NOT NULL,
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'hospital_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Create index on surgery_category for filtering
CREATE INDEX IF NOT EXISTS idx_patients_surgery_category ON patients(surgery_category);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Patients can read their own data
CREATE POLICY "Patients can view own profile"
  ON patients FOR SELECT
  USING (auth.uid() = id);

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY "Service role full access"
  ON patients FOR ALL
  USING (auth.role() = 'service_role');
