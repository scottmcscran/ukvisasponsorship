"use strict";

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var validator = require("validator");

var bcrypt = require("bcryptjs");

var crypto = require("crypto");

var userSchema = new mongoose.Schema((_ref = {
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    "enum": ["candidate", "employer", "admin"],
    "default": "candidate"
  },
  name: {
    type: String,
    required: [true, "Name required"]
  },
  photo: String,
  cv: String,
  // Path to the user's CV file
  companyProfile: {
    companyName: {
      type: String,
      required: function required() {
        return this.role === "employer";
      }
    },
    legalOrgName: {
      type: String,
      required: function required() {
        return this.role === "employer";
      },
      unique: true,
      sparse: [true, "This organization already exists in our system"]
    },
    accStatus: {
      type: String,
      "enum": ["unverified", "verified", "banned", "rejected"],
      "default": "unverified"
    },
    deletedReportedJobsCount: {
      type: Number,
      "default": 0
    },
    website: String,
    logo: String,
    description: String,
    industry: {
      type: String,
      "enum": ["Technology", "Healthcare", "Finance", "Engineering", "Education", "Manufacturing", "Retail", "Hospitality", "Other"]
    },
    companySize: {
      type: String,
      "enum": ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
    },
    locations: [String],
    contactPhone: String
  },
  subscription: {
    tier: {
      type: String,
      "enum": ["free", "starter", "professional"],
      "default": "free"
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    status: {
      type: String,
      "enum": ["trialing", "active", "cancelled", "sub_expired"],
      "default": "active"
    },
    trialEndsAt: Date,
    currentPeriodEnd: Date
  },
  savedJobs: [{
    type: mongoose.Schema.ObjectId,
    ref: "Job"
  }],
  appliedJobs: [{
    type: mongoose.Schema.ObjectId,
    ref: "Job"
  }],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  emailVerified: {
    type: Boolean,
    "default": false
  },
  isClaimed: {
    type: Boolean,
    "default": true
  },
  claimToken: String,
  claimTokenExpires: Date,
  active: {
    type: Boolean,
    "default": true,
    select: false
  }
}, _defineProperty(_ref, "emailVerified", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "emailVerificationToken", String), _defineProperty(_ref, "emailVerificationExpires", Date), _ref), {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
userSchema.virtual("activeJobsCount", {
  ref: "Job",
  foreignField: "postedBy",
  localField: "_id",
  count: true,
  match: {
    status: {
      $ne: "disabled"
    }
  }
});
userSchema.virtual("basicJobsCount", {
  ref: "Job",
  foreignField: "postedBy",
  localField: "_id",
  count: true,
  match: {
    status: {
      $ne: "disabled"
    },
    featured: false
  }
});
userSchema.virtual("featuredJobsCount", {
  ref: "Job",
  foreignField: "postedBy",
  localField: "_id",
  count: true,
  match: {
    status: {
      $ne: "disabled"
    },
    featured: true
  }
});
userSchema.virtual("disabledJobsCount", {
  ref: "Job",
  foreignField: "postedBy",
  localField: "_id",
  count: true,
  match: {
    status: "disabled"
  }
});
userSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

        case 4:
          this.password = _context.sent;
          this.passwordChangedAt = Date.now() - 1000;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});

userSchema.methods.correctPassword = function _callee2(candidatePassword, userPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(candidatePassword, userPassword));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    var changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  var resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  var verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
  return verificationToken;
};

userSchema.methods.createClaimToken = function () {
  var claimToken = crypto.randomBytes(32).toString("hex");
  this.claimToken = crypto.createHash("sha256").update(claimToken).digest("hex");
  this.claimTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  return claimToken;
};

var User = mongoose.model("User", userSchema);
module.exports = User;