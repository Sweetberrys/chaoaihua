/**
 * logger.js - 简单的日志工具
 */
import fs from 'fs';
import path from 'path';

// 日志文件路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const API_KEY_LOG_FILE = path.join(LOG_DIR, 'api_key_operations.log');

/**
 * 确保日志目录存在
 */
function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('创建日志目录失败:', error);
  }
}

/**
 * 记录API密钥操作日志
 * @param {string} action 操作类型
 * @param {Object} data 相关数据
 */
export function logApiKeyOperation(action, data) {
  try {
    ensureLogDir();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      ...data
    };
    
    // 将敏感信息掩码处理
    if (logEntry.key) {
      const key = logEntry.key;
      if (key.length > 8) {
        logEntry.key = key.substring(0, 4) + '****' + key.substring(key.length - 4);
      } else {
        logEntry.key = '****';
      }
    }
    
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(API_KEY_LOG_FILE, logLine, 'utf8');
    console.log(`[${timestamp}] ${action}:`, JSON.stringify(data));
  } catch (error) {
    console.error('写入日志失败:', error);
  }
}

/**
 * 获取API密钥操作日志
 * @param {number} limit 获取的日志条数限制
 * @returns {Array} 日志条目数组
 */
export function getApiKeyLogs(limit = 100) {
  try {
    ensureLogDir();
    
    if (!fs.existsSync(API_KEY_LOG_FILE)) {
      return [];
    }
    
    const logContent = fs.readFileSync(API_KEY_LOG_FILE, 'utf8');
    const logLines = logContent.split('\n').filter(line => line.trim());
    
    // 返回最新的limit条日志
    return logLines
      .slice(-limit)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return { timestamp: new Date().toISOString(), error: 'Invalid log format', raw: line };
        }
      });
  } catch (error) {
    console.error('读取日志失败:', error);
    return [];
  }
} 