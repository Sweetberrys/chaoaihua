/**
 * API6c735e6BcE/[id].js - 单个API密钥管理路由
 * 
 * GET: 获取单个API密钥信息
 * PUT: 更新API密钥信息
 * DELETE: 删除API密钥
 */
import {
  getApiKey,
  updateApiKey,
  deleteApiKey,
  maskApiKey
} from '../../../utils/apiKeyManager';
import { verifyAdmin } from '../../../utils/auth';
import { logApiKeyOperation } from '../../../utils/logger';

export default async function handler(req, res) {
  // 获取请求中的API密钥ID
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: '参数错误',
      message: '缺少API密钥ID'
    });
  }
  
  // 获取单个API密钥信息
  if (req.method === 'GET') {
    try {
      // 检查是否请求完整API密钥
      const showFullKey = req.query.showFullKey === 'true';
      
      // 如果请求完整API密钥，则验证管理员密码
      if (showFullKey) {
        const { adminPassword } = req.query;
        if (!verifyAdmin(adminPassword)) {
          return res.status(403).json({
            success: false,
            error: '权限不足',
            message: '需要管理员权限才能查看完整API密钥'
          });
        }
      }
      
      // 获取API密钥（根据showFullKey决定是否显示完整密钥）
      const apiKey = getApiKey(id, showFullKey);
      
      if (!apiKey) {
        return res.status(404).json({
          success: false,
          error: '未找到',
          message: `未找到ID为 ${id} 的API密钥`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: apiKey
      });
    } catch (error) {
      console.error(`获取API密钥 ${id} 时出错:`, error);
      return res.status(500).json({
        success: false,
        error: '获取API密钥失败',
        message: error.message
      });
    }
  }
  
  // 更新API密钥信息
  if (req.method === 'PUT') {
    try {
      const { key, name, enabled, adminPassword } = req.body;
      
      // 验证管理员权限
      if (!verifyAdmin(adminPassword)) {
        return res.status(403).json({
          success: false,
          error: '权限不足',
          message: '需要管理员权限才能执行此操作'
        });
      }
      
      // 验证至少有一个需要更新的字段
      if (!key && !name && enabled === undefined) {
        return res.status(400).json({
          success: false,
          error: '参数错误',
          message: '至少需要提供一个要更新的字段'
        });
      }
      
      // 更新API密钥
      const updatedData = {};
      if (key) updatedData.key = key;
      if (name) updatedData.name = name;
      if (enabled !== undefined) updatedData.enabled = enabled;
      
      const updatedApiKey = updateApiKey(id, updatedData);
      
      if (!updatedApiKey) {
        return res.status(404).json({
          success: false,
          error: '未找到',
          message: `未找到ID为 ${id} 的API密钥`
        });
      }
      
      // 记录操作日志
      logApiKeyOperation('update_api_key', {
        id: updatedApiKey.id,
        name: updatedApiKey.name,
        key: updatedApiKey.key,
        fields_updated: Object.keys(updatedData)
      });
      
      // 返回更新后的API密钥（带掩码）
      return res.status(200).json({
        success: true,
        data: {
          ...updatedApiKey,
          key: maskApiKey(updatedApiKey.key)
        },
        message: 'API密钥更新成功'
      });
    } catch (error) {
      console.error(`更新API密钥 ${id} 时出错:`, error);
      return res.status(500).json({
        success: false,
        error: '更新API密钥失败',
        message: error.message
      });
    }
  }
  
  // 删除API密钥
  if (req.method === 'DELETE') {
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
      
      // 获取API密钥信息用于日志记录
      const apiKey = getApiKey(id, true);
      
      if (!apiKey) {
        return res.status(404).json({
          success: false,
          error: '未找到',
          message: `未找到ID为 ${id} 的API密钥`
        });
      }
      
      // 删除API密钥
      const success = deleteApiKey(id);
      
      if (!success) {
        return res.status(500).json({
          success: false,
          error: '删除失败',
          message: '删除API密钥时发生错误'
        });
      }
      
      // 记录操作日志
      logApiKeyOperation('delete_api_key', {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key
      });
      
      return res.status(200).json({
        success: true,
        message: 'API密钥删除成功'
      });
    } catch (error) {
      console.error(`删除API密钥 ${id} 时出错:`, error);
      return res.status(500).json({
        success: false,
        error: '删除API密钥失败',
        message: error.message
      });
    }
  }
  
  // 处理不支持的HTTP方法
  return res.status(405).json({
    success: false,
    error: '方法不允许',
    message: `不支持 ${req.method} 方法`
  });
} 