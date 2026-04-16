import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  fileSize: Number,
  reportType: {
    type: String,
    enum: ['blood_test', 'x-ray', 'ct_scan', 'mri', 'ultrasound', 'other'],
    default: 'other'
  },
  analysis: {
    extractedText: String,
    abnormalValues: [{
      parameter: String,
      value: mongoose.Schema.Types.Mixed,
      unit: String,
      normalRange: String,
      status: {
        type: String,
        enum: ['low', 'high', 'abnormal', 'normal']
      }
    }],
    summary: String,
    advice: String,
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  analyzedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexes
reportSchema.index({ userId: 1, uploadedAt: -1 });
reportSchema.index({ status: 1 });

export default mongoose.model('Report', reportSchema);
