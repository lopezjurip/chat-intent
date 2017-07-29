const bb = require("bot-brother");
const Bluebird = require("bluebird");
const redis = require("redis");

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

module.exports = function createSessionManager(config) {
  if (config.get("SESSION") === "REDIS") {
    const client = redis.createClient({
      port: config.get("REDIS:PORT"),
      host: config.get("REDIS:HOST"),
      password: config.get("REDIS:PASSWORD") || undefined,
    });
    return bb.sessionManager.redis({ client });
  } else if (config.get("SESSION") === "MEMORY") {
    return bb.sessionManager.memory();
  } else {
    throw new Error("Unknown session manager storage.");
  }
};
