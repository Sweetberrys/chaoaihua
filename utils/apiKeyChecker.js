/**
 * apiKeyChecker.js - API密钥检查工具
 * 用于检查系统中API密钥的数量和有效性
 */

/**
 * 检查系统中的API密钥数量和有效性
 * @returns {Promise<Object>} 检查结果
 */
export async function checkApiKeysCount() {
  try {
    // 调用API端点检查API密钥数量
    const response = await fetch('/api/checkApiKeysCount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API密钥检查失败 (${response.status}):`, errorText);
      return {
        success: false,
        error: `API密钥检查失败: ${response.status} ${errorText}`,
        validCount: 0,
        hasEnoughKeys: false,
        requiredCount: 10
      };
    }
    
    const data = await response.json();
    
    // 检查是否有足够的API密钥（至少10个）
    const hasEnoughKeys = data.validCount >= 10;
    
    return {
      success: true,
      validCount: data.validCount,
      totalCount: data.totalCount,
      hasEnoughKeys,
      requiredCount: 10,
      lastCheck: data.lastCheck
    };
  } catch (error) {
    console.error('检查API密钥时出错:', error);
    return {
      success: false,
      error: `检查API密钥时出错: ${error.message}`,
      validCount: 0,
      hasEnoughKeys: false,
      requiredCount: 10
    };
  }
}

/**
 * 获取系统API密钥状态的简单摘要
 * @returns {Promise<Object>} API密钥状态摘要
 */
export async function getApiKeyStatusSummary() {
  try {
    const result = await checkApiKeysCount();
    
    if (!result.success) {
      return {
        status: 'error',
        message: '无法获取API密钥状态',
        hasEnoughKeys: false,
        validCount: 0,
        requiredCount: 10
      };
    }
    
    // 根据有效密钥数量返回状态
    if (result.validCount === 0) {
      return {
        status: 'critical',
        message: '无有效API密钥',
        hasEnoughKeys: false,
        validCount: 0,
        requiredCount: 10
      };
    } else if (result.validCount < 5) {
      return {
        status: 'warning',
        message: `API密钥数量过低 (${result.validCount}/10)`,
        hasEnoughKeys: false,
        validCount: result.validCount,
        requiredCount: 10
      };
    } else if (result.validCount < 10) {
      return {
        status: 'low',
        message: `API密钥不足 (${result.validCount}/10)`,
        hasEnoughKeys: false,
        validCount: result.validCount,
        requiredCount: 10
      };
    } else {
      return {
        status: 'good',
        message: `API密钥充足 (${result.validCount})`,
        hasEnoughKeys: true,
        validCount: result.validCount,
        requiredCount: 10
      };
    }
  } catch (error) {
    console.error('获取API密钥状态摘要时出错:', error);
    return {
      status: 'error',
      message: '无法获取API密钥状态',
      hasEnoughKeys: false,
      validCount: 0,
      requiredCount: 10
    };
  }
}

/**
 * 检查当前用户的API密钥是否有效 
 * @param {string} apiKey 要检查的API密钥
 * @returns {Promise<Object>} 检查结果
 */
export async function checkUserApiKey(apiKey) {
  if (!apiKey) {
    return {
      isValid: false,
      message: '未提供API密钥'
    };
  }
  
  try {
    const response = await fetch('/api/validateApiKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey })
    });
    
    if (!response.ok) {
      return {
        isValid: false,
        message: `验证失败: ${response.status}`
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('验证API密钥时出错:', error);
    return {
      isValid: false,
      message: `验证失败: ${error.message}`
    };
  }
} 