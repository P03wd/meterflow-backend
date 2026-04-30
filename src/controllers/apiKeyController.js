// src/controllers/apiKeyController.js
import { randomUUID } from "crypto";
import ApiKey from "../models/apiKey.js";

export const createApiKey = async (req, res) => {
  try {
    const newKey = randomUUID();

    const apiKey = new ApiKey({
      key: newKey,
      name: req.body.name || "user",
    });

    await apiKey.save();

    res.json({
      message: "API key created",
      key: newKey,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating API key" });
  }
};