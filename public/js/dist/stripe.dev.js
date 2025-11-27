"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */
var stripe = Stripe("pk_test_51SSIpcApRaXrsBnwU1cFVHAZW4ze2xi2IJaJkGRRQlpIcHltRAVgCwQlc4S8PRYNTpcWzXO3BLn1NLpjapQErQfU00JN9Gm3wk");

exports.subscribe = function _callee(plan) {
  var session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("http://127.0.0.1:3000/api/v1/subscriptions/checkout-session/", plan));

        case 3:
          session = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(stripe.redirectToCheckout({
            sessionId: session.data.session.id
          }));

        case 6:
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          (0, _alerts.showAlert)("error", _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};