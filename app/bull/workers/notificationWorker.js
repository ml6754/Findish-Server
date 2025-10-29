const { Worker } = require("bullmq");
require("dotenv").config({ silent: true });

const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    try {
      const { userId, items, type } = job.data;

      // Logic for sending notifications
      console.log(
        `Sending notification to user ${userId} for ${items.length} items, type: ${type}`
      );

      // TODO: Implement push notification logic here
    } catch (error) {
      console.error("Unexpected error in notification worker:", error);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);

console.log("Notification worker is running and ready to process jobs...");

notificationWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

notificationWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

module.exports = { notificationWorker };
