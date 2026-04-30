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

app.use(cors({
  origin: "http://localhost:3000"
}));

// ===============================
// ✅ ROUTE ORDER (VERY IMPORTANT)
// ===============================

// 🔐 AUTH (no rate limit)
app.use("/api/auth", authRoutes);

// 💰 BILLING (no rate limit)
app.use("/api/billing", billingRoutes);

// 💳 PAYMENT (no rate limit)
app.use("/api/payment", paymentRoutes);

// 🚀 API GATEWAY (rate limit ONLY here)
app.use("/api", gatewayRoutes);

// ===============================

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

// ✅ DATABASE
const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  await redisClient.set("test", "working");
  console.log("Redis Test:", await redisClient.get("test"));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();