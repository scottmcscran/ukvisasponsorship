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
  coordinates: [-0.1276, 51.5074]
}, {
  city: 'Watford',
  postcode: 'WD17 1BH',
  coordinates: [-0.3970, 51.6565]
}, {
  city: 'Reading',
  postcode: 'RG1 1DP',
  coordinates: [-0.9781, 51.4543]
}, {
  city: 'Birmingham',
  postcode: 'B1 1BB',
  coordinates: [-1.8904, 52.4862]
}, {
  city: 'Manchester',
  postcode: 'M1 1AD',
  coordinates: [-2.2426, 53.4808]
}, {
  city: 'Edinburgh',
  postcode: 'EH1 1YZ',
  coordinates: [-3.1883, 55.9533]
}, {
  city: 'Bristol',
  postcode: 'BS1 5TR',
  coordinates: [-2.5879, 51.4545]
}, {
  city: 'Leeds',
  postcode: 'LS1 1UR',
  coordinates: [-1.5491, 53.7955]
}, {
  city: 'Glasgow',
  postcode: 'G1 1RX',
  coordinates: [-4.2518, 55.8642]
}, {
  city: 'Cardiff',
  postcode: 'CF10 1DD',
  coordinates: [-3.1791, 51.4816]
}, {
  city: 'Newcastle',
  postcode: 'NE1 5DF',
  coordinates: [-1.6174, 54.9783]
}, {
  city: 'Nottingham',
  postcode: 'NG1 2AS',
  coordinates: [-1.1581, 52.9548]
}, {
  city: 'Brighton',
  postcode: 'BN1 1GE',
  coordinates: [-0.1372, 50.8225]
}, {
  city: 'Cambridge',
  postcode: 'CB2 1TN',
  coordinates: [0.1218, 52.2053]
}, {
  city: 'Oxford',
  postcode: 'OX1 1RZ',
  coordinates: [-1.2577, 51.7520]
}];
var titles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Project Manager', 'Product Owner', 'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'UX Designer', 'HR Manager', 'Accountant', 'Marketing Specialist', 'Sales Representative', 'Customer Support Lead', 'Business Analyst', 'Systems Administrator', 'Network Engineer'];
var companies = ['Tech Corp', 'Innovate Ltd', 'Future Systems', 'Global Solutions', 'Data Dynamics', 'Cloud Nine', 'Web Wizards', 'App Masters', 'Secure Net', 'Green Energy Co', 'FinTech Pros', 'HealthTech Inc'];

var getRandomElement = function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var seedJobs = function seedJobs() {
  var user, jobs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, loc, i, title, company;

  return regeneratorRuntime.async(function seedJobs$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(DB));

        case 3:
          console.log('DB Connected');
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
            console.log('No users found.');
            process.exit(1);
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(Job.deleteMany());

        case 14:
          console.log('Deleted existing jobs.');
          jobs = []; // Generate ~5 jobs per location

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 19;

          for (_iterator = locations[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            loc = _step.value;

            for (i = 0; i < 5; i++) {
              title = getRandomElement(titles);
              company = getRandomElement(companies);
              jobs.push({
                title: title,
                // No location in title
                postedBy: user._id,
                companyName: company,
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
                  min: 30000 + Math.floor(Math.random() * 50000),
                  max: 80000 + Math.floor(Math.random() * 50000),
                  period: 'year'
                },
                jobType: 'Full-time',
                experienceLevel: getRandomElement(['Entry', 'Mid', 'Senior', 'Lead']),
                description: "We are looking for a talented ".concat(title, " to join our team at ").concat(company, ". This is a great opportunity to work on exciting projects."),
                requirements: ['Relevant Degree', '3+ years experience', 'Communication skills'],
                benefits: ['Pension', 'Healthcare', 'Gym membership'],
                status: 'active',
                postedDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random date in past ~10 days

              });
            }
          }

          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](19);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 27:
          _context.prev = 27;
          _context.prev = 28;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 30:
          _context.prev = 30;

          if (!_didIteratorError) {
            _context.next = 33;
            break;
          }

          throw _iteratorError;

        case 33:
          return _context.finish(30);

        case 34:
          return _context.finish(27);

        case 35:
          _context.next = 37;
          return regeneratorRuntime.awrap(Job.create(jobs));

        case 37:
          console.log("Successfully created ".concat(jobs.length, " test jobs."));
          process.exit();
          _context.next = 45;
          break;

        case 41:
          _context.prev = 41;
          _context.t1 = _context["catch"](0);
          console.error(_context.t1);
          process.exit(1);

        case 45:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 41], [19, 23, 27, 35], [28,, 30, 34]]);
};

seedJobs();