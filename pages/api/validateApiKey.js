/**
 * validateApiKey.js - 验证API密钥的有效性
 * 
 * 该API端点用于检查API密钥是否存在且处于启用状态。
 * 支持两种验证方式：
 * 1. 通过完整的API密钥值
 * 2. 通过API密钥ID
 */

import { getApiKey, getEnabledApiKeys, getAllApiKeys } from '../../utils/apiKeyManager';

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
    const { apiKey, apiKeyId } = req.body;
    
    // 请求需要提供apiKey或apiKeyId中的一个
    if (!apiKey && !apiKeyId) {
      return res.status(400).json({
        success: false,
        message: '请提供API密钥或API密钥ID',
        code: 'MISSING_PARAMETER'
      });
    }
    
    // 通过ID验证
    if (apiKeyId) {
      const keyData = getApiKey(apiKeyId, true); // 获取完整信息
      
      if (!keyData) {
        return res.status(404).json({
          success: false,
          message: '未找到该ID对应的API密钥',
          code: 'KEY_NOT_FOUND'
        });
      }
      
      // 检查是否启用
      return res.status(200).json({
        success: true,
        message: keyData.enabled ? 'API密钥有效' : 'API密钥已禁用',
        isValid: keyData.enabled,
        code: keyData.enabled ? 'KEY_VALID' : 'KEY_DISABLED',
        keyData: {
          id: keyData.id,
          name: keyData.name,
          enabled: keyData.enabled
        }
      });
    }
    
    // 通过密钥值验证
    if (apiKey) {
      // 获取所有启用状态的API密钥
      const enabledKeys = getEnabledApiKeys();
      
      // 在启用的密钥中查找匹配项
      const foundKey = enabledKeys.find(key => key.key === apiKey);
      
      if (foundKey) {
        return res.status(200).json({
          success: true,
          message: 'API密钥有效',
          isValid: true,
          code: 'KEY_VALID',
          keyData: {
            id: foundKey.id,
            name: foundKey.name,
            enabled: true
          }
        });
      }
      
      // 如果在启用的密钥中未找到，检查是否存在但被禁用
      const allKeysResult = getAllApiKeys({ showFullKey: true });
      const allKeys = allKeysResult.data;
      const disabledKey = allKeys.find(key => key.key === apiKey && !key.enabled);
      
      if (disabledKey) {
        return res.status(200).json({
          success: true,
          message: 'API密钥已禁用',
          isValid: false,
          code: 'KEY_DISABLED',
          keyData: {
            id: disabledKey.id,
            name: disabledKey.name,
            enabled: false
          }
        });
      }
      
      // 完全未找到该密钥
      return res.status(404).json({
        success: false,
        message: '未找到该API密钥',
        isValid: false,
        code: 'KEY_NOT_FOUND'
      });
    }
  } catch (error) {
    console.error('验证API密钥出错:', error);
    return res.status(500).json({
      success: false,
      message: `验证过程中出错: ${error.message}`,
      code: 'SERVER_ERROR'
    });
  }
} 