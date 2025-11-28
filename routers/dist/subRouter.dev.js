"use strict";

var express = require("express");

var subController = require("./../controllers/subController");

var authController = require("./../controllers/authController");

var router = express.Router();
router.post("/checkout-session/", authController.protect, authController.checkAccountStatus, subController.getCheckoutSession);
router.post("/downgrade-starter", authController.protect, authController.checkAccountStatus, subController.downgradeToStarter);
router.post("/billing-portal", authController.protect, authController.checkAccountStatus, subController.createBillingPortalSession);
module.exports = router;