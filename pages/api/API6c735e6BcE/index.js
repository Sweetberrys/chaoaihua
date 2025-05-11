/**
 * API6c735e6BcE/index.js - API密钥管理路由
 * 
 * GET: 获取所有API密钥列表（带掩码）
 * POST: 创建新的API密钥
 */
import {
  getAllApiKeys,
  createApiKey
} from '../../../utils/apiKeyManager';
import { verifyAdmin } from '../../../utils/auth';
import { logApiKeyOperation } from '../../../utils/logger';

export default async function handler(req, res) {
  // 获取所有API密钥
  if (req.method === 'GET') {
    try {
      // 解析查询参数
      const { 
        page = '1', 
        pageSize = '10', 
        search = '', 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;
      
      // 转换为适当的类型
      const options = {
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        search,
        sortBy,
        sortOrder
      };
      
      // 获取API密钥列表（带掩码），使用分页和筛选参数
      const result = getAllApiKeys(options);
      
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('获取API密钥列表时出错:', error);
      return res.status(500).json({
        success: false,
        error: '获取API密钥列表失败',
        message: error.message
      });
    }
  }
  
  // 创建新的API密钥
  if (req.method === 'POST') {
    try {
      const { key, name, adminPassword } = req.body;
      
      // 验证管理员权限
      if (!verifyAdmin(adminPassword)) {
        return res.status(403).json({
          success: false,
          error: '权限不足',
          message: '需要管理员权限才能执行此操作'
        });
      }
      
      // 验证必要参数
      if (!key || !name) {
        return res.status(400).json({
          success: false,
          error: '参数错误',
          message: 'API密钥和名称是必需的'
        });
      }
      
      // 创建新的API密钥
      const newApiKey = createApiKey({ key, name });
      
      // 记录操作日志
      logApiKeyOperation('create_api_key', {
        id: newApiKey.id,
        name: newApiKey.name,
        key: newApiKey.key
      });
      
      // 返回创建的API密钥（带掩码）
      return res.status(201).json({
        success: true,
        data: {
          ...newApiKey,
          key: newApiKey.key.substring(0, 4) + '****' + newApiKey.key.substring(newApiKey.key.length - 4)
        },
        message: 'API密钥创建成功'
      });
    } catch (error) {
      console.error('创建API密钥时出错:', error);
      return res.status(500).json({
        success: false,
        error: '创建API密钥失败',
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