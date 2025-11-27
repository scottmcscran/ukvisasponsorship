"use strict";

var _this = void 0;

/* eslint-disable */
module.exports.hideAlert = function () {
  var el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

module.exports.showAlert = function (type, msg) {
  _this.hideAlert();

  var markup = "<div class=\"alert alert--".concat(type, "\">").concat(msg, "</div>");
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(_this.hideAlert, 5000);
};