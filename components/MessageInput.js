import React, { useState } from 'react';
import { Send } from 'lucide-react';

/**
 * 消息输入组件
 * 
 * @param {Object} props - 组件属性
 * @param {Function} props.onSend - 发送消息的回调函数
 * @param {boolean} props.disabled - 是否禁用输入
 * @param {React.ReactNode} props.statusIcon - 状态图标
 * @returns {JSX.Element}
 */
const MessageInput = ({ onSend, disabled = false, statusIcon = null }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    
    // 调用onSend回调，如果返回false则表示被拦截
    const success = onSend(message.trim());
    
    // 只有在发送成功时清空输入框
    if (success !== false) {
      setMessage('');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className={`relative flex items-center border rounded-lg ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
      {statusIcon && (
        <div className="absolute left-3">
          {statusIcon}
        </div>
      )}
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "请先配置有效的API密钥" : "输入消息..."}
        className={`flex-1 p-3 resize-none outline-none ${statusIcon ? 'pl-9' : 'pl-3'} min-h-[50px] max-h-[150px] ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        rows={1}
      />
      
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={`p-2 rounded-full mr-2 ${!message.trim() || disabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
        title={disabled ? "请先配置有效的API密钥" : "发送消息"}
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput; 