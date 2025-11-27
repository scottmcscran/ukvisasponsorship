"use strict";

var express = require("express");

var bugReportController = require("../controllers/bugReportController");

var authController = require("../controllers/authController");

var router = express.Router();
router.use(authController.protect);
router.route("/").post(bugReportController.createBugReport).get(authController.restrictTo("admin"), bugReportController.getAllBugReports);
router.route("/:id")["delete"](authController.restrictTo("admin"), bugReportController.deleteBugReport);
module.exports = router;