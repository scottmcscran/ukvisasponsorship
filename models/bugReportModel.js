const mongoose = require("mongoose");

const bugReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A bug report must have a title"],
    trim: true,
    maxlength: [100, "Title must be less than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "A bug report must have a description"],
    trim: true,
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A bug report must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["open", "fixed"],
    default: "open",
  },
});

const BugReport = mongoose.model("BugReport", bugReportSchema);

module.exports = BugReport;
