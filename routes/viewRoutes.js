const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/login', viewsController.getLoginForm);
router.get('/analyze', viewsController.getAnalyze);
router.get('/profile', viewsController.profile);
router.get('/contact', viewsController.contact);
router.get('/log-audit-trail', viewsController.getAuditLog);
router.get('/dashboard', viewsController.dashboard);

// Submit Records Routes
router
  .route('/submit-records')
  .get(viewsController.getSubmitRecords)
  .post(viewsController.postSubmitRecords);

module.exports = router;
