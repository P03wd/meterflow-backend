import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.log("Redis error:", err);
  });
} else {
  console.log("Redis disabled (no REDIS_URL)");
}

export default redis;