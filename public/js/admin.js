import axios from "axios";
import { showAlert } from "./alerts";

export const initAdmin = () => {
  const dashboardContainer = document.querySelector(".dashboard-container");
  if (!dashboardContainer) return;

  // Only run if we are on the admin dashboard (check for specific element)
  const adminHeader = document.querySelector(".dashboard-header h2");
  if (!adminHeader || !adminHeader.textContent.includes("Admin Dashboard"))
    return;

  // --- TABS LOGIC ---
  const tabsContainer = document.querySelector(".dashboard-tabs");
  const tabs = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabsContainer) {
    tabsContainer.addEventListener("click", function (e) {
      const clicked = e.target.closest(".tab-btn");
      if (!clicked) return;

      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("tab-btn--active"));
      tabContents.forEach((c) => c.classList.remove("tab-content--active"));

      // Activate clicked tab and content
      clicked.classList.add("tab-btn--active");
      document
        .querySelector(`.tab-content[id="${clicked.dataset.tab}"]`)
        .classList.add("tab-content--active");
    });
  }

  // --- MODAL LOGIC ---
  const modalOverlay = document.getElementById("confirmModal");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const closeModalBtn = document.querySelector(".btn-close-modal");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmMessage = document.getElementById("confirmMessage");

  let currentAction = null;
  let currentId = null;

  const openModal = (title, message, action, id) => {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    currentAction = action;
    currentId = id;
    modalOverlay.classList.remove("hidden");
  };

  const closeModal = () => {
    modalOverlay.classList.add("hidden");
    currentAction = null;
    currentId = null;
  };

  if (modalOverlay) {
    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    confirmBtn.addEventListener("click", async () => {
      if (!currentAction || !currentId) return;

      const originalText = confirmBtn.textContent;
      confirmBtn.textContent = "Processing...";

      try {
        if (currentAction === "approveEmployer") {
          await axios.post(`/api/v1/admin/${currentId}/employer-verification`);
          showAlert("success", "Employer approved successfully!");
        } else if (currentAction === "rejectEmployer") {
          await axios.delete(
            `/api/v1/admin/${currentId}/employer-verification`
          );
          showAlert("success", "Employer rejected successfully!");
        } else if (currentAction === "deleteJob") {
          await axios.delete(`/api/v1/admin/jobs/${currentId}`);
          showAlert("success", "Job deleted successfully!");
        } else if (currentAction === "dismissReport") {
          await axios.patch(`/api/v1/admin/jobs/${currentId}/dismiss`);
          showAlert("success", "Report dismissed successfully!");
        } else if (currentAction === "deleteBug") {
          await axios.delete(`/api/v1/bug-reports/${currentId}`);
          showAlert("success", "Bug report deleted successfully!");
        } else if (currentAction === "deleteDiscount") {
          await axios.delete(`/api/v1/admin/discounts/${currentId}`);
          showAlert("success", "Discount deleted successfully!");
          setTimeout(() => location.reload(), 1000);
          return;
        }

        // Remove element from DOM without reloading
        let selector;
        if (
          currentAction === "approveEmployer" ||
          currentAction === "rejectEmployer"
        ) {
          selector = `[data-user-id="${currentId}"]`;
        } else if (currentAction === "deleteBug") {
          selector = `[data-bug-id="${currentId}"]`;
        } else {
          selector = `[data-job-id="${currentId}"]`;
        }

        const relatedButtons = document.querySelectorAll(
          `.job-item ${selector}`
        );
        relatedButtons.forEach((btn) => {
          const item = btn.closest(".job-item");
          if (item) {
            // Add a fade out effect
            item.style.transition = "all 0.5s ease";
            item.style.opacity = "0";
            item.style.transform = "translateX(20px)";
            setTimeout(() => item.remove(), 500);
          }
        });

        closeModal();
      } catch (err) {
        console.error(err);
        showAlert(
          "error",
          err.response?.data?.message || "Something went wrong!"
        );
      } finally {
        confirmBtn.textContent = originalText;
      }
    });
  }

  // --- VIEW JOB MODAL LOGIC ---
  const viewJobModal = document.getElementById("viewJobModal");
  const closeViewModalBtns = document.querySelectorAll(".close-view-modal");

  const openViewJobModal = async (jobId) => {
    try {
      const res = await axios.get(`/api/v1/jobs/${jobId}`);
      const job = res.data.data.job;

      document.getElementById("viewJobTitle").textContent = job.title;
      document.getElementById("viewJobCompany").textContent =
        job.companyName || "N/A";
      document.getElementById("viewJobLocation").textContent =
        `${job.location.city}, ${job.location.postcode}`;
      document.getElementById("viewJobSalary").textContent =
        `£${job.salaryRange.min} - £${job.salaryRange.max || "N/A"}`;
      document.getElementById("viewJobDescription").innerHTML = job.description;

      // Set IDs for action buttons in modal
      const dismissBtn = document.getElementById("modalDismissBtn");
      const deleteBtn = document.getElementById("modalDeleteBtn");

      if (dismissBtn) dismissBtn.dataset.jobId = job._id;
      if (deleteBtn) deleteBtn.dataset.jobId = job._id;

      viewJobModal.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      showAlert("error", "Could not fetch job details");
    }
  };

  const closeViewJobModal = () => {
    viewJobModal.classList.add("hidden");
  };

  if (viewJobModal) {
    closeViewModalBtns.forEach((btn) =>
      btn.addEventListener("click", closeViewJobModal)
    );
    viewJobModal.addEventListener("click", (e) => {
      if (e.target === viewJobModal) closeViewJobModal();
    });
  }

  // --- EVENT DELEGATION FOR ACTIONS ---
  // Use document body to catch events from modals as well
  document.body.addEventListener("click", (e) => {
    const btnApprove = e.target.closest(".btn--approve-employer");
    const btnReject = e.target.closest(".btn--reject-employer");
    const btnDeleteJob = e.target.closest(".btn--delete-job");
    const btnDismissReport = e.target.closest(".btn--dismiss-report");
    const btnViewJob = e.target.closest(".btn--view-job");
    const btnFixBug = e.target.closest(".btn--fix-bug");

    if (btnViewJob) {
      openViewJobModal(btnViewJob.dataset.jobId);
    }

    if (btnFixBug) {
      const { bugId } = btnFixBug.dataset;
      openModal(
        "Delete Bug Report",
        "Are you sure you want to mark this bug as fixed and delete it?",
        "deleteBug",
        bugId
      );
    }

    if (btnApprove) {
      const { userId, companyName } = btnApprove.dataset;
      openModal(
        "Approve Employer",
        `Are you sure you want to approve ${companyName}? They will be able to post jobs immediately.`,
        "approveEmployer",
        userId
      );
    }

    if (btnReject) {
      const { userId, companyName } = btnReject.dataset;
      openModal(
        "Reject Employer",
        `Are you sure you want to reject ${companyName}? This cannot be undone easily.`,
        "rejectEmployer",
        userId
      );
    }

    if (btnDeleteJob) {
      const { jobId } = btnDeleteJob.dataset;

      // Close view job modal if open
      if (viewJobModal && !viewJobModal.classList.contains("hidden")) {
        closeViewJobModal();
      }

      openModal(
        "Delete Job",
        "Are you sure you want to delete this job? This action cannot be undone.",
        "deleteJob",
        jobId
      );
    }

    if (btnDismissReport) {
      const { jobId } = btnDismissReport.dataset;

      // Close view job modal if open
      if (viewJobModal && !viewJobModal.classList.contains("hidden")) {
        closeViewJobModal();
      }

      openModal(
        "Dismiss Report",
        "Are you sure you want to dismiss the reports on this job? It will be set to active again.",
        "dismissReport",
        jobId
      );
    }
  });

  // --- EXPORT DATA LOGIC ---
  const exportForm = document.querySelector(".form--export-data");
  const exportOutput = document.getElementById("exportOutput");
  const exportResult = document.querySelector(".export-result");
  const btnDownloadJson = document.getElementById("btnDownloadJson");
  let currentExportData = null;

  if (exportForm) {
    exportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("exportEmail").value;
      const btn = document.getElementById("btnExportData");

      btn.textContent = "Exporting...";

      try {
        const res = await axios.post("/api/v1/admin/export-user-data", {
          email,
        });
        currentExportData = res.data.data;

        exportOutput.textContent = JSON.stringify(currentExportData, null, 2);
        exportResult.classList.remove("hidden");
        showAlert("success", "Data retrieved successfully");
      } catch (err) {
        console.error(err);
        showAlert(
          "error",
          err.response?.data?.message || "Error retrieving data"
        );
        exportResult.classList.add("hidden");
      } finally {
        btn.textContent = "Export Data";
      }
    });

    if (btnDownloadJson) {
      btnDownloadJson.addEventListener("click", () => {
        if (!currentExportData) return;

        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(currentExportData, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute(
          "download",
          `user_data_${currentExportData.profile.email}.json`
        );
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    }
  }

  // --- SHADOW ACCOUNT LOGIC ---
  const createShadowBtn = document.getElementById("createShadowBtn");
  const shadowJobSection = document.getElementById("shadowJobSection");
  const shadowCompanyNameDisplay = document.getElementById(
    "shadowCompanyNameDisplay"
  );
  const shadowUserIdInput = document.getElementById("shadowUserId");
  const postShadowJobBtn = document.getElementById("postShadowJobBtn");
  const sendClaimEmailBtn = document.getElementById("sendClaimEmailBtn");
  const shadowJobsListUl = document.getElementById("shadowJobsListUl");

  if (createShadowBtn) {
    createShadowBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent form submission
      const companyName = document.getElementById("shadowCompanyName").value;
      const email = document.getElementById("shadowEmail").value;
      const industry = document.getElementById("shadowIndustry").value;

      if (!companyName || !email) {
        return showAlert("error", "Please provide company name and email");
      }

      createShadowBtn.textContent = "Creating...";

      try {
        const res = await axios.post("/api/v1/admin/shadow-employer", {
          companyName,
          email,
          industry,
        });

        if (res.data.status === "success") {
          showAlert("success", "Shadow account created!");
          const user = res.data.data.user;

          // Show job form
          shadowJobSection.classList.remove("hidden");
          shadowCompanyNameDisplay.textContent =
            user.companyProfile.companyName;
          shadowUserIdInput.value = user._id;

          // Disable create form to prevent confusion
          document.getElementById("shadowCompanyName").disabled = true;
          document.getElementById("shadowEmail").disabled = true;
          document.getElementById("shadowIndustry").disabled = true;
          createShadowBtn.disabled = true;
          createShadowBtn.textContent = "Created";
        }
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Error creating account"
        );
        createShadowBtn.textContent = "Create Account";
      }
    });
  }

  if (postShadowJobBtn) {
    postShadowJobBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const userId = shadowUserIdInput.value;
      if (!userId) return showAlert("error", "No user selected");

      const title = document.getElementById("shadowJobTitle").value;
      const description = document.getElementById("shadowJobDescription").value;
      const city = document.getElementById("shadowJobLocation").value;
      const postcode = document.getElementById("shadowJobPostcode").value;
      const remote = document.getElementById("shadowJobRemote").value;
      const minSalary = document.getElementById("shadowJobSalaryMin").value;
      const maxSalary = document.getElementById("shadowJobSalaryMax").value;
      const salaryPeriod = document.getElementById(
        "shadowJobSalaryPeriod"
      ).value;
      const jobType = document.getElementById("shadowJobType").value;
      const experienceLevel = document.getElementById(
        "shadowJobExperience"
      ).value;
      const requirementsRaw = document.getElementById(
        "shadowJobRequirements"
      ).value;
      const benefitsRaw = document.getElementById("shadowJobBenefits").value;
      const applicationUrl = document.getElementById("shadowJobLink").value;

      const requirements = requirementsRaw
        ? requirementsRaw.split("\n").filter((line) => line.trim() !== "")
        : [];
      const benefits = benefitsRaw
        ? benefitsRaw.split("\n").filter((line) => line.trim() !== "")
        : [];

      const visaSelect = document.getElementById("shadowJobVisa");
      const visaTypes = Array.from(visaSelect.selectedOptions).map(
        (option) => option.value
      );

      if (
        !title ||
        !description ||
        !city ||
        !postcode ||
        !minSalary ||
        visaTypes.length === 0
      ) {
        return showAlert("error", "Please fill in all required fields");
      }

      postShadowJobBtn.textContent = "Posting...";

      try {
        const res = await axios.post("/api/v1/jobs", {
          title,
          description,
          location: {
            city,
            postcode,
            remote,
          },
          salaryRange: {
            min: minSalary,
            max: maxSalary || minSalary,
            period: salaryPeriod,
          },
          jobType,
          experienceLevel,
          requirements,
          benefits,
          visaTypes,
          applicationUrl,
          postedBy: userId, // Admin override
        });

        if (res.data.status === "success") {
          showAlert("success", "Job posted successfully!");
          postShadowJobBtn.textContent = "Post Job";

          // Add to list
          const li = document.createElement("li");
          li.textContent = `${title} - ${city} (£${minSalary})`;
          li.style.marginBottom = "5px";
          shadowJobsListUl.appendChild(li);

          // Clear form for next job
          document.querySelector(".form--shadow-job").reset();
          // Restore hidden ID
          shadowUserIdInput.value = userId;
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
        postShadowJobBtn.textContent = "Post Job";
      }
    });
  }

  // --- SHADOW QUEUE LOGIC ---
  const loadShadowQueue = async () => {
    const list = document.getElementById("shadowQueueList");
    if (!list) return;

    try {
      const res = await axios.get("/api/v1/admin/shadow-email-queue");
      const queue = res.data.data.queue;

      if (queue.length === 0) {
        list.innerHTML = "<p>No emails in queue.</p>";
        return;
      }

      list.innerHTML = queue
        .map(
          (item) => `
        <div class="shadow-queue-item">
          <div class="shadow-queue-info">
            <h4>${item.user.companyName}</h4>
            <p>${item.user.email}</p>
            <p>Jobs: ${item.user.jobCount}</p>
          </div>
          <div class="shadow-queue-date">
            <p>Queued: ${new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error(err);
      list.innerHTML = "<p>Error loading queue.</p>";
    }
  };

  if (document.getElementById("shadowQueueList")) {
    loadShadowQueue();
  }

  if (sendClaimEmailBtn) {
    sendClaimEmailBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const userId = shadowUserIdInput.value;
      if (!userId) return showAlert("error", "No user selected");

      if (
        !confirm(
          "Are you sure you want to queue the claim email? Make sure you have added all jobs first."
        )
      )
        return;

      sendClaimEmailBtn.textContent = "Queuing...";

      try {
        const res = await axios.post(
          `/api/v1/admin/users/${userId}/send-claim-email`
        );

        if (res.data.status === "success") {
          showAlert("success", "Claim email queued!");
          sendClaimEmailBtn.textContent = "Email Queued";
          sendClaimEmailBtn.disabled = true;

          // Refresh queue list
          await loadShadowQueue();

          // Reset form for next user after delay
          setTimeout(() => {
            // Reset UI for next entry
            document.querySelector(".form--shadow-employer").reset();
            document.querySelector(".form--shadow-job").reset();
            document.getElementById("shadowJobSection").classList.add("hidden");
            document.getElementById("shadowJobsListUl").innerHTML = "";
            sendClaimEmailBtn.textContent = "Queue Claim Email";
            sendClaimEmailBtn.disabled = false;

            // Clear hidden user ID
            shadowUserIdInput.value = "";
          }, 2000);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
        sendClaimEmailBtn.textContent = "Queue Claim Email";
      }
    });
  }

  // --- BLOG POST LOGIC ---
  const blogForm = document.querySelector(".form--create-blog");

  if (blogForm) {
    blogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("createBlogBtn");
      btn.textContent = "Publishing...";

      const title = document.getElementById("blogTitle").value;
      const summary = document.getElementById("blogSummary").value;
      const content = document.getElementById("blogContent").value;

      try {
        const res = await axios.post("/api/v1/articles", {
          title,
          summary,
          content,
        });

        if (res.data.status === "success") {
          showAlert("success", "Article published successfully!");
          btn.textContent = "Publish Article";
          blogForm.reset();
        }
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Error publishing article"
        );
        btn.textContent = "Publish Article";
      }
    });
  }

  // --- DISCOUNT LOGIC ---
  const createDiscountForm = document.querySelector(".form--create-discount");
  if (createDiscountForm) {
    createDiscountForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("discountCode").value;
      const percentage = document.getElementById("discountPercentage").value;
      const expiresAt = document.getElementById("discountExpires").value;
      const btn = document.getElementById("createDiscountBtn");

      btn.textContent = "Creating...";
      try {
        const res = await axios({
          method: "POST",
          url: "/api/v1/admin/discounts",
          data: { code, percentage, expiresAt },
        });

        if (res.data.status === "success") {
          showAlert("success", "Discount created successfully!");
          setTimeout(() => location.reload(), 1500);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
        btn.textContent = "Create Discount";
      }
    });
  }

  const deleteDiscountBtns = document.querySelectorAll(".btn--delete-discount");
  deleteDiscountBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      openModal(
        "Delete Discount",
        "Are you sure you want to delete this discount?",
        "deleteDiscount",
        id
      );
    });
  });

  const toggleDiscountBtns = document.querySelectorAll(".btn--toggle-discount");
  toggleDiscountBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const action = e.target.dataset.action;
      try {
        const res = await axios({
          method: "PATCH",
          url: `/api/v1/admin/discounts/${id}`,
          data: { action },
        });
        if (res.data.status === "success") {
          showAlert("success", "Discount status updated!");
          setTimeout(() => location.reload(), 1000);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
      }
    });
  });
};
