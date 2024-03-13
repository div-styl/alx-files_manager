import redis from "redis";
import { promisify } from "util";

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on("error", (error) => {
      console.log(`Redis client not connected to the server: ${error}`);
    });

    this.client.on("connect", () => {
      console.log("Redis client connected to the server");
    });
  }

  isAlive() {
    return this.client.connected;
  }

  waitForConnect() {
    return new Promise((resolve, reject) => {
      this.client.on("connect", resolve);
      this.client.on("error", reject);
    });
  }

  async get(key) {
    await this.waitForConnect();
    const value = await this.getAsync(key);
    return value;
  }

  async set(key, value, duration) {
    await this.waitForConnect();
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async del(key) {
    await this.waitForConnect();
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
