export const initCookieConsent = () => {
  const cookieConsent = document.querySelector(".cookie-consent");
  const acceptBtn = document.querySelector(".cookie-consent__btn--accept");

  if (!cookieConsent || !acceptBtn) return;

  // Check if user has already consented
  const hasConsented = localStorage.getItem("cookieConsent");

  if (!hasConsented) {
    // Show modal after a small delay
    setTimeout(() => {
      cookieConsent.classList.add("show");
    }, 1000);
  } else {
    // User has already consented, update GTM
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
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
};
