# Talk-A-Tive

一个基于 React + Node.js 的实时聊天应用。

---

## 📦 版本历史

### v1.0.2 (2026-06-16)

#### 🐛 Bug 修复

- **修复注册页面密码不一致时按钮持续加载的问题**
  - 当用户注册时输入的密码与确认密码不一致，提交按钮会卡在加载状态无法恢复
  - 现已修复：密码验证失败后会正确重置按钮状态，用户可以重新尝试提交

#### 📝 技术细节

- 文件：`frontend/src/components/Authentication/Signup.js`
- 修复方式：在密码不一致的分支中添加 `setLoading(false)` 重置加载状态

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

### 安装与运行

```bash

# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 MongoDB URI 和 JWT Secret

# 开发模式运行
npm run server          # 启动后端 (nodemon)
cd frontend && npm start  # 启动前端 (React)

# 生产模式构建
npm run build           # 构建前端
npm run start:prod      # 启动生产环境服务