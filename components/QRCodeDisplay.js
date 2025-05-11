/**
 * QR码显示组件
 * 用于生成和显示分享用的二维码
 */
import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Check } from 'lucide-react';

/**
 * QR码显示组件
 * @param {string} url - 需要编码的URL
 * @param {string} title - 显示标题
 * @param {number} size - QR码大小，默认128像素
 */
const QRCodeDisplay = ({ url, title, size = 128, bgColor = '#FFFFFF', fgColor = '#000000' }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState(null);
  const qrRef = useRef(null);
  
  // 下载QR码为图片
  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    try {
      // 创建canvas元素
      const canvas = qrRef.current.querySelector('canvas');
      if (!canvas) return;
      
      // 转换为图片URL
      const imageUrl = canvas.toDataURL('image/png');
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${title || '分享'}-QR码.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 显示下载成功状态
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('下载QR码失败:', error);
      setError('下载二维码失败');
    }
  };
  
  if (!url) return null;
  
  return (
    <div className="flex flex-col items-center space-y-3">
      <p className="text-xs text-gray-500 text-center mb-1">
        使用手机扫描二维码，快速分享或打开
      </p>
      
      <div 
        ref={qrRef}
        className="bg-white p-2 rounded-lg shadow-sm border border-gray-200"
      >
        <QRCodeCanvas 
          value={url} 
          size={size} 
          bgColor={bgColor} 
          fgColor={fgColor}
          level="H" // 高容错级别
          includeMargin={true} // 包含边距
        />
      </div>
      
      <button
        onClick={downloadQRCode}
        className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
      >
        {downloaded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>已保存</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>保存二维码</span>
          </>
        )}
      </button>
    </div>
  );
};

export default QRCodeDisplay; 