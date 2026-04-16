import express from 'express';
import Report from '../models/Report.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Upload report
router.post('/upload', authMiddleware, async (req, res) => {
  try {
    const report = new Report({
      userId: req.userId,
      fileName: 'report_' + Date.now(),
      reportType: req.body.reportType || 'other',
      status: 'completed'
    });

    await report.save();

    res.status(201).json({
      success: true,
      data: {
        reportId: report._id,
        fileName: report.fileName,
        status: report.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload report', error: error.message });
  }
});

// Analyze report
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const mockAnalysis = {
      findings: 'Report shows normal values. No significant abnormalities detected.',
      keyMetrics: [
        { name: 'BP', value: '120/80 mmHg', status: 'normal' },
        { name: 'Hemoglobin', value: '14.5 g/dL', status: 'normal' }
      ]
    };

    report.analysis = mockAnalysis;
    await report.save();

    res.json({
      success: true,
      data: { reportId: report._id, analysis: mockAnalysis, status: 'completed' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to analyze', error: error.message });
  }
});

// Get reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: { reports, total: reports.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error: error.message });
  }
});

export default router;
