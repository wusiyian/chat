// ============================================
// 新增文件：配置全局 axios 默认值
// ============================================

import axios from 'axios'
import { API_URL } from './api'

// 设置 axios 全局基础 URL
axios.defaults.baseURL = API_URL

export default axios