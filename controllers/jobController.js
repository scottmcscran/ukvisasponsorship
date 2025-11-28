const Job = require(`./../models/jobModel`);
const User = require(`./../models/userModel`);
const factory = require(`./handlerFactory`);
const AppError = require(`../utils/appError`);
const ApiFeatures = require(`../utils/apiFeatures`);
const { geoPostcode } = require(`../utils/geoPostcode`);
const { catchAsync } = require(`../utils/catchAsync`);
const multer = require("multer");
const Email = require("../utils/email");
const r2 = require("../utils/r2");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("application/pdf") ||
    file.mimetype.startsWith("application/msword") ||
    file.mimetype.startsWith(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not a valid file! Please upload only PDF or Word documents.",
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadCv = upload.single("cv");

exports.applyJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate("postedBy");
  if (!job) return next(new AppError("Job not found", 404));

  let cvFile;

  // Case 1: Use Profile CV
  if (req.body.useProfileCv === "true") {
    if (!req.user.cv) {
      return next(new AppError("No CV found on your profile", 400));
    }
    try {
      const cvBuffer = await r2.getFileBuffer(req.user.cv);
      cvFile = {
        originalname: req.user.cv,
        buffer: cvBuffer,
      };
    } catch (err) {
      return next(new AppError("Error reading profile CV", 500));
    }
  }
  // Case 2: Upload New CV
  else if (req.file) {
    cvFile = req.file;

    // Save to profile if requested
    if (req.body.saveCvToProfile === "true") {
      let ext = req.file.mimetype.split("/")[1];
      if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        ext = "docx";
      } else if (req.file.mimetype === "application/msword") {
        ext = "doc";
      }
      const finalFilename = `user-${req.user.id}-${Date.now()}.${ext}`;

      await r2.uploadFile(req.file.buffer, finalFilename, req.file.mimetype);

      await User.findByIdAndUpdate(req.user.id, { cv: finalFilename });
    }
  } else {
    return next(new AppError("Please upload a CV or use your profile CV", 400));
  }

  const employer = job.postedBy;
  if (!employer) {
    return next(new AppError("Employer information not found", 404));
  }

  // Send email to employer
  const email = new Email(
    employer,
    `https://ukvisasponsorship.com/jobs/${job._id}`
  );
  await email.sendApplication(req.user, job, cvFile);

  // Track application
  await Job.findByIdAndUpdate(req.params.id, {
    $inc: { "analytics.applicationClicks": 1 },
  });

  // Add to user's applied jobs
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { appliedJobs: job._id },
  });

  res.status(200).json({
    status: "success",
    message: "Application sent successfully!",
  });
});

// Tracking
exports.trackRedirect = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { "analytics.applicationClicks": 1 } },
    { new: true }
  );

  if (!job) {
    return next(new AppError(`Job not found`, 404));
  }

  res.redirect(job.applicationUrl);
});

exports.trackSave = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { "analytics.saves": 1 } },
    { new: true }
  );

  if (!job) {
    return next(new AppError(`Job not found`, 404));
  }

  next();
});

exports.trackUnSave = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { "analytics.saves": -1 } },
    { new: true }
  );

  if (!job) {
    return next(new AppError(`Job not found`, 404));
  }

  next();
});

exports.reportJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { reports: 1 },
      status: "reported", // Automatically set status to reported
    },
    { new: true }
  );

  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Job reported successfully",
  });
});

exports.saveJob = catchAsync(async (req, res, next) => {
  const job = await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { savedJobs: req.params.id },
  });

  if (!job) return next(new AppError(`no job with that id was found`, 400));

  res.status(200).json({
    status: `success`,
    message: `Job saved`,
  });
});

exports.unSaveJob = catchAsync(async (req, res, next) => {
  const job = await User.findByIdAndUpdate(req.user.id, {
    $pull: { savedJobs: req.params.id },
  });

  if (!job) return next(new AppError(`no job with that id was found`, 400));

  res.status(200).json({
    status: `success`,
    message: `Job removed from your saved posts`,
  });
});

exports.getAllSavedJobs = catchAsync(async (req, res, next) => {
  const filter = {
    status: { $in: [`active`, `reported`] },
    _id: { $in: req.user.savedJobs },
  };

  if (req.query.search) {
    const searchTerms = req.query.search.trim().split(/\s+/);

    const searchConditions = searchTerms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { companyName: { $regex: term, $options: "i" } },
        { "location.city": { $regex: term, $options: "i" } },
      ],
    }));

    if (searchConditions.length > 0) {
      filter.$and = searchConditions;
    }

    delete req.query.search;
  }

  if (req.query.visaTypes) {
    filter.visaTypes = { $in: req.query.visaTypes.split(`,`) };
    delete req.query.visaTypes;
  }

  if (req.query.remoteWork) {
    filter[`location.remote`] = {
      $in: req.query.remoteWork.split(`,`),
    };
    delete req.query.remoteWork;
  }
  if (req.query.experienceLevel) {
    filter.experienceLevel = req.query.experienceLevel;
    delete req.query.experienceLevel;
  }
  if (req.query.salaryMin) {
    filter[`salaryRange.min`] = { $gte: +req.query.salaryMin };
    delete req.query.salaryMin;
  }
  if (req.query.salaryMax) {
    filter[`salaryRange.max`] = { $lte: +req.query.salaryMax };
    delete req.query.salaryMax;
  }

  // Location Search Logic
  if (req.query.location) {
    const locationQuery = req.query.location.trim();
    const distance = req.query.distance ? +req.query.distance : 10000;

    try {
      const coords = await geoPostcode(locationQuery);

      if (coords && coords.coordinates) {
        // Use Aggregation for Location Search

        // Define "Local" radius (e.g. 25 miles) for prioritizing Featured jobs.
        // If user selected a specific distance, that is the limit.
        // If distance is large (10000), we use 25 miles as the "Local" cutoff.
        const localRadiusMiles = 25;
        const localRadiusMeters = localRadiusMiles * 1609.34;

        const pipeline = [
          {
            $geoNear: {
              near: { type: "Point", coordinates: coords.coordinates },
              distanceField: "distance",
              maxDistance: distance * 1609.34,
              spherical: true,
              query: filter,
              key: "location.coordinates",
            },
          },
          {
            $addFields: {
              // Priority Group: 1 = Local, 2 = Far
              distanceGroup: {
                $cond: {
                  if: { $lte: ["$distance", localRadiusMeters] },
                  then: 1,
                  else: 2,
                },
              },
            },
          },
          {
            $sort: {
              distanceGroup: 1,
              featured: -1,
              distance: 1,
              postedDate: -1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "postedBy",
              foreignField: "_id",
              as: "postedBy",
            },
          },
          { $unwind: "$postedBy" },
        ];

        const jobs = await Job.aggregate(pipeline);

        return res.status(200).json({
          status: `success`,
          results: jobs.length,
          data: { jobs },
        });
      }
    } catch (err) {
      // Fallback to text search if geocoding fails
      filter.$or = [
        { "location.city": { $regex: locationQuery, $options: "i" } },
        { "location.postcode": { $regex: locationQuery, $options: "i" } },
      ];
    }

    // Cleanup
    delete req.query.location;
    delete req.query.distance;
    delete req.query.lat;
    delete req.query.lng;
  }

  if (!req.query.limit) {
    req.query.limit = "5000";
  }

  const features = new ApiFeatures(Job.find(filter), req.query);

  // Only sort if NOT using $near (which is implied if we have location.coordinates AND distance >= 500)
  const isUsingNear =
    filter["location.coordinates"] && filter["location.coordinates"].$near;

  if (!isUsingNear) {
    features.sort();
  }

  features.limitFields().paginate();

  const jobs = await features.query.populate(`postedBy`, `name`);

  res.status(200).json({
    status: `success`,
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const filter = { status: { $in: [`active`, `reported`] } };

  if (req.query.search) {
    const searchTerms = req.query.search.trim().split(/\s+/);

    const searchConditions = searchTerms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { companyName: { $regex: term, $options: "i" } },
        { "location.city": { $regex: term, $options: "i" } },
      ],
    }));

    if (searchConditions.length > 0) {
      filter.$and = searchConditions;
    }

    delete req.query.search;
  }

  if (req.query.visaTypes) {
    filter.visaTypes = { $in: req.query.visaTypes.split(`,`) };
    delete req.query.visaTypes;
  }

  // Location Search Logic
  if (req.query.location) {
    const locationQuery = req.query.location.trim();
    const distance = req.query.distance ? +req.query.distance : 10000;

    try {
      const coords = await geoPostcode(locationQuery);

      if (coords && coords.coordinates) {
        // Use Aggregation for Location Search

        // Define "Local" radius (e.g. 25 miles) for prioritizing Featured jobs.
        // If user selected a specific distance, that is the limit.
        // If distance is large (10000), we use 25 miles as the "Local" cutoff.
        const localRadiusMiles = 25;
        const localRadiusMeters = localRadiusMiles * 1609.34;

        const pipeline = [
          {
            $geoNear: {
              near: { type: "Point", coordinates: coords.coordinates },
              distanceField: "distance",
              maxDistance: distance * 1609.34,
              spherical: true,
              query: filter,
              key: "location.coordinates",
            },
          },
          {
            $addFields: {
              // Priority Group: 1 = Local, 2 = Far
              distanceGroup: {
                $cond: {
                  if: { $lte: ["$distance", localRadiusMeters] },
                  then: 1,
                  else: 2,
                },
              },
            },
          },
          {
            $sort: {
              distanceGroup: 1,
              featured: -1,
              distance: 1,
              postedDate: -1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "postedBy",
              foreignField: "_id",
              as: "postedBy",
            },
          },
          { $unwind: "$postedBy" },
        ];

        const jobs = await Job.aggregate(pipeline);

        return res.status(200).json({
          status: `success`,
          results: jobs.length,
          data: { jobs },
        });
      }
    } catch (err) {
      // Fallback to text search if geocoding fails
      filter.$or = [
        { "location.city": { $regex: locationQuery, $options: "i" } },
        { "location.postcode": { $regex: locationQuery, $options: "i" } },
      ];
    }

    // Cleanup
    delete req.query.location;
    delete req.query.distance;
    delete req.query.lat;
    delete req.query.lng;
  }

  if (req.query.remoteWork) {
    filter[`location.remote`] = {
      $in: req.query.remoteWork.split(`,`),
    };
    delete req.query.remoteWork;
  }
  if (req.query.experienceLevel) {
    filter.experienceLevel = req.query.experienceLevel;
    delete req.query.experienceLevel;
  }
  if (req.query.salaryMin) {
    filter[`salaryRange.min`] = { $gte: +req.query.salaryMin };
    delete req.query.salaryMin;
  }
  if (req.query.salaryMax) {
    filter[`salaryRange.max`] = { $lte: +req.query.salaryMax };
    delete req.query.salaryMax;
  }

  if (!req.query.limit) {
    req.query.limit = "5000";
  }

  const features = new ApiFeatures(Job.find(filter), req.query);

  // Only sort if NOT using $near (which is implied if we have location.coordinates AND distance >= 500)
  // If we used $geoWithin (distance < 500), we CAN sort.
  // If we used $near, we CANNOT sort (it throws error if we try to sort by something else usually, or just ignores it).
  // Actually, Mongoose/MongoDB allows secondary sort with $near but $near must be first.
  // But let's stick to our strategy:
  // Small radius -> Sort by Featured (default)
  // Large radius -> Sort by Distance ($near handles this)

  const isUsingNear =
    filter["location.coordinates"] && filter["location.coordinates"].$near;

  if (!isUsingNear) {
    features.sort();
  }

  features.limitFields().paginate();

  const jobs = await features.query.populate(`postedBy`, `name`);

  res.status(200).json({
    status: `success`,
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { "analytics.views": 1 } },
    { new: true }
  ).populate("postedBy", "name companyProfile");

  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  let user = req.user;

  // Admin override to post on behalf of another user
  if (req.user.role === "admin" && req.body.postedBy) {
    user = await User.findById(req.body.postedBy);
    if (!user) return next(new AppError("User not found", 404));
    req.body.isAdminPosted = true; // Mark as admin posted
  } else {
    // Ensure postedBy is set to current user for non-admins
    req.body.postedBy = req.user.id;
  }

  const tier = user.subscription.tier;
  const status = user.subscription.status;

  // 1. Check Active Job Limits
  const activeJobsCount = await Job.countDocuments({
    postedBy: user.id,
    status: "active",
  });

  if (tier === "free" && activeJobsCount >= 3) {
    return next(
      new AppError(
        "Free plan limit reached (3 active jobs). Please upgrade to post more.",
        403
      )
    );
  }

  // 2. Check Featured Job Limits
  if (req.body.featured) {
    if (tier === "free" || status !== "active") {
      return next(
        new AppError("Featured jobs are only available on paid plans.", 403)
      );
    }

    const featuredJobsCount = await Job.countDocuments({
      postedBy: user.id,
      status: "active",
      featured: true,
    });

    let limit = 0;
    if (tier === "starter") limit = 3;
    if (tier === "professional") limit = 10;

    if (featuredJobsCount >= limit) {
      return next(
        new AppError(
          `Featured job limit reached (${limit} for ${tier} plan).`,
          403
        )
      );
    }
  }

  const location = req.body.location;
  location.coordinates = await geoPostcode(location.postcode, next);

  // Ensure postedBy is set to current user
  req.body.postedBy = user.id;

  const job = await Job.create(req.body);

  res.status(201).json({
    status: `success`,
    data: { job },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const user = req.user;
  const tier = user.subscription.tier;
  const status = user.subscription.status;

  // Check if trying to feature a job
  if (req.body.featured === true) {
    if (tier === "free" || status !== "active") {
      return next(
        new AppError("Featured jobs are only available on paid plans.", 403)
      );
    }

    const featuredJobsCount = await Job.countDocuments({
      postedBy: user.id,
      status: "active",
      featured: true,
      _id: { $ne: req.params.id }, // Exclude current job if it was already featured
    });

    let limit = 0;
    if (tier === "starter") limit = 3;
    if (tier === "professional") limit = 10;

    if (featuredJobsCount >= limit) {
      return next(
        new AppError(
          `Featured job limit reached (${limit} for ${tier} plan).`,
          403
        )
      );
    }
  }

  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

exports.deleteJob = factory.deleteOne(Job);

exports.unfeatureJob = catchAsync(async (req, res, next) => {
  // 1. Get the job
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }

  // 2. Check if the current user is the owner of the job
  if (job.postedBy.toString() !== req.user.id) {
    return next(
      new AppError("You do not have permission to update this job", 403)
    );
  }

  // 3. Update job
  job.featured = false;
  job.status = "active"; // Attempt to reactivate

  // Ensure coordinates are valid (fix for potential missing geo keys)
  if (
    !job.location.coordinates ||
    !job.location.coordinates.coordinates ||
    job.location.coordinates.coordinates.length !== 2
  ) {
    job.location.coordinates = await geoPostcode(job.location.postcode, next);
  }

  await job.save();

  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});
