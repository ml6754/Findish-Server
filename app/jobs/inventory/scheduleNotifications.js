const { Queue } = require("bullmq");
require("dotenv").config({ silent: true });
const { notificationQueue } = require("@app/bull/queues/notificationQueue");
const notificationWorker = require("@app/bull/workers/notificationWorker");

// 1 is soonExpired, 2 is expired
// TODO should update this trash
const addItemToQueue = async (userId, item, type) => {
  try {
    const now = Date.now();
    console.log("NOW: " + now);

    const itemTime = type === 1 ? item.soonExpired : new Date(item.expired);
    if (!(itemTime instanceof Date) || isNaN(itemTime)) {
      console.log(`Invalid date for item ${item._id}`);
      return;
    }

    if (itemTime <= now) {
      console.log(`Skipping item ${item._id} as it is already expired.`);
      return;
    }
    console.log(itemTime.toDateString());
    const delay = itemTime - now; // Time until expiration

    // Get existing jobs
    const existingJobs = await notificationQueue.getJobs();
    let matchingJob = existingJobs.find((job) => {
      if (!job.data.userId) {
        console.log("Skipping job because job.data.userId is undefined.");
      } else {
        return (
          userId.toString() === job.data.userId.toString() &&
          new Date(job.data.latestTime).toDateString() ===
            itemTime.toDateString() &&
          type === job.data.type
        );
      }
    });

    if (matchingJob) {
      console.log("updating job...");
      await matchingJob.updateData({
        items: [...matchingJob.data.items, item], // Add item to the batch
        latestTime: itemTime,
        userId,
        type,
      });

      console.log(`Updated job for user ${userId} with new item.`);
    } else {
      // Create a new job
      console.log("creating job...");
      await notificationQueue.add(
        "checkExpiringItems",
        {
          userId,
          items: [item],
          type,
          latestTime: itemTime,
        },
        { delay }
      );

      console.log(`Created new job for user ${userId}.`);
    }
  } catch (err) {
    console.error("Error in addItemToQueue:", err);
  }
};
const deleteItemFromQueue = async (itemId) => {
  try {
    const existingJobs = await notificationQueue.getJobs();

    // Find all jobs that contain the item
    let matchingJobs = existingJobs.filter((job) => {
      if (!job.data || !Array.isArray(job.data.items)) {
        console.log("Skipping job due to missing or invalid items array.");
        return false;
      }
      return job.data.items.some(
        (itm) => itm?._id?.toString() === itemId?.toString()
      );
    });

    if (matchingJobs.length > 0) {
      for (const job of matchingJobs) {
        const updatedItems = job.data.items.filter(
          (itm) => itm?._id?.toString() !== itemId?.toString()
        );

        if (updatedItems.length > 0) {
          console.log(`Updating job ${job.id} to remove item...`);
          await job.updateData({
            ...job.data,
            items: updatedItems,
          });
        } else {
          console.log(`Deleting job ${job.id} as it has no more items...`);
          await job.remove();
        }
      }
    } else {
      console.log("No matching job found for item.");
    }
  } catch (err) {
    console.error("Error in deleteItemFromQueue:", err);
  }
};

module.exports = { addItemToQueue, deleteItemFromQueue, notificationQueue };
