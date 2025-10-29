// services/userService.js

const User = require("@app/models/User");
const authService = require("@app/services/user/authService");

const createUser = async (userData) => {
  const hashedPassword = await authService.hashPassword(userData.password);

  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    throw new Error("Error saving user");
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    throw new Error("invalid Email");
  }
};

const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    throw new Error("invalid id");
  }
};
const isAdmin = (user) => {
  try {
    if (user.isAdmin === true) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error("invalid User");
  }
};
const excludeSensitiveUserInfo = (user) => {
  const userObject = user._doc || user;
  const sensitiveFields = ["password"]; 
  const filteredUser = Object.keys(userObject)
  .filter((key) => !sensitiveFields.includes(key)) // Exclude sensitive fields
  .reduce((acc, key) => {
    acc[key] = userObject[key]; // Build the new object
    return acc;
  }, {});

  return filteredUser;
};
const updateUserById = async (id, updatedData) => {
  try {
      return await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
  } catch (err) {
    throw new Error("Error updating item");
  }
}
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  isAdmin,
  excludeSensitiveUserInfo,
  updateUserById,
};
