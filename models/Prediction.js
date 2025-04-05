const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  fraudProbability: {
    type: Number,
    required: true
  },
  defaultRisk: {
    type: Number,
    required: true
  },
  actualOutcome: {
    type: String,
    enum: ['Fraud', 'Not Fraud', 'Pending'],
    default: 'Pending'
  },
  feedback: Boolean,
  feedbackAt: Date,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
