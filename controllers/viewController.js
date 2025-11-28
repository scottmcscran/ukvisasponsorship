const Job = require(`./../models/jobModel`);
const User = require(`./../models/userModel`); // Ensure User is imported
const BugReport = require("./../models/bugReportModel");
const Discount = require("./../models/discountModel");
const r2 = require("../utils/r2");
const { geoPostcode } = require(`../utils/geoPostcode`);

const { catchAsync } = require(`./../utils/catchAsync`);

const AppError = require(`./../utils/appError`);
const ApiFeatures = require(`./../utils/apiFeatures`);

// Helper to calculate % change
const calculateChange = async (Model, query = {}) => {
  const now = new Date();
  const yesterday = new Date(now - 24 * 60 * 60 * 1000);

  const totalNow = await Model.countDocuments(query);
  const totalYesterday = await Model.countDocuments({
    ...query,
    createdAt: { $lt: yesterday },
  });

  if (totalYesterday === 0) return totalNow > 0 ? 100 : 0;

  const change = ((totalNow - totalYesterday) / totalYesterday) * 100;
  return change.toFixed(1);
};

exports.getAdminDashboard = catchAsync(async (req, res, next) => {
  // 1. Get Reported Jobs
  const reportedJobs = await Job.find({ status: "reported" })
    .select("+reports")
    .populate("postedBy");

  // 2. Get Unverified Employers
  const unverifiedEmployers = await User.find({
    role: "employer",
    "companyProfile.accStatus": "unverified",
  });

  // 3. Get Basic Stats
  const stats = {
    totalJobs: await Job.countDocuments(),
    totalJobsChange: await calculateChange(Job),

    activeJobs: await Job.countDocuments({ status: "active" }),
    activeJobsChange: await calculateChange(Job, { status: "active" }),

    featuredJobs: await Job.countDocuments({ featured: true }),
    featuredJobsChange: await calculateChange(Job, { featured: true }),

    totalUsers: await User.countDocuments(),
    totalUsersChange: await calculateChange(User),

    verifiedEmployers: await User.countDocuments({
      role: "employer",
      "companyProfile.accStatus": "verified",
    }),
    verifiedEmployersChange: await calculateChange(User, {
      role: "employer",
      "companyProfile.accStatus": "verified",
    }),

    freeUsers: await User.countDocuments({ "subscription.tier": "free" }),
    freeUsersChange: await calculateChange(User, {
      "subscription.tier": "free",
    }),

    starterUsers: await User.countDocuments({ "subscription.tier": "starter" }),
    starterUsersChange: await calculateChange(User, {
      "subscription.tier": "starter",
    }),

    professionalUsers: await User.countDocuments({
      "subscription.tier": "professional",
    }),
    professionalUsersChange: await calculateChange(User, {
      "subscription.tier": "professional",
    }),
  };

  // 4. Advanced Analytics (from getAdminStats)
  const jobsByVisaType = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $unwind: `$visaTypes` },
    { $group: { _id: `$visaTypes`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { visaType: `$_id`, count: 1, _id: 0 } },
  ]);

  const jobsByLocation = await Job.aggregate([
    { $match: { status: { $in: ["active", "reported"] } } },
    { $group: { _id: `$location.city`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { city: `$_id`, count: 1, _id: 0 } },
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
        companyName: `$employer.companyProfile.companyName`,
        jobCount: 1,
      },
    },
  ]);

  const platformAnalytics = await Job.aggregate([
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

  const bugReports = await BugReport.find()
    .sort({ createdAt: -1 })
    .populate("reportedBy", "name email");

  const discounts = await Discount.find().sort("-createdAt");

  // Check for expired discounts and update them
  for (const discount of discounts) {
    if (
      discount.isActive &&
      discount.expiresAt &&
      new Date() > discount.expiresAt
    ) {
      discount.isActive = false;
      await discount.save();
    }
  }

  res.status(200).render("adminDashboard", {
    title: "Admin Dashboard",
    reportedJobs,
    unverifiedEmployers,
    bugReports,
    discounts,
    stats,
    analytics: {
      jobsByVisaType,
      jobsByLocation,
      topEmployers,
      platform: platformAnalytics[0] || {
        totalViews: 0,
        totalClicks: 0,
        totalSaves: 0,
      },
    },
  });
});

exports.getEmployerDashboard = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .select(
      `title analytics.views analytics.applicationClicks analytics.saves postedDate featured status isAdminPosted`
    )
    .sort(`-postedDate`);

  // Check for active discount and ensure it hasn't expired
  let activeDiscount = await Discount.findOne({ isActive: true });
  if (
    activeDiscount &&
    activeDiscount.expiresAt &&
    new Date() > activeDiscount.expiresAt
  ) {
    activeDiscount.isActive = false;
    await activeDiscount.save();
    activeDiscount = null;
  }

  const featuredJobs = jobs.filter((job) => job.featured);
  const regularJobs = jobs.filter((job) => !job.featured);

  const calculateAnalytics = (jobsList) => {
    return jobsList.map((job) => ({
      ...job.toObject(),
      conversionRate:
        job.analytics.views > 0
          ? (
              (job.analytics.applicationClicks / job.analytics.views) *
              100
            ).toFixed(1)
          : 0,
    }));
  };

  const analytics = {
    allJobs: calculateAnalytics(jobs),
    regularJobs: calculateAnalytics(regularJobs),
    featuredJobs: calculateAnalytics(featuredJobs),
    summary: {
      totalJobs: jobs.length,
      featuredCount: featuredJobs.length,
      regularCount: regularJobs.length,
      totalViews: jobs.reduce(
        (sum, job) => sum + (job.analytics.views || 0),
        0
      ),
      totalClicks: jobs.reduce(
        (sum, job) => sum + (job.analytics.applicationClicks || 0),
        0
      ),
      featuredViews: featuredJobs.reduce(
        (sum, job) => sum + (job.analytics.views || 0),
        0
      ),
      featuredClicks: featuredJobs.reduce(
        (sum, job) => sum + (job.analytics.applicationClicks || 0),
        0
      ),
    },
  };

  res.render(`employerDashboard`, {
    title: `Dashboard`,
    jobs: analytics,
    activeDiscount,
  });
});

exports.getJobSearch = (req, res, next) => {
  res.render(`job-search`, {
    title: `Search UK Visa Jobs`,
  });
};

exports.getEmployerSignup = (req, res) => {
  res.status(200).render("signup-employer", {
    title: "Create Employer Account",
  });
};

exports.getClaimAccount = (req, res) => {
  res.status(200).render("claim-account", {
    title: "Claim your account",
    token: req.params.token,
  });
};

exports.getJobResults = catchAsync(async (req, res, next) => {
  const { search, location, distance } = req.query;

  const queryObj = { status: { $in: [`active`, `reported`] } };

  if (search) {
    const searchTerms = search.trim().split(/\s+/);
    const searchConditions = searchTerms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { companyName: { $regex: term, $options: "i" } },
        { "location.city": { $regex: term, $options: "i" } },
      ],
    }));

    if (searchConditions.length > 0) {
      queryObj.$and = searchConditions;
    }
  }

  if (location && distance) {
    try {
      const coords = await geoPostcode(location);
      if (coords && coords.coordinates) {
        queryObj["location.coordinates"] = {
          $geoWithin: {
            $centerSphere: [coords.coordinates, +distance / 6378.1],
          },
        };
      } else {
        queryObj["location.city"] = { $regex: location, $options: `i` };
      }
    } catch (err) {
      queryObj["location.city"] = { $regex: location, $options: `i` };
    }
  } else if (location) {
    queryObj["location.city"] = { $regex: location, $options: `i` };
  }

  const jobs = await Job.find(queryObj)
    .populate(`postedBy`, `name`)
    .select(
      `title visaTypes location experienceLevel salaryRange jobType postedDate postedBy description featured`
    )
    .sort(`-featured -postedDated`);

  res.status(200).render(`search-results`, {
    title: `Search Results`,
    jobs,
    searchParams: { search, location, distance },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { "analytics.views": 1 } }, // Updated to match schema structure
    { new: true }
  ).populate(`postedBy`);

  if (!job) {
    return next(new AppError(`Job not found`, 404));
  }

  res.render(`job-detail`, {
    title: job.title,
    job,
  });
});

exports.getClaimAccount = (req, res) => {
  res.status(200).render("claim-account", {
    title: "Claim your account",
    token: req.params.token,
  });
};

exports.getSitemap = catchAsync(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const jobs = await Job.find({ status: "active" }).select(
    "title _id updatedAt"
  );

  const staticPages = [
    "",
    "/search",
    "/employer-signup",
    "/login",
    "/signup",
    "/privacy",
    "/terms",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((url) => {
      return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === "" ? 1.0 : 0.8}</priority>
  </url>`;
    })
    .join("")}
  ${jobs
    .map((job) => {
      const slug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `
  <url>
    <loc>${baseUrl}/job/${slug}/${job._id}</loc>
    <lastmod>${job.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

exports.getSavedJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({
    _id: { $in: req.user.savedJobs },
    status: { $in: ["active", "reported"] },
  })
    .populate("postedBy", "name")
    .select(
      "title visaTypes location experienceLevel salaryRange jobType postedDate postedBy description featured"
    )
    .sort("-featured -postedDate");

  res.status(200).render("saved-jobs", {
    title: "Saved Jobs",
    jobs,
    searchParams: {},
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Create your account",
  });
};

exports.getProfile = (req, res) => {
  res.status(200).render("profile", {
    title: "Your Profile",
  });
};

exports.getCv = catchAsync(async (req, res, next) => {
  const filename = req.params.filename;
  // Optional: Check if user is allowed to view this CV
  // For now, we assume if they have the link (filename), they can view it,
  // or you can restrict it to the owner:
  // if (req.user.cv !== filename && req.user.role !== 'admin') ...

  try {
    const { stream, contentType } = await r2.getFileStream(filename);
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    } else {
      res.setHeader("Content-Type", "application/pdf");
    }
    stream.pipe(res);
  } catch (err) {
    return next(new AppError("CV not found", 404));
  }
});

exports.getForgotPassword = (req, res) => {
  res.status(200).render("forgot-password", {
    title: "Forgot Password",
  });
};

exports.getResetPassword = (req, res) => {
  res.status(200).render(`reset-password`, {
    title: `Reset your password`,
    token: req.params.token,
  });
};

exports.getClaimAccount = (req, res) => {
  res.status(200).render("claim-account", {
    title: "Claim your account",
    token: req.params.token,
  });
};

exports.getPrivacy = (req, res) => {
  res.status(200).render("privacy", {
    title: "Privacy Policy",
  });
};

exports.getTerms = (req, res) => {
  res.status(200).render("terms", {
    title: "Terms of Service",
  });
};
