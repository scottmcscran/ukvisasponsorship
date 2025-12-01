"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCookieConsent = void 0;

var initCookieConsent = function initCookieConsent() {
  var cookieConsent = document.querySelector(".cookie-consent");
  var acceptBtn = document.querySelector(".cookie-consent__btn--accept");
  var rejectBtn = document.querySelector(".cookie-consent__btn--reject");
  if (!cookieConsent || !acceptBtn) return; // Check if user has already consented

  var hasConsented = localStorage.getItem("cookieConsent");

  if (!hasConsented) {
    // Show modal after a small delay
    setTimeout(function () {
      cookieConsent.classList.add("show");
    }, 1000);
  } else {
    // User has already responded
    if (hasConsented === "true") {
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted"
        });
      }
    } else {
      // Denied
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied"
        });
      }
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

  if (rejectBtn) {
    rejectBtn.addEventListener("click", function () {
      console.log("Reject All clicked");
      localStorage.setItem("cookieConsent", "false");
      cookieConsent.classList.remove("show"); // Update GTM consent

      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied"
        });
      }
    });
  }
};

exports.initCookieConsent = initCookieConsent;