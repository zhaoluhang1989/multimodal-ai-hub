# AI 创想工坊 | Multi-Modal AI Platform

一站式多模态 AI 创作平台，集成最新的 Gemini 和 OpenAI 模型。

## ✨ 功能特色

### 🎨 图像生成
- **Nano Banana 2.5 Flash** - Gemini 2.5 快速图像生成
- **Nano Banana Pro 3.0** - 专业级 4K 图像生成
- **Imagen 3** - Google 高质量图像生成
- **DALL·E 3** - OpenAI 创意图像生成

### 💬 智能对话
- **Gemini 2.5 Flash** - 快速响应
- **Gemini 2.5 Pro** - 专业能力
- **Gemini 3.0 Flash** - 最新预览版
- **GPT-4.1** - OpenAI 最新旗舰
- **GPT-4o** - 多模态模型
- **o3-mini** - 推理模型

### 👁️ 视觉理解
- **Gemini 2.5 Flash/Pro** - 多模态理解与分析
- **GPT-4.1 / GPT-4o** - 视觉分析

## 🚀 快速开始

### 本地运行
```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/multimodal-ai-hub.git
cd multimodal-ai-hub

# 使用 Python 启动本地服务器
python3 -m http.server 8080

# 或使用 Node.js
npx serve
```

访问 http://localhost:8080

### 部署到 GitHub Pages

1. 在 GitHub 创建新仓库 `multimodal-ai-hub`
2. 推送代码：
```bash
git remote add origin https://github.com/YOUR_USERNAME/multimodal-ai-hub.git
git push -u origin main
```
3. 进入仓库 Settings → Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`，目录选择 `/ (root)`
6. 保存，等待几分钟即可访问

## 🔧 配置

1. 获取 API 密钥：
   - [Google AI Studio](https://makersuite.google.com/app/apikey) - 获取 Gemini API Key
   - [OpenAI Platform](https://platform.openai.com/api-keys) - 获取 OpenAI API Key

2. 在网页中配置 API 密钥，密钥会安全保存在浏览器本地存储中

## 📝 更新日志

### v1.0.0 (2024-12-29)
- 支持最新 Gemini 2.5/3.0 系列模型
- 集成 Nano Banana 图像生成
- 支持 OpenAI GPT-4.1 和 o3-mini
- Apple 发布会风格 UI 设计
- 科技渐变视觉效果

## 📄 License

MIT License
