import axios from "axios";
import { showAlert } from "./alerts";
const resultsContainer = document.querySelector(`.results`);

// Report Job Modal Logic
const reportJobModal = document.getElementById("reportJobModal");
const closeReportJobModal = document.getElementById("closeReportJobModal");
const cancelReportJobBtn = document.getElementById("cancelReportJobBtn");
const confirmReportJobBtn = document.getElementById("confirmReportJobBtn");
let jobToReportId = null;
let reportBtnToHide = null;

const closeReportModal = () => {
  if (reportJobModal) {
    reportJobModal.classList.add("hidden");
    jobToReportId = null;
    reportBtnToHide = null;
  }
};

const openReportModal = (jobId, btnElement) => {
  if (reportJobModal) {
    jobToReportId = jobId;
    reportBtnToHide = btnElement;
    reportJobModal.classList.remove("hidden");
  }
};

if (reportJobModal) {
  closeReportJobModal.addEventListener("click", closeReportModal);
  cancelReportJobBtn.addEventListener("click", closeReportModal);
  reportJobModal.addEventListener("click", (e) => {
    if (e.target === reportJobModal) closeReportModal();
  });

  confirmReportJobBtn.addEventListener("click", async () => {
    if (!jobToReportId) return;

    confirmReportJobBtn.textContent = "Reporting...";
    try {
      await axios.patch(`/api/v1/jobs/${jobToReportId}/report`);
      showAlert("success", "Job reported. Thank you.");
      if (reportBtnToHide) reportBtnToHide.style.display = "none";
      closeReportModal();
    } catch (err) {
      showAlert("error", "Error reporting job.");
    } finally {
      confirmReportJobBtn.textContent = "Report Job";
    }
  });
}

exports.loadJobData = async (id) => {
  try {
    const detailsContainer = document.querySelector(".details");
    // Show loading state
    detailsContainer.innerHTML = '<div class="spinner">Loading...</div>';

    const res = await axios.get(`/api/v1/jobs/${id}`);

    // Check if saved and get user info
    let isSaved = false;
    let userCv = null;
    let isApplied = false;
    let userRole = "candidate";

    try {
      const savedRes = await axios.get("/api/v1/jobs/saved");
      if (savedRes.data.status === "success") {
        const savedJobs = savedRes.data.data.jobs;
        if (savedJobs && Array.isArray(savedJobs)) {
          isSaved = savedJobs.some((j) => j._id === id);
        }
      }

      // Try to get user info to check for CV
      try {
        const meRes = await axios.get("/api/v1/users/me");
        if (meRes.data.status === "success") {
          userCv = meRes.data.data.cv;
          userRole = meRes.data.data.role;
          const appliedJobs = meRes.data.data.appliedJobs;
          if (appliedJobs && Array.isArray(appliedJobs)) {
            isApplied = appliedJobs.includes(id);
          }
        }
      } catch (e) {
        // Ignore if can't get user info
      }
    } catch (err) {
      // User likely not logged in or error fetching saved jobs
    }

    if (res.data.status === "success") {
      const job = res.data.data.job;
      const saveBtnText = isSaved ? "Saved" : "Save Job";
      const saveBtnClass = isSaved ? "btn--save btn--saved" : "btn--save";

      let applyHtml;
      if (isApplied) {
        applyHtml = `<button class="btn--standard btn--apply" disabled style="background-color: #1a73c2; cursor: default;">Applied</button>`;
      } else if (job.applicationLink) {
        applyHtml = `<a href="${job.applicationLink}" class="btn--standard btn--apply" target="_blank">Apply Now</a>`;
      } else {
        if (userCv) {
          applyHtml = `
              <div class="apply-actions">
                  <button class="btn--standard btn--apply" id="applyProfileCvBtn">Apply with Profile CV</button>
                  <button class="btn--text" id="applyUploadCvBtn" style="margin-top: 10px; display: block; font-size: 0.9em; background: none; border: none; color: var(--brand-primary); cursor: pointer; text-decoration: underline;">Upload different CV</button>
                  <input type="file" id="cvUpload" style="display: none;" accept=".pdf,.doc,.docx" />
              </div>
            `;
        } else {
          applyHtml = `
              <div class="apply-actions">
                  <button class="btn--standard btn--apply" id="applyUploadCvBtn">Apply Now</button>
                  <input type="file" id="cvUpload" style="display: none;" accept=".pdf,.doc,.docx" />
                  <div class="save-cv-option" style="margin-top: 10px;">
                      <input type="checkbox" id="saveCvCheck">
                      <label for="saveCvCheck" style="font-size: 1.2rem;">Save CV to profile</label>
                  </div>
              </div>
            `;
        }
      }

      const isRestrictedUser = ["admin", "employer"].includes(userRole);

      const html = `
        <button class="btn-close btn-close-details" id="closeDetailsBtn">&times;</button>
        <div class="job-details-content">
          <div class="job-header">
            <h2>${job.title}</h2>
            <p class="company-name">${job.postedBy ? job.postedBy.name : "Company"}</p>
            <div class="job-meta">
               <div class="meta-item">
                 <span class="meta-label">Location:</span>
                 <span class="meta-value">${job.location.city}, ${job.location.postcode}</span>
               </div>
               <div class="meta-item">
                 <span class="meta-label">Salary:</span>
                 <span class="meta-value">${
                   job.salaryRange
                     ? (job.salaryRange.min === job.salaryRange.max
                         ? `£${job.salaryRange.min.toLocaleString()}`
                         : `£${job.salaryRange.min.toLocaleString()}${
                             job.salaryRange.max
                               ? ` - £${job.salaryRange.max.toLocaleString()}`
                               : "+"
                           }`) + ` per ${job.salaryRange.period || "year"}`
                     : "Negotiable"
                 }</span>
               </div>
               <div class="meta-divider"></div>
               <div class="meta-item">
                 <span class="meta-label">Type:</span>
                 <span class="meta-value">${job.jobType || "Full-time"}</span>
               </div>
               <div class="meta-item">
                 <span class="meta-label">Remote:</span>
                 <span class="meta-value">${job.location.remote ? job.location.remote.charAt(0).toUpperCase() + job.location.remote.slice(1) : "No"}</span>
               </div>
            </div>
          </div>
          
          <div class="job-body">
            <h3>Description</h3>
            <p>${job.description}</p>
            
            ${job.requirements && job.requirements.length > 0 ? `<h3>Requirements</h3><p>${(job.requirements || "").toString().replace(/,/g, ", ")}</p>` : ""}
            
            ${job.visaTypes && job.visaTypes.length > 0 ? `<h3>Visa Types</h3>` : ""}
            <div class="job-tags">
               ${job.visaTypes ? job.visaTypes.map((type) => `<span class="tag">${type}</span>`).join("") : ""}
            </div>
          </div>
          
          <div class="job-actions">
            ${!isRestrictedUser ? applyHtml : ""}
            ${!isRestrictedUser ? `<button class="${saveBtnClass}" id="saveJobBtn" data-id="${job._id}">${saveBtnText}</button>` : ""}
            <button class="btn--text btn--report" id="reportJobBtn" data-id="${job._id}" style="font-size: 1.2rem; color: #999; text-decoration: underline; margin-top: 1rem; background: none; border: none; cursor: pointer;">Report Job</button>
          </div>
        </div>
      `;

      detailsContainer.innerHTML = html;

      // Attach Report Listener
      const reportJobBtn = document.getElementById("reportJobBtn");
      if (reportJobBtn) {
        reportJobBtn.addEventListener("click", () => {
          openReportModal(job._id, reportJobBtn);
        });
      }

      // Attach Apply Listeners
      const applyProfileCvBtn = document.getElementById("applyProfileCvBtn");
      const applyUploadCvBtn = document.getElementById("applyUploadCvBtn");
      const cvUpload = document.getElementById("cvUpload");
      const saveCvCheck = document.getElementById("saveCvCheck");

      if (applyProfileCvBtn) {
        applyProfileCvBtn.addEventListener("click", async () => {
          try {
            applyProfileCvBtn.textContent = "Applying...";
            applyProfileCvBtn.disabled = true;
            await axios.post(`/api/v1/jobs/${job._id}/apply`, {
              useProfileCv: "true",
            });
            showAlert("success", "Application sent successfully!");
            applyProfileCvBtn.textContent = "Applied";
            if (applyUploadCvBtn) applyUploadCvBtn.style.display = "none";
          } catch (err) {
            applyProfileCvBtn.disabled = false;
            applyProfileCvBtn.textContent = "Apply with Profile CV";
            showAlert(
              "error",
              err.response && err.response.data.message
                ? err.response.data.message
                : "Error applying"
            );
          }
        });
      }

      if (applyUploadCvBtn && cvUpload) {
        applyUploadCvBtn.addEventListener("click", () => {
          cvUpload.click();
        });

        cvUpload.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("cv", file);
          if (saveCvCheck && saveCvCheck.checked) {
            formData.append("saveCvToProfile", "true");
          }

          try {
            applyUploadCvBtn.textContent = "Applying...";
            applyUploadCvBtn.disabled = true;
            await axios.post(`/api/v1/jobs/${job._id}/apply`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            showAlert("success", "Application sent successfully!");
            applyUploadCvBtn.textContent = "Applied";
            if (saveCvCheck) saveCvCheck.parentElement.style.display = "none";
          } catch (err) {
            applyUploadCvBtn.disabled = false;
            applyUploadCvBtn.textContent = userCv
              ? "Upload different CV"
              : "Apply Now";
            showAlert(
              "error",
              err.response && err.response.data.message
                ? err.response.data.message
                : "Error uploading CV"
            );
          }
        });
      }

      // Re-attach close listener
      const closeBtn = document.getElementById("closeDetailsBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          detailsContainer.classList.remove("details--open");
          document.body.classList.remove("no-scroll");
        });
      }

      // Attach Save Listener
      const saveBtn = document.getElementById("saveJobBtn");
      if (saveBtn) {
        saveBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const jobId = saveBtn.dataset.id;
          const wasSaved = saveBtn.classList.contains("btn--saved");

          try {
            if (wasSaved) {
              await axios.delete(`/api/v1/jobs/${jobId}/save`);
              saveBtn.textContent = "Save Job";
              saveBtn.classList.remove("btn--saved");
              showAlert("success", "Job removed from saved list");
            } else {
              await axios.post(`/api/v1/jobs/${jobId}/save`);
              saveBtn.textContent = "Saved";
              saveBtn.classList.add("btn--saved");
              showAlert("success", "Job saved successfully");
            }
          } catch (err) {
            showAlert("error", "Please login to save jobs");
          }
        });
      }
    }
  } catch (err) {
    showAlert("error", "Error loading job details");
  }
};

exports.initJobDetail = () => {
  const reportBtn = document.getElementById("reportJobBtn");
  if (reportBtn) {
    reportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openReportModal(reportBtn.dataset.id, reportBtn);
    });
  }
};

exports.searchJobs = async (params) => {
  await fetchAndRenderJobs(`/api/v1/jobs/search`, params);
};

exports.searchSavedJobs = async (params) => {
  await fetchAndRenderJobs(`/api/v1/jobs/saved`, params);
};

const fetchAndRenderJobs = async (url, params) => {
  if (!resultsContainer) return;
  try {
    const res = await axios.get(url, {
      params,
    });

    if (res.data.status === `success`) {
      const jobs = res.data.data.jobs;
      resultsContainer.innerHTML = "";

      if (jobs.length === 0) {
        const noResultsMessage = url.includes("saved")
          ? "Saved jobs will show up here."
          : "No jobs found matching your criteria.";

        resultsContainer.innerHTML = `
          <div class="no-results-container">
            <p class="no-results text-gradient">${noResultsMessage}</p>
          </div>
        `;
        return;
      }

      jobs.forEach((job, index) => {
        // Always show Featured tag if the job is featured
        const showFeaturedTag = job.featured;

        const html = `
          <div class="job-card" tabindex="0" data-id="${job._id}" data-index="${index + 1}">
            ${showFeaturedTag ? '<p class="featured__label">Featured</p>' : ""}
            <h3 class="job-card__title">${job.title}</h3>
            <p class="job-card__company">${
              job.postedBy ? job.postedBy.name : "Company"
            }</p>
            <div class="job-card__location">
              <p>${job.location.city}</p>
              <p>${job.location.postcode}</p>
              <p>Remote: ${job.location.remote ? job.location.remote.charAt(0).toUpperCase() + job.location.remote.slice(1) : "No"}</p>
            </div>
            <p class="job-card__description">${job.description}</p>
          </div>
        `;
        resultsContainer.insertAdjacentHTML(`beforeend`, html);
      });

      const statusHtml = `
        <div class="results-status" style="position: sticky; bottom: 0; background: var(--bg-body, #fff); padding: 10px; border-top: 1px solid #eee; font-size: 1.1rem; font-weight: 500; color: #555; z-index: 10;">
            ${jobs.length} results found
        </div>
      `;
      resultsContainer.insertAdjacentHTML("beforeend", statusHtml);
    }
  } catch (err) {
    showAlert(`error`, err);
  }
};
