import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualification: [String],
  hospital: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: String
  },
  contact: {
    phone: String,
    email: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  availableSlots: [String],
  consultationFee: Number,
  isVerified: {
    type: Boolean,
    default: false
  },
  bio: String,
  experienceYears: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for geospatial queries
doctorSchema.index({ 'location.lat': 1, 'location.lng': 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ isVerified: 1 });

export default mongoose.model('Doctor', doctorSchema);
