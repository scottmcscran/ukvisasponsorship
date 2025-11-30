"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _marked = require("marked");

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var resultsContainer = document.querySelector(".results"); // Report Job Modal Logic

var reportJobModal = document.getElementById("reportJobModal");
var closeReportJobModal = document.getElementById("closeReportJobModal");
var cancelReportJobBtn = document.getElementById("cancelReportJobBtn");
var confirmReportJobBtn = document.getElementById("confirmReportJobBtn");
var jobToReportId = null;
var reportBtnToHide = null;

var closeReportModal = function closeReportModal() {
  if (reportJobModal) {
    reportJobModal.classList.add("hidden");
    jobToReportId = null;
    reportBtnToHide = null;
  }
};

var openReportModal = function openReportModal(jobId, btnElement) {
  if (reportJobModal) {
    jobToReportId = jobId;
    reportBtnToHide = btnElement;
    reportJobModal.classList.remove("hidden");
  }
};

if (reportJobModal) {
  closeReportJobModal.addEventListener("click", closeReportModal);
  cancelReportJobBtn.addEventListener("click", closeReportModal);
  reportJobModal.addEventListener("click", function (e) {
    if (e.target === reportJobModal) closeReportModal();
  });
  confirmReportJobBtn.addEventListener("click", function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (jobToReportId) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            confirmReportJobBtn.textContent = "Reporting...";
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(_axios["default"].patch("/api/v1/jobs/".concat(jobToReportId, "/report")));

          case 6:
            (0, _alerts.showAlert)("success", "Job reported. Thank you.");
            if (reportBtnToHide) reportBtnToHide.style.display = "none";
            closeReportModal();
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](3);
            (0, _alerts.showAlert)("error", "Error reporting job.");

          case 14:
            _context.prev = 14;
            confirmReportJobBtn.textContent = "Report Job";
            return _context.finish(14);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 11, 14, 17]]);
  });
}

exports.loadJobData = function _callee5(id) {
  var detailsContainer, res, isSaved, userCv, isApplied, userRole, savedRes, savedJobs, meRes, appliedJobs, job, saveBtnText, saveBtnClass, applyHtml, isRestrictedUser, html, reportJobBtn, applyProfileCvBtn, applyUploadCvBtn, cvUpload, saveCvCheck, closeBtn, saveBtn;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          detailsContainer = document.querySelector(".details"); // Show loading state

          detailsContainer.innerHTML = '<div class="spinner">Loading...</div>';
          _context5.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get("/api/v1/jobs/".concat(id)));

        case 5:
          res = _context5.sent;
          // Check if saved and get user info
          isSaved = false;
          userCv = null;
          isApplied = false;
          userRole = "candidate";
          _context5.prev = 10;
          _context5.next = 13;
          return regeneratorRuntime.awrap(_axios["default"].get("/api/v1/jobs/saved"));

        case 13:
          savedRes = _context5.sent;

          if (savedRes.data.status === "success") {
            savedJobs = savedRes.data.data.jobs;

            if (savedJobs && Array.isArray(savedJobs)) {
              isSaved = savedJobs.some(function (j) {
                return j._id === id;
              });
            }
          } // Try to get user info to check for CV


          _context5.prev = 15;
          _context5.next = 18;
          return regeneratorRuntime.awrap(_axios["default"].get("/api/v1/users/me"));

        case 18:
          meRes = _context5.sent;

          if (meRes.data.status === "success") {
            userCv = meRes.data.data.cv;
            userRole = meRes.data.data.role;
            appliedJobs = meRes.data.data.appliedJobs;

            if (appliedJobs && Array.isArray(appliedJobs)) {
              isApplied = appliedJobs.includes(id);
            }
          }

          _context5.next = 24;
          break;

        case 22:
          _context5.prev = 22;
          _context5.t0 = _context5["catch"](15);

        case 24:
          _context5.next = 28;
          break;

        case 26:
          _context5.prev = 26;
          _context5.t1 = _context5["catch"](10);

        case 28:
          if (res.data.status === "success") {
            job = res.data.data.job;
            saveBtnText = isSaved ? "Saved" : "Save Job";
            saveBtnClass = isSaved ? "btn--save btn--saved" : "btn--save";

            if (isApplied) {
              applyHtml = "<button class=\"btn--standard btn--apply\" disabled style=\"background-color: #1a73c2; cursor: default;\">Applied</button>";
            } else if (job.applicationLink) {
              applyHtml = "<a href=\"".concat(job.applicationLink, "\" class=\"btn--standard btn--apply\" target=\"_blank\">Apply Now</a>");
            } else {
              if (userCv) {
                applyHtml = "\n              <div class=\"apply-actions\">\n                  <button class=\"btn--standard btn--apply\" id=\"applyProfileCvBtn\">Apply with Profile CV</button>\n                  <button class=\"btn--text\" id=\"applyUploadCvBtn\" style=\"margin-top: 10px; display: block; font-size: 0.9em; background: none; border: none; color: var(--brand-primary); cursor: pointer; text-decoration: underline;\">Upload different CV</button>\n                  <input type=\"file\" id=\"cvUpload\" style=\"display: none;\" accept=\".pdf,.doc,.docx\" />\n              </div>\n            ";
              } else {
                applyHtml = "\n              <div class=\"apply-actions\">\n                  <button class=\"btn--standard btn--apply\" id=\"applyUploadCvBtn\">Apply Now</button>\n                  <input type=\"file\" id=\"cvUpload\" style=\"display: none;\" accept=\".pdf,.doc,.docx\" />\n                  <div class=\"save-cv-option\" style=\"margin-top: 10px;\">\n                      <input type=\"checkbox\" id=\"saveCvCheck\">\n                      <label for=\"saveCvCheck\" style=\"font-size: 1.2rem;\">Save CV to profile</label>\n                  </div>\n              </div>\n            ";
              }
            }

            isRestrictedUser = ["admin", "employer"].includes(userRole);
            html = "\n        <button class=\"btn-close btn-close-details\" id=\"closeDetailsBtn\">&times;</button>\n        <div class=\"job-details-content\">\n          <div class=\"job-header\">\n            <h2>".concat(job.title, "</h2>\n            <p class=\"company-name\">").concat(job.postedBy ? job.postedBy.name : "Company", "</p>\n            <div class=\"job-meta\">\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Location:</span>\n                 <span class=\"meta-value\">").concat(job.location.city, ", ").concat(job.location.postcode, "</span>\n               </div>\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Salary:</span>\n                 <span class=\"meta-value\">").concat(job.salaryRange ? (job.salaryRange.min === job.salaryRange.max ? "\xA3".concat(job.salaryRange.min.toLocaleString()) : "\xA3".concat(job.salaryRange.min.toLocaleString()).concat(job.salaryRange.max ? " - \xA3".concat(job.salaryRange.max.toLocaleString()) : "+")) + " per ".concat(job.salaryRange.period || "year") : "Negotiable", "</span>\n               </div>\n               <div class=\"meta-divider\"></div>\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Type:</span>\n                 <span class=\"meta-value\">").concat(job.jobType || "Full-time", "</span>\n               </div>\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Remote:</span>\n                 <span class=\"meta-value\">").concat(job.location.remote ? job.location.remote.charAt(0).toUpperCase() + job.location.remote.slice(1) : "No", "</span>\n               </div>\n            </div>\n          </div>\n          \n          <div class=\"job-body\">\n            <div class=\"job-actions\" style=\"margin-bottom: 2rem; align-items: flex-start;\">\n              ").concat(!isRestrictedUser ? applyHtml : "", "\n              ").concat(!isRestrictedUser ? "<button class=\"".concat(saveBtnClass, "\" id=\"saveJobBtn\" data-id=\"").concat(job._id, "\">").concat(saveBtnText, "</button>") : "", "\n              <button class=\"btn--text btn--report\" id=\"reportJobBtn\" data-id=\"").concat(job._id, "\" style=\"font-size: 1.2rem; color: #999; text-decoration: underline; margin-top: 1rem; background: none; border: none; cursor: pointer;\">Report Job</button>\n            </div>\n\n            ").concat(job.visaTypes && job.visaTypes.length > 0 ? "<h3>Visa Types</h3>" : "", "\n            <div class=\"job-tags\" style=\"margin-bottom: 2rem;\">\n               ").concat(job.visaTypes ? job.visaTypes.map(function (type) {
              return "<span class=\"tag\">".concat(type, "</span>");
            }).join("") : "", "\n            </div>\n\n            <h3>Description</h3>\n            <div class=\"job-description-content\">").concat(_marked.marked.parse(job.description), "</div>\n            \n            ").concat(job.requirements && job.requirements.length > 0 ? "<h3>Requirements</h3>\n                 <div class=\"job-requirements-content\">\n                    ".concat(Array.isArray(job.requirements) ? _marked.marked.parse(job.requirements.map(function (r) {
              return "- ".concat(r);
            }).join("\n")) : _marked.marked.parse(job.requirements), "\n                 </div>") : "", "\n\n            ").concat(job.benefits && job.benefits.length > 0 ? "<h3>Benefits</h3>\n                 <div class=\"job-benefits-content\">\n                    ".concat(Array.isArray(job.benefits) ? _marked.marked.parse(job.benefits.map(function (b) {
              return "- ".concat(b);
            }).join("\n")) : _marked.marked.parse(job.benefits), "\n                 </div>") : "", "\n          </div>\n        </div>\n      ");
            detailsContainer.innerHTML = html; // Attach Report Listener

            reportJobBtn = document.getElementById("reportJobBtn");

            if (reportJobBtn) {
              reportJobBtn.addEventListener("click", function () {
                openReportModal(job._id, reportJobBtn);
              });
            } // Attach Apply Listeners


            applyProfileCvBtn = document.getElementById("applyProfileCvBtn");
            applyUploadCvBtn = document.getElementById("applyUploadCvBtn");
            cvUpload = document.getElementById("cvUpload");
            saveCvCheck = document.getElementById("saveCvCheck");

            if (applyProfileCvBtn) {
              applyProfileCvBtn.addEventListener("click", function _callee2() {
                return regeneratorRuntime.async(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        applyProfileCvBtn.textContent = "Applying...";
                        applyProfileCvBtn.disabled = true;
                        _context2.next = 5;
                        return regeneratorRuntime.awrap(_axios["default"].post("/api/v1/jobs/".concat(job._id, "/apply"), {
                          useProfileCv: "true"
                        }));

                      case 5:
                        (0, _alerts.showAlert)("success", "Application sent successfully!");
                        applyProfileCvBtn.textContent = "Applied";
                        if (applyUploadCvBtn) applyUploadCvBtn.style.display = "none";
                        _context2.next = 15;
                        break;

                      case 10:
                        _context2.prev = 10;
                        _context2.t0 = _context2["catch"](0);
                        applyProfileCvBtn.disabled = false;
                        applyProfileCvBtn.textContent = "Apply with Profile CV";
                        (0, _alerts.showAlert)("error", _context2.t0.response && _context2.t0.response.data.message ? _context2.t0.response.data.message : "Error applying");

                      case 15:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, null, null, [[0, 10]]);
              });
            }

            if (applyUploadCvBtn && cvUpload) {
              applyUploadCvBtn.addEventListener("click", function () {
                cvUpload.click();
              });
              cvUpload.addEventListener("change", function _callee3(e) {
                var file, formData;
                return regeneratorRuntime.async(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        file = e.target.files[0];

                        if (file) {
                          _context3.next = 3;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 3:
                        formData = new FormData();
                        formData.append("cv", file);

                        if (saveCvCheck && saveCvCheck.checked) {
                          formData.append("saveCvToProfile", "true");
                        }

                        _context3.prev = 6;
                        applyUploadCvBtn.textContent = "Applying...";
                        applyUploadCvBtn.disabled = true;
                        _context3.next = 11;
                        return regeneratorRuntime.awrap(_axios["default"].post("/api/v1/jobs/".concat(job._id, "/apply"), formData, {
                          headers: {
                            "Content-Type": "multipart/form-data"
                          }
                        }));

                      case 11:
                        (0, _alerts.showAlert)("success", "Application sent successfully!");
                        applyUploadCvBtn.textContent = "Applied";
                        if (saveCvCheck) saveCvCheck.parentElement.style.display = "none";
                        _context3.next = 21;
                        break;

                      case 16:
                        _context3.prev = 16;
                        _context3.t0 = _context3["catch"](6);
                        applyUploadCvBtn.disabled = false;
                        applyUploadCvBtn.textContent = userCv ? "Upload different CV" : "Apply Now";
                        (0, _alerts.showAlert)("error", _context3.t0.response && _context3.t0.response.data.message ? _context3.t0.response.data.message : "Error uploading CV");

                      case 21:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, null, null, [[6, 16]]);
              });
            } // Re-attach close listener


            closeBtn = document.getElementById("closeDetailsBtn");

            if (closeBtn) {
              closeBtn.addEventListener("click", function () {
                detailsContainer.classList.remove("details--open");
                document.body.classList.remove("no-scroll");
              });
            } // Attach Save Listener


            saveBtn = document.getElementById("saveJobBtn");

            if (saveBtn) {
              saveBtn.addEventListener("click", function _callee4(e) {
                var jobId, wasSaved;
                return regeneratorRuntime.async(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        e.preventDefault();
                        jobId = saveBtn.dataset.id;
                        wasSaved = saveBtn.classList.contains("btn--saved");
                        _context4.prev = 3;

                        if (!wasSaved) {
                          _context4.next = 12;
                          break;
                        }

                        _context4.next = 7;
                        return regeneratorRuntime.awrap(_axios["default"]["delete"]("/api/v1/jobs/".concat(jobId, "/save")));

                      case 7:
                        saveBtn.textContent = "Save Job";
                        saveBtn.classList.remove("btn--saved");
                        (0, _alerts.showAlert)("success", "Job removed from saved list");
                        _context4.next = 17;
                        break;

                      case 12:
                        _context4.next = 14;
                        return regeneratorRuntime.awrap(_axios["default"].post("/api/v1/jobs/".concat(jobId, "/save")));

                      case 14:
                        saveBtn.textContent = "Saved";
                        saveBtn.classList.add("btn--saved");
                        (0, _alerts.showAlert)("success", "Job saved successfully");

                      case 17:
                        _context4.next = 22;
                        break;

                      case 19:
                        _context4.prev = 19;
                        _context4.t0 = _context4["catch"](3);
                        (0, _alerts.showAlert)("error", "Please login to save jobs");

                      case 22:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, null, null, [[3, 19]]);
              });
            }
          }

          _context5.next = 34;
          break;

        case 31:
          _context5.prev = 31;
          _context5.t2 = _context5["catch"](0);
          (0, _alerts.showAlert)("error", "Error loading job details");

        case 34:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 31], [10, 26], [15, 22]]);
};

exports.initJobDetail = function () {
  var reportBtn = document.getElementById("reportJobBtn");

  if (reportBtn) {
    reportBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openReportModal(reportBtn.dataset.id, reportBtn);
    });
  }
};

exports.searchJobs = function _callee6(params) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(fetchAndRenderJobs("/api/v1/jobs/search", params));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.searchSavedJobs = function _callee7(params) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(fetchAndRenderJobs("/api/v1/jobs/saved", params));

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var fetchAndRenderJobs = function fetchAndRenderJobs(url, params) {
  var res, jobs, noResultsMessage, statusHtml;
  return regeneratorRuntime.async(function fetchAndRenderJobs$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (resultsContainer) {
            _context8.next = 2;
            break;
          }

          return _context8.abrupt("return");

        case 2:
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get(url, {
            params: params
          }));

        case 5:
          res = _context8.sent;

          if (!(res.data.status === "success")) {
            _context8.next = 16;
            break;
          }

          jobs = res.data.data.jobs;
          resultsContainer.innerHTML = "";

          if (!(jobs.length === 0)) {
            _context8.next = 13;
            break;
          }

          noResultsMessage = url.includes("saved") ? "Saved jobs will show up here." : "No jobs found matching your criteria.";
          resultsContainer.innerHTML = "\n          <div class=\"no-results-container\">\n            <p class=\"no-results text-gradient\">".concat(noResultsMessage, "</p>\n          </div>\n        ");
          return _context8.abrupt("return");

        case 13:
          jobs.forEach(function (job, index) {
            // Always show Featured tag if the job is featured
            var showFeaturedTag = job.featured;
            var html = "\n          <div class=\"job-card\" tabindex=\"0\" data-id=\"".concat(job._id, "\" data-index=\"").concat(index + 1, "\">\n            ").concat(showFeaturedTag ? '<p class="featured__label">Featured</p>' : "", "\n            <h3 class=\"job-card__title\">").concat(job.title, "</h3>\n            <p class=\"job-card__company\">").concat(job.postedBy ? job.postedBy.name : "Company", "</p>\n            <div class=\"job-card__location\">\n              <p>").concat(job.location.city, "</p>\n              <p>").concat(job.location.postcode, "</p>\n              <p>Remote: ").concat(job.location.remote ? job.location.remote.charAt(0).toUpperCase() + job.location.remote.slice(1) : "No", "</p>\n            </div>\n            <p class=\"job-card__description\">").concat(job.description, "</p>\n          </div>\n        ");
            resultsContainer.insertAdjacentHTML("beforeend", html);
          });
          statusHtml = "\n        <div class=\"results-status\" style=\"position: sticky; bottom: 0; background: var(--bg-body, #fff); padding: 10px; border-top: 1px solid #eee; font-size: 1.1rem; font-weight: 500; color: #555; z-index: 10;\">\n            ".concat(jobs.length, " results found\n        </div>\n      ");
          resultsContainer.insertAdjacentHTML("beforeend", statusHtml);

        case 16:
          _context8.next = 21;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](2);
          (0, _alerts.showAlert)("error", _context8.t0);

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 18]]);
};