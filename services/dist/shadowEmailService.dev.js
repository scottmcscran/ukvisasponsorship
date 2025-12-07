"use strict";

var ShadowEmailQueue = require("../models/shadowEmailQueueModel");

var User = require("../models/userModel");

var Email = require("../utils/email");

exports.processShadowEmailQueue = function _callee() {
  var baseUrl, processedCount, item, user, claimToken, claimUrl;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Starting Shadow Email Queue processing...");
          baseUrl = process.env.NODE_ENV === "production" ? "https://ukvisasponsorship.com" : "http://localhost:3000";
          processedCount = 0; // Process queue items one by one atomically to prevent duplicate sends in clustered environments

        case 3:
          if (!true) {
            _context.next = 34;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(ShadowEmailQueue.findOneAndDelete().populate("user"));

        case 6:
          item = _context.sent;

          if (item) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("break", 34);

        case 9:
          user = item.user; // If user was deleted, just continue (item is already removed from queue)

          if (user) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("continue", 3);

        case 12:
          _context.prev = 12;
          // Generate claim token
          claimToken = user.createClaimToken();
          user.claimEmailSentAt = Date.now();
          _context.next = 17;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 17:
          claimUrl = "".concat(baseUrl, "/claim-account/").concat(claimToken);

          if (!(item.emailType === "no-jobs")) {
            _context.next = 23;
            break;
          }

          _context.next = 21;
          return regeneratorRuntime.awrap(new Email(user, claimUrl).sendClaimAccountNoJobs());

        case 21:
          _context.next = 25;
          break;

        case 23:
          _context.next = 25;
          return regeneratorRuntime.awrap(new Email(user, claimUrl).sendClaimAccount());

        case 25:
          console.log("Sent claim email to ".concat(user.email));
          processedCount++;
          _context.next = 32;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](12);
          console.error("Failed to send email to ".concat(user.email, ":"), _context.t0); // Item is already removed from queue, so it won't block others or loop infinitely

        case 32:
          _context.next = 3;
          break;

        case 34:
          console.log("Shadow Email Queue processing complete. Sent ".concat(processedCount, " emails."));

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[12, 29]]);
};