import axios from "axios";
import { showAlert } from "./alerts";

export const initBugReport = () => {
  const reportBugBtn = document.getElementById("reportBugBtn");
  const bugReportModal = document.getElementById("bugReportModal");
  const closeBugReportModal = document.getElementById("closeBugReportModal");
  const bugReportForm = document.querySelector(".form--bug-report");
  const submitBtn = document.getElementById("submitBugReportBtn");

  const openModal = (e) => {
    e.preventDefault();
    bugReportModal.classList.remove("hidden");
  };

  const closeModal = () => {
    bugReportModal.classList.add("hidden");
    bugReportForm.reset();
  };

  if (reportBugBtn && bugReportModal) {
    reportBugBtn.addEventListener("click", openModal);
    closeBugReportModal.addEventListener("click", closeModal);
    bugReportModal.addEventListener("click", (e) => {
      if (e.target === bugReportModal) closeModal();
    });

    bugReportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      submitBtn.textContent = "Submitting...";

      const title = document.getElementById("bugTitle").value;
      const description = document.getElementById("bugDescription").value;

      try {
        const res = await axios({
          method: "POST",
          url: "/api/v1/bug-reports",
          data: {
            title,
            description,
          },
        });

        if (res.data.status === "success") {
          showAlert("success", "Bug report submitted successfully!");
          closeModal();
        }
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Something went wrong"
        );
      } finally {
        submitBtn.textContent = "Submit Report";
      }
    });
  }
};
