/**
 * ApiKeyManager.js - API密钥管理组件
 * 
 * 提供API密钥的展示、添加、编辑、删除和状态切换功能
 */
import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Power, Check, X, AlertCircle, Copy, RefreshCw, AlertTriangle, Activity, Ban, Eye, EyeOff } from 'lucide-react';
import { ADMIN_PASSWORD } from '../utils/auth';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import { Loader2 } from 'lucide-react';

export default function ApiKeyManager() {
  // 状态管理
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminVerified, setAdminVerified] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const [formMode, setFormMode] = useState(null); // 'add', 'edit', null
  const [selectedKey, setSelectedKey] = useState(null);
  const [formData, setFormData] = useState({ name: '', key: '' });
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFullKeys, setShowFullKeys] = useState(false);
  
  // 分页和搜索相关状态
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // 新增批量检查相关状态
  const [batchChecking, setBatchChecking] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchResults, setBatchResults] = useState(null);

  // 搜索防抖处理
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);
  
  // 当搜索或排序条件变化时，重置到第一页
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, [debouncedSearchQuery, sortBy, sortOrder]);

  // 加载API密钥数据
  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建URL，包含分页、搜索和排序参数
      let url = `/api/API6c735e6BcE?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      
      if (debouncedSearchQuery) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }
      
      if (sortBy) {
        url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      }
      
      // 添加管理员密码和显示完整密钥标志
      url += `&adminPassword=${encodeURIComponent(adminPassword)}&showFullKey=${showFullKeys}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '加载API密钥失败');
      }
      
      const data = await response.json();
      
      setApiKeys(data.data);
      setPagination(prev => ({
        ...prev,
        totalItems: data.pagination.totalItems,
        totalPages: data.pagination.totalPages
      }));
    } catch (error) {
      console.error('加载API密钥列表时出错:', error);
      setError(error.message);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  // 当分页或搜索参数变化时加载数据
  useEffect(() => {
    if (adminVerified) {
      loadApiKeys();
    }
  }, [pagination.page, pagination.pageSize, debouncedSearchQuery, sortBy, sortOrder, adminVerified]);

  // 分页处理
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // 处理列排序
  const handleColumnSort = (column) => {
    // 如果点击当前排序列，切换排序方向
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 切换到新列，默认为降序
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // 处理排序选择框变化
  const handleSortChange = (sortValue) => {
    const [newSortBy, newSortOrder] = sortValue.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  
  // 渲染排序图标
  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    
    return sortOrder === 'asc' 
      ? <span className="ml-1 text-blue-500">▲</span>
      : <span className="ml-1 text-blue-500">▼</span>;
  };

  // 身份验证
  const handleAuthenticate = () => {
    if (adminPassword) {
      setAdminVerified(true);
      setShowPasswordForm(false);
    } else {
      showNotification('请输入管理员密码', 'error');
    }
  };

  // 显示通知
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 添加API密钥
  const handleAddKey = async () => {
    if (!formData.name || !formData.key) {
      showNotification('名称和API密钥都是必需的', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/API6c735e6BcE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          adminPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '添加API密钥失败');
      }
      
      const data = await response.json();
      showNotification('API密钥添加成功');
      setFormMode(null);
      setFormData({ name: '', key: '' });
      loadApiKeys();
    } catch (error) {
      console.error('添加API密钥时出错:', error);
      showNotification(error.message, 'error');
    }
  };

  // 更新API密钥
  const handleUpdateKey = async () => {
    if (!selectedKey || (!formData.name && !formData.key)) {
      showNotification('名称或API密钥至少需要一个', 'error');
      return;
    }
    
    try {
      const response = await fetch(`/api/API6c735e6BcE/${selectedKey.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || undefined,
          key: formData.key || undefined,
          adminPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新API密钥失败');
      }
      
      const data = await response.json();
      showNotification('API密钥更新成功');
      setFormMode(null);
      setFormData({ name: '', key: '' });
      setSelectedKey(null);
      loadApiKeys();
    } catch (error) {
      console.error('更新API密钥时出错:', error);
      showNotification(error.message, 'error');
    }
  };

  // 处理切换API密钥状态
  const handleToggleApiKey = async (id) => {
    if (loading) return;

    try {
      setLoading(true);
      
      const response = await fetch(`/api/API6c735e6BcE/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '切换API密钥状态失败');
      }

      await loadApiKeys();
      showNotification('API密钥状态已更新', 'success');
    } catch (error) {
      console.error('切换API密钥状态时出错:', error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除API密钥
  const handleDeleteApiKey = async (id) => {
    if (loading) return;

    if (!window.confirm('确定要删除此API密钥吗？此操作不可撤销。')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/API6c735e6BcE/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '删除API密钥失败');
      }

      await loadApiKeys();
      showNotification('API密钥已删除', 'success');
    } catch (error) {
      console.error('删除API密钥时出错:', error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 复制API密钥到剪贴板
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('API密钥已复制到剪贴板', 'success');
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      showNotification('复制到剪贴板失败', 'error');
    }
  };

  // 打开编辑模态框
  const openEditModal = async (key) => {
    setSelectedKey(key);
    
    try {
      // 获取完整的API密钥（未掩码）
      const response = await fetch(`/api/API6c735e6BcE/${key.id}?showFullKey=true&adminPassword=${encodeURIComponent(adminPassword)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '获取完整API密钥失败');
      }
      
      const data = await response.json();
      const fullApiKey = data.data;
      
      // 预填充表单，包括完整的API密钥
      setFormData({
        name: fullApiKey.name,
        key: fullApiKey.key
      });
      
      setFormMode('edit');
    } catch (error) {
      console.error('获取完整API密钥时出错:', error);
      showNotification(error.message, 'error');
      
      // 如果获取失败，仍然进入编辑模式，但不预填充API密钥
      setFormData({
        name: key.name,
        key: ''
      });
      setFormMode('edit');
    }
  };

  // 处理表单输入
  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 取消表单
  const handleCancelForm = () => {
    setFormMode(null);
    setFormData({ name: '', key: '' });
    setSelectedKey(null);
  };

  // 渲染通知
  const renderNotification = () => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'error' ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500';
    const icon = notification.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500" /> : <Check className="w-5 h-5 text-green-500" />;
    
    return (
      <div className={`fixed top-4 right-4 p-4 rounded-md border ${bgColor} flex items-center gap-2 shadow-md max-w-md`}>
        {icon}
        <p>{notification.message}</p>
      </div>
    );
  };

  // 渲染密码表单
  const renderAdminPasswordForm = () => {
    if (!showPasswordForm) return null;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">管理员验证</h2>
        <p className="text-gray-600 mb-4">请输入管理员密码以继续</p>
        <div className="mb-4">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="管理员密码"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAuthenticate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
        >
          验证
        </button>
      </div>
    );
  };

  // 渲染添加/编辑表单
  const renderForm = () => {
    if (!formMode) return null;
    
    const isEdit = formMode === 'edit';
    const title = isEdit ? '编辑API密钥' : '添加新API密钥';
    const buttonText = isEdit ? '保存' : '添加';
    const handleSubmit = isEdit ? handleUpdateKey : handleAddKey;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormInput}
            placeholder="API密钥名称"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">API密钥 {isEdit && <span className="text-gray-400 text-sm">(留空表示不修改)</span>}</label>
          <input
            type="text"
            name="key"
            value={formData.key}
            onChange={handleFormInput}
            placeholder="API密钥值"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancelForm}
            className="py-2 px-4 border rounded-md hover:bg-gray-100 transition"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  };

  // 渲染确认删除框
  const renderConfirmDelete = () => {
    if (!confirmDelete) return null;
  
  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">确认删除</h2>
          <p className="mb-4">确定要删除 <span className="font-semibold">{confirmDelete.name}</span> 吗？此操作无法撤销。</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmDelete(null)}
              className="py-2 px-4 border rounded-md hover:bg-gray-100 transition"
            >
              取消
            </button>
            <button
              onClick={() => handleDeleteApiKey(confirmDelete.id)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染搜索栏
  const renderSearchBar = () => {
    return (
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchQuery} 
            onChange={(value) => setSearchQuery(value)} 
            onClear={() => setSearchQuery('')} 
            placeholder="搜索API密钥..." 
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCheckAllKeys}
            disabled={batchChecking || apiKeys.length === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-white ${
              batchChecking || apiKeys.length === 0 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title="检查所有API密钥的状态"
          >
            <RefreshCw className={`w-4 h-4 ${batchChecking ? 'animate-spin' : ''}`} />
            <span>{batchChecking ? '检查中...' : '检查所有密钥'}</span>
          </button>
          <button 
            onClick={() => setFormMode('add')}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>添加API密钥</span>
          </button>
        </div>
      </div>
    );
  };
  
  // 渲染分页控件
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    
    return (
      <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        visibleItems={apiKeys.length}
        onPageChange={handlePageChange}
        className="mt-4"
      />
    );
  };
  
  // 处理批量检查所有API密钥
  const handleCheckAllKeys = async () => {
    if (batchChecking) return;
    
    try {
      // 设置检查中状态
      setBatchChecking(true);
      setBatchProgress({ current: 0, total: apiKeys.length });
      setBatchResults(null);
      
      // 显示开始检查通知
      showNotification(`开始批量检查 ${apiKeys.length} 个API密钥...`, 'info');
      
      // 调用批量检查API
      const response = await fetch('/api/checkAllApiKeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '批量检查API密钥失败');
      }
      
      // 模拟进度更新
      const simulateProgress = async () => {
        const totalKeys = apiKeys.length;
        const totalTime = 15000; // 预计15秒完成
        const intervalTime = 500; // 每500毫秒更新一次
        const increments = totalTime / intervalTime;
        const incrementValue = totalKeys / increments;
        
        for (let i = 1; i <= increments; i++) {
          const current = Math.min(Math.round(incrementValue * i), totalKeys);
          setBatchProgress({ current, total: totalKeys });
          await new Promise(resolve => setTimeout(resolve, intervalTime));
          
          if (current >= totalKeys) break;
        }
      };
      
      // 启动进度模拟
      simulateProgress();
      
      // 获取结果
      const results = await response.json();
      
      // 检查是否成功
      if (!results.success) {
        throw new Error(results.message || '批量检查过程中出错');
      }
      
      // 设置检查结果
      setBatchResults(results);
      
      // 显示检查完成通知
      showNotification(`检查完成！有效密钥: ${results.valid}, 配额充足: ${results.validWithQuota}, 配额耗尽: ${results.validWithoutQuota}, 无效密钥: ${results.invalid}`, 'success');
      
      // 重新加载API密钥列表
      loadApiKeys();
    } catch (error) {
      console.error('批量检查API密钥时出错:', error);
      showNotification(error.message, 'error');
    } finally {
      setBatchChecking(false);
    }
  };
  
  // 检查单个API密钥状态
  const handleCheckKeyStatus = async (id) => {
    let loadingMessage = null;
    
    try {
      // 获取要检查的API密钥
      const keyToCheck = apiKeys.find(key => key.id === id);
      if (!keyToCheck) {
        showNotification('未找到该API密钥', 'error');
        return;
      }
      
      // 显示加载状态并保存引用以便后续清除
      loadingMessage = showNotification(`正在检查密钥 "${keyToCheck.name}" 的状态...`, 'info');
      
      // 调用API检查密钥状态
      const response = await fetch('/api/checkApiKeyStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKeyId: id,
          adminPassword,
        }),
      });
      
      // 无论API请求成功与否，都重新加载API密钥列表以获取最新状态
      try {
        await loadApiKeys();
      } catch (loadError) {
        console.error('重新加载API密钥列表时出错:', loadError);
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '检查API密钥状态失败');
      }
      
      const result = await response.json();
      
      // 根据结果显示通知
      let message = '';
      let type = 'info';
      
      if (result.isValid && result.hasQuota) {
        message = `API密钥 "${keyToCheck.name}" 有效且配额充足`;
        type = 'success';
      } else if (result.isValid && !result.hasQuota) {
        message = `API密钥 "${keyToCheck.name}" 有效但配额已用尽`;
        type = 'warning';
      } else {
        message = `API密钥 "${keyToCheck.name}" 无效: ${result.message}`;
        type = 'error';
      }
      
      showNotification(message, type);
    } catch (error) {
      console.error('检查API密钥状态时出错:', error);
      showNotification(error.message, 'error');
      
      // 即使出错也尝试重新加载API密钥列表
      try {
        await loadApiKeys();
      } catch (loadError) {
        console.error('出错后重新加载API密钥列表时出错:', loadError);
      }
    }
  };
  
  // 获取配额状态颜色和文本
  const getQuotaStatusInfo = (quotaStatus) => {
    // 默认值
    let color = 'text-gray-500';
    let bgColor = 'bg-gray-100';
    let text = '未知';
    let icon = null;
    
    if (!quotaStatus || quotaStatus === 'UNKNOWN') {
      icon = <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      return { color, bgColor, text, icon };
    }
    
    if (quotaStatus === 'AVAILABLE') {
      color = 'text-green-700';
      bgColor = 'bg-green-100';
      text = '配额充足';
      icon = <Check className="w-3.5 h-3.5 mr-1" />;
    } else if (quotaStatus === 'EXCEEDED') {
      color = 'text-red-700';
      bgColor = 'bg-red-100';
      text = '配额耗尽';
      icon = <AlertCircle className="w-3.5 h-3.5 mr-1" />;
    }
    
    return { color, bgColor, text, icon };
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '格式错误';
    }
  };

  // 格式化最后检查时间
  const formatLastCheckTime = (dateString) => {
    if (!dateString) return '未检查';
    
    try {
      const checkDate = new Date(dateString);
      const now = new Date();
      const diffMs = now - checkDate;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffSec < 60) {
        return '刚刚检查';
      } else if (diffMin < 60) {
        return `${diffMin}分钟前`;
      } else if (diffHour < 24) {
        return `${diffHour}小时前`;
      } else if (diffDay < 30) {
        return `${diffDay}天前`;
      } else {
        return formatDate(dateString);
      }
    } catch (error) {
      console.error('检查时间格式化错误:', error);
      return '未知';
    }
  };
  
  // 渲染批量检查结果
  const renderBatchResults = () => {
    if (!batchResults) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-2">检查结果</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium">有效密钥</div>
            <div className="text-2xl text-green-600">{batchResults.valid}</div>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium">无效密钥</div>
            <div className="text-2xl text-red-600">{batchResults.invalid}</div>
            </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium">配额充足</div>
            <div className="text-2xl text-green-600">{batchResults.validWithQuota}</div>
                    </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium">配额耗尽</div>
            <div className="text-2xl text-yellow-600">{batchResults.validWithoutQuota}</div>
                    </div>
                  </div>
        <button
          onClick={() => setBatchResults(null)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          关闭详情
        </button>
      </div>
    );
  };
  
  // 渲染批量检查进度
  const renderBatchProgress = () => {
    if (!batchChecking) return null;
    
    const progress = Math.round((batchProgress.current / batchProgress.total) * 100);
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center mb-2">
          <Activity className="w-5 h-5 text-blue-500 mr-2 animate-pulse" />
          <h3 className="text-lg font-medium text-blue-700">正在检查API密钥</h3>
                  </div>
        <div className="mb-2 text-sm text-blue-600">
          进度: {batchProgress.current} / {batchProgress.total} ({progress}%)
                </div>
        <div className="w-full bg-blue-200 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
            </div>
          </div>
    );
  };

  // 渲染表格头部
  const renderTableHeader = () => {
    return (
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            名称
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            API密钥
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            创建时间
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            状态
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            最后检查
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            配额状态
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            操作
          </th>
        </tr>
      </thead>
    );
  };

  // 渲染表格行
  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center">
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2">加载中...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (apiKeys.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
            {searchQuery ? '没有找到匹配的API密钥' : '还没有API密钥'}
          </td>
        </tr>
      );
    }

    return apiKeys.map((key) => {
      const keyDisplay = showFullKeys ? key.key : maskApiKey(key.key);
      const statusColor = key.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      const statusText = key.enabled ? '启用' : '禁用';
      
      // 获取配额状态信息
      const quotaStatusInfo = getQuotaStatusInfo(key.quotaStatus);
      
      return (
        <tr key={key.id} className="bg-white">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {key.name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
            <div className="flex items-center">
              <span className="mr-2">{keyDisplay}</span>
                <button
                onClick={() => copyToClipboard(key.key)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                title="复制API密钥"
              >
                <Copy className="h-4 w-4" />
                </button>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatDate(key.createdAt)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
            >
              {statusText}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {key.lastChecked ? formatLastCheckTime(key.lastChecked) : '未检查'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quotaStatusInfo.color}`}
            >
              {quotaStatusInfo.text}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-2">
            <button
              onClick={() => handleToggleApiKey(key.id)}
              className={`${
                key.enabled ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'
              } px-2 py-1 rounded-md text-xs focus:outline-none`}
              title={key.enabled ? '禁用此API密钥' : '启用此API密钥'}
            >
              {key.enabled ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleCheckKeyStatus(key.id)}
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 rounded-md text-xs focus:outline-none"
              title="检查此API密钥状态"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => openEditModal(key)}
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-2 py-1 rounded-md text-xs focus:outline-none"
              title="编辑此API密钥"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteApiKey(key.id)}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded-md text-xs focus:outline-none"
              title="删除此API密钥"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </td>
        </tr>
      );
    });
  };

  // 掩码API密钥
  const maskApiKey = (key) => {
    if (!key) return '';
    if (key.length <= 8) return '********';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
  };
  
  // 切换显示完整密钥
  const toggleShowFullKeys = () => {
    setShowFullKeys(prev => !prev);
  };

  // 渲染工具栏
  const renderToolbar = () => {
    return (
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFormMode('add')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            添加API密钥
          </button>
          <button
            onClick={handleCheckAllKeys}
            disabled={batchChecking || apiKeys.length === 0}
            className={`${
              apiKeys.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : batchChecking
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-md flex items-center transition`}
          >
            {batchChecking ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                检查中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-4 w-4" />
                检查所有密钥
              </>
            )}
          </button>
          <button
            onClick={toggleShowFullKeys}
            className={`${
              showFullKeys ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
            } text-white py-2 px-4 rounded-md flex items-center transition`}
          >
            {showFullKeys ? (
              <>
                <EyeOff className="mr-1 h-4 w-4" />
                隐藏完整密钥
              </>
            ) : (
              <>
                <Eye className="mr-1 h-4 w-4" />
                显示完整密钥
              </>
            )}
          </button>
          </div>
        <div className="flex items-center space-x-2">
          <SearchBar 
            value={searchQuery} 
            onChange={(value) => setSearchQuery(value)} 
            onClear={() => setSearchQuery('')} 
            placeholder="搜索API密钥..." 
          />
        </div>
      </div>
    );
  };

  // 主渲染
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API密钥管理</h1>
      
      {!adminVerified && renderAdminPasswordForm()}
      
      {adminVerified && (
        <>
          {renderNotification()}
          {!!formMode && renderForm()}
          {confirmDelete && renderConfirmDelete()}
          
          {renderToolbar()}
          {renderBatchProgress()}
          {renderBatchResults()}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {renderTableHeader()}
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableRows()}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
} 