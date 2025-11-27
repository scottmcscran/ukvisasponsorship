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
}).then(function () {
  return console.log('DB connection successful!');
});

var updateData = function updateData() {
  var jobs, shuffled, selected, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, job, birminghamJobs, jobToMove;

  return regeneratorRuntime.async(function updateData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // 1. Ensure 2dsphere index exists
          console.log('Ensuring 2dsphere index on location.coordinates...');
          _context.next = 4;
          return regeneratorRuntime.awrap(Job.collection.createIndex({
            "location.coordinates": "2dsphere"
          }));

        case 4:
          console.log('Index created/verified.'); // 2. Mark 5 random jobs as featured

          console.log('Marking 5 random jobs as featured...');
          _context.next = 8;
          return regeneratorRuntime.awrap(Job.find({
            status: 'active'
          }));

        case 8:
          jobs = _context.sent;

          if (!(jobs.length > 0)) {
            _context.next = 42;
            break;
          }

          shuffled = jobs.sort(function () {
            return 0.5 - Math.random();
          });
          selected = shuffled.slice(0, 5);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 15;
          _iterator = selected[Symbol.iterator]();

        case 17:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 25;
            break;
          }

          job = _step.value;
          job.featured = true;
          _context.next = 22;
          return regeneratorRuntime.awrap(job.save({
            validateBeforeSave: false
          }));

        case 22:
          _iteratorNormalCompletion = true;
          _context.next = 17;
          break;

        case 25:
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](15);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 31:
          _context.prev = 31;
          _context.prev = 32;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 34:
          _context.prev = 34;

          if (!_didIteratorError) {
            _context.next = 37;
            break;
          }

          throw _iteratorError;

        case 37:
          return _context.finish(34);

        case 38:
          return _context.finish(31);

        case 39:
          console.log("Marked ".concat(selected.length, " jobs as featured."));
          _context.next = 43;
          break;

        case 42:
          console.log('No active jobs found to feature.');

        case 43:
          _context.next = 45;
          return regeneratorRuntime.awrap(Job.find({
            "location.city": "Birmingham"
          }));

        case 45:
          birminghamJobs = _context.sent;

          if (!(birminghamJobs.length === 0)) {
            _context.next = 58;
            break;
          }

          console.log('No jobs in Birmingham found. Creating/Updating one...'); // Update one random job to be in Birmingham

          _context.next = 50;
          return regeneratorRuntime.awrap(Job.findOne());

        case 50:
          jobToMove = _context.sent;

          if (!jobToMove) {
            _context.next = 56;
            break;
          }

          jobToMove.location = {
            city: "Birmingham",
            postcode: "B1 1AA",
            coordinates: [-1.9025, 52.4800],
            // Birmingham coords
            remote: "no"
          };
          _context.next = 55;
          return regeneratorRuntime.awrap(jobToMove.save({
            validateBeforeSave: false
          }));

        case 55:
          console.log('Moved one job to Birmingham (B1 1AA).');

        case 56:
          _context.next = 59;
          break;

        case 58:
          console.log("Found ".concat(birminghamJobs.length, " jobs in Birmingham."));

        case 59:
          _context.next = 64;
          break;

        case 61:
          _context.prev = 61;
          _context.t1 = _context["catch"](0);
          console.error('Error updating data:', _context.t1);

        case 64:
          _context.prev = 64;
          process.exit();
          return _context.finish(64);

        case 67:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 61, 64, 67], [15, 27, 31, 39], [32,, 34, 38]]);
};

updateData();