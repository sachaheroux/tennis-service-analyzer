import { Router } from 'express';
import { ServiceAnalyzer } from '../services/ServiceAnalyzer';

const router = Router();
const serviceAnalyzer = new ServiceAnalyzer();

// Analyser un service
router.post('/analyze', (req, res) => {
  try {
    const { x, y, courtWidth, courtHeight } = req.body;

    if (typeof x !== 'number' || typeof y !== 'number' || 
        typeof courtWidth !== 'number' || typeof courtHeight !== 'number') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'x, y, courtWidth, and courtHeight must be numbers'
      });
    }

    const result = serviceAnalyzer.analyzeService(x, y, courtWidth, courtHeight);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Service analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'Unable to analyze service'
    });
  }
});

// Obtenir les statistiques
router.get('/stats', (req, res) => {
  try {
    const stats = serviceAnalyzer.getStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Stats retrieval failed',
      message: 'Unable to retrieve statistics'
    });
  }
});

// Réinitialiser les statistiques
router.delete('/stats', (req, res) => {
  try {
    serviceAnalyzer.resetStats();
    res.json({
      success: true,
      message: 'Statistics reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats reset error:', error);
    res.status(500).json({
      error: 'Stats reset failed',
      message: 'Unable to reset statistics'
    });
  }
});

export { router as serviceRoutes }; 