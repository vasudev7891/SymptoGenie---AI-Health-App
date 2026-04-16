# Database Schema Documentation

## Collections Overview

### 1. Users Collection
Stores user account information and health data.

```javascript
db.users.insertOne({
  _id: ObjectId(),
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$...", // bcrypt hashed
  phone: "+1234567890",
  age: 30,
  gender: "male",
  location: {
    lat: 28.6139,
    lng: 77.2090
  },
  medicalHistory: ["Diabetes", "Heart Disease"],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Indexes:**
- `email` (unique)
- `createdAt`

---

### 2. SymptomAnalysis Collection
Stores symptom analysis results and AI predictions.

```javascript
db.symptomAnalyses.insertOne({
  _id: ObjectId(),
  userId: ObjectId("user_id"),
  symptoms: ["chest pain", "shortness of breath", "fatigue"],
  aiAnalysis: {
    diseases: [
      {
        name: "Angina",
        confidence: 85,
        severity: "high",
        advice: "Seek immediate medical attention",
        specialization: "Cardiology"
      },
      {
        name: "Asthma",
        confidence: 60,
        severity: "medium",
        advice: "Consult a pulmonologist",
        specialization: "Pulmonology"
      }
    ],
    recommendation: "Emergency consultation required",
    isEmergency: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Indexes:**
- `userId`
- `createdAt`
- `isEmergency`

---

### 3. Reports Collection
Stores uploaded medical reports and analysis.

```javascript
db.reports.insertOne({
  _id: ObjectId(),
  userId: ObjectId("user_id"),
  fileName: "blood_test_2024.pdf",
  fileUrl: "https://storage.example.com/reports/...",
  mimeType: "application/pdf",
  analysis: {
    extractedText: "Full blood count: RBC 4.5...",
    abnormalValues: [
      {
        parameter: "Hemoglobin",
        value: 7.2,
        unit: "g/dL",
        normalRange: "12.0-17.5",
        status: "low"
      }
    ],
    summary: "Low hemoglobin levels detected. May indicate anemia.",
    advice: "Consult a hematologist. Consider iron supplement consultation.",
    confidenceScore: 92
  },
  uploadedAt: new Date(),
  analyzedAt: new Date()
})
```

**Indexes:**
- `userId`
- `uploadedAt`
- `analyzedAt`

---

### 4. Doctors Collection
Stores doctor information for recommendations.

```javascript
db.doctors.insertOne({
  _id: ObjectId(),
  name: "Dr. Sharma",
  specialization: "Cardiology",
  qualification: ["MBBS", "MD (Cardiology)"],
  hospital: "Apollo Hospitals",
  location: {
    lat: 28.5355,
    lng: 77.1983,
    address: "New Delhi, India"
  },
  contact: {
    phone: "+91-11-2746-8030",
    email: "dr.sharma@apollo.com"
  },
  rating: 4.8,
  reviewCount: 245,
  availability: true,
  availableSlots: ["10:00", "14:30", "16:00"],
  consultationFee: 500,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Indexes:**
- `specialization`
- `hospital`
- `location`
- `rating`
- `isVerified`

---

### 5. Hospitals Collection
Stores hospital information.

```javascript
db.hospitals.insertOne({
  _id: ObjectId(),
  name: "Apollo Hospitals",
  location: {
    lat: 28.5355,
    lng: 77.1983,
    address: "Sarita Vihar, New Delhi"
  },
  contact: {
    phone: "+91-11-2746-8030",
    website: "www.apollohospitals.com",
    email: "info@apollo.com"
  },
  specializations: ["Cardiology", "Orthopedics", "Neurology"],
  beds: 500,
  rating: 4.7,
  reviewCount: 1250,
  emergencyServices: true,
  ambulanceAvailable: true,
  operatingHours: {
    open: "00:00",
    close: "23:59"
  },
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Indexes:**
- `location` (geo index)
- `specializations`
- `rating`

---

### 6. Appointments Collection
Stores appointment bookings (for future enhancement).

```javascript
db.appointments.insertOne({
  _id: ObjectId(),
  userId: ObjectId("user_id"),
  doctorId: ObjectId("doctor_id"),
  hospitalId: ObjectId("hospital_id"),
  appointmentDate: new Date("2024-04-15T10:00:00"),
  status: "confirmed", // pending, confirmed, completed, cancelled
  notes: "Follow-up consultation",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Indexes:**
- `userId`
- `doctorId`
- `appointmentDate`
- `status`

---

### 7. ChatHistory Collection
Stores chat interactions with AI assistant.

```javascript
db.chatHistories.insertOne({
  _id: ObjectId(),
  userId: ObjectId("user_id"),
  messages: [
    {
      role: "user",
      content: "What does low hemoglobin mean?",
      timestamp: new Date()
    },
    {
      role: "assistant",
      content: "Low hemoglobin means...",
      timestamp: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Indexes:**
- `userId`
- `createdAt`

---

## Key Design Decisions

1. **Embedding vs References**
   - Used references (ObjectId) for most relationships
   - Embedded AI analysis directly in SymptomAnalysis for fast queries

2. **Indexing Strategy**
   - Indexed frequently queried fields (userId, createdAt)
   - Geo-index on hospital/doctor locations for nearby queries
   - Unique constraint on email

3. **Data Types**
   - Stored sensitive data (passwords) hashed
   - Geographic coordinates as lat/lng objects
   - Dates as ISO 8601 format via Date type

4. **Future Scalability**
   - Designed for sharding on `userId`
   - Can implement TTL indexing on chat history
   - Ready for denormalization if needed

---

## Query Examples

### Find nearby hospitals
```javascript
db.hospitals.find(
  { location: { $near: { $geometry: { type: "Point", coordinates: [77.2090, 28.6139] }, $maxDistance: 5000 } } }
)
```

### Get user's recent symptom analyses
```javascript
db.symptomAnalyses
  .find({ userId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(10)
```

### Find doctors by specialization
```javascript
db.doctors
  .find({ specialization: "Cardiology", rating: { $gte: 4.5 } })
  .sort({ rating: -1 })
```

---

## Constraints & Validation

- Email must be unique and valid
- Age must be between 1-150
- Rating must be between 0-5
- Phone numbers should follow international format
- Confidence scores between 0-100
