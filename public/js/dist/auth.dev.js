"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.signupEmployer = function _callee(data) {
  var res, form;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "/api/v1/users/employersignup",
            data: data
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Account created! Please check your email to verify.");
            form = document.querySelector(".form--signup-employer");

            if (form) {
              form.parentElement.innerHTML = '<div class="form__group" style="margin: 4rem 0;"><h2 class="heading-secondary ma-bt-lg">Check your email!</h2><p class="text-center" style="font-size: 1.6rem;">We have sent a verification link to your email address. Please close this tab and check your email to activate your account.</p></div>';
            }
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          (0, _alerts.showAlert)("error", _context.t0.response.data.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.logout = function _callee2() {
  var res;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "GET",
            url: "/api/v1/users/logout"
          }));

        case 3:
          res = _context2.sent;
          if (res.data.status = "success") location.assign("/");
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0.response);
          (0, _alerts.showAlert)("error", "Error logging out! Try again.");

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.login = function _callee3(email, password) {
  var res;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context3.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Logged in successfully!");
            window.setTimeout(function () {
              location.assign("/");
            }, 1500);
          }

          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          (0, _alerts.showAlert)("error", _context3.t0.response.data.message);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.signupCandidate = function _callee4(name, email, password, passwordConfirm) {
  var res, form;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
              name: name,
              email: email,
              password: password,
              passwordConfirm: passwordConfirm
            }
          }));

        case 3:
          res = _context4.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Account created! Please check your email to verify.");
            form = document.querySelector(".form--signup");

            if (form) {
              form.parentElement.innerHTML = '<div class="form__group" style="margin: 4rem 0;"><h2 class="heading-secondary ma-bt-lg">Check your email!</h2><p class="text-center" style="font-size: 1.6rem;">We have sent a verification link to your email address. Please close this tab and check your email to activate your account.</p></div>';
            }
          }

          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          (0, _alerts.showAlert)("error", _context4.t0.response.data.message);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.updateSettings = function _callee5(data, type) {
  var url, res, typeCapitalized;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          url = type === "password" ? "/api/v1/users/updatePassword" : "/api/v1/users/updateMe";
          _context5.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "PATCH",
            url: url,
            data: data
          }));

        case 4:
          res = _context5.sent;

          if (res.data.status === "success") {
            typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
            (0, _alerts.showAlert)("success", "".concat(typeCapitalized, " updated successfully!"));

            if (type === "password") {
              document.getElementById("password-current").value = "";
              document.getElementById("password").value = "";
              document.getElementById("password-confirm").value = "";
              document.querySelector(".btn--save-password").textContent = "Save password";
            }
          }

          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          (0, _alerts.showAlert)("error", _context5.t0.response.data.message);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.deleteCv = function _callee6() {
  var res;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "DELETE",
            url: "/api/v1/users/deleteCv"
          }));

        case 3:
          res = _context6.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "CV deleted successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1000);
          }

          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          (0, _alerts.showAlert)("error", _context6.t0.response.data.message);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.deleteAccount = function _callee7() {
  var res;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "DELETE",
            url: "/api/v1/users/deleteMe"
          }));

        case 3:
          res = _context7.sent;

          if (res.status === 204) {
            (0, _alerts.showAlert)("success", "Account deleted successfully! Redirecting...");
            window.setTimeout(function () {
              location.assign("/");
            }, 1500);
          }

          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          (0, _alerts.showAlert)("error", "Error deleting account! Try again.");

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.forgotPassword = function _callee8(email) {
  var res;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "/api/v1/users/forgotPassword",
            data: {
              email: email
            }
          }));

        case 3:
          res = _context8.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Token sent to email!");
          }

          _context8.next = 10;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          (0, _alerts.showAlert)("error", _context8.t0.response.data.message);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.resetPassword = function _callee9(token, password, passwordConfirm) {
  var res;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "PATCH",
            url: "/api/v1/users/resetPassword/".concat(token),
            data: {
              password: password,
              passwordConfirm: passwordConfirm
            }
          }));

        case 3:
          res = _context9.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Password reset successfully!");
            window.setTimeout(function () {
              location.assign("/");
            }, 1500);
          }

          _context9.next = 10;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          (0, _alerts.showAlert)("error", _context9.t0.response.data.message);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.claimAccount = function _callee10(token, password, passwordConfirm) {
  var res;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "PATCH",
            url: "/api/v1/users/claimAccount/".concat(token),
            data: {
              password: password,
              passwordConfirm: passwordConfirm
            }
          }));

        case 3:
          res = _context10.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Account activated successfully!");
            window.setTimeout(function () {
              location.assign("/employer-dashboard");
            }, 1500);
          }

          _context10.next = 10;
          break;

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](0);
          (0, _alerts.showAlert)("error", _context10.t0.response.data.message);

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
};