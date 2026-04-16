import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Doctor from './src/models/Doctor.js';
import Hospital from './src/models/Hospital.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/symptogenie');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Hospital.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create test users
    const testUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // Will be hashed by the model
      phone: '+1-555-0123',
      age: 35,
      gender: 'male',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India'
      },
      medicalHistory: ['Hypertension']
    });

    const testUser2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+1-555-0124',
      age: 28,
      gender: 'female',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Mumbai, India'
      },
      medicalHistory: []
    });

    await testUser.save();
    await testUser2.save();
    console.log('✅ Created test users');

    // Create test hospitals
    const hospital1 = new Hospital({
      name: 'Apollo Hospitals Delhi',
      location: {
        lat: 28.5355,
        lng: 77.1983,
        address: 'Sarita Vihar, New Delhi'
      },
      contact: {
        phone: '+91-11-2746-8030',
        website: 'www.apollohospitals.com',
        email: 'delhi@apollo.com'
      },
      specializations: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
      beds: 500,
      rating: 4.8,
      reviewCount: 1250,
      emergencyServices: true,
      ambulanceAvailable: true
    });

    const hospital2 = new Hospital({
      name: 'Max HealthCare Mumbai',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Bandra, Mumbai'
      },
      contact: {
        phone: '+91-22-6867-1234',
        website: 'www.maxhealthcare.in',
        email: 'mumbai@max.com'
      },
      specializations: ['Cardiology', 'Pediatrics', 'Gastroenterology'],
      beds: 350,
      rating: 4.7,
      reviewCount: 890,
      emergencyServices: true,
      ambulanceAvailable: true
    });

    await hospital1.save();
    await hospital2.save();
    console.log('✅ Created test hospitals');

    // Create test doctors
    const doctor1 = new Doctor({
      name: 'Dr. Rajesh Sharma',
      specialization: 'Cardiology',
      qualification: ['MBBS', 'MD (Cardiology)'],
      hospital: 'Apollo Hospitals Delhi',
      location: {
        lat: 28.5355,
        lng: 77.1983,
        address: 'Sarita Vihar, New Delhi'
      },
      contact: {
        phone: '+91-11-2746-8030 ext. 5001',
        email: 'dr.sharma@apollo.com'
      },
      rating: 4.9,
      reviewCount: 450,
      availability: true,
      availableSlots: ['10:00', '14:30', '16:00'],
      consultationFee: 1000,
      isVerified: true,
      experienceYears: 15
    });

    const doctor2 = new Doctor({
      name: 'Dr. Priya Patel',
      specialization: 'Orthopedics',
      qualification: ['MBBS', 'MS (Orthopedics)'],
      hospital: 'Apollo Hospitals Delhi',
      location: {
        lat: 28.5355,
        lng: 77.1983,
        address: 'Sarita Vihar, New Delhi'
      },
      contact: {
        phone: '+91-11-2746-8030 ext. 5002',
        email: 'dr.patel@apollo.com'
      },
      rating: 4.7,
      reviewCount: 320,
      availability: true,
      availableSlots: ['11:00', '15:00'],
      consultationFee: 800,
      isVerified: true,
      experienceYears: 12
    });

    const doctor3 = new Doctor({
      name: 'Dr. Amit Kumar',
      specialization: 'Pediatrics',
      qualification: ['MBBS', 'MD (Pediatrics)'],
      hospital: 'Max HealthCare Mumbai',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Bandra, Mumbai'
      },
      contact: {
        phone: '+91-22-6867-1234 ext. 6001',
        email: 'dr.kumar@max.com'
      },
      rating: 4.8,
      reviewCount: 560,
      availability: true,
      availableSlots: ['09:00', '12:00', '17:00'],
      consultationFee: 700,
      isVerified: true,
      experienceYears: 10
    });

    await doctor1.save();
    await doctor2.save();
    await doctor3.save();
    console.log('✅ Created test doctors');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('🧪 Test Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123\n');
    console.log('   Email: jane@example.com');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
