/**
 * apiKeyManager.js - API密钥管理核心功能
 * 
 * 提供API密钥的CRUD操作和状态管理
 */
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 数据文件路径
const API_KEYS_FILE = path.join(process.cwd(), 'data', 'apiKeys.json');

/**
 * 读取API密钥数据文件
 * @returns {Object} 包含API密钥和设置的对象
 */
function readApiKeysFile() {
  try {
    // 检查文件是否存在，如果不存在则创建默认结构
    if (!fs.existsSync(API_KEYS_FILE)) {
      const defaultData = {
        apiKeys: [],
        settings: {
          rotationStrategy: 'random',
          lastUpdated: new Date().toISOString()
        }
      };
      fs.writeFileSync(API_KEYS_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }

    // 读取并解析文件内容
    const fileContent = fs.readFileSync(API_KEYS_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('读取API密钥文件时出错:', error);
    return {
      apiKeys: [],
      settings: {
        rotationStrategy: 'random',
        lastUpdated: new Date().toISOString()
      }
    };
  }
}

/**
 * 写入API密钥数据到文件
 * @param {Object} data 要写入的数据对象
 * @returns {boolean} 操作是否成功
 */
function writeApiKeysFile(data) {
  try {
    // 更新最后修改时间
    data.settings.lastUpdated = new Date().toISOString();
    
    // 确保data/目录存在
    const dirPath = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('写入API密钥文件时出错:', error);
    return false;
  }
}

/**
 * 获取所有API密钥，支持分页和搜索
 * @param {object} options 选项对象
 * @param {boolean} options.showFullKey 是否显示完整的API密钥（默认为false，显示掩码）
 * @param {number} options.page 页码，从1开始计数（默认为1）
 * @param {number} options.pageSize 每页条数（默认为10）
 * @param {string} options.search 搜索关键词（默认为空）
 * @param {string} options.sortBy 排序字段（默认为'createdAt'）
 * @param {string} options.sortOrder 排序方向，'asc'或'desc'（默认为'desc'）
 * @returns {Object} 包含分页API密钥数组和分页信息的对象
 */
function getAllApiKeys(options = {}) {
  const { 
    showFullKey = false, 
    page = 1, 
    pageSize = 10, 
    search = '', 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = options;
  
  const data = readApiKeysFile();
  let apiKeys = [...data.apiKeys];
  
  // 搜索过滤
  if (search && search.trim() !== '') {
    const searchTerm = search.trim().toLowerCase();
    apiKeys = apiKeys.filter(key => 
      key.name.toLowerCase().includes(searchTerm) || 
      key.key.toLowerCase().includes(searchTerm)
    );
  }
  
  // 排序
  apiKeys.sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];
    
    // 日期字段特殊处理
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'lastUsed') {
      valueA = valueA ? new Date(valueA).getTime() : 0;
      valueB = valueB ? new Date(valueB).getTime() : 0;
    }
    
    // 字符串特殊处理
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
    }
    if (typeof valueB === 'string') {
      valueB = valueB.toLowerCase();
    }
    
    // 排序方向
    if (sortOrder.toLowerCase() === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  // 计算总页数
  const totalItems = apiKeys.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // 校正页码
  const validPage = Math.max(1, Math.min(page, totalPages || 1));
  
  // 分页
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedKeys = apiKeys.slice(startIndex, endIndex);
  
  // 应用掩码
  const result = showFullKey 
    ? paginatedKeys 
    : paginatedKeys.map(key => ({
      ...key,
      key: maskApiKey(key.key)
    }));
  
  // 返回分页数据和分页信息
  return {
    data: result,
    pagination: {
      page: validPage,
      pageSize,
      totalItems,
      totalPages
    }
  };
}

/**
 * 获取单个API密钥
 * @param {string} id API密钥ID
 * @param {boolean} showFullKey 是否显示完整的API密钥
 * @returns {Object|null} API密钥对象或null（如果未找到）
 */
function getApiKey(id, showFullKey = false) {
  const data = readApiKeysFile();
  const apiKey = data.apiKeys.find(key => key.id === id);
  
  if (!apiKey) {
    return null;
  }
  
  if (showFullKey) {
    return apiKey;
  }
  
  // 返回带掩码的API密钥
  return {
    ...apiKey,
    key: maskApiKey(apiKey.key)
  };
}

/**
 * 创建新的API密钥
 * @param {Object} keyData 包含key和name的对象
 * @returns {Object} 新创建的API密钥对象
 */
function createApiKey(keyData) {
  if (!keyData.key || !keyData.name) {
    throw new Error('API密钥和名称是必需的');
  }
  
  const data = readApiKeysFile();
  
  // 检查密钥是否已存在
  const keyExists = data.apiKeys.some(key => key.key === keyData.key);
  if (keyExists) {
    throw new Error('API密钥已存在');
  }
  
  // 创建新的API密钥对象
  const now = new Date().toISOString();
  const newApiKey = {
    id: uuidv4(),
    key: keyData.key,
    name: keyData.name,
    enabled: true,
    createdAt: now,
    updatedAt: now,
    usageCount: 0,
    lastUsed: null,
    quotaStatus: 'UNKNOWN',
    lastCheckTime: null,
    lastCheckResult: null
  };
  
  // 添加到数组并保存
  data.apiKeys.push(newApiKey);
  writeApiKeysFile(data);
  
  // 返回创建的API密钥（不掩码）
  return newApiKey;
}

/**
 * 更新API密钥
 * @param {string} id API密钥ID
 * @param {Object} keyData 要更新的数据
 * @returns {Object|null} 更新后的API密钥对象或null（如果未找到）
 */
function updateApiKey(id, keyData) {
  const data = readApiKeysFile();
  const index = data.apiKeys.findIndex(key => key.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // 检查是否有其他密钥与要更新的密钥值相同
  if (keyData.key) {
    const keyExists = data.apiKeys.some(
      (key, idx) => key.key === keyData.key && idx !== index
    );
    if (keyExists) {
      throw new Error('API密钥已存在');
    }
  }
  
  // 更新API密钥
  const updatedApiKey = {
    ...data.apiKeys[index],
    ...keyData,
    updatedAt: new Date().toISOString()
  };
  
  data.apiKeys[index] = updatedApiKey;
  writeApiKeysFile(data);
  
  return updatedApiKey;
}

/**
 * 删除API密钥
 * @param {string} id API密钥ID
 * @returns {boolean} 操作是否成功
 */
function deleteApiKey(id) {
  const data = readApiKeysFile();
  const index = data.apiKeys.findIndex(key => key.id === id);
  
  if (index === -1) {
    return false;
  }
  
  // 删除API密钥
  data.apiKeys.splice(index, 1);
  return writeApiKeysFile(data);
}

/**
 * 切换API密钥的启用状态
 * @param {string} id API密钥ID
 * @returns {Object|null} 更新后的API密钥对象或null（如果未找到）
 */
function toggleApiKeyStatus(id) {
  const data = readApiKeysFile();
  const index = data.apiKeys.findIndex(key => key.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // 切换启用状态
  data.apiKeys[index].enabled = !data.apiKeys[index].enabled;
  data.apiKeys[index].updatedAt = new Date().toISOString();
  writeApiKeysFile(data);
  
  return data.apiKeys[index];
}

/**
 * 获取所有启用状态的API密钥
 * @returns {Array} 启用状态的API密钥数组
 */
function getEnabledApiKeys() {
  const data = readApiKeysFile();
  return data.apiKeys.filter(key => key.enabled);
}

/**
 * 获取设置
 * @returns {Object} 设置对象
 */
function getSettings() {
  const data = readApiKeysFile();
  return data.settings;
}

/**
 * 更新设置
 * @param {Object} newSettings 新的设置值
 * @returns {Object} 更新后的设置对象
 */
function updateSettings(newSettings) {
  const data = readApiKeysFile();
  data.settings = {
    ...data.settings,
    ...newSettings,
    lastUpdated: new Date().toISOString()
  };
  writeApiKeysFile(data);
  
  return data.settings;
}

/**
 * 增加API密钥的使用计数
 * @param {string} id API密钥ID
 * @returns {boolean} 操作是否成功
 */
function incrementApiKeyUsage(id) {
  const data = readApiKeysFile();
  const index = data.apiKeys.findIndex(key => key.id === id);
  
  if (index === -1) {
    return false;
  }
  
  // 更新使用计数和最后使用时间
  data.apiKeys[index].usageCount += 1;
  data.apiKeys[index].lastUsed = new Date().toISOString();
  return writeApiKeysFile(data);
}

/**
 * 为API密钥添加掩码
 * @param {string} key API密钥
 * @returns {string} 掩码处理后的API密钥
 */
function maskApiKey(key) {
  if (!key || key.length < 10) return "****";
  const firstFour = key.substring(0, 4);
  const lastFour = key.substring(key.length - 4);
  return `${firstFour}${"*".repeat(key.length - 8)}${lastFour}`;
}

/**
 * 随机获取一个启用状态的API密钥
 * @returns {Object|null} API密钥对象或null（如果没有可用的密钥）
 */
function getRandomApiKey() {
  const enabledKeys = getEnabledApiKeys();
  
  if (enabledKeys.length === 0) {
    return null;
  }
  
  // 根据设置的轮换策略选择API密钥
  const settings = getSettings();
  let selectedKey = null;
  
  switch (settings.rotationStrategy) {
    case 'sequential':
      // 按顺序选择（通常需要跟踪上次使用的索引，这里简化为第一个）
      selectedKey = enabledKeys[0];
      break;
    
    case 'least-used':
      // 选择使用次数最少的
      selectedKey = enabledKeys.reduce((min, key) => 
        (!min || key.usageCount < min.usageCount) ? key : min
      , null);
      break;
    
    case 'random':
    default:
      // 随机选择
      selectedKey = enabledKeys[Math.floor(Math.random() * enabledKeys.length)];
      break;
  }
  
  // 记录使用情况
  if (selectedKey) {
    incrementApiKeyUsage(selectedKey.id);
  }
  
  return selectedKey;
}

export {
  getAllApiKeys,
  getApiKey,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  toggleApiKeyStatus,
  getEnabledApiKeys,
  getSettings,
  updateSettings,
  getRandomApiKey,
  maskApiKey
}; 