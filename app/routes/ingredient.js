const express = require("express");
const router = express.Router();
const { getIngredients } = require("@app/controllers/ingredientController");
const { cacheMiddleware } = require("@app/middleware/redis/apiCacheMiddleware");
//add routes here
router.get("/", cacheMiddleware, getIngredients);

module.exports = router;
