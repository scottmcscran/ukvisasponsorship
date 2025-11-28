"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBlog = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var initBlog = function initBlog() {
  var blogGrid = document.querySelector(".blog-grid");

  if (blogGrid) {
    blogGrid.addEventListener("click", function _callee(e) {
      var deleteBtn, articleId, res, card;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              deleteBtn = e.target.closest(".btn--delete-article");

              if (!deleteBtn) {
                _context.next = 17;
                break;
              }

              e.preventDefault();
              articleId = deleteBtn.dataset.articleId;

              if (!confirm("Are you sure you want to delete this article?")) {
                _context.next = 17;
                break;
              }

              deleteBtn.textContent = "Deleting...";
              _context.prev = 6;
              _context.next = 9;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]("/api/v1/articles/".concat(articleId)));

            case 9:
              res = _context.sent;

              if (res.status === 204) {
                (0, _alerts.showAlert)("success", "Article deleted successfully"); // Remove card from DOM

                card = deleteBtn.closest(".blog-card");
                if (card) card.remove();
              }

              _context.next = 17;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](6);
              (0, _alerts.showAlert)("error", "Error deleting article");
              deleteBtn.textContent = "Delete";

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[6, 13]]);
    });
  }
};

exports.initBlog = initBlog;