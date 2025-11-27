const express = require(`express`);
const subController = require(`./../controllers/subController`);
const authController = require(`./../controllers/authController`);
const router = express.Router();

router.post(
  `/checkout-session/`,
  authController.protect,
  authController.checkAccountStatus,
  subController.getCheckoutSession
);

router.post(
  "/downgrade-starter",
  authController.protect,
  authController.checkAccountStatus,
  subController.downgradeToStarter
);

router.post(
  "/billing-portal",
  authController.protect,
  authController.checkAccountStatus,
  subController.createBillingPortalSession
);

module.exports = router;
