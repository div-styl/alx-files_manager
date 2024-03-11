import * as redis from "redis";
import { promisify } from "util";

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.client.on("error", (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
    // this.client.on("connect", () => {
    //   console.log("Redis client connected to the server");
    // });
  }
  isAlive() {
    return this.client.connected;
  }
  async get(key) {
    return await this.getAsync(key);
  }
  async set(key, value, duration) {
    await this.setAsync(key, value);
    await this.client.expire(key, duration);
  }
  async del(key) {
    this.client.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
