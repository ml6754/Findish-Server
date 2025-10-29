const express = require("express");
const router = express.Router();
const {
  userExists,
  validateUserCreation,
  validateUser
} = require("@app/middleware/user/userMiddleware");
const {
  authenticateUser,
  verifyJWT,
} = require("@app/middleware/user/authMiddleware");
const { register, login, details, editUser} = require("@app/controllers/userController");

router.post("/register", validateUserCreation, userExists, register);
router.post("/login", authenticateUser, login);
router.get("/details", verifyJWT, details);
router.patch("/update", verifyJWT, validateUser, editUser);

module.exports = router;
