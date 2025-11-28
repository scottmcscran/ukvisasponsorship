const Article = require("../models/articleModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ published: true }).sort("-createdAt");

  res.status(200).render("blog", {
    title: "Blog | UK Visa Sponsorship Advice",
    articles,
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug }).populate(
    "author"
  );

  if (!article) {
    return next(new AppError("No article found with that name", 404));
  }

  res.status(200).render("article", {
    title: `${article.title} | UK Visa Sponsorship`,
    article,
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;

  const newArticle = await Article.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      article: newArticle,
    },
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id);

  if (!article) {
    return next(new AppError("No article found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
