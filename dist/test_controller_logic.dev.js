"use strict";

var mongoose = require('mongoose');

var _require = require('./utils/geoPostcode'),
    geoPostcode = _require.geoPostcode; // Mock Request and Response


var mockReq = function mockReq(query) {
  return {
    query: query,
    user: {
      savedJobs: []
    } // Mock user

  };
};

var mockRes = {
  status: function status(code) {
    return {
      json: function json(data) {
        return console.log("Status: ".concat(code, ", Data:"), JSON.stringify(data, null, 2));
      }
    };
  }
};

var mockNext = function mockNext(err) {
  return console.log('Error:', err);
}; // Mock Job Model (we won't actually query DB, just check filter construction)
// We need to intercept the filter construction in the controller.
// Since we can't easily import just the logic, I'll copy the relevant parts of getAllJobs here for testing.


function testLogic(query) {
  var filter, searchTerms, searchConditions, coords;
  return regeneratorRuntime.async(function testLogic$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('--- Testing Query:', JSON.stringify(query));
          filter = {
            status: {
              $in: ["active", "reported"]
            }
          };

          if (query.search) {
            searchTerms = query.search.trim().split(/\s+/);
            searchConditions = searchTerms.map(function (term) {
              return {
                $or: [{
                  title: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  description: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  companyName: {
                    $regex: term,
                    $options: "i"
                  }
                }, {
                  "location.city": {
                    $regex: term,
                    $options: "i"
                  }
                }]
              };
            });

            if (searchConditions.length > 0) {
              filter.$and = searchConditions;
            }

            delete query.search;
          } // ... (skipping other filters for brevity)


          if (!(query.location && query.distance)) {
            _context.next = 16;
            break;
          }

          console.log("Geo search for: ".concat(query.location, ", dist: ").concat(query.distance));
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(geoPostcode(query.location));

        case 8:
          coords = _context.sent;
          console.log('Coords found:', coords);

          if (coords && coords.coordinates) {
            filter["location.coordinates"] = {
              $geoWithin: {
                $centerSphere: [coords.coordinates, +query.distance / 6378.1]
              }
            };
            delete query.location;
            delete query.distance;
          }

          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](5);
          console.log('Geo search failed:', _context.t0.message);

        case 16:
          if (query.location) {
            console.log("Regex search for: ".concat(query.location));
            filter["location.city"] = {
              $regex: query.location,
              $options: "i"
            };
            delete query.location;
          }

          console.log('Final Filter:', JSON.stringify(filter, null, 2));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 13]]);
}

function runTests() {
  return regeneratorRuntime.async(function runTests$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(testLogic({
            location: 'London',
            distance: '25'
          }));

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(testLogic({
            location: 'London'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(testLogic({
            location: 'London',
            distance: '50'
          }));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}

runTests();