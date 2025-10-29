const { Worker } = require("bullmq");
require("@app/models/User");
require("dotenv").config({ silent: true });
const InventoryItem = require("@app/models/InventoryItem");
const cleanUpWorker = new Worker(
  "cleanUpQueue",
  async () => {
    try {
      console.log("worker cleaning up ingredients");
      const now = new Date();
      const items = await InventoryItem.find({
        expired: { $lt: now },
      }).populate("owner");
      for (const item of items) {
        if (item.owner === null) {
          await InventoryItem.findByIdAndDelete(item._id);
          console.log(item + " deleted ");
        } else {
          console.log(item);
          let deleteExpDate =
            new Date(item.expired).getTime() +
            item.owner.deleteExpWhen * 24 * 60 * 60 * 1000;
          console.log("Date" + deleteExpDate);
          if (deleteExpDate < now) {
            await InventoryItem.findByIdAndDelete(item._id);
            console.log(item + " deleted ");
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error in cleanUp worker:", error);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);

console.log("CleanUp worker is running and ready to process jobs...");

cleanUpWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

cleanUpWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

cleanUpWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

module.exports = { cleanUpWorker };
