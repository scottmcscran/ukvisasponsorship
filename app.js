const express = require(`express`);
const morgan = require(`morgan`);
const rateLimit = require(`express-rate-limit`);
const AppError = require(`./utils/appError`);
const globalErrorHandler = require(`./controllers/errorController`);
const helmet = require(`helmet`);

const hpp = require(`hpp`);

const jobRouter = require(`./routers/jobRouter`);
const userRouter = require(`./routers/userRouter`);
const subRouter = require(`./routers/subRouter`);
const viewRouter = require(`./routers/viewRouter`);
const adminRouter = require(`./routers/adminRouter`);
const bugReportRouter = require(`./routers/bugReportRouter`);
// const reviewRouter = require(`./routers/reviewRouter`);

// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require("cookie-parser");

const path = require(`path`);
const subController = require(`./controllers/subController`);

const app = express();

app.set('trust proxy', 1);

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `views`));

app.use(express.static(path.join(__dirname, `public`)));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        connectSrc: [
          `'self'`,
          `ws://127.0.0.1:*`,
          `ws://localhost:*`,
          `http://127.0.0.1:*`,
          `http://localhost:*`,
          `https://www.google-analytics.com`,
          `https://analytics.google.com`,
        ],
        scriptSrc: [
          `'self'`,
          `https://js.stripe.com`,
          `'unsafe-eval'`,
          `'unsafe-inline'`,
          `https://www.googletagmanager.com`,
        ],
        styleSrc: [`'self'`, `https://fonts.googleapis.com`, `'unsafe-inline'`],
        fontSrc: [`'self'`, `https://fonts.gstatic.com`],
        upgradeInsecureRequests: null,
      },
    },
    hsts: false, // Disable Strict-Transport-Security for IP access
  })
);

// Stripe Webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  subController.webhookCheckout
);

if (process.env.NODE_ENV === `development`) {
  app.use(morgan(`dev`));
}

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Request limit reached, try again in 1hr`,
});

app.use(`/api`, limiter);

app.use(express.json({ limit: `10kb` }));
app.use(express.urlencoded({ extended: true, limit: `10kb` }));
app.use(cookieParser());

app.use(
  hpp({
    whitelist: [`visaType`, `location`, `salary`],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/bundle.js.map", (req, res) => {
  res.sendFile(path.join(__dirname, "public/js/bundle.js.map"));
});

// Routes
app.use(`/`, viewRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/jobs`, jobRouter);
app.use(`/api/v1/subscriptions`, subRouter);
app.use(`/api/v1/admin`, adminRouter);
app.use(`/api/v1/bug-reports`, bugReportRouter);

app.use((req, res, next) => {
  next(new AppError(`Requested URL does not exist. (${req.originalUrl})`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
