import Razorpay from "razorpay";
import crypto from "crypto";
import ApiKey from "../models/apiKey.js";

// 🔥 Create order
export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: 50000, // ₹500
      currency: "INR",
      receipt: "order_rcptid_1"
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};


// 🔥 Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // ✅ GET API KEY FROM MIDDLEWARE
      const apiKey = req.apiKey.key;

      // ✅ UPGRADE USER PLAN
      await ApiKey.findOneAndUpdate(
        { key: apiKey },
        { plan: "pro" }
      );

      return res.json({
        message: "Payment successful, upgraded to PRO"
      });

    } else {
      return res.status(400).json({
        message: "Invalid signature"
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};