import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    apiKey: String,
    userId: String,

    totalRequests: {
      type: Number,
      default: 0,
    },

    costPerRequest: {
      type: Number,
      default: 0.01, // ₹ or $
    },

    totalCost: {
      type: Number,
      default: 0,
    },

    period: {
      type: String,
      default: "monthly",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Billing", billingSchema);