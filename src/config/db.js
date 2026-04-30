import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env inside this file too (important)
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("Connecting to:", uri);

    await mongoose.connect(uri);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;