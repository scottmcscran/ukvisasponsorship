"use strict";

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var _require2 = require("util"),
    promisify = _require2.promisify;

var jwt = require("jsonwebtoken");

var User = require("../models/userModel");

var AppError = require("../utils/appError");

var Email = require("../utils/email");

var crypto = require("crypto");

var signToken = function signToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

var createSendToken = function createSendToken(user, statusCode, res) {
  var token = signToken(user._id);
  var cookieOptions = {
    expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: user
  });
  console.log("cookie set");
};

exports.signUpEmployer = catchAsync(function _callee(req, res, next) {
  var _req$body, name, email, password, passwordConfirm, companyName, legalOrgName, website, industry, companySize, newUser, verificationToken, url;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, passwordConfirm = _req$body.passwordConfirm, companyName = _req$body.companyName, legalOrgName = _req$body.legalOrgName, website = _req$body.website, industry = _req$body.industry, companySize = _req$body.companySize;
          newUser = new User({
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            role: "employer",
            emailVerified: false,
            companyProfile: {
              companyName: companyName,
              legalOrgName: legalOrgName,
              website: website,
              industry: industry,
              companySize: companySize,
              verified: false
            }
          });
          verificationToken = newUser.createEmailVerificationToken();
          _context.next = 5;
          return regeneratorRuntime.awrap(newUser.save({
            validateBeforeSave: false
          }));

        case 5:
          url = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/users/verifyEmail/").concat(verificationToken);
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(new Email(newUser, url).sendVerification());

        case 9:
          res.status(201).json({
            status: "success",
            message: "Token sent to email!"
          });
          _context.next = 23;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](6);
          console.error("EMAIL SEND ERROR:", _context.t0);

          if (!(process.env.NODE_ENV === "development")) {
            _context.next = 18;
            break;
          }

          console.log("Verification URL:", url);
          return _context.abrupt("return", res.status(201).json({
            status: "success",
            message: "Token sent to email! (Dev: Check console for URL)",
            url: url
          }));

        case 18:
          newUser.emailVerificationToken = undefined;
          newUser.emailVerificationExpires = undefined;
          _context.next = 22;
          return regeneratorRuntime.awrap(newUser.save({
            validateBeforeSave: false
          }));

        case 22:
          return _context.abrupt("return", next(new AppError("There was an error sending the email. Try again later!"), 500));

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
exports.signupCandidate = catchAsync(function _callee2(req, res, next) {
  var _req$body2, name, email, password, passwordConfirm, newUser, verificationToken, url;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, passwordConfirm = _req$body2.passwordConfirm;
          newUser = new User({
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            role: "candidate"
          });
          verificationToken = newUser.createEmailVerificationToken();
          _context2.next = 5;
          return regeneratorRuntime.awrap(newUser.save({
            validateBeforeSave: false
          }));

        case 5:
          url = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/users/verifyEmail/").concat(verificationToken);
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(new Email(newUser, url).sendVerification());

        case 9:
          res.status(201).json({
            status: "success",
            message: "Token sent to email!"
          });
          _context2.next = 23;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](6);
          console.error("EMAIL SEND ERROR:", _context2.t0);

          if (!(process.env.NODE_ENV === "development")) {
            _context2.next = 18;
            break;
          }

          console.log("Verification URL:", url);
          return _context2.abrupt("return", res.status(201).json({
            status: "success",
            message: "Token sent to email! (Dev: Check console for URL)",
            url: url
          }));

        case 18:
          newUser.emailVerificationToken = undefined;
          newUser.emailVerificationExpires = undefined;
          _context2.next = 22;
          return regeneratorRuntime.awrap(newUser.save({
            validateBeforeSave: false
          }));

        case 22:
          return _context2.abrupt("return", next(new AppError("There was an error sending the email. Try again later!"), 500));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 12]]);
});
exports.logIn = catchAsync(function _callee3(req, res, next) {
  var _req$body3, email, password, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;

          if (!(!email || !password)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Email and password required", 400)));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select("+password"));

        case 5:
          user = _context3.sent;
          _context3.t0 = !user;

          if (_context3.t0) {
            _context3.next = 11;
            break;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 10:
          _context3.t0 = !_context3.sent;

        case 11:
          if (!_context3.t0) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Incorrect email or password", 401)));

        case 13:
          if (user.emailVerified) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Please verify your email address first.", 401)));

        case 15:
          createSendToken(user, 200, res);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.logOut = catchAsync(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.cookie("jwt", "loggedout", {
            expire: new Date(Date.now()) + 10 * 1000,
            httpOnly: true
          });
          res.status(200).json({
            status: "success"
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.protect = catchAsync(function _callee5(req, res, next) {
  var token, decoded, currentUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
          } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
          }

          if (token) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", next(new AppError("You need to be logged in to access this content.", 401)));

        case 3:
          _context5.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.JWT_SECRET));

        case 5:
          decoded = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id).populate("activeJobsCount").populate("featuredJobsCount").populate("basicJobsCount").populate("disabledJobsCount"));

        case 8:
          currentUser = _context5.sent;

          if (currentUser) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", next(new AppError("User associated with this login token does not exist.", 404)));

        case 11:
          if (!currentUser.changedPasswordAfter(decoded.iat)) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", next(new AppError("This is not the correct password.", 401)));

        case 13:
          req.user = currentUser;
          res.locals.user = currentUser;
          next();

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
});

exports.restrictTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    if (!roles.includes(req.user.role)) return next(new AppError("You do not have permission to do this.", 403));
    next();
  };
};

exports.requireActiveSubscription = catchAsync(function _callee6(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          user = req.user;

          if (!(user.role !== "employer")) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", next());

        case 3:
          if (!(user.subscription.status === "trialing" && user.subscription.trialEndsAt > new Date())) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next());

        case 5:
          if (!(user.subscription.status === "active" && user.subscription.currentPeriodEnd > new Date())) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", next());

        case 7:
          return _context6.abrupt("return", next(new AppError("Active subscription required. Please upgrade your plan.", 403)));

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
});

exports.isLoggedIn = function _callee7(req, res, next) {
  var decoded, currentUser;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (!req.cookies.jwt) {
            _context7.next = 19;
            break;
          }

          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));

        case 4:
          decoded = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 7:
          currentUser = _context7.sent;

          if (currentUser) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", next());

        case 10:
          if (!currentUser.changedPasswordAfter(decoded.iat)) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", next());

        case 12:
          res.locals.user = currentUser;
          return _context7.abrupt("return", next());

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](1);
          return _context7.abrupt("return", next());

        case 19:
          next();

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

exports.forgotPassword = catchAsync(function _callee8(req, res, next) {
  var user, resetToken, resetURL;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context8.sent;

          if (user) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", next(new AppError("No user with this email.", 404)));

        case 5:
          resetToken = user.createPasswordResetToken();
          _context8.next = 8;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 8:
          _context8.prev = 8;
          resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/reset-password/").concat(resetToken);
          _context8.next = 12;
          return regeneratorRuntime.awrap(new Email(user, resetURL).sendPasswordReset());

        case 12:
          _context8.next = 22;
          break;

        case 14:
          _context8.prev = 14;
          _context8.t0 = _context8["catch"](8);
          console.log(_context8.t0);
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          _context8.next = 21;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 21:
          return _context8.abrupt("return", next(new AppError("There was an error sending the email.", 500)));

        case 22:
          res.status(200).json({
            status: "success",
            message: "Reset token has been sent to your email."
          });

        case 23:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[8, 14]]);
});
exports.resetPassword = catchAsync(function _callee9(req, res, next) {
  var hashedToken, user;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
          _context9.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context9.sent;

          if (user) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", next(new AppError("Reset token expired or invalid.", 400)));

        case 6:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          _context9.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          createSendToken(user, 200, res);

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee10(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("UpdatePassword Req Body:", req.body);
          _context10.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select("+password"));

        case 3:
          user = _context10.sent;
          _context10.next = 6;
          return regeneratorRuntime.awrap(user.correctPassword(req.body.passwordCurrent, user.password));

        case 6:
          if (_context10.sent) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", next(new AppError("Incorrect current password", 401)));

        case 8:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.passwordChangedAt = Date.now() - 1000;
          _context10.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          createSendToken(user, 200, res);

        case 14:
        case "end":
          return _context10.stop();
      }
    }
  });
});
exports.checkAccountStatus = catchAsync(function _callee11(req, res, next) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          if (!(req.user.role === "admin")) {
            _context11.next = 2;
            break;
          }

          return _context11.abrupt("return", next());

        case 2:
          if (req.user.companyProfile) {
            _context11.next = 4;
            break;
          }

          return _context11.abrupt("return", next());

        case 4:
          if (!(req.user.companyProfile.accStatus === "unverified")) {
            _context11.next = 6;
            break;
          }

          return _context11.abrupt("return", next(new AppError("Your account is pending verification. You cannot post jobs yet.", 403)));

        case 6:
          if (!(req.user.companyProfile.accStatus === "rejected")) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return", next(new AppError("Your account verification was rejected. Please contact support.", 403)));

        case 8:
          if (!(req.user.companyProfile.accStatus === "banned")) {
            _context11.next = 10;
            break;
          }

          return _context11.abrupt("return", next(new AppError("Your account has been banned.", 403)));

        case 10:
          next();

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  });
});
exports.checkJobPostLimits = catchAsync(function _callee12(req, res, next) {
  var user, tier, TIER_LIMITS, isFeatured, maxAllowed, currentCount;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          if (!(req.user.role === "admin")) {
            _context12.next = 2;
            break;
          }

          return _context12.abrupt("return", next());

        case 2:
          user = req.user;
          tier = user.subscription.tier;
          TIER_LIMITS = {
            free: {
              basic: 3,
              featured: 0
            },
            starter: {
              basic: Infinity,
              featured: 3
            },
            professional: {
              basic: Infinity,
              featured: 10
            }
          };
          isFeatured = req.body.featured;
          maxAllowed = isFeatured ? TIER_LIMITS[tier].featured : TIER_LIMITS[tier].basic;
          currentCount = isFeatured ? user.featuredJobsCount : user.basicJobsCount;

          if (!(currentCount >= maxAllowed)) {
            _context12.next = 10;
            break;
          }

          return _context12.abrupt("return", next(new AppError("Limit reached: ".concat(maxAllowed, " ").concat(isFeatured ? "featured" : "basic", " jobs allowed on ").concat(tier, " tier."), 403)));

        case 10:
          next();

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  });
});
exports.verifyEmail = catchAsync(function _callee13(req, res, next) {
  var hashedToken, user;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
          _context13.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context13.sent;

          if (user) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return", next(new AppError("Token is invalid or has expired", 400)));

        case 6:
          user.emailVerified = true;
          user.emailVerificationToken = undefined;
          user.emailVerificationExpires = undefined;
          _context13.next = 11;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 11:
          createSendToken(user, 200, res);

        case 12:
        case "end":
          return _context13.stop();
      }
    }
  });
});
exports.claimAccount = catchAsync(function _callee14(req, res, next) {
  var hashedToken, user;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          // 1) Get user based on the token
          hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
          _context14.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            claimToken: hashedToken,
            claimTokenExpires: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context14.sent;

          if (user) {
            _context14.next = 6;
            break;
          }

          return _context14.abrupt("return", next(new AppError("Token is invalid or has expired", 400)));

        case 6:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.claimToken = undefined;
          user.claimTokenExpires = undefined;
          user.isClaimed = true;
          user.active = true;
          _context14.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          // 3) Log the user in, send JWT
          createSendToken(user, 200, res);

        case 15:
        case "end":
          return _context14.stop();
      }
    }
  });
});