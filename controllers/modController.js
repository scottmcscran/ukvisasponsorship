const Job = require(`./../models/jobModel`);
const User = require(`./../models/userModel`);
const AppError = require(`./../utils/appError`);
const factory = require(`./handlerFactory`);
const { catchAsync } = require("../utils/catchAsync");

exports.getReported = factory.getAll(Job, { status: `reported` });

exports.disableJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      status: `disabled`,
    },
    { new: true }
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      companyProfile: { $inc: { disabledListings: 1 } },
    },
    { new: true }
  );

  if (user.companyProfile.disabledListings >= 5)
    await User.findByIdAndUpdate(req.user.id, {
      companyProfile: { accStatus: `banned` },
    });

  if (!job) return next(new AppError(`no job with that id was found`, 400));

  res.status(200).json({
    status: `success`,
    message: `Job disabled successfully`,
  });
});

// ONLY TO BE USED IF JOB REPORT IS DISPUTED SUCCESSFULLY
exports.reActivateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      status: `active`,
      reports: 0,
    },
    { new: true }
  );

  if (!job) return next(new AppError(`no job with that id was found`, 400));

  res.status(200).json({
    status: `success`,
    message: `Job disabled successfully`,
  });
});
