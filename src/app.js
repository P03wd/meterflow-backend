import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import gatewayRoutes from "./routes/gatewayRoutes.js";

const app = express();

// 🔥 Connect DB
connectDB();

// 🔥 Middlewares
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

// 🔥 Routes
app.use("/api/auth", authRoutes);
app.use("/api/apis", apiRoutes);

// ✅ IMPORTANT: Use /api (not /gateway)
app.use("/api", gatewayRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

export default app;