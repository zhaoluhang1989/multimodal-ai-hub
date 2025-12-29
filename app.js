/**
 * AI 创想工坊 - 多模态 AI 应用平台
 * 支持 Gemini、OpenAI 等多种 AI 服务
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========== 状态管理 ==========
    const state = {
        geminiKey: localStorage.getItem('gemini_api_key') || '',
        openaiKey: localStorage.getItem('openai_api_key') || '',
        apiType: localStorage.getItem('api_type') || 'free',
        currentFeature: 'image-gen',
        imageModel: { provider: 'gemini', model: 'gemini-2.5-flash-preview-image' },
        chatModel: { provider: 'gemini', model: 'gemini-2.5-flash' },
        visionModel: { provider: 'gemini', model: 'gemini-2.5-flash' },
        imageRatio: '1:1',
        imageCount: 1,
        chatHistory: [],
        uploadedImage: null
    };

    // ========== DOM 元素 ==========
    const elements = {
        // API 配置
        geminiKeyInput: document.getElementById('gemini-key'),
        openaiKeyInput: document.getElementById('openai-key'),
        geminiStatus: document.getElementById('gemini-status'),
        openaiStatus: document.getElementById('openai-status'),
        saveKeysBtn: document.getElementById('save-keys'),
        clearKeysBtn: document.getElementById('clear-keys'),
        toggleConfigBtn: document.getElementById('toggle-config'),
        configContent: document.getElementById('config-content'),

        // 功能选项卡
        featureTabs: document.querySelectorAll('.feature-tab'),

        // 图像生成
        imagePanel: document.getElementById('image-gen-panel'),
        imageModelCards: document.querySelectorAll('#image-model-selector .model-card'),
        ratioBtns: document.querySelectorAll('#ratio-selector .ratio-btn'),
        imageCountInput: document.getElementById('image-count'),
        qtyMinusBtn: document.getElementById('qty-minus'),
        qtyPlusBtn: document.getElementById('qty-plus'),
        imagePrompt: document.getElementById('image-prompt'),
        enhancePromptBtn: document.getElementById('enhance-prompt'),
        clearPromptBtn: document.getElementById('clear-prompt'),
        generateImageBtn: document.getElementById('generate-image-btn'),
        imageStatus: document.getElementById('image-status'),
        galleryGrid: document.getElementById('gallery-grid'),
        clearGalleryBtn: document.getElementById('clear-gallery'),

        // 智能对话
        chatPanel: document.getElementById('chat-panel'),
        chatModelCards: document.querySelectorAll('#chat-model-selector .model-card'),
        chatMessages: document.getElementById('chat-messages'),
        chatInput: document.getElementById('chat-input'),
        sendMessageBtn: document.getElementById('send-message-btn'),

        // 视觉理解
        visionPanel: document.getElementById('vision-panel'),
        visionModelCards: document.querySelectorAll('#vision-model-selector .model-card'),
        uploadZone: document.getElementById('upload-zone'),
        visionImageInput: document.getElementById('vision-image'),
        uploadPlaceholder: document.getElementById('upload-placeholder'),
        uploadPreview: document.getElementById('upload-preview'),
        previewImage: document.getElementById('preview-image'),
        removeImageBtn: document.getElementById('remove-image'),
        visionPrompt: document.getElementById('vision-prompt'),
        analyzeImageBtn: document.getElementById('analyze-image-btn'),
        visionStatus: document.getElementById('vision-status'),
        visionResult: document.getElementById('vision-result'),
        visionResultContent: document.getElementById('vision-result-content'),

        // 设置
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        closeSettingsBtn: document.getElementById('close-settings'),
        apiTypeBtns: document.querySelectorAll('.api-type-btn'),

        // Toast
        toast: document.getElementById('toast')
    };

    // ========== 初始化 ==========
    function init() {
        // 恢复保存的 API 密钥
        if (state.geminiKey) {
            elements.geminiKeyInput.value = state.geminiKey;
            updateApiStatus('gemini', true);
        }
        if (state.openaiKey) {
            elements.openaiKeyInput.value = state.openaiKey;
            updateApiStatus('openai', true);
        }

        // 恢复 API 类型
        elements.apiTypeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === state.apiType);
        });

        // 绑定事件
        bindEvents();
    }

    // ========== 事件绑定 ==========
    function bindEvents() {
        // API 配置
        elements.saveKeysBtn.addEventListener('click', saveApiKeys);
        elements.clearKeysBtn.addEventListener('click', clearApiKeys);
        elements.toggleConfigBtn.addEventListener('click', toggleConfig);

        // 功能选项卡
        elements.featureTabs.forEach(tab => {
            tab.addEventListener('click', () => switchFeature(tab.dataset.feature));
        });

        // 图像生成模型选择
        elements.imageModelCards.forEach(card => {
            card.addEventListener('click', () => selectModel('image', card));
        });

        // 比例选择
        elements.ratioBtns.forEach(btn => {
            btn.addEventListener('click', () => selectRatio(btn));
        });

        // 数量控制
        elements.qtyMinusBtn.addEventListener('click', () => adjustCount(-1));
        elements.qtyPlusBtn.addEventListener('click', () => adjustCount(1));

        // 提示词操作
        elements.enhancePromptBtn.addEventListener('click', enhancePrompt);
        elements.clearPromptBtn.addEventListener('click', () => {
            elements.imagePrompt.value = '';
        });

        // 生成图像
        elements.generateImageBtn.addEventListener('click', generateImages);
        elements.clearGalleryBtn.addEventListener('click', clearGallery);

        // 对话模型选择
        elements.chatModelCards.forEach(card => {
            card.addEventListener('click', () => selectModel('chat', card));
        });

        // 发送消息
        elements.sendMessageBtn.addEventListener('click', sendChatMessage);
        elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });

        // 视觉理解模型选择
        elements.visionModelCards.forEach(card => {
            card.addEventListener('click', () => selectModel('vision', card));
        });

        // 图片上传
        elements.uploadZone.addEventListener('click', () => elements.visionImageInput.click());
        elements.uploadZone.addEventListener('dragover', handleDragOver);
        elements.uploadZone.addEventListener('dragleave', handleDragLeave);
        elements.uploadZone.addEventListener('drop', handleDrop);
        elements.visionImageInput.addEventListener('change', handleImageSelect);
        elements.removeImageBtn.addEventListener('click', removeUploadedImage);

        // 分析图像
        elements.analyzeImageBtn.addEventListener('click', analyzeImage);

        // 设置
        elements.settingsBtn.addEventListener('click', () => toggleModal(true));
        elements.closeSettingsBtn.addEventListener('click', () => toggleModal(false));
        elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === elements.settingsModal) toggleModal(false);
        });

        elements.apiTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.apiTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.apiType = btn.dataset.type;
                localStorage.setItem('api_type', state.apiType);
                showToast(`已切换至${btn.dataset.type === 'paid' ? '付费' : '免费'}版 API`, 'success');
            });
        });
    }

    // ========== API 配置功能 ==========
    function saveApiKeys() {
        const geminiKey = elements.geminiKeyInput.value.trim();
        const openaiKey = elements.openaiKeyInput.value.trim();

        if (geminiKey) {
            localStorage.setItem('gemini_api_key', geminiKey);
            state.geminiKey = geminiKey;
            updateApiStatus('gemini', true);
        }

        if (openaiKey) {
            localStorage.setItem('openai_api_key', openaiKey);
            state.openaiKey = openaiKey;
            updateApiStatus('openai', true);
        }

        showToast('API 密钥已保存', 'success');
    }

    function clearApiKeys() {
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('openai_api_key');
        state.geminiKey = '';
        state.openaiKey = '';
        elements.geminiKeyInput.value = '';
        elements.openaiKeyInput.value = '';
        updateApiStatus('gemini', false);
        updateApiStatus('openai', false);
        showToast('API 密钥已清除', 'success');
    }

    function updateApiStatus(provider, isActive) {
        const statusEl = provider === 'gemini' ? elements.geminiStatus : elements.openaiStatus;
        statusEl.classList.toggle('active', isActive);
        statusEl.querySelector('.status-text').textContent = isActive ? '已配置' : '未配置';
    }

    function toggleConfig() {
        elements.configContent.classList.toggle('collapsed');
        elements.toggleConfigBtn.classList.toggle('collapsed');
    }

    // ========== 功能切换 ==========
    function switchFeature(feature) {
        state.currentFeature = feature;

        // 更新选项卡状态
        elements.featureTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.feature === feature);
        });

        // 显示对应面板
        elements.imagePanel.classList.toggle('hidden', feature !== 'image-gen');
        elements.chatPanel.classList.toggle('hidden', feature !== 'chat');
        elements.visionPanel.classList.toggle('hidden', feature !== 'vision');
    }

    // ========== 模型选择 ==========
    function selectModel(type, card) {
        const container = card.closest('.model-cards');
        container.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const modelData = { provider: card.dataset.provider, model: card.dataset.model };

        switch (type) {
            case 'image':
                state.imageModel = modelData;
                break;
            case 'chat':
                state.chatModel = modelData;
                break;
            case 'vision':
                state.visionModel = modelData;
                break;
        }
    }

    // ========== 图像生成功能 ==========
    function selectRatio(btn) {
        elements.ratioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.imageRatio = btn.dataset.ratio;
    }

    function adjustCount(delta) {
        const newCount = Math.max(1, Math.min(8, state.imageCount + delta));
        state.imageCount = newCount;
        elements.imageCountInput.value = newCount;
    }

    async function enhancePrompt() {
        const prompt = elements.imagePrompt.value.trim();
        if (!prompt) {
            showToast('请先输入提示词', 'error');
            return;
        }

        if (!state.geminiKey) {
            showToast('请先配置 Gemini API 密钥', 'error');
            return;
        }

        elements.enhancePromptBtn.disabled = true;
        elements.enhancePromptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const enhanced = await callGeminiText(
                `你是一位专业的 AI 图像提示词工程师。请将以下简单描述优化为更专业、更详细的英文图像生成提示词，包含风格、光影、色彩、构图等细节。只返回优化后的英文提示词,不要加任何解释：\n\n${prompt}`,
                'gemini-2.5-flash'
            );
            elements.imagePrompt.value = enhanced;
            showToast('提示词已优化', 'success');
        } catch (error) {
            showToast('优化失败：' + error.message, 'error');
        } finally {
            elements.enhancePromptBtn.disabled = false;
            elements.enhancePromptBtn.innerHTML = '<i class="fas fa-magic"></i>';
        }
    }

    async function generateImages() {
        const prompt = elements.imagePrompt.value.trim();
        if (!prompt) {
            showToast('请输入创意描述', 'error');
            return;
        }

        const { provider, model } = state.imageModel;
        const apiKey = provider === 'gemini' ? state.geminiKey : state.openaiKey;

        if (!apiKey) {
            showToast(`请先配置 ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API 密钥`, 'error');
            return;
        }

        // 更新状态
        elements.generateImageBtn.disabled = true;
        elements.imageStatus.classList.add('loading');
        elements.imageStatus.querySelector('.status-message').textContent = '正在生成...';

        // 清空画廊并添加占位符
        elements.galleryGrid.innerHTML = '';
        for (let i = 0; i < state.imageCount; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'image-item';
            placeholder.innerHTML = '<div class="skeleton"></div>';
            elements.galleryGrid.appendChild(placeholder);
        }

        try {
            const promises = [];
            for (let i = 0; i < state.imageCount; i++) {
                if (provider === 'gemini') {
                    // 根据模型选择不同的生成方法
                    if (model === 'imagen-3.0-generate-002') {
                        promises.push(generateImageWithImagen3(apiKey, prompt, state.imageRatio));
                    } else if (model === 'gemini-2.5-flash-preview-image' || model === 'gemini-3-pro-image-preview') {
                        // Nano Banana 系列
                        promises.push(generateImageWithNanoBanana(apiKey, prompt, model));
                    } else {
                        // 默认使用 Nano Banana
                        promises.push(generateImageWithNanoBanana(apiKey, prompt, 'gemini-2.5-flash-preview-image'));
                    }
                } else {
                    promises.push(generateImageWithDalle(apiKey, prompt, state.imageRatio));
                }
            }

            const results = await Promise.all(promises);

            // 清空占位符
            elements.galleryGrid.innerHTML = '';

            let successCount = 0;
            results.forEach((result, index) => {
                if (result.success) {
                    createImageCard(result.data, prompt, state.imageRatio);
                    successCount++;
                } else {
                    console.error(`图片 ${index + 1} 生成失败:`, result.error);
                }
            });

            if (successCount === 0) {
                elements.imageStatus.querySelector('.status-message').textContent = '生成失败';
                showToast('图像生成失败，请检查 API 配置', 'error');
            } else {
                elements.imageStatus.querySelector('.status-message').textContent = `成功生成 ${successCount} 张图片`;
                showToast('创作完成！', 'success');
            }
        } catch (error) {
            console.error('生成错误:', error);
            elements.imageStatus.querySelector('.status-message').textContent = '发生错误';
            showToast('生成失败：' + error.message, 'error');
        } finally {
            elements.generateImageBtn.disabled = false;
            elements.imageStatus.classList.remove('loading');
        }
    }

    // Imagen 3 图像生成
    async function generateImageWithImagen3(apiKey, prompt, ratio) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        const body = {
            instances: [{ prompt: prompt }],
            parameters: {
                sampleCount: 1,
                aspectRatio: ratio,
                safetyFilterLevel: "BLOCK_MEDIUM_AND_ABOVE",
                personGeneration: "ALLOW_ADULT"
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error?.message || `API 错误 (${response.status})` };
            }

            if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
                return { success: true, data: data.predictions[0].bytesBase64Encoded, type: 'base64' };
            }

            return { success: false, error: '未获取到图像数据' };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    // Gemini 2.0 Flash (Nano Banana) 多模态生成 - 已替换为最新 Nano Banana
    async function generateImageWithNanoBanana(apiKey, prompt, model) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const body = {
            contents: [{
                parts: [{ text: `Generate an image: ${prompt}` }]
            }],
            generationConfig: {
                responseModalities: ["TEXT", "IMAGE"]  // 请求文本和图像输出
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error?.message || `API 错误 (${response.status})` };
            }

            // 查找图像部分
            const parts = data.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData?.mimeType?.startsWith('image/')) {
                    return {
                        success: true,
                        data: part.inlineData.data,
                        type: 'base64',
                        mimeType: part.inlineData.mimeType
                    };
                }
            }

            return { success: false, error: '模型未返回图像，请确保提示词明确要求生成图像' };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    // DALL-E 3 图像生成
    async function generateImageWithDalle(apiKey, prompt, ratio) {
        const url = 'https://api.openai.com/v1/images/generations';

        // 将比例转换为 DALL-E 支持的尺寸
        const sizeMap = {
            '1:1': '1024x1024',
            '16:9': '1792x1024',
            '9:16': '1024x1792',
            '4:3': '1024x1024'  // DALL-E 3 不支持 4:3，使用正方形
        };

        const body = {
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: sizeMap[ratio] || '1024x1024',
            quality: 'standard',
            response_format: 'b64_json'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error?.message || `API 错误 (${response.status})` };
            }

            if (data.data && data.data[0]?.b64_json) {
                return { success: true, data: data.data[0].b64_json, type: 'base64' };
            }

            return { success: false, error: '未获取到图像数据' };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    function createImageCard(imageData, prompt, ratio) {
        const card = document.createElement('div');
        card.className = 'image-item';

        const img = document.createElement('img');
        const imgSrc = `data:image/png;base64,${imageData}`;
        img.src = imgSrc;
        img.alt = prompt;

        img.onload = () => {
            card.classList.add('loaded');
        };

        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.innerHTML = `
            <span class="image-info"><i class="far fa-image"></i> ${ratio}</span>
            <button class="btn-download">
                <i class="fas fa-download"></i>
                <span>下载</span>
            </button>
        `;

        overlay.querySelector('.btn-download').addEventListener('click', (e) => {
            e.stopPropagation();
            const link = document.createElement('a');
            link.href = imgSrc;
            link.download = `AI_Image_${Date.now()}.png`;
            link.click();
            showToast('图片已保存', 'success');
        });

        card.appendChild(img);
        card.appendChild(overlay);
        elements.galleryGrid.appendChild(card);
    }

    function clearGallery() {
        elements.galleryGrid.innerHTML = '';
        showToast('画廊已清空', 'success');
    }

    // ========== 聊天功能 ==========
    async function sendChatMessage() {
        const message = elements.chatInput.value.trim();
        if (!message) return;

        const { provider, model } = state.chatModel;
        const apiKey = provider === 'gemini' ? state.geminiKey : state.openaiKey;

        if (!apiKey) {
            showToast(`请先配置 ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API 密钥`, 'error');
            return;
        }

        // 清除欢迎消息
        const welcome = elements.chatMessages.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        // 添加用户消息
        appendMessage('user', message);
        elements.chatInput.value = '';

        // 添加 AI 消息占位符
        const aiMessage = appendMessage('assistant', '...');

        try {
            let response;
            if (provider === 'gemini') {
                response = await callGeminiChat(apiKey, model, message);
            } else {
                response = await callOpenAIChat(apiKey, model, message);
            }

            aiMessage.querySelector('.message-content').textContent = response;
        } catch (error) {
            aiMessage.querySelector('.message-content').textContent = '抱歉，发生了错误：' + error.message;
        }
    }

    function appendMessage(role, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = `<div class="message-content">${content}</div>`;
        elements.chatMessages.appendChild(msgDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        return msgDiv;
    }

    async function callGeminiChat(apiKey, model, message) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const body = {
            contents: [{ parts: [{ text: message }] }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || '没有获取到回复';
    }

    async function callOpenAIChat(apiKey, model, message) {
        const url = 'https://api.openai.com/v1/chat/completions';

        const body = {
            model: model,
            messages: [{ role: 'user', content: message }],
            max_tokens: 2048
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        return data.choices?.[0]?.message?.content || '没有获取到回复';
    }

    // ========== 视觉理解功能 ==========
    function handleDragOver(e) {
        e.preventDefault();
        elements.uploadZone.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        elements.uploadZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        elements.uploadZone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    }

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    }

    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('请上传图片文件', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            state.uploadedImage = e.target.result;
            elements.previewImage.src = e.target.result;
            elements.uploadPlaceholder.classList.add('hidden');
            elements.uploadPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    function removeUploadedImage() {
        state.uploadedImage = null;
        elements.visionImageInput.value = '';
        elements.uploadPlaceholder.classList.remove('hidden');
        elements.uploadPreview.classList.add('hidden');
    }

    async function analyzeImage() {
        if (!state.uploadedImage) {
            showToast('请先上传图片', 'error');
            return;
        }

        const prompt = elements.visionPrompt.value.trim() || '请详细描述这张图片的内容';
        const { provider, model } = state.visionModel;
        const apiKey = provider === 'gemini' ? state.geminiKey : state.openaiKey;

        if (!apiKey) {
            showToast(`请先配置 ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API 密钥`, 'error');
            return;
        }

        elements.analyzeImageBtn.disabled = true;
        elements.visionStatus.classList.add('loading');
        elements.visionStatus.querySelector('.status-message').textContent = '正在分析...';

        try {
            let result;
            if (provider === 'gemini') {
                result = await callGeminiVision(apiKey, model, state.uploadedImage, prompt);
            } else {
                result = await callOpenAIVision(apiKey, model, state.uploadedImage, prompt);
            }

            elements.visionResult.classList.remove('hidden');
            elements.visionResultContent.textContent = result;
            elements.visionStatus.querySelector('.status-message').textContent = '分析完成';
            showToast('分析完成', 'success');
        } catch (error) {
            showToast('分析失败：' + error.message, 'error');
            elements.visionStatus.querySelector('.status-message').textContent = '分析失败';
        } finally {
            elements.analyzeImageBtn.disabled = false;
            elements.visionStatus.classList.remove('loading');
        }
    }

    async function callGeminiVision(apiKey, model, imageData, prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // 提取 base64 数据
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];

        const body = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || '没有获取到分析结果';
    }

    async function callOpenAIVision(apiKey, model, imageData, prompt) {
        const url = 'https://api.openai.com/v1/chat/completions';

        const body = {
            model: model,
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: { url: imageData }
                    }
                ]
            }],
            max_tokens: 2048
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        return data.choices?.[0]?.message?.content || '没有获取到分析结果';
    }

    // ========== 通用工具函数 ==========
    async function callGeminiText(prompt, model = 'gemini-1.5-flash') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${state.geminiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    function toggleModal(show) {
        elements.settingsModal.classList.toggle('hidden', !show);
    }

    function showToast(message, type = 'success') {
        const toast = elements.toast;
        toast.querySelector('.toast-message').textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 启动应用
    init();
});
