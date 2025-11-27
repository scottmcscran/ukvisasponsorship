/* eslint-disable */

import axios from "axios";
import { showAlert } from "./alerts";

const stripe = Stripe(
  "pk_test_51SSIpcApRaXrsBnwU1cFVHAZW4ze2xi2IJaJkGRRQlpIcHltRAVgCwQlc4S8PRYNTpcWzXO3BLn1NLpjapQErQfU00JN9Gm3wk"
);

exports.subscribe = async (plan) => {
  try {
    const session = await axios.post(
      `/api/v1/subscriptions/checkout-session/`,
      plan
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert(`error`, err);
  }
};

exports.downgradeToStarter = async (keepFeaturedJobIds = []) => {
  try {
    await axios.post("/api/v1/subscriptions/downgrade-starter", {
      keepFeaturedJobIds,
    });
    showAlert("success", "Downgraded to Starter successfully");
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (err) {
    showAlert(
      "error",
      err.response?.data?.message || "Error downgrading subscription"
    );
  }
};

exports.manageBilling = async () => {
  try {
    const res = await axios.post("/api/v1/subscriptions/billing-portal");
    if (res.data.status === "success") {
      window.location.href = res.data.url;
    }
  } catch (err) {
    showAlert(
      "error",
      err.response?.data?.message || "Error redirecting to billing portal"
    );
  }
};
