import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "default-user",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  }
});

// ✅ FIXED LINE
export default mongoose.models.ApiKey || mongoose.model("ApiKey", apiKeySchema);