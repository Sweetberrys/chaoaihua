import React from 'react';

/**
 * API端点选择器组件
 * 
 * @param {Object} props
 * @param {string} props.currentEndpoint 当前选择的API端点
 * @param {Function} props.onChange 当选择改变时的回调函数
 * @returns {JSX.Element}
 */
export default function ApiEndpointSelector({ currentEndpoint, onChange }) {
  // API端点选项
  const endpoints = [
    { id: 'gemini', name: 'Gemini', description: '直接使用Gemini' },
    { id: 'huggingface', name: 'Hugging Face优先', description: '优先使用Hugging Face，如果失败则使用Gemini' },
    { id: 'best', name: 'Gemini优先', description: '优先使用Gemini，如果失败则使用Hugging Face' }
  ];

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        API调用策略
      </label>
      <div className="space-y-2">
        {endpoints.map(endpoint => (
          <div 
            key={endpoint.id}
            className={`
              flex items-start p-2 rounded-md border cursor-pointer transition-colors
              ${currentEndpoint === endpoint.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'border-gray-200 hover:bg-gray-50'}
            `}
            onClick={() => onChange(endpoint.id)}
          >
            <div className="flex h-5 items-center mr-2">
              <input
                type="radio"
                checked={currentEndpoint === endpoint.id}
                onChange={() => onChange(endpoint.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <label className="font-medium text-gray-700">
                {endpoint.name}
              </label>
              <p className="text-xs text-gray-500">{endpoint.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 