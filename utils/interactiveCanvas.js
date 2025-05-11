/**
 * interactiveCanvas.js
 * 提供高级交互式画布功能，支持高倍率缩放和平移
 */
import { useState, useEffect, useRef } from "react";

// 默认配置
const DEFAULT_CONFIG = {
  minScale: 0.5,       // 最小缩放比例
  maxScale: 10,        // 最大缩放比例（支持高倍率）
  scaleStep: 0.1,      // 缩放每步的增量
  panEnabled: true,    // 允许平移
  mobileGesturesEnabled: true, // 移动端手势
  desktopGesturesEnabled: true, // 桌面端手势
  wheelZoomEnabled: true, // 鼠标滚轮缩放
  altKeyForZoom: true, // 使用Alt+滚轮缩放
  useHistory: true     // 使用历史记录系统
};

/**
 * 创建交互式画布控制器
 * @param {Object} canvasRef - React canvas引用
 * @param {Object} options - 配置选项
 * @returns {Object} - 画布控制器API
 */
export function createInteractiveCanvas(canvasRef, options = {}) {
  // 合并默认配置与自定义配置
  const config = { ...DEFAULT_CONFIG, ...options };
  
  // 状态变量
  let isPanning = false;
  let lastPanPoint = null;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let gestureStartScale = 1;
  let transformHistory = [];
  let historyIndex = -1;

  /**
   * 保存当前变换状态到历史记录
   */
  const saveTransformToHistory = () => {
    if (!config.useHistory) return;
    
    // 如果当前不是最新的一步，需要删除后面的历史
    if (historyIndex < transformHistory.length - 1) {
      transformHistory = transformHistory.slice(0, historyIndex + 1);
    }
    
    transformHistory.push({
      scale,
      offsetX,
      offsetY
    });
    
    historyIndex = transformHistory.length - 1;
  };

  /**
   * 撤销变换
   */
  const undoTransform = () => {
    if (!config.useHistory || historyIndex <= 0) return false;
    
    historyIndex--;
    const prevState = transformHistory[historyIndex];
    
    if (prevState) {
      scale = prevState.scale;
      offsetX = prevState.offsetX;
      offsetY = prevState.offsetY;
      applyTransform();
      return true;
    }
    
    return false;
  };

  /**
   * 重做变换
   */
  const redoTransform = () => {
    if (!config.useHistory || historyIndex >= transformHistory.length - 1) return false;
    
    historyIndex++;
    const nextState = transformHistory[historyIndex];
    
    if (nextState) {
      scale = nextState.scale;
      offsetX = nextState.offsetX;
      offsetY = nextState.offsetY;
      applyTransform();
      return true;
    }
    
    return false;
  };

  /**
   * 应用当前变换到画布
   */
  const applyTransform = () => {
    if (!canvasRef.current) return;
    
    // 确保缩放比例在允许范围内
    scale = Math.max(config.minScale, Math.min(config.maxScale, scale));
    
    // 触发重绘回调（如果提供）
    if (typeof config.onTransform === 'function') {
      config.onTransform({
        scale,
        offsetX,
        offsetY
      });
    }
  };

  /**
   * 设置缩放级别
   * @param {number} newScale - 新的缩放级别
   * @param {Object} centerPoint - 缩放中心点 {x, y}
   */
  const setScale = (newScale, centerPoint = null) => {
    if (!canvasRef.current) return;
    
    const oldScale = scale;
    scale = Math.max(config.minScale, Math.min(config.maxScale, newScale));
    
    if (scale === oldScale) return;
    
    // 如果提供了中心点，则围绕该点进行缩放
    if (centerPoint) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // 计算中心点相对于画布的位置
      const pointXRelative = (centerPoint.x - rect.left) / rect.width;
      const pointYRelative = (centerPoint.y - rect.top) / rect.height;
      
      // 调整偏移量以保持中心点不变
      const scaleFactor = scale / oldScale;
      offsetX = centerPoint.x - (centerPoint.x - offsetX) * scaleFactor;
      offsetY = centerPoint.y - (centerPoint.y - offsetY) * scaleFactor;
    }
    
    applyTransform();
    saveTransformToHistory();
  };

  /**
   * 放大操作
   * @param {Object} centerPoint - 放大中心点 {x, y}
   */
  const zoomIn = (centerPoint = null) => {
    setScale(scale + config.scaleStep, centerPoint);
  };

  /**
   * 缩小操作
   * @param {Object} centerPoint - 缩小中心点 {x, y}
   */
  const zoomOut = (centerPoint = null) => {
    setScale(scale - config.scaleStep, centerPoint);
  };

  /**
   * 重置变换
   */
  const resetTransform = () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
    saveTransformToHistory();
  };

  /**
   * 平移到指定位置
   * @param {number} x - X轴偏移量
   * @param {number} y - Y轴偏移量
   */
  const panTo = (x, y) => {
    if (!config.panEnabled) return;
    
    offsetX = x;
    offsetY = y;
    applyTransform();
    saveTransformToHistory();
  };

  /**
   * 处理滚轮事件
   * @param {Object} event - 滚轮事件
   */
  const handleWheel = (event) => {
    if (!config.wheelZoomEnabled) return;
    
    // 检查是否需要Alt键
    if (config.altKeyForZoom && !event.altKey) return;
    
    event.preventDefault();
    
    const delta = event.deltaY || event.detail || event.wheelDelta;
    
    if (delta > 0) {
      zoomOut({ x: event.clientX, y: event.clientY });
    } else {
      zoomIn({ x: event.clientX, y: event.clientY });
    }
  };

  /**
   * 处理鼠标按下事件
   * @param {Object} event - 鼠标事件
   */
  const handleMouseDown = (event) => {
    if (!config.panEnabled || event.button !== 0) return; // 只响应左键
    
    // 中键或按下空格键时启用平移模式
    if (event.button === 1 || (event.button === 0 && event.spaceKey)) {
      isPanning = true;
      lastPanPoint = { x: event.clientX, y: event.clientY };
      
      // 更改光标样式
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
      
      event.preventDefault();
    }
  };

  /**
   * 处理鼠标移动事件
   * @param {Object} event - 鼠标事件
   */
  const handleMouseMove = (event) => {
    if (!isPanning || !lastPanPoint) return;
    
    const deltaX = event.clientX - lastPanPoint.x;
    const deltaY = event.clientY - lastPanPoint.y;
    
    offsetX += deltaX;
    offsetY += deltaY;
    
    lastPanPoint = { x: event.clientX, y: event.clientY };
    
    applyTransform();
    event.preventDefault();
  };

  /**
   * 处理鼠标释放事件
   */
  const handleMouseUp = () => {
    if (isPanning) {
      isPanning = false;
      lastPanPoint = null;
      
      // 恢复光标样式
      if (canvasRef.current) {
        canvasRef.current.style.cursor = '';
      }
      
      saveTransformToHistory();
    }
  };

  /**
   * 处理触摸开始事件
   * @param {Object} event - 触摸事件
   */
  const handleTouchStart = (event) => {
    if (!config.mobileGesturesEnabled) return;
    
    event.preventDefault();
    
    const touches = event.touches;
    
    // 单指触摸 - 准备平移
    if (touches.length === 1) {
      isPanning = true;
      lastPanPoint = { 
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    } 
    // 双指触摸 - 准备缩放
    else if (touches.length === 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // 计算初始触摸点之间的距离
      const initialDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      gestureStartScale = scale;
      lastPanPoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance: initialDistance
      };
    }
  };

  /**
   * 处理触摸移动事件
   * @param {Object} event - 触摸事件
   */
  const handleTouchMove = (event) => {
    if (!config.mobileGesturesEnabled || !lastPanPoint) return;
    
    event.preventDefault();
    
    const touches = event.touches;
    
    // 单指移动 - 平移
    if (touches.length === 1 && isPanning) {
      const deltaX = touches[0].clientX - lastPanPoint.x;
      const deltaY = touches[0].clientY - lastPanPoint.y;
      
      offsetX += deltaX;
      offsetY += deltaY;
      
      lastPanPoint = {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
      
      applyTransform();
    } 
    // 双指移动 - 缩放和平移
    else if (touches.length === 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // 计算当前两指间距离
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // 计算缩放比例变化
      const scaleDelta = currentDistance / lastPanPoint.distance;
      const newScale = gestureStartScale * scaleDelta;
      
      // 计算中心点
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      // 应用缩放
      setScale(newScale, { x: centerX, y: centerY });
      
      // 更新平移
      const deltaX = centerX - lastPanPoint.x;
      const deltaY = centerY - lastPanPoint.y;
      
      offsetX += deltaX;
      offsetY += deltaY;
      
      // 更新最后接触点
      lastPanPoint = {
        x: centerX,
        y: centerY,
        distance: currentDistance
      };
      
      applyTransform();
    }
  };

  /**
   * 处理触摸结束事件
   */
  const handleTouchEnd = () => {
    if (isPanning || lastPanPoint) {
      isPanning = false;
      lastPanPoint = null;
      saveTransformToHistory();
    }
  };

  /**
   * 获取坐标转换函数
   * 将屏幕坐标转换为画布坐标
   * @param {Object} event - 鼠标或触摸事件
   * @returns {Object} 转换后的坐标 {x, y}
   */
  const getCanvasCoordinates = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // 计算内部画布大小与显示大小之间的缩放因子
    const displayToCanvasScaleX = canvas.width / rect.width;
    const displayToCanvasScaleY = canvas.height / rect.height;
    
    // 获取相对于画布的坐标，考虑触摸事件
    const clientX = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const clientY = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
    
    // 计算相对于画布的原始坐标
    const rawX = (clientX - rect.left) * displayToCanvasScaleX;
    const rawY = (clientY - rect.top) * displayToCanvasScaleY;
    
    // 应用平移和缩放变换
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 考虑偏移和缩放
    const adjustedX = ((rawX - centerX) / scale) + centerX - (offsetX / scale);
    const adjustedY = ((rawY - centerY) / scale) + centerY - (offsetY / scale);
    
    return {
      x: adjustedX,
      y: adjustedY
    };
  };

  /**
   * 绘制变换后的画布内容
   * @param {Function} drawCallback - 绘制回调函数
   */
  const renderCanvas = (drawCallback) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 保存当前上下文状态
    ctx.save();
    
    // 清除画布
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 应用变换矩阵 (平移和缩放)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX + offsetX, centerY + offsetY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    
    // 执行绘制回调
    if (typeof drawCallback === 'function') {
      drawCallback(ctx, { scale, offsetX, offsetY });
    }
    
    // 恢复上下文状态
    ctx.restore();
  };

  /**
   * 绑定所有事件监听器
   */
  const bindEventListeners = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // 鼠标事件
    if (config.desktopGesturesEnabled) {
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      if (config.wheelZoomEnabled) {
        canvas.addEventListener('wheel', handleWheel, { passive: false });
      }
    }
    
    // 触摸事件
    if (config.mobileGesturesEnabled) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchcancel', handleTouchEnd);
    }
  };

  /**
   * 解绑所有事件监听器
   */
  const unbindEventListeners = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // 鼠标事件
    if (config.desktopGesturesEnabled) {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (config.wheelZoomEnabled) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    }
    
    // 触摸事件
    if (config.mobileGesturesEnabled) {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    }
  };

  /**
   * 初始化交互式画布
   */
  const initialize = () => {
    // 初始化变换历史记录
    transformHistory = [{
      scale: 1,
      offsetX: 0,
      offsetY: 0
    }];
    historyIndex = 0;
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始应用变换
    applyTransform();
  };

  /**
   * 销毁交互式画布控制器，移除事件监听器
   */
  const destroy = () => {
    unbindEventListeners();
  };

  // 导出API
  return {
    initialize,
    destroy,
    getCanvasCoordinates,
    renderCanvas,
    zoomIn,
    zoomOut,
    setScale,
    panTo,
    resetTransform,
    undoTransform,
    redoTransform,
    getTransform: () => ({ scale, offsetX, offsetY })
  };
}

/**
 * 创建React钩子来使用交互式画布
 * @param {Object} options - 配置选项
 * @returns {Object} - 钩子API
 */
export function useInteractiveCanvas(options = {}) {
  const canvasRef = useRef(null);
  const [controller, setController] = useState(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvasController = createInteractiveCanvas(canvasRef, options);
    canvasController.initialize();
    setController(canvasController);
    
    return () => {
      canvasController.destroy();
    };
  }, [canvasRef.current]);
  
  return {
    canvasRef,
    controller,
    ...controller
  };
} 