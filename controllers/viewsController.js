const Record = require('../models/recordModel'); // Adjust path

exports.getOverview = (req, res) => {
  res.status(200).render('home', {
    title: 'Welcome'
  });
};

exports.profile = (req, res) => {
  res.status(200).render('profile', {
    title: 'Profile',
    user: req.user
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login Form'
  });
};

// Render Submit Records page
exports.renderSubmitRecordsPage = (req, res) => {
  res.render('submit-records', {
    user: req.user
  });
};

// Handle Submit Records form submission
exports.postSubmitRecords = async (req, res) => {
  const { action, countryCode, entity, amount } = req.body;

  if (!action || !countryCode || !entity || !amount) {
    const records = await Record.find({ submittedBy: req.user.id }).sort({
      submittedAt: -1
    });
    return res.status(400).render('submit-records', {
      user: req.user,
      records,
      error: 'Please fill in all fields'
    });
  }

  try {
    const record = new Record({
      action,
      countryCode,
      entity,
      amount: parseFloat(amount),
      submittedBy: req.user.id
    });
    await record.save();
    res.redirect('/submit-records'); // Refresh page to show new record
  } catch (err) {
    const records = await Record.find({ submittedBy: req.user.id }).sort({
      submittedAt: -1
    });
    res.status(500).render('submit-records', {
      user: req.user,
      records,
      error: 'Failed to submit record'
    });
  }
};

exports.getSubmitRecords = async (req, res) => {
  try {
    const records = await Record.find({ submittedBy: req.user.id }).sort({
      submittedAt: -1
    });
    res.render('submit-records', {
      user: req.user,
      records
    });
  } catch (err) {
    res.render('submit-records', {
      user: req.user,
      error: 'Failed to load records'
    });
  }
};

exports.getAnalyze = async (req, res) => {
  // if (req.user.role !== 'org') {
  //   return res.status(403).send('Access denied');
  // }
  try {
    res.render('analyze', {
      user: req.user,
      results: [] // Initially empty, populated client-side
    });
  } catch (err) {
    res.status(500).render('analyze', {
      user: req.user,
      error: 'Failed to load analyze page'
    });
  }
};
