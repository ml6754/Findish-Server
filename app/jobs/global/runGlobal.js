const {
  scheduleIngredientCleanUp,
} = require("@app/jobs/global/scheduleIngredientCleanUp");
const runJobs = () => {
  scheduleIngredientCleanUp();
};

module.exports = { runJobs };
