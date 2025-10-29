// index lol
require("module-alias/register");
require("dotenv").config({ silent: true });
const user = require("@app/routes/user");
const ingredient = require("@app/routes/ingredient");
const admin = require("@app/routes/admin");
const inventory = require("@app/routes/inventoryItem");
const recipe = require("@app/routes/recipe");
const { isAdmin } = require("@app/middleware/admin/adminMiddleware.js");
const {
  verifyJWT,
  verifyJWTBull,
} = require("@app/middleware/user/authMiddleware.js");
const express = require("express");
const server = express();
const port = process.env.SERVER_PORT;
const { runJobs } = require("@app/jobs/global/runGlobal");
const cors = require("cors"); //TODO this isn't implemented yet
const mongoose = require("mongoose"); // Replace with actual user model
const userService = require("@app/services/user/userService");
const authService = require("@app/services/user/authService"); // Your auth service for JWT generation

const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter"); // <-- Correct Adapter
const { ExpressAdapter } = require("@bull-board/express");
const { cleanUpQueue } = require("@app/bull/queues/cleanUpQueue");
const { notificationQueue } = require("@app/bull/queues/notificationQueue");

console.log("CleanUp Queue:", cleanUpQueue);
console.log("Notification Queue:", notificationQueue);

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
// this is not protected.
createBullBoard({
  queues: [
    new BullMQAdapter(cleanUpQueue),
    new BullMQAdapter(notificationQueue),
  ], // <-- Use BullMQAdapter
  serverAdapter,
});
// set to UTC
process.env.TZ = "UTC";
console.log(new Date().toString());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

mongoose.connect(process.env.DBHOST).catch((error) => console.log(error));
mongoose.connection.once("open", () => {
  console.log("Connected successfully to MongoDB");
});

// dunno how to set this up for now
// set up routes here
// Serve a simple login page (HTML form)
/*
server.get("/admin/login", (req, res) => {
  res.send(`
    <form method="POST" action="/admin/login">
      <label>Email</label>
      <input type="text" name="email" required>
      <label>Password</label>
      <input type="password" name="password" required>
      <button type="submit">Login</button>
    </form>
  `);
});
*/
// TODO we need to write brand new middleware and stuff for our auth for the server ui because headers won't work and we need to use cookies, no need to alter old auth tho
/*
server.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check credentials (replace with your actual logic)
    const user = await userService.getUserByEmail(email);
    console.log(user);
    if (!user || !authService.comparePassword(password, user.password)) {
      return res.status(401).send("Invalid credentials");
    }

    authService.generateJWT(user._id, "1d", (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Token generation failed" });
      }
      const responseUser = userService.excludeSensitiveUserInfo(user);
      res.setHeaders("Authorization", `Bearer ${token}`);
    });
    // Store the token in a cookie (or session)

    // Redirect to Bull Board UI
    res.redirect("admin/queues");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});
*/
//TODO get auth working for bull not included for now
server.use("/user", user);
server.use("/ingredient", verifyJWT, ingredient);
server.use("/admin", admin);
server.use("/inventory", verifyJWT, inventory);
server.use("/recipe", verifyJWT, recipe);
server.use("/admin/queues", serverAdapter.getRouter());

runJobs();
