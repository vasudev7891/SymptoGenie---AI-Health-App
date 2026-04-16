import mongoose from 'mongoose';

const symptomAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: {
    type: [String],
    required: [true, 'Please provide symptoms'],
    default: []
  },
  userInfo: {
    age: Number,
    gender: String,
    medicalHistory: [String]
  },
  aiAnalysis: {
    diseases: [{
      name: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      advice: String,
      specialization: String
    }],
    recommendation: String,
    isEmergency: {
      type: Boolean,
      default: false
    },
    emergencyAdvice: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes
symptomAnalysisSchema.index({ userId: 1, createdAt: -1 });
symptomAnalysisSchema.index({ isEmergency: 1 });

export default mongoose.model('SymptomAnalysis', symptomAnalysisSchema);
