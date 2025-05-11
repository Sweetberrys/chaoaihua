import { useState, useRef, useEffect } from "react";
import { 
  X, ArrowRight, Check, RefreshCw, Send, Trash2, Eraser, Upload, 
  Menu, Smile, FileImage, Brush, ChevronRight, ChevronLeft, Download, Save, 
  Image as ImageIcon, Plus, PencilLine, ZoomIn, ZoomOut, Square, Circle, 
  Triangle, Star, Hexagon, Moon, Heart, Diamond, Cloud, Droplet, Zap, 
  ArrowUp, Minus, Palette, MoreHorizontal, Pen, RotateCcw, Maximize2, Minimize,
  LoaderCircle, Share2, Copy, Key
} from "lucide-react";
import Head from "next/head";
import { 
  shapesLibrary, 
  drawShape as drawShapeUtil, 
  renderShapeIcon,
  createShapePreview
} from "../utils/shapes";
import {
  brushTypes,
  defaultBrushSettings,
  setBrushStyle,
  drawSpecialBrush,
  createBrushPreview
} from "../utils/brushes";
// 导入自定义形状组件和工具
import CustomShapeCreator from "../components/CustomShapeCreator";
import {
  getCustomShapes,
  saveCustomShape,
  deleteCustomShape,
  drawCustomShape,
  createCustomShapePreview
} from "../utils/customShapes";
// 导入公告组件
import Announcement from "../components/Announcement";
// 导入分享组件和工具
import DrawingShare from "../components/DrawingShare";
import { extractSharedDataFromUrl, clearShareParamsFromUrl } from "../utils/shareUtils";
// 移除API Key管理组件导入
// import ApiKeyManager from "../components/ApiKeyManager";
import ApiKeyStatus from '../components/ApiKeyStatus';
import Notification from '../components/Notification';
import { getApiKeyStatusSummary } from '../utils/apiKeyChecker';

export default function Home() {
  const canvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const colorInputRef = useRef(null);
  const apiKeyInputRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  // 新增状态
  const [isEraser, setIsEraser] = useState(false);
  const [penWidth, setPenWidth] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPenSettings, setShowPenSettings] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  // 导出相关状态
  const [showExportOptions, setShowExportOptions] = useState(false);
  // 弹窗位置相关状态
  const [penSettingsPosition, setPenSettingsPosition] = useState({ top: '100%', left: '0' });
  const [exportOptionsPosition, setExportOptionsPosition] = useState({ top: '100%', left: '0' });  
  // 按钮引用
  const penSettingsButtonRef = useRef(null);
  const exportOptionsButtonRef = useRef(null);
  // 保存画幅相关状态
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [currentDrawingIndex, setCurrentDrawingIndex] = useState(-1);
  const [showDrawingsList, setShowDrawingsList] = useState(false);
  // 编辑画幅名称相关状态
  const [editingDrawingId, setEditingDrawingId] = useState(null);
  const [editingDrawingName, setEditingDrawingName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 搜索关键词
  const [sortOrder, setSortOrder] = useState("newest"); // 排序方式: newest, oldest
  // 缩放相关状态
  const [scale, setScale] = useState(1); // 初始缩放比例为1（100%）
  
  // 形状侧边栏相关状态
  const [showShapesList, setShowShapesList] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shapeSettings, setShapeSettings] = useState({
    polygonSides: 6,     // 多边形边数
    starPoints: 5,       // 星形角数
    starInnerRadius: 0.4, // 星形内半径比例
    flipHorizontal: false, // 水平翻转
    flipVertical: false,   // 垂直翻转
    borderColor: '#000000', // 边框颜色
    fillColor: '',        // 填充颜色 (空字符串表示使用画笔颜色)
    borderStyle: 'solid',  // 边框样式：solid, dashed, dotted
    borderWidth: 2,        // 边框宽度
  });
  const [shapeSize, setShapeSize] = useState(100); // 默认形状大小
  
  // 笔触相关状态
  const [brushType, setBrushType] = useState('round'); // 默认使用圆形笔触
  const [showBrushSelector, setShowBrushSelector] = useState(false);
  const [brushSettings, setBrushSettings] = useState(defaultBrushSettings);
  const [prevPoint, setPrevPoint] = useState(null); // 用于特殊笔触的前一个点

  // 自定义形状相关状态
  const [customShapes, setCustomShapes] = useState([]);
  const [showCustomShapeCreator, setShowCustomShapeCreator] = useState(false);
  const [editingCustomShape, setEditingCustomShape] = useState(null);
  
  // 公告相关状态
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  
  // 公告内容数组
  const announcements = [
    { 
      message: "欢迎使用 Gemini 协作绘画工具！您可以在右侧形状库中使用自定义形状功能。", 
      type: "info" 
    },
    { 
      message: "新功能上线：自定义形状！您现在可以创建、保存和使用您自己设计的图形。", 
      type: "warning" 
    },
    { 
      message: "提示：使用键盘快捷键可以提高工作效率，按ESC可以退出全屏模式。", 
      type: "success" 
    }
  ];
  
  
  // 分享相关状态
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareOptionsPosition, setShareOptionsPosition] = useState({ top: '100%', left: '0' });
  const shareOptionsButtonRef = useRef(null);
  
  // 移除API Key管理相关状态
  // const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  // const [apiKeyManagerPosition, setApiKeyManagerPosition] = useState({ top: '100%', left: '0' });
  // const apiKeyManagerButtonRef = useRef(null);
  const [storedApiKey, setStoredApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState({ isValid: null, message: '' });
  const [checkingApiKey, setCheckingApiKey] = useState(false);
  
  // 系统API密钥状态
  const [systemApiKeyStatus, setSystemApiKeyStatus] = useState({ 
    status: 'unknown', 
    message: '正在检查系统API密钥...',
    hasEnoughKeys: false,
    validCount: 0,
    requiredCount: 10
  });
  
  // 状态变量用于缓存 apiEndpoint
  const [cachedApiEndpoint, setCachedApiEndpoint] = useState('huggingface');
  
  // 通知状态
  const [notification, setNotification] = useState(null);
  
  // Gemini API 密钥验证状态
  const [showApiKeyValidation, setShowApiKeyValidation] = useState(false);
  const [isApiKeyRequired, setIsApiKeyRequired] = useState(false);
  
  // 在客户端初始化时加载 apiEndpoint 和检查系统API密钥状态
  useEffect(() => {
    // 确保代码在客户端执行
    if (typeof window !== 'undefined') {
      const savedEndpoint = localStorage.getItem('apiEndpoint') || 'huggingface';
      setCachedApiEndpoint(savedEndpoint);
      
      // 检查系统API密钥状态
      checkSystemApiKeyStatus();
    }
  }, []);
  
  // 监听API端点变化，检查是否需要API密钥验证
  useEffect(() => {
    // 如果是Gemini API，检查API密钥状态
    if (cachedApiEndpoint === 'gemini') {
      setIsApiKeyRequired(true);
      
      // 检查API密钥是否有效
      if (!storedApiKey) {
        setShowApiKeyValidation(true);
      } else if (apiKeyStatus.isValid === false) {
        setShowApiKeyValidation(true);
      } else if (apiKeyStatus.isValid === null) {
        // 重新验证API密钥
        (async () => {
          const validationResult = await validateApiKey(storedApiKey);
          if (!validationResult || !validationResult.isValid) {
            setShowApiKeyValidation(true);
          } else {
            setShowApiKeyValidation(false);
          }
        })();
      } else {
        setShowApiKeyValidation(false);
      }
    } else {
      // 非Gemini API，不需要验证
      setIsApiKeyRequired(false);
      setShowApiKeyValidation(false);
    }
  }, [cachedApiEndpoint, storedApiKey, apiKeyStatus.isValid]);
  
  // 检查系统API密钥状态的函数
  const checkSystemApiKeyStatus = async () => {
    try {
      const summary = await getApiKeyStatusSummary();
      setSystemApiKeyStatus(summary);
      
      // 如果API密钥不足，显示通知
      if (!summary.hasEnoughKeys) {
        setNotification({
          type: summary.status === 'critical' ? 'error' : 'warning',
          message: `系统${summary.message}，请联系管理员添加更多API密钥`,
        });
        
        // 10秒后自动关闭通知
        setTimeout(() => {
          setNotification(null);
        }, 10000);
      }
    } catch (error) {
      console.error('检查系统API密钥状态失败:', error);
    }
  };
  
  // 处理API端点变更
  const handleApiEndpointChange = (newEndpoint) => {
    setCachedApiEndpoint(newEndpoint);
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiEndpoint', newEndpoint);
    }
    
    // 检查是否为Gemini API并验证API密钥
    if (newEndpoint === 'gemini') {
      // 设置API密钥验证为必须
      setIsApiKeyRequired(true);
      
      // 检查API密钥状态
      if (!storedApiKey) {
        // 如果没有API密钥，显示验证提示
        setShowApiKeyValidation(true);
      } else if (apiKeyStatus.isValid === false) {
        // 如果API密钥无效，显示验证提示
        setShowApiKeyValidation(true);
      } else {
        // 重新验证API密钥
        (async () => {
          const validationResult = await validateApiKey(storedApiKey);
          if (!validationResult || !validationResult.isValid) {
            setShowApiKeyValidation(true);
          } else {
            setShowApiKeyValidation(false);
          }
        })();
      }
    } else {
      // 非Gemini API，取消API密钥验证必须
      setIsApiKeyRequired(false);
      setShowApiKeyValidation(false);
    }
  };

  // 当生成的图像变化时加载背景图像
  useEffect(() => {
    if (generatedImage && canvasRef.current) {
      // 使用window.Image构造函数避免与Next.js Image组件冲突
      const img = new window.Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        drawImageToCanvas();
      };
      img.src = generatedImage;
    }
  }, [generatedImage]);

  // 当组件挂载时用白色背景初始化画布
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
      // 初始化历史记录
      saveToHistory();

      // 检查本地存储中是否有保存的画幅
      if (typeof window !== 'undefined') {
        const savedItems = localStorage.getItem('geminiDrawings');
        if (savedItems) {
          try {
            const parsedItems = JSON.parse(savedItems);
            setSavedDrawings(parsedItems);
          } catch (e) {
            console.error('无法解析保存的画幅:', e);
          }
        }
      }
      
      // 加载自定义形状
      loadCustomShapes();
      
      // 检查URL中是否包含分享的画幅数据
      checkForSharedDrawing();
      
      // 加载已保存的API Key
      loadStoredApiKey();
    }
  }, []);

  // 当保存的画幅改变时，保存到本地存储
  useEffect(() => {
    if (savedDrawings.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('geminiDrawings', JSON.stringify(savedDrawings));
    }
  }, [savedDrawings]);
  
  // 加载自定义形状
  const loadCustomShapes = () => {
    try {
      const shapes = getCustomShapes();
      setCustomShapes(shapes);
    } catch (error) {
      console.error('加载自定义形状失败:', error);
    }
  };
  
  // 处理自定义形状保存
  const handleSaveCustomShape = (shape) => {
    try {
      // 保存到本地存储并更新状态
      const updatedShapes = saveCustomShape(shape);
      setCustomShapes(updatedShapes);
    } catch (error) {
      console.error('保存自定义形状失败:', error);
    }
  };
  
  // 处理自定义形状删除
  const handleDeleteCustomShape = (e, shapeId) => {
    e.stopPropagation();
    if (confirm('确定要删除这个自定义形状吗？')) {
      try {
        // 从本地存储中删除并更新状态
        const updatedShapes = deleteCustomShape(shapeId);
        setCustomShapes(updatedShapes);
      } catch (error) {
        console.error('删除自定义形状失败:', error);
      }
    }
  };
  
  // 打开自定义形状创建器
  const openCustomShapeCreator = (shape = null) => {
    setEditingCustomShape(shape);
    setShowCustomShapeCreator(true);
  };
  
  // 关闭自定义形状创建器
  const closeCustomShapeCreator = () => {
    setShowCustomShapeCreator(false);
    setEditingCustomShape(null);
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 点击其他地方关闭导出选项菜单
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showExportOptions && !e.target.closest('#export-menu-container')) {
        setShowExportOptions(false);
      }
      if (showPenSettings && !e.target.closest('#pen-settings-container')) {
        setShowPenSettings(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showExportOptions, showPenSettings]);

  // ESC键监听，关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showPenSettings) setShowPenSettings(false);
        if (showExportOptions) setShowExportOptions(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPenSettings, showExportOptions]);

  // 使用白色背景初始化画布
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // 用白色背景填充画布
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 重置缩放比例
    setScale(1);
  };

  // 将背景图像绘制到画布
  const drawImageToCanvas = () => {
    if (!canvasRef.current || !backgroundImageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // 先用白色背景填充
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 保存上下文状态
    ctx.save();
    
    // 应用当前缩放
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    
    // 绘制背景图像
    ctx.drawImage(
      backgroundImageRef.current,
      0, 0,
      canvas.width, canvas.height
    );
    
    // 恢复上下文状态
    ctx.restore();

    // 保存到历史记录
    saveToHistory();
  };

  // 保存当前画布状态到历史记录
  const saveToHistory = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
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

  // 切换全屏模式
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // 进入全屏
      const canvasContainer = document.getElementById('canvas-container');
      if (canvasContainer?.requestFullscreen) {
        canvasContainer.requestFullscreen();
      }
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const zoomIn = () => {
    if (scale < 2.7) { // 最大放大到270%
      const newScale = Math.min(scale + 0.1, 2.7);
      setScale(newScale);
      redrawCanvasWithScale(newScale);
    }
  };

  // 缩小画布内容
  const zoomOut = () => {
    if (scale > 0.5) { // 最小缩小到50%
      const newScale = Math.max(scale - 0.1, 0.5);
      setScale(newScale);
      redrawCanvasWithScale(newScale);
    }
  };

  // 根据缩放重绘画布
  const redrawCanvasWithScale = (newScale) => {
    if (!canvasRef.current || !history.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // 获取当前历史记录中的图像
    const currentImage = history[currentStep];
    if (!currentImage) return;
    
    const img = new Image();
    
    img.onload = () => {
      // 清除当前画布
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 保存当前上下文状态
      ctx.save();
      
      // 从画布中心进行缩放
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.translate(centerX, centerY);
      ctx.scale(newScale, newScale);
      ctx.translate(-centerX, -centerY);
      
      // 绘制图像
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // 恢复上下文状态
      ctx.restore();
    };
    
    img.src = currentImage;
  };

  // 切换橡皮擦模式
  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  // 切换画笔设置面板
  const togglePenSettings = () => {
    // 防止事件传播导致的立即关闭问题
    setTimeout(() => {
      const newState = !showPenSettings;
      setShowPenSettings(newState);

      // 如果是打开弹窗，计算位置
      if (newState && penSettingsButtonRef.current) {
        const position = positionPopup(penSettingsButtonRef, 300, 400); // 预估宽高
        setPenSettingsPosition(position);
      }
    }, 0);
  };

  // 切换导出选项菜单
  const toggleExportOptions = (e) => {
    e.stopPropagation(); // 防止点击事件传播到document
    // 防止事件传播导致的立即关闭问题
    setTimeout(() => {
      const newState = !showExportOptions;
      setShowExportOptions(newState);

      // 如果是打开弹窗，计算位置
      if (newState && exportOptionsButtonRef.current) {
        const position = positionPopup(exportOptionsButtonRef, 200, 220); // 预估宽高
        setExportOptionsPosition(position);
      }
    }, 0);
  };

  // 切换分享选项菜单
  const toggleShareOptions = (e) => {
    e.stopPropagation(); // 防止点击事件传播到document
    // 防止事件传播导致的立即关闭问题
    setTimeout(() => {
      const newState = !showShareOptions;
      setShowShareOptions(newState);

      // 如果是打开弹窗，计算位置
      if (newState && shareOptionsButtonRef.current) {
        const position = positionPopup(shareOptionsButtonRef, 320, 280); // 预估宽高
        setShareOptionsPosition(position);
      }
    }, 0);
  };

  

  // 弹窗位置计算工具函数
  const positionPopup = (buttonRef, popupWidth, popupHeight) => {
    if (!buttonRef.current) return { top: '100%', left: '0' };
    
    // 获取按钮的位置和尺寸
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 初始位置（按钮下方）
    let top = buttonRect.bottom + 10; // 按钮底部 + 10px间距
    let left = buttonRect.left + (buttonRect.width / 2) - (popupWidth / 2); // 水平居中
    
    // 调整水平位置，防止超出屏幕边缘
    if (left < 10) {
      left = 10; // 左边缘最小间距
    } else if (left + popupWidth > viewportWidth - 10) {
      left = viewportWidth - popupWidth - 10; // 右边缘最小间距
    }
    
    // 检查是否超出底部边缘
    if (top + popupHeight > viewportHeight - 10) {
      // 如果底部空间不足，将弹窗显示在按钮上方
      top = buttonRect.top - popupHeight - 10;
    }
    
    // 检查特殊情况：如果上方和下方都没有足够空间，居中显示
    if (top < 10 && top + popupHeight > viewportHeight - 10) {
      top = Math.max((viewportHeight - popupHeight) / 2, 10);
    }
    
    return {
      top: `${top}px`,
      left: `${left}px`
    };
  };

  // 导出画布为图片
  const exportCanvas = (format) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let dataUrl, filename, link;
    
    // 获取当前画幅名称，如果有正在编辑的画幅则使用其名称
    let drawingName = "未命名画作";
    if (currentDrawingIndex >= 0 && savedDrawings[currentDrawingIndex]) {
      drawingName = savedDrawings[currentDrawingIndex].prompt || "未命名画作";
    }
    
    // 处理文件名，移除不合法字符
    const safeFileName = drawingName.replace(/[\\/:*?"<>|]/g, "_");
    
    // 根据格式处理导出
    switch (format) {
      case 'png':
        dataUrl = canvas.toDataURL('image/png');
        filename = `${safeFileName}-${new Date().toISOString().slice(0, 10)}.png`;
        break;
        
      case 'jpg':
        dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        filename = `${safeFileName}-${new Date().toISOString().slice(0, 10)}.jpg`;
        break;
        
      case 'svg':
        // 创建SVG
        const svgData = canvasToSVG(canvas);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        dataUrl = URL.createObjectURL(svgBlob);
        filename = `${safeFileName}-${new Date().toISOString().slice(0, 10)}.svg`;
        break;
        
      case 'pdf':
        // 创建PDF
        exportCanvasToPDF(canvas, safeFileName);
        setShowExportOptions(false);
        return; // 直接返回，不需要后续处理
        
      default:
        return;
    }
    
    // 创建临时链接并触发下载
    link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
    
    // 如果是SVG，清理创建的对象URL
    if (format === 'svg') {
      URL.revokeObjectURL(dataUrl);
    }
    
    // 关闭导出选项
    setShowExportOptions(false);
  };

  // Canvas转换为SVG
  const canvasToSVG = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 获取画布上的像素数据
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    
    // 创建SVG头部
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    
    // 添加白色背景
    svg += `<rect width="${width}" height="${height}" fill="white"/>`;
    
    // 转换像素数据为SVG
    // 注意：这是简化版本，仅将canvas图像作为base64嵌入
    // 更复杂的版本可以提取路径等
    svg += `<image width="${width}" height="${height}" href="${canvas.toDataURL('image/png')}"/>`;
    
    svg += '</svg>';
    return svg;
  };

  // 导出Canvas为PDF
  const exportCanvasToPDF = (canvas, drawingName = "未命名画作") => {
    // 动态创建并加载PDF生成脚本
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      // 添加画布图像到PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // 下载PDF
      pdf.save(`${drawingName}-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      // 清理script标签
      document.body.removeChild(script);
    };
    
    document.body.appendChild(script);
  };

  // 根据画布缩放获取正确的坐标
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // 计算内部画布大小与显示大小之间的缩放因子
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // 获取原始坐标
    const rawX = (e.nativeEvent.offsetX || (e.nativeEvent.touches?.[0]?.clientX - rect.left)) * scaleX;
    const rawY = (e.nativeEvent.offsetY || (e.nativeEvent.touches?.[0]?.clientY - rect.top)) * scaleY;
    
    // 考虑用户设置的缩放比例
    // 从画布中心进行缩放调整
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 调整坐标以反映当前缩放比例
    const adjustedX = centerX + (rawX - centerX) / scale;
    const adjustedY = centerY + (rawY - centerY) / scale;
    
    return {
      x: adjustedX,
      y: adjustedY
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    
    // 防止默认行为以避免在触摸设备上滚动
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    // 保存上下文状态
    ctx.save();
    
    // 应用当前缩放
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    
    // 开始新路径而不清除画布
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // 恢复上下文状态
    ctx.restore();
    
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    // 防止默认行为以避免在触摸设备上滚动
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    
    // 保存上下文状态
    ctx.save();
    
    // 应用当前缩放
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    
    // 根据当前模式设置样式
    if (isEraser) {
      // 橡皮擦模式
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(255,255,255,1)';  // 使用透明色以擦除内容
      ctx.lineWidth = penWidth;
      ctx.lineCap = "round";
      
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // 绘画模式 - 应用选择的笔触
      setBrushStyle(ctx, brushType, brushSettings, penColor, penWidth);
      
      // 获取当前坐标和前一个点的坐标
      const currentPoint = { x, y };
      const previousPoint = prevPoint || currentPoint;
      
      // 尝试使用特殊笔触绘制
      const isSpecialBrushDrawn = drawSpecialBrush(
        ctx, 
        brushType, 
        currentPoint.x, 
        currentPoint.y, 
        previousPoint.x, 
        previousPoint.y, 
        brushSettings, 
        penColor, 
        penWidth
      );
      
      // 如果没有特殊处理，则使用普通路径绘制
      if (!isSpecialBrushDrawn) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      // 更新前一个点
      setPrevPoint(currentPoint);
    }
    
    // 恢复上下文状态
    ctx.restore();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      
      // 绘制结束后保存当前状态到历史记录
      saveToHistory();
      
      // 重置前一个点
      setPrevPoint(null);
      
      // 重置绘图模式
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // 用白色填充而不仅仅是清除
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setGeneratedImage(null);
    backgroundImageRef.current = null;
    
    // 清空后保存到历史
    saveToHistory();
  };

  const handleColorChange = (e) => {
    setPenColor(e.target.value);
    // 当选择颜色时，如果是橡皮擦模式，切换回画笔模式
    if (isEraser) {
      setIsEraser(false);
    }
  };

  const openColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openColorPicker();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    
    // 使用缓存的API端点设置
    const apiEndpoint = cachedApiEndpoint;
    
    // 如果使用Gemini API，检查API密钥是否有效
    if (apiEndpoint === 'gemini') {
      // 判断API密钥是否存在
      if (!storedApiKey) {
        setShowApiKeyValidation(true);
        return; // 阻止提交
      }
      
      // 判断API密钥是否已被验证为有效
      if (apiKeyStatus.isValid === false) {
        setShowApiKeyValidation(true);
        return; // 阻止提交
      }
      
      // 如果API密钥状态未知，先验证
      if (apiKeyStatus.isValid === null) {
        setIsLoading(true);
        try {
          const validationResult = await validateApiKey(storedApiKey);
          if (!validationResult || !validationResult.isValid) {
            setShowApiKeyValidation(true);
            setIsLoading(false);
            return; // 阻止提交
          }
        } catch (error) {
          console.error("验证API密钥时出错:", error);
          setShowApiKeyValidation(true);
          setIsLoading(false);
          return; // 阻止提交
        }
      }
    }
    
    setIsLoading(true);
    
    try {
      // 获取绘图的base64数据
      const canvas = canvasRef.current;
      
      // 创建临时画布添加白色背景
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // 填充白色背景
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // 在白色背景上绘制原始画布内容
      tempCtx.drawImage(canvas, 0, 0);
      
      const drawingData = tempCanvas.toDataURL("image/png").split(",")[1];
      
      // 创建请求负载
      const requestPayload = {
        prompt,
        drawingData,
        customApiKey
      };
      
      // 记录请求负载（为简洁起见，不包含完整图像数据）
      console.log("请求负载:", {
        ...requestPayload,
        drawingData: drawingData ? `${drawingData.substring(0, 50)}... (已截断)` : null,
        customApiKey: customApiKey ? "**********" : null
      });
      
      // 根据选择的API端点设置请求地址
      let apiUrl = "/api/generate"; // 默认使用原始端点（直接Gemini）
      
      switch (apiEndpoint) {
        case 'huggingface':
          apiUrl = "/api/generateWithFallback"; // 优先使用Hugging Face，回退到Gemini
          break;
        case 'gemini':
          apiUrl = "/api/generate"; // 直接使用Gemini
          break;
        case 'best':
          apiUrl = "/api/generateBest"; // 使用最佳策略
          break;
      }
      
      console.log(`使用API端点: ${apiUrl} (${apiEndpoint}模式)`);
      
      // 将绘图和提示发送到选择的API端点
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });
      
      const data = await response.json();
      
      // 记录响应（为简洁起见，不包含完整图像数据）
      console.log("响应:", {
        ...data,
        imageData: data.imageData ? `${data.imageData.substring(0, 50)}... (已截断)` : null
      });
      
      if (data.success && data.imageData) {
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        setGeneratedImage(imageUrl);
      } else {
        console.error("生成图像失败:", data.error);
        
        // 构建详细的错误消息
        let displayError = data.error || "生成图像失败，请重试";
        let errorDetails = "";
        
        // 添加详细信息（如果有）
        if (data.details) {
          errorDetails += data.details + "\n\n";
        }
        
        // 添加解决方案（如果有）
        if (data.solution) {
          errorDetails += data.solution;
        }
        
        // 如果有详细信息，则将其添加到错误消息中
        if (errorDetails) {
          setErrorMessage(displayError + "\n\n" + errorDetails);
        } else {
          setErrorMessage(displayError);
        }
        
        // 检查是否应该显示API密钥输入（API配额错误）
        const showApiKeyInput = response.status === 429 || 
          (data.error && (data.error.includes("配额") || data.error.includes("API密钥")));
          
        // 显示错误模态框
        setShowErrorModal(true);
        
        // 如果是API密钥相关错误，自动聚焦到API密钥输入
        if (showApiKeyInput && apiKeyInputRef.current) {
          setTimeout(() => {
            apiKeyInputRef.current.focus();
          }, 100);
        }
      }
    } catch (error) {
      console.error("提交绘图时出错:", error);
      setErrorMessage(error.message || "发生了意外错误。");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 关闭错误模态框
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  // Gemini API密钥验证提示组件
  const ApiKeyValidationNotice = () => (
    <div className="bg-amber-50 border border-amber-300 rounded-md p-4 mt-2 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Key className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">使用 Gemini API 需先配置有效密钥</h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              您选择了 Gemini API 作为服务提供商，但尚未配置有效的 API 密钥。请先配置密钥后再尝试发送请求。
            </p>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2">
              <button
                type="button"
                className="rounded-md bg-amber-100 px-3.5 py-2 text-sm font-semibold text-amber-800 shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                onClick={() => {
                  // 切换回默认API端点
                  handleApiEndpointChange('huggingface');
                  setShowApiKeyValidation(false);
                }}
              >
                切换到默认 API
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 验证API密钥
  const validateApiKey = async (apiKey) => {
    if (!apiKey) return;
    
    setCheckingApiKey(true);
    try {
      // 使用checkApiKeyStatus接口进行验证，而不是validateApiKey
      const response = await fetch('/api/checkApiKeyStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey })
      });
      
      const data = await response.json();
      
      // 处理checkApiKeyStatus的返回结果格式
      const isValid = data.success && (data.isValid || false);
      const message = data.message || '';
      
      setApiKeyStatus({
        isValid: isValid,
        message: message,
        code: data.code || '',
        keyData: data.keyData || null
      });
      
      return {
        isValid: isValid,
        message: message,
        code: data.code || '',
        keyData: data.keyData || null
      };
    } catch (error) {
      console.error('验证API密钥时出错:', error);
      
      // 检查是否含有getAllApiKeys错误
      const errorMessage = error.message || '';
      const customMessage = errorMessage.includes('getAllApiKeys') 
        ? '服务器配置问题：API密钥存储功能未正确设置，但您仍可以使用密钥' 
        : `验证失败: ${errorMessage}`;
      
      setApiKeyStatus({
        isValid: false,
        message: customMessage,
        code: 'ERROR'
      });
      
      return { 
        isValid: false, 
        message: customMessage,
        code: 'ERROR'
      };
    } finally {
      setCheckingApiKey(false);
    }
  };

  // 加载已保存的API Key
  const loadStoredApiKey = async () => {
    try {
      if (typeof window !== 'undefined') {
        const apiKey = localStorage.getItem('geminiApiKey');
        if (apiKey) {
          setStoredApiKey(apiKey);
          setCustomApiKey(apiKey);
          
          // 设置检查状态
          setCheckingApiKey(true);
          
          // 验证已保存的API密钥
          const result = await validateApiKey(apiKey);
          
          // 更新状态
          setApiKeyStatus({
            isValid: result.isValid,
            message: result.message || '',
            code: result.code || '',
            keyData: result.keyData || null
          });
          
          // 显示相应通知
          if (!result.isValid) {
            let notificationType = 'error';
            let notificationMessage = '您保存的API密钥无效或已被禁用';
            
            if (result.code === 'QUOTA_EXCEEDED') {
              notificationType = 'warning';
              notificationMessage = '您的API密钥配额已用尽，请更换密钥或等待配额重置';
            }
            
            setNotification({
              type: notificationType,
              message: notificationMessage
            });
            
            // 延迟关闭通知
            setTimeout(() => setNotification(null), 8000);
          }
        }
      }
    } catch (error) {
      console.error('验证已存储的API密钥时出错:', error);
      setApiKeyStatus({
        isValid: false,
        message: error.message,
        code: 'ERROR'
      });
    } finally {
      setCheckingApiKey(false);
    }
  };
  
  // 更新API Key
  const handleUpdateApiKey = async (apiKey) => {
    try {
      // 验证API密钥
      const validationResult = await validateApiKey(apiKey);
      
      if (!validationResult || !validationResult.isValid) {
        // 显示错误信息
        setErrorMessage(`API密钥验证失败: ${validationResult?.message || '无效的API密钥'}`);
        setShowErrorModal(true);
        return false;
      }
      
      // 保存到本地存储
      if (typeof window !== 'undefined') {
        localStorage.setItem('geminiApiKey', apiKey);
      }
      // 更新状态
      setStoredApiKey(apiKey);
      setCustomApiKey(apiKey);
      
      // 如果当前需要API密钥验证，关闭验证提示
      if (isApiKeyRequired) {
        setShowApiKeyValidation(false);
      }
      
      // 显示成功消息
      setNotification({
        type: 'success',
        message: 'API密钥已更新并验证有效'
      });
      setTimeout(() => setNotification(null), 3000);
      
      return true;
    } catch (error) {
      console.error('保存API Key失败:', error);
      setErrorMessage(`保存API Key失败: ${error.message}`);
      setShowErrorModal(true);
      return false;
    }
  };
  
  // 清除API Key
  const handleClearApiKey = () => {
    try {
      // 从本地存储中移除
      if (typeof window !== 'undefined') {
        localStorage.removeItem('geminiApiKey');
      }
      // 更新状态
      setStoredApiKey('');
      setCustomApiKey('');
      setApiKeyStatus({ isValid: null, message: '' });
      
      // 显示成功消息
      setNotification({
        type: 'info',
        message: 'API密钥已清除'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('清除API Key失败:', error);
    }
  };
  
  // 处理自定义API密钥提交
  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    
    // 验证并保存API密钥
    const success = await handleUpdateApiKey(customApiKey);
    if (success) {
      setShowErrorModal(false);
    }
  };

  // 添加触摸事件阻止功能
  useEffect(() => {
    // 防止画布上的默认触摸行为的函数
    const preventTouchDefault = (e) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    // 组件挂载时添加事件监听器
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', preventTouchDefault, { passive: false });
      canvas.addEventListener('touchmove', preventTouchDefault, { passive: false });
    }

    // 组件卸载时移除事件监听器
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', preventTouchDefault);
        canvas.removeEventListener('touchmove', preventTouchDefault);
      }
    };
  }, [isDrawing]);

  // 渲染错误模态框
  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">出错了</h3>
          <button
            onClick={closeErrorModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500 whitespace-pre-line">
            {errorMessage}
          </div>
          
          {/* 仅在错误与API密钥相关时显示API密钥输入 */}
          {(errorMessage.includes("API密钥") || errorMessage.includes("配额")) && (
            <form onSubmit={handleApiKeySubmit} className="space-y-3">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  Google Gemini API密钥
                </label>
                <input
                  ref={apiKeyInputRef}
                  type="text"
                  id="apiKey"
                  placeholder="输入有效的Google Gemini API密钥"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={customApiKey}
                  onChange={(e) => {
                    setCustomApiKey(e.target.value);
                    // 清除之前的验证状态
                    if (apiKeyStatus.isValid !== null) {
                      setApiKeyStatus({ isValid: null, message: '' });
                    }
                  }}
                />
                
                {/* API密钥状态指示器 */}
                {apiKeyStatus.isValid !== null && (
                  <div className={`mt-1 text-sm ${apiKeyStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {apiKeyStatus.isValid ? '✓ ' : '✗ '}
                    {apiKeyStatus.message}
                  </div>
                )}
                
                {checkingApiKey && (
                  <div className="mt-1 text-sm text-blue-600">
                    验证中...
                  </div>
                )}                
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  disabled={checkingApiKey}
                >
                  保存并继续
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  // 保存当前画布到保存列表中
  const saveCurrentDrawing = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL('image/png');
    const timestamp = new Date().toLocaleString();
    
    // 判断是否为更新现有画幅
    if (currentDrawingIndex >= 0 && currentDrawingIndex < savedDrawings.length) {
      // 更新已有画幅
      setSavedDrawings(prevDrawings => {
        const updatedDrawings = [...prevDrawings];
        updatedDrawings[currentDrawingIndex] = {
          ...updatedDrawings[currentDrawingIndex],
          data: drawingData,
          timestamp,
          prompt: prompt || updatedDrawings[currentDrawingIndex].prompt // 保留原有标题，除非有新标题
        };
        return updatedDrawings;
      });
      
      // 显示画幅列表
      setShowDrawingsList(true);
    } else {
      // 创建新的保存项
      const newDrawing = {
        id: Date.now(),
        data: drawingData,
        timestamp,
        prompt: prompt || "未命名画作"
      };
      
      // 添加到保存列表，如果超过20个则移除最旧的
      setSavedDrawings(prevDrawings => {
        const newDrawings = [newDrawing, ...prevDrawings];
        if (newDrawings.length > 20) {
          return newDrawings.slice(0, 20);
        }
        return newDrawings;
      });
      
      // 设置当前查看的画幅为新保存的
      setCurrentDrawingIndex(0);
      
      // 显示画幅列表
      setShowDrawingsList(true);
    }
  };

  // 切换显示画幅列表
  const toggleDrawingsList = () => {
    setShowDrawingsList(!showDrawingsList);
  };

  // 选择并加载保存的画幅
  const selectDrawing = (index) => {
    if (index >= 0 && index < savedDrawings.length) {
      setCurrentDrawingIndex(index);
      
      try {
        // 加载选中的画幅
        const drawing = savedDrawings[index];
        if (!drawing || !drawing.data) {
          console.error("画幅数据不存在");
          return;
        }
        
        const img = new window.Image(); // 使用浏览器原生的Image构造函数
        
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            // 清除当前画布
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 保存上下文状态
            ctx.save();
            
            // 应用当前缩放
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            ctx.translate(-centerX, -centerY);
            
            // 绘制选中的图像
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 恢复上下文状态
            ctx.restore();
            
            // 保存到历史
            saveToHistory();
          }
        };
        
        img.onerror = (err) => {
          console.error("加载图片出错:", err);
        };
        
        img.src = drawing.data;
        
        // 如果有提示词，也可以设置它
        if (drawing.prompt && drawing.prompt !== "未命名画作") {
          setPrompt(drawing.prompt);
        }
      } catch (error) {
        console.error("选择画幅时出错:", error);
      }
    }
  };

  // 创建新画幅
  const createNewDrawing = () => {
    // 清空画布
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 重置状态
      setGeneratedImage(null);
      backgroundImageRef.current = null;
      setPrompt("");
      setScale(1); // 重置缩放比例
      
      // 保存到历史
      saveToHistory();
      
      // 关闭画幅列表
      setShowDrawingsList(false);
    }
  };

  // 开始编辑画幅名称
  const startEditDrawingName = (e, drawingId, currentName) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发选择画幅
    setEditingDrawingId(drawingId);
    setEditingDrawingName(currentName);
  };

  // 完成编辑画幅名称
  const finishEditDrawingName = (e) => {
    e.preventDefault();
    if (editingDrawingId && editingDrawingName.trim()) {
      setSavedDrawings(prevDrawings => 
        prevDrawings.map(drawing => 
          drawing.id === editingDrawingId 
            ? { ...drawing, prompt: editingDrawingName.trim() }
            : drawing
        )
      );
    }
    setEditingDrawingId(null);
    setEditingDrawingName("");
  };

  // 取消编辑画幅名称
  const cancelEditDrawingName = () => {
    setEditingDrawingId(null);
    setEditingDrawingName("");
  };

  // 删除保存的画幅
  const deleteDrawing = (e, drawingId) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发选择画幅
    
    // 更新保存的画幅列表
    setSavedDrawings(prevDrawings => {
      const newDrawings = prevDrawings.filter(drawing => drawing.id !== drawingId);
      
      // 如果删除的是当前正在查看的画幅，重置currentDrawingIndex
      if (currentDrawingIndex >= 0) {
        const currentDrawingId = prevDrawings[currentDrawingIndex]?.id;
        if (currentDrawingId === drawingId) {
          // 如果列表不为空，选择第一个画幅
          if (newDrawings.length > 0) {
            setCurrentDrawingIndex(0);
          } else {
            setCurrentDrawingIndex(-1);
          }
        } else {
          // 如果删除的不是当前画幅，但需要更新索引
          const newIndex = newDrawings.findIndex(drawing => drawing.id === currentDrawingId);
          setCurrentDrawingIndex(newIndex);
        }
      }
      
      return newDrawings;
    });
  };

  // 复制画幅
  const duplicateDrawing = (e, drawingId) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发选择画幅
    
    // 查找要复制的画幅
    const drawingToDuplicate = savedDrawings.find(drawing => drawing.id === drawingId);
    
    if (drawingToDuplicate) {
      // 创建新画幅对象
      const newDrawing = {
        ...drawingToDuplicate,
        id: Date.now(), // 生成新的唯一ID
        timestamp: new Date().toLocaleString(), // 更新时间戳
        prompt: `${drawingToDuplicate.prompt} (副本)` // 添加"副本"标记
      };
      
      // 将新画幅添加到列表的最前面
      setSavedDrawings(prevDrawings => [newDrawing, ...prevDrawings]);
      
      // 自动选择新复制的画幅
      setCurrentDrawingIndex(0);
      
      // 提示用户复制成功
      console.log('画幅已复制:', newDrawing.prompt);
    }
  };

  // 切换形状列表显示
  const toggleShapesList = () => {
    setShowShapesList(!showShapesList);
  };

  // 开始拖动形状
  const handleShapeDragStart = (e, shapeId) => {
    e.dataTransfer.setData('shapeId', shapeId);
    setSelectedShape(shapeId);
  };

  // 处理画布上的拖放
  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('shapeId');
    if (!shapeId) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // 计算放置位置（考虑缩放）
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // 获取画布上下文
    const ctx = canvas.getContext("2d");
    
    // 设置绘制样式
    ctx.fillStyle = penColor;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    
    // 应用当前缩放
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    
    // 检查是否为自定义形状
    if (shapeId.startsWith('custom-')) {
      // 查找匹配的自定义形状
      const customShape = customShapes.find(s => s.id === shapeId);
      if (customShape && customShape.data) {
        // 绘制自定义形状
        drawCustomShape(ctx, customShape.data, x, y, shapeSize, saveToHistory);
        return;
      }
    } else {
      // 绘制预设形状
      drawShapeUtil(ctx, shapeId, x, y, shapeSize, { 
        points: shapeSettings.starPoints,
        sides: shapeSettings.polygonSides,
        innerRadius: shapeSettings.starInnerRadius,
        flipHorizontal: shapeSettings.flipHorizontal,
        flipVertical: shapeSettings.flipVertical,
        borderColor: shapeSettings.borderColor,
        fillColor: shapeSettings.fillColor || penColor, // 如果没有填充颜色，使用画笔颜色
        borderStyle: shapeSettings.borderStyle,
        borderWidth: shapeSettings.borderWidth
      }, saveToHistory);
    }
  };

  // 允许放置
  const handleCanvasDragOver = (e) => {
    e.preventDefault(); // 允许放置
  };

  // 形状设置面板组件
  const ShapeSettingsPanel = ({ shape }) => {
    if (!shape) return null;
    
    const hasSettings = shapesLibrary.find(s => s.id === shape)?.hasSettings;
    
    // 预览画布的引用
    const previewCanvasRef = useRef(null);
    
    // 当选择的形状或设置更改时，更新预览
    useEffect(() => {
      if (previewCanvasRef.current) {
        // 获取父元素
        const container = previewCanvasRef.current;
        
        // 清除现有的预览
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        // 创建新的预览
        const previewCanvas = createShapePreview(shape, {
          ...shapeSettings,
          fillColor: shapeSettings.fillColor || penColor,
        }, {
          width: 120,
          height: 120,
          showBackground: true,
          size: shapeSize * 0.4  // 适当缩小以适应预览
        });
        
        // 设置样式并添加到容器
        previewCanvas.className = 'w-full h-full';
        container.appendChild(previewCanvas);
      }
    }, [shape, shapeSettings, shapeSize, penColor]);
    
    return (
      <div className="p-3 bg-white rounded-lg shadow-md">
        {/* 形状预览 */}
        <div className="mb-4">
          <div 
            ref={previewCanvasRef}
            className="w-full h-28 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
          />
        </div>
        
        {shape === 'polygon' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">多边形边数: {shapeSettings.polygonSides}</label>
            <input 
              type="range" 
              min="3" 
              max="12" 
              value={shapeSettings.polygonSides} 
              onChange={(e) => setShapeSettings(prev => ({...prev, polygonSides: parseInt(e.target.value)}))}
              className="w-full"
            />
          </div>
        )}
        
        {shape === 'star' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">角数: {shapeSettings.starPoints}</label>
              <input 
                type="range" 
                min="3" 
                max="12" 
                step="1"
                value={shapeSettings.starPoints} 
                onChange={(e) => setShapeSettings(prev => ({...prev, starPoints: parseInt(e.target.value)}))}
                className="w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">内半径比例: {shapeSettings.starInnerRadius?.toFixed(2) || '0.40'}</label>
              <input 
                type="range" 
                min="0.1" 
                max="0.9" 
                step="0.05"
                value={shapeSettings.starInnerRadius || 0.4} 
                onChange={(e) => setShapeSettings(prev => ({...prev, starInnerRadius: parseFloat(e.target.value)}))}
                className="w-full"
              />
            </div>
          </>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">形状大小: {shapeSize}px</label>
          <input 
            type="range" 
            min="20" 
            max="300" 
            value={shapeSize} 
            onChange={(e) => setShapeSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* 翻转控制 */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">形状翻转</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setShapeSettings(prev => ({...prev, flipHorizontal: !prev.flipHorizontal}))}
              className={`p-2 rounded-md flex items-center justify-center ${shapeSettings.flipHorizontal ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}
              title="水平翻转"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path>
                <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
                <path d="M12 3v18"></path>
              </svg>
              <span className="ml-1 text-xs">水平</span>
            </button>
            
            <button
              onClick={() => setShapeSettings(prev => ({...prev, flipVertical: !prev.flipVertical}))}
              className={`p-2 rounded-md flex items-center justify-center ${shapeSettings.flipVertical ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}
              title="垂直翻转"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"></path>
                <path d="M3 12h18"></path>
              </svg>
              <span className="ml-1 text-xs">垂直</span>
            </button>
          </div>
        </div>

        {/* 边框颜色控制 */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">边框颜色</label>
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-md border border-gray-300 mr-2 cursor-pointer"
              style={{ backgroundColor: shapeSettings.borderColor }}
              onClick={() => document.getElementById('border-color-picker').click()}
            />
            <input
              type="color"
              id="border-color-picker"
              value={shapeSettings.borderColor}
              onChange={(e) => setShapeSettings(prev => ({...prev, borderColor: e.target.value}))}
              className="opacity-0 absolute w-px h-px"
            />
            <span className="text-sm text-gray-600">{shapeSettings.borderColor}</span>
          </div>
        </div>

        {/* 边框宽度控制 */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">边框宽度: {shapeSettings.borderWidth}px</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={shapeSettings.borderWidth} 
            onChange={(e) => setShapeSettings(prev => ({...prev, borderWidth: parseInt(e.target.value)}))}
            className="w-full"
          />
        </div>

        {/* 填充颜色控制 */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">填充颜色</label>
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-md border border-gray-300 mr-2 cursor-pointer"
              style={{ 
                backgroundColor: shapeSettings.fillColor || penColor,
                position: 'relative',
              }}
              onClick={() => document.getElementById('fill-color-picker').click()}
            >
              {!shapeSettings.fillColor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white bg-gray-500 px-1 rounded">自动</span>
                </div>
              )}
            </div>
            <input
              type="color"
              id="fill-color-picker"
              value={shapeSettings.fillColor || penColor}
              onChange={(e) => setShapeSettings(prev => ({...prev, fillColor: e.target.value}))}
              className="opacity-0 absolute w-px h-px"
            />
            <button
              className="ml-1 text-xs border border-gray-300 rounded px-1 py-0.5 hover:bg-gray-100"
              onClick={() => setShapeSettings(prev => ({...prev, fillColor: ''}))}
            >
              使用画笔颜色
            </button>
          </div>
        </div>

        {/* 边框样式控制 */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">边框样式</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-2 border rounded-md ${shapeSettings.borderStyle === 'solid' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
              onClick={() => setShapeSettings(prev => ({...prev, borderStyle: 'solid'}))}
            >
              <div className="border-t-2 border-black border-solid"></div>
              <span className="text-xs mt-1 block">实线</span>
            </button>
            <button
              className={`p-2 border rounded-md ${shapeSettings.borderStyle === 'dashed' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
              onClick={() => setShapeSettings(prev => ({...prev, borderStyle: 'dashed'}))}
            >
              <div className="flex justify-center items-center h-4">
                <div className="w-8 border-t-2 border-black" style={{ borderStyle: 'dashed', borderWidth: '2px', borderTopWidth: '2px', borderTopStyle: 'dashed', borderDasharray: '8 3' }}></div>
              </div>
              <span className="text-xs mt-1 block">虚线</span>
            </button>
            <button
              className={`p-2 border rounded-md ${shapeSettings.borderStyle === 'dotted' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
              onClick={() => setShapeSettings(prev => ({...prev, borderStyle: 'dotted'}))}
            >
              <div className="flex justify-center items-center h-4">
                <div className="w-8 border-t-2 border-black" style={{ borderStyle: 'dotted', borderWidth: '2px', borderTopWidth: '2px', borderTopStyle: 'dotted' }}></div>
              </div>
              <span className="text-xs mt-1 block">点状</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 切换笔触选择器
  const toggleBrushSelector = () => {
    setShowBrushSelector(!showBrushSelector);
  };

  // 选择笔触类型
  const selectBrushType = (type) => {
    setBrushType(type);
    // 如果选择了新笔触，自动关闭橡皮擦模式
    if (isEraser) {
      setIsEraser(false);
    }
  };

  // 更新笔触设置
  const updateBrushSetting = (key, value) => {
    setBrushSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 渲染笔触图标
  const renderBrushIcon = (iconName) => {
    switch (iconName) {
      case 'circle': return <Circle className="w-4 h-4" />;
      case 'square': return <Square className="w-4 h-4" />;
      case 'minus': return <Minus className="w-4 h-4" />;
      case 'pen': return <Pen className="w-4 h-4" />;
      case 'pencil': return <PencilLine className="w-4 h-4" />;
      case 'cloud': return <Cloud className="w-4 h-4" />;
      case 'zap': return <Zap className="w-4 h-4" />;
      case 'more-horizontal': return <MoreHorizontal className="w-4 h-4" />;
      case 'palette': return <Palette className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  // 笔触设置面板组件
  const BrushSettingsPanel = ({ brushType }) => {
    // 获取当前选中的笔触
    const selectedBrush = brushTypes.find(b => b.id === brushType);
    if (!selectedBrush) return null;
    
    return (
      <div className="p-3 bg-white rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{selectedBrush.name}设置</h3>
        
        {/* 根据笔触类型显示不同设置 */}
        {brushType === 'calligraphy' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角度: {brushSettings.calligraphyAngle}°
            </label>
            <input 
              type="range" 
              min="0" 
              max="180" 
              value={brushSettings.calligraphyAngle} 
              onChange={(e) => updateBrushSetting('calligraphyAngle', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {brushType === 'pencil' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              粗糙度: {brushSettings.pencilRoughness.toFixed(1)}
            </label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={brushSettings.pencilRoughness} 
              onChange={(e) => updateBrushSetting('pencilRoughness', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {brushType === 'spray' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                粒子数量: {brushSettings.sprayParticles}
              </label>
              <input 
                type="range" 
                min="10" 
                max="100"
                value={brushSettings.sprayParticles} 
                onChange={(e) => updateBrushSetting('sprayParticles', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                喷溅半径: {brushSettings.sprayRadius}
              </label>
              <input 
                type="range" 
                min="1" 
                max="30"
                value={brushSettings.sprayRadius} 
                onChange={(e) => updateBrushSetting('sprayRadius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
        
        {brushType === 'neon' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              发光强度: {brushSettings.neonGlow}
            </label>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={brushSettings.neonGlow} 
              onChange={(e) => updateBrushSetting('neonGlow', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {brushType === 'dotted' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              虚线间距: {brushSettings.dottedPattern[0]}
            </label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSettings.dottedPattern[0]} 
              onChange={(e) => updateBrushSetting('dottedPattern', [parseInt(e.target.value), parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        )}
        
        {brushType === 'rainbow' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              变色速度: {brushSettings.rainbowSpeed}
            </label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushSettings.rainbowSpeed} 
              onChange={(e) => updateBrushSetting('rainbowSpeed', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {brushType === 'pixel' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              像素大小: {brushSettings.pixelSize}px
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={brushSettings.pixelSize} 
              onChange={(e) => updateBrushSetting('pixelSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {/* 笔触预览 - 使用Canvas显示 */}
        <div className="mt-3 border rounded overflow-hidden">
          <div 
            ref={(el) => {
              if (el && !el.hasChildNodes()) {
                const previewCanvas = createBrushPreview(brushType, brushSettings, penColor, penWidth);
                previewCanvas.className = 'w-full h-full';
                el.appendChild(previewCanvas);
              }
            }}
            className="w-full h-16 bg-gray-50"
          />
        </div>
      </div>
    );
  };

  // 检查URL是否包含分享的画幅
  const checkForSharedDrawing = () => {
    try {
      const sharedData = extractSharedDataFromUrl();
      
      if (sharedData && sharedData.canvasData) {
        // 确保canvas已初始化
        if (canvasRef.current) {
          // 创建新的图像对象
          const img = new Image();
          img.onload = () => {
            // 获取canvas上下文
            const ctx = canvasRef.current.getContext('2d');
            
            // 清除当前画布
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            // 绘制共享的画布数据
            ctx.drawImage(img, 0, 0);
            
            // 保存到历史记录
            saveToHistory();
            
            // 设置提示文本（如果有）
            if (sharedData.prompt) {
              setPrompt(sharedData.prompt);
            }
            
            // 清除URL中的共享参数，避免刷新时重复加载
            clearShareParamsFromUrl();
            
            // 显示成功消息
            const announcement = [
              `已成功加载分享的画幅"${sharedData.prompt || '未命名画作'}"`,
              "您可以继续编辑或保存此画幅",
            ];
            
            // 临时显示通知
            setShowAnnouncement(true);
            setAnnouncementMessages(announcement);
            setTimeout(() => setShowAnnouncement(false), 5000);
          };
          
          // 加载图像数据
          img.src = sharedData.canvasData;
        }
      }
    } catch (error) {
      console.error('加载分享画幅失败:', error);
    }
  };
  
  // 处理导入画幅
  const handleImportDrawing = (url) => {
    try {
      // 从URL中提取共享数据并应用
      const hashPart = url.split('#')[1];
      if (hashPart && hashPart.includes('shared=')) {
        const serializedData = hashPart.replace('shared=', '');
        window.location.hash = `shared=${serializedData}`;
        
        // 调用检查函数来加载画幅
        checkForSharedDrawing();
      }
    } catch (error) {
      console.error('导入画幅失败:', error);
    }
  };
  
  // 创建当前画幅的数据对象
  const getCurrentDrawingData = () => {
    if (!canvasRef.current) return null;
    
    const drawingData = {
      data: canvasRef.current.toDataURL('image/png'),
      prompt: prompt || '未命名画作',
      timestamp: new Date().toISOString()
    };
    
    return drawingData;
  };
  
  // 临时公告状态
  const [announcementMessages, setAnnouncementMessages] = useState(announcements);
  
  // 添加useEffect钩子，在组件加载时验证API密钥并检查系统API密钥状态
  useEffect(() => {
    const validateStoredApiKey = async () => {
      try {
        if (typeof window !== 'undefined') {
          const apiKey = localStorage.getItem('geminiApiKey');
          if (apiKey) {
            setStoredApiKey(apiKey);
            setCustomApiKey(apiKey);
            
            // 设置检查状态
            setCheckingApiKey(true);
            
            // 验证已保存的API密钥
            const result = await validateApiKey(apiKey);
            
            // 更新状态
            setApiKeyStatus({
              isValid: result.isValid,
              message: result.message || '',
              code: result.code || '',
              keyData: result.keyData || null
            });
            
            // 显示相应通知
            if (!result.isValid) {
              let notificationType = 'error';
              let notificationMessage = '您保存的API密钥无效或已被禁用';
              
              if (result.code === 'QUOTA_EXCEEDED') {
                notificationType = 'warning';
                notificationMessage = '您的API密钥配额已用尽，请更换密钥或等待配额重置';
              }
              
              setNotification({
                type: notificationType,
                message: notificationMessage
              });
              
              // 延迟关闭通知
              setTimeout(() => setNotification(null), 8000);
            }
          }
        }
        
        // 检查系统API密钥状态
        await checkSystemApiKeyStatus();
      } catch (error) {
        console.error('验证已存储的API密钥时出错:', error);
        setApiKeyStatus({
          isValid: false,
          message: error.message,
          code: 'ERROR'
        });
      } finally {
        setCheckingApiKey(false);
      }
    };
    
    validateStoredApiKey();
  }, []);
  
  return (
    <>
    <Head>
      <title>Gemini 协作绘画工具</title>
      <meta name="description" content="使用Gemini 2.0 API实现的协作绘画工具" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <style jsx global>{`
        .popup-transition {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }
        .popup-transition.show {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: scale(0.8);
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </Head>
    
    {/* 公告组件 */}
    {showAnnouncement && (
      <Announcement 
        announcements={announcements}
        type="info"
        dismissible={true}
        autoHideDelay={0}
        onClose={() => setShowAnnouncement(false)}
        visible={showAnnouncement}
      />
    )}
    
    {/* 显示通知 */}
    {notification && (
      <div className="fixed top-4 right-4 z-50">
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      </div>
    )}

    <div className="min-h-screen text-gray-900 flex flex-col justify-start items-center">     
        
        {/* 左侧画幅列表 - 增加z-50优先级 */}
        <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 overflow-hidden ${showDrawingsList ? 'w-full sm:w-80 md:w-80' : 'w-0'}`}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">我的画幅</h3>
              <div className="flex">
                <button 
                  onClick={createNewDrawing}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                  title="创建新画幅"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  onClick={toggleDrawingsList}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* 搜索和排序工具栏 */}
            <div className="flex flex-col space-y-2 mb-3">
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 pl-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="搜索画幅..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                    title="清除搜索"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">时间: 最新优先</option>
                <option value="oldest">时间: 最早优先</option>
              </select>
            </div>
            
            {savedDrawings.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>暂无保存的画幅</p>
                <p className="text-sm mt-2">点击保存按钮添加画幅</p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-grow" style={{ 
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 0;
                    display: none;
                  }
                `}</style>
                {/* 应用搜索和排序逻辑 */}
                {savedDrawings
                  .filter(drawing => drawing.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => {
                    // 使用timestamp进行排序（假设格式为标准日期时间格式）
                    const dateA = new Date(a.timestamp);
                    const dateB = new Date(b.timestamp);
                    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
                  })
                  .map((drawing, index) => (
                  <div 
                    key={drawing.id}
                    onClick={() => {
                      // 重新计算在原始数组中的索引，以便正确选择画幅
                      const originalIndex = savedDrawings.findIndex(d => d.id === drawing.id);
                      selectDrawing(originalIndex);
                    }}
                    className={`mb-3 cursor-pointer rounded-lg overflow-hidden border-2 ${
                      savedDrawings[currentDrawingIndex]?.id === drawing.id
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="relative pt-[56.25%]">
                      <img 
                        src={drawing.data} 
                        alt={drawing.prompt}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 bg-white">
                      {editingDrawingId === drawing.id ? (
                        <form onSubmit={finishEditDrawingName} className="flex items-center">
                          <input
                            type="text"
                            value={editingDrawingName}
                            onChange={(e) => setEditingDrawingName(e.target.value)}
                            className="text-xs w-full border border-gray-300 rounded px-1 py-0.5"
                            autoFocus
                            onBlur={finishEditDrawingName}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </form>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium truncate flex-grow">{drawing.prompt}</p>
                          <div className="flex space-x-1 ml-1">
                            <button 
                              onClick={(e) => duplicateDrawing(e, drawing.id)}
                              className="text-gray-500 hover:text-blue-500 p-0.5"
                              title="复制画幅"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={(e) => startEditDrawingName(e, drawing.id, drawing.prompt)}
                              className="text-gray-500 hover:text-blue-500 p-0.5"
                              title="编辑名称"
                            >
                              <PencilLine className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={(e) => deleteDrawing(e, drawing.id)}
                              className="text-gray-500 hover:text-red-500 p-0.5"
                              title="删除画幅"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">{drawing.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 右侧形状列表 - 增加z-50优先级 */}
        <div className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 overflow-hidden ${showShapesList ? 'w-full sm:w-80 md:w-80' : 'w-0'}`}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">形状库</h3>
              <button 
                onClick={toggleShapesList}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 分类展示形状 */}
            <div className="overflow-y-auto flex-grow pr-1" style={{ 
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 0;
                  display: none;
                }
              `}</style>
              
              {/* 添加自定义形状按钮 */}
              <div className="mb-4">
                <button
                  onClick={() => openCustomShapeCreator()}
                  className="w-full py-2 px-3 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">添加自定义形状</span>
                </button>
              </div>
              
              {/* 自定义形状分类 */}
              {customShapes.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-1">自定义形状</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {customShapes.map(shape => (
                      <div 
                        key={shape.id}
                        className={`
                          p-2 rounded-lg cursor-grab hover:bg-gray-50 
                          transition-all duration-200 relative group
                          ${selectedShape === shape.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm ring-2 ring-blue-200' 
                            : 'border border-gray-200 hover:border-gray-300'
                          }
                        `}
                        draggable="true"
                        onDragStart={(e) => handleShapeDragStart(e, shape.id)}
                        onClick={() => setSelectedShape(shape.id === selectedShape ? null : shape.id)}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-9 h-9 flex items-center justify-center">
                            <div 
                              ref={(el) => {
                                if (el && !el.hasChildNodes()) {
                                  const previewCanvas = createCustomShapePreview(shape.data);
                                  previewCanvas.className = 'w-full h-full';
                                  el.appendChild(previewCanvas);
                                }
                              }}
                              className="w-9 h-9"
                            />
                          </div>
                          <span className="text-xs mt-1 text-center text-gray-600 font-medium truncate w-full">
                            {shape.name}
                          </span>
                        </div>
                        
                        {/* 悬停时显示的操作按钮 */}
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 p-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openCustomShapeCreator(shape);
                            }}
                            className="p-1 bg-gray-100 rounded-full text-blue-500 hover:bg-gray-200"
                            title="编辑"
                          >
                            <PencilLine className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteCustomShape(e, shape.id)}
                            className="p-1 bg-gray-100 rounded-full text-red-500 hover:bg-gray-200"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {/* 基础形状分类 */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-1">基础形状</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {shapesLibrary
                      .filter(shape => ['circle', 'rectangle', 'triangle', 'ellipse', 'polygon', 'star'].includes(shape.id))
                      .map(shape => (
                        <div 
                          key={shape.id}
                          className={`
                            p-2 rounded-lg cursor-grab hover:bg-gray-50 
                            transition-all duration-200 
                            ${selectedShape === shape.id 
                              ? 'bg-blue-50 border-blue-200 shadow-sm ring-2 ring-blue-200' 
                              : 'border border-gray-200 hover:border-gray-300'
                            }
                          `}
                          draggable="true"
                          onDragStart={(e) => handleShapeDragStart(e, shape.id)}
                          onClick={() => setSelectedShape(shape.id === selectedShape ? null : shape.id)}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-9 h-9 flex items-center justify-center text-gray-700">
                              {renderShapeIcon(shape.icon)}
                            </div>
                            <span className="text-xs mt-1 text-center text-gray-600 font-medium">{shape.name}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* 特殊形状分类 */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-1">特殊形状</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {shapesLibrary
                      .filter(shape => ['heart', 'diamond', 'cross', 'crescent', 'cloud', 'teardrop'].includes(shape.id))
                      .map(shape => (
                        <div 
                          key={shape.id}
                          className={`
                            p-2 rounded-lg cursor-grab hover:bg-gray-50 
                            transition-all duration-200 
                            ${selectedShape === shape.id 
                              ? 'bg-blue-50 border-blue-200 shadow-sm ring-2 ring-blue-200' 
                              : 'border border-gray-200 hover:border-gray-300'
                            }
                          `}
                          draggable="true"
                          onDragStart={(e) => handleShapeDragStart(e, shape.id)}
                          onClick={() => setSelectedShape(shape.id === selectedShape ? null : shape.id)}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-9 h-9 flex items-center justify-center text-gray-700">
                              {renderShapeIcon(shape.icon)}
                            </div>
                            <span className="text-xs mt-1 text-center text-gray-600 font-medium">{shape.name}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* 其他形状分类 */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-1">其他形状</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {shapesLibrary
                      .filter(shape => !['circle', 'rectangle', 'triangle', 'ellipse', 'polygon', 'star', 'heart', 'diamond', 'cross', 'crescent', 'cloud', 'teardrop'].includes(shape.id))
                      .map(shape => (
                        <div 
                          key={shape.id}
                          className={`
                            p-2 rounded-lg cursor-grab hover:bg-gray-50 
                            transition-all duration-200 
                            ${selectedShape === shape.id 
                              ? 'bg-blue-50 border-blue-200 shadow-sm ring-2 ring-blue-200' 
                              : 'border border-gray-200 hover:border-gray-300'
                            }
                          `}
                          draggable="true"
                          onDragStart={(e) => handleShapeDragStart(e, shape.id)}
                          onClick={() => setSelectedShape(shape.id === selectedShape ? null : shape.id)}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-9 h-9 flex items-center justify-center text-gray-700">
                              {renderShapeIcon(shape.icon)}
                            </div>
                            <span className="text-xs mt-1 text-center text-gray-600 font-medium">{shape.name}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            
            {selectedShape && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                  <span>形状设置</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {shapesLibrary.find(s => s.id === selectedShape)?.name}
                  </span>
                </h4>
                <ShapeSettingsPanel shape={selectedShape} />
              </div>
            )}
          </div>
        </div>
        
        {/* 主容器 */}
        <main className={`container mx-auto px-3 sm:px-6 py-5 sm:py-10 pb-32 w-full transition-all duration-300`}>
          {/* 集成标题和工具栏 */}
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 shadow-md border border-blue-400 overflow-hidden relative">
            {/* 装饰圆形元素 */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-white opacity-5 rounded-full"></div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 relative z-10">
              {/* 左侧标题区域 */}
              <div className="mb-2 md:mb-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight font-mega">
                  Gemini 协作绘画
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm max-w-xl opacity-80">
                  使用AI辅助创作，轻松构建绘画作品
                </p>
              </div>
              
              {/* 右侧工具栏分组 */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* 绘画工具组 */}
                <div className="flex items-center p-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-1 md:mb-0">
                  {/* 画笔颜色选择器 */}
                  <button 
                    type="button"
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden mr-1.5 flex items-center justify-center border-2 ${!isEraser ? 'border-white shadow-sm' : 'border-transparent'} transition-transform hover:scale-110`}
                    onClick={openColorPicker}
                    onKeyDown={handleKeyDown}
                    aria-label="打开颜色选择器"
                    style={{ backgroundColor: penColor }}
                  >
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={penColor}
                      onChange={handleColorChange}
                      className="opacity-0 absolute w-px h-px"
                      aria-label="选择笔颜色"
                    />
                  </button>
                  
                  {/* 橡皮擦 */}
                  <button
                    type="button"
                    onClick={toggleEraser}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 ${isEraser ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow-sm transition-all hover:scale-110`}
                    aria-label="橡皮擦"
                    title="橡皮擦"
                  >
                    <Eraser className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* 画笔设置 */}
                  <div className="relative" id="pen-settings-container">
                    <button
                      ref={penSettingsButtonRef}
                      type="button"
                      onClick={togglePenSettings}
                      className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${showPenSettings ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow-sm transition-all hover:scale-110`}
                      aria-label="画笔设置"
                      title="画笔设置"
                    >
                      {showPenSettings ? <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* 画幅管理组 */}
                <div className="flex items-center p-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-1 md:mb-0" style={{ backgroundColor: '#c3c7ca' }}>
                  {/* 新建画幅按钮 */}
                  <button
                    type="button"
                    onClick={createNewDrawing}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 bg-white text-gray-700 shadow-sm transition-all hover:scale-110"
                    aria-label="新建画幅"
                    title="新建画幅"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* 保存按钮 */}
                  <button
                    type="button"
                    onClick={saveCurrentDrawing}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 bg-white text-gray-700 shadow-sm transition-all hover:scale-110"
                    aria-label={currentDrawingIndex >= 0 ? "更新画幅" : "保存画幅"}
                    title={currentDrawingIndex >= 0 ? "更新画幅" : "保存画幅"}
                  >
                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* 切换画幅列表按钮 */}
                  <button
                    type="button"
                    onClick={toggleDrawingsList}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 ${showDrawingsList ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow-sm transition-all hover:scale-110`}
                    aria-label="我的画幅"
                    title="我的画幅"
                  >
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* 形状库按钮 */}
                  <button
                    type="button"
                    onClick={toggleShapesList}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 ${showShapesList ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow-sm transition-all hover:scale-110`}
                    aria-label="形状库"
                    title="形状库"
                  >
                    <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* 导出按钮 */}
                  <div className="relative" id="export-menu-container">
                    <button
                      ref={exportOptionsButtonRef}
                      type="button"
                      onClick={toggleExportOptions}
                      className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${showExportOptions ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow-sm transition-all hover:scale-110`}
                      aria-label="导出画幅"
                      title="导出画幅"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                  
                  {/* 分享按钮 */}
                  <div style={{marginLeft: '5px'}} className="relative" id="share-menu-container">
                    <button
                      ref={shareOptionsButtonRef}
                      type="button"
                      onClick={toggleShareOptions}
                      className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${showShareOptions ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow-sm transition-all hover:scale-110`}
                      aria-label="分享画幅"
                      title="分享画幅"
                    >
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                  </div>                 
                </div>
                
                {/* 辅助功能组 */}
                <div className="flex items-center p-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full" style={{ backgroundColor: 'black' }}>
                  {/* 撤回按钮 */}
                  <button
                    type="button"
                    onClick={undo}
                    disabled={currentStep <= 0}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 ${currentStep <= 0 ? 'bg-gray-300 text-gray-400' : 'bg-white text-gray-700 hover:scale-110'} shadow-sm transition-all`}
                    aria-label="撤回"
                    title="撤回"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* 放大缩小工具 */}
                  <div className="flex items-center justify-center mr-1.5">
                    <button
                      type="button"
                      onClick={zoomOut}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white text-gray-700 shadow-sm transition-all hover:scale-110"
                      aria-label="缩小"
                      title="缩小"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
                    </button>
                    <span className="text-xs sm:text-sm font-medium mx-1 px-1 min-w-[30px] sm:min-w-[40px] text-center text-white">{Math.round(scale * 100)}%</span>
                    <button
                      type="button"
                      onClick={zoomIn}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white text-gray-700 shadow-sm transition-all hover:scale-110"
                      aria-label="放大"
                      title="放大"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
                    </button>
                  </div>
                  
                  {/* 全屏切换 */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-1.5 bg-white text-gray-700 shadow-sm transition-all hover:scale-110`}
                    aria-label={isFullscreen ? "退出全屏" : "全屏显示"}
                    title={isFullscreen ? "退出全屏" : "全屏显示"}
                  >
                    {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                  </button>
                  
                  {/* 清除画布 */}
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white shadow-sm transition-all hover:bg-gray-50 hover:scale-110"
                    aria-label="清除画布"
                    title="清除画布"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* API密钥状态 */}
                  <ApiKeyStatus 
                    apiKey={storedApiKey}
                    status={apiKeyStatus}
                    isChecking={checkingApiKey}
                    onUpdate={handleUpdateApiKey}
                    onClear={handleClearApiKey}
                    onCheck={validateApiKey}
                    apiEndpoint={cachedApiEndpoint}
                    onApiEndpointChange={handleApiEndpointChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 弹出式对话框 - 固定位置 */}
          {/* 画笔设置弹窗 */}
          {showPenSettings && (
            <div 
              ref={(el) => {
                // 添加show类以激活过渡效果
                if (el) {
                  el.classList.add('popup-transition');
                  setTimeout(() => el.classList.add('show'), 10);
                }
              }}
              className="fixed bg-white rounded-lg p-3 shadow-xl z-50 border border-gray-200 w-72 max-h-[80vh] overflow-y-auto max-w-[90vw]"
              style={{
                top: penSettingsPosition.top,
                left: penSettingsPosition.left,
              }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium text-gray-700">画笔设置</div>
                  <button 
                    onClick={() => setShowPenSettings(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="mb-2 text-sm font-medium text-gray-700">画笔粗细: {penWidth}px</div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={penWidth} 
                    onChange={(e) => setPenWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* 笔触选择器 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">笔触类型</span>
                    <span className="text-xs text-blue-600">{brushTypes.find(b => b.id === brushType)?.name}</span>
                  </div>
                  
                  {/* 笔触选择网格 */}
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {brushTypes.map(brush => (
                      <button
                        key={brush.id}
                        onClick={() => selectBrushType(brush.id)}
                        className={`p-2 rounded flex items-center justify-center ${brushType === brush.id ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                        title={brush.name}
                      >
                        {renderBrushIcon(brush.icon)}
                      </button>
                    ))}
                  </div>
                  
                  {/* 笔触详细设置 */}
                  <BrushSettingsPanel brushType={brushType} />
                </div>
              </div>
            </div>
          )}
          
          {/* 导出选项弹窗 */}
          {showExportOptions && (
            <div 
              ref={(el) => {
                // 添加show类以激活过渡效果
                if (el) {
                  el.classList.add('popup-transition');
                  setTimeout(() => el.classList.add('show'), 10);
                }
              }}
              className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200 p-3 max-w-[90vw]"
              style={{
                top: exportOptionsPosition.top,
                left: exportOptionsPosition.left
              }}
              id="export-menu-container"
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium text-gray-700">导出选项</div>
                  <button 
                    onClick={() => setShowExportOptions(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* 导出选项按钮 */}
                <div className="space-y-2">
                  <button 
                    onClick={() => exportCanvas('png')}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                  >
                    PNG格式
                  </button>
                  <button 
                    onClick={() => exportCanvas('jpg')}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                  >
                    JPG格式
                  </button>
                  <button 
                    onClick={() => exportCanvas('svg')}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                  >
                    SVG格式
                  </button>
                  <button 
                    onClick={() => exportCanvas('pdf')}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                  >
                    PDF格式
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 分享选项弹窗 */}
          <DrawingShare 
            visible={showShareOptions}
            position={shareOptionsPosition}
            onClose={() => setShowShareOptions(false)}
            currentDrawing={getCurrentDrawingData()}
            onImportDrawing={handleImportDrawing}
          />
          
          
          {/* 带有画布部分 */}
          <div id="canvas-container" className={`w-full mb-6 relative ${isFullscreen ? 'fixed inset-0 z-40 bg-white p-4' : ''}`}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          >
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={`border border-gray-300 w-full hover:cursor-crosshair ${isFullscreen ? 'h-full' : 'h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]'} min-h-[200px] sm:min-h-[300px] bg-white/95 touch-none rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]`}
            />
            
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-100 transition-all"
                aria-label="退出全屏"
              >
                <Minimize className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* 与画布宽度匹配的输入表单 */}
          <form onSubmit={handleSubmit} className={`w-full ${isFullscreen ? 'hidden' : ''}`}>
            {/* 显示Gemini API密钥验证提示 */}
            {showApiKeyValidation && <ApiKeyValidationNotice />}
            
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="添加您的更改..."
                className={`w-full p-2 sm:p-3 md:p-4 lg:p-5 pr-10 sm:pr-12 md:pr-14 lg:pr-16 text-xs sm:text-sm md:text-base border-0 border-b-2 ${showApiKeyValidation ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200 bg-white/90'} text-gray-800 shadow-sm focus:ring-0 focus:border-blue-400 focus:outline-none transition-all duration-300 font-sans backdrop-blur-sm rounded-t-xl`}
                required
              />
              <button
                type="submit"
                disabled={isLoading || showApiKeyValidation}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 md:p-2 lg:p-2.5 rounded-lg bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isLoading ? (
                  <LoaderCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 animate-spin" aria-label="加载中" />
                ) : showApiKeyValidation ? (
                  <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" aria-label="API密钥无效" />
                ) : (
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" aria-label="提交" />
                )}
              </button>
            </div>
          </form>
        </main>

        {/* 错误模态框 */}
        {showErrorModal && (
          <ErrorModal />
        )}
        
        {/* 自定义形状创建器 */}
        <CustomShapeCreator 
          isOpen={showCustomShapeCreator}
          onClose={closeCustomShapeCreator}
          onSave={handleSaveCustomShape}
          editingShape={editingCustomShape}
        />
        
        {/* 顶部公告显示组件 */}
        <Announcement 
          announcements={announcementMessages}
          visible={showAnnouncement}
          onClose={() => setShowAnnouncement(false)}
          dismissible={true}
          type="info"
          autoSlideInterval={5000}
          showProgressBar={true}
        />
      </div>
      </>
    );
}
