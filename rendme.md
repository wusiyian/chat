# Talk-A-Tive

一个基于 React + Node.js 的实时聊天应用。

---

## 📦 版本历史

### v1.1.0 (2026-06-16)

#### ✨ 新增功能

- **离线消息提醒**
  - 当用户离线时收到的消息，会在用户重新上线后自动推送提醒
  - 支持多条离线消息批量推送
  - 离线消息存储在 Redis 中，有效期 7 天
  - 用户上线后自动清除已读的离线消息

#### 🐛 Bug 修复

- 修复注册页面密码不一致时按钮持续加载的问题
- 修复 `SingleChat` 中 `newMessage` 初始值为 `undefined` 导致的 React 受控组件警告

#### 🔧 技术改进

- 引入 Redis 作为离线消息缓存中间件
- 新增 `offlineMessageService` 服务层，统一管理离线消息的存储与读取
- Socket 连接优化：用户上线时自动检测并推送离线消息
- 前端新增 `offline messages` 事件监听，实时接收离线消息通知

#### 📦 新增依赖

- `ioredis`：Redis 客户端

---

### v1.0.2 (2026-06-15)

#### 🐛 Bug 修复

- 修复注册页面密码不一致时按钮持续加载的问题

---

### v1.0.1 (2026-06-15)

#### 🐛 Bug 修复

- 修复 CORS 跨域配置问题，支持云服务器 IP 访问
- 修复 Socket.io 连接地址配置，支持生产环境动态切换

---

### v1.0.0 (2026-06-14)

#### 🎉 初始版本

- 用户注册与登录（JWT 认证）
- 实时一对一聊天（Socket.io）
- 群组聊天（创建、重命名、增删成员）
- 用户搜索与添加好友
- 消息通知（未读消息提醒）
- 头像上传（Cloudinary 图床）
- 响应式界面（Chakra UI）

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- MongoDB >= 6.0.0
- Redis >= 5.0.0（v1.1.0 新增）

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd talk-a-tive

# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 MongoDB URI 和 JWT Secret

# 启动 Redis（v1.1.0 新增）
# Docker
docker run -d -p 6379:6379 --name redis redis
# 或本地安装
redis-server

# 开发模式运行
npm run server          # 启动后端 (nodemon)
cd frontend && npm start  # 启动前端 (React)

# 生产模式构建
npm run build           # 构建前端
npm run start:prod      # 启动生产环境服务