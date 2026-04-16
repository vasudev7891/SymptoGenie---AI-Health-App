import React from 'react';

export default function Support() {
  const [activeTab, setActiveTab] = React.useState('faq');

  const faqs = [
    { q: 'How accurate is the symptom analysis?', a: 'Our AI analysis provides predictions for educational purposes. Always consult with a healthcare professional for accurate diagnosis.' },
    { q: 'Is my data private?', a: 'Yes, we use encryption and follow HIPAA standards to protect your data.' },
    { q: 'Can I delete my account?', a: 'You can delete your account anytime from Settings. All data will be permanently removed.' },
    { q: 'How often are hospitals updated?', a: 'Hospital information is updated daily from our database.' },
    { q: 'Do you offer video consultations?', a: 'Currently we show hospital contacts. Direct consultations are coming soon.' },
    { q: 'Is there a mobile app?', a: 'Our web app is mobile-responsive. Native apps are in development.' }
  ];

  const contactMethods = [
    { icon: '📧', method: 'Email', value: 'support@symptogenie.com' },
    { icon: '💬', method: 'Chat', value: 'Available 9 AM - 6 PM IST' },
    { icon: '📱', method: 'Phone', value: '+91-1234-567-890' },
    { icon: '🐦', method: 'Twitter', value: '@SymptoGenie' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support & Help</h1>
          <p className="text-green-100 text-lg">We're here to help you get the most from SymptoGenie</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-2 px-4 font-medium transition ${
              activeTab === 'faq'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-4 font-medium transition ${
              activeTab === 'contact'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact Us
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {contactMethods.map((contact, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                  <div className="text-5xl mb-3">{contact.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{contact.method}</h3>
                  <p className="text-gray-600">{contact.value}</p>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
