"use strict";

var express = require("express");

var viewController = require("../controllers/viewController");

var authController = require("../controllers/authController");

var subController = require("../controllers/subController");

var router = express.Router();
router.use(authController.isLoggedIn);
router.get("/", viewController.getJobSearch);
router.get("/search", viewController.getJobResults);
router.get("/employer-signup", viewController.getEmployerSignup);
router.get("/login", viewController.getLogin);
router.get("/signup", viewController.getSignup);
router.get("/forgot-password", viewController.getForgotPassword);
router.get("/reset-password/:token", viewController.getResetPassword);
router.get("/claim-account/:token", viewController.getClaimAccount);
router.get("/sitemap.xml", viewController.getSitemap);
router.get("/job/:slug/:id", viewController.getJob); // router.use();

router.get("/employer-dashboard", subController.updateSubCheckout, authController.protect, authController.restrictTo("employer"), viewController.getEmployerDashboard);
router.get("/admin-dashboard", authController.protect, authController.restrictTo("admin"), viewController.getAdminDashboard);
router.get("/saved", authController.protect, viewController.getSavedJobs);
router.get("/profile", authController.protect, viewController.getProfile);
router.get("/cvs/:filename", authController.protect, viewController.getCv);
router.get("/privacy", viewController.getPrivacy);
router.get("/terms", viewController.getTerms);
module.exports = router;