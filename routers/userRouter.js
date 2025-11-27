const express = require(`express`);
const userController = require(`../controllers/userController`);
const authController = require(`../controllers/authController`);
const adminRouter = require(`../routers/adminRouter`);
const router = express.Router();

router.post(`/signup/`, authController.signupCandidate);
router.post(`/employersignup/`, authController.signUpEmployer);
router.post(`/login`, authController.logIn);
router.get(`/logout`, authController.logOut);

router.post(`/forgotPassword`, authController.forgotPassword);
router.patch(`/resetPassword/:token`, authController.resetPassword);

router.patch("/claimAccount/:token", authController.claimAccount);

router.use(authController.protect);

router.patch(`/updatePassword`, authController.updatePassword);

router.get(`/me`, userController.getMe, userController.getUser);

router.patch(
  `/updateMe`,
  authController.checkAccountStatus,
  userController.uploadCv,
  // userController.resizeUserPhoto,
  userController.updateMe
);
router.delete(`/deleteCv`, userController.deleteCv);
router.delete(`/deleteMe`, userController.deleteMe);

router.use(`/admin`, adminRouter);

module.exports = router;
