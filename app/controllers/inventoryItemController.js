// Import the inventory item service for database operations
const itemService = require("@app/services/inventoryItem/inventoryItemService");

// Import job functions to schedule or remove expiration notifications
const {
  addItemToQueue,
  deleteItemFromQueue,
} = require("@app/jobs/inventory/scheduleNotifications");

// GET /items - Retrieve all items for the authenticated user
const getItems = async (req, res) => {
  try {
    const user = req.user;
    const items = await itemService.getItems(user);
    return res.status(200).json({ items });
  } catch (err) {
    console.error(`500: ${err.message}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// GET /items/:id - Retrieve a specific item by its ID
const getItem = async (req, res) => {
  try {
    const user = req.user;
    const itemId = req.params.id;

    // Check for missing item ID
    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const item = await itemService.getItemById(itemId);

    // Handle case when item is not found
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({ item });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// POST /items - Add a new item to the user's inventory
const addItem = async (req, res) => {
  try {
    const user = req.user;
    const item = req.body.item;

    // Calculate soon-expired timestamp based on user preference
    const soonExpired = itemService.calculateSoonExp(
      item.expired,
      user.soonExpWhen,
      user.timeZoneOffset,
      user.notificationWhen
    );
    item.soonExpired = soonExpired;

    console.log(item);

    // Save the item to the database
    const savedItem = await itemService.createItem(item, user._id);
    item._id = savedItem._id;

    // Schedule notifications for soon-expired and expired states
    await addItemToQueue(user._id, item, 1); // soon-expiring
    // await addItemToQueue(user._id, item, 2); // expired

    return res.status(201).json({ item: savedItem });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// DELETE /items/:id - Remove an item from the user's inventory
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Delete item from database and remove from notification queue
    await itemService.deleteItem(itemId);
    await deleteItemFromQueue(itemId);

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// PATCH /items/:id - Update an existing inventory item
const editItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedData = req.body.item;

    // Update item in the database
    const updatedItem = await itemService.updateItem(itemId, updatedData);
    updatedData._id = updatedItem._id;

    // Schedule new notifications if updated expiration info exists
    if (updatedData.soonExpired) {
      await addItemToQueue(req.user._id, updatedData, 1);
    }
    if (updatedData.expired) {
      // await addItemToQueue(req.user._id, updatedData, 2);
    }

    return res.status(200).json({ item: updatedItem });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Export all handler functions
module.exports = {
  getItems,
  getItem,
  addItem,
  deleteItem,
  editItem,
};
