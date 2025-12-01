"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Job = require("./../models/jobModel");

var User = require("./../models/userModel"); // Ensure User is imported


var BugReport = require("./../models/bugReportModel");

var Discount = require("./../models/discountModel");

var r2 = require("../utils/r2");

var _require = require("../utils/geoPostcode"),
    geoPostcode = _require.geoPostcode;

var _require2 = require("./../utils/catchAsync"),
    catchAsync = _require2.catchAsync;

var AppError = require("./../utils/appError");

var ApiFeatures = require("./../utils/apiFeatures"); // Helper to calculate % change


var calculateChange = function calculateChange(Model) {
  var query,
      now,
      yesterday,
      totalNow,
      totalYesterday,
      change,
      _args = arguments;
  return regeneratorRuntime.async(function calculateChange$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          query = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          now = new Date();
          yesterday = new Date(now - 24 * 60 * 60 * 1000);
          _context.next = 5;
          return regeneratorRuntime.awrap(Model.countDocuments(query));

        case 5:
          totalNow = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(Model.countDocuments(_objectSpread({}, query, {
            createdAt: {
              $lt: yesterday
            }
          })));

        case 8:
          totalYesterday = _context.sent;

          if (!(totalYesterday === 0)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", totalNow > 0 ? 100 : 0);

        case 11:
          change = (totalNow - totalYesterday) / totalYesterday * 100;
          return _context.abrupt("return", change.toFixed(1));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getAdminDashboard = catchAsync(function _callee(req, res, next) {
  var reportedJobs, unverifiedEmployers, stats, jobsByVisaType, jobsByLocation, topEmployers, platformAnalytics, bugReports, discounts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, discount;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Job.find({
            status: "reported"
          }).select("+reports").populate("postedBy"));

        case 2:
          reportedJobs = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.find({
            role: "employer",
            "companyProfile.accStatus": "unverified"
          }));

        case 5:
          unverifiedEmployers = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(Job.countDocuments());

        case 8:
          _context2.t0 = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(calculateChange(Job));

        case 11:
          _context2.t1 = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(Job.countDocuments({
            status: "active"
          }));

        case 14:
          _context2.t2 = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(calculateChange(Job, {
            status: "active"
          }));

        case 17:
          _context2.t3 = _context2.sent;
          _context2.next = 20;
          return regeneratorRuntime.awrap(Job.countDocuments({
            featured: true
          }));

        case 20:
          _context2.t4 = _context2.sent;
          _context2.next = 23;
          return regeneratorRuntime.awrap(calculateChange(Job, {
            featured: true
          }));

        case 23:
          _context2.t5 = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(User.countDocuments());

        case 26:
          _context2.t6 = _context2.sent;
          _context2.next = 29;
          return regeneratorRuntime.awrap(calculateChange(User));

        case 29:
          _context2.t7 = _context2.sent;
          _context2.next = 32;
          return regeneratorRuntime.awrap(User.countDocuments({
            role: "employer",
            "companyProfile.accStatus": "verified"
          }));

        case 32:
          _context2.t8 = _context2.sent;
          _context2.next = 35;
          return regeneratorRuntime.awrap(calculateChange(User, {
            role: "employer",
            "companyProfile.accStatus": "verified"
          }));

        case 35:
          _context2.t9 = _context2.sent;
          _context2.next = 38;
          return regeneratorRuntime.awrap(User.countDocuments({
            role: "employer"
          }));

        case 38:
          _context2.t10 = _context2.sent;
          _context2.next = 41;
          return regeneratorRuntime.awrap(User.countDocuments({
            role: "candidate"
          }));

        case 41:
          _context2.t11 = _context2.sent;
          _context2.next = 44;
          return regeneratorRuntime.awrap(User.countDocuments({
            role: "employer",
            isClaimed: false
          }));

        case 44:
          _context2.t12 = _context2.sent;
          _context2.next = 47;
          return regeneratorRuntime.awrap(User.countDocuments({
            "subscription.tier": "free"
          }));

        case 47:
          _context2.t13 = _context2.sent;
          _context2.next = 50;
          return regeneratorRuntime.awrap(calculateChange(User, {
            "subscription.tier": "free"
          }));

        case 50:
          _context2.t14 = _context2.sent;
          _context2.next = 53;
          return regeneratorRuntime.awrap(User.countDocuments({
            "subscription.tier": "starter"
          }));

        case 53:
          _context2.t15 = _context2.sent;
          _context2.next = 56;
          return regeneratorRuntime.awrap(calculateChange(User, {
            "subscription.tier": "starter"
          }));

        case 56:
          _context2.t16 = _context2.sent;
          _context2.next = 59;
          return regeneratorRuntime.awrap(User.countDocuments({
            "subscription.tier": "professional"
          }));

        case 59:
          _context2.t17 = _context2.sent;
          _context2.next = 62;
          return regeneratorRuntime.awrap(calculateChange(User, {
            "subscription.tier": "professional"
          }));

        case 62:
          _context2.t18 = _context2.sent;
          stats = {
            totalJobs: _context2.t0,
            totalJobsChange: _context2.t1,
            activeJobs: _context2.t2,
            activeJobsChange: _context2.t3,
            featuredJobs: _context2.t4,
            featuredJobsChange: _context2.t5,
            totalUsers: _context2.t6,
            totalUsersChange: _context2.t7,
            verifiedEmployers: _context2.t8,
            verifiedEmployersChange: _context2.t9,
            totalEmployers: _context2.t10,
            totalCandidates: _context2.t11,
            unclaimedShadowAccounts: _context2.t12,
            freeUsers: _context2.t13,
            freeUsersChange: _context2.t14,
            starterUsers: _context2.t15,
            starterUsersChange: _context2.t16,
            professionalUsers: _context2.t17,
            professionalUsersChange: _context2.t18
          };
          _context2.next = 66;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: {
                $in: ["active", "reported"]
              }
            }
          }, {
            $unwind: "$visaTypes"
          }, {
            $group: {
              _id: "$visaTypes",
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              count: -1
            }
          }, {
            $project: {
              visaType: "$_id",
              count: 1,
              _id: 0
            }
          }]));

        case 66:
          jobsByVisaType = _context2.sent;
          _context2.next = 69;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: {
                $in: ["active", "reported"]
              }
            }
          }, {
            $group: {
              _id: "$location.city",
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              count: -1
            }
          }, {
            $limit: 5
          }, {
            $project: {
              city: "$_id",
              count: 1,
              _id: 0
            }
          }]));

        case 69:
          jobsByLocation = _context2.sent;
          _context2.next = 72;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: {
                $in: ["active", "reported"]
              }
            }
          }, {
            $group: {
              _id: "$postedBy",
              jobCount: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              jobCount: -1
            }
          }, {
            $limit: 5
          }, {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "employer"
            }
          }, {
            $unwind: "$employer"
          }, {
            $project: {
              _id: 0,
              companyName: "$employer.companyProfile.companyName",
              jobCount: 1
            }
          }]));

        case 72:
          topEmployers = _context2.sent;
          _context2.next = 75;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: "active"
            }
          }, {
            $group: {
              _id: null,
              totalViews: {
                $sum: "$analytics.views"
              },
              totalClicks: {
                $sum: "$analytics.applicationClicks"
              },
              totalSaves: {
                $sum: "$analytics.saves"
              }
            }
          }]));

        case 75:
          platformAnalytics = _context2.sent;
          _context2.next = 78;
          return regeneratorRuntime.awrap(BugReport.find().sort({
            createdAt: -1
          }).populate("reportedBy", "name email"));

        case 78:
          bugReports = _context2.sent;
          _context2.next = 81;
          return regeneratorRuntime.awrap(Discount.find().sort("-createdAt"));

        case 81:
          discounts = _context2.sent;
          // Check for expired discounts and update them
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 85;
          _iterator = discounts[Symbol.iterator]();

        case 87:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 96;
            break;
          }

          discount = _step.value;

          if (!(discount.isActive && discount.expiresAt && new Date() > discount.expiresAt)) {
            _context2.next = 93;
            break;
          }

          discount.isActive = false;
          _context2.next = 93;
          return regeneratorRuntime.awrap(discount.save());

        case 93:
          _iteratorNormalCompletion = true;
          _context2.next = 87;
          break;

        case 96:
          _context2.next = 102;
          break;

        case 98:
          _context2.prev = 98;
          _context2.t19 = _context2["catch"](85);
          _didIteratorError = true;
          _iteratorError = _context2.t19;

        case 102:
          _context2.prev = 102;
          _context2.prev = 103;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 105:
          _context2.prev = 105;

          if (!_didIteratorError) {
            _context2.next = 108;
            break;
          }

          throw _iteratorError;

        case 108:
          return _context2.finish(105);

        case 109:
          return _context2.finish(102);

        case 110:
          res.status(200).render("adminDashboard", {
            title: "Admin Dashboard",
            reportedJobs: reportedJobs,
            unverifiedEmployers: unverifiedEmployers,
            bugReports: bugReports,
            discounts: discounts,
            stats: stats,
            analytics: {
              jobsByVisaType: jobsByVisaType,
              jobsByLocation: jobsByLocation,
              topEmployers: topEmployers,
              platform: platformAnalytics[0] || {
                totalViews: 0,
                totalClicks: 0,
                totalSaves: 0
              }
            }
          });

        case 111:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[85, 98, 102, 110], [103,, 105, 109]]);
});
exports.getEmployerDashboard = catchAsync(function _callee2(req, res, next) {
  var jobs, activeDiscount, featuredJobs, regularJobs, calculateAnalytics, analytics;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Job.find({
            postedBy: req.user._id
          }).select("title analytics.views analytics.applicationClicks analytics.saves postedDate featured status isAdminPosted").sort("-postedDate"));

        case 2:
          jobs = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Discount.findOne({
            isActive: true
          }));

        case 5:
          activeDiscount = _context3.sent;

          if (!(activeDiscount && activeDiscount.expiresAt && new Date() > activeDiscount.expiresAt)) {
            _context3.next = 11;
            break;
          }

          activeDiscount.isActive = false;
          _context3.next = 10;
          return regeneratorRuntime.awrap(activeDiscount.save());

        case 10:
          activeDiscount = null;

        case 11:
          featuredJobs = jobs.filter(function (job) {
            return job.featured;
          });
          regularJobs = jobs.filter(function (job) {
            return !job.featured;
          });

          calculateAnalytics = function calculateAnalytics(jobsList) {
            return jobsList.map(function (job) {
              return _objectSpread({}, job.toObject(), {
                conversionRate: job.analytics.views > 0 ? (job.analytics.applicationClicks / job.analytics.views * 100).toFixed(1) : 0
              });
            });
          };

          analytics = {
            allJobs: calculateAnalytics(jobs),
            regularJobs: calculateAnalytics(regularJobs),
            featuredJobs: calculateAnalytics(featuredJobs),
            summary: {
              totalJobs: jobs.length,
              featuredCount: featuredJobs.length,
              regularCount: regularJobs.length,
              totalViews: jobs.reduce(function (sum, job) {
                return sum + (job.analytics.views || 0);
              }, 0),
              totalClicks: jobs.reduce(function (sum, job) {
                return sum + (job.analytics.applicationClicks || 0);
              }, 0),
              featuredViews: featuredJobs.reduce(function (sum, job) {
                return sum + (job.analytics.views || 0);
              }, 0),
              featuredClicks: featuredJobs.reduce(function (sum, job) {
                return sum + (job.analytics.applicationClicks || 0);
              }, 0)
            }
          };
          res.render("employerDashboard", {
            title: "Dashboard",
            jobs: analytics,
            activeDiscount: activeDiscount
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
});

exports.getJobSearch = function (req, res, next) {
  res.render("job-search", {
    title: "Search UK Visa Jobs"
  });
};

exports.getEmployerSignup = function (req, res) {
  res.status(200).render("signup-employer", {
    title: "Create Employer Account"
  });
};

exports.getClaimAccount = function (req, res) {
  res.status(200).render("claim-account", {
    title: "Claim your account",
    token: req.params.token
  });
};

exports.getJobResults = catchAsync(function _callee3(req, res, next) {
  var _req$query, search, location, distance, queryObj, searchTerms, searchConditions, coords, jobs;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query = req.query, search = _req$query.search, location = _req$query.location, distance = _req$query.distance;
          queryObj = {
            status: {
              $in: ["active", "reported"]
            }
          };

          if (search) {
            searchTerms = search.trim().split(/\s+/);
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
              queryObj.$and = searchConditions;
            }
          }

          if (!(location && distance)) {
            _context4.next = 16;
            break;
          }

          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(geoPostcode(location));

        case 7:
          coords = _context4.sent;

          if (coords && coords.coordinates) {
            queryObj["location.coordinates"] = {
              $geoWithin: {
                $centerSphere: [coords.coordinates, +distance / 6378.1]
              }
            };
          } else {
            queryObj["location.city"] = {
              $regex: location,
              $options: "i"
            };
          }

          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](4);
          queryObj["location.city"] = {
            $regex: location,
            $options: "i"
          };

        case 14:
          _context4.next = 17;
          break;

        case 16:
          if (location) {
            queryObj["location.city"] = {
              $regex: location,
              $options: "i"
            };
          }

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(Job.find(queryObj).populate("postedBy", "name").select("title visaTypes location experienceLevel salaryRange jobType postedDate postedBy description featured").sort("-featured -postedDated"));

        case 19:
          jobs = _context4.sent;
          res.status(200).render("search-results", {
            title: "Search Results",
            jobs: jobs,
            searchParams: {
              search: search,
              location: location,
              distance: distance
            }
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 11]]);
});
exports.getJob = catchAsync(function _callee4(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.views": 1
            }
          }, // Updated to match schema structure
          {
            "new": true
          }).populate("postedBy"));

        case 2:
          job = _context5.sent;

          if (job) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("Job not found", 404)));

        case 5:
          res.render("job-detail", {
            title: job.title,
            job: job
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});

exports.getClaimAccount = function (req, res) {
  res.status(200).render("claim-account", {
    title: "Claim your account",
    token: req.params.token
  });
};

exports.getSitemap = catchAsync(function _callee5(req, res, next) {
  var baseUrl, jobs, staticPages, sitemap;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          baseUrl = "".concat(req.protocol, "://").concat(req.get("host"));
          _context6.next = 3;
          return regeneratorRuntime.awrap(Job.find({
            status: "active"
          }).select("title _id updatedAt"));

        case 3:
          jobs = _context6.sent;
          staticPages = ["", "/search", "/employer-signup", "/login", "/signup", "/privacy", "/terms"];
          sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  ".concat(staticPages.map(function (url) {
            return "\n  <url>\n    <loc>".concat(baseUrl).concat(url, "</loc>\n    <changefreq>weekly</changefreq>\n    <priority>").concat(url === "" ? 1.0 : 0.8, "</priority>\n  </url>");
          }).join(""), "\n  ").concat(jobs.map(function (job) {
            var slug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return "\n  <url>\n    <loc>".concat(baseUrl, "/job/").concat(slug, "/").concat(job._id, "</loc>\n    <lastmod>").concat(job.updatedAt.toISOString(), "</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>");
          }).join(""), "\n</urlset>");
          res.header("Content-Type", "application/xml");
          res.send(sitemap);

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getSavedJobs = catchAsync(function _callee6(req, res, next) {
  var jobs;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Job.find({
            _id: {
              $in: req.user.savedJobs
            },
            status: {
              $in: ["active", "reported"]
            }
          }).populate("postedBy", "name").select("title visaTypes location experienceLevel salaryRange jobType postedDate postedBy description featured").sort("-featured -postedDate"));

        case 2:
          jobs = _context7.sent;
          res.status(200).render("saved-jobs", {
            title: "Saved Jobs",
            jobs: jobs,
            searchParams: {}
          });

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
});

exports.getLogin = function (req, res) {
  res.status(200).render("login", {
    title: "Log into your account"
  });
};

exports.getSignup = function (req, res) {
  res.status(200).render("signup", {
    title: "Create your account"
  });
};

exports.getProfile = function (req, res) {
  res.status(200).render("profile", {
    title: "Your Profile"
  });
};

exports.getCv = catchAsync(function _callee7(req, res, next) {
  var filename, _ref, stream, contentType;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          filename = req.params.filename; // Optional: Check if user is allowed to view this CV
          // For now, we assume if they have the link (filename), they can view it,
          // or you can restrict it to the owner:
          // if (req.user.cv !== filename && req.user.role !== 'admin') ...

          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(r2.getFileStream(filename));

        case 4:
          _ref = _context8.sent;
          stream = _ref.stream;
          contentType = _ref.contentType;

          if (contentType) {
            res.setHeader("Content-Type", contentType);
          } else {
            res.setHeader("Content-Type", "application/pdf");
          }

          stream.pipe(res);
          _context8.next = 14;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](1);
          return _context8.abrupt("return", next(new AppError("CV not found", 404)));

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 11]]);
});

exports.getForgotPassword = function (req, res) {
  res.status(200).render("forgot-password", {
    title: "Forgot Password"
  });
};

exports.getResetPassword = function (req, res) {
  res.status(200).render("reset-password", {
    title: "Reset your password",
    token: req.params.token
  });
};

exports.getClaimAccount = function (req, res) {
  res.status(200).render("claim-account", {
    title: "Claim your account",
    token: req.params.token
  });
};

exports.getPrivacy = function (req, res) {
  res.status(200).render("privacy", {
    title: "Privacy Policy"
  });
};

exports.getTerms = function (req, res) {
  res.status(200).render("terms", {
    title: "Terms of Service"
  });
};