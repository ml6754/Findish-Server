// passport is useless here we write our own code so our controllers/middleware and services all follow the same structure 😎

const authService = require("@app/services/user/authService");
const userService = require("@app/services/user/userService");

// Middleware to verify JWT token for protected routes
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decodedToken = authService.verifyJWT(token); // Token verification, including expiration check, done by authService
    // Fetch the user using userService and attach to request
    req.user = await userService.getUserById(decodedToken.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const verifyJWTBull = async (req, res, next) => {
  const token = req.query.token; // Extract Bearer token
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decodedToken = authService.verifyJWT(token); // Token verification, including expiration check, done by authService
    // Fetch the user using userService and attach to request
    user = await userService.getUserById(decodedToken.id);
    if (user.isAdmin === true) {
      next();
    } else {
      return res.status(401).json({ message: "not admin" });
    }
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body.user;

    // Find user by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user associated with that email" });
    }

    // Compare password
    authService.comparePassword(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ error: "Incorrect email or password" });
      }

      // Attach user to request and proceed to the next middleware
      req.user = user;
      next();
    });
  } catch (err) {
    console.error(`500: ${err}`);
    res.status(500).json({ error: "Authentication error" });
  }
};

module.exports = { verifyJWT, authenticateUser, verifyJWTBull };
