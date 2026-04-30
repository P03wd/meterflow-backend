import Usage from "../models/Usage.js";

const usageMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const latency = Date.now() - start;

      const apiKey = req.headers["x-api-key"] || "unknown";

      const endpoint = req.originalUrl.split("?")[0]; // clean URL

      console.log("⏱ Latency:", latency);

      await Usage.create({
        apiKey,
        endpoint,
        status: res.statusCode,
        latency: Number(latency) // ensure number
      });

    } catch (err) {
      console.log("Usage tracking error:", err.message);
    }
  });

  next();
};

export default usageMiddleware;