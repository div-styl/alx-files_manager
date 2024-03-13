import { v4 as uuidv4 } from "uuid";
import sha1 from "sha1";
import redisClient from "../utils/redis.js";
import userUtils from "../utils/user.js";

class AuthController {
  static async getConnect(req, res) {
    const auth = req.header("Authorization") || "";
    const credentials = auth.split(" ")[1];
    if (!credentials) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const decodedCredentials = Buffer.from(credentials, "base64").toString(
      "utf-8"
    );
    const [email, password] = decodedCredentials.split(":");

    if (!email || !password) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const sh1pwd = sha1(password);

    const user = await userUtils.getUser({
      email,
      password: sh1pwd,
    });
    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    const hoursexpire = 24;

    await redisClient.set(key, user._id.toString(), hoursexpire * 3600);
    return res.status(200).send({
      token,
    });
  }

  static async getDisconnect(req, res) {
    const { userId, key } = await userUtils.getUserIdAndKey(req);

    if (!userId) return res.status(401).send({ error: "Unauthorized" });

    await redisClient.del(key);

    return res.status(204).send();
  }
}

export default AuthController;
