"use strict";

var BugReport = require("../models/bugReportModel");

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var AppError = require("../utils/appError");

exports.createBugReport = catchAsync(function _callee(req, res, next) {
  var _req$body, title, description, newBugReport;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, description = _req$body.description;

          if (!(!title || !description)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next(new AppError("Please provide a title and description.", 400)));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(BugReport.create({
            title: title,
            description: description,
            reportedBy: req.user.id
          }));

        case 5:
          newBugReport = _context.sent;
          res.status(201).json({
            status: "success",
            data: {
              bugReport: newBugReport
            }
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); //

exports.getAllBugReports = catchAsync(function _callee2(req, res, next) {
  var bugReports;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(BugReport.find().populate("reportedBy", "name email"));

        case 2:
          bugReports = _context2.sent;
          res.status(200).json({
            status: "success",
            results: bugReports.length,
            data: {
              bugReports: bugReports
            }
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.deleteBugReport = catchAsync(function _callee3(req, res, next) {
  var bugReport;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(BugReport.findByIdAndDelete(req.params.id));

        case 2:
          bugReport = _context3.sent;

          if (bugReport) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError("No bug report found with that ID", 404)));

        case 5:
          res.status(204).json({
            status: "success",
            data: null
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});