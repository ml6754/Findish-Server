const { cleanUpQueue } = require("@app/bull/queues/cleanUpQueue");
const cleanUpWorker = require("@app/bull/workers/cleanUpWorker");
const scheduleIngredientCleanUp = async () => {
  try {
    console.log("Ingredient Clean Up Scheduled");
    const cleaned = await cleanUpQueue.count();
    console.log(cleaned);
    const cleanUp = await cleanUpQueue.add(
      "deleteExpiredItems",
      {},
      {
        repeat: {
          pattern: "0 0 * * *",
        },
      }
    );
  } catch (err) {
    //TODO log in redis
    console.log(err);
  }
};

module.exports = { scheduleIngredientCleanUp };
