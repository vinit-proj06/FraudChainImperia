const mongoose = require('mongoose');

const trainingRecordSchema = new mongoose.Schema({
  features: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  featureImportance: {
    type: Map,
    of: Number,
    required: true
  },
  isFraud: {
    type: Boolean,
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const modelTrainingSchema = new mongoose.Schema({
  trainingSize: Number,
  accuracy: Number,
  f1Score: Number,
  truePositive: Number,
  falsePositive: Number,
  trueNegative: Number,
  falseNegative: Number,
  startedAt: Date,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  TrainingRecord: mongoose.model('TrainingRecord', trainingRecordSchema),
  ModelTraining: mongoose.model('ModelTraining', modelTrainingSchema)
};
