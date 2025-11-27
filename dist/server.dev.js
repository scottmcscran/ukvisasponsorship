"use strict";

var mongoose = require("mongoose");

var dotenv = require("dotenv");

var _require = require("./services/subscriptionService"),
    dailySubscriptionCheck = _require.dailySubscriptionCheck,
    checkShadowAccountExpirations = _require.checkShadowAccountExpirations;

var cron = require("node-cron");

process.on("uncaughtExeption", function (err) {
  console.log(err.name, err.message);
  console.log("Unhandled rejection, Shutting Down Server.");
  process.exit(1);
});
dotenv.config({
  path: "./config.env"
});
var DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(function () {
  // eslint-disable-next-line no-console
  console.log("DB connection successful!");
});

var app = require("./app");

var port = process.env.port || 3000;
var server = app.listen(port, function () {
  // eslint-disable-next-line no-console
  console.log("App running on port ".concat(port, "..."));
  cron.schedule("0 2 * * *", function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Running daily subscription check...");
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(dailySubscriptionCheck());

          case 4:
            _context.next = 6;
            return regeneratorRuntime.awrap(checkShadowAccountExpirations());

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            console.error("Daily subscription check failed:", _context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 8]]);
  });
});
process.on("unhandledRejection", function (err) {
  console.log(err.name, err.message);
  console.log("Unhandled rejection, Shutting Down Server.");
  server.close(function () {
    process.exit(1);
  });
});