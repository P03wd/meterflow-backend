import axios from "axios";
import Api from "../models/Api.js";
import UsageLog from "../models/UsageLog.js";

export const proxyRequest = async (req, res) => {
  try {
    const api = await Api.findById(req.apiKey.apiId);

    const targetUrl = api.baseUrl + req.path;

    const start = Date.now();

    const response = await axios({
      method: req.method,
      url: targetUrl
    });

    const latency = Date.now() - start;

    await UsageLog.create({
      apiKey: req.apiKey.key,
      endpoint: req.path,
      status: response.status,
      latency
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Gateway error" });
  }
};