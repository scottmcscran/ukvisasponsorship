const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .post(bugReportController.createBugReport)
  .get(
    authController.restrictTo("admin"),
    bugReportController.getAllBugReports
  );

router
  .route("/:id")
  .delete(
    authController.restrictTo("admin"),
    bugReportController.deleteBugReport
  );

module.exports = router;
