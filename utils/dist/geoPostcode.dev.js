"use strict";

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var _require2 = require("../utils/appError"),
    AppError = _require2.AppError;

var axios = require("axios");

exports.geoPostcode = catchAsync(function _callee(code, next) {
  var postcode, response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          postcode = code.replace(/\s/g, "");

          if (!(postcode.length != 6)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next(new AppError("Please enter a valid postcode")));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(axios.get("https://api.postcodes.io/postcodes/".concat(postcode)));

        case 5:
          response = _context.sent;

          if (!(response.data.status === 200)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", {
            type: "Point",
            coordinates: [response.data.result.longitude, response.data.result.latitude]
          });

        case 8:
          throw new AppError("Invalid postcode", 400);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});