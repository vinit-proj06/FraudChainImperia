/*no eslint*/

const Prediction = require('../models/Prediction');
const TrainingRecord = require('../models/TrainingRecord');
// const Notification = require('../models/Notification');

// controllers/auditController.js - Add these dummy data generators

const getDummyPredictions = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    _id: `pred${i}`,
    user: { email: `user${i}@example.com` },
    transactionId: `txn${1000 + i}`,
    fraudProbability: Math.floor(Math.random() * 100),
    defaultRisk: Math.floor(Math.random() * 100),
    timestamp: new Date(Date.now() - i * 3600000),
    actualOutcome:
      i % 3 === 0 ? 'Fraud' : i % 3 === 1 ? 'Not Fraud' : 'Pending',
    feedback: i % 4 === 0 ? true : i % 4 === 1 ? false : undefined
  }));
};

const getDummyMetrics = () => ({
  lastTrainingDate: new Date(),
  trainingRecords: 1250,
  accuracy: 0.92,
  f1Score: 0.89,
  truePositives: 450,
  falsePositives: 38,
  falseNegatives: 62,
  trueNegatives: 700
});

const getDummyNotifications = () => [
  {
    type: 'warning',
    message: 'Model accuracy dropped below 90% threshold',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    type: 'error',
    message: 'Failed to process transaction TXN-4892',
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    type: 'success',
    message: 'New training data batch processed successfully',
    timestamp: new Date(Date.now() - 10800000)
  }
];

const getDummyDataset = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    _id: `rec${i}`,
    isFraud: i % 4 === 0,
    probability: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - i * 86400000),
    features: {
      amount: Math.floor(Math.random() * 10000),
      country: ['US', 'UK', 'CA', 'AU'][Math.floor(Math.random() * 4)],
      merchant: ['Amazon', 'eBay', 'Walmart', 'Target'][
        Math.floor(Math.random() * 4)
      ]
    }
  }));
};

// Update these in auditController.js

exports.getPredictions = async (req, res) => {
  try {
    // const predictions = await Prediction.find().sort({ timestamp: -1 });
    const predictions = getDummyPredictions();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMetrics = async (req, res) => {
  try {
    // const metrics = await TrainingMetrics.findOne().sort({ completedAt: -1 });
    const metrics = getDummyMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // const notifications = await Notification.find().sort({ timestamp: -1 });
    const notifications = getDummyNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDataset = async (req, res) => {
  try {
    // const dataset = await TrainingRecord.find().sort({ createdAt: -1 });
    const dataset = getDummyDataset();
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      {
        feedback: req.body.isCorrect,
        feedbackAt: new Date()
      },
      { new: true }
    );

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

exports.retrainModel = async (req, res) => {
  try {
    // In a real app, trigger background job here
    res.json({ success: true, jobId: `training_${Date.now()}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate retraining' });
  }
};

exports.getTrainingStatus = async (req, res) => {
  try {
    res.json({ complete: Math.random() > 0.5 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check training status' });
  }
};

exports.exportMetrics = async (req, res) => {
  try {
    const metrics = await TrainingRecord.find()
      .sort({ completedAt: -1 })
      .limit(10);

    let csv =
      'Date,Accuracy,F1 Score,True Positives,False Positives,True Negatives,False Negatives\n';
    metrics.forEach(m => {
      csv += `${m.completedAt.toISOString()},${m.accuracy},${m.f1Score},${
        m.truePositive
      },${m.falsePositive},${m.trueNegative},${m.falseNegative}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=fraud-detection-metrics.csv'
    );
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export metrics' });
  }
};

exports.getRecordDetails = async (req, res) => {
  try {
    const record = await TrainingRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    await TrainingRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
};
