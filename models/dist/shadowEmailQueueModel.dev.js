"use strict";

var mongoose = require("mongoose");

var shadowEmailQueueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Shadow email queue must belong to a user."],
    unique: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var ShadowEmailQueue = mongoose.model("ShadowEmailQueue", shadowEmailQueueSchema);
module.exports = ShadowEmailQueue;