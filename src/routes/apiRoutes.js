import express from "express";
import {
  createApi,
  getApis,
  revokeApiKey,
} from "../controllers/apiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// must be logged in
router.use(authMiddleware);

// create API
router.post("/create", createApi);

// list APIs
router.get("/list", getApis);

// revoke key
router.post("/revoke-key", revokeApiKey);

export default router;