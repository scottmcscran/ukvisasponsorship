"use strict";

var Job = require("./../models/jobModel");

var User = require("./../models/userModel");

var factory = require("./handlerFactory");

var AppError = require("../utils/appError");

var ApiFeatures = require("../utils/apiFeatures");

var _require = require("../utils/geoPostcode"),
    geoPostcode = _require.geoPostcode;

var _require2 = require("../utils/catchAsync"),
    catchAsync = _require2.catchAsync;

var multer = require("multer");

var Email = require("../utils/email");

var r2 = require("../utils/r2");

var multerStorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith("application/pdf") || file.mimetype.startsWith("application/msword") || file.mimetype.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
    cb(null, true);
  } else {
    cb(new AppError("Not a valid file! Please upload only PDF or Word documents.", 400), false);
  }
};

var upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
exports.uploadCv = upload.single("cv");
exports.applyJob = catchAsync(function _callee(req, res, next) {
  var job, cvFile, cvBuffer, ext, finalFilename, employer, email;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Job.findById(req.params.id).populate("postedBy"));

        case 2:
          job = _context.sent;

          if (job) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", next(new AppError("Job not found", 404)));

        case 5:
          if (!(req.body.useProfileCv === "true")) {
            _context.next = 20;
            break;
          }

          if (req.user.cv) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", next(new AppError("No CV found on your profile", 400)));

        case 8:
          _context.prev = 8;
          _context.next = 11;
          return regeneratorRuntime.awrap(r2.getFileBuffer(req.user.cv));

        case 11:
          cvBuffer = _context.sent;
          cvFile = {
            originalname: req.user.cv,
            buffer: cvBuffer
          };
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](8);
          return _context.abrupt("return", next(new AppError("Error reading profile CV", 500)));

        case 18:
          _context.next = 33;
          break;

        case 20:
          if (!req.file) {
            _context.next = 32;
            break;
          }

          cvFile = req.file; // Save to profile if requested

          if (!(req.body.saveCvToProfile === "true")) {
            _context.next = 30;
            break;
          }

          ext = req.file.mimetype.split("/")[1];

          if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            ext = "docx";
          } else if (req.file.mimetype === "application/msword") {
            ext = "doc";
          }

          finalFilename = "user-".concat(req.user.id, "-").concat(Date.now(), ".").concat(ext);
          _context.next = 28;
          return regeneratorRuntime.awrap(r2.uploadFile(req.file.buffer, finalFilename, req.file.mimetype));

        case 28:
          _context.next = 30;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            cv: finalFilename
          }));

        case 30:
          _context.next = 33;
          break;

        case 32:
          return _context.abrupt("return", next(new AppError("Please upload a CV or use your profile CV", 400)));

        case 33:
          employer = job.postedBy;

          if (employer) {
            _context.next = 36;
            break;
          }

          return _context.abrupt("return", next(new AppError("Employer information not found", 404)));

        case 36:
          // Send email to employer
          email = new Email(employer, "https://ukvisasponsorship.com/jobs/".concat(job._id));
          _context.next = 39;
          return regeneratorRuntime.awrap(email.sendApplication(req.user, job, cvFile));

        case 39:
          _context.next = 41;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.applicationClicks": 1
            }
          }));

        case 41:
          _context.next = 43;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $addToSet: {
              appliedJobs: job._id
            }
          }));

        case 43:
          res.status(200).json({
            status: "success",
            message: "Application sent successfully!"
          });

        case 44:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 15]]);
}); // Tracking

exports.trackRedirect = catchAsync(function _callee2(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.applicationClicks": 1
            }
          }, {
            "new": true
          }));

        case 2:
          job = _context2.sent;

          if (job) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError("Job not found", 404)));

        case 5:
          res.redirect(job.applicationUrl);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.trackSave = catchAsync(function _callee3(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.saves": 1
            }
          }, {
            "new": true
          }));

        case 2:
          job = _context3.sent;

          if (job) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Job not found", 404)));

        case 5:
          next();

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.trackUnSave = catchAsync(function _callee4(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.saves": -1
            }
          }, {
            "new": true
          }));

        case 2:
          job = _context4.sent;

          if (job) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("Job not found", 404)));

        case 5:
          next();

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.reportJob = catchAsync(function _callee5(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              reports: 1
            },
            status: "reported" // Automatically set status to reported

          }, {
            "new": true
          }));

        case 2:
          job = _context5.sent;

          if (job) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("No job found with that ID", 404)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Job reported successfully"
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.saveJob = catchAsync(function _callee6(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $addToSet: {
              savedJobs: req.params.id
            }
          }));

        case 2:
          job = _context6.sent;

          if (job) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(new AppError("no job with that id was found", 400)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Job saved"
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.unSaveJob = catchAsync(function _callee7(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $pull: {
              savedJobs: req.params.id
            }
          }));

        case 2:
          job = _context7.sent;

          if (job) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", next(new AppError("no job with that id was found", 400)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Job removed from your saved posts"
          });

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.getAllSavedJobs = catchAsync(function _callee8(req, res, next) {
  var filter, searchTerms, searchConditions, locationQuery, distance, coords, localRadiusMiles, localRadiusMeters, pipeline, _jobs, features, isUsingNear, jobs;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          filter = {
            status: {
              $in: ["active", "reported"]
            },
            _id: {
              $in: req.user.savedJobs
            }
          };

          if (req.query.search) {
            searchTerms = req.query.search.trim().split(/\s+/);
            searchConditions = searchTerms.map(function (term) {
              return {
                $or: [{
                  title: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  description: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  companyName: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  "location.city": {
                    $regex: term,
                    $options: "i"
                  }
                }]
              };
            });

            if (searchConditions.length > 0) {
              filter.$and = searchConditions;
            }

            delete req.query.search;
          }

          if (req.query.visaTypes) {
            filter.visaTypes = {
              $in: req.query.visaTypes.split(",")
            };
            delete req.query.visaTypes;
          }

          if (req.query.remoteWork) {
            filter["location.remote"] = {
              $in: req.query.remoteWork.split(",")
            };
            delete req.query.remoteWork;
          }

          if (req.query.experienceLevel) {
            filter.experienceLevel = req.query.experienceLevel;
            delete req.query.experienceLevel;
          }

          if (req.query.salaryMin) {
            filter["salaryRange.min"] = {
              $gte: +req.query.salaryMin
            };
            delete req.query.salaryMin;
          }

          if (req.query.salaryMax) {
            filter["salaryRange.max"] = {
              $lte: +req.query.salaryMax
            };
            delete req.query.salaryMax;
          } // Location Search Logic


          if (!req.query.location) {
            _context8.next = 31;
            break;
          }

          locationQuery = req.query.location.trim();
          distance = req.query.distance ? +req.query.distance : 10000;
          _context8.prev = 10;
          _context8.next = 13;
          return regeneratorRuntime.awrap(geoPostcode(locationQuery));

        case 13:
          coords = _context8.sent;

          if (!(coords && coords.coordinates)) {
            _context8.next = 22;
            break;
          }

          // Use Aggregation for Location Search
          // Define "Local" radius (e.g. 25 miles) for prioritizing Featured jobs.
          // If user selected a specific distance, that is the limit.
          // If distance is large (10000), we use 25 miles as the "Local" cutoff.
          localRadiusMiles = 25;
          localRadiusMeters = localRadiusMiles * 1609.34;
          pipeline = [{
            $geoNear: {
              near: {
                type: "Point",
                coordinates: coords.coordinates
              },
              distanceField: "distance",
              maxDistance: distance * 1609.34,
              spherical: true,
              query: filter,
              key: "location.coordinates"
            }
          }, {
            $addFields: {
              // Priority Group: 1 = Local, 2 = Far
              distanceGroup: {
                $cond: {
                  "if": {
                    $lte: ["$distance", localRadiusMeters]
                  },
                  then: 1,
                  "else": 2
                }
              }
            }
          }, {
            $sort: {
              distanceGroup: 1,
              featured: -1,
              distance: 1,
              postedDate: -1
            }
          }, {
            $lookup: {
              from: "users",
              localField: "postedBy",
              foreignField: "_id",
              as: "postedBy"
            }
          }, {
            $unwind: "$postedBy"
          }];
          _context8.next = 20;
          return regeneratorRuntime.awrap(Job.aggregate(pipeline));

        case 20:
          _jobs = _context8.sent;
          return _context8.abrupt("return", res.status(200).json({
            status: "success",
            results: _jobs.length,
            data: {
              jobs: _jobs
            }
          }));

        case 22:
          _context8.next = 27;
          break;

        case 24:
          _context8.prev = 24;
          _context8.t0 = _context8["catch"](10);
          // Fallback to text search if geocoding fails
          filter.$or = [{
            "location.city": {
              $regex: locationQuery,
              $options: "i"
            }
          }, {
            "location.postcode": {
              $regex: locationQuery,
              $options: "i"
            }
          }];

        case 27:
          // Cleanup
          delete req.query.location;
          delete req.query.distance;
          delete req.query.lat;
          delete req.query.lng;

        case 31:
          if (!req.query.limit) {
            req.query.limit = "5000";
          }

          features = new ApiFeatures(Job.find(filter), req.query); // Only sort if NOT using $near (which is implied if we have location.coordinates AND distance >= 500)

          isUsingNear = filter["location.coordinates"] && filter["location.coordinates"].$near;

          if (!isUsingNear) {
            features.sort();
          }

          features.limitFields().paginate();
          _context8.next = 38;
          return regeneratorRuntime.awrap(features.query.populate("postedBy", "name"));

        case 38:
          jobs = _context8.sent;
          res.status(200).json({
            status: "success",
            results: jobs.length,
            data: {
              jobs: jobs
            }
          });

        case 40:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[10, 24]]);
});
exports.getAllJobs = catchAsync(function _callee9(req, res, next) {
  var filter, searchTerms, searchConditions, locationQuery, distance, coords, localRadiusMiles, localRadiusMeters, pipeline, _jobs2, features, isUsingNear, jobs;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          filter = {
            status: {
              $in: ["active", "reported"]
            }
          };

          if (req.query.search) {
            searchTerms = req.query.search.trim().split(/\s+/);
            searchConditions = searchTerms.map(function (term) {
              return {
                $or: [{
                  title: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  description: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  companyName: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  "location.city": {
                    $regex: term,
                    $options: "i"
                  }
                }]
              };
            });

            if (searchConditions.length > 0) {
              filter.$and = searchConditions;
            }

            console.log("Search Filter:", JSON.stringify(filter, null, 2));
            delete req.query.search;
          }

          if (req.query.visaTypes) {
            filter.visaTypes = {
              $in: req.query.visaTypes.split(",")
            };
            delete req.query.visaTypes;
          } // Location Search Logic


          if (!req.query.location) {
            _context9.next = 27;
            break;
          }

          locationQuery = req.query.location.trim();
          distance = req.query.distance ? +req.query.distance : 10000;
          _context9.prev = 6;
          _context9.next = 9;
          return regeneratorRuntime.awrap(geoPostcode(locationQuery));

        case 9:
          coords = _context9.sent;

          if (!(coords && coords.coordinates)) {
            _context9.next = 18;
            break;
          }

          // Use Aggregation for Location Search
          // Define "Local" radius (e.g. 25 miles) for prioritizing Featured jobs.
          // If user selected a specific distance, that is the limit.
          // If distance is large (10000), we use 25 miles as the "Local" cutoff.
          localRadiusMiles = 25;
          localRadiusMeters = localRadiusMiles * 1609.34;
          pipeline = [{
            $geoNear: {
              near: {
                type: "Point",
                coordinates: coords.coordinates
              },
              distanceField: "distance",
              maxDistance: distance * 1609.34,
              spherical: true,
              query: filter,
              key: "location.coordinates"
            }
          }, {
            $addFields: {
              // Priority Group: 1 = Local, 2 = Far
              distanceGroup: {
                $cond: {
                  "if": {
                    $lte: ["$distance", localRadiusMeters]
                  },
                  then: 1,
                  "else": 2
                }
              }
            }
          }, {
            $sort: {
              distanceGroup: 1,
              featured: -1,
              distance: 1,
              postedDate: -1
            }
          }, {
            $lookup: {
              from: "users",
              localField: "postedBy",
              foreignField: "_id",
              as: "postedBy"
            }
          }, {
            $unwind: "$postedBy"
          }];
          _context9.next = 16;
          return regeneratorRuntime.awrap(Job.aggregate(pipeline));

        case 16:
          _jobs2 = _context9.sent;
          return _context9.abrupt("return", res.status(200).json({
            status: "success",
            results: _jobs2.length,
            data: {
              jobs: _jobs2
            }
          }));

        case 18:
          _context9.next = 23;
          break;

        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](6);
          // Fallback to text search if geocoding fails
          filter.$or = [{
            "location.city": {
              $regex: locationQuery,
              $options: "i"
            }
          }, {
            "location.postcode": {
              $regex: locationQuery,
              $options: "i"
            }
          }];

        case 23:
          // Cleanup
          delete req.query.location;
          delete req.query.distance;
          delete req.query.lat;
          delete req.query.lng;

        case 27:
          if (req.query.remoteWork) {
            filter["location.remote"] = {
              $in: req.query.remoteWork.split(",")
            };
            delete req.query.remoteWork;
          }

          if (req.query.experienceLevel) {
            filter.experienceLevel = req.query.experienceLevel;
            delete req.query.experienceLevel;
          }

          if (req.query.salaryMin) {
            filter["salaryRange.min"] = {
              $gte: +req.query.salaryMin
            };
            delete req.query.salaryMin;
          }

          if (req.query.salaryMax) {
            filter["salaryRange.max"] = {
              $lte: +req.query.salaryMax
            };
            delete req.query.salaryMax;
          }

          if (!req.query.limit) {
            req.query.limit = "5000";
          }

          features = new ApiFeatures(Job.find(filter), req.query); // Only sort if NOT using $near (which is implied if we have location.coordinates AND distance >= 500)
          // If we used $geoWithin (distance < 500), we CAN sort.
          // If we used $near, we CANNOT sort (it throws error if we try to sort by something else usually, or just ignores it).
          // Actually, Mongoose/MongoDB allows secondary sort with $near but $near must be first.
          // But let's stick to our strategy:
          // Small radius -> Sort by Featured (default)
          // Large radius -> Sort by Distance ($near handles this)

          isUsingNear = filter["location.coordinates"] && filter["location.coordinates"].$near;

          if (!isUsingNear) {
            features.sort();
          }

          features.limitFields().paginate();
          _context9.next = 38;
          return regeneratorRuntime.awrap(features.query.populate("postedBy", "name"));

        case 38:
          jobs = _context9.sent;
          res.status(200).json({
            status: "success",
            results: jobs.length,
            data: {
              jobs: jobs
            }
          });

        case 40:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[6, 20]]);
});
exports.getJob = catchAsync(function _callee10(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.views": 1
            }
          }, {
            "new": true
          }).populate("postedBy", "name companyProfile"));

        case 2:
          job = _context10.sent;

          if (job) {
            _context10.next = 5;
            break;
          }

          return _context10.abrupt("return", next(new AppError("No job found with that ID", 404)));

        case 5:
          res.status(200).json({
            status: "success",
            data: {
              job: job
            }
          });

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  });
});
exports.createJob = catchAsync(function _callee11(req, res, next) {
  var user, tier, status, activeJobsCount, featuredJobsCount, limit, location, job;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          user = req.user; // Admin override to post on behalf of another user

          if (!(req.user.role === "admin" && req.body.postedBy)) {
            _context11.next = 10;
            break;
          }

          _context11.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.body.postedBy));

        case 4:
          user = _context11.sent;

          if (user) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", next(new AppError("User not found", 404)));

        case 7:
          req.body.isAdminPosted = true; // Mark as admin posted

          _context11.next = 11;
          break;

        case 10:
          // Ensure postedBy is set to current user for non-admins
          req.body.postedBy = req.user.id;

        case 11:
          tier = user.subscription.tier;
          status = user.subscription.status; // 1. Check Active Job Limits

          _context11.next = 15;
          return regeneratorRuntime.awrap(Job.countDocuments({
            postedBy: user.id,
            status: "active"
          }));

        case 15:
          activeJobsCount = _context11.sent;

          if (!(tier === "free" && activeJobsCount >= 3)) {
            _context11.next = 18;
            break;
          }

          return _context11.abrupt("return", next(new AppError("Free plan limit reached (3 active jobs). Please upgrade to post more.", 403)));

        case 18:
          if (!req.body.featured) {
            _context11.next = 29;
            break;
          }

          if (!(tier === "free" || status !== "active")) {
            _context11.next = 21;
            break;
          }

          return _context11.abrupt("return", next(new AppError("Featured jobs are only available on paid plans.", 403)));

        case 21:
          _context11.next = 23;
          return regeneratorRuntime.awrap(Job.countDocuments({
            postedBy: user.id,
            status: "active",
            featured: true
          }));

        case 23:
          featuredJobsCount = _context11.sent;
          limit = 0;
          if (tier === "starter") limit = 3;
          if (tier === "professional") limit = 10;

          if (!(featuredJobsCount >= limit)) {
            _context11.next = 29;
            break;
          }

          return _context11.abrupt("return", next(new AppError("Featured job limit reached (".concat(limit, " for ").concat(tier, " plan)."), 403)));

        case 29:
          location = req.body.location;
          _context11.next = 32;
          return regeneratorRuntime.awrap(geoPostcode(location.postcode, next));

        case 32:
          location.coordinates = _context11.sent;
          // Ensure postedBy is set to current user
          req.body.postedBy = user.id;
          _context11.next = 36;
          return regeneratorRuntime.awrap(Job.create(req.body));

        case 36:
          job = _context11.sent;
          res.status(201).json({
            status: "success",
            data: {
              job: job
            }
          });

        case 38:
        case "end":
          return _context11.stop();
      }
    }
  });
});
exports.updateJob = catchAsync(function _callee12(req, res, next) {
  var user, tier, status, featuredJobsCount, limit, job;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          user = req.user;
          tier = user.subscription.tier;
          status = user.subscription.status; // Check if trying to feature a job

          if (!(req.body.featured === true)) {
            _context12.next = 14;
            break;
          }

          if (!(tier === "free" || status !== "active")) {
            _context12.next = 6;
            break;
          }

          return _context12.abrupt("return", next(new AppError("Featured jobs are only available on paid plans.", 403)));

        case 6:
          _context12.next = 8;
          return regeneratorRuntime.awrap(Job.countDocuments({
            postedBy: user.id,
            status: "active",
            featured: true,
            _id: {
              $ne: req.params.id
            } // Exclude current job if it was already featured

          }));

        case 8:
          featuredJobsCount = _context12.sent;
          limit = 0;
          if (tier === "starter") limit = 3;
          if (tier === "professional") limit = 10;

          if (!(featuredJobsCount >= limit)) {
            _context12.next = 14;
            break;
          }

          return _context12.abrupt("return", next(new AppError("Featured job limit reached (".concat(limit, " for ").concat(tier, " plan)."), 403)));

        case 14:
          _context12.next = 16;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 16:
          job = _context12.sent;

          if (job) {
            _context12.next = 19;
            break;
          }

          return _context12.abrupt("return", next(new AppError("No job found with that ID", 404)));

        case 19:
          res.status(200).json({
            status: "success",
            data: {
              job: job
            }
          });

        case 20:
        case "end":
          return _context12.stop();
      }
    }
  });
});
exports.deleteJob = factory.deleteOne(Job);
exports.unfeatureJob = catchAsync(function _callee13(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(Job.findById(req.params.id));

        case 2:
          job = _context13.sent;

          if (job) {
            _context13.next = 5;
            break;
          }

          return _context13.abrupt("return", next(new AppError("No job found with that ID", 404)));

        case 5:
          if (!(job.postedBy.toString() !== req.user.id)) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", next(new AppError("You do not have permission to update this job", 403)));

        case 7:
          // 3. Update job
          job.featured = false;
          job.status = "active"; // Attempt to reactivate
          // Ensure coordinates are valid (fix for potential missing geo keys)

          if (!(!job.location.coordinates || !job.location.coordinates.coordinates || job.location.coordinates.coordinates.length !== 2)) {
            _context13.next = 13;
            break;
          }

          _context13.next = 12;
          return regeneratorRuntime.awrap(geoPostcode(job.location.postcode, next));

        case 12:
          job.location.coordinates = _context13.sent;

        case 13:
          _context13.next = 15;
          return regeneratorRuntime.awrap(job.save());

        case 15:
          res.status(200).json({
            status: "success",
            data: {
              job: job
            }
          });

        case 16:
        case "end":
          return _context13.stop();
      }
    }
  });
});