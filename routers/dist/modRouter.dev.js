"use strict";

var express = require("express");

var modController = require("../controllers/modController");

var authController = require("../controllers/authController");

var router = express.Router({
  mergeParams: true
});
router.use(authController.protect, authController.restrictTo("admin"));
router.route("/reported").get(modController.getReported);
router.route("/:id/disable").patch(modController.reActivateJob)["delete"](modController.disableJob);
module.exports = router;