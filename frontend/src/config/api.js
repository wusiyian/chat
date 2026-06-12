// 配置全局 API 地址

const getApiUrl = () => {
    // 生产环境：使用云服务器的 5000 端口
    if (process.env.NODE_ENV === 'production') {
        return 'http://120.26.160.97:5000'
    }
    // 开发环境：使用本地 5000 端口
    return 'http://localhost:5000'
}

// 优先使用环境变量
export const API_URL = process.env.REACT_APP_API_URL || getApiUrl()
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || getApiUrl()