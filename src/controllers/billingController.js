import Usage from "../models/Usage.js";
import Billing from "../models/Billing.js";

// 🔥 GET BILLING (AUTO CALCULATED)
export const getBilling = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const userId = req.user.id;

    // ✅ STEP 1: Monthly filter
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usageCount = await Usage.countDocuments({
      apiKey,
      timestamp: { $gte: startOfMonth }
    });

    // ✅ STEP 2: Free tier logic
    const FREE_LIMIT = 1000;
    const COST_PER_REQUEST = 0.01;

    let totalCost = 0;

    if (usageCount > FREE_LIMIT) {
      totalCost = (usageCount - FREE_LIMIT) * COST_PER_REQUEST;
    }

    // ✅ STEP 3: Save or update billing
    let billing = await Billing.findOne({ apiKey });

    if (billing) {
      billing.totalRequests = usageCount;
      billing.totalCost = totalCost;
      billing.costPerRequest = COST_PER_REQUEST;
      billing.period = "monthly";
      await billing.save();
    } else {
      billing = await Billing.create({
        userId,
        apiKey,
        totalRequests: usageCount,
        totalCost,
        costPerRequest: COST_PER_REQUEST,
        period: "monthly"
      });
    }

    res.json(billing);

  } catch (err) {
    console.error("Billing Error:", err);
    res.status(500).json({
      message: "Error fetching billing"
    });
  }
};