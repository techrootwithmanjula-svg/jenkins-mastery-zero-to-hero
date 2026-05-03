const { createClient } = require("redis");
const env = require("./env.config");
const { info, warn } = require("../core/utils/logger.util");

let redisClient = null;

const getRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  if (!env.redisUrl) {
    warn("REDIS_URL is not set. Redis client bootstrap skipped.");
    return null;
  }

  redisClient = createClient({ url: env.redisUrl });

  redisClient.on("error", (error) => {
    warn("Redis client error", { reason: error.message });
  });

  redisClient.on("connect", () => {
    info("Redis client connected");
  });

  return redisClient;
};

module.exports = {
  getRedisClient
};
