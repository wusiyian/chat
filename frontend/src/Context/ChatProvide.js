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