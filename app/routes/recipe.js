const express = require("express");
const { getRecipe } = require("@app/controllers/recipeController");
const { validateRecipe } = require("@app/middleware/recipe/recipeMiddleware");
const {
  rateLimiterMiddlewareAIGlobal,
  rateLimiterMiddlewareAIUser,
} = require("@app/middleware/redis/rateLimitMiddleware.js");
const router = express.Router();
// shouldn't this be create recipe instead?
router.post(
  "/",
  rateLimiterMiddlewareAIGlobal,
  rateLimiterMiddlewareAIUser,
  validateRecipe,
  getRecipe
);

module.exports = router;
