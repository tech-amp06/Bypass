import mongoose from 'mongoose'

const riskAnalyticsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  averageScore: Number,
  maxScore: Number,
  level3Count: Number,
  flagCount: Number,
  logCount: Number
}, {
  timestamps: true
})

export default mongoose.model('RiskAnalytics', riskAnalyticsSchema)
