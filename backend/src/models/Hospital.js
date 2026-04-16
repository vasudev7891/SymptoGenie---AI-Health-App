import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    address: {
      type: String,
      required: true
    }
  },
  contact: {
    phone: String,
    website: String,
    email: String
  },
  specializations: [String],
  beds: Number,
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
  emergencyServices: {
    type: Boolean,
    default: false
  },
  ambulanceAvailable: {
    type: Boolean,
    default: false
  },
  operatingHours: {
    open: {
      type: String,
      default: '00:00'
    },
    close: {
      type: String,
      default: '23:59'
    }
  },
  imageUrl: String,
  description: String,
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
hospitalSchema.index({ 'location.lat': 1, 'location.lng': 1 });
hospitalSchema.index({ specializations: 1 });
hospitalSchema.index({ rating: -1 });
hospitalSchema.index({ emergencyServices: 1 });

export default mongoose.model('Hospital', hospitalSchema);
