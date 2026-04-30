import mongoose from "mongoose";

const apiSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    baseUrl: String,
    status: {
      type: String,
      default: "active",
    },
    apiKeys: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Api", apiSchema);