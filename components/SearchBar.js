import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * 可重用的搜索组件
 * 
 * @param {Object} props
 * @param {string} props.value - 搜索值
 * @param {Function} props.onChange - 搜索值变化回调
 * @param {Function} props.onClear - 清除搜索回调
 * @param {string} props.placeholder - 占位符
 * @param {Function} props.onSort - 排序回调
 * @param {Object} props.sortOptions - 排序选项，格式为 {value: string, label: string}[]
 * @param {string} props.sortValue - 当前排序值
 * @param {string} props.className - 自定义外层容器类名
 * @returns {JSX.Element}
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = '搜索...',
  onSort,
  sortOptions = [],
  sortValue = '',
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {sortOptions.length > 0 && onSort && (
        <div className="sm:w-48">
          <select
            value={sortValue}
            onChange={(e) => onSort(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="排序选项"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 