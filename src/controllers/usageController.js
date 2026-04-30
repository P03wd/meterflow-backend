import Usage from "../models/usage.js";

const getUsageStats = async (req, res) => {
  try {
    // 🔥 Total API requests
    const totalRequests = await Usage.countDocuments();

    // 🔥 Top endpoints
    const topEndpoints = await Usage.aggregate([
      {
        $group: {
          _id: "$endpoint",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 🔥 Average latency
    const avgResult = await Usage.aggregate([
      {
        $group: {
          _id: null,
          avgLatency: { $avg: "$latency" }
        }
      }
    ]);

    // ✅ SAFE HANDLING
    let avgLatency = 0;

    if (
      avgResult &&
      avgResult.length > 0 &&
      avgResult[0].avgLatency !== null &&
      avgResult[0].avgLatency !== undefined
    ) {
      avgLatency = avgResult[0].avgLatency;
    }

    // 🔥 NEW: Recent requests (for chart)
    const recentRequests = await Usage.find()
      .sort({ timestamp: -1 })
      .limit(10);

    // ✅ FINAL RESPONSE (ADD HERE)
    res.json({
      totalRequests,
      topEndpoints,
      avgLatency: Number(avgLatency.toFixed(2)),
      recentRequests   // 👈 ADDED
    });

  } catch (err) {
    console.error("Usage Controller Error:", err);
    res.status(500).json({
      message: "Error fetching usage stats"
    });
  }
};

export default getUsageStats;