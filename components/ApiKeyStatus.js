import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Key, ShieldCheck, ShieldAlert, X, Check, Trash, ExternalLink, Settings, Plus, ChevronDown } from 'lucide-react';
import Notification from './Notification';
import ApiEndpointSelector from './ApiEndpointSelector';
import GeminiKeyValidator from '../utils/GeminiKeyValidator';

/**
 * API密钥状态显示组件 - 显示在工具栏中，指示当前API密钥的状态
 * 
 * @param {Object} props 组件属性
 * @param {string} props.apiKey 当前API密钥值
 * @param {Object} props.status API密钥状态对象 {isValid, message, code}
 * @param {boolean} props.isChecking 是否正在检查API密钥状态
 * @param {Function} props.onUpdate 更新API密钥的回调函数
 * @param {Function} props.onClear 清除API密钥的回调函数
 * @param {Function} props.onCheck 检查API密钥状态的回调函数
 * @param {string} props.apiEndpoint 当前API端点设置
 * @param {Function} props.onApiEndpointChange API端点更改回调
 * @param {Function} props.onSaveApiKeys 保存多组API密钥的回调函数
 * @param {Function} props.onDeleteApiKey 删除指定API密钥的回调函数
 * @param {Array} props.savedApiKeys 已保存的API密钥数组
 * @returns {JSX.Element}
 */
export default function ApiKeyStatus({
  apiKey,
  status,
  isChecking,
  onUpdate,
  onClear,
  onCheck,
  apiEndpoint = 'huggingface',
  onApiEndpointChange,
  onSaveApiKeys,
  onDeleteApiKey,
  savedApiKeys = []
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('status'); // 'status' 或 'settings'
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // 多密钥管理相关状态
  const [apiKeys, setApiKeys] = useState(savedApiKeys.length > 0 ? savedApiKeys : []);
  const [selectedKeyId, setSelectedKeyId] = useState(apiKey ? 'current' : '');
  const [keyName, setKeyName] = useState('');
  const [keyContent, setKeyContent] = useState('');
  const [keyStatus, setKeyStatus] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // 初始化组件时，如果有默认的apiKey但没有savedApiKeys，则创建一个默认项
  useEffect(() => {
    if (apiKey && apiKeys.length === 0) {
      // 尝试从localStorage获取密钥名称
      let keyName = '默认密钥';
      if (typeof window !== 'undefined') {
        const keysNameMapping = JSON.parse(localStorage.getItem('apiKeysNameMapping') || '{}');
        if (keysNameMapping[apiKey]) {
          keyName = keysNameMapping[apiKey];
        }
      }
      
      setApiKeys([{
        id: 'current',
        name: keyName, // 使用保存的名称或默认值
        key: apiKey,
        isValid: status?.isValid || false,
        message: status?.message || ''
      }]);
      setSelectedKeyId('current');
      setKeyName(keyName);
      setKeyContent(apiKey);
      setKeyStatus(status);
    } else if (apiKeys.length > 0 && !selectedKeyId) {
      // 如果有保存的密钥但没有选中项，选择第一个
      const firstKey = apiKeys[0];
      setSelectedKeyId(firstKey.id);
      setKeyName(firstKey.name);
      setKeyContent(firstKey.key);
      setKeyStatus({isValid: firstKey.isValid, message: firstKey.message});
    }
  }, [apiKey, apiKeys, status, selectedKeyId]);
  
  // 计算弹窗位置，确保在不同屏幕尺寸下都能正确显示
  const calculatePopupPosition = (buttonElement) => {
    if (!buttonElement) return { top: 0, left: 0 };
    
    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 预设弹窗尺寸 - 增加宽度使内容更舒适
    const popupWidth = viewportWidth < 640 ? Math.min(viewportWidth * 0.95, 360) : 380;
    const popupHeight = 450; // 增加高度以适应更大的内部空间
    
    // 计算理想位置
    let top = buttonRect.bottom + window.scrollY + 10;
    let left = buttonRect.left + window.scrollX - (popupWidth / 2 - buttonRect.width / 2);
    
    // 防止左侧溢出
    left = Math.max(15, left);
    // 防止右侧溢出
    left = Math.min(left, viewportWidth - popupWidth - 15);
    
    // 检查底部溢出，如果会溢出则在按钮上方显示
    if (top + popupHeight > viewportHeight + window.scrollY) {
      top = buttonRect.top + window.scrollY - popupHeight - 10;
    }
    
    return { top, left };
  };

  // 点击按钮显示/隐藏弹出窗口，并计算弹窗位置
  const togglePopup = () => {
    if (!showPopup) {
      // 计算按钮位置，用于定位弹窗
      if (buttonRef.current) {
        setPopupPosition(calculatePopupPosition(buttonRef.current));
      }
    }
    
    setShowPopup(!showPopup);
    setDropdownOpen(false);
  };
  
  // 创建新密钥
  const createNewKey = (e) => {
    // 阻止事件冒泡，防止其他事件处理器干扰
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // 立即重置输入框的值（DOM操作，确保UI立即反映变化）
    const nameInput = document.getElementById('keyName');
    const contentInput = document.getElementById('keyContent');
    if (nameInput) nameInput.value = '';
    if (contentInput) contentInput.value = '';
    
    // 重置状态
    setIsCreatingNew(true);
    setSelectedKeyId('');
    setKeyName('');
    setKeyContent('');
    setKeyStatus(null);
    setIsValidating(false);
    setDropdownOpen(false);
    // 清除可能的通知
    setNotification(null);
    
    // 使用setTimeout确保状态更新在下一个事件循环执行
    setTimeout(() => {
      // 二次确认状态已重置
      setKeyName('');
      setKeyContent('');
    }, 0);
  };
  
  // 选择已有密钥
  const selectApiKey = (id) => {
    const selected = apiKeys.find(key => key.id === id);
    if (selected) {
      setSelectedKeyId(id);
      setKeyName(selected.name);
      setKeyContent(selected.key);
      setKeyStatus({isValid: selected.isValid, message: selected.message});
      setIsCreatingNew(false);
    }
    setDropdownOpen(false);
  };
  
  // 保存当前密钥
  const saveCurrentKey = async () => {
    if (!keyName) {
      setNotification({
        type: 'error',
        message: '请输入API密钥名称'
      });
      return;
    }
    
    if (!keyContent) {
      setNotification({
        type: 'error',
        message: '请输入API密钥内容'
      });
      return;
    }
    
    // 检查是否有重复名称的密钥
    const duplicateNameKey = apiKeys.find(key => 
      key.name.toLowerCase() === keyName.toLowerCase() && 
      key.id !== selectedKeyId
    );
    
    if (duplicateNameKey) {
      setNotification({
        type: 'error',
        message: `已存在名称为"${keyName}"的密钥`
      });
      return;
    }
    
    // 检查是否有重复内容的密钥
    const duplicateContentKey = apiKeys.find(key => 
      key.key.trim() === keyContent.trim() && 
      key.id !== selectedKeyId
    );
    
    if (duplicateContentKey) {
      setNotification({
        type: 'error',
        message: `此API密钥已被保存为"${duplicateContentKey.name}"`
      });
      return;
    }
    
    // 保存密钥名称映射到localStorage
    if (typeof window !== 'undefined') {
      const keysNameMapping = JSON.parse(localStorage.getItem('apiKeysNameMapping') || '{}');
      keysNameMapping[keyContent] = keyName;
      localStorage.setItem('apiKeysNameMapping', JSON.stringify(keysNameMapping));
    }
    
    // 创建新密钥或更新现有密钥
    try {
      let updatedKeys;
      let savedKeyId;
      
      if (isCreatingNew) {
        // 创建新密钥
        const newKey = {
          id: Date.now().toString(),
          name: keyName,
          key: keyContent,
          isValid: true, // 默认设置为有效
          message: '已保存'
        };
        updatedKeys = [...apiKeys, newKey];
        savedKeyId = newKey.id;
        setSelectedKeyId(newKey.id);
        setIsCreatingNew(false);
      } else {
        // 更新现有密钥
        savedKeyId = selectedKeyId;
        updatedKeys = apiKeys.map(key => 
          key.id === selectedKeyId 
            ? {
                ...key, 
                name: keyName, 
                key: keyContent,
                isValid: true, // 默认设置为有效
                message: '已更新'
              } 
            : key
        );
      }
      
      setApiKeys(updatedKeys);
      
      try {
        // 尝试调用外部保存回调
        if (onSaveApiKeys) {
          await onSaveApiKeys(updatedKeys);
        }
      } catch (saveError) {
        console.error('保存多组API密钥失败:', saveError);
        // 即使多组保存失败，继续尝试更新当前密钥
        if (saveError.message && saveError.message.includes('getAllApiKeys')) {
          setNotification({
            type: 'warning',
            message: '多组密钥存储功能不可用，但当前密钥仍将被使用'
          });
        }
      }
      
      // 更新当前使用的API密钥
      if (onUpdate) {
        await onUpdate(keyContent);
      }
      
      // 如果当前是Gemini API端点，更新验证服务状态
      if (apiEndpoint === 'gemini') {
        const validationResult = await GeminiKeyValidator.validateGeminiKey(keyContent);
        GeminiKeyValidator.updateKeyStatus({
          provider: 'gemini',
          isConfigured: true,
          isValid: validationResult.isValid,
          apiKey: keyContent,
          message: validationResult.message
        });
      }
      
      setNotification({
        type: 'success',
        message: '成功保存API密钥'
      });
      
      // 更新本地密钥状态
      setKeyStatus({
        isValid: true,
        message: '已保存'
      });
      
      // 短暂显示下拉框，让用户能看到保存的密钥
      setDropdownOpen(true);
      
      // 2秒后关闭下拉框
      setTimeout(() => {
        setDropdownOpen(false);
      }, 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: '保存API密钥失败: ' + (error.message || '未知错误')
      });
    }
  };
  
  // 删除当前密钥
  const deleteCurrentKey = async () => {
    if (!selectedKeyId) return;
    
    try {
      // 从列表中移除
      const updatedKeys = apiKeys.filter(key => key.id !== selectedKeyId);
      setApiKeys(updatedKeys);
      
      // 如果还有其他密钥，选择第一个；否则重置为创建新密钥状态
      if (updatedKeys.length > 0) {
        selectApiKey(updatedKeys[0].id);
    } else {
        createNewKey(); // 不需要传递事件，因为这不是直接的用户交互
      }
      
      // 调用外部删除回调
      if (onDeleteApiKey) {
        await onDeleteApiKey(selectedKeyId);
      }
      
      // 如果删除的是当前使用的密钥，则清除
      if (onClear && (apiKeys.find(k => k.id === selectedKeyId)?.key === apiKey)) {
        await onClear();
      }
      
      // 清空下拉菜单打开的状态
      setDropdownOpen(false);
      
      setNotification({
        type: 'success',
        message: '成功删除API密钥'
      });
      
      // 如果删除后还有密钥，短暂显示下拉框让用户确认
      if (updatedKeys.length > 0) {
        setTimeout(() => {
          setDropdownOpen(true);
          
          // 再次短暂延时关闭
          setTimeout(() => {
            setDropdownOpen(false);
          }, 3000);
        }, 500);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: '删除API密钥失败: ' + (error.message || '未知错误')
      });
    }
  };
  
  // 处理API端点更改
  const handleApiEndpointChange = (newEndpoint) => {
    if (onApiEndpointChange) {
      onApiEndpointChange(newEndpoint);
      
      // 更新验证服务中的provider状态
      GeminiKeyValidator.updateKeyStatus({
        provider: newEndpoint
      });
      
      // 如果切换到Gemini API，立即检查密钥
      if (newEndpoint === 'gemini' && apiKey) {
        (async () => {
          const validationResult = await GeminiKeyValidator.validateGeminiKey(apiKey);
          GeminiKeyValidator.updateKeyStatus({
            isConfigured: Boolean(apiKey),
            isValid: validationResult.isValid,
            apiKey,
            message: validationResult.message
          });
        })();
      }
      
      setNotification({
        type: 'success',
        message: `API调用策略已更改为 ${newEndpoint === 'huggingface' ? 'Hugging Face优先' : newEndpoint === 'gemini' ? 'Gemini API' : '智能选择'}`
      });
      
      // 3秒后关闭通知
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  // 点击外部区域关闭弹出窗口
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 处理弹窗外点击
      if (
        showPopup &&
        popupRef.current && 
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
      
      // 处理下拉框外点击
      if (
        dropdownOpen &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup, dropdownOpen]);
  
  // 监听窗口大小变化，重新计算弹窗位置
  useEffect(() => {
    const handleResize = () => {
      if (showPopup && buttonRef.current) {
        setPopupPosition(calculatePopupPosition(buttonRef.current));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showPopup]);
  
  // 确定显示的图标和颜色
  let icon, color, title;
  if (!apiKey) {
    icon = <Key className="w-5 h-5" />;
    color = 'text-gray-500';
    title = '未设置API密钥';
  } else if (isValidating) {
    icon = <Key className="w-5 h-5 animate-pulse" />;
    color = 'text-yellow-500';
    title = '正在验证API密钥';
  } else if (status?.isValid === true) {
    icon = <ShieldCheck className="w-5 h-5" />;
    color = 'text-green-500';
    title = '有效的API密钥: ' + status.message;
  } else if (status?.isValid === false) {
    icon = <ShieldAlert className="w-5 h-5" />;
    color = 'text-red-500';
    title = '无效的API密钥: ' + status.message;
  } else {
    icon = <Key className="w-5 h-5" />;
    color = 'text-blue-500';
    title = '未验证的API密钥';
  }
  
  // 创建弹窗Portal
  const renderPopup = () => {
    if (!showPopup) return null;
    
    // 使用Portal将弹窗渲染到body，避免被父元素的overflow:hidden截断
    return ReactDOM.createPortal(
      <div 
        ref={popupRef}
        className={`fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden
                   ${window.innerWidth < 640 ? 'w-[95vw] max-w-[360px]' : 'w-[380px]'}`}
        style={{
          top: popupPosition.top,
          left: popupPosition.left,
          margin:'10px',
          animation: 'fadeIn 0.2s ease-out, slideIn 0.2s ease-out'
        }}
      >
        {/* 弹窗标题 */}
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${window.innerWidth < 640 ? 'text-base' : 'text-lg'}`}>API密钥设置</h3>
            <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <X size={window.innerWidth < 640 ? 18 : 20} />
            </button>
          </div>
        </div>
        
        {/* 选项卡切换 */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center ${activeTab === 'status' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('status')}
          >
            状态
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('settings')}
          >
            设置
          </button>
        </div>
        
        {/* 通知消息 */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
        
        {activeTab === 'status' && (
          <div className="p-5">
            {/* API密钥选择和新建操作 */}
            <div className="mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  选择API密钥
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    // 直接内联调用，确保事件正确传递
                    createNewKey(e);
                  }}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新建密钥
                </button>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="relative w-full border border-gray-300 rounded-md shadow-sm pl-4 pr-10 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="block truncate">
                    {isCreatingNew 
                      ? '新建密钥' 
                      : (apiKeys.find(k => k.id === selectedKeyId)?.name || '选择API密钥')}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </button>

                {/* 下拉菜单 */}
                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {/* 已保存的密钥列表 */}
                    {apiKeys.length > 0 ? (
                      apiKeys.map(item => (
                        <div
                          key={item.id}
                          className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-100 ${
                            selectedKeyId === item.id ? 'bg-gray-100' : ''
                          }`}
                          onClick={() => selectApiKey(item.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="font-medium block truncate">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-500 block truncate mt-1">
                                {item.key.substring(0, 10)}...{item.key.substring(item.key.length - 5)}
                              </span>
                            </div>
                            {item.isValid && (
                              <ShieldCheck className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-3 px-4 text-gray-500 text-sm">
                        无保存的密钥
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 密钥信息表单 */}
            <div className="space-y-5">
              {/* API密钥名称 */}
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
                  API密钥名称
                </label>
                <input
                  type="text"
                  id="keyName"
                  key={`name-${isCreatingNew ? 'new' : selectedKeyId}`}
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="输入名称以便识别"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              {/* API密钥内容 */}
              <div>
                <label htmlFor="keyContent" className="block text-sm font-medium text-gray-700 mb-2">
                  API密钥内容
                </label>
                <input
                  type="text"
                  id="keyContent"
                  key={`content-${isCreatingNew ? 'new' : selectedKeyId}`}
                  value={keyContent}
                  onChange={(e) => setKeyContent(e.target.value)}
                  placeholder="输入Google Gemini API密钥"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
                  
              {/* 操作按钮 */}
              <div className="flex justify-between pt-3">
                <div className="flex space-x-2">
                  {/* 删除按钮 */}
                  {!isCreatingNew && selectedKeyId && (
                    <button
                      onClick={deleteCurrentKey}
                      className="flex items-center px-4 py-2.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      删除
                    </button>
                  )}
                </div>
                
                {/* 保存按钮 */}
                <button
                  onClick={saveCurrentKey}
                  disabled={!keyName || !keyContent}
                  className={`flex items-center px-5 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${!keyName || !keyContent
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-5">
            <ApiEndpointSelector 
              currentEndpoint={apiEndpoint}
              onChange={handleApiEndpointChange}
            />
          </div>
        )}
      </div>,
      document.body
    );
  };
  
  return (
    <div className="relative inline-block">
      {/* API密钥按钮 */}
      <button
        ref={buttonRef}
        onClick={togglePopup}
        className={`p-2 ${color} rounded-full hover:bg-gray-100 transition-colors duration-200`}
        title={title}
      >
        {icon}
      </button>
      
      {/* 使用Portal渲染弹窗 */}
      {renderPopup()}
      
      {/* 添加全局样式 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(-10px); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 