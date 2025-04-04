const mongoose = require('mongoose');
const { path } = require('../app');

const recordSchema = new mongoose.Schema({
    data: {
        type: String,
        required: [true, 'Please provide data']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    hash:{
        type: String,
        required: [true, 'Please provide hash']
    },
    validated:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})


const Record = mongoose.model('Record', recordSchema);

module.exports = Record;