const mongoose = require(`mongoose`);
const { Schema } = mongoose;
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, `Email required`],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, `Invalid email`],
    },

    password: {
      type: String,
      required: [true, `Password required`],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: [`candidate`, `employer`, `admin`],
      default: `candidate`,
    },

    name: {
      type: String,
      required: [true, `Name required`],
    },

    photo: String,
    cv: String, // Path to the user's CV file

    companyProfile: {
      companyName: {
        type: String,
        required: function () {
          return this.role === `employer`;
        },
      },

      legalOrgName: {
        type: String,
        required: function () {
          return this.role === `employer`;
        },
        unique: true,
        sparse: [true, `This organization already exists in our system`],
      },

      accStatus: {
        type: String,
        enum: [`unverified`, `verified`, `banned`, `rejected`],
        default: `unverified`,
      },

      deletedReportedJobsCount: {
        type: Number,
        default: 0,
      },

      website: String,

      logo: String,

      description: String,

      industry: {
        type: String,
        enum: [
          `Technology`,
          `Healthcare`,
          `Finance`,
          `Engineering`,
          `Education`,
          `Manufacturing`,
          `Retail`,
          `Hospitality`,
          `Other`,
        ],
      },

      companySize: {
        type: String,
        enum: [`1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1000+`],
      },

      locations: [String],

      contactPhone: String,
    },

    subscription: {
      tier: {
        type: String,
        enum: [`free`, `starter`, `professional`],
        default: `free`,
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      status: {
        type: String,
        enum: [`trialing`, `active`, `cancelled`, `sub_expired`],
        default: `active`,
      },
      trialEndsAt: Date,
      currentPeriodEnd: Date,
    },

    savedJobs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: `Job`,
      },
    ],

    appliedJobs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: `Job`,
      },
    ],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isClaimed: {
      type: Boolean,
      default: true,
    },
    claimToken: String,
    claimTokenExpires: Date,

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual(`activeJobsCount`, {
  ref: `Job`,
  foreignField: `postedBy`,
  localField: `_id`,
  count: true,
  match: { status: { $ne: "disabled" } },
});

userSchema.virtual(`basicJobsCount`, {
  ref: `Job`,
  foreignField: `postedBy`,
  localField: `_id`,
  count: true,
  match: { status: { $ne: "disabled" }, featured: false },
});

userSchema.virtual(`featuredJobsCount`, {
  ref: `Job`,
  foreignField: `postedBy`,
  localField: `_id`,
  count: true,
  match: { status: { $ne: "disabled" }, featured: true },
});

userSchema.virtual(`disabledJobsCount`, {
  ref: `Job`,
  foreignField: `postedBy`,
  localField: `_id`,
  count: true,
  match: { status: `disabled` },
});

userSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString(`hex`);

  this.emailVerificationToken = crypto
    .createHash(`sha256`)
    .update(verificationToken)
    .digest(`hex`);

  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

userSchema.methods.createClaimToken = function () {
  const claimToken = crypto.randomBytes(32).toString("hex");

  this.claimToken = crypto
    .createHash("sha256")
    .update(claimToken)
    .digest("hex");

  this.claimTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  return claimToken;
};

const User = mongoose.model(`User`, userSchema);

module.exports = User;
