/**
 * auth.js - 简单的认证工具
 */

// 硬编码管理员密码（仅用于演示，生产环境应使用更安全的方法）
export const ADMIN_PASSWORD = 'API6c735e6BcE_admin';

/**
 * 验证管理员密码
 * @param {string} password 输入的密码
 * @returns {boolean} 验证是否通过
 */
export function verifyAdmin(password) {
  return password === ADMIN_PASSWORD;
}

/**
 * 为API路由创建中间件，验证管理员权限
 * @param {Function} handler 下一个处理函数
 * @returns {Function} 处理函数
 */
export function withAdminAuth(handler) {
  return async (req, res) => {
    const { adminPassword } = req.body;
    
    if (!verifyAdmin(adminPassword)) {
      return res.status(403).json({
        success: false,
        error: '权限不足',
        message: '需要管理员权限才能执行此操作'
      });
    }
    
    return handler(req, res);
  };
} 