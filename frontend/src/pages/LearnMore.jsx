import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LearnMore() {
  const { user } = useAuth();

  const resources = [
    {
      icon: '📚',
      title: 'Getting Started Guide',
      description: 'Learn how to use SymptoGenie effectively',
      link: '#'
    },
    {
      icon: '🎓',
      title: 'How Symptom Analysis Works',
      description: 'Understand the AI-powered symptom detection process',
      link: '#'
    },
    {
      icon: '🏥',
      title: 'Finding Hospitals & Doctors',
      description: 'Tips for finding the right healthcare provider',
      link: '#'
    },
    {
      icon: '📋',
      title: 'Medical Report Analysis',
      description: 'How to upload and analyze your medical reports',
      link: '#'
    },
    {
      icon: '💡',
      title: 'Health Tips & Advice',
      description: 'General wellness and preventive care tips',
      link: '#'
    },
    {
      icon: '❓',
      title: 'FAQ',
      description: 'Frequently asked questions about SymptoGenie',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn More</h1>
          <p className="text-blue-100 text-lg">Explore resources and guides to get the most out of SymptoGenie</p>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 cursor-pointer"
            >
              <div className="text-5xl mb-4">{resource.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <a
                href={resource.link}
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Use all the tools available in SymptoGenie to understand your health better.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition">
            Start Using SymptoGenie
          </button>
        </div>
      </div>
    </div>
  );
}
