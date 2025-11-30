const ShadowEmailQueue = require("../models/shadowEmailQueueModel");
const User = require("../models/userModel");
const Email = require("../utils/email");

exports.processShadowEmailQueue = async () => {
  console.log("Starting Shadow Email Queue processing...");
  const queueItems = await ShadowEmailQueue.find().populate("user");

  if (queueItems.length === 0) {
    console.log("No emails in queue.");
    return;
  }

  console.log(`Found ${queueItems.length} emails to send.`);

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://ukvisasponsorship.com"
      : "http://localhost:3000";

  for (const item of queueItems) {
    const user = item.user;

    // If user was deleted, remove from queue
    if (!user) {
      await ShadowEmailQueue.findByIdAndDelete(item._id);
      continue;
    }

    try {
      // Generate claim token
      const claimToken = user.createClaimToken();
      await user.save({ validateBeforeSave: false });

      const claimUrl = `${baseUrl}/claim-account/${claimToken}`;

      await new Email(user, claimUrl).sendClaimAccount();
      console.log(`Sent claim email to ${user.email}`);

      // Delete from queue after sending
      await ShadowEmailQueue.findByIdAndDelete(item._id);
    } catch (err) {
      console.error(`Failed to send email to ${user.email}:`, err);
      // Delete from queue even if failed, to avoid infinite retry loops on bad data
      await ShadowEmailQueue.findByIdAndDelete(item._id);
    }
  }
  console.log("Shadow Email Queue processing complete.");
};
