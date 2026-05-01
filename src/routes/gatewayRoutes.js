import express from "express";
import getPokemon from "../controllers/pokemonController.js";
import { createApiKey } from "../controllers/apiKeyController.js";
import getUsageStats from "../controllers/usageController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import rateLimitMiddleware from "../middleware/rateLimitMiddleware.js";
import usageMiddleware from "../middleware/usageMiddleware.js";
import apiKeyMiddleware from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

// 🔐 AUTH ONLY
router.post("/create-key", authMiddleware, createApiKey);

// 🔓 PUBLIC USAGE
router.get("/usage", getUsageStats);

// 🔥 PROTECTED ROUTES START HERE
router.use(apiKeyMiddleware);
router.use(rateLimitMiddleware);
router.use(usageMiddleware);

// 🔥 MAIN API
router.get("/pokemon/:name", getPokemon);

export default router;