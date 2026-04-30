import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  apiKey: String,
  endpoint: String,
  status: Number,
  latency: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.UsageLog || mongoose.model("UsageLog", usageSchema);