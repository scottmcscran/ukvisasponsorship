const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
const { dailySubscriptionCheck, checkShadowAccountExpirations } = require(
  `./services/subscriptionService`
);
const { processShadowEmailQueue } = require("./services/shadowEmailService");
const cron = require(`node-cron`);

// Trigger restart 16
process.on(`uncaughtExeption`, (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandled rejection, Shutting Down Server.`);
  process.exit(1);
});

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE_URL.replace(
  `<db_password>`,
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  // eslint-disable-next-line no-console
  console.log(`DB connection successful!`);
});

const app = require(`./app`);

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);

  cron.schedule("0 2 * * *", async () => {
    console.log(`Running daily subscription check...`);
    try {
      await dailySubscriptionCheck();
      await checkShadowAccountExpirations();
    } catch (error) {
      console.error(`Daily subscription check failed:`, error);
    }
  });

  // Run at 10:15 every Tuesday - Thursday
  cron.schedule("15 10 * * 2-4", async () => {
    console.log(`Running shadow email queue processing...`);
    try {
      await processShadowEmailQueue();
    } catch (error) {
      console.error(`Shadow email queue processing failed:`, error);
    }
  });
});

process.on(`unhandledRejection`, (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandled rejection, Shutting Down Server.`);
  server.close(() => {
    process.exit(1);
  });
});
