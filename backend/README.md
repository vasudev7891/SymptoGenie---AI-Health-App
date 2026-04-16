# SymptoGenie Backend

AI-powered healthcare assistant backend built with Node.js and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Update `.env` with your configuration
- MongoDB URI
- JWT Secret
- API Keys (OpenAI, Google Maps, etc.)

5. Start development server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
src/
├── routes/        # API endpoints
├── controllers/   # Business logic
├── models/       # MongoDB schemas
├── middleware/   # Auth, error handling
├── services/     # External API integrations
└── server.js     # App entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Symptoms
- `POST /api/symptoms/analyze` - Analyze symptoms
- `GET /api/symptoms/history/:userId` - Get history

### Hospitals
- `GET /api/hospitals/recommend` - Get recommendations
- `GET /api/hospitals/nearby` - Get nearby hospitals

### Reports
- `POST /api/reports/upload` - Upload report
- `POST /api/reports/analyze` - Analyze report
- `GET /api/reports/:userId` - Get user reports

## 🔐 Environment Variables

See `.env.example` for all required variables.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload
- **axios** - HTTP client
- **tesseract.js** - OCR

## 🧪 Testing

```bash
npm test
```

## 📝 Notes

- Ensure MongoDB is running before starting the server
- Update all API keys in `.env` before deployment
- Use HTTPS in production

## 📚 Documentation

See `../docs/` for detailed documentation.
