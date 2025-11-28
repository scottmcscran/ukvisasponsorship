const express = require("express");
const articleController = require("../controllers/articleController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", articleController.getAllArticles);
router.get("/:slug", articleController.getArticle);

// Admin only routes for creating (can be expanded later)
router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  articleController.createArticle
);

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  articleController.deleteArticle
);

module.exports = router;
