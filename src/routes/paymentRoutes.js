import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import apiKeyMiddleware from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, apiKeyMiddleware, createOrder);
router.post("/verify", authMiddleware, apiKeyMiddleware, verifyPayment);

export default router;