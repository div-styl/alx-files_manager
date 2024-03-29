import redisClient from "./redis.js";
import dbClient from "./db.js";

const userUtils = {
  async getUserIdAndKey(req) {
    const obj = {
      userId: null,
      key: null,
    };
    const xToken = req.header("X-Token");

    if (!xToken) {
      return obj;
    }
    obj.key = `auth_${xToken}`;
    obj.userId = await redisClient.get(obj.key);
    return obj;
  },

  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },
};

export default userUtils;
