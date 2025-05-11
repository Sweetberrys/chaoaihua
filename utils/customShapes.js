/**
 * utils/customShapes.js
 * 自定义形状处理工具
 */

// 本地存储键名
const CUSTOM_SHAPES_STORAGE_KEY = 'geminiCustomShapes';

/**
 * 获取所有保存的自定义形状
 * @returns {Array} 自定义形状数组
 */
export const getCustomShapes = () => {
  // 确保只在客户端执行
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const storedShapes = localStorage.getItem(CUSTOM_SHAPES_STORAGE_KEY);
    if (storedShapes) {
      return JSON.parse(storedShapes);
    }
  } catch (err) {
    console.error('读取自定义形状失败:', err);
  }
  return [];
};

/**
 * 保存自定义形状
 * @param {Object} shape - 自定义形状对象
 * @returns {Array} 更新后的自定义形状数组
 */
export const saveCustomShape = (shape) => {
  // 确保只在客户端执行
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const shapes = getCustomShapes();
    
    // 查找是否已存在同ID形状（用于更新）
    const existingIndex = shapes.findIndex(s => s.id === shape.id);
    
    if (existingIndex >= 0) {
      // 更新现有形状
      shapes[existingIndex] = shape;
    } else {
      // 添加新形状
      shapes.unshift(shape); // 添加到数组开头
    }
    
    // 限制最大数量为30个
    const limitedShapes = shapes.slice(0, 30);
    
    // 保存到本地存储
    localStorage.setItem(CUSTOM_SHAPES_STORAGE_KEY, JSON.stringify(limitedShapes));
    
    return limitedShapes;
  } catch (err) {
    console.error('保存自定义形状失败:', err);
    return getCustomShapes(); // 返回原始状态
  }
};

/**
 * 删除自定义形状
 * @param {string} shapeId - 要删除的形状ID
 * @returns {Array} 更新后的自定义形状数组
 */
export const deleteCustomShape = (shapeId) => {
  // 确保只在客户端执行
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const shapes = getCustomShapes();
    const filteredShapes = shapes.filter(s => s.id !== shapeId);
    
    // 保存到本地存储
    localStorage.setItem(CUSTOM_SHAPES_STORAGE_KEY, JSON.stringify(filteredShapes));
    
    return filteredShapes;
  } catch (err) {
    console.error('删除自定义形状失败:', err);
    return getCustomShapes(); // 返回原始状态
  }
};

/**
 * 渲染自定义形状到画布
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {string} shapeData - 形状图像数据URL
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} size - 尺寸
 * @param {Function} onComplete - 绘制完成回调函数
 */
export const drawCustomShape = (ctx, shapeData, x, y, size, onComplete = null) => {
  if (!ctx || !shapeData) return;
  
  const img = new Image();
  
  img.onload = () => {
    // 保存当前上下文状态
    ctx.save();
    
    // 获取图像原始宽高比
    const aspectRatio = img.width / img.height;
    
    // 计算绘制尺寸，保持纵横比
    let drawWidth, drawHeight;
    
    if (aspectRatio >= 1) {
      // 宽度等于指定尺寸
      drawWidth = size;
      drawHeight = size / aspectRatio;
    } else {
      // 高度等于指定尺寸
      drawHeight = size;
      drawWidth = size * aspectRatio;
    }
    
    // 计算绘制坐标，使形状中心与指定坐标对齐
    const drawX = x - (drawWidth / 2);
    const drawY = y - (drawHeight / 2);
    
    // 绘制图像
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    
    // 恢复上下文状态
    ctx.restore();
    
    // 如果有完成回调，执行它
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };
  
  img.onerror = (err) => {
    console.error('绘制自定义形状失败:', err);
    // 如果有完成回调，执行它
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };
  
  // 设置图像源
  img.src = shapeData;
};

/**
 * 创建自定义形状预览元素
 * @param {string} shapeData - 形状图像数据URL
 * @param {Object} options - 预览选项
 * @returns {HTMLCanvasElement} 预览画布元素
 */
export const createCustomShapePreview = (shapeData, options = {}) => {
  // 确保只在客户端执行
  if (typeof window === 'undefined') {
    return null;
  }
  
  const { width = 60, height = 60, showBackground = true } = options;
  
  // 创建预览画布
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // 绘制背景
  if (showBackground) {
    ctx.fillStyle = '#f9fafb'; // 浅灰色背景
    ctx.fillRect(0, 0, width, height);
  }
  
  // 绘制形状
  drawCustomShape(ctx, shapeData, width / 2, height / 2, Math.min(width, height) * 0.8);
  
  return canvas;
}; 