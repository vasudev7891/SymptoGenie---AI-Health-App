import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Auth endpoints
  async register(data) {
    return axios.post(`${API_BASE_URL}/auth/register`, data);
  }

  async login(data) {
    return axios.post(`${API_BASE_URL}/auth/login`, data);
  }

  async getProfile() {
    return axios.get(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
  }

  async updateProfile(data) {
    return axios.put(`${API_BASE_URL}/auth/profile`, data, {
      headers: this.getHeaders()
    });
  }

  // Symptoms endpoints
  async analyzeSymptoms(data) {
    return axios.post(`${API_BASE_URL}/symptoms/analyze`, data, {
      headers: this.getHeaders()
    });
  }

  async getSymptomHistory(page = 1, limit = 10) {
    return axios.get(`${API_BASE_URL}/symptoms/history?page=${page}&limit=${limit}`, {
      headers: this.getHeaders()
    });
  }

  // Hospital endpoints
  async getHospitalRecommendations(analysisId, lat, lng) {
    return axios.get(`${API_BASE_URL}/hospitals/recommend`, {
      params: { analysisId, lat, lng },
      headers: this.getHeaders()
    });
  }

  async getNearbyHospitals(lat, lng, radius = 5000) {
    return axios.get(`${API_BASE_URL}/hospitals/nearby`, {
      params: { lat, lng, radius },
      headers: this.getHeaders()
    });
  }

  // Report endpoints
  async uploadReport(file, reportType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);

    return axios.post(`${API_BASE_URL}/reports/upload`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async analyzeReport(reportId) {
    return axios.post(`${API_BASE_URL}/reports/analyze`, { reportId }, {
      headers: this.getHeaders()
    });
  }

  async getUserReports(page = 1, limit = 10) {
    return axios.get(`${API_BASE_URL}/reports?page=${page}&limit=${limit}`, {
      headers: this.getHeaders()
    });
  }
}

export default new APIClient();
