import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, ChevronRight, ChevronLeft, Info, AlertTriangle, CheckCircle, MessageCircleMore, MinusCircle, Maximize2 } from 'lucide-react';

/**
 * 轮播式公告组件
 * @param {Array} announcements - 公告数组
 * @param {boolean} visible - 是否可见
 * @param {function} onClose - 关闭回调函数
 * @param {boolean} dismissible - 是否可关闭
 * @param {string} type - 公告类型 (info, warning, success)
 * @param {number} autoSlideInterval - 自动轮播间隔时间(毫秒)
 * @param {boolean} showProgressBar - 是否显示进度条
 */
const Announcement = ({ 
  announcements = [], 
  visible = true, 
  onClose, 
  dismissible = true,
  type = 'info',
  autoSlideInterval = 5000,
  showProgressBar = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const progressRef = useRef(null);
  const slideTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  // 获取当前公告
  const currentAnnouncement = typeof announcements[currentIndex] === 'object' 
  ? announcements[currentIndex].message 
  : announcements[currentIndex];

  // 获取当前公告类型
  const currentType = typeof announcements[currentIndex] === 'object' 
  ? announcements[currentIndex].type || type 
  : type;


  // 公告类型样式映射
  const typeStyles = {
    info: {
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      iconColor: 'text-blue-100',
      icon: <Info />,
      title: '信息'
    },
    warning: {
      bgColor: 'bg-amber-500',
      textColor: 'text-white',
      iconColor: 'text-amber-100',
      icon: <AlertTriangle />,
      title: '注意'
    },
    success: {
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      iconColor: 'text-green-100',
      icon: <CheckCircle />,
      title: '成功'
    }
  };
  const currentStyle = typeStyles[currentType] || typeStyles.info;


  // 组件初始化标记，确保动画只在初始状态后执行
  useEffect(() => {
    // 组件挂载后标记为已初始化
    setIsInitialized(true);
  }, []);

  // 切换到下一个公告
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    resetProgress();
  };

  // 切换到上一个公告
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length);
    resetProgress();
  };

  // 重置进度条
  const resetProgress = () => {
    setProgress(0);
    clearInterval(progressTimerRef.current);
    
    if (!isPaused) {
      startProgressTimer();
    }
  };

  // 开始进度条计时器
  const startProgressTimer = () => {
    const interval = 16; // 约60fps的更新频率
    const increment = interval / autoSlideInterval * 100;
    
    progressTimerRef.current = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          return 0;
        }
        return newProgress;
      });
    }, interval);
  };

  // 处理组件关闭
  const handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsClosing(true);
    
    // 自动关闭动画后调用onClose
    setTimeout(() => {
      if (onClose) onClose();
      setIsClosing(false);
    }, 300);
  };

  // 切换最小化状态
  const toggleMinimized = (e) => {
    if (e) {
      e.stopPropagation(); // 阻止事件冒泡
      e.preventDefault(); // 阻止默认行为
    }
    
    // 使用函数式更新确保获取最新状态
    setIsMinimized(prevState => {
      const newState = !prevState;
      
      // 当最小化时清除计时器
      if (newState) {
        clearInterval(slideTimerRef.current);
        clearInterval(progressTimerRef.current);
      } else {
        // 当恢复显示时，如果不是暂停状态，重新启动计时器
        if (!isPaused && announcements.length > 1) {
          resetProgress();
          slideTimerRef.current = setInterval(nextSlide, autoSlideInterval);
        }
      }
      
      return newState;
    });
  };

  // 鼠标进入时暂停轮播
  const handleMouseEnter = () => {
    setIsPaused(true);
    clearInterval(slideTimerRef.current);
    clearInterval(progressTimerRef.current);
  };

  // 鼠标离开时恢复轮播
  const handleMouseLeave = () => {
    if (!isMinimized) {
      setIsPaused(false);
      startProgressTimer();
      
      if (announcements.length > 1) {
        slideTimerRef.current = setInterval(nextSlide, autoSlideInterval);
      }
    }
  };
  
  // 初始化和清理副作用
  useEffect(() => {
    if (visible && !isPaused && announcements.length > 0 && !isMinimized) {
      // 启动进度条
      if (showProgressBar) {
        startProgressTimer();
      }
      
      // 如果有多个公告，启动自动轮播
      if (announcements.length > 1) {
        slideTimerRef.current = setInterval(nextSlide, autoSlideInterval);
      }
    }
    
    // 组件卸载时清理计时器
    return () => {
      clearInterval(slideTimerRef.current);
      clearInterval(progressTimerRef.current);
    };
  }, [visible, isPaused, announcements.length, isMinimized]);

  // 在进度条到达100%时自动切换到下一个公告
  useEffect(() => {
    if (progress >= 100) {
      nextSlide();
    }
  }, [progress]);

  // 如果没有公告或不可见，则不渲染
  if (!visible || announcements.length === 0) {
    return null;
  }

  // 最小化状态时的渲染
  if (isMinimized) {
    return (
      <div 
        className={`fixed bottom-6 right-6 z-50 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${isInitialized ? 'transition-all duration-300' : ''} shadow-lg rounded-full overflow-hidden animate-pulse-slow group`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={toggleMinimized}
          className={`flex items-center justify-center p-3 w-12 h-12 rounded-full ${currentStyle.bgColor} ${currentStyle.textColor} hover:brightness-110 transition-all`}
          aria-label="显示公告"
          title="显示公告"
        >
          <span className="relative">
            <MessageCircleMore size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping-slow"></span>
          </span>
        </button>
        
        {/* 悬停提示 */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            点击查看公告
          </div>
          <div className="w-2 h-2 bg-gray-800 absolute bottom-0 right-4 transform rotate-45 translate-y-1/2"></div>
        </div>
      </div>
    );
  }

  // 完整状态时的渲染
  return (
    <div 
      className={`fixed bottom-6 right-6 max-w-sm w-full sm:w-96 z-50 ${isClosing ? 'opacity-0 translate-x-4' : 'opacity-100'} ${isInitialized ? 'transition-all duration-300' : ''} shadow-xl rounded-lg overflow-hidden`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${currentStyle.bgColor} ${currentStyle.textColor} h-full`}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <span className={`mr-2 ${currentStyle.iconColor}`}>
              {currentStyle.icon}
            </span>
            <span className="font-medium">{currentStyle.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            {dismissible && (
              <>
                <button 
                  onClick={toggleMinimized} 
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  title="最小化"
                  aria-label="最小化公告"
                >
                  <MinusCircle size={18} />
                </button>
                <button 
                  onClick={handleClose} 
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  title="关闭"
                  aria-label="关闭公告"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 公告内容 */}
        <div className="p-4 pt-0 pb-5">
          <div className="text-sm relative overflow-hidden h-full">
            <div className="transition-opacity duration-300">
              {currentAnnouncement}
            </div>
          </div>
        </div>

        {/* 底部控制栏 */}
        {announcements.length > 1 && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={prevSlide}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                title="上一条"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={nextSlide}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                title="下一条"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="text-xs opacity-80">
              {currentIndex + 1} / {announcements.length}
            </div>
          </div>
        )}

        {/* 进度条 */}
        {showProgressBar && announcements.length > 1 && (
          <div 
            className="h-1 bg-black/10 w-full overflow-hidden"
          >
            <div 
              ref={progressRef}
              className={`h-full bg-white/30 transition-all duration-300 ease-linear`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement; 