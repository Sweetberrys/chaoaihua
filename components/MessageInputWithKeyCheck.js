import React, { useState, useEffect } from 'react';
import { Key, AlertCircle } from 'lucide-react';
import GeminiKeyValidator from '../utils/GeminiKeyValidator';
import ApiKeyWarning from './ApiKeyWarning';

/**
 * 带API密钥检查的消息输入组件
 * 在发送消息前验证API密钥有效性
 *
 * @param {Object} props - 组件属性
 * @param {React.Component} props.MessageInputComponent - 原始消息输入组件
 * @param {string} props.apiEndpoint - 当前选择的API端点
 * @param {string} props.apiKey - 当前API密钥
 * @param {Function} props.onOpenApiSettings - 打开API设置的回调函数
 * @returns {JSX.Element}
 */
const MessageInputWithKeyCheck = ({
  MessageInputComponent,
  apiEndpoint,
  apiKey,
  onOpenApiSettings,
  ...rest
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [isValidKey, setIsValidKey] = useState(true);
  const [checkingKey, setCheckingKey] = useState(false);
  
  // 初始化验证器
  useEffect(() => {
    // 初始化验证器，加载持久化的状态
    GeminiKeyValidator.initializeValidator();
  }, []);
  
  // 检查API密钥状态
  useEffect(() => {
    const checkKeyStatus = async () => {
      if (GeminiKeyValidator.needsGeminiKey(apiEndpoint)) {
        setCheckingKey(true);
        
        // 更新全局密钥状态
        GeminiKeyValidator.updateKeyStatus({
          provider: apiEndpoint,
          isConfigured: Boolean(apiKey),
          apiKey
        });
        
        if (!apiKey) {
          setIsValidKey(false);
          setShowWarning(true);
          setCheckingKey(false);
          return;
        }
        
        try {
          const result = await GeminiKeyValidator.validateGeminiKey(apiKey);
          
          // 更新验证结果
          GeminiKeyValidator.updateKeyStatus({
            isValid: result.isValid,
            message: result.message
          });
          
          setIsValidKey(result.isValid);
          setShowWarning(!result.isValid);
        } catch (error) {
          console.error('验证API密钥时出错:', error);
          setIsValidKey(false);
          setShowWarning(true);
        } finally {
          setCheckingKey(false);
        }
      } else {
        // 非Gemini API端点，无需密钥
        setIsValidKey(true);
        setShowWarning(false);
      }
    };
    
    checkKeyStatus();
  }, [apiEndpoint, apiKey]);
  
  // 处理发送拦截
  const handleSendIntercept = (sendFunction) => {
    return (...args) => {
      if (GeminiKeyValidator.needsGeminiKey(apiEndpoint) && !GeminiKeyValidator.hasValidGeminiKey()) {
        // 显示警告并阻止发送
        setShowWarning(true);
        return false;
      }
      
      // 允许发送
      return sendFunction(...args);
    };
  };
  
  // 处理配置按钮点击
  const handleConfigureClick = () => {
    if (onOpenApiSettings) {
      onOpenApiSettings();
    }
  };
  
  // 渲染输入状态图标
  const renderStatusIcon = () => {
    if (!GeminiKeyValidator.needsGeminiKey(apiEndpoint)) {
      return null;
    }
    
    if (checkingKey) {
      return (
        <div className="text-yellow-500 animate-pulse">
          <Key size={18} />
        </div>
      );
    }
    
    if (!apiKey) {
      return (
        <div className="text-red-500 cursor-pointer" onClick={handleConfigureClick} title="未配置API密钥">
          <AlertCircle size={18} />
        </div>
      );
    }
    
    if (!isValidKey) {
      return (
        <div className="text-red-500 cursor-pointer" onClick={handleConfigureClick} title="API密钥无效">
          <Key size={18} />
        </div>
      );
    }
    
    return (
      <div className="text-green-500" title="API密钥有效">
        <Key size={18} />
      </div>
    );
  };
  
  return (
    <>
      <ApiKeyWarning 
        visible={showWarning} 
        onConfigureClick={handleConfigureClick} 
      />
      
      <div className="relative">
        <MessageInputComponent
          {...rest}
          disabled={GeminiKeyValidator.needsGeminiKey(apiEndpoint) && !isValidKey}
          onSend={handleSendIntercept(rest.onSend)}
          statusIcon={renderStatusIcon()}
        />
      </div>
    </>
  );
};

export default MessageInputWithKeyCheck; 