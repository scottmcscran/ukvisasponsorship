"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDashboard = exports.getJob = exports.deleteJob = exports.updateJob = exports.createJob = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isEditing = false;
var currentJobId = null;

var createJob = function createJob(data) {
  var res;
  return regeneratorRuntime.async(function createJob$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "/api/v1/jobs",
            data: data
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Job posted successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1500);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          (0, _alerts.showAlert)("error", _context.t0.response.data.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.createJob = createJob;

var updateJob = function updateJob(id, data) {
  var res;
  return regeneratorRuntime.async(function updateJob$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "PATCH",
            url: "/api/v1/jobs/".concat(id),
            data: data
          }));

        case 3:
          res = _context2.sent;

          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Job updated successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1500);
          }

          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          (0, _alerts.showAlert)("error", _context2.t0.response.data.message);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.updateJob = updateJob;

var deleteJob = function deleteJob(id) {
  var res, deleteBtns;
  return regeneratorRuntime.async(function deleteJob$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "DELETE",
            url: "/api/v1/jobs/".concat(id)
          }));

        case 3:
          res = _context3.sent;

          if (res.status === 204) {
            (0, _alerts.showAlert)("success", "Job deleted successfully!"); // Remove from DOM

            deleteBtns = document.querySelectorAll(".btn--delete[data-job-id=\"".concat(id, "\"]"));
            deleteBtns.forEach(function (btn) {
              var item = btn.closest(".job-item");

              if (item) {
                item.style.transition = "all 0.5s ease";
                item.style.opacity = "0";
                item.style.transform = "translateX(20px)";
                setTimeout(function () {
                  item.remove(); // Check if list is empty

                  var jobList = document.querySelector(".job-list");

                  if (jobList && jobList.children.length === 0) {
                    var noJobsMsg = document.createElement("p");
                    noJobsMsg.className = "no-jobs";
                    noJobsMsg.textContent = "You haven't posted any jobs yet.";
                    jobList.parentNode.replaceChild(noJobsMsg, jobList);
                  }
                }, 500);
              }
            });
          }

          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          (0, _alerts.showAlert)("error", _context3.t0.response.data.message);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.deleteJob = deleteJob;

var getJob = function getJob(id) {
  var res;
  return regeneratorRuntime.async(function getJob$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "GET",
            url: "/api/v1/jobs/".concat(id)
          }));

        case 3:
          res = _context4.sent;

          if (!(res.data.status === "success")) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.data.data.job);

        case 6:
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          (0, _alerts.showAlert)("error", "Error fetching job details");

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getJob = getJob;

var initDashboard = function initDashboard() {
  var postJobBtn = document.getElementById("postJobBtn");
  var postJobBtnEmpty = document.getElementById("postJobBtnEmpty");
  var postJobModal = document.getElementById("postJobModal");
  var closePostJobModal = document.getElementById("closePostJobModal");
  var postJobForm = document.querySelector(".form--post-job");
  var modalTitle = document.getElementById("modalTitle");
  var modalSubmitBtn = document.getElementById("modalSubmitBtn");
  var jobList = document.querySelector(".job-list");

  var openModal = function openModal() {
    postJobModal.classList.remove("hidden");
  };

  var closeModal = function closeModal() {
    postJobModal.classList.add("hidden");
    resetForm();
  };

  var resetForm = function resetForm() {
    postJobForm.reset();
    isEditing = false;
    currentJobId = null;
    if (modalTitle) modalTitle.textContent = "Post a New Job";
    if (modalSubmitBtn) modalSubmitBtn.textContent = "Post Job"; // Reset checkboxes

    document.querySelectorAll('input[name="visaTypes"]').forEach(function (cb) {
      cb.checked = false;
    });

    if (document.getElementById("featured")) {
      document.getElementById("featured").checked = false;
    }
  };

  if (postJobModal) {
    if (postJobBtn) postJobBtn.addEventListener("click", function () {
      resetForm();
      openModal();
    });
    if (postJobBtnEmpty) postJobBtnEmpty.addEventListener("click", function () {
      resetForm();
      openModal();
    });
    closePostJobModal.addEventListener("click", closeModal); // Close on click outside

    postJobModal.addEventListener("click", function (e) {
      if (e.target === postJobModal) {
        closeModal();
      }
    });
  } // Event Delegation for Edit and Delete Buttons


  if (jobList) {
    jobList.addEventListener("click", function _callee(e) {
      var editBtn, deleteBtn, jobId, job, visaTypes, _jobId;

      return regeneratorRuntime.async(function _callee$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              editBtn = e.target.closest(".btn--edit");
              deleteBtn = e.target.closest(".btn--delete");

              if (!editBtn) {
                _context5.next = 8;
                break;
              }

              jobId = editBtn.dataset.jobId;
              _context5.next = 6;
              return regeneratorRuntime.awrap(getJob(jobId));

            case 6:
              job = _context5.sent;

              if (job) {
                isEditing = true;
                currentJobId = jobId; // Populate form

                document.getElementById("title").value = job.title;
                document.getElementById("description").value = job.description;
                document.getElementById("city").value = job.location.city;
                document.getElementById("postcode").value = job.location.postcode;
                document.getElementById("remote").value = job.location.remote;
                document.getElementById("jobType").value = job.jobType;
                document.getElementById("salaryMin").value = job.salaryRange.min;
                document.getElementById("salaryMax").value = job.salaryRange.max || "";
                document.getElementById("salaryPeriod").value = job.salaryRange.period;
                document.getElementById("experienceLevel").value = job.experienceLevel;
                document.getElementById("applicationUrl").value = job.applicationUrl || "";

                if (document.getElementById("featured")) {
                  document.getElementById("featured").checked = job.featured || false;
                } // Checkboxes


                visaTypes = job.visaTypes || [];
                document.querySelectorAll('input[name="visaTypes"]').forEach(function (cb) {
                  cb.checked = visaTypes.includes(cb.value);
                });
                if (modalTitle) modalTitle.textContent = "Edit Job";
                if (modalSubmitBtn) modalSubmitBtn.textContent = "Update Job";
                openModal();
              }

            case 8:
              if (deleteBtn) {
                _jobId = deleteBtn.dataset.jobId;

                if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
                  deleteJob(_jobId);
                }
              }

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  }

  if (postJobForm) {
    postJobForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Gather form data

      var title = document.getElementById("title").value;
      var description = document.getElementById("description").value;
      var city = document.getElementById("city").value;
      var postcode = document.getElementById("postcode").value;
      var remote = document.getElementById("remote").value;
      var jobType = document.getElementById("jobType").value;
      var salaryMin = document.getElementById("salaryMin").value;
      var salaryMax = document.getElementById("salaryMax").value;
      var salaryPeriod = document.getElementById("salaryPeriod").value;
      var experienceLevel = document.getElementById("experienceLevel").value;
      var applicationUrl = document.getElementById("applicationUrl").value;
      var featured = document.getElementById("featured") ? document.getElementById("featured").checked : false; // Get checked visa types

      var visaTypes = [];
      document.querySelectorAll('input[name="visaTypes"]:checked').forEach(function (checkbox) {
        visaTypes.push(checkbox.value);
      });

      if (visaTypes.length === 0) {
        (0, _alerts.showAlert)("error", "Please select at least one visa sponsorship type.");
        return;
      }

      var data = {
        title: title,
        description: description,
        location: {
          city: city,
          postcode: postcode,
          remote: remote
        },
        jobType: jobType,
        salaryRange: {
          min: salaryMin,
          max: salaryMax || undefined,
          period: salaryPeriod
        },
        experienceLevel: experienceLevel,
        visaTypes: visaTypes,
        applicationUrl: applicationUrl,
        featured: featured
      };

      if (isEditing && currentJobId) {
        updateJob(currentJobId, data);
      } else {
        createJob(data);
      }
    });
  }
};

exports.initDashboard = initDashboard;