"use strict";

var express = require("express");

var jobController = require("../controllers/jobController");

var authController = require("../controllers/authController");

var modRouter = require("../routers/modRouter");

var adminRouter = require("../routers/adminRouter");

var router = express.Router(); // Ensure this route exists and points to the controller method

router.route("/:id/report").patch(jobController.reportJob);
router.route("/:id/unfeature").patch(authController.protect, authController.restrictTo("employer"), authController.checkAccountStatus, authController.checkJobPostLimits, jobController.unfeatureJob);
router.route("/").post(authController.protect, authController.restrictTo("employer", "admin"), authController.checkAccountStatus, authController.checkJobPostLimits, jobController.createJob);
router.route("/search").get(jobController.getAllJobs);
router.route("/saved").get(authController.protect, jobController.getAllSavedJobs);
router.route("/:id").get(jobController.getJob).post(authController.protect, jobController.trackRedirect).patch(authController.protect, authController.restrictTo("employer"), authController.checkAccountStatus, jobController.updateJob)["delete"](authController.protect, authController.restrictTo("employer"), authController.checkAccountStatus, jobController.deleteJob);
router.route("/:id/save").post(authController.protect, jobController.trackSave, jobController.saveJob)["delete"](authController.protect, jobController.trackUnSave, jobController.unSaveJob);
router.post("/:id/apply", authController.protect, jobController.uploadCv, jobController.applyJob);
router.use("/admin", adminRouter);
router.use("/mod", modRouter);
module.exports = router;