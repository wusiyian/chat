const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')
const cors = require('cors')
const redis = require("./config/redis")
const offlineMessageService = require("./services/offlineMessageService")

dotenv.config()
connectDB()
const app = express()

app.use(express.json())//接受json数据

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://120.26.160.97:3000'
]

// 方式一：动态判断（推荐）
app.use(cors({
    origin: function (origin, callback) {
        // 允许没有 origin 的请求（如 Postman）
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('CORS not allowed'))
        }
    },
    credentials: true
}))

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "/frontend/build")))
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend/build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is Running Successfully")
    })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(5000, console.log(`server started on port ${PORT}`))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
})

const onlineUsers = new Map()

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', async (userData) => {
        if (!userData || !userData._id) {
            console.log("setup 事件缺少用户数据");
            return
        }

        socket.join(userData._id)
        onlineUsers.set(userData._id, socket.id)
        console.log(`👤 用户 ${userData.name || userData._id} 上线，在线用户数: ${onlineUsers.size}`)

        try {
            const offlineCount = await offlineMessageService.getOfflineMessageCount(userData._id)
            if (offlineCount > 0) {
                console.log(`📨 用户有 ${offlineCount} 条离线消息`)
                const offlineMessages = await offlineMessageService.getOfflineMessages(userData._id)
                if (offlineMessages.length > 0) {
                    socket.emit("offline messages", offlineMessages)
                    await offlineMessageService.clearOfflineMessages(userData._id)
                }
            }
        } catch (error) {
            console.error("❌ 处理离线消息失败:", error)
        }
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log("user joined room" + room);
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on("new message", async (newMessageRecieved) => {
        try {
            const chat = newMessageRecieved.chat

            if (!chat.users || !chat) return console.log("消息缺少 chat 数据");
            console.log(`💬 新消息: ${newMessageRecieved.content?.substring(0, 30) || ''}...`)

            for (const user of chat.users) {
                if (user._id == newMessageRecieved.sender._id) continue

                const isOnline = onlineUsers.has(user._id)

                if (isOnline) {
                    socket.in(user._id).emit("message recieved", newMessageRecieved)
                    console.log(`📤 推送给在线用户 ${user._id}`)
                } else {
                    await offlineMessageService.storeOfflineMessage(user._id, newMessageRecieved)
                    console.log(`💾 存入 Redis，等待用户 ${user._id} 上线`)
                }
            }
        } catch (error) {
            console.error("❌ 处理新消息失败:", error)
        }
    })

    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId)
                console.log(`👋 用户 ${userId} 断开连接，在线用户数: ${onlineUsers.size}`)
                break
            }
        }
    })

    socket.off("setup", () => {
        socket.leave(userData._id)
    })

})