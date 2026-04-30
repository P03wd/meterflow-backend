import UsageLog from "../models/UsageLog.js";
import Billing from "../models/Billing.js";

export const calculateBilling = async (userId) => {
  const logs = await UsageLog.find();

  const total = logs.length;

  const amount = (total / 100) * 0.5;

  return Billing.create({
    userId,
    totalRequests: total,
    amount
  });
};