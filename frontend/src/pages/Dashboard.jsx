import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: '🔍',
      title: 'Symptom Checker',
      description: 'Analyze your symptoms and get AI-powered disease predictions with confidence scores',
      color: 'emerald',
      path: '/symptom-checker'
    },
    {
      icon: '🏥',
      title: 'Find Hospitals',
      description: 'Discover nearby hospitals and specialists with ratings and availability',
      color: 'blue',
      path: '/hospitals'
    },
    {
      icon: '📋',
      title: 'Report Analyzer',
      description: 'Upload medical reports and get instant AI analysis with insights',
      color: 'purple',
      path: '/reports'
    },
    {
      icon: '💬',
      title: 'Chat Assistant',
      description: 'Ask health-related questions and get personalized advice',
      color: 'pink',
      path: '/chat'
    },
  ];

  const quickLinks = [
    { icon: '📚', label: 'Learn Resources', path: '/learn' },
    { icon: '📖', label: 'Documentation', path: '/docs' },
    { icon: '🆘', label: 'Support & FAQ', path: '/support' },
    { icon: '👤', label: 'My Profile', path: '/profile' },
  ];

  const stats = [
    { label: 'Analyses Done', value: '0', icon: '📊' },
    { label: 'Reports Uploaded', value: '0', icon: '📄' },
    { label: 'Hospitals Nearby', value: '12+', icon: '🏨' },
    { label: 'Specialists', value: '100+', icon: '👨‍⚕️' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      pink: 'bg-pink-50 border-pink-200 hover:border-pink-400',
    };
    return colors[color] || colors.emerald;
  };

  const getButtonColor = (color) => {
    const colors = {
      emerald: 'bg-emerald-600 hover:bg-emerald-700',
      blue: 'bg-blue-600 hover:bg-blue-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      pink: 'bg-pink-600 hover:bg-pink-700',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Welcome,<br/>
                <span className="bg-gradient-to-r from-cyan-200 to-emerald-100 bg-clip-text text-transparent">
                  {user?.name || 'User'}
                </span>! 👋
              </h1>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                Your AI-powered healthcare assistant is ready to help you understand your health better. 
                Check your symptoms, find the right doctors, analyze reports, and get personalized health advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/symptom-checker')}
                  className="bg-white text-emerald-600 font-semibold px-8 py-4 rounded-lg hover:bg-emerald-50 hover:scale-105 transition-all shadow-lg transform duration-200"
                >
                  Get Started 🚀
                </button>
                <button 
                  onClick={() => navigate('/learn')}
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-200 transform"
                >
                  Learn More 📚
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="text-center animate-bounce" style={{animationDuration: '3s'}}>
                <div className="text-9xl mb-4">💊</div>
                <p className="text-emerald-100 text-xl font-semibold">Your health matters.</p>
                <p className="text-emerald-100">We're here to help you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
              style={{animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`}}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Core Features</h2>
            <p className="text-gray-600 mt-2 text-lg">Everything you need for your healthcare journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onClick={() => navigate(feature.path)}
                className={`rounded-xl border-2 p-6 cursor-pointer transition-all transform hover:scale-110 hover:shadow-2xl duration-300 ${getColorClasses(feature.color)}`}
                style={{animation: `slideUp 0.5s ease-out ${idx * 0.1 + 0.4}s both`}}
              >
                <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2 h-10">
                  {feature.description}
                </p>
                <button className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-all hover:shadow-lg transform hover:translate-y-[-2px] ${getButtonColor(feature.color)}`}>
                  Start Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl shadow-lg p-8 mb-12 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => navigate(link.path)}
                className="bg-white p-6 rounded-lg hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-md border border-purple-100 text-center transform hover:shadow-lg group"
                style={{animation: `slideUp 0.5s ease-out ${idx * 0.08 + 0.8}s both`}}
              >
                <div className="text-4xl mb-2 transform group-hover:scale-125 transition-transform group-hover:-translate-y-1">{link.icon}</div>
                <p className="text-gray-900 font-semibold text-sm">{link.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border-2 border-emerald-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', emoji: '📝', title: 'Input Your Symptoms', desc: 'Tell us about the symptoms you\'re experiencing and your medical history' },
              { step: '2', emoji: '🤖', title: 'AI Analysis', desc: 'Our AI analyzes your data and provides disease predictions with confidence scores' },
              { step: '3', emoji: '📋', title: 'Get Recommendations', desc: 'Find suitable hospitals, specialists, and get professional medical advice' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="relative text-center group"
                style={{animation: `slideUp 0.5s ease-out ${idx * 0.15 + 1}s both`}}
              >
                {/* Step connector */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 -right-8 w-16 h-1 bg-gradient-to-r from-emerald-400 to-transparent"></div>
                )}
                
                <div className="relative z-10 mb-4 inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-4xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform group-hover:shadow-xl">
                    {item.emoji}
                  </div>
                  <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8 hover:shadow-lg transition-all">
          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">⚠️</div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2 text-lg">Important Disclaimer</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                SymptoGenie provides informational guidance only and is NOT a replacement for professional medical diagnosis or treatment. 
                Always consult with a qualified healthcare provider for medical advice, diagnosis, or treatment options. In case of emergency, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Daily Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tip: 'Stay Hydrated', desc: 'Drink at least 8 glasses of water daily to maintain good health' },
              { tip: 'Exercise Regularly', desc: 'Aim for 30 minutes of moderate physical activity daily' },
              { tip: 'Get Quality Sleep', desc: 'Maintain a consistent sleep schedule of 7-9 hours per night' }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <p className="font-semibold text-gray-900 mb-2">{item.tip}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-white p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Start your health journey today with our AI-powered symptom checker and hospital finder.
          </p>
          <button 
            onClick={() => navigate('/symptom-checker')}
            className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg transform duration-200 text-lg"
          >
            Begin Health Check 🏥
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
