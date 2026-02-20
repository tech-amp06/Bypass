import mongoose from 'mongoose'

const baselineVitalsSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    systolic_bp: { type: Number, required: true },
    diastolic_bp: { type: Number, required: true },
    heart_rate: { type: Number, required: true },
    oxygen_sat: { type: Number, required: true },
    temperature: { type: Number },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model('BaselineVitals', baselineVitalsSchema)

