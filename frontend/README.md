# SymptoGenie Frontend

React-based frontend for the AI-powered healthcare assistant.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Navigate to frontend directory
```bash
cd frontend
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
- Backend API URL
- Google Maps API Key

5. Start development server
```bash
npm run dev
```

App will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/    # Reusable React components
├── pages/        # Page components
├── services/     # API integration
├── hooks/        # Custom React hooks
├── context/      # Context API
├── utils/        # Utility functions
├── App.jsx       # Main app component
└── main.jsx      # Entry point
```

## 🎨 Key Components

- **SymptomChecker** - User input and disease prediction
- **HospitalRecommendation** - Map view and hospital listings
- **ReportAnalyzer** - File upload and report analysis
- **ChatAssistant** - Health Q&A chatbot
- **Navbar** - Navigation and user menu

## 📦 Dependencies

- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Google Maps** - Map integration

## 🏗️ Build & Deployment

### Build for production
```bash
npm run build
```

Output is in `dist/` folder.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🔌 API Integration

All API calls go through `src/services/api.js`. Update the base URL in your `.env` file.

## 🎨 Styling

Uses Tailwind CSS. Configure in `tailwind.config.js` (to be created).

## 📝 Notes

- Ensure backend is running on port 5000
- Update Google Maps API key before deployment
- Use HTTPS in production

## 📚 Documentation

See `../docs/` for detailed documentation.
