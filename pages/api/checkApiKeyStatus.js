/**
 * checkApiKeyStatus.js - 检查API密钥的状态（有效性和配额）
 * 
 * 该API端点会通过实际调用Gemini API来验证API密钥是否有效以及查询配额状态。
 * 然后根据检查结果更新API密钥的状态。
 */

import { getApiKey, updateApiKey, toggleApiKeyStatus } from '../../utils/apiKeyManager';

// Gemini API的模型列表接口
const GEMINI_MODELS_ENDPOINT = 'http://api-proxy.me/gemini/v1/models';

export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: '方法不允许', 
      code: 'METHOD_NOT_ALLOWED' 
    });
  }
  
  try {
    const { apiKeyId, apiKey, adminPassword } = req.body;
    
    // 请求需要提供apiKey或apiKeyId中的一个
    if (!apiKey && !apiKeyId) {
      return res.status(400).json({
        success: false,
        message: '请提供API密钥或API密钥ID',
        code: 'MISSING_PARAMETER'
      });
    }
    
    // 获取API密钥
    let keyToCheck = apiKey;
    let keyId = apiKeyId;
    let keyData = null;
    
    // 如果提供了ID，则获取对应的API密钥
    if (apiKeyId) {
      keyData = getApiKey(apiKeyId, true);
      if (!keyData) {
        return res.status(404).json({
          success: false,
          message: '未找到该ID对应的API密钥',
          code: 'KEY_NOT_FOUND'
        });
      }
      keyToCheck = keyData.key;
    }
    
    // 检查API密钥状态
    let checkResult;
    try {
      checkResult = await checkGeminiApiKeyStatus(keyToCheck);
    } catch (checkError) {
      console.error('检查API密钥状态时出错:', checkError);
      checkResult = {
        isValid: false,
        hasQuota: false,
        message: `检查过程中发生错误: ${checkError.message}`,
        code: 'CHECK_ERROR',
        quotaStatus: 'UNKNOWN',
        error: checkError.message
      };
    }
    
    // 如果提供了ID，则更新API密钥状态，无论检查成功与否都更新lastCheckTime
    if (keyData && apiKeyId) {
      // 始终更新检查时间和结果，即使出错
      updateApiKey(apiKeyId, {
        quotaStatus: checkResult.hasQuota ? 'AVAILABLE' : 'EXCEEDED',
        lastCheckTime: new Date().toISOString(),
        lastCheckResult: checkResult
      });
      
      // 只有在检查成功时才考虑更新启用状态
      if (checkResult.code !== 'CHECK_ERROR') {
        const shouldBeEnabled = checkResult.isValid && checkResult.hasQuota;
        
        // 如果启用状态需要改变
        if (keyData.enabled !== shouldBeEnabled) {
          // 切换API密钥状态
          toggleApiKeyStatus(apiKeyId);
        }
      }
    }
    
    // 返回检查结果
    return res.status(200).json({
      success: true,
      ...checkResult,
      keyData: keyData ? {
        id: keyData.id,
        name: keyData.name,
        enabled: (checkResult.code !== 'CHECK_ERROR') ? 
                (checkResult.isValid && checkResult.hasQuota) : 
                keyData.enabled // 如果是检查错误，保持原状态
      } : null
    });
    
  } catch (error) {
    console.error('检查API密钥状态出错:', error);
    return res.status(500).json({
      success: false,
      message: `检查过程中出错: ${error.message}`,
      code: 'SERVER_ERROR'
    });
  }
}

/**
 * 检查Gemini API密钥的状态
 * 
 * @param {string} apiKey - Gemini API密钥
 * @returns {Object} 包含isValid和hasQuota的对象
 */
async function checkGeminiApiKeyStatus(apiKey) {
  try {
    // 构建模型列表请求URL
    const url = `${GEMINI_MODELS_ENDPOINT}?key=${apiKey}`;
    
    // 调用Gemini API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(30000) // 30秒超时
    });
    
    // 读取响应
    const responseText = await response.text();
    let responseData;
    
    try {
      // 尝试解析JSON响应
      responseData = JSON.parse(responseText);
    } catch (e) {
      // 如果不是有效的JSON，使用原始文本
      responseData = { error: responseText };
    }
    
    // 检查响应状态
    if (response.ok) {
      // API密钥有效且有配额
      return {
        isValid: true,
        hasQuota: true,
        message: 'API密钥有效且有可用配额',
        code: 'KEY_VALID',
        quotaStatus: 'AVAILABLE',
        rawResponse: responseData
      };
    } else {
      // 检查是否是配额错误
      const isQuotaError = 
        response.status === 429 || 
        (responseData.error && (
          responseData.error.code === 429 ||
          (responseData.error.message && (
            responseData.error.message.includes('quota') || 
            responseData.error.message.includes('rate limit') ||
            responseData.error.message.includes('超出配额') ||
            responseData.error.message.includes('限制')
          ))
        ));
      
      if (isQuotaError) {
        // API密钥有效但配额已用尽
        return {
          isValid: true,
          hasQuota: false,
          message: '配额已用尽或超出请求频率限制',
          code: 'QUOTA_EXCEEDED',
          quotaStatus: 'EXCEEDED',
          rawResponse: responseData
        };
      }
      
      // 检查是否是无效密钥错误
      const isInvalidKeyError = 
        response.status === 400 || 
        response.status === 401 || 
        response.status === 403 ||
        (responseData.error && (
          responseData.error.code === 400 ||
          responseData.error.code === 401 ||
          responseData.error.code === 403 ||
          (responseData.error.message && (
            responseData.error.message.includes('API key') ||
            responseData.error.message.includes('无效') ||
            responseData.error.message.includes('invalid') ||
            responseData.error.message.includes('not valid')
          ))
        ));
      
      if (isInvalidKeyError) {
        // API密钥无效
        return {
          isValid: false,
          hasQuota: false,
          message: 'API密钥无效',
          code: 'INVALID_KEY',
          quotaStatus: 'UNKNOWN',
          rawResponse: responseData
        };
      }
      
      // 其他错误
      return {
        isValid: false,
        hasQuota: false,
        message: `未知错误: ${response.status} ${responseData.error?.message || '无错误消息'}`,
        code: 'UNKNOWN_ERROR',
        quotaStatus: 'UNKNOWN',
        rawResponse: responseData
      };
    }
  } catch (error) {
    // 发生错误，可能是网络问题或超时
    return {
      isValid: false,
      hasQuota: false,
      message: `检查过程中发生错误: ${error.message}`,
      code: 'CHECK_ERROR',
      quotaStatus: 'UNKNOWN',
      error: error.message
    };
  }
} 