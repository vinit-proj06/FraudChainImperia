const express = require('express');
const authController = require('./../controllers/authController');
const recordController = require('./../controllers/recordController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/submit', recordController.createRecord);

module.exports = router;
