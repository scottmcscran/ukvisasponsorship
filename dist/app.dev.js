"use strict";

var express = require("express");

var morgan = require("morgan");

var rateLimit = require("express-rate-limit");

var AppError = require("./utils/appError");

var globalErrorHandler = require("./controllers/errorController");

var helmet = require("helmet");

var hpp = require("hpp");

var jobRouter = require("./routers/jobRouter");

var userRouter = require("./routers/userRouter");

var subRouter = require("./routers/subRouter");

var viewRouter = require("./routers/viewRouter");

var adminRouter = require("./routers/adminRouter");

var bugReportRouter = require("./routers/bugReportRouter");

var articleRouter = require("./routers/articleRouter"); // const reviewRouter = require(`./routers/reviewRouter`);
// eslint-disable-next-line import/no-extraneous-dependencies


var cookieParser = require("cookie-parser");

var path = require("path");

var subController = require("./controllers/subController");

var app = express();
app.set("trust proxy", true); // Trust all proxies to ensure req.protocol is correct
// Force HTTPS Redirect

app.use(function (req, res, next) {
  // 1. Check standard secure property
  if (req.secure) return next(); // 2. Check standard proxy headers

  var xForwardedProto = req.headers["x-forwarded-proto"];
  if (xForwardedProto && xForwardedProto.includes("https")) return next(); // 3. Check Cloudflare specific headers (Flexible SSL support)

  var cfVisitor = req.headers["cf-visitor"];
  if (cfVisitor && cfVisitor.includes('"scheme":"https"')) return next(); // 4. Check other common headers

  if (req.headers["x-forwarded-ssl"] === "on") return next();
  if (req.headers["front-end-https"] === "on") return next(); // 5. Allow localhost/dev/private IPs

  if (req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("192.168.") || req.hostname.startsWith("10.") || req.hostname.endsWith(".local")) {
    return next();
  } // If none of the above, redirect to HTTPS


  res.redirect("https://".concat(req.hostname).concat(req.url));
});
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express["static"](path.join(__dirname, "public")));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "ws://127.0.0.1:*", "ws://localhost:*", "http://127.0.0.1:*", "http://localhost:*", "https://www.google-analytics.com", "https://analytics.google.com", "https://api.stripe.com", "https://checkout.stripe.com", "https://r.stripe.com"],
      scriptSrc: ["'self'", "https://js.stripe.com", "'unsafe-eval'", "'unsafe-inline'", "https://www.googletagmanager.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      imgSrc: ["'self'", "data:", "https://ukvisasponsorship.s3.us-east-1.amazonaws.com", "https://ukvisasponsorship.com", "https://*.stripe.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      upgradeInsecureRequests: null
    }
  },
  hsts: false // Disable Strict-Transport-Security for IP access

})); // Suppress Permissions-Policy warnings

app.use(function (req, res, next) {
  res.setHeader("Permissions-Policy", "browsing-topics=(), interest-cohort=(), join-ad-interest-group=(), run-ad-auction=()");
  next();
}); // Stripe Webhook

app.post("/webhook-checkout", express.raw({
  type: "application/json"
}), subController.webhookCheckout);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} // Rate Limiting


var limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Request limit reached, try again in 1hr",
  validate: {
    trustProxy: false
  }
});
app.use("/api", limiter);
app.use(express.json({
  limit: "10kb"
}));
app.use(express.urlencoded({
  extended: true,
  limit: "10kb"
}));
app.use(cookieParser());
app.use(hpp({
  whitelist: ["visaType", "location", "salary"]
}));
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
});
app.get("/bundle.js.map", function (req, res) {
  res.sendFile(path.join(__dirname, "public/js/bundle.js.map"));
}); // Routes

app.use("/blog", articleRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/subscriptions", subRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/bug-reports", bugReportRouter);
app.use(function (req, res, next) {
  next(new AppError("Requested URL does not exist. (".concat(req.originalUrl, ")"), 404));
});
app.use(globalErrorHandler);
module.exports = app;