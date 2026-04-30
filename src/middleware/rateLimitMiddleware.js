import redis from "../config/redis.js";
import ApiKey from "../models/apiKey.js"; 

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key missing" });
    }

const keyData = req.apiKey;
    if (!keyData) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    // 🔥 PLAN LIMITS
    const limits = {
      free: 100,
      pro: 1000
    };

    const limit = limits[keyData.plan] || 100;

    const redisKey = `rate:${apiKey}`;

    // 🔥 get current count
    const current = await redis.get(redisKey);

    if (current && Number(current) >= limit) {
      return res.status(429).json({
        message: "Rate limit exceeded"
      });
    }

    // 🔥 increment + expiry (IMPORTANT FIX)
    if (!current) {
      await redis.set(redisKey, 1, "EX", 60); // ✅ correct for ioredis
    } else {
      await redis.incr(redisKey);
    }

    next();

  } catch (err) {
    console.error("Rate limit error:", err);
    next();
  }
};

export default rateLimitMiddleware;