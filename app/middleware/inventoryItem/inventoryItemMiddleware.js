const itemService = require("@app/services/inventoryItem/inventoryItemService");
const { body, validationResult } = require("express-validator");

const allowedFields = ["name", "tags", "lifetime", "expired"];

// @ljm297 we use an array here because we are calling the middleware filter allow fields before the main validation happens
const validateItem = async (req, res, next) => {
  try {
    if (req.body.item) {
      req.body.item = Object.fromEntries(
        Object.entries(req.body.item).filter(([key]) =>
          allowedFields.includes(key)
        )
      );
    }
    await body("item.name")
      .isString()
      .withMessage("Name must be a string")
      .run(req);
    await body("item.lifetime")
      .isNumeric()
      .withMessage("Lifetime must be a number")
      .run(req);
    await body("item.tags")
      .isArray()
      .withMessage("Tags must be an array")
      .run(req);
    await body("item.expired")
      .optional()
      .custom((value) => {
        if (isNaN(Date.parse(value))) {
          throw new Error("Expired must be a valid date");
        }
        return true;
      })
      .withMessage("Expired must be a valid date")
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Error validating fields" });
  }
};
const itemIsOwned = async (req, res, next) => {
  try {
    const user = req.user;
    const itemId = req.params.id;
    if (!user || !itemId) {
      return res.status(400).json({ error: "User or Item ID is missing" });
    }
    let item = await itemService.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    // @ljm297
    // use equals for comparing objectId's cause not string
    if (!user._id.equals(item.owner._id)) {
      console.log(user._id);
      console.log(item.owner);
      return res.status(403).json({ error: "Item is not owned by the user" });
    }
    next();
  } catch (err) {
    console.error(`500: ${err}`);
    res.status(500).json({ error: "Authentication error" });
  }
};
//TODO we have to create middleware for edit since you can edit the soonEXPdate and we need to validate that
module.exports = { itemIsOwned, validateItem };
