/**
 * API6c735e6BcE/[id]/toggle.js - 切换API密钥状态路由
 * 
 * PATCH: 切换API密钥的启用/禁用状态
 */
import {
  getApiKey,
  toggleApiKeyStatus
} from '../../../../utils/apiKeyManager';
import { verifyAdmin } from '../../../../utils/auth';
import { logApiKeyOperation } from '../../../../utils/logger';

export default async function handler(req, res) {
  // 只允许PATCH请求
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      success: false,
      error: '方法不允许',
      message: `不支持 ${req.method} 方法，只允许 PATCH`
    });
  }
  
  // 获取请求中的API密钥ID
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: '参数错误',
      message: '缺少API密钥ID'
    });
  }
  
  try {
    const { adminPassword } = req.body;
    
    // 验证管理员权限
    if (!verifyAdmin(adminPassword)) {
      return res.status(403).json({
        success: false,
        error: '权限不足',
        message: '需要管理员权限才能执行此操作'
      });
    }
    
    // 获取当前状态用于日志记录
    const currentApiKey = getApiKey(id, true);
    
    if (!currentApiKey) {
      return res.status(404).json({
        success: false,
        error: '未找到',
        message: `未找到ID为 ${id} 的API密钥`
      });
    }
    
    // 切换状态
    const updatedApiKey = toggleApiKeyStatus(id);
    
    if (!updatedApiKey) {
      return res.status(500).json({
        success: false,
        error: '更新失败',
        message: '切换API密钥状态时发生错误'
      });
    }
    
    // 记录操作日志
    const newStatus = updatedApiKey.enabled ? '启用' : '禁用';
    logApiKeyOperation(`${newStatus.toLowerCase()}_api_key`, {
      id: updatedApiKey.id,
      name: updatedApiKey.name,
      key: updatedApiKey.key,
      enabled: updatedApiKey.enabled
    });
    
    // 返回更新后的状态
    return res.status(200).json({
      success: true,
      data: {
        id: updatedApiKey.id,
        name: updatedApiKey.name,
        enabled: updatedApiKey.enabled
      },
      message: `API密钥${newStatus}成功`
    });
  } catch (error) {
    console.error(`切换API密钥 ${id} 状态时出错:`, error);
    return res.status(500).json({
      success: false,
      error: '切换API密钥状态失败',
      message: error.message
    });
  }
} 