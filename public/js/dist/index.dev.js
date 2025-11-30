"use strict";

var searchBar = document.getElementById("search");
var btnSubStarter = document.getElementById("sub-starter");
var btnSubPro = document.getElementById("sub-pro");
var btnDowngradeStarter = document.getElementById("btn-downgrade-starter");
var btnBillingPortal = document.getElementById("btn-billing-portal");

var _require = require("./stripe"),
    subscribe = _require.subscribe,
    downgradeToStarter = _require.downgradeToStarter,
    manageBilling = _require.manageBilling;

var _require2 = require("./jobs"),
    searchJobs = _require2.searchJobs,
    loadJobData = _require2.loadJobData,
    searchSavedJobs = _require2.searchSavedJobs,
    initJobDetail = _require2.initJobDetail;

var _require3 = require("./auth"),
    signupEmployer = _require3.signupEmployer,
    logout = _require3.logout,
    login = _require3.login,
    signupCandidate = _require3.signupCandidate,
    updateSettings = _require3.updateSettings,
    deleteCv = _require3.deleteCv,
    deleteAccount = _require3.deleteAccount,
    forgotPassword = _require3.forgotPassword,
    resetPassword = _require3.resetPassword,
    claimAccount = _require3.claimAccount,
    resendVerification = _require3.resendVerification;

var _require4 = require("./dashboard"),
    initDashboard = _require4.initDashboard;

var _require5 = require("./admin"),
    initAdmin = _require5.initAdmin;

var _require6 = require("./bugReport"),
    initBugReport = _require6.initBugReport;

var _require7 = require("./cookieConsent"),
    initCookieConsent = _require7.initCookieConsent;

var _require8 = require("./blog"),
    initBlog = _require8.initBlog;

var logOutBtn = document.querySelector(".nav__el--logout");
if (logOutBtn) logOutBtn.addEventListener("click", logout); // Init Cookie Consent

initCookieConsent(); // Init Bug Report Modal

initBugReport(); // Init Job Detail (Standalone Page)

initJobDetail(); // Init Dashboard

initDashboard(); // Init Admin

initAdmin(); // Init Blog

initBlog(); // Profile Page Logic

var userDataForm = document.querySelector(".form-user-data");
var userPasswordForm = document.querySelector(".form-user-password");
var userCvForm = document.querySelector(".form-user-cv");
var deleteCvBtn = document.getElementById("deleteCvBtn");
var deleteAccountBtn = document.getElementById("deleteAccountBtn");
var forgotPasswordForm = document.querySelector(".form--forgot-password");
var resetPasswordForm = document.querySelector(".form--reset-password");
var claimAccountForm = document.querySelector(".form--claim-account");

if (userDataForm) {
  userDataForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value); // Check for company fields

    var companyName = document.getElementById("companyName");

    if (companyName) {
      var website = document.getElementById("website").value;
      var industry = document.getElementById("industry").value;
      var companySize = document.getElementById("companySize").value;
      var companyProfile = {
        companyName: companyName.value,
        website: website,
        industry: industry,
        companySize: companySize
      }; // Append as JSON string or handle in controller as nested object
      // Since we are using FormData for potential file uploads (though not here yet),
      // we need to be careful. But updateSettings uses axios with data object if not file.
      // Wait, updateSettings takes a FormData object OR a plain object.
      // Let's construct a plain object if no file, or append to FormData.
      // Actually, the current updateSettings implementation handles FormData or JSON.
      // But passing nested objects in FormData is tricky.
      // Let's stick to JSON for this form since there's no file upload here (CV is separate).

      var data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        companyProfile: companyProfile
      };
      updateSettings(data, "data");
      return;
    }

    updateSettings(form, "data");
  });
}

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var modal = document.getElementById("deleteAccountModal");
    var closeBtn = document.getElementById("closeDeleteAccountModal");
    var cancelBtn = document.getElementById("cancelDeleteAccountBtn");
    var confirmBtn = document.getElementById("confirmDeleteAccountBtn");
    var emailInput = document.getElementById("deleteEmailConfirm");
    var deleteForm = document.getElementById("deleteAccountForm"); // Get user email from the settings form

    var userEmail = document.getElementById("email").value;
    modal.classList.remove("hidden");
    emailInput.value = "";
    confirmBtn.disabled = true;
    emailInput.focus();

    var closeModal = function closeModal() {
      modal.classList.add("hidden");
    };

    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    emailInput.addEventListener("input", function (e) {
      if (e.target.value === userEmail) {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    });
    deleteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (emailInput.value === userEmail) {
        confirmBtn.textContent = "Deleting...";
        deleteAccount();
      }
    });
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", function _callee(e) {
    var passwordCurrent, password, passwordConfirm;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            document.querySelector(".btn--save-password").textContent = "Updating...";
            passwordCurrent = document.getElementById("password-current").value;
            password = document.getElementById("password").value;
            passwordConfirm = document.getElementById("password-confirm").value;
            _context.next = 7;
            return regeneratorRuntime.awrap(updateSettings({
              passwordCurrent: passwordCurrent,
              password: password,
              passwordConfirm: passwordConfirm
            }, "password"));

          case 7:
            document.querySelector(".btn--save-password").textContent = "Save password";
            document.getElementById("password-current").value = "";
            document.getElementById("password").value = "";
            document.getElementById("password-confirm").value = "";

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

var updateCvUI = function updateCvUI(cvFilename) {
  var container = document.getElementById("cv-status-container");
  if (!container) return;

  if (cvFilename) {
    container.innerHTML = "\n      <div class=\"cv-display\">\n        <a class=\"btn-text\" href=\"/cvs/".concat(cvFilename, "\" target=\"_blank\">View CV</a>\n        <button class=\"btn btn--small btn--standard\" id=\"deleteCvBtn\">Delete CV</button>\n      </div>\n    ");
  } else {
    container.innerHTML = "<p class=\"ma-bt-md\">No CV uploaded yet.</p>";
  }
};

if (userCvForm) {
  var cvInput = document.getElementById("cv-upload");
  var cvLabel = document.querySelector("label[for='cv-upload']");

  if (cvInput && cvLabel) {
    cvInput.addEventListener("change", function (e) {
      if (e.target.files && e.target.files.length > 0) {
        cvLabel.textContent = e.target.files[0].name;
      } else {
        cvLabel.textContent = "Choose new CV";
      }
    });
  }

  userCvForm.addEventListener("submit", function _callee2(e) {
    var form, cvFile, res;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            form = new FormData();
            cvFile = document.getElementById("cv-upload").files[0];

            if (!cvFile) {
              _context2.next = 9;
              break;
            }

            form.append("cv", cvFile);
            _context2.next = 7;
            return regeneratorRuntime.awrap(updateSettings(form, "data"));

          case 7:
            res = _context2.sent;

            if (res && res.updatedUser && res.updatedUser.cv) {
              updateCvUI(res.updatedUser.cv); // Reset file input

              cvInput.value = "";
              cvLabel.textContent = "Choose new CV";
            }

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
} // Event delegation for delete CV button since it can be dynamically added/removed


var cvSection = document.getElementById("cv");

if (cvSection) {
  cvSection.addEventListener("click", function _callee3(e) {
    var success;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(e.target && e.target.id === "deleteCvBtn")) {
              _context3.next = 7;
              break;
            }

            e.preventDefault();

            if (!confirm("Are you sure you want to delete your CV?")) {
              _context3.next = 7;
              break;
            }

            _context3.next = 5;
            return regeneratorRuntime.awrap(deleteCv());

          case 5:
            success = _context3.sent;

            if (success) {
              updateCvUI(null);
            }

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
} // Tab Logic


var tabsContainer = document.querySelector(".user-view__tabs");

if (tabsContainer) {
  tabsContainer.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    e.preventDefault(); // Remove active class from all tabs

    document.querySelectorAll(".tab-btn").forEach(function (el) {
      return el.classList.remove("tab-btn--active");
    });
    document.querySelectorAll(".tab-content").forEach(function (el) {
      return el.classList.remove("tab-content--active");
    }); // Add active class to clicked tab

    btn.classList.add("tab-btn--active");
    var tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.add("tab-content--active"); // Save active tab to localStorage

    localStorage.setItem("activeTab", tabId);
  }); // Restore active tab on page load

  var activeTab = localStorage.getItem("activeTab");

  if (activeTab) {
    var btn = document.querySelector(".tab-btn[data-tab='".concat(activeTab, "']"));

    if (btn) {
      // Simulate click to activate tab
      btn.click();
    }
  }
}

var loginForm = document.querySelector(".form--login");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    login(email, password);
  });
}

var signupForm = document.querySelector(".form--signup");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    signupCandidate(name, email, password, passwordConfirm);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Reset password form submitted");
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("password-confirm").value; // Get token from URL

    var token = window.location.pathname.split("/")[2];
    console.log("Token extracted:", token);
    console.log("Password:", password);
    console.log("Password Confirm:", passwordConfirm);
    resetPassword(token, password, passwordConfirm);
  });
}

if (claimAccountForm) {
  claimAccountForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    var btn = document.getElementById("claimAccountBtn");
    var token = btn.dataset.token;
    btn.textContent = "Activating...";
    claimAccount(token, password, passwordConfirm);
  });
} // Subscription Logic


if (btnSubStarter) {
  btnSubStarter.addEventListener("click", function (e) {
    e.target.textContent = "Processing...";
    subscribe({
      plan: "starter"
    });
  });
}

if (btnSubPro) {
  btnSubPro.addEventListener("click", function (e) {
    e.target.textContent = "Processing...";
    subscribe({
      plan: "professional"
    });
  });
}

if (btnDowngradeStarter) {
  btnDowngradeStarter.addEventListener("click", function _callee4(e) {
    var modal, closeBtn, keepProBtn, confirmBtn, featuredJobSelectionContainer, featuredJobSelectionList, featuredJobs, featuredJobCount, checkboxes, closeModal;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            e.preventDefault();
            modal = document.getElementById("downgradeStarterModal");
            closeBtn = document.getElementById("closeDowngradeStarterModal");
            keepProBtn = document.getElementById("keepProSubBtn");
            confirmBtn = document.getElementById("confirmDowngradeStarterBtn");
            featuredJobSelectionContainer = document.getElementById("featuredJobSelectionContainer");
            featuredJobSelectionList = document.getElementById("featuredJobSelectionList"); // Open Modal

            modal.classList.remove("hidden"); // Check featured jobs count

            featuredJobs = Array.from(document.querySelectorAll(".job-item--featured"));
            featuredJobCount = featuredJobs.length;

            if (featuredJobCount > 3) {
              featuredJobSelectionContainer.classList.remove("hidden");
              featuredJobSelectionList.innerHTML = "";
              featuredJobs.forEach(function (job, index) {
                var id = job.dataset.id;
                var title = job.querySelector(".job-item__title").textContent;
                var uniqueId = "keep-featured-".concat(id, "-").concat(index);
                var html = "\n          <div class=\"job-select-item\">\n            <input type=\"checkbox\" class=\"job-keep-checkbox\" value=\"".concat(id, "\" id=\"").concat(uniqueId, "\">\n            <label for=\"").concat(uniqueId, "\">").concat(title, "</label>\n          </div>\n        ");
                featuredJobSelectionList.insertAdjacentHTML("beforeend", html);
              }); // Limit selection to 3

              checkboxes = featuredJobSelectionList.querySelectorAll(".job-keep-checkbox");
              checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener("change", function () {
                  var checkedCount = featuredJobSelectionList.querySelectorAll(".job-keep-checkbox:checked").length;

                  if (checkedCount >= 3) {
                    checkboxes.forEach(function (cb) {
                      if (!cb.checked) cb.disabled = true;
                    });
                  } else {
                    checkboxes.forEach(function (cb) {
                      cb.disabled = false;
                    });
                  }
                });
              });
            } else {
              featuredJobSelectionContainer.classList.add("hidden");
            }

            closeModal = function closeModal() {
              modal.classList.add("hidden");
            };

            closeBtn.onclick = closeModal;
            keepProBtn.onclick = closeModal;

            confirmBtn.onclick = function () {
              var selectedJobIds = Array.from(featuredJobSelectionList.querySelectorAll(".job-keep-checkbox:checked")).map(function (cb) {
                return cb.value;
              });

              if (featuredJobCount > 3 && selectedJobIds.length === 0) {
                alert("Please select at least one job to keep featured (up to 3).");
                return;
              }

              confirmBtn.textContent = "Processing...";
              downgradeToStarter(selectedJobIds);
            };

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
}

if (btnBillingPortal) {
  btnBillingPortal.addEventListener("click", function (e) {
    e.target.textContent = "Loading...";
    manageBilling();
  });
}

var handleSearch = function handleSearch() {
  var search, location; // Check if we are on the saved jobs page

  if (window.location.pathname.startsWith("/saved")) {
    // On saved jobs page, location is in the sidebar filter
    var _locationInput = document.querySelector('input[name="location"]');

    if (_locationInput) {
      location = _locationInput.value;
    } // Search term might not exist or be different on saved page,
    // but currently saved-jobs.pug doesn't have a main search bar,
    // it relies on filters.

  } else if (searchBar) {
    // On main search page
    var inputs = searchBar.querySelectorAll(".search-bar__input");
    search = inputs[0].value;
    location = inputs[1].value;
  }

  var visaTypes = Array.from(document.querySelectorAll('input[name="visaTypes"]:checked')).map(function (el) {
    return el.value;
  }).join(",");
  var remoteWork = Array.from(document.querySelectorAll('input[name="remoteWork"]:checked')).map(function (el) {
    return el.value;
  }).join(",");
  var experienceLevel = Array.from(document.querySelectorAll('input[name="experienceLevel"]:checked')).map(function (el) {
    return el.value;
  }).join(",");
  var salaryMinInput = document.querySelector('input[name="salaryMin"]');
  var salaryMaxInput = document.querySelector('input[name="salaryMax"]');
  var distanceInput = document.querySelector('input[name="distance"]');
  var distanceToggle = document.getElementById("distanceToggle");
  var salaryMin = salaryMinInput && !salaryMinInput.disabled ? salaryMinInput.value : undefined;
  var salaryMax = salaryMaxInput && !salaryMaxInput.disabled ? salaryMaxInput.value : undefined;
  var distance = undefined;

  if (distanceInput) {
    // If toggle exists, rely on its checked state
    if (distanceToggle) {
      if (distanceToggle.checked) {
        distance = distanceInput.value;
      }
    } // Fallback to disabled attribute (e.g. saved jobs page)
    else if (!distanceInput.disabled) {
        distance = distanceInput.value;
      }
  }

  var params = {
    search: search,
    location: location || undefined,
    visaTypes: visaTypes || undefined,
    remoteWork: remoteWork || undefined,
    experienceLevel: experienceLevel || undefined,
    salaryMin: salaryMin || undefined,
    salaryMax: salaryMax || undefined,
    distance: distance || undefined
  };

  if (window.location.pathname.startsWith("/saved")) {
    searchSavedJobs(params);
  } else {
    searchJobs(params);
  }
};

if (searchBar) {
  searchBar.addEventListener("submit", function (e) {
    if (document.querySelector(".results")) {
      e.preventDefault();
      handleSearch();
    }
  });
}

var filterInputs = document.querySelectorAll(".filter-input");

if (filterInputs) {
  var updateSliderDisplay = function updateSliderDisplay(input) {
    if (input.name === "distance") {
      var distVal = document.getElementById("distanceValue");
      if (distVal) distVal.textContent = "".concat(input.value, " miles"); // Update single slider background

      var percent = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.background = "linear-gradient(to right, #2563eb 0%, #2563eb ".concat(percent, "%, #dadae5 ").concat(percent, "%, #dadae5 100%)");
    }

    if (input.name === "salaryMin" || input.name === "salaryMax") {
      var minInput = document.querySelector('input[name="salaryMin"]');
      var maxInput = document.querySelector('input[name="salaryMax"]');
      var minVal = parseInt(minInput.value);
      var maxVal = parseInt(maxInput.value);
      var minMaxGap = 1000;

      if (input.name === "salaryMin") {
        if (minVal > maxVal - minMaxGap) {
          minInput.value = maxVal - minMaxGap;
        }
      } else {
        if (maxVal < minVal + minMaxGap) {
          maxInput.value = minVal + minMaxGap;
        }
      }

      var minValDisplay = document.getElementById("salaryMinValue");
      var maxValDisplay = document.getElementById("salaryMaxValue");
      if (minValDisplay) minValDisplay.textContent = "\xA3".concat((minInput.value / 1000).toFixed(0), "k");
      if (maxValDisplay) maxValDisplay.textContent = "\xA3".concat((maxInput.value / 1000).toFixed(0), "k");
      fillSlider(minInput, maxInput);
    }
  };

  var fillSlider = function fillSlider(minInput, maxInput) {
    var range = parseInt(minInput.max) - parseInt(minInput.min);
    var percent1 = (parseInt(minInput.value) - parseInt(minInput.min)) / range * 100;
    var percent2 = (parseInt(maxInput.value) - parseInt(minInput.min)) / range * 100;
    var sliderTrack = document.querySelector(".slider-track");

    if (sliderTrack) {
      sliderTrack.style.background = "linear-gradient(to right, #dadae5 ".concat(percent1, "%, #2563eb ").concat(percent1, "%, #2563eb ").concat(percent2, "%, #dadae5 ").concat(percent2, "%)");
    }
  };

  filterInputs.forEach(function (input) {
    input.addEventListener("change", handleSearch);
    input.addEventListener("input", function (e) {
      return updateSliderDisplay(e.target);
    }); // Initialize slider display on load

    updateSliderDisplay(input);
  });
}

var distanceToggle = document.getElementById("distanceToggle");
var salaryToggle = document.getElementById("salaryToggle");

if (distanceToggle) {
  // Sync initial state
  var slider = document.getElementById("distanceSlider");
  var input = slider.querySelector(".range-input");

  if (!distanceToggle.checked) {
    slider.classList.add("disabled-filter");
    input.disabled = true;
  } else {
    slider.classList.remove("disabled-filter");
    input.disabled = false;
  }

  distanceToggle.addEventListener("change", function (e) {
    var slider = document.getElementById("distanceSlider");
    var input = slider.querySelector(".range-input");

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
  var _slider = document.getElementById("salarySlider");

  var inputs = _slider.querySelectorAll(".range-input");

  var values = document.getElementById("salaryValues");

  if (!salaryToggle.checked) {
    _slider.classList.add("disabled-filter");

    values.classList.add("disabled-text");
    inputs.forEach(function (input) {
      return input.disabled = true;
    });
  } else {
    _slider.classList.remove("disabled-filter");

    values.classList.remove("disabled-text");
    inputs.forEach(function (input) {
      return input.disabled = false;
    });
  }

  salaryToggle.addEventListener("change", function (e) {
    var slider = document.getElementById("salarySlider");
    var inputs = slider.querySelectorAll(".range-input");
    var values = document.getElementById("salaryValues");

    if (e.target.checked) {
      slider.classList.remove("disabled-filter");
      values.classList.remove("disabled-text");
      inputs.forEach(function (input) {
        return input.disabled = false;
      });
    } else {
      slider.classList.add("disabled-filter");
      values.classList.add("disabled-text");
      inputs.forEach(function (input) {
        return input.disabled = true;
      });
    }

    handleSearch();
  });
}

var locationSearchBtn = document.getElementById("locationSearchBtn");

if (locationSearchBtn) {
  locationSearchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    handleSearch();
  });
}

var locationInput = document.querySelector('input[name="location"]');

if (locationInput) {
  locationInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      // Only intercept if we are on a page with results (AJAX search)
      if (document.querySelector(".results")) {
        e.preventDefault();
        handleSearch();
      } // Otherwise, let the form submit naturally

    }
  });
} // Mobile Filters & Details Logic


var showFiltersBtn = document.getElementById("showFiltersBtn");
var closeFiltersBtn = document.getElementById("closeFiltersBtn");
var filtersModal = document.getElementById("filtersModal");
var clearFiltersBtn = document.getElementById("clearFiltersBtn");
var clearFiltersBtnMobile = document.getElementById("clearFiltersBtnMobile");
var detailsModal = document.getElementById("detailsModal");
var closeDetailsBtn = document.getElementById("closeDetailsBtn");
var resultsContainer = document.querySelector(".results");

if (showFiltersBtn && filtersModal) {
  showFiltersBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    filtersModal.classList.add("filters--open");
    document.body.classList.add("no-scroll");
  });
}

if (closeFiltersBtn && filtersModal) {
  closeFiltersBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    filtersModal.classList.remove("filters--open");
    document.body.classList.remove("no-scroll");
  });
}

var clearFiltersHandler = function clearFiltersHandler() {
  var inputs = document.querySelectorAll(".filter-input");
  inputs.forEach(function (input) {
    if (input.type === "checkbox") input.checked = false;

    if (input.type === "range") {
      if (input.name === "distance") input.value = 25;
      if (input.name === "salaryMin") input.value = 20000;
      if (input.name === "salaryMax") input.value = 150000;
      input.dispatchEvent(new Event("input"));
    }
  }); // Reset Toggles

  var distanceToggle = document.getElementById("distanceToggle");
  var salaryToggle = document.getElementById("salaryToggle");

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
  resultsContainer.addEventListener("click", function (e) {
    var card = e.target.closest(".job-card");

    if (card) {
      detailsModal.classList.add("details--open");
      document.body.classList.add("no-scroll");
      var jobId = card.dataset.id; // Update Status Text

      var index = card.dataset.index;
      var total = document.querySelectorAll(".job-card").length;
      var statusEl = document.querySelector(".results-status");

      if (statusEl && index) {
        statusEl.textContent = "Result ".concat(index, " of ").concat(total);
      }

      if (jobId) {
        loadJobData(jobId);
      }
    }
  });
}

if (closeDetailsBtn && detailsModal) {
  closeDetailsBtn.addEventListener("click", function () {
    detailsModal.classList.remove("details--open");
    document.body.classList.remove("no-scroll");
  });
} // Custom Select Logic


var customSelect = document.querySelector(".custom-select");

if (customSelect) {
  var trigger = customSelect.querySelector(".custom-select__trigger");
  var options = customSelect.querySelectorAll(".custom-option");
  var hiddenInput = document.getElementById("distanceInput");
  trigger.addEventListener("click", function () {
    customSelect.classList.toggle("open");
  });
  options.forEach(function (option) {
    option.addEventListener("click", function () {
      trigger.querySelector("span").textContent = option.textContent;
      if (hiddenInput) hiddenInput.value = option.dataset.value;
      options.forEach(function (opt) {
        return opt.classList.remove("selected");
      });
      option.classList.add("selected");
      customSelect.classList.remove("open");
    });
  }); // Close dropdown when clicking outside

  document.addEventListener("click", function (e) {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
}

var signupEmployerForm = document.querySelector(".form--signup-employer");

if (signupEmployerForm) {
  signupEmployerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var companyName = document.getElementById("companyName").value;
    var legalOrgName = document.getElementById("legalOrgName").value;
    var website = document.getElementById("website").value;
    var industry = document.getElementById("industry").value;
    var companySize = document.getElementById("companySize").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    signupEmployer({
      name: name,
      email: email,
      companyName: companyName,
      legalOrgName: legalOrgName,
      website: website,
      industry: industry,
      companySize: companySize,
      password: password,
      passwordConfirm: passwordConfirm
    });
  });
}

var resendVerificationForm = document.querySelector(".form--resend-verification");

if (resendVerificationForm) {
  resendVerificationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var btn = document.getElementById("resendBtn");
    btn.textContent = "Sending...";
    resendVerification(email);
  });
}