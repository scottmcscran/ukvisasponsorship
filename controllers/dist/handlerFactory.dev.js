"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var AppError = require("../utils/appError");

var APIFeatures = require("../utils/apiFeatures");

var User = require("../models/userModel");

exports.deleteOne = function (Model) {
  return catchAsync(function _callee(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(req.params.id));

          case 2:
            doc = _context.sent;

            if (doc) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", next(new AppError("No document with that ID", 404)));

          case 5:
            res.status(204).json({
              status: "success",
              data: null
            });
            console.log("Deleted data successfully");

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  });
};

exports.updateOne = function (Model) {
  return catchAsync(function _callee2(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(Model.findByIdAndUpdate(req.params.id, req.body, // Return new data to show client
            // Running validators makes sure the validators run on updating info.
            {
              "new": true,
              runValidators: true
            }));

          case 2:
            doc = _context2.sent;

            if (doc) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", next(new AppError("No document with that ID", 404)));

          case 5:
            res.status(200).json({
              status: "success",
              data: {
                doc: doc
              }
            });
            console.log("Updated data successfully");

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
};

exports.createOne = function (Model) {
  return catchAsync(function _callee3(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(Model.create(req.body));

          case 2:
            doc = _context3.sent;
            res.status(201).json({
              status: "success",
              data: {
                doc: doc
              }
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

exports.getAll = function (Model, defaultFilter) {
  return catchAsync(function _callee4(req, res, next) {
    var filter, features, doc;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            filter = _objectSpread({}, defaultFilter); // Build query

            features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate(); // Execute query

            _context4.next = 4;
            return regeneratorRuntime.awrap(features.query);

          case 4:
            doc = _context4.sent;
            // Send Response
            res.status(200).json({
              status: "success",
              results: doc.length,
              data: {
                data: doc
              }
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
};

exports.getOne = function (Model, popOptions) {
  return catchAsync(function _callee5(req, res, next) {
    var query, doc;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = Model.findById(req.params.id);
            if (popOptions) query = query.populate(popOptions);
            _context5.next = 4;
            return regeneratorRuntime.awrap(query);

          case 4:
            doc = _context5.sent;

            if (doc) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", next(new AppError("No document with that ID", 404)));

          case 7:
            res.status(200).json({
              status: "success",
              data: doc
            });

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};