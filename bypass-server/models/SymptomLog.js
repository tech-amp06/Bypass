import mongoose from 'mongoose'

const symptomLogSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  symptoms: [{
    name: { type: String, required: true },
    severity: { type: Number, min: 0, max: 10, required: true }
  }],
  vitals: {
    systolic_bp: Number,
    diastolic_bp: Number,
    heart_rate: Number,
    oxygen_sat: Number,
    temperature: Number
  },
  riskScore: {
    score: Number,
    level: { type: Number, enum: [1, 2, 3] },
    breakdown: {
      severity_component: Number,
      relevance_component: Number,
      deviation_component: Number
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  source: {
    type: String,
    enum: ['form', 'voice', 'photo'],
    default: 'form'
  }
}, {
  timestamps: true
})

export default mongoose.model('SymptomLog', symptomLogSchema)
