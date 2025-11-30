"use strict";

var cron = require("node-cron");

var PendingEmail = require("../models/pendingEmailModel");

var Email = require("./email");

var startEmailScheduler = function startEmailScheduler() {
  cron.schedule("0 15 10 * * 2", function _callee() {
    var pendingEmails, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pending, email;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Running weekly email sender...");
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(PendingEmail.find().populate("employer").populate("applicant").populate("job"));

          case 4:
            pendingEmails = _context.sent;

            if (!(pendingEmails.length === 0)) {
              _context.next = 8;
              break;
            }

            console.log("No pending emails to send.");
            return _context.abrupt("return");

          case 8:
            console.log("Found ".concat(pendingEmails.length, " emails to send."));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 12;
            _iterator = pendingEmails[Symbol.iterator]();

          case 14:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 35;
              break;
            }

            pending = _step.value;
            _context.prev = 16;

            if (!(!pending.employer || !pending.applicant || !pending.job)) {
              _context.next = 22;
              break;
            }

            console.log("Skipping pending email ".concat(pending._id, " due to missing data (user/job deleted?)"));
            _context.next = 21;
            return regeneratorRuntime.awrap(PendingEmail.findByIdAndDelete(pending._id));

          case 21:
            return _context.abrupt("continue", 32);

          case 22:
            email = new Email(pending.employer, "https://ukvisasponsorship.com/jobs/".concat(pending.job._id));
            _context.next = 25;
            return regeneratorRuntime.awrap(email.sendApplication(pending.applicant, pending.job, pending.cvFile));

          case 25:
            _context.next = 27;
            return regeneratorRuntime.awrap(PendingEmail.findByIdAndDelete(pending._id));

          case 27:
            _context.next = 32;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](16);
            console.error("Failed to send email for pending ID ".concat(pending._id, ":"), _context.t0);

          case 32:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 35:
            _context.next = 41;
            break;

          case 37:
            _context.prev = 37;
            _context.t1 = _context["catch"](12);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 41:
            _context.prev = 41;
            _context.prev = 42;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 44:
            _context.prev = 44;

            if (!_didIteratorError) {
              _context.next = 47;
              break;
            }

            throw _iteratorError;

          case 47:
            return _context.finish(44);

          case 48:
            return _context.finish(41);

          case 49:
            console.log("Weekly email sending completed.");
            _context.next = 55;
            break;

          case 52:
            _context.prev = 52;
            _context.t2 = _context["catch"](1);
            console.error("Error in weekly email scheduler:", _context.t2);

          case 55:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 52], [12, 37, 41, 49], [16, 29], [42,, 44, 48]]);
  });
};

module.exports = startEmailScheduler;