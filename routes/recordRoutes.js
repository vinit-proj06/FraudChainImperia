const express = require('express');
const authController = require('./../controllers/authController');
const recordController = require('./../controllers/recordController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Form submission route (renders the page with records)
router.route('/submit-records').get(recordController.getRecords);

// API endpoint for submitting records
router.post('/submit', recordController.createRecord);

// Audit trail related routes (protected and restricted)
router.use(authController.restrictTo('admin', 'analyst'));

router.get('/audit/records', recordController.getAllRecordsForAudit);
router.get('/audit/record-stats', recordController.getRecordStats);

module.exports = router;
