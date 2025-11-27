"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv');

var Job = require('./models/jobModel');

dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function _callee() {
  var manchesterCount, birminghamCount;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('DB connection successful!');
          _context.next = 3;
          return regeneratorRuntime.awrap(Job.countDocuments({
            "location.city": "Manchester"
          }));

        case 3:
          manchesterCount = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(Job.countDocuments({
            "location.city": "Birmingham"
          }));

        case 6:
          birminghamCount = _context.sent;
          console.log("Manchester Jobs: ".concat(manchesterCount));
          console.log("Birmingham Jobs: ".concat(birminghamCount));
          process.exit();

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
});