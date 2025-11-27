"use strict";

var _require = require('./utils/geoPostcode'),
    geoPostcode = _require.geoPostcode;

var testGeo = function testGeo() {
  var m1, b1, london;
  return regeneratorRuntime.async(function testGeo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Testing Geocoding...");
          _context.next = 4;
          return regeneratorRuntime.awrap(geoPostcode("M1"));

        case 4:
          m1 = _context.sent;
          console.log("M1:", JSON.stringify(m1, null, 2));
          _context.next = 8;
          return regeneratorRuntime.awrap(geoPostcode("B1"));

        case 8:
          b1 = _context.sent;
          console.log("B1:", JSON.stringify(b1, null, 2));
          _context.next = 12;
          return regeneratorRuntime.awrap(geoPostcode("London"));

        case 12:
          london = _context.sent;
          console.log("London:", JSON.stringify(london, null, 2));
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

testGeo();