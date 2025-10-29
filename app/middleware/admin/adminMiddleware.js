const userService = require("@app/services/user/userService");
// checks to see if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    // checks user is admin in userservice
    const isAdmin = userService.isAdmin(user);
    if (isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: "not an admin" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
//saving stuff test

module.exports = { isAdmin };
