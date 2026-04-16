# API Documentation

## Base URL
```
http://localhost:5000/api
```

All responses are in JSON format.

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "age": 30,
  "gender": "male"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login User
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## Symptom Analysis Endpoints

### Analyze Symptoms
**POST** `/symptoms/analyze`

**Headers**: Authorization: Bearer `<token>`

Request body:
```json
{
  "symptoms": ["chest pain", "shortness of breath", "fatigue"],
  "age": 45,
  "gender": "male",
  "medicalHistory": ["Diabetes"]
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "analysisId": "507f1f77bcf86cd799439011",
    "diseases": [
      {
        "name": "Angina",
        "confidence": 85,
        "severity": "high",
        "advice": "Seek immediate medical attention",
        "specialization": "Cardiology"
      },
      {
        "name": "Asthma",
        "confidence": 60,
        "severity": "medium",
        "advice": "Consult a pulmonologist",
        "specialization": "Pulmonology"
      }
    ],
    "isEmergency": true,
    "emergencyAdvice": "Call emergency services immediately"
  }
}
```

---

### Get Symptom History
**GET** `/symptoms/history`

**Headers**: Authorization: Bearer `<token>`

Query parameters:
- `limit`: 10 (default)
- `skip`: 0 (default)

Response (200):
```json
{
  "success": true,
  "data": {
    "total": 5,
    "history": [
      {
        "analysisId": "507f1f77bcf86cd799439011",
        "symptoms": ["chest pain"],
        "isEmergency": true,
        "createdAt": "2024-03-20T10:30:00Z"
      }
    ]
  }
}
```

---

## Hospital Recommendation Endpoints

### Get Hospital Recommendations
**GET** `/hospitals/recommend`

**Headers**: Authorization: Bearer `<token>`

Query parameters:
- `analysisId`: ID from symptom analysis (required)
- `lat`: User latitude (optional)
- `lng`: User longitude (optional)

Response (200):
```json
{
  "success": true,
  "data": {
    "hospitals": [
      {
        "hospitalId": "507f1f77bcf86cd799439011",
        "name": "Apollo Hospitals",
        "specialization": "Cardiology",
        "distance": 2.5,
        "rating": 4.8,
        "reviewCount": 1250,
        "address": "Sarita Vihar, New Delhi",
        "phone": "+91-11-2746-8030",
        "doctors": [
          {
            "doctorId": "507f1f77bcf86cd799439012",
            "name": "Dr. Sharma",
            "rating": 4.9,
            "consultationFee": 500,
            "available": true
          }
        ]
      }
    ]
  }
}
```

---

### Get Nearby Hospitals
**GET** `/hospitals/nearby`

Query parameters:
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: 5000 (default, in meters)
- `specialization`: Optional filter

Response (200):
```json
{
  "success": true,
  "data": {
    "count": 15,
    "hospitals": [
      {
        "hospitalId": "507f1f77bcf86cd799439011",
        "name": "Apollo Hospitals",
        "distance": 2.5,
        "rating": 4.8,
        "specializations": ["Cardiology", "Orthopedics"],
        "emergencyServices": true
      }
    ]
  }
}
```

---

## Medical Report Endpoints

### Upload Report
**POST** `/reports/upload`

**Headers**: 
- Authorization: Bearer `<token>`
- Content-Type: multipart/form-data

Form data:
- `file`: PDF or image file (required, max 10MB)
- `reportType`: Optional (e.g., "blood test", "x-ray")

Response (200):
```json
{
  "success": true,
  "data": {
    "reportId": "507f1f77bcf86cd799439011",
    "fileName": "blood_test_2024.pdf",
    "uploadedAt": "2024-03-20T10:30:00Z",
    "status": "processing"
  }
}
```

---

### Analyze Report
**POST** `/reports/analyze`

**Headers**: Authorization: Bearer `<token>`

Request body:
```json
{
  "reportId": "507f1f77bcf86cd799439011"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "reportId": "507f1f77bcf86cd799439011",
    "extractedText": "Full blood count...",
    "abnormalValues": [
      {
        "parameter": "Hemoglobin",
        "value": 7.2,
        "unit": "g/dL",
        "normalRange": "12.0-17.5",
        "status": "low"
      }
    ],
    "summary": "Low hemoglobin levels detected. May indicate anemia.",
    "advice": "Consult a hematologist",
    "confidenceScore": 92,
    "analyzedAt": "2024-03-20T10:35:00Z"
  }
}
```

---

### Get User Reports
**GET** `/reports`

**Headers**: Authorization: Bearer `<token>`

Query parameters:
- `limit`: 10 (default)
- `skip`: 0 (default)

Response (200):
```json
{
  "success": true,
  "data": {
    "total": 3,
    "reports": [
      {
        "reportId": "507f1f77bcf86cd799439011",
        "fileName": "blood_test_2024.pdf",
        "uploadedAt": "2024-03-20T10:30:00Z",
        "analyzed": true,
        "summary": "Low hemoglobin levels detected"
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Missing or invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

---

## Rate Limiting

All endpoints are rate-limited:
- **Login/Register**: 5 requests per 15 minutes per IP
- **General endpoints**: 100 requests per 15 minutes per user

Exceeding limits returns 429 (Too Many Requests).

---

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days.
