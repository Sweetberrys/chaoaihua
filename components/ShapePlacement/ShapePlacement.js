import React, { useRef, useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { drawShape } from '../../utils/shapes';
import { applyTransform } from '../../utils/shapeTransformer';

/**
 * 形状放置选框组件
 * 增强版支持：
 * 1. 鼠标精确定位 - 记录拖拽偏移量，确保鼠标指针始终位于开始拖拽的位置
 * 2. 边界处理 - 形状部分超出边界时提供视觉反馈，保持可见并可拖回
 * 3. 触摸设备支持 - 在移动设备上同样提供精确拖拽体验
 * 
 * @param {Object} props
 * @param {string} props.shapeId 形状ID
 * @param {number} props.x 位置X坐标
 * @param {number} props.y 位置Y坐标
 * @param {Object} props.transform 变换状态
 * @param {Object} props.shapeSettings 形状设置 (多边形边数、星形角数等)
 * @param {string} props.color 形状颜色
 * @param {boolean} props.isTouchingBoundary 是否接触边界
 * @param {Object} props.boundaryDirection 边界方向
 * @param {Function} props.onConfirm 确认回调
 * @param {Function} props.onCancel 取消回调
 * @param {Function} props.onMove 移动回调
 */
const ShapePlacement = ({ 
  shapeId, 
  x, 
  y, 
  transform, 
  shapeSettings, 
  color = '#000000', 
  isTouchingBoundary = false,
  boundaryDirection = { top: false, right: false, bottom: false, left: false },
  onConfirm, 
  onCancel,
  onMove 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverConfirmButton, setIsOverConfirmButton] = useState(false);
  const [isOverCancelButton, setIsOverCancelButton] = useState(false);
  
  // 新增：拖拽偏移量状态
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // 计算选框大小：形状尺寸加上一些边距
  const boxSize = transform.size * 1.5;
  
  // 按钮大小为选框的1/10
  const buttonSize = Math.max(20, boxSize / 10);
  
  // 绘制形状预览
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置绘制样式
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    
    // 计算中心点
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 保存当前状态
    ctx.save();
    
    // 应用变换 (翻转和旋转)
    applyTransform(ctx, centerX, centerY, transform);
    
    // 绘制形状
    drawShape(ctx, shapeId, centerX, centerY, transform.size, {
      points: shapeSettings?.starPoints,
      sides: shapeSettings?.polygonSides,
      innerRadius: shapeSettings?.starInnerRadius
    });
    
    // 恢复状态
    ctx.restore();
  }, [shapeId, transform, shapeSettings, color]);
  
  // 鼠标按下事件 - 开始拖动
  const handleMouseDown = (e) => {
    if (isOverConfirmButton || isOverCancelButton) return;
    
    // 防止事件冒泡
    e.stopPropagation();
    e.preventDefault();
    
    // 计算鼠标点击位置与形状中心的偏移量
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 记录偏移量 (鼠标位置相对于形状中心的偏移)
      setDragOffset({
        x: e.clientX - centerX,
        y: e.clientY - centerY
      });
    }
    
    // 设置拖动状态
    setIsDragging(true);
  };
  
  // 鼠标移动事件 - 拖动选框
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // 传递鼠标坐标和偏移量，实现精确跟随
    onMove(e.clientX, e.clientY, dragOffset);
  };
  
  // 鼠标抬起事件 - 停止拖动
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // 触摸开始事件 - 触摸屏支持
  const handleTouchStart = (e) => {
    if (isOverConfirmButton || isOverCancelButton) return;
    
    // 防止事件冒泡
    e.stopPropagation();
    e.preventDefault();
    
    // 获取触摸点
    if (e.touches[0] && containerRef.current) {
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 记录触摸点相对于形状中心的偏移量
      setDragOffset({
        x: touch.clientX - centerX,
        y: touch.clientY - centerY
      });
    }
    
    // 设置拖动状态
    setIsDragging(true);
  };
  
  // 触摸移动事件 - 触摸屏支持
  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches[0]) return;
    
    // 使用第一个触摸点的坐标，并考虑偏移量
    const touch = e.touches[0];
    onMove(touch.clientX, touch.clientY, dragOffset);
  };
  
  // 触摸结束事件 - 触摸屏支持
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // 确认按钮悬停状态
  const handleConfirmMouseEnter = () => setIsOverConfirmButton(true);
  const handleConfirmMouseLeave = () => setIsOverConfirmButton(false);
  
  // 取消按钮悬停状态
  const handleCancelMouseEnter = () => setIsOverCancelButton(true);
  const handleCancelMouseLeave = () => setIsOverCancelButton(false);
  
  // 添加全局鼠标事件监听，确保拖动时鼠标移出选框也能继续响应
  useEffect(() => {
    if (isDragging) {
      // 鼠标事件
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // 触摸事件
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }
    
    return () => {
      // 移除鼠标事件
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // 移除触摸事件
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, dragOffset, onMove]);
  
  return (
    <div 
      ref={containerRef}
      className="absolute"
      style={{
        left: x - boxSize / 2,
        top: y - boxSize / 2,
        width: boxSize,
        height: boxSize,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 100,
        transition: isDragging ? 'none' : 'border-color 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* 选框 */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 半透明边框 - 根据边界状态改变样式 */}
        <div 
          className={`absolute inset-0 border-2 border-dashed rounded-md ${isTouchingBoundary ? 'animate-pulse' : ''}`}
          style={{ 
            borderColor: isTouchingBoundary ? 'rgba(237, 108, 2, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            backgroundColor: 'rgba(200, 200, 200, 0.1)',
            boxShadow: isTouchingBoundary ? '0 0 5px rgba(237, 108, 2, 0.5)' : 'none'
          }}
        ></div>
        
        {/* 形状预览 */}
        <canvas
          ref={canvasRef}
          width={transform.size * 1.2}
          height={transform.size * 1.2}
          className="pointer-events-none"
        />
        
        {/* 坐标显示 - 显示边界信息 */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs bg-black/50 text-white py-1 px-2 rounded-b-md">
          X: {Math.round(x)}, Y: {Math.round(y)}
          {isTouchingBoundary && (
            <span className="ml-2 text-amber-300">
              {boundaryDirection.left && '◄'}
              {boundaryDirection.right && '►'}
              {boundaryDirection.top && '▲'}
              {boundaryDirection.bottom && '▼'}
            </span>
          )}
        </div>
        
        {/* 取消按钮 */}
        <button
          className="absolute left-0 top-0 flex items-center justify-center rounded-full bg-white/90 shadow-md cursor-pointer"
          style={{ 
            width: buttonSize, 
            height: buttonSize,
            transform: 'translate(-30%, -30%)',
            color: isOverCancelButton ? '#f44336' : '#666',
            border: `1px solid ${isOverCancelButton ? '#f44336' : '#ddd'}`
          }}
          onClick={onCancel}
          onMouseEnter={handleCancelMouseEnter}
          onMouseLeave={handleCancelMouseLeave}
          onMouseDown={(e) => e.stopPropagation()} // 防止触发拖动
        >
          <X size={buttonSize * 0.6} />
        </button>
        
        {/* 确认按钮 */}
        <button
          className="absolute right-0 top-0 flex items-center justify-center rounded-full bg-white/90 shadow-md cursor-pointer"
          style={{ 
            width: buttonSize, 
            height: buttonSize,
            transform: 'translate(30%, -30%)',
            color: isOverConfirmButton ? '#4caf50' : '#666',
            border: `1px solid ${isOverConfirmButton ? '#4caf50' : '#ddd'}`
          }}
          onClick={onConfirm}
          onMouseEnter={handleConfirmMouseEnter}
          onMouseLeave={handleConfirmMouseLeave}
          onMouseDown={(e) => e.stopPropagation()} // 防止触发拖动
        >
          <Check size={buttonSize * 0.6} />
        </button>
      </div>
    </div>
  );
};

export default ShapePlacement; 