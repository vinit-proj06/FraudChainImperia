const Record = require('./../models/recordModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.createRecord = factory.createOne(Record);

exports.getRecords = catchAsync(async (req, res, next) => {
  const records = await Record.find({ submittedBy: req.user.id }).sort({
    submittedAt: -1
  });

  res.status(200).render('submit-records', {
    title: 'Submit Records',
    records
  });
});

exports.getAllRecordsForAudit = catchAsync(async (req, res, next) => {
  // Only accessible by admin/analyst roles
  if (
    !req.user.roles.includes('admin') &&
    !req.user.roles.includes('analyst')
  ) {
    return next(
      new AppError('You do not have permission to view all records', 403)
    );
  }

  const records = await Record.find().sort({ submittedAt: -1 });
  res.status(200).json({
    status: 'success',
    results: records.length,
    data: {
      records
    }
  });
});

exports.getRecordStats = catchAsync(async (req, res, next) => {
  // Only accessible by admin/analyst roles
  if (
    !req.user.roles.includes('admin') &&
    !req.user.roles.includes('analyst')
  ) {
    return next(
      new AppError('You do not have permission to view record statistics', 403)
    );
  }

  const stats = await Record.aggregate([
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
