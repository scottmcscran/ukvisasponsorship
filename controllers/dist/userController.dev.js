"use strict";

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var multer = require("multer");

var r2 = require("../utils/r2");

var User = require("./../models/userModel");

var Job = require("./../models/jobModel");

var AppError = require("../utils/appError");

var factory = require("./handlerFactory");

var filterObj = function filterObj(obj) {
  for (var _len = arguments.length, allowedFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFields[_key - 1] = arguments[_key];
  }

  var newObj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(function _callee(req, res, next) {
  var filteredBody, allowedCompanyFields, ext, filename, updatedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("UpdateMe Req Body:", req.body);
          console.log("UpdateMe Req File:", req.file);

          if (!(req.body.password || req.body.passwordConfirm)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", next(new AppError("This route is not for password changes. Head over to /updatePassword", 400)));

        case 4:
          filteredBody = filterObj(req.body, "name", "email");

          if (req.user.role === "employer" && req.body.companyProfile) {
            allowedCompanyFields = ["companyName", "website", "industry", "companySize", "description"];
            Object.keys(req.body.companyProfile).forEach(function (key) {
              if (allowedCompanyFields.includes(key)) {
                filteredBody["companyProfile.".concat(key)] = req.body.companyProfile[key];
              }
            });
          }

          if (!req.file) {
            _context.next = 13;
            break;
          }

          ext = req.file.mimetype.split("/")[1];

          if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            ext = "docx";
          } else if (req.file.mimetype === "application/msword") {
            ext = "doc";
          }

          filename = "user-".concat(req.user.id, "-").concat(Date.now(), ".").concat(ext);
          _context.next = 12;
          return regeneratorRuntime.awrap(r2.uploadFile(req.file.buffer, filename, req.file.mimetype));

        case 12:
          filteredBody.cv = filename;

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, filteredBody, {
            "new": true,
            runValidators: true
          }));

        case 15:
          updatedUser = _context.sent;
          res.status(200).json({
            status: "success",
            updatedUser: updatedUser
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.deleteMe = catchAsync(function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!req.user.cv) {
            _context2.next = 9;
            break;
          }

          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(r2.deleteFile(req.user.cv));

        case 4:
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](1);
          console.error("Failed to delete CV from R2 during account deletion:", _context2.t0);

        case 9:
          if (!(req.user.role === "employer")) {
            _context2.next = 12;
            break;
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(Job.deleteMany({
            postedBy: req.user.id
          }));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(req.user.id));

        case 14:
          res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
          });
          res.status(204).json({
            status: "success",
            message: null
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 6]]);
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
var multerStorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype && (file.mimetype.startsWith("application/pdf") || file.mimetype.startsWith("application/msword") || file.mimetype.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
    cb(null, true);
  } else {
    cb(new AppError("Not a valid file! Please upload only PDF or Word documents.", 400), false);
  }
};

var upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
exports.uploadCv = upload.single("cv");
exports.deleteCv = catchAsync(function _callee3(req, res, next) {
  var user, updatedUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context3.sent;

          if (!user.cv) {
            _context3.next = 12;
            break;
          }

          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(r2.deleteFile(user.cv));

        case 7:
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](4);
          console.log("Error deleting file from R2:", _context3.t0);

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $unset: {
              cv: 1
            }
          }, {
            "new": true
          }));

        case 14:
          updatedUser = _context3.sent;
          res.status(200).json({
            status: "success",
            data: {
              user: updatedUser
            }
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 9]]);
});