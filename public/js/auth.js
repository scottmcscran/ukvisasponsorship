import axios from "axios";
import { showAlert } from "./alerts";

exports.signupEmployer = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/employersignup",
      data,
    });

    if (res.data.status === "success") {
      showAlert(
        "success",
        "Account created! Please check your email to verify."
      );
      const form = document.querySelector(".form--signup-employer");
      if (form) {
        form.parentElement.innerHTML =
          '<div class="form__group" style="margin: 10rem 0; min-height: 40vh; display: flex; flex-direction: column; justify-content: center;"><h2 class="heading-secondary ma-bt-lg">Check your email!</h2><p class="text-center" style="font-size: 1.6rem;">We have sent a verification link to your email address. Please close this tab and check your email to activate your account.</p></div>';
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if ((res.data.status = "success")) location.assign("/");
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};

exports.login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.signupCandidate = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert(
        "success",
        "Account created! Please check your email to verify."
      );
      const form = document.querySelector(".form--signup");
      if (form) {
        form.parentElement.innerHTML =
          '<div class="form__group" style="margin: 10rem 0; min-height: 40vh; display: flex; flex-direction: column; justify-content: center;"><h2 class="heading-secondary ma-bt-lg">Check your email!</h2><p class="text-center" style="font-size: 1.6rem;">We have sent a verification link to your email address. Please close this tab and check your email to activate your account.</p></div>';
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updatePassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
      showAlert("success", `${typeCapitalized} updated successfully!`);

      if (type === "password") {
        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("password-confirm").value = "";
        document.querySelector(".btn--save-password").textContent =
          "Save password";
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.deleteCv = async () => {
  try {
    const res = await axios({
      method: "DELETE",
      url: "/api/v1/users/deleteCv",
    });

    if (res.data.status === "success") {
      showAlert("success", "CV deleted successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.deleteAccount = async () => {
  try {
    const res = await axios({
      method: "DELETE",
      url: "/api/v1/users/deleteMe",
    });

    if (res.status === 204) {
      showAlert("success", "Account deleted successfully! Redirecting...");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", "Error deleting account! Try again.");
  }
};

exports.forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data: {
        email,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Token sent to email!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.resetPassword = async (token, password, passwordConfirm) => {
  try {
    console.log("Sending reset password request...");
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    console.log("Reset password response:", res);

    if (res.data.status === "success") {
      showAlert("success", "Password reset successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.error("Reset password error:", err);
    showAlert("error", err.response.data.message);
  }
};

exports.claimAccount = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/claimAccount/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Account activated successfully!");
      window.setTimeout(() => {
        location.assign("/employer-dashboard");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.resendVerification = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/resendVerification",
      data: { email },
    });

    if (res.data.status === "success") {
      showAlert("success", "Verification email sent! Please check your inbox.");
      const btn = document.getElementById("resendBtn");
      if (btn) {
        btn.textContent = "Email Sent!";
        btn.disabled = true;
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
