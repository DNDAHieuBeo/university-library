import config from "@/lib/config";
import { Redis } from "@upstash/redis";


const redis = new Redis({
    url: config.env.upStash.redisUrl,
    token: config.env.upStash.redisToken,
});

export default redis