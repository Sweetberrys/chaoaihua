import React from 'react';
import { ShieldAlert, Key } from 'lucide-react';

/**
 * API密钥警告组件
 * 当用户选择Gemini API但未配置有效密钥时显示警告
 * 
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 是否显示警告
 * @param {Function} props.onConfigureClick - 点击配置按钮的回调函数
 * @returns {JSX.Element}
 */
const ApiKeyWarning = ({ visible, onConfigureClick }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed inset-x-0 top-0 z-50 animate-slideDown">
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShieldAlert className="w-5 h-5 text-yellow-500 mr-2" />
            <p className="text-yellow-700 text-sm font-medium">
              使用 Gemini API 需先配置有效密钥
            </p>
          </div>
          <button
            onClick={onConfigureClick}
            className="inline-flex items-center px-3 py-1 border border-yellow-400 text-xs font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Key className="w-3.5 h-3.5 mr-1" />
            配置密钥
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarning; 