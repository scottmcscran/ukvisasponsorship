"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var AppError = require("../utils/appError");

var Job = require("./../models/jobModel");

var User = require("./../models/userModel");

var BugReport = require("../models/bugReportModel");

var Discount = require("../models/discountModel");

var crypto = require("crypto");

var Email = require("../utils/email");

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.approveEmployer = catchAsync(function _callee(req, res, next) {
  var user, dashboardUrl;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, {
            "companyProfile.accStatus": "verified"
          }));

        case 2:
          user = _context.sent;

          if (user) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", next(new AppError("No user with that ID.", 404)));

        case 5:
          _context.prev = 5;
          dashboardUrl = "".concat(req.protocol, "://").concat(req.get("host"), "/employer-dashboard");
          _context.next = 9;
          return regeneratorRuntime.awrap(new Email(user, dashboardUrl).sendAccountVerified());

        case 9:
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](5);
          console.log("Error sending verification email:", _context.t0);

        case 14:
          res.status(200).json({
            status: "success",
            message: "".concat(user.companyProfile.legalOrgName, " has been verified.")
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 11]]);
});
exports.rejectEmployer = catchAsync(function _callee2(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, {
            "companyProfile.accStatus": "rejected"
          }, {
            "new": true
          }));

        case 2:
          user = _context2.sent;

          if (user) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError("No user with that ID.", 404)));

        case 5:
          // ADD EMAIL HERE LATER
          res.status(200).json({
            status: "success",
            message: "".concat(user.companyProfile.legalOrgName, " has been rejected.")
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.dismissReport = catchAsync(function _callee3(req, res, next) {
  var job;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Job.findByIdAndUpdate(req.params.id, {
            status: "active",
            reports: 0
          }, // Reset status and report count
          {
            "new": true
          }));

        case 2:
          job = _context3.sent;

          if (job) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError("No job found with that ID", 404)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Report dismissed, job is active again."
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.deleteJob = catchAsync(function _callee4(req, res, next) {
  var job, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Job.findById(req.params.id));

        case 2:
          job = _context4.sent;

          if (job) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("No job found with that ID", 404)));

        case 5:
          if (!(job.status === "reported")) {
            _context4.next = 15;
            break;
          }

          _context4.next = 8;
          return regeneratorRuntime.awrap(User.findById(job.postedBy));

        case 8:
          user = _context4.sent;

          if (!(user && user.role === "employer")) {
            _context4.next = 15;
            break;
          }

          // Initialize if undefined (for existing users)
          if (!user.companyProfile.deletedReportedJobsCount) {
            user.companyProfile.deletedReportedJobsCount = 0;
          }

          user.companyProfile.deletedReportedJobsCount += 1; // Ban if count reaches 5

          if (user.companyProfile.deletedReportedJobsCount >= 5) {
            user.companyProfile.accStatus = "banned";
            console.log("User ".concat(user._id, " has been banned due to 5 deleted reported jobs."));
          }

          _context4.next = 15;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(Job.findByIdAndDelete(req.params.id));

        case 17:
          res.status(204).json({
            status: "success",
            data: null
          });

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.getAdminStats = catchAsync(function _callee5(req, res, next) {
  var _ref, _ref2, totalJobs, activeJobs, reportedJobs, totalUsers, totalEmployers, totalJobSeekers, featuredJobs, jobsByLocation, jobsByVisaType, jobsByExperience, jobsByRemote, sevenDaysAgo, recentJobs, salaryStats, topAnalytics, topEmployers;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Job.countDocuments(), Job.countDocuments({
            status: "active"
          }), Job.countDocuments({
            status: "reported"
          }), User.countDocuments(), User.countDocuments({
            role: "employer"
          }), User.countDocuments({
            role: "jobseeker"
          }), Job.countDocuments({
            featured: true,
            status: "active"
          })]));

        case 2:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 7);
          totalJobs = _ref2[0];
          activeJobs = _ref2[1];
          reportedJobs = _ref2[2];
          totalUsers = _ref2[3];
          totalEmployers = _ref2[4];
          totalJobSeekers = _ref2[5];
          featuredJobs = _ref2[6];
          _context5.next = 13;
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
            $limit: 10
          }, {
            $project: {
              city: "$_id",
              count: 1,
              _id: 0
            }
          }]));

        case 13:
          jobsByLocation = _context5.sent;
          _context5.next = 16;
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

        case 16:
          jobsByVisaType = _context5.sent;
          _context5.next = 19;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: {
                $in: ["active", "reported"]
              }
            }
          }, {
            $group: {
              _id: "$experienceLevel",
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
              level: "$_id",
              count: 1,
              _id: 0
            }
          }]));

        case 19:
          jobsByExperience = _context5.sent;
          _context5.next = 22;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: {
                $in: ["active", "reported"]
              }
            }
          }, {
            $group: {
              _id: "$location.remote",
              count: {
                $sum: 1
              }
            }
          }, {
            $project: {
              type: "$_id",
              count: 1,
              _id: 0
            }
          }]));

        case 22:
          jobsByRemote = _context5.sent;
          sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          _context5.next = 26;
          return regeneratorRuntime.awrap(Job.countDocuments({
            postedDate: {
              $gte: sevenDaysAgo
            }
          }));

        case 26:
          recentJobs = _context5.sent;
          _context5.next = 29;
          return regeneratorRuntime.awrap(Job.aggregate([{
            $match: {
              status: "active",
              "salaryRange.currency": "GBP"
            }
          }, {
            $group: {
              _id: null,
              avgMin: {
                $avg: "$salaryRange.min"
              },
              avgMax: {
                $avg: "$salaryRange.max"
              }
            }
          }]));

        case 29:
          salaryStats = _context5.sent;
          _context5.next = 32;
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

        case 32:
          topAnalytics = _context5.sent;
          _context5.next = 35;
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
              employerId: "$_id",
              companyName: "$employer.companyProfile.companyName",
              email: "$employer.email",
              jobCount: 1
            }
          }]));

        case 35:
          topEmployers = _context5.sent;
          res.status(200).json({
            status: "success",
            data: {
              overview: {
                totalJobs: totalJobs,
                activeJobs: activeJobs,
                reportedJobs: reportedJobs,
                featuredJobs: featuredJobs,
                totalUsers: totalUsers,
                totalEmployers: totalEmployers,
                totalJobSeekers: totalJobSeekers,
                recentJobs: recentJobs
              },
              jobsByLocation: jobsByLocation,
              jobsByVisaType: jobsByVisaType,
              jobsByExperience: jobsByExperience,
              jobsByRemote: jobsByRemote,
              salaryStats: salaryStats[0] || {
                avgMin: 0,
                avgMax: 0
              },
              analytics: topAnalytics[0] || {
                totalViews: 0,
                totalClicks: 0,
                totalSaves: 0
              },
              topEmployers: topEmployers
            }
          });

        case 37:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.exportUserData = catchAsync(function _callee6(req, res, next) {
  var email, user, userData;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = req.body.email;

          if (email) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", next(new AppError("Please provide an email address", 400)));

        case 3:
          _context6.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context6.sent;

          if (user) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", next(new AppError("User not found", 404)));

        case 8:
          userData = {
            profile: user,
            jobsPosted: [],
            bugReports: []
          };

          if (!(user.role === "employer")) {
            _context6.next = 13;
            break;
          }

          _context6.next = 12;
          return regeneratorRuntime.awrap(Job.find({
            postedBy: user._id
          }));

        case 12:
          userData.jobsPosted = _context6.sent;

        case 13:
          _context6.next = 15;
          return regeneratorRuntime.awrap(BugReport.find({
            reportedBy: user._id
          }));

        case 15:
          userData.bugReports = _context6.sent;
          res.status(200).json({
            status: "success",
            data: userData
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.createShadowEmployer = catchAsync(function _callee7(req, res, next) {
  var _req$body, companyName, email, legalOrgName, industry, companySize, website, password, newUser;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body = req.body, companyName = _req$body.companyName, email = _req$body.email, legalOrgName = _req$body.legalOrgName, industry = _req$body.industry, companySize = _req$body.companySize, website = _req$body.website; // Generate a random password

          password = crypto.randomBytes(12).toString("hex");
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.create({
            name: companyName,
            // Use company name as user name initially
            email: email,
            password: password,
            passwordConfirm: password,
            role: "employer",
            isClaimed: false,
            companyProfile: {
              companyName: companyName,
              legalOrgName: legalOrgName || companyName,
              // Fallback
              industry: industry,
              companySize: companySize,
              website: website,
              accStatus: "verified" // Auto-verify shadow accounts? Or keep unverified? Let's say verified so jobs show up.

            },
            emailVerified: true,
            // Auto-verify email for shadow accounts
            subscription: {
              tier: "free",
              // Or give them a trial?
              status: "active"
            }
          }));

        case 4:
          newUser = _context7.sent;
          // Hide password from output
          newUser.password = undefined;
          res.status(201).json({
            status: "success",
            data: {
              user: newUser
            }
          });

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.sendClaimEmail = catchAsync(function _callee8(req, res, next) {
  var user, claimToken, claimUrl;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 2:
          user = _context8.sent;

          if (user) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", next(new AppError("User not found", 404)));

        case 5:
          if (!user.isClaimed) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", next(new AppError("Account already claimed", 400)));

        case 7:
          claimToken = user.createClaimToken();
          _context8.next = 10;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 10:
          claimUrl = "".concat(req.protocol, "://").concat(req.get("host"), "/claim-account/").concat(claimToken);
          _context8.prev = 11;
          _context8.next = 14;
          return regeneratorRuntime.awrap(new Email(user, claimUrl).sendClaimAccount());

        case 14:
          res.status(200).json({
            status: "success",
            message: "Claim email sent successfully"
          });
          _context8.next = 24;
          break;

        case 17:
          _context8.prev = 17;
          _context8.t0 = _context8["catch"](11);
          user.claimToken = undefined;
          user.claimTokenExpires = undefined;
          _context8.next = 23;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 23:
          return _context8.abrupt("return", next(new AppError("There was an error sending the email. Try again later!"), 500));

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[11, 17]]);
});
exports.createDiscount = catchAsync(function _callee9(req, res, next) {
  var _req$body2, code, percentage, expiresAt, coupon, discount;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body2 = req.body, code = _req$body2.code, percentage = _req$body2.percentage, expiresAt = _req$body2.expiresAt; // 1. Create Coupon in Stripe
          // We use try-catch for Stripe creation to handle duplicates gracefully or errors

          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(stripe.coupons.create({
            percent_off: percentage,
            duration: "once",
            // Applies to the first payment only
            name: code,
            id: code // Use the code as the ID

          }));

        case 4:
          coupon = _context9.sent;
          _context9.next = 16;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](1);

          if (!(_context9.t0.code === "resource_already_exists")) {
            _context9.next = 15;
            break;
          }

          _context9.next = 12;
          return regeneratorRuntime.awrap(stripe.coupons.retrieve(code));

        case 12:
          coupon = _context9.sent;
          _context9.next = 16;
          break;

        case 15:
          return _context9.abrupt("return", next(new AppError("Stripe Error: ".concat(_context9.t0.message), 400)));

        case 16:
          _context9.next = 18;
          return regeneratorRuntime.awrap(Discount.updateMany({}, {
            isActive: false
          }));

        case 18:
          _context9.next = 20;
          return regeneratorRuntime.awrap(Discount.create({
            code: code,
            percentage: percentage,
            stripeId: coupon.id,
            isActive: true,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined
          }));

        case 20:
          discount = _context9.sent;
          res.status(201).json({
            status: "success",
            data: {
              discount: discount
            }
          });

        case 22:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
exports.getAllDiscounts = catchAsync(function _callee10(req, res, next) {
  var discounts;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(Discount.find().sort("-createdAt"));

        case 2:
          discounts = _context10.sent;
          res.status(200).json({
            status: "success",
            results: discounts.length,
            data: {
              discounts: discounts
            }
          });

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
});
exports.deleteDiscount = catchAsync(function _callee11(req, res, next) {
  var discount;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(Discount.findByIdAndDelete(req.params.id));

        case 2:
          discount = _context11.sent;

          if (discount) {
            _context11.next = 5;
            break;
          }

          return _context11.abrupt("return", next(new AppError("No discount found with that ID", 404)));

        case 5:
          _context11.prev = 5;
          _context11.next = 8;
          return regeneratorRuntime.awrap(stripe.coupons.del(discount.stripeId));

        case 8:
          _context11.next = 12;
          break;

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](5);

        case 12:
          res.status(204).json({
            status: "success",
            data: null
          });

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[5, 10]]);
});
exports.toggleDiscountStatus = catchAsync(function _callee12(req, res, next) {
  var discount, action;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(Discount.findById(req.params.id));

        case 2:
          discount = _context12.sent;

          if (discount) {
            _context12.next = 5;
            break;
          }

          return _context12.abrupt("return", next(new AppError("No discount found", 404)));

        case 5:
          action = req.body.action;

          if (!(action === "activate")) {
            _context12.next = 12;
            break;
          }

          _context12.next = 9;
          return regeneratorRuntime.awrap(Discount.updateMany({}, {
            isActive: false
          }));

        case 9:
          discount.isActive = true;
          _context12.next = 20;
          break;

        case 12:
          if (!(action === "deactivate")) {
            _context12.next = 16;
            break;
          }

          discount.isActive = false;
          _context12.next = 20;
          break;

        case 16:
          if (discount.isActive) {
            _context12.next = 19;
            break;
          }

          _context12.next = 19;
          return regeneratorRuntime.awrap(Discount.updateMany({}, {
            isActive: false
          }));

        case 19:
          discount.isActive = !discount.isActive;

        case 20:
          _context12.next = 22;
          return regeneratorRuntime.awrap(discount.save());

        case 22:
          res.status(200).json({
            status: "success",
            data: {
              discount: discount
            }
          });

        case 23:
        case "end":
          return _context12.stop();
      }
    }
  });
});