/**
 * 画幅分享工具函数
 * 负责处理画布数据的序列化、反序列化、生成分享链接等功能
 */
import LZString from 'lz-string';

/**
 * 判断是否在客户端环境
 * @returns {boolean} - 是否在客户端环境
 */
const isClient = () => typeof window !== 'undefined';

/**
 * 将画布数据序列化为URL安全的字符串
 * @param {Object} drawingData - 画布数据对象
 * @returns {string} - 序列化且URL安全的字符串
 */
export const serializeDrawing = (drawingData) => {
  // 确保只在客户端执行
  if (!isClient()) {
    return null;
  }

  try {
    // 创建简化的对象，只包含必要信息
    const essentialData = {
      canvasData: drawingData.data,
      prompt: drawingData.prompt || '未命名画作',
      timestamp: new Date().toISOString()
    };
    
    // 转换为JSON并使用LZ-String压缩
    const jsonString = JSON.stringify(essentialData);
    const compressedData = LZString.compressToEncodedURIComponent(jsonString);
    
    return compressedData;
  } catch (error) {
    console.error('序列化画布数据失败:', error);
    return null;
  }
};

/**
 * 从序列化的字符串中解析画布数据
 * @param {string} serializedData - 序列化的字符串
 * @returns {Object|null} - 解析后的画布数据对象，解析失败返回null
 */
export const deserializeDrawing = (serializedData) => {
  // 确保只在客户端执行
  if (!isClient()) {
    return null;
  }

  try {
    // 使用LZ-String解压缩数据
    const jsonString = LZString.decompressFromEncodedURIComponent(serializedData);
    const drawingData = JSON.parse(jsonString);
    
    return drawingData;
  } catch (error) {
    // 尝试使用旧方法解析（向后兼容）
    try {
      const jsonString = decodeURIComponent(atob(serializedData));
      const drawingData = JSON.parse(jsonString);
      return drawingData;
    } catch (fallbackError) {
      console.error('解析序列化数据失败:', error, fallbackError);
      return null;
    }
  }
};

/**
 * 生成分享链接
 * @param {Object} drawingData - 画布数据对象
 * @returns {string} - 生成的完整分享链接
 */
export const generateShareLink = (drawingData) => {
  // 确保只在客户端执行
  if (!isClient()) {
    return null;
  }

  const serializedData = serializeDrawing(drawingData);
  
  if (!serializedData) {
    return null;
  }
  
  // 构建URL，使用hash部分存储数据，避免服务器处理
  const currentUrl = window.location.origin + window.location.pathname;
  return `${currentUrl}#shared=${serializedData}`;
};

/**
 * 验证分享链接格式是否有效
 * @param {string} shareLink - 要验证的分享链接
 * @returns {boolean} - 链接格式是否有效
 */
export const validateShareLink = (shareLink) => {
  // 确保只在客户端执行
  if (!isClient()) {
    return false;
  }

  try {
    // 提取hash部分
    const url = new URL(shareLink);
    const hash = url.hash;
    
    // 检查是否有shared参数
    if (!hash || !hash.includes('#shared=')) {
      // 检查是否是短链接
      if (url.pathname.startsWith('/s/')) {
        return true; // 短链接格式有效
      }
      return false;
    }
    
    // 提取并验证序列化数据
    const serializedData = hash.replace('#shared=', '');
    const drawingData = deserializeDrawing(serializedData);
    
    // 验证反序列化的数据是否有效
    return (
      drawingData && 
      typeof drawingData === 'object' && 
      drawingData.canvasData && 
      typeof drawingData.canvasData === 'string'
    );
  } catch (error) {
    console.error('验证分享链接失败:', error);
    return false;
  }
};

/**
 * 从当前URL中提取分享数据
 * @returns {Object|null} - 从URL中提取的画布数据，如果没有则返回null
 */
export const extractSharedDataFromUrl = () => {
  // 确保只在客户端执行
  if (!isClient()) {
    return null;
  }

  try {
    // 检查URL中是否包含分享数据
    if (!window.location.hash || !window.location.hash.includes('#shared=')) {
      return null;
    }
    
    // 提取序列化数据
    const serializedData = window.location.hash.replace('#shared=', '');
    return deserializeDrawing(serializedData);
  } catch (error) {
    console.error('从URL提取分享数据失败:', error);
    return null;
  }
};

/**
 * 清除URL中的分享参数
 */
export const clearShareParamsFromUrl = () => {
  // 确保只在客户端执行
  if (!isClient()) {
    return;
  }

  // 使用history API修改URL，不刷新页面
  if (window.history && window.history.replaceState) {
    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState({}, document.title, cleanUrl);
  }
};

/**
 * 生成短链接
 * @param {Object} drawingData - 画布数据对象
 * @returns {Promise<string>} - 生成的短链接
 */
export const generateShortLink = async (drawingData) => {
  // 确保只在客户端执行
  if (!isClient()) {
    return null;
  }

  try {
    const serializedData = serializeDrawing(drawingData);
    
    if (!serializedData) {
      throw new Error('序列化数据失败');
    }
    
    // 超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    try {
      // 记录请求详情（用于调试）
      console.log('短链接请求开始，使用方法: POST');
      
      // 尝试POST方法
      let response;
      try {
        response = await fetch('/api/shortlink', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: serializedData }),
          signal: controller.signal
        });
      } catch (postError) {
        console.warn('POST方法请求失败，尝试GET方法:', postError);
        
        // 如果POST失败，尝试GET方法（作为后备）
        const queryParams = new URLSearchParams({ data: serializedData });
        response = await fetch(`/api/shortlink?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
      }
      
      clearTimeout(timeoutId);
      
      // 记录响应状态（用于调试）
      console.log('短链接服务响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('短链接服务响应错误:', response.status, errorText);
        throw new Error(`短链接生成请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      return data.shortUrl;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('生成短链接请求超时，请稍后再试');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('生成短链接失败:', error);
    // 返回错误信息而不是null，这样组件可以显示具体错误
    throw error;
  }
}; 