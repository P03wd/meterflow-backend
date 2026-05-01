import Usage from "../models/usage.js";

const usageMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const latency = Date.now() - start;

      const apiKey = req.headers["x-api-key"] || "unknown";
      const endpoint = req.originalUrl.split("?")[0];

      await Usage.create({
        apiKey,
        endpoint,
        status: res.statusCode,
        latency: Number(latency),
        timestamp: new Date() // ✅ IMPORTANT FIX
      });

      console.log("Usage saved:", endpoint);
    } catch (err) {
      console.log("Usage tracking error:", err.message);
    }
  });

  next();
};

export default usageMiddleware;