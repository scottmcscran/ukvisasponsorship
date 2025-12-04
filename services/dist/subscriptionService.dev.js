"use strict";

var cron = require("node-cron");

var Job = require("../models/jobModel");

var User = require("../models/userModel");

exports.handleSubscriptionStatusChange = function _callee(userId, tier, newStatus) {
  var keepJobIds,
      featuredLimit,
      featuredJobs,
      jobsToKeepFeatured,
      jobsToUnfeature,
      unfeatureIds,
      activeJobs,
      jobsToKeep,
      jobsToExpire,
      keepIds,
      expireIds,
      _args = arguments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          keepJobIds = _args.length > 3 && _args[3] !== undefined ? _args[3] : [];

          if (!(newStatus === "active" || newStatus === "trialing")) {
            _context.next = 20;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(Job.updateMany({
            postedBy: userId,
            status: "sub_expired"
          }, {
            status: "active"
          }));

        case 4:
          // Handle Featured Job Limits based on new Tier
          featuredLimit = 0;
          if (tier === "starter") featuredLimit = 3;
          if (tier === "professional") featuredLimit = 10;
          _context.next = 9;
          return regeneratorRuntime.awrap(Job.find({
            postedBy: userId,
            featured: true
          }).sort("-createdAt"));

        case 9:
          featuredJobs = _context.sent;

          if (!(featuredJobs.length > featuredLimit)) {
            _context.next = 16;
            break;
          }

          jobsToKeepFeatured = featuredJobs.slice(0, featuredLimit);
          jobsToUnfeature = featuredJobs.slice(featuredLimit);
          unfeatureIds = jobsToUnfeature.map(function (j) {
            return j._id;
          });
          _context.next = 16;
          return regeneratorRuntime.awrap(Job.updateMany({
            _id: {
              $in: unfeatureIds
            }
          }, {
            featured: false
          }));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, {
            "subscription.tier": tier,
            "subscription.status": "active",
            "subscription.currentPeriodEnd": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }));

        case 18:
          _context.next = 42;
          break;

        case 20:
          if (!(newStatus === "expired" || newStatus === "cancelled")) {
            _context.next = 42;
            break;
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(Job.updateMany({
            postedBy: userId
          }, {
            featured: false
          }));

        case 23:
          if (!(keepJobIds && keepJobIds.length > 0)) {
            _context.next = 30;
            break;
          }

          _context.next = 26;
          return regeneratorRuntime.awrap(Job.updateMany({
            postedBy: userId,
            _id: {
              $in: keepJobIds
            }
          }, {
            status: "active"
          }));

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(Job.updateMany({
            postedBy: userId,
            _id: {
              $nin: keepJobIds
            },
            status: "active"
          }, {
            status: "sub_expired"
          }));

        case 28:
          _context.next = 40;
          break;

        case 30:
          _context.next = 32;
          return regeneratorRuntime.awrap(Job.find({
            postedBy: userId,
            status: "active"
          }).sort("-createdAt"));

        case 32:
          activeJobs = _context.sent;

          if (!(activeJobs.length > 3)) {
            _context.next = 40;
            break;
          }

          jobsToKeep = activeJobs.slice(0, 3);
          jobsToExpire = activeJobs.slice(3);
          keepIds = jobsToKeep.map(function (j) {
            return j._id;
          });
          expireIds = jobsToExpire.map(function (j) {
            return j._id;
          });
          _context.next = 40;
          return regeneratorRuntime.awrap(Job.updateMany({
            _id: {
              $in: expireIds
            }
          }, {
            status: "sub_expired"
          }));

        case 40:
          _context.next = 42;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, {
            "subscription.tier": "free",
            "subscription.status": "cancelled",
            "subscription.currentPeriodEnd": undefined
          }));

        case 42:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.dailySubscriptionCheck = function _callee2() {
  var expiredUsers, userIds;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.find({
            "subscription.currentPeriodEnd": {
              $lt: new Date()
            },
            "subscription.status": {
              $nin: ["active", "trialing"]
            },
            role: "employer"
          }));

        case 2:
          expiredUsers = _context2.sent;
          userIds = expiredUsers.map(function (u) {
            return u._id;
          });

          if (!(userIds.length > 0)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(Job.updateMany({
            postedBy: {
              $in: userIds
            },
            status: "active"
          }, {
            status: "sub_expired"
          }));

        case 7:
          console.log("Daily check: ".concat(userIds.length, " users' jobs expired"));

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.checkShadowAccountExpirations = function _callee3() {
  var threeWeeksAgo, expiredUsers, expiredUserIds, result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          threeWeeksAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000); // Find users who had the claim email sent more than 3 weeks ago

          _context3.next = 3;
          return regeneratorRuntime.awrap(User.find({
            claimEmailSentAt: {
              $lt: threeWeeksAgo
            }
          }).select("_id"));

        case 3:
          expiredUsers = _context3.sent;
          expiredUserIds = expiredUsers.map(function (u) {
            return u._id;
          });

          if (!(expiredUserIds.length > 0)) {
            _context3.next = 12;
            break;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(Job.updateMany({
            isAdminPosted: true,
            status: "active",
            postedBy: {
              $in: expiredUserIds
            }
          }, {
            status: "admin_expired"
          }));

        case 8:
          result = _context3.sent;
          console.log("Admin Posted Job Cleanup: Expired ".concat(result.modifiedCount, " jobs."));
          _context3.next = 13;
          break;

        case 12:
          console.log("Admin Posted Job Cleanup: No jobs to expire.");

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
};