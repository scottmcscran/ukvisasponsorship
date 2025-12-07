const mongoose = require("mongoose");

const shadowEmailQueueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Shadow email queue must belong to a user."],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  emailType: {
    type: String,
    enum: ["standard", "no-jobs"],
    default: "standard",
  },
});

const ShadowEmailQueue = mongoose.model(
  "ShadowEmailQueue",
  shadowEmailQueueSchema
);

module.exports = ShadowEmailQueue;
