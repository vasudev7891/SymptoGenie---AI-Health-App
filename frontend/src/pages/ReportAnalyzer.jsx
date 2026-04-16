import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function ReportAnalyzer() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('other');
  const fileInputRef = useRef(null);

  const reportTypes = [
    { value: 'blood_test', label: 'Blood Test' },
    { value: 'x-ray', label: 'X-Ray' },
    { value: 'ct_scan', label: 'CT Scan' },
    { value: 'mri', label: 'MRI' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'other', label: 'Other' },
  ];

  // Fetch user reports
  const fetchReports = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getUserReports(1, 10);
      if (response.data.success) {
        setReports(response.data.data.reports);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.uploadReport(file, reportType);
      if (response.data.success) {
        setSuccess('Report uploaded successfully! Processing...');
        fileInputRef.current.value = '';
        setReportType('other');
        setTimeout(fetchReports, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  // Analyze report
  const handleAnalyzeReport = async (reportId) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.analyzeReport(reportId);
      if (response.data.success) {
        setSelectedReport(response.data.data);
        setSuccess('Report analyzed successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze report');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-8">
          <h1 className="text-4xl font-bold mb-2">📋 Medical Report Analyzer</h1>
          <p className="text-emerald-100">Upload and analyze your medical reports with AI-powered insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📤 Upload Report</h2>

              <div className="mb-6">
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  id="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <p className="text-4xl mb-2">📁</p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, or PNG (Max 10MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  {uploading ? 'Uploading...' : '📤 Choose File'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your reports are securely stored and encrypted.
              </p>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold text-gray-900">
                  📚 Your Reports
                </h2>
              </div>

              <div className="divide-y max-h-[400px] overflow-y-auto">
                {loading && (
                  <div className="p-8 flex justify-center">
                    <Spinner size="md" />
                  </div>
                )}

                {!loading && reports.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No reports uploaded yet
                  </div>
                )}

                {!loading &&
                  reports.map((report) => (
                    <div
                      key={report.reportId}
                      onClick={() => handleAnalyzeReport(report.reportId)}
                      className="p-4 hover:bg-blue-50 cursor-pointer transition"
                    >
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {report.fileName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {report.analyzed && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            ✓ Analyzed
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Analysis Results</h2>

                {/* Extracted Text */}
                {selectedReport.extractedText && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">📝 Extracted Text</h3>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {selectedReport.extractedText}
                    </p>
                  </div>
                )}

                {/* Summary */}
                {selectedReport.summary && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📋 Summary</h3>
                    <p className="text-sm text-blue-800">{selectedReport.summary}</p>
                  </div>
                )}

                {/* Abnormal Values */}
                {selectedReport.abnormalValues && selectedReport.abnormalValues.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">⚠️ Abnormal Values</h3>
                    <div className="space-y-3">
                      {selectedReport.abnormalValues.map((value, idx) => (
                        <div key={idx} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{value.parameter}</h4>
                            <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                              {value.status?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>Value:</strong> {value.value} {value.unit}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Normal Range:</strong> {value.normalRange}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice */}
                {selectedReport.advice && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                    <h3 className="font-semibold text-green-900 mb-2">💡 Recommendations</h3>
                    <p className="text-sm text-green-800">{selectedReport.advice}</p>
                  </div>
                )}

                {/* Confidence Score */}
                {selectedReport.confidenceScore && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Analysis Confidence
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {selectedReport.confidenceScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedReport.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
                    🏥 Find Specialists
                  </button>
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition">
                    💬 Chat about this
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  ⚠️ These results are for informational purposes. Consult a healthcare professional for medical advice.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-6xl mb-4">📋</p>
                <p className="text-gray-600 text-lg">
                  Upload a medical report to see analysis here
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Supported formats: PDF, JPG, PNG
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
