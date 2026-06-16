const Redis = require("ioredis");
const { error } = require("node:console");

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "",
    db: 0,
    connectTimeout: 10000,
    retryStrategy: (times) => {
        if (times > 10) {
            console.log("redis 连接失败，停止重试");
            return null
        }
        return Math.min(times * 50, 2000)
    },
    maxRetriesPerRequest: 3
})

redis.on("connect", () => {
    console.log("redis连接成功");
})

redis.on("error", (error) => {
    console.log("redis连接错误：", error.message);
})
redis.on("close", () => {
    console.log("redis连接关闭");
})
redis.on("reconnecting", () => {
    console.log("redis重连中");
})

module.exports = redis