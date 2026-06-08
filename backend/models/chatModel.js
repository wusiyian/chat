const mongoose = require("mongoose")

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },//名称
        isGroupChat: { type: Boolean, default: false },//是否群组
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],//用户
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },//最新消息
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },//管理
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatModel)

module.exports = Chat;