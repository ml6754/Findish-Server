const { redisClient } = require("@app/redis/redisClient.js");
const crypto = require("crypto"); // hash key for faster redis response times
// generic per user cache

// cache some get requests for faster loading
const cacheMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    const cacheKeyParts = [
      req.originalUrl,
      JSON.stringify(req.body),
      user,
    ].filter(Boolean);
    const cacheKey = `cache:${crypto
      .createHash("sha256")
      .update(cacheKeyParts.join(":"))
      .digest("hex")}`;
    console.log(cacheKey);
    try {
      const keyRes = await redisClient.get(cacheKey);
      if (keyRes) {
        // If there's a cache hit, parse the stringified JSON data
        const parsedResponse = JSON.parse(keyRes);
        console.log("Cache hit for:", req.originalUrl); //TODO log in redis instead
        console.log(parsedResponse);
        return res.send(parsedResponse); // Send the cached response
      } else {
        console.log("Cache miss for:", req.originalUrl);
        const originalSend = res.send;

        res.send = async (body) => {
          // Cache the response body before sending it
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const responseBody = body; // Stringify the body
            await redisClient.set(cacheKey, responseBody, { EX: 60 }); // Cache for 60 seconds
          }
          originalSend.call(res, body); // Proceed with sending the original response
        };

        next(); // Continue with the request processing
      }
    } catch (err) {
      console.error("Error in Redis caching middleware:", err);
      next();
    }
  } catch (err) {
    console.error(`500: ${err}`);
    return res.status(500).json({ error: "error caching request" });
  }
};

//TODO
// cache specifically for OpenFoodFacts to decrease number of hits
const cacheMiddlewareFacts = async (req, res, next) => {
  // Create a cache key based on the request URL (and query params)
  const cacheKey = `cache:${req.originalUrl || req.url}`;
  try {
  } catch (err) {
    console.error("Error in Redis caching middleware:", err);
    next(); // Continue if error
  }
};
module.exports = { cacheMiddleware, cacheMiddlewareFacts };
