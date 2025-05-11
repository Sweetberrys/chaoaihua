/**
 * 短链接解析页面
 * 用于解析短码并重定向到主页显示对应内容
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

/**
 * 短链接页面组件
 */
const ShortLinkPage = ({ data, error }) => {
  const router = useRouter();
  
  useEffect(() => {
    // 如果有效数据，重定向到主页并附加数据
    if (data && !error) {
      router.replace(`/#shared=${data}`);
    }
  }, [data, error, router]);
  
  // 加载中状态
  if (!error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Head>
          <title>正在重定向...</title>
        </Head>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-lg">正在加载画幅...</p>
        </div>
      </div>
    );
  }
  
  // 错误状态
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Head>
        <title>链接无效</title>
      </Head>
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">链接已失效</h1>
        <p className="text-gray-600 mb-4">该分享链接不存在或已过期，请联系分享者获取新的链接。</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

// 从文件系统读取短链接数据
const readShortLinksData = () => {
  const dataPath = path.join(process.cwd(), 'data', 'shortlinks.json');
  
  try {
    if (!fs.existsSync(dataPath)) {
      return {};
    }
    
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(jsonData || '{}');
  } catch (error) {
    console.error('读取短链接数据失败:', error);
    return {};
  }
};

// 清理过期数据
const cleanupExpiredData = (shortLinksData) => {
  const now = new Date();
  const updatedData = { ...shortLinksData };
  
  Object.keys(updatedData).forEach(key => {
    if (updatedData[key].expiresAt && new Date(updatedData[key].expiresAt) < now) {
      delete updatedData[key];
    }
  });
  
  return updatedData;
};

/**
 * 服务器端获取数据
 */
export async function getServerSideProps(context) {
  try {
    const { shortcode } = context.params;
    
    // 读取短链接数据
    const shortLinksData = readShortLinksData();
    const cleanedData = cleanupExpiredData(shortLinksData);
    
    // 获取当前短码数据
    const shortCodeData = cleanedData[shortcode];
    
    // 如果没有找到数据
    if (!shortCodeData) {
      return {
        props: {
          error: '链接不存在或已过期',
          data: null
        }
      };
    }
    
    // 返回序列化后的数据
    return {
      props: {
        data: shortCodeData.data,
        error: null
      }
    };
  } catch (error) {
    console.error('短链接解析错误:', error);
    return {
      props: {
        error: '解析短链接时出错',
        data: null
      }
    };
  }
}

export default ShortLinkPage; 