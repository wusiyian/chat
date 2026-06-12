// ============================================
// 新增文件：配置全局 API 地址
// ============================================

// 获取 API 基础 URL
const getApiUrl = () => {
    // 生产环境使用云服务器地址
    if (process.env.NODE_ENV === 'production') {
        return 'http://120.26.160.97:5000'
    }
    // 开发环境使用本地（配合 proxy 或直接使用）
    return 'http://localhost:5000'
}

export const API_URL = getApiUrl()
export const SOCKET_URL = getApiUrl()