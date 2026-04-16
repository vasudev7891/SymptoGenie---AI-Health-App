import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function SymptomChecker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [symptoms, setSymptoms] = useState(['']);
  const [analysis, setAnalysis] = useState(null);
  const [userInfo, setUserInfo] = useState({
    age: user?.age || '',
    gender: user?.gender || '',
    medicalHistory: user?.medicalHistory || []
  });

  const emergencySymptoms = [
    'chest pain', 'severe chest pain', 'difficulty breathing',
    'severe shortness of breath', 'loss of consciousness',
    'severe bleeding', 'choking', 'stroke'
  ];

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Sore Throat',
    'Nausea', 'Vomiting', 'Diarrhea', 'Chest Pain', 'Shortness of Breath',
    'Back Pain', 'Muscle Ache', 'Dizziness', 'Rash', 'Body Aches'
  ];

  const addSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const removeSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const updateSymptom = (index, value) => {
    const updated = [...symptoms];
    updated[index] = value;
    setSymptoms(updated);
  };

  const isEmergency = symptoms.some(symptom =>
    emergencySymptoms.some(es => symptom.toLowerCase().includes(es))
  );

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (symptoms.filter(s => s.trim()).length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.analyzeSymptoms({
        symptoms: symptoms.filter(s => s.trim()),
        userInfo
      });

      if (response.data.success) {
        setAnalysis(response.data.data);
        setSuccess('Symptoms analyzed successfully!');

        if (response.data.data.isEmergency) {
          setError('⚠️ EMERGENCY SYMPTOMS DETECTED - Please seek immediate medical attention!');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-xl p-8 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
              <span>🔍</span> Symptom Checker
            </h1>
            <p className="text-emerald-100 text-lg">Get AI-powered disease predictions based on your symptoms and medical history</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <form onSubmit={handleAnalyze} className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span>📝</span> Describe Your Symptoms
              </h2>

              {/* User Info Section */}
              <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span>👤</span> Your Information
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Age</label>
                    <input
                      type="number"
                      value={userInfo.age}
                      onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-300"
                      min="1"
                      max="150"
                      placeholder="Your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Gender</label>
                    <select
                      value={userInfo.gender}
                      onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-300"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms List */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span>🏥</span> Symptoms <span className="text-red-500">(Required)</span>
                </h3>
                <div className="space-y-3 mb-5">
                  {symptoms.map((symptom, index) => (
                    <div 
                      key={index} 
                      className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
                      style={{animation: `slideIn 0.3s ease-out ${index * 0.05}s`}}
                    >
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-3 text-lg pointer-events-none">💊</span>
                        <textarea
                          value={symptom}
                          onChange={(e) => updateSymptom(index, e.target.value)}
                          placeholder={`Symptom ${index + 1} (e.g., "Severe headache", "Persistent cough")`}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-12 hover:border-blue-300 transition-all"
                        />
                      </div>
                      {symptoms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSymptom(index)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-110 transition-all font-bold transform duration-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSymptom}
                  className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg hover:from-blue-200 hover:to-blue-100 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105 duration-200 flex items-center gap-2"
                >
                  ➕ Add Symptom
                </button>
              </div>

              {/* Quick Add Buttons */}
              <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Quick Common Symptoms:</p>
                <div className="flex flex-wrap gap-3">
                  {commonSymptoms.map((symptom, idx) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => {
                        if (!symptoms.includes(symptom)) {
                          setSymptoms([...symptoms, symptom]);
                        }
                      }}
                      className="px-4 py-2 bg-white border-2 border-gray-300 text-sm text-gray-700 rounded-full hover:bg-blue-50 hover:border-blue-500 hover:scale-110 transition-all shadow-sm hover:shadow-md transform duration-200 font-medium"
                      style={{animation: `slideUp 0.3s ease-out ${idx * 0.03}s`}}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Warning */}
              {isEmergency && (
                <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-lg animate-pulse">
                  <p className="text-red-700 font-bold text-lg flex items-center gap-2">🚨 Emergency Symptoms Detected</p>
                  <p className="text-red-600 text-sm mt-2">
                    Your symptoms may require immediate medical attention. Please call emergency services or visit the nearest hospital immediately.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔬</span> Analyze Symptoms
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-5 italic">
                ⚠️ This is for informational purposes only and not a medical diagnosis. Always consult a healthcare professional.
              </p>
            </form>
          </div>

          {/* Analysis Results Sidebar */}
          <div className="lg:col-span-1">
            {analysis && (
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-20 border border-gray-100 hover:shadow-3xl transition-shadow">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>📊</span> Analysis Results
                  </h3>
                </div>

                <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Diseases List */}
                  <div className="space-y-4 mb-6">
                    {analysis.diseases?.map((disease, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border-l-4 shadow-md hover:shadow-lg transition-all transform hover:scale-105 duration-200 cursor-pointer animate-in fade-in slide-in-from-right-2 duration-500`}
                        style={{
                          animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`,
                          backgroundColor: disease.severity === 'high' ? '#fef2f2' : disease.severity === 'medium' ? '#fffbeb' : '#f0fdf4',
                          borderColor: disease.severity === 'high' ? '#dc2626' : disease.severity === 'medium' ? '#eab308' : '#16a34a'
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-gray-900 text-sm">{disease.name}</h4>
                          <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            {disease.confidence}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden shadow-sm">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                              disease.severity === 'high'
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : disease.severity === 'medium'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                : 'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                            style={{ width: `${disease.confidence}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                            disease.severity === 'high'
                              ? 'bg-red-200 text-red-800'
                              : disease.severity === 'medium'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                          }`}>
                            {disease.severity?.toUpperCase()}
                          </span>
                          {disease.specialization && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                              👨‍⚕️ {disease.specialization}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">{disease.advice}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  {analysis.recommendation && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl mb-6 shadow-md hover:shadow-lg transition-all">
                      <p className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
                        <span>💡</span> Recommendation
                      </p>
                      <p className="text-sm text-blue-800 leading-relaxed">{analysis.recommendation}</p>
                    </div>
                  )}

                  {/* Emergency Alert */}
                  {analysis.isEmergency && (
                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl mb-6 shadow-lg animate-pulse">
                      <p className="text-sm font-bold text-red-900 flex items-center gap-2 mb-1">🚨 EMERGENCY</p>
                      <p className="text-sm text-red-800 leading-relaxed">{analysis.emergencyAdvice}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/hospitals')}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
                    >
                      🏥 Find Hospitals
                    </button>
                    <button 
                      onClick={() => navigate('/chat')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
                    >
                      💬 Chat with AI
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!analysis && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 sticky top-20">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-gray-600 font-medium">
                  Add your symptoms and click "Analyze" to see results here
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex justify-center sticky top-20">
                <Spinner size="md" />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
