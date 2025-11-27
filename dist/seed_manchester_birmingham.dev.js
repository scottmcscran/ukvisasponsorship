"use strict";

var mongoose = require("mongoose");

var dotenv = require("dotenv");

var Job = require("./models/jobModel");

dotenv.config({
  path: "./config.env"
});
var DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("DB connection successful!");
});

var seedData = function seedData() {
  var manchesterJobs, User, user, birminghamJobs, newBhamJobs;
  return regeneratorRuntime.async(function seedData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // 1. Create Manchester Jobs (M1)
          console.log("Creating Manchester jobs...");
          manchesterJobs = [{
            title: "Senior React Developer",
            description: "We are looking for a React expert to join our team in Manchester.",
            location: {
              city: "Manchester",
              postcode: "M1 1AD",
              coordinates: {
                type: "Point",
                coordinates: [-2.234, 53.48]
              },
              remote: "hybrid"
            },
            salaryRange: {
              min: 50000,
              max: 70000,
              period: "year"
            },
            experienceLevel: "Senior",
            visaTypes: ["Skilled Worker"],
            jobType: "Full-time",
            postedBy: "5c8a1d5b0190b214360dc032",
            // Placeholder ID, will be replaced if needed
            featured: true
          }, {
            title: "Junior Backend Engineer",
            description: "Node.js role in Manchester city center.",
            location: {
              city: "Manchester",
              postcode: "M1 2BN",
              coordinates: {
                type: "Point",
                coordinates: [-2.236, 53.482]
              },
              remote: "no"
            },
            salaryRange: {
              min: 30000,
              max: 40000,
              period: "year"
            },
            experienceLevel: "Entry",
            visaTypes: ["Graduate"],
            jobType: "Full-time",
            postedBy: "5c8a1d5b0190b214360dc032",
            featured: false
          }]; // Find a valid user to post as

          User = require("./models/userModel");
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            role: "employer"
          }));

        case 6:
          user = _context.sent;

          if (user) {
            manchesterJobs.forEach(function (j) {
              return j.postedBy = user._id;
            });
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(Job.create(manchesterJobs));

        case 10:
          console.log("Created 2 Manchester jobs."); // 2. Ensure Birmingham Jobs (B1)

          console.log("Checking Birmingham jobs...");
          _context.next = 14;
          return regeneratorRuntime.awrap(Job.find({
            "location.city": "Birmingham"
          }));

        case 14:
          birminghamJobs = _context.sent;

          if (!(birminghamJobs.length < 3)) {
            _context.next = 20;
            break;
          }

          newBhamJobs = [{
            title: "Data Analyst",
            description: "Data role in Birmingham.",
            location: {
              city: "Birmingham",
              postcode: "B1 1AA",
              coordinates: {
                type: "Point",
                coordinates: [-1.9025, 52.48]
              },
              remote: "hybrid"
            },
            salaryRange: {
              min: 35000,
              max: 45000,
              period: "year"
            },
            experienceLevel: "Mid",
            visaTypes: ["Skilled Worker"],
            jobType: "Full-time",
            postedBy: user ? user._id : "5c8a1d5b0190b214360dc032",
            featured: true
          }, {
            title: "DevOps Engineer",
            description: "Cloud infrastructure role.",
            location: {
              city: "Birmingham",
              postcode: "B2 4QA",
              coordinates: {
                type: "Point",
                coordinates: [-1.898, 52.478]
              },
              remote: "full"
            },
            salaryRange: {
              min: 60000,
              max: 80000,
              period: "year"
            },
            experienceLevel: "Senior",
            visaTypes: ["Skilled Worker"],
            jobType: "Full-time",
            postedBy: user ? user._id : "5c8a1d5b0190b214360dc032",
            featured: false
          }];
          _context.next = 19;
          return regeneratorRuntime.awrap(Job.create(newBhamJobs));

        case 19:
          console.log("Created 2 more Birmingham jobs.");

        case 20:
          _context.next = 25;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](0);
          console.error("Error seeding data:", _context.t0);

        case 25:
          _context.prev = 25;
          process.exit();
          return _context.finish(25);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 22, 25, 28]]);
};

seedData();