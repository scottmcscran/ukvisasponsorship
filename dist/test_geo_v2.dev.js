"use strict";

var _require = require('./utils/geoPostcode'),
    geoPostcode = _require.geoPostcode;

function test() {
  var london, postcode;
  return regeneratorRuntime.async(function test$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('Testing London...');
          _context.next = 4;
          return regeneratorRuntime.awrap(geoPostcode('London'));

        case 4:
          london = _context.sent;
          console.log('London:', london);
          console.log('Testing SW1A 1AA...');
          _context.next = 9;
          return regeneratorRuntime.awrap(geoPostcode('SW1A 1AA'));

        case 9:
          postcode = _context.sent;
          console.log('SW1A 1AA:', postcode);
          console.log('Testing Invalid...');
          _context.next = 14;
          return regeneratorRuntime.awrap(geoPostcode('InvalidLocation12345'));

        case 14:
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.log('Error:', _context.t0.message);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

test();