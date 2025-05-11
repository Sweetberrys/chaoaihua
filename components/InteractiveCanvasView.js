import { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw, RefreshCw } from "lucide-react";
import { createInteractiveCanvas } from "../utils/interactiveCanvas";

/**
 * 交互式画布视图组件
 * 封装了高级缩放和平移功能的画布组件
 * 
 * @param {Object} props 
 * @returns {JSX.Element}
 */
const InteractiveCanvasView = ({
  width = 1280,          // 画布宽度
  height = 720,          // 画布高度
  initialScale = 1,      // 初始缩放比例
  minScale = 0.5,        // 最小缩放比例
  maxScale = 10,         // 最大缩放比例
  onDraw = null,         // 绘制回调函数
  onCoordinatesChanged = null, // 坐标变换回调
  onScaleChanged = null, // 缩放变化回调
  backgroundImage = null, // 背景图像
  className = "",        // 附加类名
  showControls = true,   // 显示控制按钮
}) => {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);
  const [scale, setScale] = useState(initialScale);
  const [transform, setTransform] = useState({ scale: initialScale, offsetX: 0, offsetY: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始化交互式画布控制器
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const options = {
      minScale,
      maxScale,
      initialScale,
      onTransform: (newTransform) => {
        setTransform(newTransform);
        setScale(newTransform.scale);
        
        if (onScaleChanged) {
          onScaleChanged(newTransform.scale);
        }
        
        if (onCoordinatesChanged) {
          onCoordinatesChanged(newTransform);
        }
        
        // 触发重绘
        renderCanvas();
      }
    };
    
    const controller = createInteractiveCanvas(canvasRef, options);
    controller.initialize();
    controllerRef.current = controller;
    setIsInitialized(true);
    
    // 如果提供了背景图像，初始绘制
    if (backgroundImage) {
      loadAndDrawBackground();
    } else {
      renderCanvas();
    }
    
    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
      }
    };
  }, []);
  
  // 当背景图像更改时重绘
  useEffect(() => {
    if (backgroundImage && isInitialized) {
      loadAndDrawBackground();
    }
  }, [backgroundImage, isInitialized]);
  
  // 加载并绘制背景图像
  const loadAndDrawBackground = () => {
    const img = new Image();
    img.onload = () => {
      renderCanvas(img);
    };
    img.onerror = (err) => {
      console.error("背景图像加载失败:", err);
      renderCanvas(); // 仍然渲染画布，但没有背景
    };
    img.src = backgroundImage;
  };
  
  // 渲染画布内容
  const renderCanvas = (backgroundImg = null) => {
    if (!controllerRef.current) return;
    
    controllerRef.current.renderCanvas((ctx, transformState) => {
      // 首先绘制白色背景
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      
      // 如果有背景图像，绘制背景
      if (backgroundImg) {
        ctx.drawImage(backgroundImg, 0, 0, width, height);
      }
      
      // 调用自定义绘制回调
      if (typeof onDraw === "function") {
        onDraw(ctx, transformState);
      }
    });
  };
  
  // 放大
  const handleZoomIn = () => {
    if (controllerRef.current) {
      controllerRef.current.zoomIn();
    }
  };
  
  // 缩小
  const handleZoomOut = () => {
    if (controllerRef.current) {
      controllerRef.current.zoomOut();
    }
  };
  
  // 重置变换
  const handleResetTransform = () => {
    if (controllerRef.current) {
      controllerRef.current.resetTransform();
    }
  };
  
  // 撤销变换
  const handleUndoTransform = () => {
    if (controllerRef.current) {
      controllerRef.current.undoTransform();
    }
  };
  
  // 导出画布坐标转换函数供父组件使用
  const getCanvasCoordinates = (event) => {
    if (!controllerRef.current) return { x: 0, y: 0 };
    return controllerRef.current.getCanvasCoordinates(event);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* 画布元素 */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full touch-none cursor-grab active:cursor-grabbing border border-gray-300 rounded-lg shadow-sm"
        style={{ backgroundColor: "white" }}
      />
      
      {/* 控制按钮组 */}
      {showControls && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
            title="放大"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
            title="缩小"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleUndoTransform}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
            title="撤销变换"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={handleResetTransform}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
            title="重置视图"
          >
            <RefreshCw size={20} />
          </button>
          <div className="flex items-center bg-white rounded-full px-3 shadow-md text-sm font-medium">
            {Math.round(scale * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCanvasView; 