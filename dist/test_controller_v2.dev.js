"use strict";

var _require = require("./utils/geoPostcode"),
    geoPostcode = _require.geoPostcode; // Mock Controller Logic


function testLogic(query) {
  var filter, locationQuery, distance, coords;
  return regeneratorRuntime.async(function testLogic$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("--- Testing Query:", JSON.stringify(query));
          filter = {
            status: {
              $in: ["active", "reported"]
            }
          }; // ... (skipping other filters)
          // --- REBUILT LOCATION SEARCH LOGIC ---

          if (!query.location) {
            _context.next = 19;
            break;
          }

          locationQuery = query.location.trim();
          distance = query.distance ? +query.distance : 25; // Default to 25 miles if not specified

          console.log("Processing location search: \"".concat(locationQuery, "\" with distance: ").concat(distance, " miles"));
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(geoPostcode(locationQuery));

        case 9:
          coords = _context.sent;

          if (coords && coords.coordinates) {
            console.log("Geocoded \"".concat(locationQuery, "\" to:"), coords.coordinates); // 2. Apply Geospatial Filter

            filter["location.coordinates"] = {
              $geoWithin: {
                $centerSphere: [coords.coordinates, distance / 6378.1] // radians

              }
            };
          }

          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](6);
          console.log("Geocoding failed for \"".concat(locationQuery, "\":"), _context.t0.message); // 3. Fallback

          filter.$or = [{
            "location.city": {
              $regex: locationQuery,
              $options: "i"
            }
          }, {
            "location.postcode": {
              $regex: locationQuery,
              $options: "i"
            }
          }];

        case 17:
          delete query.location;
          delete query.distance;

        case 19:
          // -------------------------------------
          console.log("Final Filter:", JSON.stringify(filter, null, 2));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 13]]);
}

function runTests() {
  return regeneratorRuntime.async(function runTests$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(testLogic({
            location: "London",
            distance: "50"
          }));

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(testLogic({
            location: "London"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(testLogic({
            location: "InvalidLocation123"
          }));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}

runTests();