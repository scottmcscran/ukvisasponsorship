"use strict";

var Job = require("./../models/jobModel");

var User = require("./../models/userModel");

var AppError = require("./../utils/appError");

var factory = require("./handlerFactory");

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

exports.getReported = factory.getAll(Job, {
  status: "reported"
});
exports.disableJob = catchAsync(function _callee(req, res, next) {
  var job, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            status: "disabled"
          }, {
            "new": true
          }));

        case 2:
          job = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            companyProfile: {
              $inc: {
                disabledListings: 1
              }
            }
          }, {
            "new": true
          }));

        case 5:
          user = _context.sent;

          if (!(user.companyProfile.disabledListings >= 5)) {
            _context.next = 9;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            companyProfile: {
              accStatus: "banned"
            }
          }));

        case 9:
          if (job) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", next(new AppError("no job with that id was found", 400)));

        case 11:
          res.status(200).json({
            status: "success",
            message: "Job disabled successfully"
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}); // ONLY TO BE USED IF JOB REPORT IS DISPUTED SUCCESSFULLY

exports.reActivateJob = catchAsync(function _callee2(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            status: "active",
            reports: 0
          }, {
            "new": true
          }));

        case 2:
          job = _context2.sent;

          if (job) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError("no job with that id was found", 400)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Job disabled successfully"
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});