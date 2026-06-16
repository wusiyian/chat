import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])

    const history = useHistory()

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
        setUser(userInfo)
        setIsLoading(false)
        if (!userInfo) {
            history.push("/")
        }
    }, [history])

    //备用方案
    // useEffect(() => {
    //     if (!user || !user.token) return
    //     const fetchOfflineMessage = async () => {
    //         try {
    //             const config = {
    //                 headers: {
    //                     Authorization: `Bearer ${user.token}`
    //                 }
    //             };
    //             const { data } = await axios.get("/api/message/offline", config)

    //             if (data.messages && data.messages.length > 0) {
    //                 console.log(`📨 [备用] 拉取到 ${data.messages.length} 条离线消息`);

    //                 setNotification(prev => {
    //                     const existingIds = new Set(prev.map(n => n._id))
    //                     const newMessages = data.messages.filter(m => !existingIds.has(m._id))
    //                     return [...newMessages, ...prev]
    //                 })
    //             }
    //         } catch (error) {
    //             console.error("❌ 拉取离线消息失败:", error);
    //         }
    //     }

    //     const timer = setTimeout(fetchOfflineMessage, 3000)
    //     return () => clearTimeout(timer)
    // }, [user])

    return <ChatContext.Provider value={{
        user,
        setUser,
        isLoading,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification
    }}>{children}</ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider