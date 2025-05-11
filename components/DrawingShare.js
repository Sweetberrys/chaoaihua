import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link, Upload, Copy, Check, X, ExternalLink, AlertCircle, QrCode, RefreshCw } from 'lucide-react';
import { generateShareLink, validateShareLink, generateShortLink } from '../utils/shareUtils';
import QRCodeDisplay from './QRCodeDisplay';

/**
 * 画幅分享组件
 * @param {boolean} visible - 是否显示
 * @param {Object} position - 弹窗位置对象 {top, left}
 * @param {function} onClose - 关闭回调
 * @param {Object} currentDrawing - 当前画布数据
 * @param {function} onImportDrawing - 导入画幅回调
 */
const DrawingShare = ({
  visible,
  position,
  onClose,
  currentDrawing,
  onImportDrawing
}) => {
  // 状态
  const [activeTab, setActiveTab] = useState('share'); // 'share' 或 'import'
  const [shareMode, setShareMode] = useState('long'); // 'long', 'short', 'qrcode'
  const [shareLink, setShareLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [importing, setImporting] = useState(false);
  const [isGeneratingShortLink, setIsGeneratingShortLink] = useState(false);
  const [shortLinkError, setShortLinkError] = useState('');
  
  // refs
  const linkInputRef = useRef(null);
  const shortLinkInputRef = useRef(null);
  const importInputRef = useRef(null);
  
  // 切换标签页
  const switchTab = (tab) => {
    setActiveTab(tab);
    // 清除状态
    setImportError('');
    setImportSuccess(false);
    setCopied(false);
    setShareMode('long');
    setShowQRCode(false);
  };
  
  // 生成分享链接
  useEffect(() => {
    if (visible && activeTab === 'share' && currentDrawing) {
      const link = generateShareLink(currentDrawing);
      setShareLink(link || '生成链接失败');
    }
  }, [visible, activeTab, currentDrawing]);
  
  // 生成短链接
  const handleGenerateShortLink = async () => {
    if (!currentDrawing || isGeneratingShortLink) return;
    
    try {
      setIsGeneratingShortLink(true);
      setShortLinkError('');
      
      const link = await generateShortLink(currentDrawing);
      
      if (link) {
        setShortLink(link);
        setShareMode('short');
      } else {
        setShortLinkError('生成短链接失败，请稍后再试');
      }
    } catch (error) {
      console.error('生成短链接错误:', error);
      // 显示用户友好的错误信息
      setShortLinkError(error.message || '生成短链接时出错');
    } finally {
      setIsGeneratingShortLink(false);
    }
  };
  
  // 切换到QR码模式
  const showQRCodeMode = async () => {
    // 如果还没有短链接，需要先生成短链接
    if (!shortLink && !isGeneratingShortLink) {
      try {
        setIsGeneratingShortLink(true);
        setShortLinkError('');
        
        const link = await generateShortLink(currentDrawing);
        
        if (link) {
          setShortLink(link);
          setShareMode('qrcode');
          setShowQRCode(true);
        } else {
          setShortLinkError('生成短链接失败，无法显示二维码');
          // 不切换到QR码模式，保持当前模式
          return;
        }
      } catch (error) {
        console.error('生成短链接错误:', error);
        setShortLinkError('生成二维码时出错');
        return;
      } finally {
        setIsGeneratingShortLink(false);
      }
    } else {
      // 已有短链接，直接切换到QR码模式
      setShareMode('qrcode');
      setShowQRCode(true);
    }
  };
  
  // 复制链接到剪贴板
  const copyLinkToClipboard = () => {
    const inputRef = shareMode === 'long' ? linkInputRef : shortLinkInputRef;
    
    if (inputRef?.current) {
      inputRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      
      // 3秒后重置复制状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };
  
  // 处理导入链接
  const handleImport = () => {
    // 清除之前的状态
    setImportError('');
    setImportSuccess(false);
    setImporting(true);
    
    try {
      // 验证链接
      if (!importUrl.trim()) {
        setImportError('请输入分享链接');
        setImporting(false);
        return;
      }
      
      // 确保链接包含协议
      let processedUrl = importUrl;
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }
      
      // 验证链接格式
      const isValid = validateShareLink(processedUrl);
      
      if (!isValid) {
        setImportError('无效的分享链接，请确认链接格式正确');
        setImporting(false);
        return;
      }
      
      // 设置为导入成功状态
      setImportSuccess(true);
      
      // 回调导入函数
      if (onImportDrawing) {
        onImportDrawing(processedUrl);
      }
    } catch (error) {
      console.error('导入链接错误:', error);
      setImportError('导入过程中出现错误，请重试');
    } finally {
      setImporting(false);
    }
  };
  
  // 获取当前活动的链接
  const getCurrentLink = () => {
    // QR码模式下始终使用短链接（如果有）
    if (shareMode === 'qrcode' && shortLink) {
      return shortLink;
    }
    // 其他模式下使用当前选择的链接类型
    return shareMode === 'short' && shortLink ? shortLink : shareLink;
  };
  
  // 外观渲染
  if (!visible) {
    return null;
  }
  
  return (
    <div 
      ref={(el) => {
        // 添加show类以激活过渡效果
        if (el) {
          el.classList.add('popup-transition');
          setTimeout(() => el.classList.add('show'), 10);
        }
      }}
      className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200 p-3 w-80"
      style={{
        top: position.top,
        left: position.left
      }}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
      <div className="relative z-10">
        {/* 头部栏 */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-gray-700 flex items-center">
            <Share2 className="w-4 h-4 mr-1.5" />
            画幅分享
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* 选项卡 */}
        <div className="flex bg-gray-100 rounded-lg p-0.5 mb-3">
          <button
            onClick={() => switchTab('share')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium flex justify-center items-center ${
              activeTab === 'share'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link className="w-3.5 h-3.5 mr-1.5" />
            分享链接
          </button>
          <button
            onClick={() => switchTab('import')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium flex justify-center items-center ${
              activeTab === 'import'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            导入链接
          </button>
        </div>
        
        {/* 分享链接选项卡内容 */}
        {activeTab === 'share' && (
          <>
            {/* 分享方式切换 */}
            {!showQRCode && (
              <div className="flex bg-gray-50 rounded-md p-1 mb-3">
                <button
                  onClick={() => setShareMode('long')}
                  className={`flex-1 py-1 rounded text-xs font-medium flex justify-center items-center ${
                    shareMode === 'long'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  完整链接
                </button>
                <button
                  onClick={handleGenerateShortLink}
                  disabled={isGeneratingShortLink}
                  className={`flex-1 py-1 rounded text-xs font-medium flex justify-center items-center ${
                    shareMode === 'short'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isGeneratingShortLink ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      生成中
                    </>
                  ) : (
                    '短链接'
                  )}
                </button>
                <button
                  onClick={showQRCodeMode}
                  className={`flex-1 py-1 rounded text-xs font-medium flex justify-center items-center ${
                    shareMode === 'qrcode'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <QrCode className="w-3 h-3 mr-1" />
                  二维码
                </button>
              </div>
            )}
            
            {/* 分享模式 - 完整链接 */}
            {!showQRCode && shareMode === 'long' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-500 mb-1">
                    复制以下链接分享当前画幅
                  </div>
                  <div className="relative">
                    <input
                      ref={linkInputRef}
                      type="text"
                      readOnly
                      value={shareLink}
                      className="w-full p-2 pr-9 text-sm border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={copyLinkToClipboard}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                      title={copied ? '已复制' : '复制链接'}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <Check className="w-3 h-3 mr-0.5" />
                      链接已复制到剪贴板
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    在新窗口中打开
                  </a>
                  
                  <button 
                    onClick={showQRCodeMode}
                    className="text-xs flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <QrCode className="w-3 h-3 mr-1" />
                    显示二维码
                  </button>
                </div>
              </div>
            )}
            
            {/* 分享模式 - 短链接 */}
            {!showQRCode && shareMode === 'short' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-500 mb-1">
                    使用短链接，更方便分享
                  </div>
                  <div className="relative">
                    <input
                      ref={shortLinkInputRef}
                      type="text"
                      readOnly
                      value={shortLink}
                      className="w-full p-2 pr-9 text-sm border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={copyLinkToClipboard}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                      title={copied ? '已复制' : '复制链接'}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <Check className="w-3 h-3 mr-0.5" />
                      链接已复制到剪贴板
                    </p>
                  )}
                  {shortLinkError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-0.5" />
                      {shortLinkError}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <a
                    href={shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    在新窗口中打开
                  </a>
                  
                  <button 
                    onClick={showQRCodeMode}
                    className="text-xs flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <QrCode className="w-3 h-3 mr-1" />
                    显示二维码
                  </button>
                </div>
                
                <div className="bg-green-50 rounded-md p-2 mt-2">
                  <p className="text-xs text-green-600">
                    短链接仅在30天内有效，请及时分享。
                  </p>
                </div>
              </div>
            )}
            
            {/* 分享模式 - QR码 */}
            {(showQRCode || shareMode === 'qrcode') && (
              <div className="space-y-3">
                {isGeneratingShortLink ? (
                  <div className="py-4 flex flex-col items-center justify-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent mb-2"></div>
                    <p className="text-xs text-gray-600">生成短链接中...</p>
                  </div>
                ) : shortLinkError ? (
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-red-500 mb-1">
                      <AlertCircle className="w-5 h-5 mx-auto" />
                    </div>
                    <p className="text-xs text-red-600 mb-2">{shortLinkError}</p>
                    <button
                      onClick={() => {
                        setShowQRCode(false);
                        setShareMode('long');
                        setShortLinkError('');
                      }}
                      className="text-xs px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-md text-red-700 transition-colors"
                    >
                      返回
                    </button>
                  </div>
                ) : (
                  <QRCodeDisplay 
                    url={shortLink || ''} 
                    title="画幅分享" 
                    size={150} 
                  />
                )}
                
                {!isGeneratingShortLink && !shortLinkError && (
                  <button
                    onClick={() => {
                      setShowQRCode(false);
                      setShareMode(shortLink ? 'short' : 'long');
                    }}
                    className="w-full text-xs py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                  >
                    返回链接模式
                  </button>
                )}
              </div>
            )}
            
            {!showQRCode && (
              <div className="bg-blue-50 rounded-md p-2 mt-2">
                <p className="text-xs text-blue-600">
                  此链接包含您当前画幅的完整数据，他人可通过"导入链接"查看您的画作。
                </p>
              </div>
            )}
          </>
        )}
        
        {/* 导入链接选项卡内容 */}
        {activeTab === 'import' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="import-link" className="text-xs text-gray-500 mb-1 block">
                粘贴分享链接以导入画幅
              </label>
              <input
                ref={importInputRef}
                id="import-link"
                type="text" 
                placeholder="https://..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  importError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {importError && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-0.5" />
                  {importError}
                </p>
              )}
            </div>
            
            <button
              onClick={handleImport}
              disabled={importing || importSuccess}
              className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                importing
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : importSuccess
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {importing ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  导入中...
                </span>
              ) : importSuccess ? (
                <span className="flex items-center justify-center">
                  <Check className="w-4 h-4 mr-2" />
                  导入成功
                </span>
              ) : (
                '导入画幅'
              )}
            </button>
            
            <div className="bg-gray-50 rounded-md p-2">
              <p className="text-xs text-gray-600">
                支持完整链接和短链接两种格式。导入后将覆盖当前画布内容。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingShare; 