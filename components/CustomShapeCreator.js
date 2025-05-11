import { useState, useRef, useEffect } from "react";
import { 
  X, Save, Trash2, PencilLine, Eraser, Circle, Square, Triangle
} from "lucide-react";

/**
 * 自定义形状创建器组件
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否显示模态窗口
 * @param {Function} props.onClose - 关闭模态窗口的回调函数
 * @param {Function} props.onSave - 保存自定义形状的回调函数
 * @param {Object} props.editingShape - 正在编辑的形状（如果是编辑模式）
 */
const CustomShapeCreator = ({ isOpen, onClose, onSave, editingShape = null }) => {
  // 画布引用
  const canvasRef = useRef(null);
  // 绘制状态
  const [isDrawing, setIsDrawing] = useState(false);
  // 形状名称
  const [shapeName, setShapeName] = useState("");
  // 工具类型（画笔、橡皮擦、形状等）
  const [tool, setTool] = useState("pen");
  // 画笔颜色
  const [penColor, setPenColor] = useState("#000000");
  // 画笔宽度
  const [penWidth, setPenWidth] = useState(3);
  // 形状类型（用于基础形状工具）
  const [shapeType, setShapeType] = useState("rectangle");
  // 临时点（用于存储绘制形状的起始点）
  const [startPoint, setStartPoint] = useState(null);
  // 预览点（用于实时预览正在绘制的形状）
  const [previewPoint, setPreviewPoint] = useState(null);
  // 工具历史记录（用于撤销）
  const [history, setHistory] = useState([]);
  // 当前历史步骤
  const [currentStep, setCurrentStep] = useState(-1);

  // 如果是编辑模式，初始化形状名称和加载图像
  useEffect(() => {
    if (editingShape) {
      setShapeName(editingShape.name || "");
      // 如果有画布和图像数据，加载到画布
      if (canvasRef.current && editingShape.data) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          // 清除画布
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 绘制图像
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // 保存初始状态到历史记录
          saveToHistory();
        };
        img.src = editingShape.data;
      }
    }
  }, [editingShape, canvasRef]);

  // 初始化画布
  useEffect(() => {
    if (canvasRef.current && isOpen) {
      initializeCanvas();
    }
  }, [isOpen]);

  // 初始化画布
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    // 用白色填充画布
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 重置所有状态
    setIsDrawing(false);
    setTool("pen");
    setPenColor("#000000");
    setPenWidth(3);
    setShapeType("rectangle");
    setStartPoint(null);
    setPreviewPoint(null);
    setHistory([]);
    setCurrentStep(-1);
    
    // 如果不是编辑模式，清空形状名称
    if (!editingShape) {
      setShapeName("");
    }
    
    // 保存初始状态到历史记录
    saveToHistory();
  };

  // 保存当前画布状态到历史记录
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = canvas.toDataURL();
    
    // 如果当前不是最新的一步，需要删除后面的历史
    if (currentStep < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, currentStep + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, imageData]);
    setCurrentStep(prevCurrentStep => prevCurrentStep + 1);
  };

  // 撤销上一步操作
  const undo = () => {
    if (currentStep <= 0) return; // 没有更多历史记录
    
    const newStep = currentStep - 1;
    const imageToRestore = history[newStep];
    
    if (imageToRestore && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = imageToRestore;
      
      setCurrentStep(newStep);
    }
  };

  // 清除画布
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    // 用白色填充画布
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 保存到历史记录
    saveToHistory();
  };

  // 获取鼠标或触摸事件的坐标
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // 计算内部画布大小与显示大小之间的缩放因子
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // 获取原始坐标
    const x = (e.nativeEvent.offsetX || (e.nativeEvent.touches?.[0]?.clientX - rect.left)) * scaleX;
    const y = (e.nativeEvent.offsetY || (e.nativeEvent.touches?.[0]?.clientY - rect.top)) * scaleY;
    
    return { x, y };
  };

  // 开始绘制
  const startDrawing = (e) => {
    // 防止默认行为（如触摸滚动）
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
    // 如果是形状工具，记录起始点
    if (tool === 'shape') {
      setStartPoint({ x, y });
      setPreviewPoint({ x, y }); // 初始时预览点与起始点相同
      setIsDrawing(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // 开始新路径
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // 设置绘制样式
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penWidth * 2; // 橡皮擦稍大一些
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    
    setIsDrawing(true);
  };

  // 绘制
  const draw = (e) => {
    if (!isDrawing) return;
    
    // 防止默认行为（如触摸滚动）
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
    // 如果是形状工具，更新预览点
    if (tool === 'shape' && startPoint) {
      setPreviewPoint({ x, y });
      
      // 在预览模式下，我们需要在每次移动时清除并重绘画布
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      
      // 如果有历史记录，先恢复最后一个状态
      if (history.length > 0) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // 然后绘制当前预览形状
          drawPreviewShape(ctx, startPoint, { x, y }, shapeType);
        };
        img.src = history[currentStep];
      }
      
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // 绘制预览形状
  const drawPreviewShape = (ctx, start, end, type) => {
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.fillStyle = 'transparent';
    
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    ctx.beginPath();
    
    switch (type) {
      case 'rectangle':
        ctx.rect(start.x, start.y, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        break;
      case 'triangle':
        ctx.moveTo(start.x, start.y + height);
        ctx.lineTo(start.x + width / 2, start.y);
        ctx.lineTo(start.x + width, start.y + height);
        ctx.closePath();
        break;
      default:
        ctx.rect(start.x, start.y, width, height);
    }
    
    ctx.stroke();
  };

  // 停止绘制
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    // 如果是形状工具并且有起始点和预览点，绘制最终形状
    if (tool === 'shape' && startPoint && previewPoint) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      
      // 设置绘制样式
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      
      // 绘制最终形状
      drawPreviewShape(ctx, startPoint, previewPoint, shapeType);
      
      // 重置点
      setStartPoint(null);
      setPreviewPoint(null);
    }
    
    // 重置绘图模式
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalCompositeOperation = 'source-over';
    }
    
    setIsDrawing(false);
    
    // 保存到历史记录
    saveToHistory();
  };

  // 选择工具
  const selectTool = (selectedTool) => {
    setTool(selectedTool);
  };

  // 选择形状类型
  const selectShapeType = (type) => {
    setShapeType(type);
    setTool('shape');
  };

  // 保存自定义形状
  const saveCustomShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 验证形状名称
    if (!shapeName.trim()) {
      showToast("请输入形状名称");
      return;
    }
    
    // 获取画布数据
    const shapeData = canvas.toDataURL('image/png');
    
    // 创建自定义形状对象
    const customShape = {
      id: editingShape?.id || `custom-${Date.now()}`,
      name: shapeName.trim(),
      data: shapeData,
      isCustom: true,
      timestamp: new Date().toISOString()
    };
    
    // 调用保存回调
    onSave(customShape);
    
    // 关闭模态窗口
    onClose();
  };

  // 如果模态窗口未打开，不渲染任何内容
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full">
        {/* 模态窗口头部 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-medium text-gray-900">
            {editingShape ? "编辑自定义形状" : "创建自定义形状"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 模态窗口内容 */}
        <div className="p-5">
          {/* 形状名称输入 */}
          <div className="mb-5">
            <label htmlFor="shapeName" className="block text-sm font-medium text-gray-700 mb-1">
              形状名称
            </label>
            <input
              type="text"
              id="shapeName"
              value={shapeName}
              onChange={(e) => setShapeName(e.target.value)}
              placeholder="输入自定义形状名称"
              className="mt-1 block w-full border-0 border-b-2 border-gray-200 px-3 py-2.5 bg-gray-50 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-200"
              required
            />
          </div>
          
          {/* 绘图工具栏 */}
          <div className="mb-5 flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl shadow-sm">
            {/* 画笔工具 */}
            <button
              onClick={() => selectTool('pen')}
              className={`p-2.5 rounded-lg ${tool === 'pen' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
              title="画笔"
            >
              <PencilLine className="w-5 h-5" />
            </button>
            
            {/* 橡皮擦工具 */}
            <button
              onClick={() => selectTool('eraser')}
              className={`p-2.5 rounded-lg ${tool === 'eraser' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
              title="橡皮擦"
            >
              <Eraser className="w-5 h-5" />
            </button>
            
            {/* 分隔线 */}
            <div className="h-8 w-px bg-gray-200 mx-1" />
            
            {/* 矩形工具 */}
            <button
              onClick={() => selectShapeType('rectangle')}
              className={`p-2.5 rounded-lg ${tool === 'shape' && shapeType === 'rectangle' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
              title="矩形"
            >
              <Square className="w-5 h-5" />
            </button>
            
            {/* 圆形工具 */}
            <button
              onClick={() => selectShapeType('circle')}
              className={`p-2.5 rounded-lg ${tool === 'shape' && shapeType === 'circle' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
              title="圆形"
            >
              <Circle className="w-5 h-5" />
            </button>
            
            {/* 三角形工具 */}
            <button
              onClick={() => selectShapeType('triangle')}
              className={`p-2.5 rounded-lg ${tool === 'shape' && shapeType === 'triangle' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-200`}
              title="三角形"
            >
              <Triangle className="w-5 h-5" />
            </button>
            
            {/* 分隔线 */}
            <div className="h-8 w-px bg-gray-200 mx-1" />
            
            {/* 画笔颜色选择器 */}
            <div className="flex items-center">
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="w-9 h-9 p-0.5 rounded-lg shadow-sm cursor-pointer"
                title="画笔颜色"
              />
            </div>
            
            {/* 画笔粗细选择器 */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">粗细:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={penWidth}
                onChange={(e) => setPenWidth(parseInt(e.target.value))}
                className="w-24 accent-blue-500"
                title="画笔粗细"
              />
              <span className="text-xs text-gray-600 min-w-[30px] text-center">{penWidth}px</span>
            </div>
            
            {/* 分隔线 */}
            <div className="h-8 w-px bg-gray-200 mx-1" />
            
            {/* 撤销按钮 */}
            <button
              onClick={undo}
              disabled={currentStep <= 0}
              className={`p-2.5 rounded-lg transition-all duration-200 ${currentStep <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              title="撤销"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14L4 9l5-5"/>
                <path d="M4 9h16c1.5 0 3 2 3 4.5S21.5 18 20 18H12"/>
              </svg>
            </button>
            
            {/* 清除按钮 */}
            <button
              onClick={clearCanvas}
              className="p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="清除画布"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* 绘图画布 */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full touch-none hover:cursor-crosshair bg-white transition-all duration-300"
            />
          </div>
          
          {/* 底部按钮 */}
          <div className="flex justify-end space-x-3 mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={saveCustomShape}
              className="px-5 py-2.5 rounded-lg border border-transparent shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              保存形状
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 显示一个现代风格的提示框
 * @param {string} message - 提示信息
 * @param {number} duration - 显示时长(毫秒)，默认3000ms
 */
function showToast(message, duration = 3000) {
  // 防止重复创建
  const existingToast = document.querySelector('.modern-toast-container');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }
  
  // 创建toast容器
  const toastContainer = document.createElement('div');
  toastContainer.className = 'modern-toast-container';
  
  // 创建toast内容
  const toast = document.createElement('div');
  toast.className = 'modern-toast';
  
  // 添加图标
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,17L12,17c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1h0 c0.55,0,1,0.45,1,1v4C13,16.55,12.55,17,12,17z M13,9h-2V7h2V9z"/></svg>';
  
  // 添加消息文本
  const messageElement = document.createElement('div');
  messageElement.className = 'toast-message';
  messageElement.textContent = message;
  
  // 组合toast元素
  toast.appendChild(icon);
  toast.appendChild(messageElement);
  toastContainer.appendChild(toast);
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .modern-toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }
    
    .modern-toast {
      display: flex;
      align-items: center;
      min-width: 250px;
      max-width: 80vw;
      background-color: rgba(50, 50, 50, 0.95);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-top: -100px;
      opacity: 0;
      transition: all 0.3s ease;
      animation: slideDown 0.3s ease forwards;
    }
    
    .toast-icon {
      color: #2196F3;
      margin-right: 12px;
      display: flex;
      align-items: center;
    }
    
    .toast-message {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
    
    @keyframes slideDown {
      to {
        margin-top: 0;
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  `;
  
  // 添加到DOM
  document.head.appendChild(style);
  document.body.appendChild(toastContainer);
  
  // 设置消失动画和删除元素
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    
    setTimeout(() => {
      if (document.body.contains(toastContainer)) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, duration);
}

export default CustomShapeCreator; 