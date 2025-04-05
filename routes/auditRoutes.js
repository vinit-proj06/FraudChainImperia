const express = require('express');
const auditController = require('../controllers/auditController');

const router = express.Router();

// In your main route file (e.g., routes/audit.js)
router.get('/', async (req, res) => {
  try {
    // Fetch all data needed for the template
    const [predictions, metrics, notifications, dataset] = await Promise.all([
      auditController.getPredictions(req, res),
      auditController.getMetrics(req, res),
      auditController.getNotifications(req, res),
      auditController.getDataset(req, res)
    ]);

    res.render('audit', {
      title: 'Audit Trail',
      predictions,
      metrics,
      notifications,
      dataset,
      chartData: {
        distribution: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        trends: [10, 15, 12, 18, 22, 25, 30, 28, 32, 35],
        accuracy: [85, 86, 88, 89, 90, 91, 92, 92, 93, 94]
      }
    });
  } catch (error) {
    res.status(500).send('Error loading audit page');
  }
});

module.exports = router;
