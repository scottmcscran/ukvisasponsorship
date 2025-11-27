"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Job = require("./../models/jobModel");

var User = require("./../models/userModel"); // Ensure User is imported


var BugReport = require("./../models/bugReportModel");

var r2 = require("../utils/r2");

var _require = require("../utils/geoPostcode"),
    geoPostcode = _require.geoPostcode;

var _require2 = require("./../utils/catchAsync"),
    catchAsync = _require2.catchAsync;

var AppError = require("./../utils/appError");

var ApiFeatures = require("./../utils/apiFeatures");

exports.getAdminDashboard = catchAsync(function _callee(req, res, next) {
  var reportedJobs, unverifiedEmployers, stats, jobsByVisaType, jobsByLocation, topEmployers, platformAnalytics, bugReports;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Job.find({
            status: "reported"
          }).select("+reports").populate("postedBy"));

        case 2:
          reportedJobs = _context.sent;
          // Debugging: Check if any jobs are reported
          console.log("Reported Jobs Found: ".concat(reportedJobs.length)); // 2. Get Unverified Employers

          _context.next = 6;
          return regeneratorRuntime.awrap(User.find({
            role: "employer",
            "companyProfile.accStatus": "unverified"
          }));

        case 6:
          unverifiedEmployers = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(Job.countDocuments());

        case 9:
          _context.t0 = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(Job.countDocuments({
            status: "active"
          }));

        case 12:
          _context.t1 = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(Job.countDocuments({
            featured: true,
            status: "active"
          }));

        case 15:
          _context.t2 = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(User.countDocuments());

        case 18:
          _context.t3 = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(User.countDocuments({
            role: "employer",
            "companyProfile.accStatus": "verified"
          }));

        case 21:
          _context.t4 = _context.sent;
          _context.next = 24;
          return regeneratorRuntime.awrap(User.countDocuments({
            "subscription.tier": "free"
          }));

        case 24:
          _context.t5 = _context.sent;
          _context.next = 27;
          return regeneratorRuntime.awrap(User.countDocuments({
            "subscription.tier": "starter"
          }));

        case 27:
          _context.t6 = _context.sent;
          _context.next = 30;
          return regeneratorRuntime.awrap(User.countDocuments({
            "subscription.tier": "professional"
          }));

        case 30:
          _context.t7 = _context.sent;
          stats = {
            totalJobs: _context.t0,
            activeJobs: _context.t1,
            featuredJobs: _context.t2,
            totalUsers: _context.t3,
            verifiedEmployers: _context.t4,
            freeUsers: _context.t5,
            starterUsers: _context.t6,
            professionalUsers: _context.t7
          };
          _context.next = 34;
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

        case 34:
          jobsByVisaType = _context.sent;
          _context.next = 37;
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

        case 37:
          jobsByLocation = _context.sent;
          _context.next = 40;
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

        case 40:
          topEmployers = _context.sent;
          _context.next = 43;
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

        case 43:
          platformAnalytics = _context.sent;
          _context.next = 46;
          return regeneratorRuntime.awrap(BugReport.find().sort({
            createdAt: -1
          }).populate("reportedBy", "name email"));

        case 46:
          bugReports = _context.sent;
          res.status(200).render("adminDashboard", {
            title: "Admin Dashboard",
            reportedJobs: reportedJobs,
            unverifiedEmployers: unverifiedEmployers,
            bugReports: bugReports,
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

        case 48:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getEmployerDashboard = catchAsync(function _callee2(req, res, next) {
  var jobs, featuredJobs, regularJobs, calculateAnalytics, analytics;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Job.find({
            postedBy: req.user._id
          }).select("title analytics.views analytics.applicationClicks analytics.saves postedDate featured status isAdminPosted").sort("-postedDate"));

        case 2:
          jobs = _context2.sent;
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
            jobs: analytics
          });

        case 8:
        case "end":
          return _context2.stop();
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

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
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
            _context3.next = 16;
            break;
          }

          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(geoPostcode(location));

        case 7:
          coords = _context3.sent;

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

          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](4);
          queryObj["location.city"] = {
            $regex: location,
            $options: "i"
          };

        case 14:
          _context3.next = 17;
          break;

        case 16:
          if (location) {
            queryObj["location.city"] = {
              $regex: location,
              $options: "i"
            };
          }

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(Job.find(queryObj).populate("postedBy", "name").select("title visaTypes location experienceLevel salaryRange jobType postedDate postedBy description featured").sort("-featured -postedDated"));

        case 19:
          jobs = _context3.sent;
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
          return _context3.stop();
      }
    }
  }, null, null, [[4, 11]]);
});
exports.getJob = catchAsync(function _callee4(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            $inc: {
              "analytics.views": 1
            }
          }, // Updated to match schema structure
          {
            "new": true
          }).populate("postedBy"));

        case 2:
          job = _context4.sent;

          if (job) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("Job not found", 404)));

        case 5:
          res.render("job-detail", {
            title: job.title,
            job: job
          });

        case 6:
        case "end":
          return _context4.stop();
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
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          baseUrl = "".concat(req.protocol, "://").concat(req.get("host"));
          _context5.next = 3;
          return regeneratorRuntime.awrap(Job.find({
            status: "active"
          }).select("title _id updatedAt"));

        case 3:
          jobs = _context5.sent;
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
          return _context5.stop();
      }
    }
  });
});
exports.getSavedJobs = catchAsync(function _callee6(req, res, next) {
  var jobs;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Job.find({
            _id: {
              $in: req.user.savedJobs
            },
            status: {
              $in: ["active", "reported"]
            }
          }).populate("postedBy", "name").select("title visaTypes location experienceLevel salaryRange jobType postedDate postedBy description featured").sort("-featured -postedDate"));

        case 2:
          jobs = _context6.sent;
          res.status(200).render("saved-jobs", {
            title: "Saved Jobs",
            jobs: jobs,
            searchParams: {}
          });

        case 4:
        case "end":
          return _context6.stop();
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

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          filename = req.params.filename; // Optional: Check if user is allowed to view this CV
          // For now, we assume if they have the link (filename), they can view it,
          // or you can restrict it to the owner:
          // if (req.user.cv !== filename && req.user.role !== 'admin') ...

          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(r2.getFileStream(filename));

        case 4:
          _ref = _context7.sent;
          stream = _ref.stream;
          contentType = _ref.contentType;

          if (contentType) {
            res.setHeader("Content-Type", contentType);
          } else {
            res.setHeader("Content-Type", "application/pdf");
          }

          stream.pipe(res);
          _context7.next = 14;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](1);
          return _context7.abrupt("return", next(new AppError("CV not found", 404)));

        case 14:
        case "end":
          return _context7.stop();
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