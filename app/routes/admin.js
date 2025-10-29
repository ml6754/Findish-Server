//might contain more than ingredient routes🤷‍♂️
// TODO add delete and update, will do later since we don't really need it for the MVP
const express = require("express");
const router = express.Router();
const { isAdmin } = require("@app/middleware/admin/adminMiddleware.js");
const { verifyJWT } = require("@app/middleware/user/authMiddleware.js");
const {
  addIngredient,
  deleteIngredient,
  updateIngredient,
} = require("@app/controllers/adminController");

//ingredient routes
router.post("/ingredient", verifyJWT, isAdmin, addIngredient);

module.exports = router;
