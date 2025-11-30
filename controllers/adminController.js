const { catchAsync } = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const Job = require(`./../models/jobModel`);
const User = require(`./../models/userModel`);
const BugReport = require("../models/bugReportModel");
const Discount = require("../models/discountModel");
const ShadowEmailQueue = require("../models/shadowEmailQueueModel");
const crypto = require("crypto");
const Email = require("../utils/email");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.approveEmployer = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    "companyProfile.accStatus": `verified`,
  });

  if (!user) return next(new AppError(`No user with that ID.`, 404));

  try {
    const dashboardUrl = `${req.protocol}://${req.get(
      "host"
    )}/employer-dashboard`;
    await new Email(user, dashboardUrl).sendAccountVerified();
  } catch (err) {
    console.log("Error sending verification email:", err);
  }

  res.status(200).json({
    status: `success`,
    message: `${user.companyProfile.legalOrgName} has been verified.`,
  });
});

exports.rejectEmployer = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      "companyProfile.accStatus": `rejected`,
    },
    { new: true }
  );

  if (!user) return next(new AppError(`No user with that ID.`, 404));

  // ADD EMAIL HERE LATER

  res.status(200).json({
    status: `success`,
    message: `${user.companyProfile.legalOrgName} has been rejected.`,
  });
});

exports.dismissReport = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { status: "active", reports: 0 }, // Reset status and report count
    { new: true }
  );

  if (!job) return next(new AppError(`No job found with that ID`, 404));

  res.status(200).json({
    status: `success`,
    message: `Report dismissed, job is active again.`,
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) return next(new AppError(`No job found with that ID`, 404));

  // Check if job was reported and increment counter for employer
  if (job.status === "reported") {
    const user = await User.findById(job.postedBy);
    if (user && user.role === "employer") {
      // Initialize if undefined (for existing users)
      if (!user.companyProfile.deletedReportedJobsCount) {
        user.companyProfile.deletedReportedJobsCount = 0;
      }

      user.companyProfile.deletedReportedJobsCount += 1;

      // Ban if count reaches 5
      if (user.companyProfile.deletedReportedJobsCount >= 5) {
        user.companyProfile.accStatus = "banned";
        console.log(
          `User ${user._id} has been banned due to 5 deleted reported jobs.`
        );
      }

      await user.save({ validateBeforeSave: false });
    }
  }

  await Job.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: `success`,
    data: null,
  });
});

exports.getAdminStats = catchAsync(async (req, res, next) => {
  const [
    totalJobs,
    activeJobs,
    reportedJobs,
    totalUsers,
    totalEmployers,
    totalJobSeekers,
    featuredJobs,
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: `active` }),
    Job.countDocuments({ status: `reported` }),
    User.countDocuments(),
    User.countDocuments({ role: `employer` }),
    User.countDocuments({ role: `jobseeker` }),
    Job.countDocuments({ featured: true, status: `active` }),
  ]);

  const jobsByLocation = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $group: { _id: `$location.city`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { city: `$_id`, count: 1, _id: 0 } },
  ]);

  const jobsByVisaType = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $unwind: `$visaTypes` },
    { $group: { _id: `$visaTypes`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { visaType: `$_id`, count: 1, _id: 0 } },
  ]);

  const jobsByExperience = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $group: { _id: `$experienceLevel`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { level: `$_id`, count: 1, _id: 0 } },
  ]);

  const jobsByRemote = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $group: { _id: `$location.remote`, count: { $sum: 1 } } },
    { $project: { type: `$_id`, count: 1, _id: 0 } },
  ]);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentJobs = await Job.countDocuments({
    postedDate: { $gte: sevenDaysAgo },
  });

  const salaryStats = await Job.aggregate([
    { $match: { status: `active`, "salaryRange.currency": `GBP` } },
    {
      $group: {
        _id: null,
        avgMin: { $avg: `$salaryRange.min` },
        avgMax: { $avg: `$salaryRange.max` },
      },
    },
  ]);

  const topAnalytics = await Job.aggregate([
    { $match: { status: `active` } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: `$analytics.views` },
        totalClicks: { $sum: `$analytics.applicationClicks` },
        totalSaves: { $sum: `$analytics.saves` },
      },
    },
  ]);

  const topEmployers = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $group: { _id: `$postedBy`, jobCount: { $sum: 1 } } },
    { $sort: { jobCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: `users`,
        localField: `_id`,
        foreignField: `_id`,
        as: `employer`,
      },
    },
    { $unwind: `$employer` },
    {
      $project: {
        _id: 0,
        employerId: `$_id`,
        companyName: `$employer.companyProfile.companyName`,
        email: `$employer.email`,
        jobCount: 1,
      },
    },
  ]);

  res.status(200).json({
    status: `success`,
    data: {
      overview: {
        totalJobs,
        activeJobs,
        reportedJobs,
        featuredJobs,
        totalUsers,
        totalEmployers,
        totalJobSeekers,
        recentJobs,
      },
      jobsByLocation,
      jobsByVisaType,
      jobsByExperience,
      jobsByRemote,
      salaryStats: salaryStats[0] || { avgMin: 0, avgMax: 0 },
      analytics: topAnalytics[0] || {
        totalViews: 0,
        totalClicks: 0,
        totalSaves: 0,
      },
      topEmployers,
    },
  });
});

exports.exportUserData = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Please provide an email address", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("User not found", 404));

  const userData = {
    profile: user,
    jobsPosted: [],
    bugReports: [],
  };

  if (user.role === "employer") {
    userData.jobsPosted = await Job.find({ postedBy: user._id });
  }

  userData.bugReports = await BugReport.find({ reportedBy: user._id });

  res.status(200).json({
    status: "success",
    data: userData,
  });
});

exports.createShadowEmployer = catchAsync(async (req, res, next) => {
  const { companyName, email, legalOrgName, industry, companySize, website } =
    req.body;

  // Generate a random password
  const password = crypto.randomBytes(12).toString("hex");

  const newUser = await User.create({
    name: companyName, // Use company name as user name initially
    email,
    password,
    passwordConfirm: password,
    role: "employer",
    isClaimed: false,
    companyProfile: {
      companyName,
      legalOrgName: legalOrgName || companyName, // Fallback
      industry,
      companySize,
      website,
      accStatus: "verified", // Auto-verify shadow accounts? Or keep unverified? Let's say verified so jobs show up.
    },
    emailVerified: true, // Auto-verify email for shadow accounts
    subscription: {
      tier: "free", // Or give them a trial?
      status: "active",
    },
  });

  // Hide password from output
  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.sendClaimEmail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isClaimed) {
    return next(new AppError("Account already claimed", 400));
  }

  // Check if already in queue
  const existingQueue = await ShadowEmailQueue.findOne({ user: user._id });
  if (existingQueue) {
    return next(new AppError("Email already queued for this user", 400));
  }

  await ShadowEmailQueue.create({ user: user._id });

  res.status(200).json({
    status: "success",
    message: "Claim email has been queued for Tuesday 10:15 AM",
  });
});

exports.getShadowEmailQueue = catchAsync(async (req, res, next) => {
  const queueItems = await ShadowEmailQueue.find().populate({
    path: "user",
    populate: { path: "activeJobsCount" },
  });

  const formattedQueue = queueItems
    .map((item) => {
      if (!item.user) return null;
      return {
        _id: item._id,
        user: {
          _id: item.user._id,
          email: item.user.email,
          companyName: item.user.companyProfile?.companyName,
          jobCount: item.user.activeJobsCount || 0,
        },
        createdAt: item.createdAt,
      };
    })
    .filter((item) => item !== null);

  res.status(200).json({
    status: "success",
    data: {
      queue: formattedQueue,
    },
  });
});

exports.createDiscount = catchAsync(async (req, res, next) => {
  const { code, percentage, expiresAt } = req.body;

  // 1. Create Coupon in Stripe
  // We use try-catch for Stripe creation to handle duplicates gracefully or errors
  let coupon;
  try {
    coupon = await stripe.coupons.create({
      percent_off: percentage,
      duration: "once", // Applies to the first payment only
      name: code,
      id: code, // Use the code as the ID
    });
  } catch (err) {
    // If coupon already exists in Stripe, retrieve it
    if (err.code === "resource_already_exists") {
      coupon = await stripe.coupons.retrieve(code);
    } else {
      return next(new AppError(`Stripe Error: ${err.message}`, 400));
    }
  }

  // 2. Create Discount in DB
  // Deactivate others first if we want only one active global discount
  await Discount.updateMany({}, { isActive: false });

  const discount = await Discount.create({
    code,
    percentage,
    stripeId: coupon.id,
    isActive: true,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  });

  res.status(201).json({
    status: "success",
    data: {
      discount,
    },
  });
});

exports.getAllDiscounts = catchAsync(async (req, res, next) => {
  const discounts = await Discount.find().sort("-createdAt");
  res.status(200).json({
    status: "success",
    results: discounts.length,
    data: {
      discounts,
    },
  });
});

exports.deleteDiscount = catchAsync(async (req, res, next) => {
  const discount = await Discount.findByIdAndDelete(req.params.id);
  if (!discount)
    return next(new AppError("No discount found with that ID", 404));

  try {
    await stripe.coupons.del(discount.stripeId);
  } catch (err) {
    // Ignore
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.toggleDiscountStatus = catchAsync(async (req, res, next) => {
  const discount = await Discount.findById(req.params.id);
  if (!discount) return next(new AppError("No discount found", 404));

  const { action } = req.body;

  if (action === "activate") {
    // Deactivate all others first
    await Discount.updateMany({}, { isActive: false });
    discount.isActive = true;
  } else if (action === "deactivate") {
    discount.isActive = false;
  } else {
    // Fallback to toggle if no action provided (legacy support)
    if (!discount.isActive) {
      await Discount.updateMany({}, { isActive: false });
    }
    discount.isActive = !discount.isActive;
  }

  await discount.save();

  res.status(200).json({
    status: "success",
    data: { discount },
  });
});
