import axios from "axios";
import { showAlert } from "./alerts";

let isEditing = false;
let currentJobId = null;

export const createJob = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/jobs",
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Job posted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const updateJob = async (id, data) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/jobs/${id}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Job updated successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteJob = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/jobs/${id}`,
    });

    if (res.status === 204) {
      showAlert("success", "Job deleted successfully!");

      // Remove from DOM
      const deleteBtns = document.querySelectorAll(
        `.btn--delete[data-job-id="${id}"]`
      );
      deleteBtns.forEach((btn) => {
        const item = btn.closest(".job-item");
        if (item) {
          item.style.transition = "all 0.5s ease";
          item.style.opacity = "0";
          item.style.transform = "translateX(20px)";
          setTimeout(() => {
            item.remove();
            // Check if list is empty
            const jobList = document.querySelector(".job-list");
            if (jobList && jobList.children.length === 0) {
              const noJobsMsg = document.createElement("p");
              noJobsMsg.className = "no-jobs";
              noJobsMsg.textContent = "You haven't posted any jobs yet.";
              jobList.parentNode.replaceChild(noJobsMsg, jobList);
            }
          }, 500);
        }
      });
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const getJob = async (id) => {
  try {
    const res = await axios({
      method: "GET",
      url: `/api/v1/jobs/${id}`,
    });
    if (res.data.status === "success") {
      return res.data.data.job;
    }
  } catch (err) {
    showAlert("error", "Error fetching job details");
  }
};

export const initDashboard = () => {
  const postJobBtn = document.getElementById("postJobBtn");
  const postJobBtnEmpty = document.getElementById("postJobBtnEmpty");
  const postJobModal = document.getElementById("postJobModal");
  const closePostJobModal = document.getElementById("closePostJobModal");
  const postJobForm = document.querySelector(".form--post-job");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubmitBtn = document.getElementById("modalSubmitBtn");
  const jobList = document.querySelector(".job-list");

  const openModal = () => {
    postJobModal.classList.remove("hidden");
  };

  const closeModal = () => {
    postJobModal.classList.add("hidden");
    resetForm();
  };

  const resetForm = () => {
    postJobForm.reset();
    isEditing = false;
    currentJobId = null;
    if (modalTitle) modalTitle.textContent = "Post a New Job";
    if (modalSubmitBtn) modalSubmitBtn.textContent = "Post Job";

    // Reset checkboxes
    document.querySelectorAll('input[name="visaTypes"]').forEach((cb) => {
      cb.checked = false;
    });
    if (document.getElementById("featured")) {
      document.getElementById("featured").checked = false;
    }
  };

  if (postJobModal) {
    if (postJobBtn)
      postJobBtn.addEventListener("click", () => {
        resetForm();
        openModal();
      });
    if (postJobBtnEmpty)
      postJobBtnEmpty.addEventListener("click", () => {
        resetForm();
        openModal();
      });

    closePostJobModal.addEventListener("click", closeModal);

    // Close on click outside
    postJobModal.addEventListener("click", (e) => {
      if (e.target === postJobModal) {
        closeModal();
      }
    });
  }

  // Event Delegation for Edit and Delete Buttons
  if (jobList) {
    jobList.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".btn--edit");
      const deleteBtn = e.target.closest(".btn--delete");

      if (editBtn) {
        const jobId = editBtn.dataset.jobId;
        const job = await getJob(jobId);

        if (job) {
          isEditing = true;
          currentJobId = jobId;

          // Populate form
          document.getElementById("title").value = job.title;
          document.getElementById("description").value = job.description;
          document.getElementById("city").value = job.location.city;
          document.getElementById("postcode").value = job.location.postcode;
          document.getElementById("remote").value = job.location.remote;
          document.getElementById("jobType").value = job.jobType;
          document.getElementById("salaryMin").value = job.salaryRange.min;
          document.getElementById("salaryMax").value =
            job.salaryRange.max || "";
          document.getElementById("salaryPeriod").value =
            job.salaryRange.period;
          document.getElementById("experienceLevel").value =
            job.experienceLevel;
          document.getElementById("applicationUrl").value =
            job.applicationUrl || "";
          if (document.getElementById("featured")) {
            document.getElementById("featured").checked = job.featured || false;
          }

          // Checkboxes
          const visaTypes = job.visaTypes || [];
          document.querySelectorAll('input[name="visaTypes"]').forEach((cb) => {
            cb.checked = visaTypes.includes(cb.value);
          });

          if (modalTitle) modalTitle.textContent = "Edit Job";
          if (modalSubmitBtn) modalSubmitBtn.textContent = "Update Job";

          openModal();
        }
      }

      if (deleteBtn) {
        const jobId = deleteBtn.dataset.jobId;
        if (
          confirm(
            "Are you sure you want to delete this job? This action cannot be undone."
          )
        ) {
          deleteJob(jobId);
        }
      }
    });
  }

  if (postJobForm) {
    postJobForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Gather form data
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const city = document.getElementById("city").value;
      const postcode = document.getElementById("postcode").value;
      const remote = document.getElementById("remote").value;
      const jobType = document.getElementById("jobType").value;
      const salaryMin = document.getElementById("salaryMin").value;
      const salaryMax = document.getElementById("salaryMax").value;
      const salaryPeriod = document.getElementById("salaryPeriod").value;
      const experienceLevel = document.getElementById("experienceLevel").value;
      const applicationUrl = document.getElementById("applicationUrl").value;
      const featured = document.getElementById("featured")
        ? document.getElementById("featured").checked
        : false;

      // Get checked visa types
      const visaTypes = [];
      document
        .querySelectorAll('input[name="visaTypes"]:checked')
        .forEach((checkbox) => {
          visaTypes.push(checkbox.value);
        });

      if (visaTypes.length === 0) {
        showAlert("error", "Please select at least one visa sponsorship type.");
        return;
      }

      const data = {
        title,
        description,
        location: {
          city,
          postcode,
          remote,
        },
        jobType,
        salaryRange: {
          min: salaryMin,
          max: salaryMax || undefined,
          period: salaryPeriod,
        },
        experienceLevel,
        visaTypes,
        applicationUrl,
        featured,
      };

      if (isEditing && currentJobId) {
        updateJob(currentJobId, data);
      } else {
        createJob(data);
      }
    });
  }
};
