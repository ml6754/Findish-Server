const InventoryItem = require("@app/models/InventoryItem");
const userService = require("@app/services/user/userService");
const getItemById = async (id) => {
  try {
    return await InventoryItem.findById(id).populate({
      path: "owner",
    });
  } catch (err) {
    throw new Error("invalid Id");
  }
};

const getItems = async (user) => {
  try {
    return await InventoryItem.find({ owner: user });
  } catch (err) {
    throw new Error("invalid user");
  }
};

const calculateSoonExp = (
  expiredDate,
  percentage,
  timeZoneOffset,
  notificationWhen
) => {
  if (!(expiredDate instanceof Date)) {
    expiredDate = new Date(expiredDate); // Convert string to Date if needed
  }

  if (isNaN(expiredDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const now = new Date();

  const remainingTime = expiredDate.getTime() - now.getTime();
  let soonExpTime = now.getTime() + remainingTime * (percentage / 100);
  let soonExpDate = new Date(soonExpTime);

  soonExpDate = new Date(soonExpDate.getTime());

  // Ensure it's at least one day before expiration
  if (soonExpDate.toDateString() === expiredDate.toDateString()) {
    soonExpDate.setDate(expiredDate.getDate() - 1);
    // subtract to get timezone offset cause server is UTC now
    soonExpDate.setHours(notificationWhen - timeZoneOffset, 0, 0, 0);
  } else {
    soonExpDate.setHours(notificationWhen - timeZoneOffset, 0, 0, 0);
  }
  return soonExpDate;
};

const createItem = async (item, owner) => {
  try {
    let user = await userService.getUserById(owner);
    const expired = new Date(item.expired).getTime();
    const newItem = new InventoryItem({
      name: item.name,
      tags: item.tags,
      lifetime: item.lifetime,
      owner: owner,
      soonExpired: calculateSoonExp(
        expired,
        user.soonExpWhen,
        user.timeZoneOffset,
        user.notificationWhen
      ),
      expired: new Date(item.expired),
    });
    const savedItem = await newItem.save();
    return savedItem;
  } catch (err) {
    throw new Error("Error saving user");
  }
};

const deleteItem = async (id) => {
  try {
    return await InventoryItem.findByIdAndDelete(id);
  } catch (err) {
    throw new Error("Error deleting item");
  }
};

// @ljm297 will not automatically remove the owner field or any other fields that are not passed in the updatedData.
// It will only update the fields that are included in the updatedData object,
// and if the owner field is not present in updatedData, it will remain unchanged in the database.
// only need to check once 😎
const updateItem = async (id, updatedData) => {
  try {
    // Check if updatedData has 'soonExpired' and 'expired' and adjust if necessary
    if (updatedData.expired) {
      updatedData.expired = new Date(updatedData.expired).getTime();
    }
    if (updatedData.soonExpired) {
      updatedData.soonExpired = new Date(updatedData.soonExpired).getTime();
    }

    return await InventoryItem.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
  } catch (err) {
    throw new Error("Error updating item");
  }
};

module.exports = {
  getItemById,
  getItems,
  createItem,
  deleteItem,
  updateItem,
  calculateSoonExp,
};
