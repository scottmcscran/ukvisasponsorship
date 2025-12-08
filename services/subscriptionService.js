const cron = require(`node-cron`);
const Job = require(`../models/jobModel`);
const User = require(`../models/userModel`);

exports.handleSubscriptionStatusChange = async (
  userId,
  tier,
  newStatus,
  keepJobIds = []
) => {
  if (newStatus === `active` || newStatus === `trialing`) {
    // Reactivate any expired jobs (since paid tiers have unlimited active jobs)
    await Job.updateMany(
      { postedBy: userId, status: `sub_expired` },
      { status: `active` }
    );

    // Handle Featured Job Limits based on new Tier
    let featuredLimit = 0;
    if (tier === "starter") featuredLimit = 3;
    if (tier === "professional") featuredLimit = 10;

    const featuredJobs = await Job.find({
      postedBy: userId,
      featured: true,
    }).sort("-createdAt");

    if (featuredJobs.length > featuredLimit) {
      const jobsToKeepFeatured = featuredJobs.slice(0, featuredLimit);
      const jobsToUnfeature = featuredJobs.slice(featuredLimit);
      const unfeatureIds = jobsToUnfeature.map((j) => j._id);

      await Job.updateMany({ _id: { $in: unfeatureIds } }, { featured: false });
    }

    await User.findByIdAndUpdate(userId, {
      "subscription.tier": tier,
      "subscription.status": "active",
      "subscription.currentPeriodEnd": new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    });
  } else if (newStatus === `expired` || newStatus === `cancelled`) {
    // 1. Un-feature ALL jobs (Free tier has 0 featured)
    await Job.updateMany({ postedBy: userId }, { featured: false });

    // 2. Handle Active Jobs Limit (Max 3)
    if (keepJobIds && keepJobIds.length > 0) {
      // Keep selected jobs active
      await Job.updateMany(
        { postedBy: userId, _id: { $in: keepJobIds } },
        { status: "active" }
      );
      // Expire others
      await Job.updateMany(
        { postedBy: userId, _id: { $nin: keepJobIds }, status: "active" },
        { status: "sub_expired" }
      );
    } else {
      // Fallback: If no IDs provided, keep 3 newest active, expire rest
      const activeJobs = await Job.find({
        postedBy: userId,
        status: "active",
      }).sort("-createdAt");

      if (activeJobs.length > 3) {
        const jobsToKeep = activeJobs.slice(0, 3);
        const jobsToExpire = activeJobs.slice(3);

        const keepIds = jobsToKeep.map((j) => j._id);
        const expireIds = jobsToExpire.map((j) => j._id);

        await Job.updateMany(
          { _id: { $in: expireIds } },
          { status: "sub_expired" }
        );
      }
      // If <= 3, do nothing (they stay active)
    }

    await User.findByIdAndUpdate(userId, {
      "subscription.tier": "free",
      "subscription.status": "cancelled",
      "subscription.currentPeriodEnd": undefined,
    });
  }
};

exports.dailySubscriptionCheck = async () => {
  const expiredUsers = await User.find({
    "subscription.currentPeriodEnd": { $lt: new Date() },
    "subscription.status": { $nin: [`active`, `trialing`] },
    role: `employer`,
  });

  const userIds = expiredUsers.map((u) => u._id);

  if (userIds.length > 0) {
    await Job.updateMany(
      { postedBy: { $in: userIds }, status: `active` },
      { status: `sub_expired` }
    );
  }

  console.log(`Daily check: ${userIds.length} users' jobs expired`);
};

exports.checkShadowAccountExpirations = async () => {
  const threeWeeksAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);

  // 1. Delete Unclaimed Accounts older than 3 weeks
  const unclaimedExpiredUsers = await User.find({
    isClaimed: false,
    claimEmailSentAt: { $lt: threeWeeksAgo },
  }).select("_id");

  if (unclaimedExpiredUsers.length > 0) {
    const unclaimedUserIds = unclaimedExpiredUsers.map((u) => u._id);

    // Delete jobs associated with these users
    await Job.deleteMany({ postedBy: { $in: unclaimedUserIds } });

    // Delete the users
    const deleteResult = await User.deleteMany({
      _id: { $in: unclaimedUserIds },
    });

    console.log(
      `Shadow Account Cleanup: Deleted ${deleteResult.deletedCount} unclaimed accounts.`
    );
  }

  // 2. Expire Admin-Posted Jobs for users who have had the email for > 3 weeks (Claimed or Unclaimed - though unclaimed are deleted above)
  // Find users who had the claim email sent more than 3 weeks ago
  const expiredUsers = await User.find({
    claimEmailSentAt: { $lt: threeWeeksAgo },
  }).select("_id");

  const expiredUserIds = expiredUsers.map((u) => u._id);

  if (expiredUserIds.length > 0) {
    // Expire jobs posted by these users that are admin posted and active
    const result = await Job.updateMany(
      {
        isAdminPosted: true,
        status: "active",
        postedBy: { $in: expiredUserIds },
      },
      {
        status: "admin_expired",
      }
    );

    console.log(
      `Admin Posted Job Cleanup: Expired ${result.modifiedCount} jobs.`
    );
  } else {
    console.log(`Admin Posted Job Cleanup: No jobs to expire.`);
  }
};
