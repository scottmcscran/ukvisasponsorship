"use strict";

var Article = require("../models/articleModel");

var _require = require("../utils/catchAsync"),
    catchAsync = _require.catchAsync;

var AppError = require("../utils/appError");

exports.getAllArticles = catchAsync(function _callee(req, res, next) {
  var articles;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Article.find({
            published: true
          }).sort("-createdAt"));

        case 2:
          articles = _context.sent;
          res.status(200).render("blog", {
            title: "Blog | UK Visa Sponsorship Advice",
            articles: articles
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getArticle = catchAsync(function _callee2(req, res, next) {
  var article;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Article.findOne({
            slug: req.params.slug
          }).populate("author"));

        case 2:
          article = _context2.sent;

          if (article) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError("No article found with that name", 404)));

        case 5:
          res.status(200).render("article", {
            title: "".concat(article.title, " | UK Visa Sponsorship"),
            article: article
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.createArticle = catchAsync(function _callee3(req, res, next) {
  var newArticle;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!req.body.author) req.body.author = req.user.id;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Article.create(req.body));

        case 3:
          newArticle = _context3.sent;
          res.status(201).json({
            status: "success",
            data: {
              article: newArticle
            }
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.deleteArticle = catchAsync(function _callee4(req, res, next) {
  var article;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Article.findByIdAndDelete(req.params.id));

        case 2:
          article = _context4.sent;

          if (article) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("No article found with that ID", 404)));

        case 5:
          res.status(204).json({
            status: "success",
            data: null
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
});