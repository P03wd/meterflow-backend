import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  apiKey: String,
  endpoint: String,
  status: Number,     // ✅ ADD THIS
  latency: Number,    // ✅ ADD THIS
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Usage", usageSchema);