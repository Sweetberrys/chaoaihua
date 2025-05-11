import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '不允许的请求方法' });
  }

  // 从请求体中获取提示、绘图数据和自定义API密钥
  const { prompt, drawingData, customApiKey } = req.body;
  
  // 记录请求详情（为简洁起见，截断drawingData）
  console.log("API请求:", {
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
    // 使用Hugging Face端点而不是Google Gemini API
    console.log("准备调用Hugging Face API...");
    
    // 准备请求数据
    const requestData = {
      prompt,
      drawingData,
      customApiKey
    };
    
    // 调用Hugging Face端点
    const hfResponse = await fetch("https://trudy-gemini-codrawing.hf.space/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error(`Hugging Face API响应错误 (${hfResponse.status}):`, errorText);
      
      // 检查是否是配额限制错误
      const isQuotaError = errorText.includes("429 Too Many Requests") || 
                          errorText.includes("quota") || 
                          errorText.includes("rate limit");
      
      if (isQuotaError) {
        return res.status(429).json({
          success: false,
          error: "Google Gemini API配额已用尽。请等待配额重置（通常是24小时）或使用不同的API密钥。",
          details: "API配额限制：Gemini API有每日调用次数限制。免费版通常限制为每天60次请求。",
          solution: "您可以：1) 等待配额重置；2) 在设置中提供自己的API密钥；3) 升级至付费版Google API计划。",
          originalError: errorText
        });
      }
      
      throw new Error(`Hugging Face API返回错误 ${hfResponse.status}: ${errorText}`);
    }
    
    console.log("Hugging Face API响应接收成功");
    
    // 解析响应
    const data = await hfResponse.json();
    
    // 确保响应格式符合前端预期
    const result = {
      success: true,
      message: data.message || '',
      imageData: data.imageData || null
    };
    
    console.log("发送成功响应");
    return res.status(200).json(result);
  } catch (error) {
    console.error("生成内容时出错:", error);
    
    // 通用错误处理
    return res.status(500).json({ 
      success: false, 
      error: "请求处理失败：" + (error.message || "未知错误"),
      suggestion: "请稍后重试。如果问题持续存在，请检查您的网络连接或联系支持团队。"
    });
  }
}
