"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv');

var Job = require('./models/jobModel');

var User = require('./models/userModel');

dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
var locations = [{
  city: 'London',
  postcode: 'SW1A 1AA',
  coordinates: [-0.1276, 51.5074],
  // Central London
  title: 'Senior Developer - Central London'
}, {
  city: 'Watford',
  postcode: 'WD17 1BH',
  coordinates: [-0.3970, 51.6565],
  // ~17 miles from London
  title: 'Junior Developer - Watford (Near London)'
}, {
  city: 'Reading',
  postcode: 'RG1 1DP',
  coordinates: [-0.9781, 51.4543],
  // ~40 miles from London
  title: 'Product Manager - Reading'
}, {
  city: 'Birmingham',
  postcode: 'B1 1BB',
  coordinates: [-1.8904, 52.4862],
  // Midlands
  title: 'DevOps Engineer - Birmingham'
}, {
  city: 'Manchester',
  postcode: 'M1 1AD',
  coordinates: [-2.2426, 53.4808],
  // North
  title: 'Frontend Dev - Manchester'
}, {
  city: 'Edinburgh',
  postcode: 'EH1 1YZ',
  coordinates: [-3.1883, 55.9533],
  // Scotland
  title: 'Backend Dev - Edinburgh'
}, {
  city: 'Bristol',
  postcode: 'BS1 5TR',
  coordinates: [-2.5879, 51.4545],
  // West
  title: 'Full Stack - Bristol'
}];

var seedJobs = function seedJobs() {
  var user, jobs;
  return regeneratorRuntime.async(function seedJobs$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(DB));

        case 3:
          console.log('DB Connected'); // 1. Get a user to assign jobs to

          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            role: 'employer'
          }));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 11;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOne());

        case 10:
          user = _context.sent;

        case 11:
          if (!user) {
            console.log('No users found. Please create a user first.');
            process.exit(1);
          }

          console.log("Assigning jobs to user: ".concat(user.name, " (").concat(user._id, ")")); // 2. Delete existing jobs

          _context.next = 15;
          return regeneratorRuntime.awrap(Job.deleteMany());

        case 15:
          console.log('Deleted all existing jobs.'); // 3. Create new jobs

          jobs = locations.map(function (loc, i) {
            return {
              title: loc.title,
              postedBy: user._id,
              companyName: "Test Corp ".concat(i + 1),
              visaTypes: ['Skilled Worker'],
              location: {
                city: loc.city,
                postcode: loc.postcode,
                remote: 'no',
                coordinates: {
                  type: 'Point',
                  coordinates: loc.coordinates
                }
              },
              salaryRange: {
                min: 30000 + i * 5000,
                max: 40000 + i * 5000,
                period: 'year'
              },
              jobType: 'Full-time',
              experienceLevel: 'Mid',
              description: "This is a test job description for ".concat(loc.city, ". It is designed to test location search functionality."),
              requirements: ['Node.js', 'React', 'MongoDB'],
              benefits: ['Remote work', 'Health insurance'],
              status: 'active',
              postedDate: new Date()
            };
          });
          _context.next = 19;
          return regeneratorRuntime.awrap(Job.create(jobs));

        case 19:
          console.log("Successfully created ".concat(jobs.length, " test jobs."));
          process.exit();
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          process.exit(1);

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

seedJobs();