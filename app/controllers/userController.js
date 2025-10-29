const authService = require("@app/services/user/authService");
const userService = require("@app/services/user/userService");

// Register User
const register = async (req, res) => {
  try {
    const savedUser = await userService.createUser(req.body.user);
    const responseUser = userService.excludeSensitiveUserInfo(savedUser);
    return res.status(201).json({ user: responseUser });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
// user login
const login = async (req, res) => {
  try {
    const user = req.user; // Access the user added by middleware

    // Generate JWT token
    authService.generateJWT(user._id, "7d", (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Token generation failed" });
      }
      const responseUser = userService.excludeSensitiveUserInfo(user);
      return res.status(200).json({ user: responseUser, token: token });
    });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
// gets user details
const details = async (req, res) => {
  try {
    const user = req.user;
    const responseUser = userService.excludeSensitiveUserInfo(user);
    return res.status(200).json({ user: responseUser });
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
// edits a user
const editUser = async (req,res) => {
  try{
    const user = req.user;
    const updatedData = req.body.user;
    const updatedUser = await userService.updateUserById(user._id,updatedData)
    return res.status(200).json({ user: updatedUser });
  } catch(err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  register,
  login,
  details,
  editUser,
};
