import express from "express";
import { getBilling } from "../controllers/billingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 BILLING (JWT ONLY — NO RATE LIMIT)
router.get("/get", authMiddleware, getBilling);

export default router;