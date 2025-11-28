import axios from "axios";
import { showAlert } from "./alerts";

export const initBlog = () => {
  const blogGrid = document.querySelector(".blog-grid");

  if (blogGrid) {
    blogGrid.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".btn--delete-article");

      if (deleteBtn) {
        e.preventDefault();
        const articleId = deleteBtn.dataset.articleId;

        if (confirm("Are you sure you want to delete this article?")) {
          deleteBtn.textContent = "Deleting...";

          try {
            const res = await axios.delete(`/api/v1/articles/${articleId}`);

            if (res.status === 204) {
              showAlert("success", "Article deleted successfully");
              // Remove card from DOM
              const card = deleteBtn.closest(".blog-card");
              if (card) card.remove();
            }
          } catch (err) {
            showAlert("error", "Error deleting article");
            deleteBtn.textContent = "Delete";
          }
        }
      }
    });
  }
};
