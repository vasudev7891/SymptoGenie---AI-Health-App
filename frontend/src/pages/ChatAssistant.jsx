import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m your health assistant. How can I help you today? You can ask me about symptoms, health conditions, medications, or general wellness tips.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: generateResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (userInput) => {
    const responses = {
      fever: 'Fever is typically your body\'s way of fighting infection. Drink plenty of water, rest, and monitor your temperature. If it persists beyond 3 days or exceeds 103°F, consult a doctor.',
      cough: 'A cough can be caused by various conditions. If it\'s dry, try lozenges or honey. If productive with phlegm, it might indicate a respiratory infection. See a doctor if it lasts more than 10 days.',
      headache: 'For headaches, try: rest in a dark, quiet room, stay hydrated, and use over-the-counter pain relievers. If headaches are frequent or severe, consult a healthcare provider.',
      default: `Thanks for your question about "${userInput.substring(0, 20)}...". While I can provide general health information, please consult a healthcare professional for personalized medical advice.`
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }
    return responses.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">💬 Chat Assistant</h1>
          <p className="text-blue-100">Ask your health questions and get instant answers</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-screen flex flex-col p-4 sm:p-6">
        <div className="flex-1 bg-white rounded-lg shadow-lg mb-4 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.text}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base font-medium"
            >
              Send
            </button>
          </form>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            💡 Tip: Ask about symptoms, medications, or health conditions
          </p>
        </div>
      </div>
    </div>
  );
}
