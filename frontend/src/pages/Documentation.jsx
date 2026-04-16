import React from 'react';

export default function Documentation() {
  const docs = [
    {
      section: 'API Documentation',
      items: [
        { name: 'Authentication', desc: 'Login and registration endpoints' },
        { name: 'Symptoms API', desc: 'Analyze symptoms and get predictions' },
        { name: 'Hospitals API', desc: 'Find nearby hospitals and specialists' },
        { name: 'Reports API', desc: 'Upload and analyze medical reports' }
      ]
    },
    {
      section: 'Features',
      items: [
        { name: 'Symptom Analysis', desc: 'AI-powered disease prediction' },
        { name: 'Hospital Finder', desc: 'Locate nearby healthcare centers' },
        { name: 'Report Analysis', desc: 'Understand medical test results' },
        { name: 'Chat Support', desc: 'Get health-related advice' }
      ]
    },
    {
      section: 'User Guide',
      items: [
        { name: 'Creating Account', desc: 'Step-by-step account setup' },
        { name: 'Analyzing Symptoms', desc: 'How to use symptom checker' },
        { name: 'Finding Doctors', desc: 'Search and filter hospitals' },
        { name: 'Privacy Settings', desc: 'Manage your data and privacy' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-purple-100 text-lg">Complete guides and API references</p>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {docs.map((doc, docIdx) => (
            <div key={docIdx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <h2 className="text-2xl font-bold">{doc.section}</h2>
              </div>
              <div className="p-6 space-y-4">
                {doc.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Example Section */}
      <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">API Example</h2>
          <pre className="bg-gray-800 p-6 rounded-lg overflow-x-auto text-sm">
            {`// Analyze Symptoms
curl -X POST http://localhost:5000/api/symptoms/analyze \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symptoms": ["fever", "cough", "headache"],
    "userInfo": {
      "age": 25,
      "gender": "male"
    }
  }'

// Response
{
  "success": true,
  "data": {
    "diseases": [
      { "name": "Common Cold", "confidence": 85 },
      { "name": "Flu", "confidence": 75 }
    ],
    "isEmergency": false
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
