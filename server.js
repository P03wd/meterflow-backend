import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import redisClient from "./src/config/redis.js";

// ✅ ROUTES
import authRoutes from "./src/routes/authRoutes.js";
import billingRoutes from "./src/routes/billingRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import gatewayRoutes from "./src/routes/gatewayRoutes.js";

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ CORS (allow deployed frontend + local)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app" // 🔁 replace with your real Vercel URL
  ],
  credentials: true
}));

// ===============================
// ✅ ROUTES
// ===============================

// 🔐 AUTH
app.use("/api/auth", authRoutes);

// 💰 BILLING
app.use("/api/billing", billingRoutes);

// 💳 PAYMENT
app.use("/api/payment", paymentRoutes);

// 🚀 API GATEWAY
app.use("/api", gatewayRoutes);

// ===============================

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

// ✅ DATABASE CONNECTION
const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
};

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // ✅ Safe Redis usage
  if (redisClient) {
    try {
      await redisClient.set("test", "working");
      const value = await redisClient.get("test");
      console.log("Redis Test:", value);
    } catch (err) {
      console.log("Redis not available:", err.message);
    }
  } else {
    console.log("Redis disabled (no REDIS_URL)");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();