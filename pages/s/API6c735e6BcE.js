/**
 * API密钥管理页面
 */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import ApiKeyManager from '../../components/ApiKeyManager';

export default function ApiKeyManagementPage() {
  const [isClient, setIsClient] = useState(false);

  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Head>
        <title>API密钥管理</title>
        <meta name="description" content="管理Gemini API密钥" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <main className="min-h-screen bg-gray-50">
        {isClient && <ApiKeyManager />}
      </main>
    </>
  );
} 