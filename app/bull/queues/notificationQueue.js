const { Queue } = require("bullmq");
require("dotenv").config({ silent: true });

const notificationQueue = new Queue("notificationQueue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

const promoteOverdueDelayedJobs = async () => {
  const delayedJobs = await notificationQueue.getJobs(["delayed"]);
  const now = Date.now();
  for (const job of delayedJobs) {
    if (job.timestamp + job.opts.delay <= now) {
      console.log(`Promoting overdue job ${job.id}`);
      await job.promote();
    }
  }
};

// Run once on server/queue startup
promoteOverdueDelayedJobs();

module.exports = { notificationQueue };
