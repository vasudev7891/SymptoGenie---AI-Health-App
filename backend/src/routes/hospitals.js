import express from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// Mock data
const mockHospitals = [
  { hospitalId: '1', name: 'Apollo Hospitals Delhi', address: 'Sector 25, Noida', location: { lat: 28.5921, lng: 77.3708 }, rating: 4.8, reviewCount: 2340, phone: '+91-120-4040404', specializations: ['Cardiology', 'Neurology'], emergencyServices: true },
  { hospitalId: '2', name: 'Max Healthcare Delhi', address: 'Saket, Delhi', location: { lat: 28.5244, lng: 77.1996 }, rating: 4.7, reviewCount: 1890, phone: '+91-11-47444444', specializations: ['Orthopedics', 'Gastroenterology'], emergencyServices: true },
  { hospitalId: '3', name: 'Fortis Escorts Heart Institute', address: 'Okhla, Delhi', location: { lat: 28.5355, lng: 77.2531 }, rating: 4.9, reviewCount: 2120, phone: '+91-11-41334444', specializations: ['Cardiology'], emergencyServices: true },
  { hospitalId: '4', name: 'Dr. Ram Manohar Lohia Hospital', address: 'Baba Kharak Singh Marg, New Delhi', location: { lat: 28.6263, lng: 77.1989 }, rating: 4.5, reviewCount: 4120, phone: '+91-11-23365525', specializations: ['General Medicine', 'Emergency'], emergencyServices: true },
  { hospitalId: '5', name: 'Sir Ganga Ram Hospital', address: 'Old Rajinder Nagar, New Delhi', location: { lat: 28.6381, lng: 77.1895 }, rating: 4.6, reviewCount: 3050, phone: '+91-11-25750000', specializations: ['Neurology', 'Oncology'], emergencyServices: true },
  { hospitalId: '6', name: 'LNJP Hospital', address: 'Jawaharlal Nehru Marg, New Delhi', location: { lat: 28.6385, lng: 77.2346 }, rating: 4.2, reviewCount: 1540, phone: '+91-11-23236000', specializations: ['Orthopedics', 'Pediatrics'], emergencyServices: true }
];

const mockDoctors = [
  { doctorId: '1', name: 'Dr. Rajesh Kumar', specialization: 'Cardiology', hospital: 'Apollo', rating: 4.9, reviewCount: 456 },
  { doctorId: '2', name: 'Dr. Priya Sharma', specialization: 'Neurology', hospital: 'Apollo', rating: 4.8, reviewCount: 389 },
  { doctorId: '3', name: 'Dr. Amit Patel', specialization: 'Orthopedics', hospital: 'Max', rating: 4.7, reviewCount: 423 },
];

function calculateDist(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get recommendations
router.get('/recommend', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: { hospitals: mockHospitals, doctors: mockDoctors, count: mockHospitals.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error: error.message });
  }
});

// Get nearby hospitals
router.get('/nearby', optionalAuth, async (req, res) => {
  try {
    const { lat = 28.6139, lng = 77.209, radius = 5000 } = req.query;
    
    // Try using Google Places API if a key is available
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (googleApiKey && googleApiKey.startsWith('AIza')) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
          params: {
            location: `${lat},${lng}`,
            radius: radius,
            type: 'hospital',
            key: googleApiKey
          }
        });
        
        if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
          const googleHospitals = (response.data.results || []).map(place => ({
            hospitalId: place.place_id,
            name: place.name,
            address: place.vicinity,
            location: place.geometry.location,
            rating: place.rating || 0,
            reviewCount: place.user_ratings_total || 0,
            phone: 'N/A',
            specializations: ['General Medicine'],
            emergencyServices: true
          }));
          
          return res.json({
            success: true,
            data: { count: googleHospitals.length, hospitals: googleHospitals }
          });
        }
      } catch (err) {
        console.error('Google Places API error:', err.message);
      }
    }

    // Fallback to mock data if API fails or no key is provided
    const filtered = mockHospitals.filter(h => {
      const dist = calculateDist(lat, lng, h.location.lat, h.location.lng) * 1000;
      return dist <= radius;
    });

    res.json({
      success: true,
      data: { count: filtered.length, hospitals: filtered }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error: error.message });
  }
});

export default router;
