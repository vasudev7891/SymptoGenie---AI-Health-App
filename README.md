# SymptoGenie - AI-Powered Healthcare Assistant 🩺✨

**Your intelligent health companion powered by advanced AI**

Transform how you understand your health with SymptoGenie - an AI-driven healthcare assistant that helps you analyze symptoms, find the right medical professionals, and understand your health reports.

![SymptoGenie Overview](https://img.shields.io/badge/Status-Development-yellow.svg)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## 🎯 Features

- **🤖 AI Symptom Analyzer** - Get instant disease predictions based on your symptoms
- **🏥 Smart Hospital Finder** - Discover nearby hospitals and specialists with ratings
- **📋 Medical Report Analyzer** - Upload and understand your medical reports instantly
- **💬 Health Chat Assistant** - Ask health-related questions anytime
- **🚨 Emergency Detection** - Immediate alerts for critical symptoms
- **📊 Health Metrics** - Track your health history and patterns

## 📁 Project Structure

This is a full-stack application organized into three main directories:

```
SymptoGenie/
├── backend/              # Node.js/Express backend API
├── frontend/             # React/Vite web application
└── docs/                 # Detailed documentation
```

## 🚀 Quick Start

Follow these steps to get the project up and running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SymptoGenie.git
cd SymptoGenie
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create an environment file:
```bash
cp .env.example .env
```
_Update the `.env` file with your configuration (e.g., MongoDB URI, API keys).*

Start the backend server:
```bash
npm run dev
```
_The server will start on http://localhost:5000_

### 3. Setup the Frontend

Open a new terminal window:
```bash
cd frontend
npm install
```

Create an environment file:
```bash
cp .env.example .env
```
_Update `.env` with backend URL (`VITE_API_URL=http://localhost:5000/api`) and Maps API key if needed._

Start the frontend server:
```bash
npm run dev
```
_The application will run on http://localhost:3000_

## 🔑 Environment Variables

To protect sensitive keys, you must configure the `.env` files locally. **Never commit your `.env` files to Git.** 

### Backend `.env`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `OPENAI_API_KEY`: Key for AI-driven features (OpenAI)
- `GOOGLE_GEMINI_API_KEY`: Alternative AI API engine
- `GOOGLE_MAPS_API_KEY`: Google Maps key for hospital routing

### Frontend `.env`
- `VITE_API_URL`: Path to your backend (e.g. `http://localhost:5000/api`)
- `VITE_GOOGLE_MAPS_API_KEY`: (Optional) Expose Maps to frontend safely via Vite.

*(Reference `.env.example` inside the `backend` and `frontend` folders for more details).*

## 📚 Documentation

Detailed documentation can be found in the `docs` and other root-level markdown files:
- [QUICK_START.md](./docs/QUICK_START.md) - Deep dive guide into launching the project and APIs.
- Additional technical docs (such as API documentation and setup guides) are available in the `/docs/` folder.

## 🤝 Contributing

We welcome contributions!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
