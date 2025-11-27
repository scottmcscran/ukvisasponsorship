const express = require(`express`);
const modController = require(`../controllers/modController`);
const authController = require(`../controllers/authController`);

const router = express.Router({ mergeParams: true });

router.use(authController.protect, authController.restrictTo(`admin`));

router.route(`/reported`).get(modController.getReported);

router
  .route(`/:id/disable`)
  .patch(modController.reActivateJob)
  .delete(modController.disableJob);

module.exports = router;
