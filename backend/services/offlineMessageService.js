const redis = require("../config/redis")

const OFFLINE_PREFIX = "offline:"
const OFFLINE_COUNT_PREFIX = "offline:count:"

const storeOfflineMessage = async (userId, message) => {
    try {
        const key = `${OFFLINE_PREFIX}${userId}`
        const countKey = `${OFFLINE_COUNT_PREFIX}${userId}`

        await redis.lpush(key, JSON.stringify(message))
        await redis.incr(countKey)
        await redis.expire(key, 60 * 60 * 24 * 7)
        await redis.expire(countKey, 60 * 60 * 24 * 7)

        console.log(`📦 存储离线消息给用户 ${userId}`)
        return true
    } catch (error) {
        console.log("存储离线消息失败：", error);
        return false
    }
}

const getOfflineMessages = async (userId) => {
    try {
        const key = `${OFFLINE_PREFIX}${userId}`
        const message = await redis.lrange(key, 0, -1)

        if (message.length === 0) {
            return []
        }

        return message.map(msg => JSON.parse(msg)).reverse()
    } catch (error) {
        console.log("获取离线消息失败：", error);
        return []
    }
}

const getOfflineMessageCount = async (userId) => {
    try {
        const countKey = `${OFFLINE_COUNT_PREFIX}${userId}`
        const count = await redis.get(countKey)
        return parseInt(count) || 0
    } catch (error) {
        console.log("获取离线消息数量失败：", error);
        return 0
    }
}

const clearOfflineMessages = async (userId) => {
    try {
        const key = `${OFFLINE_PREFIX}${userId}`
        const countKey = `${OFFLINE_COUNT_PREFIX}${userId}`

        await redis.del(key)
        await redis.del(countKey)

        console.log(`📦 清除用户 ${userId} 的离线消息`)
        return true
    } catch (error) {
        console.log("清除离线消息失败:", error);
        return false
    }
}

module.exports = {
    storeOfflineMessage,
    getOfflineMessages,
    getOfflineMessageCount,
    clearOfflineMessages
}