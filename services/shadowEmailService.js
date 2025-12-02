const ShadowEmailQueue = require("../models/shadowEmailQueueModel");
const User = require("../models/userModel");
const Email = require("../utils/email");

exports.processShadowEmailQueue = async () => {
  console.log("Starting Shadow Email Queue processing...");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://ukvisasponsorship.com"
      : "http://localhost:3000";

  let processedCount = 0;

  // Process queue items one by one atomically to prevent duplicate sends in clustered environments
  while (true) {
    const item = await ShadowEmailQueue.findOneAndDelete().populate("user");

    if (!item) {
      break; // Queue is empty
    }

    const user = item.user;

    // If user was deleted, just continue (item is already removed from queue)
    if (!user) {
      continue;
    }

    try {
      // Generate claim token
      const claimToken = user.createClaimToken();
      await user.save({ validateBeforeSave: false });

      const claimUrl = `${baseUrl}/claim-account/${claimToken}`;

      await new Email(user, claimUrl).sendClaimAccount();
      console.log(`Sent claim email to ${user.email}`);
      processedCount++;
    } catch (err) {
      console.error(`Failed to send email to ${user.email}:`, err);
      // Item is already removed from queue, so it won't block others or loop infinitely
    }
  }

  console.log(
    `Shadow Email Queue processing complete. Sent ${processedCount} emails.`
  );
};
