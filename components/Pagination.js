import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 可重用的分页控件组件
 * 
 * @param {Object} props
 * @param {number} props.currentPage - 当前页码
 * @param {number} props.totalPages - 总页数
 * @param {number} props.totalItems - 总条目数
 * @param {number} props.pageSize - 每页条目数
 * @param {number} props.visibleItems - 当前显示的条目数
 * @param {Function} props.onPageChange - 页码变化回调函数
 * @param {string} props.className - 自定义外层容器类名
 * @returns {JSX.Element}
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  visibleItems,
  onPageChange,
  className = '',
}) {
  // 如果总页数小于等于1，不显示分页
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="text-sm text-gray-500" style={{margin:'20px'}}>
        当前 {`${visibleItems} 条，共 ${totalItems} 条，第 ${currentPage} 页 / 共 ${totalPages} 页`}
      </div>
      <div className="flex space-x-2">
        {/* 首页按钮 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className={`p-1 rounded ${currentPage <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          aria-label="首页"
        >
          <span className="sr-only">首页</span>
          <div className="flex">
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-2" />
          </div>
        </button>
        
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-1 rounded ${currentPage <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          aria-label="上一页"
        >
          <span className="sr-only">上一页</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {/* 页码按钮 */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // 计算要显示的页码
          let pageNum;
          if (totalPages <= 5) {
            // 如果总页数小于等于5，直接显示所有页
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            // 当前页在前3页，显示1-5页
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            // 当前页在后3页，显示最后5页
            pageNum = totalPages - 4 + i;
          } else {
            // 当前页在中间，显示当前页及其前后2页
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm mx-0.5 ${
                currentPage === pageNum ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={`第 ${pageNum} 页`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
        
        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`p-1 rounded ${currentPage >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          aria-label="下一页"
        >
          <span className="sr-only">下一页</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* 末页按钮 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className={`p-1 rounded ${currentPage >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          aria-label="末页"
        >
          <span className="sr-only">末页</span>
          <div className="flex">
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-2" />
          </div>
        </button>
      </div>
    </div>
  );
} 