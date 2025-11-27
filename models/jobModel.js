const mongoose = require(`mongoose`);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, `Job title required`],
      trim: true,
      maxlength: [100, `Title too long`],
    },

    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: `User`,
      required: true,
    },
    companyName: {
      type: String,
    },
    companyLogo: String,
    visaTypes: [
      {
        type: String,
        enum: [
          `Skilled Worker`,
          `Health and Care`,
          `Global Talent`,
          `Graduate`,
          `Senior or Specialist Worker`,
        ],
        required: [true, `At least one visa type required`],
      },
    ],

    location: {
      city: {
        type: String,
        required: true,
      },
      region: String,
      postcode: {
        type: String,
        required: true,
      },

      remote: {
        type: String,
        enum: [`no`, `hybrid`, `full`],
        default: `no`,
      },
      coordinates: {
        type: { type: String, enum: [`Point`], default: `Point` },
        coordinates: [Number],
      },
    },

    salaryRange: {
      min: {
        type: Number,
        required: [true, `Minimum salary required`],
      },
      max: Number,
      currency: {
        type: String,
        default: `GBP`,
      },
      period: {
        type: String,
        enum: [`year`, `month`, `hour`],
        default: `year`,
      },
    },

    jobType: {
      type: String,
      required: [true, `Please select a contract type`],
      enum: [`Full-time`, `Part-time`, `Contract`, `Temporary`],
    },

    experienceLevel: {
      type: String,
      enum: [`Entry`, `Mid`, `Senior`, `Lead`],
      required: true,
    },

    description: {
      type: String,
      required: [true, `Job description required`],
      minlength: [20, `Description must be at least 20 characters`],
    },

    requirements: [String],

    benefits: [String],

    applicationUrl: {
      type: String,
    },

    applicationEmail: String,

    postedDate: {
      type: Date,
      default: Date.now,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isAdminPosted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [`active`, `reported`, `disabled`, `sub_expired`, `admin_expired`],
      default: `active`,
    },
    reports: { type: Number, default: 0, select: false },

    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      applicationClicks: {
        type: Number,
        default: 0,
      },
      saves: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.index({ title: `text`, description: `text` });
jobSchema.index({
  "location.city": 1,
  visaTypes: 1,
  status: `active` || `reported`,
});

jobSchema.index({ featured: -1, postedDate: -1 });
jobSchema.index({ postedBy: 1, status: `active` || `reported` });
jobSchema.index({ reports: -1, status: `reported` });
jobSchema.index({
  location: 1,
  visaTypes: 1,
  salary: 1,
  experienceLevel: 1,
  remoteWork: 1,
});

jobSchema.pre(`save`, async function (next) {
  if (this.isNew) {
    const user = await mongoose.model(`User`).findById(this.postedBy);
    if (user && user.role === `employer`) {
      this.companyName = user.companyProfile.companyName;
      this.companyLogo = user.companyProfile.logo;
    }
  }
  next();
});

module.exports = mongoose.model(`Job`, jobSchema);
