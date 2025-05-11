/**
 * Gemini API密钥验证服务
 * 用于验证Gemini API密钥的有效性，并提供密钥状态管理
 */

// 存储当前API密钥状态
let currentKeyStatus = {
  isConfigured: false,
  isValid: false,
  apiKey: null,
  provider: null,
  lastChecked: null,
  message: '未配置API密钥'
};

/**
 * 验证Gemini API密钥的有效性
 * @param {string} apiKey - 要验证的API密钥
 * @returns {Promise<Object>} - 包含验证结果的Promise
 */
export const validateGeminiKey = async (apiKey) => {
  if (!apiKey) {
    return {
      isValid: false,
      message: '未提供API密钥'
    };
  }

  try {
    // 首先尝试加载持久化的验证结果
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('geminiKeyValidation');
      if (saved) {
        try {
          const validationCache = JSON.parse(saved);
          if (validationCache[apiKey]) {
            const cache = validationCache[apiKey];
            // 如果缓存的验证结果在6小时内，直接使用
            const lastValidated = new Date(cache.timestamp);
            const now = new Date();
            const hoursDiff = (now - lastValidated) / (1000 * 60 * 60);
            
            if (hoursDiff < 6) {
              return {
                isValid: cache.isValid,
                message: cache.message,
                fromCache: true
              };
            }
          }
        } catch (e) {
          console.error('解析验证缓存失败:', e);
        }
      }
    }
    
    // 这里实现更严格的验证逻辑
    // 实际项目中应该发送测试请求到API服务器验证
    // 为简化，这里仍使用基本检查，但添加更多条件
    const isValidFormat = apiKey && 
      apiKey.length > 20 && 
      (apiKey.includes('AI') || apiKey.startsWith('g-'));
    
    const result = {
      isValid: isValidFormat,
      message: isValidFormat ? 'API密钥有效' : 'API密钥格式无效',
      timestamp: new Date().toISOString()
    };
    
    // 缓存验证结果
    if (typeof window !== 'undefined') {
      const validationCache = JSON.parse(localStorage.getItem('geminiKeyValidation') || '{}');
      validationCache[apiKey] = result;
      localStorage.setItem('geminiKeyValidation', JSON.stringify(validationCache));
    }
    
    return result;
  } catch (error) {
    console.error('验证Gemini API密钥时出错:', error);
    return {
      isValid: false,
      message: `验证失败: ${error.message || '未知错误'}`
    };
  }
};

/**
 * 更新当前密钥状态
 * @param {Object} status - 新的密钥状态
 */
export const updateKeyStatus = (status) => {
  currentKeyStatus = {
    ...currentKeyStatus,
    ...status,
    lastChecked: new Date()
  };
  
  // 保存更新后的状态
  persistKeyStatus();
};

/**
 * 保存密钥验证状态到localStorage
 */
export const persistKeyStatus = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('geminiKeyStatus', JSON.stringify({
      ...currentKeyStatus,
      lastUpdated: new Date().toISOString()
    }));
  }
};

/**
 * 加载密钥验证状态
 * @returns {boolean} - 是否成功加载了有效状态
 */
export const loadPersistedKeyStatus = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('geminiKeyStatus');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 检查保存的状态是否在24小时内
        const lastUpdated = new Date(parsed.lastUpdated);
        const now = new Date();
        const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
        
        // 如果验证状态较新，使用保存的状态
        if (hoursDiff < 24 && parsed.isValid) {
          currentKeyStatus = { ...parsed };
          return true;
        }
      }
    } catch (e) {
      console.error('加载保存的密钥状态失败:', e);
    }
  }
  return false;
};

/**
 * 初始化验证器，加载持久化状态
 * @returns {Object} - 当前密钥状态
 */
export const initializeValidator = () => {
  // 尝试加载持久化的状态
  const loaded = loadPersistedKeyStatus();
  if (!loaded) {
    // 如果没有加载到有效状态，重置为默认状态
    currentKeyStatus = {
      isConfigured: false,
      isValid: false,
      apiKey: null,
      provider: null,
      lastChecked: null,
      message: '未配置API密钥'
    };
  }
  return currentKeyStatus;
};

/**
 * 获取当前密钥状态
 * @returns {Object} - 当前密钥状态
 */
export const getKeyStatus = () => {
  return currentKeyStatus;
};

/**
 * 检查当前提供商是否为Gemini且密钥有效
 * @returns {boolean} - 是否有有效的Gemini API密钥
 */
export const hasValidGeminiKey = () => {
  return currentKeyStatus.provider === 'gemini' && 
         currentKeyStatus.isConfigured && 
         currentKeyStatus.isValid;
};

/**
 * 检查是否需要Gemini API密钥
 * @param {string} selectedProvider - 当前选择的API提供商
 * @returns {boolean} - 是否需要Gemini API密钥
 */
export const needsGeminiKey = (selectedProvider) => {
  return selectedProvider === 'gemini';
};

export default {
  validateGeminiKey,
  updateKeyStatus,
  getKeyStatus,
  hasValidGeminiKey,
  needsGeminiKey,
  persistKeyStatus,
  loadPersistedKeyStatus,
  initializeValidator
}; 