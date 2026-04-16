import express from 'express';
import SymptomAnalysis from '../models/SymptomAnalysis.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock disease database
const mockDiseases = {
  'fever': [{ name: 'Common Cold', confidence: 85, severity: 'low' }, { name: 'Flu', confidence: 75, severity: 'medium' }, { name: 'COVID-19', confidence: 60, severity: 'medium' }],
  'cough': [{ name: 'Bronchitis', confidence: 80, severity: 'medium' }, { name: 'Asthma', confidence: 70, severity: 'medium' }],
  'headache': [{ name: 'Migraine', confidence: 70, severity: 'medium' }, { name: 'Tension Headache', confidence: 85, severity: 'low' }],
  'sore throat': [{ name: 'Strep Throat', confidence: 75, severity: 'medium' }, { name: 'Pharyngitis', confidence: 80, severity: 'low' }],
  'chest pain': [{ name: 'Angina', confidence: 90, severity: 'high' }, { name: 'Heart Attack', confidence: 85, severity: 'high' }],
};

const emergencySymptoms = ['chest pain', 'severe bleeding', 'difficulty breathing', 'loss of consciousness', 'stroke', 'choking'];

// Analyze symptoms
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { symptoms, userInfo } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one symptom'
      });
    }

    // Check for emergency symptoms
    const isEmergency = symptoms.some(symptom => emergencySymptoms.some(es => symptom.toLowerCase().includes(es)));

    // Get mock disease data
    let diseases = [];
    symptoms.forEach(symptom => {
      const symptomLower = symptom.toLowerCase();
      Object.keys(mockDiseases).forEach(key => {
        if (symptomLower.includes(key)) {
          diseases.push(...mockDiseases[key]);
        }
      });
    });

    // Remove duplicates and sort
    diseases = Array.from(new Map(diseases.map(d => [d.name, d])).values()).sort((a, b) => b.confidence - a.confidence).slice(0, 5);

    if (diseases.length === 0) {
      diseases = [{ name: 'Viral Infection', confidence: 60, severity: 'low' }, { name: 'Bacterial Infection', confidence: 50, severity: 'medium' }];
    }

    // Save to database
    const analysis = new SymptomAnalysis({
      userId: req.userId,
      symptoms,
      userInfo,
      diseases: diseases.map(d => ({ name: d.name, confidence: d.confidence, severity: d.severity })),
      isEmergency
    });

    await analysis.save();

    res.status(201).json({
      success: true,
      data: {
        analysisId: analysis._id,
        symptoms,
        diseases: diseases.map(d => ({ name: d.name, confidence: d.confidence, severity: d.severity })),
        isEmergency,
        recommendation: isEmergency ? '🚨 EMERGENCY: Please seek immediate medical attention!' : 'Please consult with a healthcare professional for proper diagnosis.',
        disclaimer: 'This is an AI analysis for informational purposes only and NOT a medical diagnosis.'
      }
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze symptoms',
      error: error.message
    });
  }
});

// Get symptom history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const history = await SymptomAnalysis
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SymptomAnalysis.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      data: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        history
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
});

// Get single analysis
router.get('/:analysisId', authMiddleware, async (req, res) => {
  try {
    const analysis = await SymptomAnalysis.findOne({
      _id: req.params.analysisId,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis',
      error: error.message
    });
  }
});

export default router;
