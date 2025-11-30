"use strict";

var ShadowEmailQueue = require("../models/shadowEmailQueueModel");

var User = require("../models/userModel");

var Email = require("../utils/email");

exports.processShadowEmailQueue = function _callee() {
  var queueItems, baseUrl, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, user, claimToken, claimUrl;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Starting Shadow Email Queue processing...");
          _context.next = 3;
          return regeneratorRuntime.awrap(ShadowEmailQueue.find().populate("user"));

        case 3:
          queueItems = _context.sent;

          if (!(queueItems.length === 0)) {
            _context.next = 7;
            break;
          }

          console.log("No emails in queue.");
          return _context.abrupt("return");

        case 7:
          console.log("Found ".concat(queueItems.length, " emails to send."));
          baseUrl = process.env.NODE_ENV === "production" ? "https://ukvisasponsorship.com" : "http://localhost:3000";
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 12;
          _iterator = queueItems[Symbol.iterator]();

        case 14:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 41;
            break;
          }

          item = _step.value;
          user = item.user; // If user was deleted, remove from queue

          if (user) {
            _context.next = 21;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap(ShadowEmailQueue.findByIdAndDelete(item._id));

        case 20:
          return _context.abrupt("continue", 38);

        case 21:
          _context.prev = 21;
          // Generate claim token
          claimToken = user.createClaimToken();
          _context.next = 25;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 25:
          claimUrl = "".concat(baseUrl, "/claim-account/").concat(claimToken);
          _context.next = 28;
          return regeneratorRuntime.awrap(new Email(user, claimUrl).sendClaimAccount());

        case 28:
          console.log("Sent claim email to ".concat(user.email)); // Delete from queue after sending

          _context.next = 31;
          return regeneratorRuntime.awrap(ShadowEmailQueue.findByIdAndDelete(item._id));

        case 31:
          _context.next = 38;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](21);
          console.error("Failed to send email to ".concat(user.email, ":"), _context.t0); // Delete from queue even if failed, to avoid infinite retry loops on bad data

          _context.next = 38;
          return regeneratorRuntime.awrap(ShadowEmailQueue.findByIdAndDelete(item._id));

        case 38:
          _iteratorNormalCompletion = true;
          _context.next = 14;
          break;

        case 41:
          _context.next = 47;
          break;

        case 43:
          _context.prev = 43;
          _context.t1 = _context["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 47:
          _context.prev = 47;
          _context.prev = 48;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 50:
          _context.prev = 50;

          if (!_didIteratorError) {
            _context.next = 53;
            break;
          }

          throw _iteratorError;

        case 53:
          return _context.finish(50);

        case 54:
          return _context.finish(47);

        case 55:
          console.log("Shadow Email Queue processing complete.");

        case 56:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[12, 43, 47, 55], [21, 33], [48,, 50, 54]]);
};