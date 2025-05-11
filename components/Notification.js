import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

/**
 * 通知组件 - 显示临时的成功、错误、警告或信息消息
 * 
 * @param {Object} props 组件属性
 * @param {string} props.type 通知类型: 'success', 'error', 'warning', 'info'
 * @param {string} props.message 通知消息内容
 * @param {boolean} props.dismissible 是否可被用户关闭
 * @param {number} props.autoHideDuration 自动隐藏的时间（毫秒），0表示不自动隐藏
 * @param {Function} props.onClose 关闭时的回调函数
 * @returns {JSX.Element|null}
 */
export default function Notification({
  type = 'info',
  message,
  dismissible = true,
  autoHideDuration = 5000,
  onClose
}) {
  const [show, setShow] = useState(true);
  
  // 通知类型配置
  const typeConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-400',
      iconColor: 'text-green-400'
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-400',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-400',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-400'
    }
  };
  
  // 获取当前类型的样式配置
  const currentType = typeConfig[type] || typeConfig.info;
  
  // 关闭通知
  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };
  
  // 自动隐藏
  useEffect(() => {
    let timer;
    if (autoHideDuration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoHideDuration]);
  
  if (!show || !message) return null;
  
  return (
    <div className={`rounded-md p-4 border ${currentType.bgColor} ${currentType.borderColor} mb-4`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${currentType.iconColor}`}>
          {currentType.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${currentType.textColor}`}>{message}</p>
        </div>
        {dismissible && (
          <div className="pl-3">
            <button
              className={`inline-flex rounded-md ${currentType.textColor} hover:bg-gray-100 focus:outline-none`}
              onClick={handleClose}
            >
              <span className="sr-only">关闭</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 