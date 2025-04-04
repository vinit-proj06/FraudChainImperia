const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  action: { type: String, required: true },
  countryCode: { type: String, required: true },
  entity: { type: String, required: true },
  amount: { type: Number, required: true },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
