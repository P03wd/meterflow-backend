import ApiKey from "../models/apikey.js";

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key missing" });
    }

    const keyData = await ApiKey.findOne({ key: apiKey });

    if (!keyData) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    // attach to request (useful later)
    req.apiKey = keyData;

    next();

  } catch (err) {
    console.error("API key error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default apiKeyMiddleware;