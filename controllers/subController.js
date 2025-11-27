const AppError = require("../utils/appError");
const { catchAsync } = require(`./../utils/catchAsync`);

const User = require(`./../models/userModel`);
const Job = require(`../models/jobModel`);
const {
  handleSubscriptionStatusChange,
} = require("../services/subscriptionService");
const stripe = require(`stripe`)(process.env.STRIPE_SECRET_KEY);

const PLAN_TO_PRICE_ID = {
  starter: process.env.BASIC_SUB_PRICE_ID,
  professional: process.env.PRO_SUB_PRICE_ID,
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { plan } = req.body;
  const priceId = PLAN_TO_PRICE_ID[plan];

  if (!priceId) {
    return next(new AppError(`Invalid subscription plan selected.`, 400));
  }

  const user = await User.findById(req.user.id);

  let stripeCustomerId = user.subscription.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    stripeCustomerId = customer.id;

    user.subscription.stripeCustomerId = stripeCustomerId;
    await user.save({ validateBeforeSave: false });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: [`card`],
    success_url: `${req.protocol}://${req.get(`host`)}/employer-dashboard?alert=subscription_success`,
    cancel_url: `${req.protocol}://${req.get(`host`)}/employer-dashboard?alert=subscription_cancelled`,
    customer: stripeCustomerId,
    client_reference_id: req.user.id,
    metadata: {
      plan: plan,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: `subscription`,
  });

  res.status(200).json({
    status: `success`,
    session,
  });
});

exports.createBillingPortalSession = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.subscription.stripeCustomerId) {
    return next(
      new AppError("No Stripe customer ID found for this user.", 400)
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${req.protocol}://${req.get("host")}/employer-dashboard`,
  });

  res.status(200).json({
    status: "success",
    url: session.url,
  });
});

exports.webhookCheckout = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  console.log(`Webhook received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const tier = session.metadata.plan;

    if (userId && tier) {
      await handleSubscriptionStatusChange(userId, tier, "active");
    }
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const user = await User.findOne({
      "subscription.stripeCustomerId": subscription.customer,
    });

    if (user) {
      await handleSubscriptionStatusChange(
        user._id,
        user.subscription.tier,
        "expired"
      );
    }
  } else if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    const user = await User.findOne({
      "subscription.stripeCustomerId": subscription.customer,
    });

    if (user) {
      // Map Stripe price ID to plan name
      let newTier = "free";
      const priceId = subscription.items.data[0].price.id;

      if (priceId === process.env.BASIC_SUB_PRICE_ID) newTier = "starter";
      if (priceId === process.env.PRO_SUB_PRICE_ID) newTier = "professional";

      // Only update if tier changed or status changed
      if (
        user.subscription.tier !== newTier ||
        subscription.status !== "active"
      ) {
        await handleSubscriptionStatusChange(
          user._id,
          newTier,
          subscription.status === "active" ? "active" : "expired"
        );
      }
    }
  } else if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const user = await User.findOne({
      "subscription.stripeCustomerId": invoice.customer,
    });

    if (user && invoice.subscription) {
      // We assume the tier hasn't changed on renewal
      await handleSubscriptionStatusChange(
        user._id,
        user.subscription.tier,
        "active"
      );
    }
  } else if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const user = await User.findOne({
      "subscription.stripeCustomerId": invoice.customer,
    });

    if (user) {
      // Optionally handle grace periods, but for now we can mark as expired or past_due
      // handleSubscriptionStatusChange(user._id, user.subscription.tier, 'expired');
    }
  }

  res.status(200).json({ received: true });
};

exports.updateSubCheckout = async (req, res, next) => {
  const { user, tier } = req.query;

  if (!user && !tier) return next();

  handleSubscriptionStatusChange(user, tier, `active`);

  res.redirect(req.originalUrl.split(`?`)[0]);
};

exports.downgradeToStarter = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.subscription.stripeCustomerId) {
    return next(new AppError("No subscription found", 404));
  }

  // Find the active subscription
  const subscriptions = await stripe.subscriptions.list({
    customer: user.subscription.stripeCustomerId,
    status: "active",
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return next(new AppError("No active subscription found", 404));
  }

  const subscription = subscriptions.data[0];
  const subId = subscription.id;
  const itemId = subscription.items.data[0].id;

  // Update subscription to Starter Price
  // Note: This assumes immediate update. Proration behavior depends on Stripe settings.
  await stripe.subscriptions.update(subId, {
    items: [
      {
        id: itemId,
        price: process.env.BASIC_SUB_PRICE_ID, // Starter Price ID
      },
    ],
    metadata: {
      plan: "starter",
    },
  });

  // Handle Featured Jobs Limit (Max 3)
  const { keepFeaturedJobIds } = req.body;

  // 1. Update User Tier
  await User.findByIdAndUpdate(user._id, {
    "subscription.tier": "starter",
  });

  // 2. Handle Featured Jobs
  if (keepFeaturedJobIds && keepFeaturedJobIds.length > 0) {
    // Keep selected jobs featured
    // (No action needed for them, they stay featured)

    // Un-feature others
    await Job.updateMany(
      {
        postedBy: user._id,
        featured: true,
        _id: { $nin: keepFeaturedJobIds },
      },
      { featured: false }
    );
  } else {
    // Fallback: Keep 3 newest featured, un-feature rest
    const featuredJobs = await Job.find({
      postedBy: user._id,
      featured: true,
      status: "active",
    }).sort("-createdAt");

    if (featuredJobs.length > 3) {
      const jobsToKeep = featuredJobs.slice(0, 3);
      const jobsToUnfeature = featuredJobs.slice(3);

      const unfeatureIds = jobsToUnfeature.map((j) => j._id);

      await Job.updateMany({ _id: { $in: unfeatureIds } }, { featured: false });
    }
  }

  res.status(200).json({
    status: "success",
    message: "Downgraded to Starter successfully",
  });
});
