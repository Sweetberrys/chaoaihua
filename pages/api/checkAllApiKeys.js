/**
 * checkAllApiKeys.js - 批量检查所有API密钥的状态
 * 
 * 该API端点会遍历所有API密钥，通过调用Gemini API验证其有效性和配额状态。
 * 然后根据检查结果更新每个API密钥的状态。
 */

import { getAllApiKeys, getApiKey, updateApiKey, toggleApiKeyStatus } from '../../utils/apiKeyManager';

// 导入checkApiKeyStatus中的checkGeminiApiKeyStatus函数
// 从checkApiKeyStatus.js复制过来以避免循环依赖
async function checkGeminiApiKeyStatus(apiKey) {
  const GEMINI_MODELS_ENDPOINT = 'http://api-proxy.me/gemini/v1/models';
  
  try {
    // 构建API URL
    const url = `${GEMINI_MODELS_ENDPOINT}?key=${apiKey}`;
    
    // 调用Gemini API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(30000) // 30秒超时，增加超时时间以应对网络延迟
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
    // 获取所有API密钥
    const { data: apiKeys } = getAllApiKeys({ showFullKey: true });
    
    if (apiKeys.length === 0) {
      return res.status(404).json({
        success: false,
        message: '没有找到API密钥',
        code: 'NO_API_KEYS_FOUND'
      });
    }
    
    // 结果统计
    const results = {
      valid: 0,
      validWithQuota: 0,
      validWithoutQuota: 0,
      invalid: 0,
      details: []
    };
    
    // 逐个检查API密钥
    for (const key of apiKeys) {
      try {
        // 检查API密钥状态
        const checkResult = await checkGeminiApiKeyStatus(key.key);
        
        // 根据检查结果更新API密钥状态
        const shouldBeEnabled = checkResult.isValid && checkResult.hasQuota;
        
        // 如果状态需要改变
        if (key.enabled !== shouldBeEnabled) {
          // 切换API密钥状态
          toggleApiKeyStatus(key.id);
        }
        
        // 更新API密钥的额外信息
        updateApiKey(key.id, {
          quotaStatus: checkResult.hasQuota ? 'AVAILABLE' : 'EXCEEDED',
          lastCheckTime: new Date().toISOString(),
          lastCheckResult: checkResult
        });
        
        // 记录结果
        if (checkResult.isValid) {
          results.valid++;
          
          if (checkResult.hasQuota) {
            results.validWithQuota++;
          } else {
            results.validWithoutQuota++;
          }
        } else {
          results.invalid++;
        }
        
        results.details.push({
          id: key.id,
          name: key.name,
          success: true,
          isValid: checkResult.isValid,
          hasQuota: checkResult.hasQuota,
          message: checkResult.message
        });
        
        // 添加短暂延迟，避免API请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`检查密钥 ${key.name} 时出错:`, error);
        results.details.push({
          id: key.id,
          name: key.name,
          success: false,
          error: error.message
        });
        results.invalid++;
      }
    }
    
    // 返回检查结果
    return res.status(200).json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('批量检查API密钥时出错:', error);
    return res.status(500).json({
      success: false,
      message: `批量检查过程中出错: ${error.message}`,
      code: 'SERVER_ERROR'
    });
  }
} 