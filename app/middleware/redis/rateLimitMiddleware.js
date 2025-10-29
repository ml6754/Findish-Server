// rateLimitRedis.js
const { RateLimiterRedis } = require("rate-limiter-flexible");
const { redisClient } = require("@app/redis/redisClient.js");

// Calculate the rate limits
const pointsPerMinuteGlobal = process.env.AI_RPM;
const pointsPerMinuteUser = process.env.USER_AI_RPM;

// Global Rate Limiter (affects all requests)
const globalRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: pointsPerMinuteGlobal,
  duration: 60,
  blockDuration: 0,
  keyPrefix: "rlflx_global", // Unique prefix for global rate limiting
});

// Per-User/IP Rate Limiter
const userRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: pointsPerMinuteUser,
  duration: 60,
  blockDuration: 0,
  keyPrefix: "rlflx_user", // Unique prefix for user-specific rate limiting
});

const rateLimiterMiddlewareAIGlobal = async (req, res, next) => {
  try {
    const AIkey = `ai`;
    try {
      await globalRateLimiter.consume(AIkey, 3);
      next();
    } catch (rejRes) {
      if (rejRes instanceof Error) {
        console.error("Redis error:", rejRes);
        return res.status(500).send("Internal Server Error");
      }

      const logKey = "AIRateLogs";
      const secs = Math.ceil(rejRes.msBeforeNext / 1000) || 1;
      const message = `Global rate limit exceeded at ${Date.now()} 
      ${rejRes}`;
      redisClient.lPush(logKey, message, (err) => {
        if (err) {
          console.error("Error logging to Redis:", err);
        } else {
          console.log("Global rate limit log written to Redis.");
        }
      });

      res.set("Retry-After", String(secs));
      return res
        .status(503)
        .send(`Global Rate Limit Exceeded – Try again in ${secs} seconds`);
    }
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Error validating fields" });
  }
};
const rateLimiterMiddlewareAIUser = async (req, res, next) => {
  try {
    const user = req.user;
    const userKey = user._id;
    try {
      await userRateLimiter.consume(userKey, 3);
      next();
    } catch (rejRes) {
      if (rejRes instanceof Error) {
        console.error("Redis error:", rejRes);
        return res.status(500).send("Internal Server Error");
      }

      const logKey = "AIRateLogs";
      const secs = Math.ceil(rejRes.msBeforeNext / 1000) || 1;
      const message = `User ${
        req.user.id
      } exceeded rate limit at ${Date.now()}`;
      redisClient.lPush(logKey, message, (err) => {
        if (err) {
          console.error("Error logging to Redis:", err);
        } else {
          console.log("User rate limit log written to Redis.");
        }
      });

      res.set("Retry-After", String(secs));
      return res.status(429)
        .send(`User Rate Limit Exceeded – Try again in ${secs} seconds 
        ${rejRes}`);
    }
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "Error validating fields" });
  }
};
module.exports = {
  rateLimiterMiddlewareAIGlobal,
  rateLimiterMiddlewareAIUser,
};
