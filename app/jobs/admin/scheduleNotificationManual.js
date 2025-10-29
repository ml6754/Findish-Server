// // const { notificationQueue } = require("@app/bull/queues/notificationQueue");

// // this is deprecated
// const runExpiringItems = async () => {
//   try {
//     await notificationQueue.add("checkExpiringItems", {});
//     console.log("Job manually triggered!");
//   } catch (err) {
//     console.error("Error manually running job:", err);
//   }
// };

// module.exports = { runExpiringItems };
