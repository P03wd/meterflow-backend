import express from "express";
import getPokemon from "../controllers/pokemonController.js";
import { createApiKey } from "../controllers/apiKeyController.js";
import getUsageStats from "../controllers/usageController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import rateLimitMiddleware from "../middleware/rateLimitMiddleware.js";
import usageMiddleware from "../middleware/usageMiddleware.js";
import apiKeyMiddleware from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

// 🔐 JWT ONLY for API KEY creation
router.post("/create-key", authMiddleware, createApiKey);

// ✅ 🔥 USAGE (NO RATE LIMIT — IMPORTANT)
router.get("/usage", apiKeyMiddleware, getUsageStats);

// 🔥 APPLY MIDDLEWARE ONLY AFTER USAGE
router.use(apiKeyMiddleware);       // 1️⃣ validate API key
router.use(rateLimitMiddleware);   // 2️⃣ rate limit
router.use(usageMiddleware);       // 3️⃣ track usage

// 🔥 MAIN API (RATE LIMITED)
router.get("/pokemon/:name", getPokemon);

export default router;