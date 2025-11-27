"use strict";

var axios = require("axios");

var API_BASE = "http://localhost:3000/api/v1/jobs/search";
var tests = [{
  name: "Central London 5km",
  url: "".concat(API_BASE, "?lat=51.5174&lng=-0.0933&distance=5"),
  expected: 2
}, {
  name: "London text search",
  url: "".concat(API_BASE, "?location=London"),
  expected: 3
}, {
  name: "Manchester 20km",
  url: "".concat(API_BASE, "?lat=53.4808&lng=-2.2426&distance=20"),
  expected: 1
}, {
  name: "Birmingham text",
  url: "".concat(API_BASE, "?location=Birmingham"),
  expected: 1
}, {
  name: "Remote jobs",
  url: "".concat(API_BASE, "?remoteWork=full"),
  expected: 2
}, {
  name: "Hybrid jobs",
  url: "".concat(API_BASE, "?remoteWork=hybrid"),
  expected: 3
}, {
  name: "Senior level",
  url: "".concat(API_BASE, "?experienceLevel=Senior"),
  expected: 3
}, {
  name: "Global Talent",
  url: "".concat(API_BASE, "?visaTypes=Global Talent"),
  expected: 2
}, {
  name: "Salary 50k+",
  url: "".concat(API_BASE, "?salaryMin=50000"),
  expected: 3
}, {
  name: "All UK 600km",
  url: "".concat(API_BASE, "?lat=51.5074&lng=-0.1278&distance=600"),
  expected: 8
}];

function runTests() {
  var _i, _tests, test, response, pass;

  return regeneratorRuntime.async(function runTests$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("🧪 Running geolocation tests...\n");
          _i = 0, _tests = tests;

        case 2:
          if (!(_i < _tests.length)) {
            _context.next = 19;
            break;
          }

          test = _tests[_i];
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(axios.get(test.url));

        case 7:
          response = _context.sent;
          pass = response.data.results === test.expected;
          console.log("".concat(pass ? "✅" : "❌", " ").concat(test.name, ": ").concat(response.data.results, "/").concat(test.expected, " jobs"));

          if (!pass) {
            response.data.data.jobs.forEach(function (job) {
              console.log("   - ".concat(job.title, " (").concat(job.location.postcode, ")"));
            });
          }

          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](4);
          console.error("\u274C ".concat(test.name, ": ").concat(_context.t0.message));

        case 16:
          _i++;
          _context.next = 2;
          break;

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 13]]);
}

runTests();