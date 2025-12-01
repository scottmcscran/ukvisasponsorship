export const initCookieConsent = () => {
  const cookieConsent = document.querySelector(".cookie-consent");
  const acceptBtn = document.querySelector(".cookie-consent__btn--accept");
  const rejectBtn = document.querySelector(".cookie-consent__btn--reject");

  if (!cookieConsent || !acceptBtn) return;

  // Check if user has already consented
  const hasConsented = localStorage.getItem("cookieConsent");

  if (!hasConsented) {
    // Show modal after a small delay
    setTimeout(() => {
      cookieConsent.classList.add("show");
    }, 1000);
  } else {
    // User has already responded
    if (hasConsented === "true") {
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted",
        });
      }
    } else {
      // Denied
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
        });
      }
    }
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "true");
    cookieConsent.classList.remove("show");

    // Update GTM consent
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    }
  });

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      console.log("Reject All clicked");
      localStorage.setItem("cookieConsent", "false");
      cookieConsent.classList.remove("show");

      // Update GTM consent
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
        });
      }
    });
  }
};
