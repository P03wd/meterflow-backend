import Api from "../models/api.js";
import crypto from "crypto";

// Create API
export const createApi = async (req, res) => {
  try {
    const { name, baseUrl } = req.body;

    const api = await Api.create({
      userId: req.user.id,
      name,
      baseUrl,
    });

    res.json(api);
  } catch (err) {
    res.status(500).json({ message: "Error creating API" });
  }
};

// Get APIs of user
export const getApis = async (req, res) => {
  try {
    const apis = await Api.find({ userId: req.user.id });
    res.json(apis);
  } catch (err) {
    res.status(500).json({ message: "Error fetching APIs" });
  }
};

// Revoke API Key
export const revokeApiKey = async (req, res) => {
  try {
    const { apiId, key } = req.body;

    const api = await Api.findById(apiId);

    if (!api) return res.status(404).json({ message: "API not found" });

    api.apiKeys = api.apiKeys.filter((k) => k !== key);

    await api.save();

    res.json({ message: "API key revoked" });
  } catch (err) {
    res.status(500).json({ message: "Error revoking key" });
  }
};