/**
 * checkApiKeysCount.js - 检查系统中API密钥的数量和有效性
 * 用于确保系统中至少有10个有效的API密钥
 */

import { getAllApiKeys, getEnabledApiKeys } from "../../utils/apiKeyManager";

/**
 * 缓存检查结果以减少API调用
 */
let cachedResults = {
  validCount: 0,
  totalCount: 0,
  lastCheck: null,
  expiresAt: null
};

/**
 * 检查系统中有效API密钥的数量
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
export default async function handler(req, res) {
  // 仅处理GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: "方法不允许，仅支持GET请求" 
    });
  }
  
  try {
    const now = new Date();
    
    // 检查是否有有效的缓存结果
    if (cachedResults.expiresAt && now < cachedResults.expiresAt) {
      return res.status(200).json({
        success: true,
        validCount: cachedResults.validCount,
        totalCount: cachedResults.totalCount,
        lastCheck: cachedResults.lastCheck,
        fromCache: true
      });
    }
    
    // 获取所有API密钥
    const allKeys = getAllApiKeys({ 
      showFullKey: false, 
      includeDisabled: true 
    }).data;
    
    // 获取已启用的API密钥
    const enabledKeys = getEnabledApiKeys();
    
    // 计算有效密钥数量和总密钥数量
    const validCount = enabledKeys.length;
    const totalCount = allKeys.length;
    
    // 缓存结果，设置10分钟过期
    cachedResults = {
      validCount,
      totalCount,
      lastCheck: now.toISOString(),
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000) // 10分钟后过期
    };
    
    // 返回结果
    return res.status(200).json({
      success: true,
      validCount,
      totalCount,
      lastCheck: now.toISOString(),
      fromCache: false
    });
  } catch (error) {
    console.error("检查API密钥数量时出错:", error);
    return res.status(500).json({ 
      success: false, 
      error: `检查API密钥数量时出错: ${error.message}`
    });
  }
} 