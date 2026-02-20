import mongoose from 'mongoose'

const multimodalDataSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['wound_photo', 'voice_transcript'],
    required: true
  },
  storageUrl: {
    type: String,
    required: true
  },
  analysis: {
    // For wound photos
    redness: Number,
    swelling: Number,
    discharge: Boolean,
    infection_signs: Boolean,
    severity_estimate: Number,
    
    // For voice transcripts
    parsed_symptoms: [{
      name: String,
      severity: Number
    }],
    transcript: String
  },
  geminiResponse: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.model('MultimodalData', multimodalDataSchema)
