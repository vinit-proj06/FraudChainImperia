const Record = require('./../models/recordModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.createRecord = factory.createOne(Record);
