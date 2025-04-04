const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  validatorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  voted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
