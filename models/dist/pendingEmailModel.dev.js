"use strict";

var mongoose = require("mongoose");

var pendingEmailSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Pending email must belong to an employer"]
  },
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Pending email must have an applicant"]
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
    required: [true, "Pending email must be related to a job"]
  },
  cvFile: {
    originalname: String,
    buffer: Buffer // Store the file buffer directly

  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var PendingEmail = mongoose.model("PendingEmail", pendingEmailSchema);
module.exports = PendingEmail;