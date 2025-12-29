# AI 创想工坊 | Multi-Modal AI Platform

一站式多模态 AI 创作平台，集成最新的 Gemini 3 和 OpenAI GPT-5.2 模型。

## ✨ 功能特色

### 🎨 图像生成
- **Nano Banana Pro** (`gemini-3-pro-image-preview`) - 专业级图像生成，支持 4K 输出
- **Gemini 3 Flash Preview** (`gemini-3-flash-preview`) - 快速图像生成
- **DALL·E 3** - OpenAI 创意图像生成

### 💬 智能对话
- **Gemini 3 Pro Preview** (`gemini-3-pro-preview`) - 最强推理能力
- **Gemini 3 Flash Preview** (`gemini-3-flash-preview`) - 快速响应
- **GPT-5.2** - OpenAI 最新旗舰模型
- **GPT-5.2 Mini** - 经济高效

### 👁️ 视觉理解
- **Gemini 3 Pro/Flash Preview** - 多模态理解与分析
- **GPT-5.2** - 视觉分析

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
   - [Google AI Studio](https://aistudio.google.com/apikey) - 获取 Gemini API Key
   - [OpenAI Platform](https://platform.openai.com/api-keys) - 获取 OpenAI API Key

2. 在网页中配置 API 密钥，密钥会安全保存在浏览器本地存储中

## 📝 模型说明

### Gemini 3 系列 (最新)
| 模型 | API 名称 | 说明 |
|------|----------|------|
| Gemini 3 Pro Preview | `gemini-3-pro-preview` | 最强推理和多模态能力 |
| Nano Banana Pro | `gemini-3-pro-image-preview` | 专业级图像生成和编辑 |
| Gemini 3 Flash Preview | `gemini-3-flash-preview` | 快速响应 |

### OpenAI GPT-5.2 系列 (最新)
| 模型 | API 名称 | 说明 |
|------|----------|------|
| GPT-5.2 | `gpt-5.2` | 最新旗舰模型 |
| GPT-5.2 Mini | `gpt-5.2-mini` | 经济高效 |

## 📄 License

MIT License
