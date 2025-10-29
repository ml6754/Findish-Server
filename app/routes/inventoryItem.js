const express = require("express");
const router = express.Router();
const {
  itemIsOwned,
  validateItem,
} = require("@app/middleware/inventoryItem/inventoryItemMiddleware");
const { cacheMiddleware } = require("@app/middleware/redis/apiCacheMiddleware");
const {
  getItems,
  getItem,
  addItem,
  deleteItem,
  editItem,
} = require("@app/controllers/inventoryItemController");
router.get("/item", getItems);
router.get("/item/:id", itemIsOwned, cacheMiddleware, getItem);
router.post("/item", validateItem, addItem);
router.delete("/item/:id", itemIsOwned, deleteItem);
router.patch("/item/:id", itemIsOwned, validateItem, editItem);

module.exports = router;
