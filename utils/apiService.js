/**
 * apiService.js - API调用服务
 * 
 * 该文件提供了用于调用图像生成API的函数:
 * 1. 优先调用Hugging Face API
 * 2. 如果Hugging Face API失败，回退到使用代理的Gemini API
 */

/**
 * 调用Hugging Face API生成图像
 * @param {string} prompt - 用户提示词
 * @param {string} drawingData - Base64编码的绘图数据
 * @param {string} customApiKey - 可选的自定义API密钥
 * @returns {Promise<Object>} - 包含成功状态和图像数据的对象
 */
async function callHuggingFaceApi(prompt, drawingData, customApiKey) {
  console.log("尝试调用Hugging Face API...");
  
  try {
    // 准备请求数据
    const requestData = {
      prompt,
      drawingData,
      customApiKey
    };
    
    // 调用Hugging Face端点
    const response = await fetch("https://trudy-gemini-codrawing.hf.space/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      // 设置超时时间为15秒
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API响应错误 (${response.status}):`, errorText);
      
      // 检查是否是配额限制错误
      const isQuotaError = errorText.includes("429 Too Many Requests") || 
                           errorText.includes("quota") || 
                           errorText.includes("rate limit");
      
      if (isQuotaError) {
        return {
          success: false,
          error: "Google Gemini API配额已用尽。正在尝试使用备用API...",
          status: 429
        };
      }
      
      return {
        success: false,
        error: `Hugging Face API返回错误 ${response.status}: ${errorText}`,
        status: response.status
      };
    }
    
    console.log("Hugging Face API响应接收成功");
    
    // 解析响应
    const data = await response.json();
    
    // 确保响应格式符合预期
    return {
      success: true,
      message: data.message || '',
      imageData: data.imageData || null
    };
  } catch (error) {
    console.error("调用Hugging Face API时出错:", error);
    return {
      success: false,
      error: `调用Hugging Face API失败: ${error.message || "未知错误"}`,
      status: 500
    };
  }
}

/**
 * 从JSON文件中获取API密钥数组
 * @returns {Array<string>} API密钥数组
 */
function getApiKeys() {
  try {
    // 导入API密钥管理器
    const { getEnabledApiKeys } = require('./apiKeyManager');
    
    // 获取所有启用状态的API密钥
    const enabledKeys = getEnabledApiKeys();
    
    if (!enabledKeys || enabledKeys.length === 0) {
      console.error("未找到启用状态的Gemini API密钥");
      return [];
    }
    
    // 仅返回密钥值数组
    return enabledKeys.map(keyObj => keyObj.key);
  } catch (error) {
    console.error("获取API密钥时出错:", error);
    
    // 回退到旧的环境变量方式
    try {
      // 检查环境变量中是否存在API密钥数组
      const keysString = process.env.GEMINI_API_KEY;
      if (!keysString) {
        console.error("未找到Gemini API密钥");
        return [];
      }

      // 尝试解析API密钥数组
      let keys;
      try {
        keys = JSON.parse(keysString.replace(/'/g, '"'));
      } catch (e) {
        // 如果JSON解析失败，尝试进行简单的字符串解析
        keys = keysString
          .replace(/\[|\]/g, '') // 移除方括号
          .split(',')             // 按逗号分割
          .map(key => key.trim().replace(/"/g, '').replace(/'/g, '')); // 清理每个密钥
      }

      // 过滤空字符串和无效的密钥
      return Array.isArray(keys) 
        ? keys.filter(key => typeof key === 'string' && key.trim().length > 0)
        : [keysString]; // 如果不是数组，则将其作为单个密钥返回
    } catch (fallbackError) {
      console.error("解析环境变量API密钥时出错:", fallbackError);
      return [];
    }
  }
}

/**
 * 验证API密钥是否有效
 * @param {string} apiKey - 要验证的API密钥
 * @returns {Promise<Object>} - 包含验证结果的对象
 */
async function validateApiKey(apiKey) {
  try {
    // 如果没有提供API密钥，返回无效结果
    if (!apiKey) {
      return { isValid: false, message: '未提供API密钥' };
    }

    // 调用验证API
    const response = await fetch('/api/validateApiKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey })
    });

    const data = await response.json();
    
    // 如果API密钥有效但我们需要检查配额状态
    if (data.isValid) {
      try {
        // 调用检查API密钥状态的API
        const statusResponse = await fetch('/api/checkApiKeyStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ apiKey })
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          
          // 根据检查结果返回状态
          if (!statusData.isValid) {
            return {
              isValid: false,
              message: statusData.message || 'API密钥无效',
              code: statusData.code || 'INVALID_KEY',
              keyData: statusData.keyData || null
            };
          }
          
          if (!statusData.hasQuota) {
            return {
              isValid: false,
              message: statusData.message || '配额已用尽',
              code: statusData.code || 'QUOTA_EXCEEDED',
              keyData: statusData.keyData || null
            };
          }
          
          // API密钥有效且配额充足
          return {
            isValid: true,
            message: statusData.message || 'API密钥有效且配额充足',
            code: statusData.code || 'KEY_VALID',
            keyData: statusData.keyData || null
          };
        }
      } catch (statusError) {
        console.error('检查API密钥状态时出错:', statusError);
        // 如果状态检查失败，继续使用常规验证结果
      }
    }
    
    return {
      isValid: data.isValid || false,
      message: data.message || '验证失败',
      code: data.code || 'UNKNOWN_ERROR',
      keyData: data.keyData || null
    };
  } catch (error) {
    console.error('验证API密钥时出错:', error);
    return { isValid: false, message: `验证过程中出错: ${error.message}` };
  }
}

/**
 * 调用Gemini API生成图像（通过代理）
 * @param {string} prompt - 用户提示词
 * @param {string} drawingData - Base64编码的绘图数据
 * @param {string} customApiKey - 可选的自定义API密钥
 * @returns {Promise<Object>} - 包含成功状态和图像数据的对象
 */
async function callGeminiApi(prompt, drawingData, customApiKey) {
  console.log("尝试通过代理调用Gemini API...");
  
  try {
    // 使用自定义API密钥，如果提供了的话
    let apiKey = customApiKey;
    let keyValidationResult = null;
    
    // 如果提供了自定义API密钥，先验证其有效性
    if (apiKey) {
      keyValidationResult = await validateApiKey(apiKey);
      
      // 如果自定义密钥无效，记录错误并转为使用系统密钥
      if (!keyValidationResult.isValid) {
        console.warn(`自定义API密钥无效: ${keyValidationResult.message}`);
        apiKey = null; // 清空自定义密钥，使用系统密钥
      }
    }
    
    // 如果没有有效的自定义API密钥，从环境变量中获取API密钥
    if (!apiKey) {
      const apiKeys = getApiKeys();
      if (apiKeys.length === 0) {
        return {
          success: false,
          error: keyValidationResult ? 
            `您提供的API密钥无效 (${keyValidationResult.message})，且系统未配置有效的API密钥` :
            "未找到有效的Gemini API密钥",
          code: keyValidationResult?.code || "NO_VALID_API_KEY",
          status: 500
        };
      }
      
      // 随机选择一个API密钥
      apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    }
    
    // 代理URL
    const proxyUrl = "http://api-proxy.me/gemini";
    
    // 构建请求内容
    let generationContent;
    
    // 如果提供了绘图数据，创建多部分内容
    if (drawingData) {
      // 创建包含base64编码图像的内容部分
      const imagePart = {
        inlineData: {
          data: drawingData,
          mimeType: "image/png"
        }
      };
      
      // 组合绘图和文本提示
      generationContent = [
        imagePart,
        {
          text: `${prompt}. Keep the same minimal line doodle style.` || "Add something new to this drawing, in the same style."
        }
      ];
      
      console.log("使用包含绘图数据和提示词的多部分内容");
    } else {
      // 如果没有提供绘图，仅使用文本提示
      generationContent = prompt;
      console.log("仅使用文本提示");
    }
    
    // 构建Gemini API请求 - 使用与generate.js相同的模型和配置
    const requestUrl = `${proxyUrl}/v1/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`;
    
    // 构建请求体 - 与generate.js保持一致
    const requestData = {
      contents: [
        {
          parts: typeof generationContent === 'string' 
            ? [{ text: generationContent }] 
            : generationContent
        }
      ],
      generationConfig: {
        responseModalities: ['Text', 'Image'],
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };
    
    console.log("请求URL:", requestUrl);
    
    // 调用Gemini API（通过代理）
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData),
      // 设置超时时间为30秒
      signal: AbortSignal.timeout(30000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API响应错误 (${response.status}):`, errorText);
      
      return {
        success: false,
        error: `Gemini API返回错误 ${response.status}: ${errorText}`,
        status: response.status
      };
    }
    
    console.log("Gemini API响应接收成功");
    
    // 解析响应
    const data = await response.json();
    
    // 初始化响应数据
    const result = {
      success: true,
      message: '',
      imageData: null
    };
    
    // 处理响应部分
    // 确保响应格式与generate.js中处理的一致
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts || [];
      
      // 处理响应部分
      for (const part of parts) {
        // 根据部分类型，获取文本或图像数据
        if (part.text) {
          result.message = part.text;
          console.log("收到文本响应:", part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          console.log("收到图像数据，长度:", imageData.length);
          // 在响应中包含base64数据
          result.imageData = imageData;
        }
      }
    } else {
      return {
        success: false,
        error: "Gemini API返回了无效的响应格式",
        status: 500
      };
    }
    
    // 返回结果
    return result;
  } catch (error) {
    console.error("调用Gemini API时出错:", error);
    return {
      success: false,
      error: `调用Gemini API失败: ${error.message || "未知错误"}`,
      status: 500
    };
  }
}

/**
 * 生成图像 - 先尝试Hugging Face API，失败后回退到Gemini API
 * @param {string} prompt - 用户提示词
 * @param {string} drawingData - Base64编码的绘图数据
 * @param {string} customApiKey - 可选的自定义API密钥
 * @returns {Promise<Object>} - 包含成功状态和图像数据的对象
 */
async function generateImage(prompt, drawingData, customApiKey) {
  // 首先尝试使用Hugging Face API
  const hfResult = await callHuggingFaceApi(prompt, drawingData, customApiKey);
  
  // 如果Hugging Face API调用成功并返回了图像数据，直接返回结果
  if (hfResult.success && hfResult.imageData) {
    console.log("成功使用Hugging Face API生成图像");
    return hfResult;
  }
  
  // 如果Hugging Face API调用失败或未返回图像数据，尝试使用Gemini API
  console.log("Hugging Face API调用失败或未返回图像，尝试使用Gemini API作为备用...");
  
  // 记录Hugging Face API调用失败的原因
  let fallbackReason = "";
  if (!hfResult.success) {
    fallbackReason = `Hugging Face API失败: ${hfResult.error}`;
  } else if (!hfResult.imageData) {
    fallbackReason = "Hugging Face API未返回图像数据";
  }
  console.log("回退原因:", fallbackReason);
  
  // 调用Gemini API（通过代理）
  const geminiResult = await callGeminiApi(prompt, drawingData, customApiKey);
  
  // 如果Gemini API调用成功
  if (geminiResult.success) {
    console.log("成功使用Gemini API生成图像");
    
    // 添加回退信息到响应中
    return {
      ...geminiResult,
      usedFallback: true,
      fallbackReason: fallbackReason
    };
  }
  
  // 如果两个API都失败，返回更详细的错误信息
  console.log("两个API调用均失败");
  return {
    success: false,
    error: "图像生成失败。Hugging Face API和Gemini API均未能成功生成图像。",
    hfError: hfResult.error,
    geminiError: geminiResult.error,
    status: 500
  };
}

// 导出函数
export { callHuggingFaceApi, callGeminiApi, generateImage }; 