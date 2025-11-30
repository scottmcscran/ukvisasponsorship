const express = require(`express`);
const jobController = require(`../controllers/jobController`);
const userController = require(`../controllers/userController`);
const authController = require(`../controllers/authController`);
const adminController = require("../controllers/adminController");
const router = express.Router();

router.use(authController.protect, authController.restrictTo(`admin`));

router.route(`/stats`).get(adminController.getAdminStats);

router.route("/jobs/:id").delete(adminController.deleteJob);

router.route("/jobs/:id/dismiss").patch(adminController.dismissReport);

router
  .route(`/:id/employer-verification`)
  .post(adminController.approveEmployer)
  .delete(adminController.rejectEmployer);

router
  .route("/discounts")
  .get(adminController.getAllDiscounts)
  .post(adminController.createDiscount);

router
  .route("/discounts/:id")
  .delete(adminController.deleteDiscount)
  .patch(adminController.toggleDiscountStatus);

router.route(`/get-users`).get(userController.getAllUsers);
// .post(userController.createUser);

router
  .route(`/user-control/:id`)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.post("/export-user-data", adminController.exportUserData);

router.get("/shadow-email-queue", adminController.getShadowEmailQueue);
router.post("/shadow-employer", adminController.createShadowEmployer);
router.post("/users/:id/send-claim-email", adminController.sendClaimEmail);

module.exports = router;
