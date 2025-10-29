const User = require("@app/models/User");
const userService = require("@app/services/user/userService")
const { body, validationResult } = require("express-validator");

const allowedFieldsRegister = ["name", "email", "password"];
const allowedFieldsEdit = ["name", "email", "password", "exclude", "soonExpWhen", "deleteExp", "deleteExpWhen"];

const validateUserCreation =  async (req, res, next) => {
  try {
    if (req.body.user) {
      req.body.user = Object.fromEntries(
        Object.entries(req.body.user).filter(([key]) =>
          allowedFieldsRegister.includes(key)
        )
      );
    }

    await body("user.name").isString().withMessage("Name must be a string").run(req);

    await body("user.email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .run(req);

    await body("user.password")
      .isLength({ min: 6 }) // Make sure the password is at least 6 characters
      .withMessage("Password must be at least 6 characters long")
      .run(req);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  } catch (err) {
    console.error(`500: ${err}`);
    return res
      .status(500)
      .json({ error: "Error validating registration input" });
  }
};

// for update
const validateUser =  async (req, res, next) => {
  try {
    if (req.body.user) {
      req.body.user = Object.fromEntries(
        Object.entries(req.body.user).filter(([key]) =>
          allowedFieldsEdit.includes(key)
        )
      );
    }
    await body("user.name").isString().withMessage("Name must be a string").run(req);
    await body("user.email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .run(req);
    await body("user.exclude")
      .isArray()
      .withMessage("exclude must be array")
      .run(req);
    await body("user.soonExpWhen")
      .isNumeric()
      .withMessage("soonExpWhen must be a number")
      .run(req);
    await body("user.deleteExp")
      .isBoolean()
      .withMessage("deleteExp must be a boolean")
      .run(req);
    await body("user.deleteExpWhen")
      .isNumeric()
      .withMessage("deleteExpWhen must be a number")
      .run(req);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  } catch (err) {
    console.error(`500: ${err}`);
    return res
      .status(500)
      .json({ error: "Error validating registration input" });
  }
};

const userExists = async (req, res, next) => {
  try {
    const email = req.body.user.email
    const userExist = await userService.getUserByEmail(email)
    if (userExist) {
      return res.status(409).json({ error: "User already registered" });
    }
    next();
  } catch (err) {
    console.log(`Error checking user existence: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { userExists, validateUserCreation, validateUser };