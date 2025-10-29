const { Queue } = require("bullmq");
require("dotenv").config({ silent: true });

const cleanUpQueue = new Queue("cleanUpQueue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

module.exports = { cleanUpQueue };
