# Testing Stripe Webhooks Locally

Since your app is running locally, Stripe cannot send webhooks directly to your `localhost`. You need to use the Stripe CLI to forward these events.

## 1. Install Stripe CLI

If you haven't already, download and install the Stripe CLI from [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli).

## 2. Login

Open a terminal and run:

```bash
stripe login
```

Follow the browser prompt to authenticate.

## 3. Start Forwarding

Run the following command to tell Stripe to send events to your local webhook endpoint:

```bash
stripe listen --forward-to localhost:3000/webhook-checkout
```

## 4. Get Your Webhook Secret

When you run the `listen` command, it will output a **Webhook Signing Secret** that looks like `whsec_...`.
You **MUST** add this to your `config.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

_Restart your Node server after adding this variable._

## 5. Trigger Events

You can now test the flow in two ways:

### Option A: Manual Test (Real UI)

1. Go to your local site (`http://localhost:3000`).
2. Log in as an employer.
3. Go to the **Subscription** tab in the dashboard.
4. You should see "Upgrade to Starter" and "Upgrade to Pro" cards (if you are on the free plan).
5. Click one of the "Upgrade" buttons.
6. You will be redirected to the Stripe Checkout page.
7. Complete the payment using Stripe's test card numbers (e.g., `4242 4242 4242 4242`).
8. Watch your terminal where `stripe listen` is running. You should see `checkout.session.completed` and other events being forwarded.
9. You will be redirected back to the dashboard. Refresh the page to see your new subscription status (e.g., "Active" and the plan name).

### Option B: Trigger via CLI

You can simulate events without going through the UI:

```bash
stripe trigger checkout.session.completed
```

_Note: Triggering via CLI sends dummy data, so it won't match a real user in your database unless you manually adjust the payload or code to handle the dummy IDs._

## 6. Verify

Check your server logs. You should see "Webhook received" (if you added logging) or check the database to ensure the user's `subscription.status` is now `active` and `currentPeriodEnd` is updated.
