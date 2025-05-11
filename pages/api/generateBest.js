/**
 * generateBest.js - 集成直接调用和回退机制的图像生成API端点
 * 
 * 该端点首先尝试直接调用Gemini API，如果失败则尝试Hugging Face API，
 * 如果两者都失败，则回退到通过代理使用Gemini API。
 */
import { generateImage } from '../../utils/apiService';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from 'node-fetch';

// 自定义fetch函数，将请求重定向到代理服务器
const fetchWithProxy = async (url, options) => {
  // 将原始URL替换为代理URL
  const proxyUrl = url.replace('https://generativelanguage.googleapis.com', 'http://api-proxy.me/gemini');
  console.log(`使用代理: ${proxyUrl}`);
  // 发送代理请求
  return fetch(proxyUrl, options);
};

export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '不允许的请求方法' });
  }

  // 从请求体中获取提示、绘图数据和自定义API密钥
  const { prompt, drawingData, customApiKey } = req.body;
  
  // 记录请求详情（为简洁起见，截断drawingData）
  console.log("API请求(最佳策略):", {
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
    // 第一阶段：尝试直接通过代理调用Gemini API
    console.log("阶段1：尝试直接通过代理调用Gemini API...");
    
    // 使用自定义API密钥如果提供了，否则使用环境变量中的密钥
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("未找到API密钥，跳过直接调用，进入回退策略");
      // 如果没有API密钥，直接进入回退策略
      return await useFallbackStrategy(prompt, drawingData, customApiKey, res);
    }
    
    try {
      // 使用自定义fetch函数初始化GoogleGenerativeAI
      const genAI = new GoogleGenerativeAI(apiKey, {
        fetch: fetchWithProxy
      });
      
      // 设置responseModalities包含"Image"，以便模型可以生成图像
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: [
            'Text',
            'Image'
          ]
        }
      });

      let generationContent;
      // 如果提供了绘图数据，将其作为图像包含在请求中
      if (drawingData) {
        // 创建一个包含base64编码图像的内容部分
        const imagePart = {
          inlineData: {
            data: drawingData,
            mimeType: "image/png"
          }
        };
        
        // 组合绘图和文本提示
        generationContent = [
          imagePart,
          {
            text: `${prompt}. Keep the same minimal line doodle style.` || "Add something new to this drawing, in the same style."
          }
        ];
        console.log("使用包含绘图数据和提示词的多部分内容");
      } else {
        // 如果没有提供绘图，仅使用文本提示
        generationContent = prompt;
        console.log("仅使用文本提示");
      }

      console.log("调用Gemini API...");
      const response = await model.generateContent(generationContent);
      console.log("Gemini API响应接收成功");
      
      // 初始化响应数据
      const result = {
        success: true,
        message: '',
        imageData: null
      };
      
      // 处理响应部分
      for (const part of response.response.candidates[0].content.parts){
        // 根据部分类型，获取文本或图像数据
        if (part.text) {
          result.message = part.text;
          console.log("收到文本响应:", part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          console.log("收到图像数据，长度:", imageData.length);
          // 在响应中包含base64数据
          result.imageData = imageData;
        }
      }
      
      console.log("发送成功响应");
      return res.status(200).json(result);
    } catch (directError) {
      // 如果直接调用失败，记录错误并进入回退策略
      console.error("直接调用Gemini API失败:", directError);
      console.log("进入回退策略...");
      return await useFallbackStrategy(prompt, drawingData, customApiKey, res, directError);
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

// 回退策略函数 - 使用generateImage服务
async function useFallbackStrategy(prompt, drawingData, customApiKey, res, directError = null) {
  try {
    console.log("使用回退策略：Hugging Face -> 代理Gemini");
    // 调用生成图像函数
    const result = await generateImage(prompt, drawingData, customApiKey);
    
    // 根据结果类型返回响应
    if (result.success) {
      console.log("通过回退策略生成图像成功", result.usedFallback ? "(使用了代理Gemini API)" : "(使用了Hugging Face API)");
      
      // 成功响应
      return res.status(200).json({
        success: true,
        message: result.message || '',
        imageData: result.imageData || null,
        usedFallback: true,
        directError: directError ? directError.message : null
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
        details: "所有API尝试均失败。",
        directError: directError ? directError.message : null,
        hfError: result.hfError,
        geminiError: result.geminiError
      });
    }
  } catch (error) {
    console.error("回退策略出错:", error);
    
    // 通用错误处理
    return res.status(500).json({ 
      success: false, 
      error: "所有API尝试均失败：" + (error.message || "未知错误"),
      suggestion: "请稍后重试。如果问题持续存在，请检查您的网络连接或联系支持团队。"
    });
  }
} 