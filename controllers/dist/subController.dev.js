"use strict";

var AppError = require("../utils/appError");

var _require = require("./../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var User = require("./../models/userModel");

var Job = require("../models/jobModel");

var _require2 = require("../services/subscriptionService"),
    handleSubscriptionStatusChange = _require2.handleSubscriptionStatusChange;

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var PLAN_TO_PRICE_ID = {
  starter: process.env.BASIC_SUB_PRICE_ID,
  professional: process.env.PRO_SUB_PRICE_ID
};
exports.getCheckoutSession = catchAsync(function _callee(req, res, next) {
  var plan, priceId, user, stripeCustomerId, customer, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          plan = req.body.plan;
          priceId = PLAN_TO_PRICE_ID[plan];

          if (priceId) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", next(new AppError("Invalid subscription plan selected.", 400)));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 6:
          user = _context.sent;
          stripeCustomerId = user.subscription.stripeCustomerId;

          if (stripeCustomerId) {
            _context.next = 16;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {
              userId: user.id
            }
          }));

        case 11:
          customer = _context.sent;
          stripeCustomerId = customer.id;
          user.subscription.stripeCustomerId = stripeCustomerId;
          _context.next = 16;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: "".concat(req.protocol, "://").concat(req.get("host"), "/employer-dashboard?alert=subscription_success"),
            cancel_url: "".concat(req.protocol, "://").concat(req.get("host"), "/employer-dashboard?alert=subscription_cancelled"),
            customer: stripeCustomerId,
            client_reference_id: req.user.id,
            metadata: {
              plan: plan
            },
            line_items: [{
              price: priceId,
              quantity: 1
            }],
            mode: "subscription"
          }));

        case 18:
          session = _context.sent;
          res.status(200).json({
            status: "success",
            session: session
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.createBillingPortalSession = catchAsync(function _callee2(req, res, next) {
  var user, session;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context2.sent;

          if (user.subscription.stripeCustomerId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError("No Stripe customer ID found for this user.", 400)));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(stripe.billingPortal.sessions.create({
            customer: user.subscription.stripeCustomerId,
            return_url: "".concat(req.protocol, "://").concat(req.get("host"), "/employer-dashboard")
          }));

        case 7:
          session = _context2.sent;
          res.status(200).json({
            status: "success",
            url: session.url
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.webhookCheckout = function _callee3(req, res) {
  var signature, event, session, userId, tier, subscription, user, _subscription, _user, newTier, priceId, invoice, _user2, _invoice, _user3;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("Webhook received:", req.headers["stripe-signature"] ? "Signature present" : "No signature");
          signature = req.headers["stripe-signature"];
          _context3.prev = 2;
          event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
          _context3.next = 10;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](2);
          console.error("Webhook signature verification failed: ".concat(_context3.t0.message));
          return _context3.abrupt("return", res.status(400).send("Webhook error: ".concat(_context3.t0.message)));

        case 10:
          console.log("Webhook received: ".concat(event.type));

          if (!(event.type === "checkout.session.completed")) {
            _context3.next = 20;
            break;
          }

          session = event.data.object;
          userId = session.client_reference_id;
          tier = session.metadata.plan;

          if (!(userId && tier)) {
            _context3.next = 18;
            break;
          }

          _context3.next = 18;
          return regeneratorRuntime.awrap(handleSubscriptionStatusChange(userId, tier, "active"));

        case 18:
          _context3.next = 61;
          break;

        case 20:
          if (!(event.type === "customer.subscription.deleted")) {
            _context3.next = 30;
            break;
          }

          subscription = event.data.object;
          _context3.next = 24;
          return regeneratorRuntime.awrap(User.findOne({
            "subscription.stripeCustomerId": subscription.customer
          }));

        case 24:
          user = _context3.sent;

          if (!user) {
            _context3.next = 28;
            break;
          }

          _context3.next = 28;
          return regeneratorRuntime.awrap(handleSubscriptionStatusChange(user._id, user.subscription.tier, "expired"));

        case 28:
          _context3.next = 61;
          break;

        case 30:
          if (!(event.type === "customer.subscription.updated")) {
            _context3.next = 45;
            break;
          }

          _subscription = event.data.object;
          _context3.next = 34;
          return regeneratorRuntime.awrap(User.findOne({
            "subscription.stripeCustomerId": _subscription.customer
          }));

        case 34:
          _user = _context3.sent;

          if (!_user) {
            _context3.next = 43;
            break;
          }

          // Map Stripe price ID to plan name
          newTier = "free";
          priceId = _subscription.items.data[0].price.id;
          if (priceId === process.env.BASIC_SUB_PRICE_ID) newTier = "starter";
          if (priceId === process.env.PRO_SUB_PRICE_ID) newTier = "professional"; // Only update if tier changed or status changed

          if (!(_user.subscription.tier !== newTier || _subscription.status !== "active")) {
            _context3.next = 43;
            break;
          }

          _context3.next = 43;
          return regeneratorRuntime.awrap(handleSubscriptionStatusChange(_user._id, newTier, _subscription.status === "active" ? "active" : "expired"));

        case 43:
          _context3.next = 61;
          break;

        case 45:
          if (!(event.type === "invoice.payment_succeeded")) {
            _context3.next = 55;
            break;
          }

          invoice = event.data.object;
          _context3.next = 49;
          return regeneratorRuntime.awrap(User.findOne({
            "subscription.stripeCustomerId": invoice.customer
          }));

        case 49:
          _user2 = _context3.sent;

          if (!(_user2 && invoice.subscription)) {
            _context3.next = 53;
            break;
          }

          _context3.next = 53;
          return regeneratorRuntime.awrap(handleSubscriptionStatusChange(_user2._id, _user2.subscription.tier, "active"));

        case 53:
          _context3.next = 61;
          break;

        case 55:
          if (!(event.type === "invoice.payment_failed")) {
            _context3.next = 61;
            break;
          }

          _invoice = event.data.object;
          _context3.next = 59;
          return regeneratorRuntime.awrap(User.findOne({
            "subscription.stripeCustomerId": _invoice.customer
          }));

        case 59:
          _user3 = _context3.sent;

          if (_user3) {// Optionally handle grace periods, but for now we can mark as expired or past_due
            // handleSubscriptionStatusChange(user._id, user.subscription.tier, 'expired');
          }

        case 61:
          res.status(200).json({
            received: true
          });

        case 62:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 6]]);
};

exports.updateSubCheckout = function _callee4(req, res, next) {
  var _req$query, user, tier;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query = req.query, user = _req$query.user, tier = _req$query.tier;

          if (!(!user && !tier)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", next());

        case 3:
          handleSubscriptionStatusChange(user, tier, "active");
          res.redirect(req.originalUrl.split("?")[0]);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.downgradeToStarter = catchAsync(function _callee5(req, res, next) {
  var user, subscriptions, subscription, subId, itemId, keepFeaturedJobIds, featuredJobs, jobsToKeep, jobsToUnfeature, unfeatureIds;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context5.sent;

          if (user.subscription.stripeCustomerId) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("No subscription found", 404)));

        case 5:
          _context5.next = 7;
          return regeneratorRuntime.awrap(stripe.subscriptions.list({
            customer: user.subscription.stripeCustomerId,
            status: "active",
            limit: 1
          }));

        case 7:
          subscriptions = _context5.sent;

          if (!(subscriptions.data.length === 0)) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", next(new AppError("No active subscription found", 404)));

        case 10:
          subscription = subscriptions.data[0];
          subId = subscription.id;
          itemId = subscription.items.data[0].id; // Update subscription to Starter Price
          // Note: This assumes immediate update. Proration behavior depends on Stripe settings.

          _context5.next = 15;
          return regeneratorRuntime.awrap(stripe.subscriptions.update(subId, {
            items: [{
              id: itemId,
              price: process.env.BASIC_SUB_PRICE_ID // Starter Price ID

            }],
            metadata: {
              plan: "starter"
            }
          }));

        case 15:
          // Handle Featured Jobs Limit (Max 3)
          keepFeaturedJobIds = req.body.keepFeaturedJobIds; // 1. Update User Tier

          _context5.next = 18;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user._id, {
            "subscription.tier": "starter"
          }));

        case 18:
          if (!(keepFeaturedJobIds && keepFeaturedJobIds.length > 0)) {
            _context5.next = 23;
            break;
          }

          _context5.next = 21;
          return regeneratorRuntime.awrap(Job.updateMany({
            postedBy: user._id,
            featured: true,
            _id: {
              $nin: keepFeaturedJobIds
            }
          }, {
            featured: false
          }));

        case 21:
          _context5.next = 32;
          break;

        case 23:
          _context5.next = 25;
          return regeneratorRuntime.awrap(Job.find({
            postedBy: user._id,
            featured: true,
            status: "active"
          }).sort("-createdAt"));

        case 25:
          featuredJobs = _context5.sent;

          if (!(featuredJobs.length > 3)) {
            _context5.next = 32;
            break;
          }

          jobsToKeep = featuredJobs.slice(0, 3);
          jobsToUnfeature = featuredJobs.slice(3);
          unfeatureIds = jobsToUnfeature.map(function (j) {
            return j._id;
          });
          _context5.next = 32;
          return regeneratorRuntime.awrap(Job.updateMany({
            _id: {
              $in: unfeatureIds
            }
          }, {
            featured: false
          }));

        case 32:
          res.status(200).json({
            status: "success",
            message: "Downgraded to Starter successfully"
          });

        case 33:
        case "end":
          return _context5.stop();
      }
    }
  });
});