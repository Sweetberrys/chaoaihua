/**
 * 短链接API
 * 用于生成短链接并保存画布数据
 */
import fs from 'fs';
import path from 'path';

// 数据存储路径
const DATA_DIR = path.join(process.cwd(), 'data');
const SHORTLINKS_FILE = path.join(DATA_DIR, 'shortlinks.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 确保短链接文件存在
if (!fs.existsSync(SHORTLINKS_FILE)) {
  fs.writeFileSync(SHORTLINKS_FILE, JSON.stringify({}), 'utf8');
}

/**
 * 读取短链接数据
 * @returns {Object} 短链接数据对象
 */
const readShortLinksData = () => {
  try {
    const data = fs.readFileSync(SHORTLINKS_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('读取短链接数据失败:', error);
    return {};
  }
};

/**
 * 写入短链接数据
 * @param {Object} data 短链接数据对象
 */
const writeShortLinksData = (data) => {
  try {
    fs.writeFileSync(SHORTLINKS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('写入短链接数据失败:', error);
    return false;
  }
};

/**
 * 生成随机短码
 * @param {number} length - 短码长度
 * @returns {string} - 生成的短码
 */
const generateShortCode = (length = 6) => {
  // 使用安全的字符集（不含易混淆字符如0,O,1,l,I等）
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  // 生成指定长度的随机字符串
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

/**
 * 清理过期数据
 * @param {Object} shortLinksData 短链接数据对象
 * @returns {Object} 清理后的数据对象
 */
const cleanupExpiredData = (shortLinksData) => {
  const now = new Date();
  const updatedData = { ...shortLinksData };
  
  Object.keys(updatedData).forEach(key => {
    if (updatedData[key].expiresAt && new Date(updatedData[key].expiresAt) < now) {
      delete updatedData[key];
    }
  });
  
  return updatedData;
};

/**
 * 短链接API处理函数
 */
export default async function handler(req, res) {
  // 同时支持GET和POST请求，但POST仍是首选
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 获取请求数据（从POST体或GET查询参数）
    let data;
    if (req.method === 'POST') {
      data = req.body.data;
    } else {
      // GET方法从查询参数获取数据
      data = req.query.data;
    }
    
    if (!data) {
      return res.status(400).json({ error: '缺少必要的数据参数' });
    }
    
    // 读取现有数据
    let shortLinksData = readShortLinksData();
    
    // 清理过期数据
    shortLinksData = cleanupExpiredData(shortLinksData);
    
    // 生成短码（确保唯一）
    let shortCode;
    do {
      shortCode = generateShortCode();
    } while (shortLinksData[shortCode]);
    
    // 添加新短链接数据
    shortLinksData[shortCode] = {
      data,
      createdAt: new Date().toISOString(),
      // 设置过期时间（可选）
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30天后过期
    };
    
    // 保存数据
    const saveSuccess = writeShortLinksData(shortLinksData);
    
    if (!saveSuccess) {
      return res.status(500).json({ error: '保存短链接数据失败' });
    }
    
    // 计算存储使用情况（仅用于调试）
    const totalEntries = Object.keys(shortLinksData).length;
    console.log(`短链接存储：${totalEntries} 条记录`);
    
    // 构建短链接
    const shortUrl = `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin}/s/${shortCode}`;
    
    // 返回短链接
    return res.status(200).json({
      shortCode,
      shortUrl,
      expiresAt: shortLinksData[shortCode].expiresAt
    });
  } catch (error) {
    console.error('短链接生成错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

/**
 * 获取短码数据（用于GET请求）
 * @param {string} shortCode - 短码
 * @returns {object|null} - 保存的数据或null（如果不存在）
 */
export const getShortCodeData = (shortCode) => {
  try {
    // 读取短链接数据
    const shortLinksData = readShortLinksData();
    
    // 清理过期数据
    const cleanedData = cleanupExpiredData(shortLinksData);
    
    // 如果清理后数据有变化，保存更新后的数据
    if (Object.keys(cleanedData).length !== Object.keys(shortLinksData).length) {
      writeShortLinksData(cleanedData);
    }
    
    // 检查短码是否存在
    if (cleanedData[shortCode]) {
      return cleanedData[shortCode];
    }
    
    return null;
  } catch (error) {
    console.error('获取短码数据失败:', error);
    return null;
  }
}; 