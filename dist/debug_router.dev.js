"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var viewController = require("./controllers/viewController");

var authController = require("./controllers/authController");

console.log("viewController.getCv:", _typeof(viewController.getCv));
console.log("authController.protect:", _typeof(authController.protect));
console.log("viewController keys:", Object.keys(viewController));