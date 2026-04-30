import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  amount: Number,
  status: { type: String, default: "pending" },

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);