const BugReport = require("../models/bugReportModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createBugReport = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError("Please provide a title and description.", 400));
  }

  const newBugReport = await BugReport.create({
    title,
    description,
    reportedBy: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      bugReport: newBugReport,
    },
  });
});
//
exports.getAllBugReports = catchAsync(async (req, res, next) => {
  const bugReports = await BugReport.find().populate(
    "reportedBy",
    "name email"
  );

  res.status(200).json({
    status: "success",
    results: bugReports.length,
    data: {
      bugReports,
    },
  });
});

exports.deleteBugReport = catchAsync(async (req, res, next) => {
  const bugReport = await BugReport.findByIdAndDelete(req.params.id);

  if (!bugReport) {
    return next(new AppError("No bug report found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
