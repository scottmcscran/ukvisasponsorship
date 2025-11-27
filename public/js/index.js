const searchBar = document.getElementById(`search`);

const btnSubStarter = document.getElementById(`sub-starter`);
const btnSubPro = document.getElementById(`sub-pro`);
const btnDowngradeStarter = document.getElementById(`btn-downgrade-starter`);
const btnBillingPortal = document.getElementById("btn-billing-portal");

const { subscribe, downgradeToStarter, manageBilling } = require(`./stripe`);
const { searchJobs, loadJobData, searchSavedJobs, initJobDetail } = require(
  `./jobs`
);
const {
  signupEmployer,
  logout,
  login,
  signupCandidate,
  updateSettings,
  deleteCv,
  deleteAccount,
  forgotPassword,
  resetPassword,
  claimAccount,
} = require(`./auth`);
const { initDashboard } = require(`./dashboard`);
const { initAdmin } = require(`./admin`);
const { initBugReport } = require(`./bugReport`);
const { initCookieConsent } = require("./cookieConsent");

const logOutBtn = document.querySelector(".nav__el--logout");
if (logOutBtn) logOutBtn.addEventListener("click", logout);

// Init Cookie Consent
initCookieConsent();

// Init Bug Report Modal
initBugReport();

// Init Job Detail (Standalone Page)
initJobDetail();

// Init Dashboard
initDashboard();

// Init Admin
initAdmin();

// Profile Page Logic
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const userCvForm = document.querySelector(".form-user-cv");
const deleteCvBtn = document.getElementById("deleteCvBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const forgotPasswordForm = document.querySelector(".form--forgot-password");
const resetPasswordForm = document.querySelector(".form--reset-password");
const claimAccountForm = document.querySelector(".form--claim-account");

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);

    // Check for company fields
    const companyName = document.getElementById("companyName");
    if (companyName) {
      const website = document.getElementById("website").value;
      const industry = document.getElementById("industry").value;
      const companySize = document.getElementById("companySize").value;

      const companyProfile = {
        companyName: companyName.value,
        website,
        industry,
        companySize,
      };

      // Append as JSON string or handle in controller as nested object
      // Since we are using FormData for potential file uploads (though not here yet),
      // we need to be careful. But updateSettings uses axios with data object if not file.
      // Wait, updateSettings takes a FormData object OR a plain object.
      // Let's construct a plain object if no file, or append to FormData.

      // Actually, the current updateSettings implementation handles FormData or JSON.
      // But passing nested objects in FormData is tricky.
      // Let's stick to JSON for this form since there's no file upload here (CV is separate).

      const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        companyProfile,
      };

      updateSettings(data, "data");
      return;
    }

    updateSettings(form, "data");
  });
}

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const modal = document.getElementById("deleteAccountModal");
    const closeBtn = document.getElementById("closeDeleteAccountModal");
    const cancelBtn = document.getElementById("cancelDeleteAccountBtn");
    const confirmBtn = document.getElementById("confirmDeleteAccountBtn");
    const emailInput = document.getElementById("deleteEmailConfirm");
    const deleteForm = document.getElementById("deleteAccountForm");

    // Get user email from the settings form
    const userEmail = document.getElementById("email").value;

    modal.classList.remove("hidden");
    emailInput.value = "";
    confirmBtn.disabled = true;
    emailInput.focus();

    const closeModal = () => {
      modal.classList.add("hidden");
    };

    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;

    emailInput.addEventListener("input", (e) => {
      if (e.target.value === userEmail) {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    });

    deleteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (emailInput.value === userEmail) {
        confirmBtn.textContent = "Deleting...";
        deleteAccount();
      }
    });
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (userCvForm) {
  const cvInput = document.getElementById("cv-upload");
  const cvLabel = document.querySelector("label[for='cv-upload']");

  if (cvInput && cvLabel) {
    cvInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        cvLabel.textContent = e.target.files[0].name;
      } else {
        cvLabel.textContent = "Choose new CV";
      }
    });
  }

  userCvForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    const cvFile = document.getElementById("cv-upload").files[0];
    if (cvFile) {
      form.append("cv", cvFile);
      updateSettings(form, "data");
    }
  });
}

if (deleteCvBtn) {
  deleteCvBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete your CV?")) {
      deleteCv();
    }
  });
}

// Tab Logic
const tabsContainer = document.querySelector(".user-view__tabs");
if (tabsContainer) {
  tabsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;

    e.preventDefault();

    // Remove active class from all tabs
    document
      .querySelectorAll(".tab-btn")
      .forEach((el) => el.classList.remove("tab-btn--active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((el) => el.classList.remove("tab-content--active"));

    // Add active class to clicked tab
    btn.classList.add("tab-btn--active");
    const tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.add("tab-content--active");

    // Save active tab to localStorage
    localStorage.setItem("activeTab", tabId);
  });

  // Restore active tab on page load
  const activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    const btn = document.querySelector(`.tab-btn[data-tab='${activeTab}']`);
    if (btn) {
      // Simulate click to activate tab
      btn.click();
    }
  }
}

const loginForm = document.querySelector(".form--login");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

const signupForm = document.querySelector(".form--signup");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    signupCandidate(name, email, password, passwordConfirm);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    // Get token from URL
    const token = window.location.pathname.split("/")[3];
    resetPassword(token, password, passwordConfirm);
  });
}

if (claimAccountForm) {
  claimAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const btn = document.getElementById("claimAccountBtn");
    const token = btn.dataset.token;

    btn.textContent = "Activating...";
    claimAccount(token, password, passwordConfirm);
  });
}

// Subscription Logic
if (btnSubStarter) {
  btnSubStarter.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    subscribe({ plan: "starter" });
  });
}

if (btnSubPro) {
  btnSubPro.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    subscribe({ plan: "professional" });
  });
}

if (btnDowngradeStarter) {
  btnDowngradeStarter.addEventListener("click", async (e) => {
    e.preventDefault();
    const modal = document.getElementById("downgradeStarterModal");
    const closeBtn = document.getElementById("closeDowngradeStarterModal");
    const keepProBtn = document.getElementById("keepProSubBtn");
    const confirmBtn = document.getElementById("confirmDowngradeStarterBtn");
    const featuredJobSelectionContainer = document.getElementById(
      "featuredJobSelectionContainer"
    );
    const featuredJobSelectionList = document.getElementById(
      "featuredJobSelectionList"
    );

    // Open Modal
    modal.classList.remove("hidden");

    // Check featured jobs count
    const featuredJobs = Array.from(
      document.querySelectorAll(".job-item--featured")
    );
    const featuredJobCount = featuredJobs.length;

    if (featuredJobCount > 3) {
      featuredJobSelectionContainer.classList.remove("hidden");
      featuredJobSelectionList.innerHTML = "";

      featuredJobs.forEach((job, index) => {
        const id = job.dataset.id;
        const title = job.querySelector(".job-item__title").textContent;
        const uniqueId = `keep-featured-${id}-${index}`;
        const html = `
          <div class="job-select-item">
            <input type="checkbox" class="job-keep-checkbox" value="${id}" id="${uniqueId}">
            <label for="${uniqueId}">${title}</label>
          </div>
        `;
        featuredJobSelectionList.insertAdjacentHTML("beforeend", html);
      });

      // Limit selection to 3
      const checkboxes =
        featuredJobSelectionList.querySelectorAll(".job-keep-checkbox");
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const checkedCount = featuredJobSelectionList.querySelectorAll(
            ".job-keep-checkbox:checked"
          ).length;
          if (checkedCount >= 3) {
            checkboxes.forEach((cb) => {
              if (!cb.checked) cb.disabled = true;
            });
          } else {
            checkboxes.forEach((cb) => {
              cb.disabled = false;
            });
          }
        });
      });
    } else {
      featuredJobSelectionContainer.classList.add("hidden");
    }

    const closeModal = () => {
      modal.classList.add("hidden");
    };

    closeBtn.onclick = closeModal;
    keepProBtn.onclick = closeModal;

    confirmBtn.onclick = () => {
      const selectedJobIds = Array.from(
        featuredJobSelectionList.querySelectorAll(".job-keep-checkbox:checked")
      ).map((cb) => cb.value);

      if (featuredJobCount > 3 && selectedJobIds.length === 0) {
        alert("Please select at least one job to keep featured (up to 3).");
        return;
      }

      confirmBtn.textContent = "Processing...";
      downgradeToStarter(selectedJobIds);
    };
  });
}

if (btnBillingPortal) {
  btnBillingPortal.addEventListener("click", (e) => {
    e.target.textContent = "Loading...";
    manageBilling();
  });
}

const handleSearch = () => {
  let search, location;

  // Check if we are on the saved jobs page
  if (window.location.pathname.startsWith("/saved")) {
    // On saved jobs page, location is in the sidebar filter
    const locationInput = document.querySelector('input[name="location"]');
    if (locationInput) {
      location = locationInput.value;
    }
    // Search term might not exist or be different on saved page,
    // but currently saved-jobs.pug doesn't have a main search bar,
    // it relies on filters.
  } else if (searchBar) {
    // On main search page
    const inputs = searchBar.querySelectorAll(".search-bar__input");
    search = inputs[0].value;
    location = inputs[1].value;
  }

  const visaTypes = Array.from(
    document.querySelectorAll('input[name="visaTypes"]:checked')
  )
    .map((el) => el.value)
    .join(",");

  const remoteWork = Array.from(
    document.querySelectorAll('input[name="remoteWork"]:checked')
  )
    .map((el) => el.value)
    .join(",");

  const experienceLevel = Array.from(
    document.querySelectorAll('input[name="experienceLevel"]:checked')
  )
    .map((el) => el.value)
    .join(",");

  const salaryMinInput = document.querySelector('input[name="salaryMin"]');
  const salaryMaxInput = document.querySelector('input[name="salaryMax"]');
  const distanceInput = document.querySelector('input[name="distance"]');
  const distanceToggle = document.getElementById("distanceToggle");

  const salaryMin =
    salaryMinInput && !salaryMinInput.disabled
      ? salaryMinInput.value
      : undefined;
  const salaryMax =
    salaryMaxInput && !salaryMaxInput.disabled
      ? salaryMaxInput.value
      : undefined;

  let distance = undefined;
  if (distanceInput) {
    // If toggle exists, rely on its checked state
    if (distanceToggle) {
      if (distanceToggle.checked) {
        distance = distanceInput.value;
      }
    }
    // Fallback to disabled attribute (e.g. saved jobs page)
    else if (!distanceInput.disabled) {
      distance = distanceInput.value;
    }
  }

  const params = {
    search,
    location: location || undefined,
    visaTypes: visaTypes || undefined,
    remoteWork: remoteWork || undefined,
    experienceLevel: experienceLevel || undefined,
    salaryMin: salaryMin || undefined,
    salaryMax: salaryMax || undefined,
    distance: distance || undefined,
  };

  if (window.location.pathname.startsWith("/saved")) {
    searchSavedJobs(params);
  } else {
    searchJobs(params);
  }
};

if (searchBar) {
  searchBar.addEventListener(`submit`, (e) => {
    if (document.querySelector(".results")) {
      e.preventDefault();
      handleSearch();
    }
  });
}

const filterInputs = document.querySelectorAll(".filter-input");
if (filterInputs) {
  const updateSliderDisplay = (input) => {
    if (input.name === "distance") {
      const distVal = document.getElementById("distanceValue");
      if (distVal) distVal.textContent = `${input.value} miles`;

      // Update single slider background
      const percent =
        ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.background = `linear-gradient(to right, #2563eb 0%, #2563eb ${percent}%, #dadae5 ${percent}%, #dadae5 100%)`;
    }

    if (input.name === "salaryMin" || input.name === "salaryMax") {
      const minInput = document.querySelector('input[name="salaryMin"]');
      const maxInput = document.querySelector('input[name="salaryMax"]');
      const minVal = parseInt(minInput.value);
      const maxVal = parseInt(maxInput.value);
      const minMaxGap = 1000;

      if (input.name === "salaryMin") {
        if (minVal > maxVal - minMaxGap) {
          minInput.value = maxVal - minMaxGap;
        }
      } else {
        if (maxVal < minVal + minMaxGap) {
          maxInput.value = minVal + minMaxGap;
        }
      }

      const minValDisplay = document.getElementById("salaryMinValue");
      const maxValDisplay = document.getElementById("salaryMaxValue");
      if (minValDisplay)
        minValDisplay.textContent = `£${(minInput.value / 1000).toFixed(0)}k`;
      if (maxValDisplay)
        maxValDisplay.textContent = `£${(maxInput.value / 1000).toFixed(0)}k`;

      fillSlider(minInput, maxInput);
    }
  };

  const fillSlider = (minInput, maxInput) => {
    const range = parseInt(minInput.max) - parseInt(minInput.min);
    const percent1 =
      ((parseInt(minInput.value) - parseInt(minInput.min)) / range) * 100;
    const percent2 =
      ((parseInt(maxInput.value) - parseInt(minInput.min)) / range) * 100;

    const sliderTrack = document.querySelector(".slider-track");
    if (sliderTrack) {
      sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #2563eb ${percent1}%, #2563eb ${percent2}%, #dadae5 ${percent2}%)`;
    }
  };

  filterInputs.forEach((input) => {
    input.addEventListener("change", handleSearch);
    input.addEventListener("input", (e) => updateSliderDisplay(e.target));
    // Initialize slider display on load
    updateSliderDisplay(input);
  });
}

const distanceToggle = document.getElementById("distanceToggle");
const salaryToggle = document.getElementById("salaryToggle");

if (distanceToggle) {
  // Sync initial state
  const slider = document.getElementById("distanceSlider");
  const input = slider.querySelector(".range-input");
  if (!distanceToggle.checked) {
    slider.classList.add("disabled-filter");
    input.disabled = true;
  } else {
    slider.classList.remove("disabled-filter");
    input.disabled = false;
  }

  distanceToggle.addEventListener("change", (e) => {
    const slider = document.getElementById("distanceSlider");
    const input = slider.querySelector(".range-input");

    if (e.target.checked) {
      slider.classList.remove("disabled-filter");
      input.disabled = false;
    } else {
      slider.classList.add("disabled-filter");
      input.disabled = true;
    }
    handleSearch();
  });
}

if (salaryToggle) {
  // Sync initial state
  const slider = document.getElementById("salarySlider");
  const inputs = slider.querySelectorAll(".range-input");
  const values = document.getElementById("salaryValues");

  if (!salaryToggle.checked) {
    slider.classList.add("disabled-filter");
    values.classList.add("disabled-text");
    inputs.forEach((input) => (input.disabled = true));
  } else {
    slider.classList.remove("disabled-filter");
    values.classList.remove("disabled-text");
    inputs.forEach((input) => (input.disabled = false));
  }

  salaryToggle.addEventListener("change", (e) => {
    const slider = document.getElementById("salarySlider");
    const inputs = slider.querySelectorAll(".range-input");
    const values = document.getElementById("salaryValues");

    if (e.target.checked) {
      slider.classList.remove("disabled-filter");
      values.classList.remove("disabled-text");
      inputs.forEach((input) => (input.disabled = false));
    } else {
      slider.classList.add("disabled-filter");
      values.classList.add("disabled-text");
      inputs.forEach((input) => (input.disabled = true));
    }
    handleSearch();
  });
}

const locationSearchBtn = document.getElementById("locationSearchBtn");
if (locationSearchBtn) {
  locationSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch();
  });
}

const locationInput = document.querySelector('input[name="location"]');
if (locationInput) {
  locationInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      // Only intercept if we are on a page with results (AJAX search)
      if (document.querySelector(".results")) {
        e.preventDefault();
        handleSearch();
      }
      // Otherwise, let the form submit naturally
    }
  });
}

// Mobile Filters & Details Logic
const showFiltersBtn = document.getElementById("showFiltersBtn");
const closeFiltersBtn = document.getElementById("closeFiltersBtn");
const filtersModal = document.getElementById("filtersModal");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const clearFiltersBtnMobile = document.getElementById("clearFiltersBtnMobile");

const detailsModal = document.getElementById("detailsModal");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");
const resultsContainer = document.querySelector(".results");

if (showFiltersBtn && filtersModal) {
  showFiltersBtn.addEventListener("click", () => {
    filtersModal.classList.add("filters--open");
  });
}

if (closeFiltersBtn && filtersModal) {
  closeFiltersBtn.addEventListener("click", () => {
    filtersModal.classList.remove("filters--open");
  });
}

const clearFiltersHandler = () => {
  const inputs = document.querySelectorAll(".filter-input");
  inputs.forEach((input) => {
    if (input.type === "checkbox") input.checked = false;
    if (input.type === "range") {
      if (input.name === "distance") input.value = 25;
      if (input.name === "salaryMin") input.value = 20000;
      if (input.name === "salaryMax") input.value = 150000;
      input.dispatchEvent(new Event("input"));
    }
  });

  // Reset Toggles
  const distanceToggle = document.getElementById("distanceToggle");
  const salaryToggle = document.getElementById("salaryToggle");

  if (distanceToggle) {
    distanceToggle.checked = false;
    distanceToggle.dispatchEvent(new Event("change"));
  }

  if (salaryToggle) {
    salaryToggle.checked = false;
    salaryToggle.dispatchEvent(new Event("change"));
  }

  handleSearch();
  if (filtersModal) filtersModal.classList.remove("filters--open");
};

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearFiltersHandler);
}

if (clearFiltersBtnMobile) {
  clearFiltersBtnMobile.addEventListener("click", clearFiltersHandler);
}

if (resultsContainer && detailsModal) {
  resultsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".job-card");
    if (card) {
      detailsModal.classList.add("details--open");
      document.body.classList.add("no-scroll");
      const jobId = card.dataset.id;

      // Update Status Text
      const index = card.dataset.index;
      const total = document.querySelectorAll(".job-card").length;
      const statusEl = document.querySelector(".results-status");
      if (statusEl && index) {
        statusEl.textContent = `Result ${index} of ${total}`;
      }

      if (jobId) {
        loadJobData(jobId);
      }
    }
  });
}

if (closeDetailsBtn && detailsModal) {
  closeDetailsBtn.addEventListener("click", () => {
    detailsModal.classList.remove("details--open");
    document.body.classList.remove("no-scroll");
  });
}

// Custom Select Logic
const customSelect = document.querySelector(".custom-select");
if (customSelect) {
  const trigger = customSelect.querySelector(".custom-select__trigger");
  const options = customSelect.querySelectorAll(".custom-option");
  const hiddenInput = document.getElementById("distanceInput");

  trigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      trigger.querySelector("span").textContent = option.textContent;
      if (hiddenInput) hiddenInput.value = option.dataset.value;

      options.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");

      customSelect.classList.remove("open");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
}

const signupEmployerForm = document.querySelector(".form--signup-employer");

if (signupEmployerForm) {
  signupEmployerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const companyName = document.getElementById("companyName").value;
    const legalOrgName = document.getElementById("legalOrgName").value;
    const website = document.getElementById("website").value;
    const industry = document.getElementById("industry").value;
    const companySize = document.getElementById("companySize").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    signupEmployer({
      name,
      email,
      companyName,
      legalOrgName,
      website,
      industry,
      companySize,
      password,
      passwordConfirm,
    });
  });
}
