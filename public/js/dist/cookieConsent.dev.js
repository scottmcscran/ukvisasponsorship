"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCookieConsent = void 0;

var initCookieConsent = function initCookieConsent() {
  var cookieConsent = document.querySelector(".cookie-consent");
  var acceptBtn = document.querySelector(".cookie-consent__btn--accept");
  if (!cookieConsent || !acceptBtn) return; // Check if user has already consented

  var hasConsented = localStorage.getItem("cookieConsent");

  if (!hasConsented) {
    // Show modal after a small delay
    setTimeout(function () {
      cookieConsent.classList.add("show");
    }, 1000);
  } else {
    // User has already consented, update GTM
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });
    }
  }

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "true");
    cookieConsent.classList.remove("show"); // Update GTM consent

    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });
    }
  });
};

exports.initCookieConsent = initCookieConsent;