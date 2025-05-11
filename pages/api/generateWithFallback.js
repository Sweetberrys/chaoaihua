/**
 * generateWithFallback.js - 带有自动回退功能的图像生成API端点
 * 
 * 该端点优先使用Hugging Face API，如果失败则回退到通过代理使用Gemini API。
 */
import { generateImage } from '../../utils/apiService';

export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '不允许的请求方法' });
  }

  // 从请求体中获取提示、绘图数据和自定义API密钥
  const { prompt, drawingData, customApiKey } = req.body;
  
  // 记录请求详情（为简洁起见，截断drawingData）
  console.log("API请求(带回退):", {
    prompt,
    hasDrawingData: !!drawingData,
    drawingDataLength: drawingData ? drawingData.length : 0,
    drawingDataSample: drawingData ? `${drawingData.substring(0, 50)}... (已截断)` : null,
    hasCustomApiKey: !!customApiKey
  });
  
  if (!prompt) {
    return res.status(400).json({ error: '必须提供提示文本' });
  }

  try {
    // 调用生成图像函数
    const result = await generateImage(prompt, drawingData, customApiKey);
    
    // 根据结果类型返回响应
    if (result.success) {
      console.log("生成图像成功", result.usedFallback ? "(使用了回退API)" : "(使用了主要API)");
      
      // 成功响应
      return res.status(200).json({
        success: true,
        message: result.message || '',
        imageData: result.imageData || null,
        usedFallback: result.usedFallback || false
      });
    } else {
      // 处理不同类型的错误
      const statusCode = result.status || 500;
      
      // 如果是配额限制错误
      if (statusCode === 429) {
        return res.status(429).json({
          success: false,
          error: "API配额已用尽。请等待配额重置或使用您自己的API密钥。",
          details: "API配额限制：Gemini API有每日调用次数限制。免费版通常限制为每天60次请求。",
          solution: "您可以：1) 等待配额重置；2) 在设置中提供自己的API密钥；",
        });
      }
      
      // 其他错误
      return res.status(statusCode).json({ 
        success: false, 
        error: result.error || "未知错误",
        details: "两个API端点均未能成功处理您的请求。",
        hfError: result.hfError,
        geminiError: result.geminiError
      });
    }
  } catch (error) {
    console.error("处理请求时出错:", error);
    
    // 通用错误处理
    return res.status(500).json({ 
      success: false, 
      error: "请求处理失败：" + (error.message || "未知错误"),
      suggestion: "请稍后重试。如果问题持续存在，请检查您的网络连接或联系支持团队。"
    });
  }
} 