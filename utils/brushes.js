/**
 * 画笔工具模块 - 提供各种画笔类型及绘制方法
 */

// 可用的笔触类型
export const brushTypes = [
  // 基础笔触
  { id: 'normal', name: '标准笔刷', category: 'basic', icon: 'circle' },
  { id: 'round', name: '圆形笔刷', category: 'basic', icon: 'circle' },
  { id: 'square', name: '方形笔刷', category: 'basic', icon: 'square' },
  { id: 'calligraphy', name: '书法笔刷', category: 'basic', icon: 'pen' },
  // { id: 'pencil', name: '铅笔', category: 'basic', icon: 'pencil' },
  
  // 纹理笔触
  { id: 'noise', name: '噪点笔刷', category: 'texture', icon: 'more-horizontal' },
  { id: 'sand', name: '沙质笔刷', category: 'texture', icon: 'more-horizontal' },
  { id: 'pixel', name: '像素笔刷', category: 'texture', icon: 'square' },
  
  // 光效笔触
  { id: 'star', name: '星光笔刷', category: 'light', icon: 'zap' },
  { id: 'magic', name: '魔法笔刷', category: 'light', icon: 'zap' },
  { id: 'meteor', name: '流星笔刷', category: 'light', icon: 'zap' },
  { id: 'rainbow', name: '彩虹笔刷', category: 'light', icon: 'palette' },
  { id: 'electric', name: '电流笔刷', category: 'light', icon: 'zap' },
  
  // 喷溅效果
  { id: 'spray', name: '喷溅笔刷', category: 'spray', icon: 'cloud' },
  { id: 'splatter', name: '泼溅效果', category: 'spray', icon: 'cloud' },
  { id: 'graffiti', name: '涂鸦笔刷', category: 'spray', icon: 'cloud' },
  
  // 水墨类
  { id: 'ink', name: '水墨笔刷', category: 'ink', icon: 'pen' },
  { id: 'brush', name: '毛笔', category: 'ink', icon: 'pen' },
  { id: 'watercolor', name: '水彩', category: 'ink', icon: 'palette' },
  
  // 写实工具
  { id: 'realPencil', name: '写实铅笔', category: 'realistic', icon: 'pencil' },
  { id: 'pen', name: '钢笔', category: 'realistic', icon: 'pen' },
  { id: 'chalk', name: '粉笔', category: 'realistic', icon: 'minus' },
  
  // 特效笔刷
  { id: 'scratch', name: '刮痕笔刷', category: 'special', icon: 'minus' },
  
  // 几何笔触
  { id: 'dotted', name: '点阵笔刷', category: 'geometric', icon: 'circle' },
  { id: 'wave', name: '波浪笔刷', category: 'geometric', icon: 'wave' },
  { id: 'mosaic', name: '马赛克笔刷', category: 'geometric', icon: 'square' },
  
  // 自然元素
  { id: 'leaf', name: '叶脉笔刷', category: 'nature', icon: 'leaf' },
  { id: 'wood', name: '木纹笔刷', category: 'texture', icon: 'more-horizontal' },
  { id: 'fabric', name: '布纹笔刷', category: 'texture', icon: 'grid' },
  
  // 特殊效果
  { id: 'particle', name: '微粒笔刷', category: 'special', icon: 'circle' },
  { id: 'neon', name: '霓虹笔刷', category: 'light', icon: 'zap' },
  { id: 'pointillism', name: '点彩笔刷', category: 'artistic', icon: 'circle' },
  { id: 'gel', name: '胶状笔刷', category: 'special', icon: 'droplet' },
  { id: 'smoke', name: '烟雾笔刷', category: 'special', icon: 'cloud' },
  { id: 'metallic', name: '金属笔刷', category: 'texture', icon: 'circle' }
];

// 默认笔触设置
export const defaultBrushSettings = {
  // 基础设置
  opacity: 1,
  size: 5,
  spacing: 0.1, // 点之间的间隔比例
  smoothing: 0.5, // 平滑程度
  
  // 基础笔触属性
  roundness: 1, // 1为圆形，小于1为椭圆
  angle: 0, // 椭圆旋转角度
  
  // 喷溅笔刷属性
  sprayDensity: 0.7,
  sprayRadius: 1,
  
  // 书法笔刷属性
  calligraphyAngle: 45,
  calligraphyWidth: 0.5,
  
  // 铅笔属性
  pencilNoise: 0.5,
  
  // 像素属性
  pixelSize: 2,
  
  // 彩虹属性
  rainbowSpeed: 0.5,
  rainbowSaturation: 0.7,
  
  // 噪点属性
  noiseDensity: 0.6,
  noiseSize: 0.7,
  
  // 沙子属性
  sandDensity: 0.8,
  sandSize: 0.6,
  
  // 星星属性
  starSize: 1,
  starPoints: 5,
  starGlow: 0.8,
  
  // 魔法属性
  magicDensity: 0.7,
  magicColors: 0.8,
  
  // 流星属性
  meteorTail: 0.7,
  meteorSpeed: 0.6,
  
  // 水墨属性
  inkOpacity: 0.7,
  inkDiffusion: 1.2,
  
  // 毛笔属性
  brushPressure: 0.6,
  brushWetness: 0.7,
  
  // 水彩属性
  watercolorBleed: 1.5,
  watercolorGranulation: 0.5,
  
  // 真实铅笔属性
  realPencilHardness: 0.4, // 0为软，1为硬
  realPencilTexture: 0.7,
  
  // 钢笔属性
  penFlexibility: 0.5,
  penInkFlow: 0.6,
  
  // 粉笔属性
  chalkDensity: 0.8,
  chalkTexture: 0.7,
  
  // 刮痕属性
  scratchRoughness: 0.7,
  scratchDepth: 0.6,
  
  // 涂鸦属性
  graffitiSaturation: 0.7,
  graffitiSpread: 0.8,
  
  // 泼溅属性
  splatterIntensity: 0.8,
  splatterSpread: 1.2,
  
  // 电流属性
  electricVolatility: 0.8,
  electricBranches: 0.6,
  electricGlow: 0.7,
  
  // 点阵笔触属性
  dottedDensity: 0.7,
  dottedSize: 0.5,
  dottedPattern: 0.5, // 0为规则排列，1为随机分布
  
  // 波浪笔触属性
  waveFrequency: 0.2, // 波浪频率
  waveAmplitude: 0.8, // 波浪幅度
  wavePhase: 0.0, // 波浪相位
  
  // 马赛克笔触属性
  mosaicSize: 0.7,
  mosaicGap: 0.2, // 马赛克间隙
  mosaicRandomness: 0.3, // 随机性
  
  // 叶脉笔触属性
  leafBranches: 0.7, // 分支数量
  leafCurve: 0.6, // 弯曲程度
  leafSymmetry: 0.8, // 对称性
  
  // 木纹笔触属性
  woodGrain: 0.7, // 纹理粗细
  woodCurve: 0.5, // 弯曲程度
  woodNoiseScale: 0.6, // 噪声尺度
  
  // 布纹笔触属性
  fabricDensity: 0.7, // 织物密度
  fabricAngle: 45, // 织物角度
  fabricVariation: 0.4, // 变化程度
  
  // 微粒笔触属性
  particleCount: 0.8, // 粒子数量
  particleSpeed: 0.6, // 粒子速度
  particleSize: 0.5, // 粒子大小
  particleLifetime: 0.7, // 粒子生命周期
  
  // 霓虹笔触属性
  neonGlow: 0.8, // 发光强度
  neonWidth: 0.5, // 中心线宽度
  neonColorShift: 0.6, // 颜色变化
  
  // 点彩笔触属性
  pointillismDensity: 0.8, // 点密度
  pointillismSizeVariation: 0.7, // 大小变化
  pointillismColorVariation: 0.5, // 颜色变化
  
  // 胶状笔触属性
  gelTransparency: 0.6, // 透明度
  gelDistortion: 0.5, // 扭曲程度
  gelShininess: 0.7, // 光泽度
  
  // 烟雾笔触属性
  smokeDensity: 0.7, // 烟雾密度
  smokeDispersion: 0.8, // 扩散程度
  smokeTurbulence: 0.6, // 湍流程度
  
  // 金属笔触属性
  metallicShine: 0.8, // 光泽度
  metallicTexture: 0.6, // 纹理
  metallicScratch: 0.4  // 划痕
};

/**
 * 设置画布上下文的笔触风格
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string} brushType - 笔触类型
 * @param {Object} customSettings - 自定义设置
 * @param {string} color - 笔触颜色
 * @param {number} width - 笔触宽度
 */
export const setBrushStyle = (ctx, brushType, customSettings = {}, color = '#000000', width = 5) => {
  // 合并默认设置和自定义设置
  const settings = { ...defaultBrushSettings, ...customSettings };
  
  // 重置所有样式
  ctx.globalAlpha = settings.opacity;
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  
  // 根据笔触类型设置特定样式
  switch (brushType) {
    case 'normal':
      // 默认笔触，不需要额外样式
      break;
      
    case 'round':
      // 圆形笔触，已经是默认样式
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      break;
      
    case 'square':
      // 方形笔触
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      break;
      
    case 'pencil':
      // 基础铅笔效果，使用轻微的不透明度
      ctx.globalAlpha = 0.8;
      break;
      
    case 'rainbow':
      // 彩虹笔触不改变线条样式，只在绘制中改变颜色
      break;
      
    case 'pixel':
      // 像素笔触不需要特殊样式设置，在绘制函数中处理
      break;
      
    case 'calligraphy':
      // 书法笔触不需要特殊样式设置，在绘制函数中处理
      break;
      
    case 'spray':
      // 喷溅效果不需要特殊样式设置，在绘制函数中处理
      break;
      
    case 'noise':
      // 噪点无需特殊样式，在绘制中处理
      break;
      
    case 'sand':
      // 沙质无需特殊样式，在绘制中处理
      break;
      
    case 'star':
    case 'magic':
    case 'meteor':
      // 光效笔触在绘制函数中实现
      break;
      
    case 'ink':
    case 'brush':
    case 'watercolor':
      // 水墨类笔触在绘制函数中实现
      break;
      
    case 'realPencil':
    case 'pen':
    case 'chalk':
      // 写实工具在绘制函数中实现
      break;
      
    case 'scratch':
    case 'graffiti':
    case 'splatter':
    case 'electric':
      // 特效笔触在绘制函数中实现
      break;
      
    // 新增笔触类型
    case 'dotted':
    case 'wave':
    case 'mosaic':
    case 'leaf':
    case 'wood':
    case 'fabric':
    case 'particle':
      // 这些笔触在绘制函数中实现特殊效果
      break;
      
    case 'neon':
      // 霓虹笔触基础样式 - 添加发光效果
      ctx.shadowColor = color;
      ctx.shadowBlur = width * settings.neonGlow * 2;
      break;
      
    case 'pointillism':
    case 'gel':
    case 'smoke':
    case 'metallic':
      // 这些笔触在绘制函数中实现特殊效果
      break;
      
    default:
      // 未知笔触类型，使用默认样式
      console.warn(`未知笔触类型: ${brushType}，使用默认样式`);
  }
};

/**
 * 特殊笔触绘制函数 - 用于不能仅通过样式实现的笔触类型
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string} brushType - 笔触类型ID
 * @param {number} x - 当前X坐标
 * @param {number} y - 当前Y坐标
 * @param {number} prevX - 前一点X坐标
 * @param {number} prevY - 前一点Y坐标
 * @param {Object} settings - 笔触设置
 * @param {string} color - 笔触颜色
 * @param {number} width - 笔触宽度
 * @returns {boolean} 是否已处理绘制（true表示已完成绘制，不需要默认绘制）
 */
export const drawSpecialBrush = (ctx, brushType, x, y, prevX, prevY, settings = {}, color = '#000000', width = 5) => {
  // 合并默认设置和自定义设置
  const brushSettings = { ...defaultBrushSettings, ...settings };
  
  // 根据笔触类型执行特殊绘制
  switch (brushType) {
    // 基础笔触类型
    case 'spray':
      // 喷溅效果 - 在半径范围内随机绘制点
      const sprayRadius = width * brushSettings.sprayRadius;
      const sprayPoints = Math.floor(40 * brushSettings.sprayDensity);
      
      ctx.save();
      ctx.fillStyle = color;
      
      for (let i = 0; i < sprayPoints; i++) {
        // 随机角度和距离
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * sprayRadius;
        
        // 计算点的位置
        const dotX = x + Math.cos(angle) * distance;
        const dotY = y + Math.sin(angle) * distance;
        
        // 点的大小和透明度根据距离中心的远近而变化
        const dotSize = Math.max(0.5, (1 - distance / sprayRadius) * width * 0.25);
        ctx.globalAlpha = Math.max(0.1, 1 - distance / sprayRadius);
        
        // 绘制点
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
      return true;
      
    case 'calligraphy':
      // 书法效果 - 根据方向绘制椭圆形笔触
      if (prevX !== null && prevY !== null) {
        const angle = brushSettings.calligraphyAngle * (Math.PI / 180);
        const widthFactor = brushSettings.calligraphyWidth;
        
        // 以当前点为中心旋转坐标系
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // 绘制椭圆形笔触
        ctx.beginPath();
        ctx.ellipse(0, 0, width * widthFactor, width, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 如果有前一点，连接两点
        if (Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2)) < width * 3) {
          // 计算方向
          const moveAngle = Math.atan2(y - prevY, x - prevX);
          
          // 计算两个椭圆控制点
          const controlLen = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2)) * 0.5;
          const controlAngle = moveAngle + Math.PI / 2;
          
          // 控制点偏移
          const offsetX = Math.cos(controlAngle) * width * widthFactor * 0.3;
          const offsetY = Math.sin(controlAngle) * width * widthFactor * 0.3;
          
          // 绘制连接曲线
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(prevX + offsetX, prevY + offsetY);
          ctx.quadraticCurveTo(
            (prevX + x) / 2, 
            (prevY + y) / 2,
            x + offsetX, y + offsetY
          );
          ctx.lineTo(x - offsetX, y - offsetY);
          ctx.quadraticCurveTo(
            (prevX + x) / 2, 
            (prevY + y) / 2,
            prevX - offsetX, prevY - offsetY
          );
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
      return true;
      
    case 'pencil':
      // 铅笔效果 - 添加轻微抖动
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        
        // 铅笔噪点程度
        const jitter = width * 0.2 * brushSettings.pencilNoise;
        
        // 分段绘制线条，每段添加轻微抖动
        const segments = Math.max(5, Math.ceil(distance / 3));
        
        ctx.save();
        ctx.lineWidth = width * 0.8;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          
          // 在直线路径上的点
          const pathX = prevX + (x - prevX) * t;
          const pathY = prevY + (y - prevY) * t;
          
          // 添加随机抖动
          const offsetX = (Math.random() - 0.5) * jitter;
          const offsetY = (Math.random() - 0.5) * jitter;
          
          ctx.lineTo(pathX + offsetX, pathY + offsetY);
        }
        
        ctx.stroke();
        ctx.restore();
      }
      return true;
      
    case 'pixel':
      // 像素效果 - 绘制方形像素点
      const pixelSize = Math.max(1, Math.floor(brushSettings.pixelSize * width / 2));
      
      // 将坐标对齐到像素网格
      const pixelX = Math.floor(x / pixelSize) * pixelSize;
      const pixelY = Math.floor(y / pixelSize) * pixelSize;
      
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
      ctx.restore();
      return true;
      
    case 'rainbow':
      // 彩虹效果 - 基于时间和位置生成颜色
      if (prevX !== null && prevY !== null) {
        const time = Date.now() * 0.001 * brushSettings.rainbowSpeed;
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 计算色调
        const hue = (time + x * 0.01 + y * 0.01) % 360;
        const saturation = Math.min(100, 70 + brushSettings.rainbowSaturation * 30);
        const lightness = 50;
        
        // 设置彩虹颜色
        ctx.save();
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        ctx.restore();
      }
      return true;
      
    case 'noise':
      // 噪点效果 - 线条上随机添加噪点
      if (prevX !== null && prevY !== null) {
        // 计算线段长度
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 基于密度计算噪点数量
        const points = Math.max(5, Math.floor(distance * brushSettings.noiseDensity * 1.5));
        const noiseSize = width * brushSettings.noiseSize * 0.3;
        
        ctx.save();
        ctx.fillStyle = color;
        
        // 添加噪点
        for (let i = 0; i < points; i++) {
          // 随机选取线段上的位置
          const t = Math.random();
          const pointX = prevX + (x - prevX) * t;
          const pointY = prevY + (y - prevY) * t;
          
          // 在主线周围随机偏移
          const offsetX = (Math.random() - 0.5) * width;
          const offsetY = (Math.random() - 0.5) * width;
          
          // 绘制噪点
          const dotSize = Math.random() * noiseSize + noiseSize * 0.5;
          ctx.globalAlpha = Math.random() * 0.7 + 0.3;
          
          ctx.beginPath();
          ctx.arc(pointX + offsetX, pointY + offsetY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'sand':
      // 沙子效果 - 密集的细小点
      if (prevX !== null && prevY !== null) {
        // 计算线段长度
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 基于密度计算沙粒数量
        const grains = Math.max(10, Math.floor(distance * brushSettings.sandDensity * 2));
        const grainSize = width * brushSettings.sandSize * 0.15;
        
        ctx.save();
        ctx.fillStyle = color;
        
        // 绘制沙粒
        for (let i = 0; i < grains; i++) {
          // 随机选取线段上的位置
          const t = Math.random();
          const pointX = prevX + (x - prevX) * t;
          const pointY = prevY + (y - prevY) * t;
          
          // 在主线周围随机偏移，但保持在笔触宽度范围内
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * width;
          
          const grainX = pointX + Math.cos(angle) * radius;
          const grainY = pointY + Math.sin(angle) * radius;
          
          // 绘制沙粒
          const size = Math.random() * grainSize + grainSize * 0.5;
          ctx.globalAlpha = Math.random() * 0.6 + 0.4;
          
          ctx.beginPath();
          ctx.arc(grainX, grainY, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'star':
      // 星光效果 - 在光标位置绘制星形
      const starSize = width * brushSettings.starSize;
      const starPointCount = Math.floor(brushSettings.starPoints) || 5;
      const glow = brushSettings.starGlow;
      
      ctx.save();
      
      // 添加发光效果
      if (glow > 0.2) {
        ctx.shadowColor = color;
        ctx.shadowBlur = starSize * glow;
      }
      
      // 绘制星形
      ctx.fillStyle = color;
      ctx.beginPath();
      
      // 计算星形的内外半径
      const outerRadius = starSize;
      const innerRadius = starSize * 0.4;
      
      for (let i = 0; i < starPointCount * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * 2 * i) / (starPointCount * 2);
        
        const starX = x + Math.cos(angle) * radius;
        const starY = y + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(starX, starY);
        } else {
          ctx.lineTo(starX, starY);
        }
      }
      
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
      return true;
      
    case 'magic':
      // 魔法效果 - 线条上带有粒子效果
      if (prevX !== null && prevY !== null) {
        // 计算线段长度
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 粒子数量
        const particles = Math.max(5, Math.floor(distance * brushSettings.magicDensity * 1.5));
        const colorVariation = brushSettings.magicColors;
        
        ctx.save();
        
        // 绘制基础线条
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 添加魔法粒子
        for (let i = 0; i < particles; i++) {
          // 随机选取线段上的位置
          const t = Math.random();
          const pointX = prevX + (x - prevX) * t;
          const pointY = prevY + (y - prevY) * t;
          
          // 粒子大小和透明度
          const size = Math.random() * width * 0.8 + width * 0.2;
          ctx.globalAlpha = Math.random() * 0.7 + 0.3;
          
          // 如果颜色变化，为每个粒子选择不同颜色
          if (colorVariation > 0.3) {
            const hue = (Math.random() * 360);
            const saturation = 80 + Math.random() * 20;
            const lightness = 50 + Math.random() * 30;
            
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          } else {
            ctx.fillStyle = color;
          }
          
          // 绘制魔法粒子
          ctx.beginPath();
          ctx.arc(pointX, pointY, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'meteor':
      // 流星效果 - 带有尾巴的线条
      if (prevX !== null && prevY !== null) {
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 尾巴长度
        const tailLength = width * 5 * brushSettings.meteorTail;
        const tailSegments = Math.max(5, Math.floor(tailLength / 5));
        
        // 流星速度影响残影数量
        const speed = brushSettings.meteorSpeed;
        const trailCount = Math.floor(5 * speed) + 5;
        
        ctx.save();
        
        // 添加发光效果
        ctx.shadowColor = color;
        ctx.shadowBlur = width * 2;
        
        // 主流星头部
        ctx.fillStyle = '#ffffff'; // 头部为白色
        ctx.beginPath();
        ctx.arc(x, y, width * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // 计算尾巴的反方向
        const tailAngle = angle + Math.PI;
        
        // 绘制发光尾巴
        for (let i = 0; i < trailCount; i++) {
          // 尾巴透明度逐渐减弱
          ctx.globalAlpha = (1 - i / trailCount) * 0.8;
          
          // 尾巴颜色从白色到指定颜色渐变
          const blend = i / trailCount;
          
          // 计算颜色 - 从白色渐变到指定颜色
          if (blend < 0.3) {
            ctx.fillStyle = '#ffffff';
          } else {
            // 简单的颜色混合
            ctx.fillStyle = color;
          }
          
          // 计算当前段的长度
          const currentLength = tailLength * (i / trailCount);
          
          // 尾巴位置
          const tailX = x + Math.cos(tailAngle) * currentLength;
          const tailY = y + Math.sin(tailAngle) * currentLength;
          
          // 尾巴宽度逐渐变细
          const tailWidth = width * (1 - i / trailCount) * 0.6;
          
          // 绘制尾巴段
          ctx.beginPath();
          ctx.arc(tailX, tailY, tailWidth, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    // 水墨类笔刷
    case 'ink':
      // 水墨晕染效果 - 模拟水墨在宣纸上的晕开效果
      if (prevX !== null && prevY !== null) {
        // 主线条
        ctx.save();
        
        ctx.globalAlpha = brushSettings.inkOpacity;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 计算线段方向和长度
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 模拟水墨晕染效果
        const diffusion = brushSettings.inkDiffusion * width;
        const droplets = Math.floor(distance / 5) + 5;
        
        // 垂直于线段方向的角度
        const perpAngle = angle + Math.PI / 2;
        
        for (let i = 0; i < droplets; i++) {
          // 在线段上随机选取点
          const t = Math.random();
          const pointX = prevX + (x - prevX) * t;
          const pointY = prevY + (y - prevY) * t;
          
          // 在垂直方向上随机偏移
          const offsetMagnitude = Math.random() * diffusion * 1.5;
          const offsetX = Math.cos(perpAngle) * offsetMagnitude;
          const offsetY = Math.sin(perpAngle) * offsetMagnitude;
          
          // 晕染效果大小随机变化
          const inkSize = Math.random() * diffusion + width * 0.2;
          
          // 透明度随距离减弱
          const alpha = Math.max(0.05, 0.2 - offsetMagnitude / (diffusion * 3));
          ctx.globalAlpha = alpha * brushSettings.inkOpacity;
          
          // 绘制晕染效果
          ctx.beginPath();
          ctx.arc(pointX + offsetX, pointY + offsetY, inkSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'brush':
      // 毛笔效果 - 模拟毛笔的干湿变化和压感
      if (prevX !== null && prevY !== null) {
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 垂直方向
        const perpAngle = angle + Math.PI / 2;
        
        // 毛笔特性参数
        const pressure = brushSettings.brushPressure || 0.6; // 防止undefined
        const wetness = brushSettings.brushWetness || 0.7;  // 防止undefined
        const brushWidth = width * (1 + pressure * 0.5);
        
        ctx.save();
        ctx.fillStyle = color;
        
        // 主笔触 - 增强中心笔触的不透明度
        ctx.globalAlpha = Math.min(1, wetness + 0.4);
        
        // 添加主要笔触
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.lineWidth = brushWidth * 0.8;
        ctx.stroke();
        
        // 创建毛笔形状 - 增加毛的根数，产生更细腻的效果
        const bristles = 12 + Math.floor(brushWidth / 2.5);
        
        for (let i = 0; i < bristles; i++) {
          // 每根毛的位置
          const t = (i / (bristles - 1)) * 2 - 1; // -1 到 1
          const bristleOffset = t * brushWidth * 0.5;
          
          // 毛的起始和结束位置
          const bristleStartX = prevX + Math.cos(perpAngle) * bristleOffset;
          const bristleStartY = prevY + Math.sin(perpAngle) * bristleOffset;
          
          // 根据压力调整毛的弯曲度，外侧毛更弯曲
          const bend = t * pressure * 0.3 * Math.abs(t);
          const bendX = Math.cos(angle + bend) * distance;
          const bendY = Math.sin(angle + bend) * distance;
          
          const bristleEndX = bristleStartX + bendX;
          const bristleEndY = bristleStartY + bendY;
          
          // 毛的粗细根据位置变化 - 外侧更细
          const bristleWidth = Math.max(1, (1 - Math.abs(t) * 0.9) * width * 0.25);
          
          // 毛的透明度也随位置变化 - 外侧更透明
          ctx.globalAlpha = wetness * (1 - Math.abs(t) * 0.7) * 0.8;
          
          // 绘制单个毛
          ctx.beginPath();
          ctx.moveTo(bristleStartX, bristleStartY);
          
          // 添加中间控制点，使毛的形状更自然
          const controlX = (bristleStartX + bristleEndX) / 2 + Math.cos(perpAngle) * bend * distance * 0.1;
          const controlY = (bristleStartY + bristleEndY) / 2 + Math.sin(perpAngle) * bend * distance * 0.1;
          
          ctx.quadraticCurveTo(controlX, controlY, bristleEndX, bristleEndY);
          ctx.lineWidth = bristleWidth;
          ctx.stroke();
          
          // 在毛笔末端添加墨滴效果 - 增加墨滴数量和大小变化
          if (Math.random() < wetness * 0.5) {
            const droplets = 1 + Math.floor(Math.random() * 3 * wetness);
            
            for (let j = 0; j < droplets; j++) {
              // 墨滴偏移 - 距离末端一定距离
              const offset = Math.random() * 0.4;
              const dropX = bristleStartX + (bristleEndX - bristleStartX) * (1 + offset);
              const dropY = bristleStartY + (bristleEndY - bristleStartY) * (1 + offset);
              
              // 墨滴大小
              const dropSize = bristleWidth * (Math.random() * 0.8 + 0.4);
              const dropAlpha = ctx.globalAlpha * (1 - offset * 0.5); // 随距离减弱
              
              ctx.beginPath();
              ctx.globalAlpha = dropAlpha;
              ctx.arc(dropX, dropY, dropSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        // 添加毛笔中心浓墨效果
        ctx.globalAlpha = Math.min(1, wetness + 0.5);
        ctx.lineWidth = brushWidth * 0.4;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        ctx.restore();
      }
      return true;
      
    case 'watercolor':
      // 水彩效果 - 模拟水彩的扩散和叠加效果
      if (prevX !== null && prevY !== null) {
        // 计算距离和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        
        // 扩散程度
        const bleed = brushSettings.watercolorBleed * width;
        const granulation = brushSettings.watercolorGranulation;
        
        ctx.save();
        
        // 设置混合模式，使颜色能够叠加
        ctx.globalCompositeOperation = 'multiply';
        
        // 主笔触
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.lineWidth = width;
        ctx.stroke();
        
        // 水彩扩散效果
        const layers = 3; // 扩散层数
        const spots = Math.ceil(distance / 3) + 5;
        
        for (let layer = 0; layer < layers; layer++) {
          // 每层的透明度和大小不同
          const layerAlpha = 0.2 - layer * 0.05;
          const layerSize = width * (1 + layer * 0.7);
          
          ctx.globalAlpha = layerAlpha;
          
          // 在线条附近随机绘制扩散点
          for (let i = 0; i < spots; i++) {
            const t = Math.random(); // 线段上的位置
            const pointX = prevX + (x - prevX) * t;
            const pointY = prevY + (y - prevY) * t;
            
            // 随机偏移，模拟扩散
            const offsetAngle = Math.random() * Math.PI * 2;
            const offsetDistance = Math.random() * bleed * (1 - t * 0.5); // 起始点扩散更多
            
            const spotX = pointX + Math.cos(offsetAngle) * offsetDistance;
            const spotY = pointY + Math.sin(offsetAngle) * offsetDistance;
            
            // 随机大小
            const spotSize = Math.random() * layerSize * 0.8 + layerSize * 0.2;
            
            // 绘制水彩斑点
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 水彩颗粒感 - 随机添加细小的点
            if (Math.random() < granulation) {
              ctx.globalAlpha = layerAlpha * 1.5;
              
              const grainCount = Math.floor(spotSize / 2) + 1;
              
              for (let j = 0; j < grainCount; j++) {
                const grainAngle = Math.random() * Math.PI * 2;
                const grainDist = Math.random() * spotSize * 0.8;
                
                const grainX = spotX + Math.cos(grainAngle) * grainDist;
                const grainY = spotY + Math.sin(grainAngle) * grainDist;
                
                ctx.beginPath();
                ctx.arc(grainX, grainY, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
        
        ctx.restore();
      }
      return true;
      
    // 写实工具笔刷
    case 'realPencil':
      // 真实铅笔效果 - 更精细的纹理和压感模拟
      if (prevX !== null && prevY !== null) {
        // 基础线条
        ctx.save();
        
        // 硬度和纹理参数 - 添加默认值防止undefined
        const hardness = brushSettings.realPencilHardness !== undefined ? brushSettings.realPencilHardness : 0.4;
        const texture = brushSettings.realPencilTexture !== undefined ? brushSettings.realPencilTexture : 0.7;
        
        // 调整线条基础透明度和宽度（受硬度影响）
        const baseAlpha = 0.7 - hardness * 0.3; // 软铅笔更不透明
        const lineWidth = width * (1 - hardness * 0.3); // 软铅笔线条更宽
        
        // 计算线条方向和长度
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 垂直于线条的方向
        const perpAngle = angle + Math.PI / 2;
        
        // 铅笔主要效果 - 使用多层次的线条
        
        // 1. 底层 - 轻微的基础色
        ctx.globalAlpha = baseAlpha * 0.5;
        ctx.lineWidth = lineWidth * 1.2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 2. 多条细线，模拟铅笔的石墨分布
        const lineCount = Math.max(8, Math.floor(lineWidth * 3));
        
        for (let i = 0; i < lineCount; i++) {
          // 线的横向分布
          const offsetFactor = (i / (lineCount - 1)) * 2 - 1; // -1 到 1
          const offsetDist = offsetFactor * lineWidth * 0.5;
          
          // 线的纵向偏移
          const startOffset = Math.random() * lineWidth * 0.1;
          const endOffset = Math.random() * lineWidth * 0.1;
          
          // 计算偏移坐标
          const offsetX = Math.cos(perpAngle) * offsetDist;
          const offsetY = Math.sin(perpAngle) * offsetDist;
          
          const startX = prevX + offsetX - Math.cos(angle) * startOffset;
          const startY = prevY + offsetY - Math.sin(angle) * startOffset;
          const endX = x + offsetX + Math.cos(angle) * endOffset;
          const endY = y + offsetY + Math.sin(angle) * endOffset;
          
          // 线的不透明度和宽度 - 中心部分较浓
          const lineAlpha = baseAlpha * (0.2 + (1 - Math.abs(offsetFactor)) * 0.8);
          const singleLineWidth = Math.max(0.5, lineWidth * 0.15 * (1 - Math.abs(offsetFactor) * 0.5));
          
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = singleLineWidth;
          
          // 绘制单线 - 增加颗粒感
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          
          // 绘制石墨颗粒
          const segments = Math.max(10, Math.ceil(distance / 2));
          
          for (let j = 1; j <= segments; j++) {
            const t = j / segments;
            const segX = startX + (endX - startX) * t;
            const segY = startY + (endY - startY) * t;
            
            // 颗粒偏移
            const grainOffset = (Math.random() - 0.5) * texture * 0.6;
            const grainX = segX + Math.cos(perpAngle) * grainOffset;
            const grainY = segY + Math.sin(perpAngle) * grainOffset;
            
            // 随机调整密度 - 模拟石墨分布不均
            if (Math.random() < 0.95 - hardness * 0.3) { // 硬铅笔线条更不连续
              ctx.lineTo(grainX, grainY);
            } else {
              ctx.moveTo(grainX, grainY);
            }
          }
          
          ctx.stroke();
        }
        
        // 3. 压力点 - 模拟铅笔尖锐处的浓色
        const pressurePoints = 3 + Math.floor((1 - hardness) * 5);
        
        for (let i = 0; i < pressurePoints; i++) {
          const t = i / (pressurePoints - 1);
          const pressX = prevX + (x - prevX) * t;
          const pressY = prevY + (y - prevY) * t;
          
          // 随机调整压力点位置
          const pressOffset = lineWidth * 0.3 * (Math.random() - 0.5);
          const finalX = pressX + Math.cos(perpAngle) * pressOffset;
          const finalY = pressY + Math.sin(perpAngle) * pressOffset;
          
          // 压力点阴影 - 较深色
          ctx.globalAlpha = baseAlpha * 1.5 * Math.random();
          ctx.beginPath();
          ctx.arc(finalX, finalY, lineWidth * 0.3 * Math.random(), 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'pen':
      // 钢笔效果 - 模拟钢笔的弹性和墨水流动
      if (prevX !== null && prevY !== null) {
        // 钢笔参数
        const flexibility = brushSettings.penFlexibility;
        const inkFlow = brushSettings.penInkFlow;
        
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        ctx.save();
        
        // 主笔触
        ctx.lineWidth = width;
        ctx.globalAlpha = 0.8 + inkFlow * 0.2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 钢笔压力变化效果
        if (distance > 5) {
          // 压力点数量取决于距离和灵活性
          const pressurePoints = Math.ceil(distance / 10) * (1 + flexibility);
          
          // 垂直于线条的方向
          const perpAngle = angle + Math.PI / 2;
          
          // 模拟钢笔尖的弹性
          for (let i = 1; i < pressurePoints; i++) {
            const t = i / pressurePoints;
            const pressureX = prevX + (x - prevX) * t;
            const pressureY = prevY + (y - prevY) * t;
            
            // 压力宽度变化 - 模拟钢笔尖的扩张
            const pressure = Math.sin(t * Math.PI) * flexibility * width * 0.7;
            
            // 墨水密度 - 受到墨水流量影响
            ctx.globalAlpha = 0.2 + Math.sin(t * Math.PI) * 0.3 * inkFlow;
            
            // 在垂直方向绘制压力线
            ctx.beginPath();
            ctx.moveTo(
              pressureX - Math.cos(perpAngle) * pressure,
              pressureY - Math.sin(perpAngle) * pressure
            );
            ctx.lineTo(
              pressureX + Math.cos(perpAngle) * pressure,
              pressureY + Math.sin(perpAngle) * pressure
            );
            ctx.lineWidth = Math.max(0.5, width * 0.2);
            ctx.stroke();
          }
          
          // 墨水流动效果 - 额外的细小墨迹
          if (inkFlow > 0.5 && Math.random() < inkFlow * 0.3) {
            const inkSpots = Math.ceil(inkFlow * 5);
            
            for (let i = 0; i < inkSpots; i++) {
              const t = Math.random();
              const spotX = prevX + (x - prevX) * t;
              const spotY = prevY + (y - prevY) * t;
              
              // 墨滴偏移方向
              const spotAngle = angle + (Math.random() - 0.5) * Math.PI;
              const spotDist = Math.random() * width * inkFlow;
              
              // 墨滴位置
              const finalX = spotX + Math.cos(spotAngle) * spotDist;
              const finalY = spotY + Math.sin(spotAngle) * spotDist;
              
              // 墨滴大小和透明度
              const spotSize = Math.random() * width * 0.3 * inkFlow;
              ctx.globalAlpha = Math.random() * 0.5 * inkFlow;
              
              // 绘制墨滴
              ctx.beginPath();
              ctx.arc(finalX, finalY, spotSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        ctx.restore();
      }
      return true;
      
    case 'chalk':
      // 粉笔效果 - 粗糙的纹理和边缘
      if (prevX !== null && prevY !== null) {
        // 粉笔参数 - 添加默认值防止undefined
        const density = brushSettings.chalkDensity !== undefined ? brushSettings.chalkDensity : 0.8;
        const chalkTexture = brushSettings.chalkTexture !== undefined ? brushSettings.chalkTexture : 0.7;
        
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        ctx.save();
        
        // 垂直于线条的方向
        const perpAngle = angle + Math.PI / 2;
        
        // 粉笔宽度
        const chalkWidth = width * 1.2;
        
        // 主线条 - 使用不透明的底色
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = chalkWidth * 0.9;
        ctx.lineCap = 'butt'; // 更接近粉笔的方形末端
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 用颗粒点组成粉笔的纹理
        const numPoints = Math.max(40, Math.floor(distance * 4 * density));
        
        // 创建更丰富的颗粒纹理
        for (let i = 0; i < numPoints; i++) {
          // 在线段上随机选取点
          const t = Math.random();
          const pointX = prevX + (x - prevX) * t;
          const pointY = prevY + (y - prevY) * t;
          
          // 在垂直方向上随机偏移，形成粉笔厚度
          const offsetMagnitude = (Math.random() - 0.5) * chalkWidth * 0.95;
          const offsetX = Math.cos(perpAngle) * offsetMagnitude;
          const offsetY = Math.sin(perpAngle) * offsetMagnitude;
          
          // 粉笔颗粒大小 - 较小的颗粒
          const grainSize = Math.random() * width * 0.12 + width * 0.08;
          
          // 透明度变化，制造不均匀效果 - 更自然的透明度
          const alpha = 0.4 + Math.random() * 0.4 * (1 - Math.abs(offsetMagnitude) / chalkWidth);
          ctx.globalAlpha = alpha;
          
          // 绘制粉笔颗粒
          // 随机选择形状 - 用小方块增强粉笔感
          if (Math.random() > 0.7) {
            // 小方块
            const rectSize = grainSize * (0.8 + Math.random() * 0.4);
            ctx.fillRect(
              pointX + offsetX - rectSize/2,
              pointY + offsetY - rectSize/2,
              rectSize, rectSize
            );
          } else {
            // 圆形颗粒
            ctx.beginPath();
            ctx.arc(pointX + offsetX, pointY + offsetY, grainSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // 模拟粉笔边缘粗糙的纹理
        if (chalkTexture > 0.3) {
          // 增加飘散的粉笔灰
          const dustPoints = Math.ceil(distance * chalkTexture * 3.5);
          
          for (let i = 0; i < dustPoints; i++) {
            const t = Math.random();
            const dustX = prevX + (x - prevX) * t;
            const dustY = prevY + (y - prevY) * t;
            
            // 灰尘粒子可以飘得更远
            const dustDist = chalkWidth * (0.6 + Math.random() * 0.8);
            const dustAngle = perpAngle + (Math.random() - 0.5) * 1.2; // 更广的角度分布
            
            const finalX = dustX + Math.cos(dustAngle) * dustDist;
            const finalY = dustY + Math.sin(dustAngle) * dustDist;
            
            // 灰尘更小更淡
            const dustSize = Math.random() * width * 0.1;
            ctx.globalAlpha = Math.random() * 0.15; // 非常淡
            
            // 绘制灰尘粒子
            ctx.beginPath();
            if (Math.random() > 0.5) {
              // 圆形灰尘
              ctx.arc(finalX, finalY, dustSize, 0, Math.PI * 2);
            } else {
              // 矩形灰尘
              ctx.fillRect(
                finalX - dustSize/2,
                finalY - dustSize/2,
                dustSize, dustSize
              );
            }
            ctx.fill();
          }
        }
        
        ctx.restore();
      }
      return true;
      
    // 特效笔刷将在下一部分实现
    case 'scratch':
      // 刮痕效果 - 模拟划痕或损坏表面
      if (prevX !== null && prevY !== null) {
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        // 垂直于线条的方向
        const perpAngle = angle + Math.PI / 2;
        
        // 刮痕参数
        const roughness = brushSettings.scratchRoughness;
        const depth = brushSettings.scratchDepth;
        
        ctx.save();
        
        // 主刮痕线
        ctx.lineWidth = width * 0.6;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        
        // 使用多段线模拟不平整的刮痕
        const segments = Math.max(5, Math.ceil(distance / 3));
        
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          
          // 基本位置
          const segX = prevX + (x - prevX) * t;
          const segY = prevY + (y - prevY) * t;
          
          // 随机偏移，模拟粗糙度
          const offsetMagnitude = roughness * width * 0.2 * (Math.random() - 0.5);
          const offsetX = Math.cos(perpAngle) * offsetMagnitude;
          const offsetY = Math.sin(perpAngle) * offsetMagnitude;
          
          ctx.lineTo(segX + offsetX, segY + offsetY);
        }
        
        ctx.stroke();
        
        // 刮痕边缘的碎片效果
        const scratchEdges = Math.ceil(distance * 0.3);
        
        for (let i = 0; i < scratchEdges; i++) {
          const t = Math.random();
          const edgeX = prevX + (x - prevX) * t;
          const edgeY = prevY + (y - prevY) * t;
          
          // 刮痕深度影响边缘碎片大小
          const edgeSize = Math.random() * width * 0.4 * depth;
          
          // 随机方向，但偏向垂直于刮痕
          const edgeAngle = perpAngle + (Math.random() - 0.5) * 0.8;
          const edgeDist = width * (0.5 + Math.random() * 0.5) * depth;
          
          // 碎片位置
          const fragX = edgeX + Math.cos(edgeAngle) * edgeDist;
          const fragY = edgeY + Math.sin(edgeAngle) * edgeDist;
          
          // 绘制碎片
          ctx.globalAlpha = Math.random() * 0.7 + 0.3;
          ctx.beginPath();
          
          // 随机形状 - 三角形或者小线段
          if (Math.random() > 0.5) {
            // 三角形碎片
            const triAngle1 = Math.random() * Math.PI * 2;
            const triAngle2 = triAngle1 + Math.PI * (0.7 + Math.random() * 0.6);
            const triAngle3 = triAngle1 + Math.PI * (1.4 + Math.random() * 0.6);
            
            ctx.moveTo(fragX, fragY);
            ctx.lineTo(
              fragX + Math.cos(triAngle1) * edgeSize,
              fragY + Math.sin(triAngle1) * edgeSize
            );
            ctx.lineTo(
              fragX + Math.cos(triAngle2) * edgeSize,
              fragY + Math.sin(triAngle2) * edgeSize
            );
            ctx.lineTo(
              fragX + Math.cos(triAngle3) * edgeSize * 0.7,
              fragY + Math.sin(triAngle3) * edgeSize * 0.7
            );
            ctx.closePath();
            ctx.fill();
          } else {
            // 线段碎片
            const lineAngle = Math.random() * Math.PI * 2;
            ctx.lineWidth = Math.random() * width * 0.3 + width * 0.1;
            
            ctx.beginPath();
            ctx.moveTo(fragX, fragY);
            ctx.lineTo(
              fragX + Math.cos(lineAngle) * edgeSize,
              fragY + Math.sin(lineAngle) * edgeSize
            );
            ctx.stroke();
          }
        }
        
        ctx.restore();
      }
      return true;
      
    case 'graffiti':
      // 涂鸦笔刷 - 模拟喷漆艺术效果
      if (prevX !== null && prevY !== null) {
        // 涂鸦参数
        const saturation = brushSettings.graffitiSaturation;
        const spread = brushSettings.graffitiSpread;
        
        // 计算基本距离和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        
        ctx.save();
        
        // 提取颜色的HSL值
        let hsl = { h: 0, s: 0, l: 0 };
        
        // 简单的RGB转HSL转换
        // 为了简化，这里使用临时canvas来获取HSL
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = color;
        
        // 根据填充的颜色估计HSL值
        // 这是一个简化的估计方法
        if (color.startsWith('#')) {
          // 十六进制颜色
          const r = parseInt(color.slice(1, 3), 16) / 255;
          const g = parseInt(color.slice(3, 5), 16) / 255;
          const b = parseInt(color.slice(5, 7), 16) / 255;
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          
          hsl.l = (max + min) / 2;
          
          if (max !== min) {
            hsl.s = hsl.l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
            
            if (max === r) hsl.h = (g - b) / (max - min) + (g < b ? 6 : 0);
            else if (max === g) hsl.h = (b - r) / (max - min) + 2;
            else hsl.h = (r - g) / (max - min) + 4;
            
            hsl.h *= 60;
          } else {
            hsl.s = 0;
            hsl.h = 0;
          }
        }
        
        // 主喷漆效果
        const sprayRadius = width * spread;
        const density = Math.max(20, Math.ceil(distance * 4));
        
        for (let i = 0; i < density; i++) {
          // 沿线分布喷漆点
          const t = Math.random();
          const sprayX = prevX + (x - prevX) * t;
          const sprayY = prevY + (y - prevY) * t;
          
          // 随机扩散
          const sprayAngle = Math.random() * Math.PI * 2;
          const sprayDist = Math.random() * sprayRadius;
          
          // 喷漆点位置
          const dotX = sprayX + Math.cos(sprayAngle) * sprayDist;
          const dotY = sprayY + Math.sin(sprayAngle) * sprayDist;
          
          // 点大小随距离变化
          const dotSize = Math.max(0.5, (1 - sprayDist / sprayRadius) * width * 0.3);
          
          // 透明度随距离衰减
          ctx.globalAlpha = Math.max(0.1, 0.7 - sprayDist / sprayRadius);
          
          // 每个点颜色略有变化，模拟喷漆不均匀的效果
          if (saturation > 0.3 && typeof hsl.h !== 'undefined') {
            // 随机调整色相和饱和度
            const hueShift = (Math.random() - 0.5) * 30 * saturation;
            const satShift = Math.random() * 0.3 * saturation;
            
            ctx.fillStyle = `hsl(${(hsl.h + hueShift) % 360}, ${Math.min(100, (hsl.s + satShift) * 100)}%, ${hsl.l * 100}%)`;
          } else {
            ctx.fillStyle = color;
          }
          
          // 绘制喷漆点
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // 添加滴落效果
        if (Math.random() < 0.3) {
          const drips = Math.ceil(Math.random() * 3);
          
          for (let i = 0; i < drips; i++) {
            // 选择滴落起始点
            const startT = Math.random();
            const startX = prevX + (x - prevX) * startT;
            const startY = prevY + (y - prevY) * startT;
            
            // 滴落方向 - 通常是向下
            const dripAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
            
            // 滴落长度
            const dripLength = width * (1 + Math.random() * 5) * spread;
            
            // 滴落路径
            const segments = Math.ceil(dripLength / 5);
            let lastX = startX;
            let lastY = startY;
            
            ctx.lineWidth = Math.max(1, width * 0.3);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            for (let j = 1; j <= segments; j++) {
              const segmentLen = dripLength / segments;
              // 滴落有轻微的随机偏移
              const offsetX = (Math.random() - 0.5) * width * 0.2;
              lastX += Math.cos(dripAngle) * segmentLen + offsetX;
              lastY += Math.sin(dripAngle) * segmentLen;
              
              // 滴落变细
              ctx.lineWidth *= 0.95;
              ctx.lineTo(lastX, lastY);
            }
            
            ctx.stroke();
            
            // 滴落末端有时会形成小滴
            if (Math.random() < 0.7) {
              ctx.beginPath();
              ctx.arc(lastX, lastY, width * 0.2 * Math.random() + width * 0.1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        ctx.restore();
      }
      return true;
      
    case 'splatter':
      // 泼溅效果 - 模拟油漆泼溅
      if (prevX !== null && prevY !== null) {
        // 泼溅参数
        const intensity = brushSettings.splatterIntensity;
        const spreadFactor = brushSettings.splatterSpread;
        
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        ctx.save();
        ctx.fillStyle = color;
        
        // 主飞溅区域
        const mainRadius = width * spreadFactor * 2;
        
        // 中心点有一个较大的飞溅
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, width * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加不规则形状模拟飞溅
        const splats = Math.floor(10 * intensity);
        
        for (let i = 0; i < splats; i++) {
          // 飞溅方向与主运动方向相关
          const splatAngle = angle + (Math.random() - 0.5) * Math.PI * 1.5;
          const splatDist = Math.random() * mainRadius;
          
          // 飞溅位置
          const splatX = x + Math.cos(splatAngle) * splatDist;
          const splatY = y + Math.sin(splatAngle) * splatDist;
          
          // 飞溅大小与距离成反比
          const splatSize = width * (0.3 + Math.random() * 0.7) * (1 - splatDist / mainRadius * 0.5);
          
          // 透明度随距离减弱
          ctx.globalAlpha = Math.max(0.2, 0.8 - splatDist / mainRadius);
          
          // 绘制不规则的飞溅形状
          ctx.beginPath();
          
          // 使用贝塞尔曲线创建不规则形状
          const points = Math.floor(Math.random() * 3) + 5; // 5-7个点
          
          for (let j = 0; j <= points; j++) {
            const pointAngle = (j / points) * Math.PI * 2;
            
            // 不规则的半径
            const pointRadius = splatSize * (0.7 + Math.random() * 0.6);
            
            const pointX = splatX + Math.cos(pointAngle) * pointRadius;
            const pointY = splatY + Math.sin(pointAngle) * pointRadius;
            
            if (j === 0) {
              ctx.moveTo(pointX, pointY);
            } else {
              // 控制点
              const prevPointAngle = ((j - 1) / points) * Math.PI * 2;
              const midAngle = (prevPointAngle + pointAngle) / 2;
              
              // 控制点距离
              const controlDist = pointRadius * 1.2;
              
              // 控制点坐标
              const controlX = splatX + Math.cos(midAngle) * controlDist;
              const controlY = splatY + Math.sin(midAngle) * controlDist;
              
              ctx.quadraticCurveTo(controlX, controlY, pointX, pointY);
            }
          }
          
          ctx.closePath();
          ctx.fill();
          
          // 有时添加小飞溅点
          if (Math.random() < 0.7) {
            const droplets = Math.floor(Math.random() * 5) + 3;
            
            for (let j = 0; j < droplets; j++) {
              // 从主飞溅处向外延伸
              const dropAngle = splatAngle + (Math.random() - 0.5) * 0.8;
              const dropDist = splatSize * (1 + Math.random());
              
              const dropX = splatX + Math.cos(dropAngle) * dropDist;
              const dropY = splatY + Math.sin(dropAngle) * dropDist;
              
              // 小飞溅点
              const dropSize = splatSize * 0.2 * Math.random();
              ctx.globalAlpha = Math.random() * 0.5;
              
              ctx.beginPath();
              ctx.arc(dropX, dropY, dropSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        ctx.restore();
      }
      return true;
      
    case 'electric':
      // 电流效果 - 模拟闪电或电流
      if (prevX !== null && prevY !== null) {
        // 电流参数
        const volatility = brushSettings.electricVolatility;
        const branches = brushSettings.electricBranches;
        const glowEffect = brushSettings.electricGlow;
        
        // 计算基本距离和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        
        ctx.save();
        
        // 设置发光效果
        if (glowEffect > 0.3) {
          ctx.shadowColor = color;
          ctx.shadowBlur = width * glowEffect * 2;
        }
        
        // 主电流路径
        drawLightningPath(ctx, prevX, prevY, x, y, volatility * width, color, width);
        
        // 添加分支
        const numBranches = Math.floor(distance / 30 * branches) + 1;
        
        for (let i = 0; i < numBranches; i++) {
          // 从主干随机点分支
          const t = 0.2 + Math.random() * 0.6; // 避免在起点和终点附近分支
          const branchX = prevX + (x - prevX) * t;
          const branchY = prevY + (y - prevY) * t;
          
          // 分支方向
          const branchAngle = angle + (Math.random() - 0.5) * Math.PI * 0.8;
          
          // 分支长度
          const branchLength = distance * (0.3 + Math.random() * 0.4) * branches;
          
          // 分支终点
          const branchEndX = branchX + Math.cos(branchAngle) * branchLength;
          const branchEndY = branchY + Math.sin(branchAngle) * branchLength;
          
          // 分支宽度较主干细
          const branchWidth = width * (0.3 + Math.random() * 0.4);
          
          // 绘制分支
          drawLightningPath(ctx, branchX, branchY, branchEndX, branchEndY, volatility * width * 0.8, color, branchWidth);
          
          // 递归添加二级分支
          if (branchLength > 20 && Math.random() < 0.5) {
            const subT = 0.3 + Math.random() * 0.5;
            const subX = branchX + (branchEndX - branchX) * subT;
            const subY = branchY + (branchEndY - branchY) * subT;
            
            const subAngle = branchAngle + (Math.random() - 0.5) * Math.PI * 0.6;
            const subLength = branchLength * 0.5;
            
            const subEndX = subX + Math.cos(subAngle) * subLength;
            const subEndY = subY + Math.sin(subAngle) * subLength;
            
            drawLightningPath(ctx, subX, subY, subEndX, subEndY, volatility * width * 0.5, color, branchWidth * 0.7);
          }
        }
        
        ctx.restore();
      }
      return true;
      
    // 新增笔触类型
    case 'dotted':
      // 点阵笔触 - 按照一定模式排列的点
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        ctx.save();
        ctx.fillStyle = color;
        
        // 点的大小和密度
        const dotSize = width * brushSettings.dottedSize * 0.5;
        const dotSpacing = width * (1.5 - brushSettings.dottedDensity);
        const pattern = brushSettings.dottedPattern; // 0-1，表示随机程度
        
        // 沿线段方向放置点
        const numDots = Math.max(2, Math.ceil(distance / dotSpacing));
        
        // 每个点的位置
        for (let i = 0; i < numDots; i++) {
          const t = i / (numDots - 1);
          let dotX = prevX + (x - prevX) * t;
          let dotY = prevY + (y - prevY) * t;
          
          // 根据模式添加随机性
          if (pattern > 0) {
            const randomOffset = pattern * width * 0.5;
            const offsetAngle = Math.random() * Math.PI * 2;
            dotX += Math.cos(offsetAngle) * (Math.random() * randomOffset);
            dotY += Math.sin(offsetAngle) * (Math.random() * randomOffset);
          }
          
          // 绘制点阵中的点
          ctx.globalAlpha = 0.8 + (Math.random() * 0.2);
          
          // 随机点大小变化
          const randomSize = dotSize * (0.8 + Math.random() * 0.4);
          
          ctx.beginPath();
          ctx.arc(dotX, dotY, randomSize, 0, Math.PI * 2);
          ctx.fill();
          
          // 如果密度足够高，添加额外的横向点
          if (brushSettings.dottedDensity > 0.5) {
            const sideCount = Math.floor((brushSettings.dottedDensity - 0.5) * 4) + 1;
            const sideSpacing = width * 0.8 / sideCount;
            
            for (let j = 1; j <= sideCount; j++) {
              // 横向点的位置
              const offsetX = Math.cos(perpAngle) * j * sideSpacing;
              const offsetY = Math.sin(perpAngle) * j * sideSpacing;
              
              // 右侧点
              ctx.globalAlpha = 0.8 - (j / sideCount * 0.3);
              const rightSize = randomSize * (1 - j / sideCount * 0.3);
              
              ctx.beginPath();
              ctx.arc(dotX + offsetX, dotY + offsetY, rightSize, 0, Math.PI * 2);
              ctx.fill();
              
              // 左侧点
              ctx.beginPath();
              ctx.arc(dotX - offsetX, dotY - offsetY, rightSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        ctx.restore();
      }
      return true;
      
    case 'wave':
      // 波浪笔触 - 创建波浪效果的线条
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        // 波浪参数
        const frequency = brushSettings.waveFrequency * 0.2; // 波浪频率
        const amplitude = brushSettings.waveAmplitude * width; // 波浪振幅
        const phase = brushSettings.wavePhase; // 波浪相位
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width * 0.5;
        
        // 绘制多条波浪线
        const waveCount = 3; // 波浪线数量
        
        for (let w = 0; w < waveCount; w++) {
          // 每条线有细微的偏差
          const wavePhase = phase + w * Math.PI / 4;
          const waveWidth = width * (1 - w * 0.2); // 线宽逐渐变细
          
          ctx.beginPath();
          
          // 使用更多的点使波浪更平滑
          const segments = Math.max(20, Math.ceil(distance / 3));
          
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            
            // 基本位置
            const baseX = prevX + (x - prevX) * t;
            const baseY = prevY + (y - prevY) * t;
            
            // 波浪偏移
            const waveT = t * Math.PI * 2 * (distance * frequency) + wavePhase;
            const waveOffset = Math.sin(waveT) * amplitude * (1 - 0.2 * w);
            
            // 最终位置
            const waveX = baseX + Math.cos(perpAngle) * waveOffset;
            const waveY = baseY + Math.sin(perpAngle) * waveOffset;
            
            if (i === 0) {
              ctx.moveTo(waveX, waveY);
            } else {
              ctx.lineTo(waveX, waveY);
            }
          }
          
          // 设置线条样式
          ctx.globalAlpha = 0.7 - w * 0.15;
          ctx.lineWidth = waveWidth;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'mosaic':
      // 马赛克笔触 - 创建马赛克效果的线条
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        // 马赛克参数
        const size = brushSettings.mosaicSize * width;
        const gap = brushSettings.mosaicGap * width;
        const randomness = brushSettings.mosaicRandomness;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        
        // 绘制多条马赛克线
        const lineCount = Math.max(2, Math.ceil(distance / gap));
        
        for (let l = 0; l < lineCount; l++) {
          // 每条线有细微的偏差
          const lineAngle = angle + (Math.random() - 0.5) * randomness * Math.PI;
          
          // 马赛克线的位置
          const lineX = prevX + Math.cos(lineAngle) * l * gap;
          const lineY = prevY + Math.sin(lineAngle) * l * gap;
          
          // 马赛克线的长度
          const lineLength = distance - l * gap;
          
          // 马赛克线的宽度
          const lineWidth = size * (1 - randomness * 0.2 * l);
          
          // 绘制马赛克线
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX + lineLength, lineY);
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'leaf':
      // 叶脉笔触 - 创建叶脉效果的线条
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        // 叶脉参数
        const branches = brushSettings.leafBranches;
        const curve = brushSettings.leafCurve;
        const symmetry = brushSettings.leafSymmetry;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width * 0.5;
        
        // 绘制多条叶脉线
        const lineCount = Math.max(2, Math.ceil(distance / 10));
        
        for (let l = 0; l < lineCount; l++) {
          // 每条线有细微的偏差
          const lineAngle = angle + (Math.random() - 0.5) * Math.PI * 0.2 * l;
          
          // 叶脉线的位置
          const lineX = prevX + Math.cos(lineAngle) * l * 10;
          const lineY = prevY + Math.sin(lineAngle) * l * 10;
          
          // 叶脉线的长度
          const lineLength = distance - l * 10;
          
          // 叶脉线的宽度
          const lineWidth = width * (1 - Math.abs(Math.sin(lineAngle)) * 0.2 * l);
          
          // 绘制叶脉线
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX + lineLength, lineY);
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'wood':
      // 木纹笔触 - 创建木纹效果的线条
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        // 木纹参数
        const grain = brushSettings.woodGrain;
        const curve = brushSettings.woodCurve;
        const noiseScale = brushSettings.woodNoiseScale;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width * 0.5;
        
        // 绘制多条木纹线
        const lineCount = Math.max(2, Math.ceil(distance / 10));
        
        for (let l = 0; l < lineCount; l++) {
          // 每条线有细微的偏差
          const lineAngle = angle + (Math.random() - 0.5) * Math.PI * 0.2 * l;
          
          // 木纹线的位置
          const lineX = prevX + Math.cos(lineAngle) * l * 10;
          const lineY = prevY + Math.sin(lineAngle) * l * 10;
          
          // 木纹线的长度
          const lineLength = distance - l * 10;
          
          // 木纹线的宽度
          const lineWidth = width * (1 - Math.abs(Math.sin(lineAngle)) * 0.2 * l);
          
          // 绘制木纹线
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX + lineLength, lineY);
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'fabric':
      // 布纹笔触 - 创建布纹效果的线条
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        // 布纹参数
        const density = brushSettings.fabricDensity;
        const angleVariation = brushSettings.fabricAngle;
        const variation = brushSettings.fabricVariation;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width * 0.5;
        
        // 绘制多条布纹线
        const lineCount = Math.max(2, Math.ceil(distance / 10));
        
        for (let l = 0; l < lineCount; l++) {
          // 每条线有细微的偏差
          const lineAngle = angle + (Math.random() - 0.5) * angleVariation * Math.PI;
          
          // 布纹线的位置
          const lineX = prevX + Math.cos(lineAngle) * l * 10;
          const lineY = prevY + Math.sin(lineAngle) * l * 10;
          
          // 布纹线的长度
          const lineLength = distance - l * 10;
          
          // 布纹线的宽度
          const lineWidth = width * (1 - Math.abs(Math.sin(lineAngle)) * 0.2 * l);
          
          // 绘制布纹线
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX + lineLength, lineY);
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'particle':
      // 微粒笔触 - 创建微粒效果的线条
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        const perpAngle = angle + Math.PI / 2;
        
        // 微粒参数
        const count = brushSettings.particleCount;
        const speed = brushSettings.particleSpeed;
        const size = brushSettings.particleSize;
        const lifetime = brushSettings.particleLifetime;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        
        // 绘制多条微粒线
        const lineCount = Math.max(2, Math.ceil(distance / 10));
        
        for (let l = 0; l < lineCount; l++) {
          // 每条线有细微的偏差
          const lineAngle = angle + (Math.random() - 0.5) * Math.PI * 0.2 * l;
          
          // 微粒线的位置
          const lineX = prevX + Math.cos(lineAngle) * l * 10;
          const lineY = prevY + Math.sin(lineAngle) * l * 10;
          
          // 微粒线的长度
          const lineLength = distance - l * 10;
          
          // 微粒线的宽度
          const lineWidth = size * (1 - Math.abs(Math.sin(lineAngle)) * 0.2 * l);
          
          // 绘制微粒线
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX + lineLength, lineY);
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'neon':
      // 霓虹笔触 - 创建霓虹灯发光效果
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        
        // 霓虹参数
        const glow = brushSettings.neonGlow * width; // 发光强度
        const neonWidth = brushSettings.neonWidth * width * 0.5; // 中心线宽度
        const colorShift = brushSettings.neonColorShift; // 颜色变化
        
        ctx.save();
        
        // 设置霓虹发光效果
        ctx.shadowColor = color;
        ctx.shadowBlur = glow * 2;
        
        // 使用多层绘制来增强发光效果
        const layers = 3;
        
        for (let i = 0; i < layers; i++) {
          // 每层不同的宽度和透明度
          const layerWidth = neonWidth * (1 - i * 0.2);
          const alpha = 0.7 - i * 0.2;
          
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = layerWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // 如果启用颜色变化，为不同层设置不同颜色
          if (colorShift > 0.3 && color.startsWith('#')) {
            try {
              // 简单的颜色调整逻辑 - 增加饱和度或亮度
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              
              // 为每一层增加一些亮度
              const brightenFactor = 1 + i * colorShift * 0.4;
              const newR = Math.min(255, Math.floor(r * brightenFactor));
              const newG = Math.min(255, Math.floor(g * brightenFactor));
              const newB = Math.min(255, Math.floor(b * brightenFactor));
              
              const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
              ctx.strokeStyle = newColor;
              
              // 内层为白色增强发光中心
              if (i === layers - 1) {
                ctx.strokeStyle = '#ffffff';
              }
            } catch (e) {
              // 颜色解析失败时使用原始颜色
              ctx.strokeStyle = color;
            }
          }
          
          // 绘制霓虹线条
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        
        // 在线段端点添加额外的亮点突显霓虹效果
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, neonWidth * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
      return true;
      
    case 'pointillism':
      // 点彩派风格笔触 - 使用色点模拟点彩派画风
      if (prevX !== null && prevY !== null) {
        // 计算线段长度和方向
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const angle = Math.atan2(y - prevY, x - prevX);
        
        ctx.save();
        
        // 点彩参数
        const density = brushSettings.pointillismDensity; // 点密度
        const sizeVariation = brushSettings.pointillismSizeVariation; // 大小变化
        const colorVariation = brushSettings.pointillismColorVariation; // 颜色变化
        
        // 基于密度和距离计算点的数量
        const dotCount = Math.max(10, Math.ceil(distance * density * 2.5));
        
        // 色点分布区域的宽度
        const areaWidth = width * 3;
        
        // 解析颜色获取HSL
        let baseHue = 0, baseSat = 0, baseLit = 50;
        
        if (color.startsWith('#')) {
          try {
            // 简单的RGB转HSL转换
            const r = parseInt(color.slice(1, 3), 16) / 255;
            const g = parseInt(color.slice(3, 5), 16) / 255;
            const b = parseInt(color.slice(5, 7), 16) / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            
            baseLit = (max + min) / 2 * 100;
            
            if (max !== min) {
              baseSat = baseLit > 50 
                ? (max - min) / (2 - max - min) * 100 
                : (max - min) / (max + min) * 100;
              
              if (max === r) baseHue = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
              else if (max === g) baseHue = ((b - r) / (max - min) + 2) * 60;
              else baseHue = ((r - g) / (max - min) + 4) * 60;
            }
          } catch (e) {
            // 转换失败时使用默认值
          }
        }
        
        // 绘制分散的色点
        for (let i = 0; i < dotCount; i++) {
          // 在线段上随机选取位置
          const t = Math.random();
          const baseX = prevX + (x - prevX) * t;
          const baseY = prevY + (y - prevY) * t;
          
          // 在垂直于线段的方向上随机偏移 - 创建区域效果
          const perpAngle = angle + Math.PI / 2;
          const offset = (Math.random() - 0.5) * areaWidth;
          
          const dotX = baseX + Math.cos(perpAngle) * offset;
          const dotY = baseY + Math.sin(perpAngle) * offset;
          
          // 随机的点大小，距离中心越远点越小
          const sizeFactor = 1 - Math.abs(offset) / areaWidth;
          const dotSize = width * (0.2 + Math.random() * sizeVariation * 0.3) * sizeFactor;
          
          // 根据位置和随机性微调颜色 - 点彩派风格的色彩变化
          if (colorVariation > 0.1) {
            // 随机调整色相和饱和度
            const hueShift = (Math.random() - 0.5) * 30 * colorVariation;
            const satShift = (Math.random() - 0.5) * 20 * colorVariation;
            const litShift = (Math.random() - 0.5) * 15 * colorVariation;
            
            const finalHue = (baseHue + hueShift) % 360;
            const finalSat = Math.max(0, Math.min(100, baseSat + satShift));
            const finalLit = Math.max(0, Math.min(100, baseLit + litShift));
            
            ctx.fillStyle = `hsl(${finalHue}, ${finalSat}%, ${finalLit}%)`;
          } else {
            ctx.fillStyle = color;
          }
          
          // 绘制点 - 点彩派多为圆点
          ctx.globalAlpha = 0.3 + Math.random() * 0.4 * sizeFactor; // 透明度也随位置变化
          
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'gel':
      // 胶状笔触 - 模拟胶状物体的流动效果
      if (prevX !== null && prevY !== null) {
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        ctx.save();
        
        // 胶状物体的流动参数
        const distortion = brushSettings.gelDistortion;
        const shininess = brushSettings.gelShininess;
        
        // 计算流动效果
        const flow = Math.sin(distance * 0.1) * distortion + 1;
        
        // 设置胶状物体的颜色
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        
        // 绘制流动效果
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.lineWidth = width * flow;
        ctx.stroke();
        
        // 添加光泽效果
        if (shininess > 0.3) {
          ctx.globalAlpha = shininess;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.lineWidth = width * 0.5;
          ctx.stroke();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'smoke':
      // 烟雾笔触 - 模拟烟雾的扩散效果
      if (prevX !== null && prevY !== null) {
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        
        ctx.save();
        
        // 烟雾参数
        const density = brushSettings.smokeDensity;
        const dispersion = brushSettings.smokeDispersion;
        const turbulence = brushSettings.smokeTurbulence;
        
        // 烟雾粒子数量和大小
        const particleCount = Math.max(10, Math.floor(distance * density * 5));
        const maxSize = width * 2;
        
        // 烟雾区域宽度
        const smokeWidth = width * 5 * dispersion;
        
        // 绘制烟雾粒子
        for (let i = 0; i < particleCount; i++) {
          // 沿线段随机位置
          const t = Math.random();
          const baseX = prevX + (x - prevX) * t;
          const baseY = prevY + (y - prevY) * t;
          
          // 在垂直方向上随机偏移
          const perpAngle = angle + Math.PI / 2;
          const offsetDistance = (Math.random() - 0.5) * smokeWidth;
          
          // 添加湍流效果，随时间和位置变化偏移方向
          const turbulenceAngle = (Math.sin(t * 10) * turbulence * Math.PI);
          
          const smokeX = baseX + Math.cos(perpAngle + turbulenceAngle) * offsetDistance;
          const smokeY = baseY + Math.sin(perpAngle + turbulenceAngle) * offsetDistance;
          
          // 粒子大小随距离和随机因素变化
          const sizeVariation = 0.5 + Math.random() * 0.5;
          const size = maxSize * sizeVariation * (1 - Math.abs(offsetDistance) / smokeWidth * 0.5);
          
          // 透明度随距离衰减
          const alpha = Math.max(0.05, 0.3 - Math.abs(offsetDistance) / smokeWidth * 0.3);
          
          // 将颜色转换为半透明
          let smokeColor = color;
          if (color.startsWith('#')) {
            try {
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              smokeColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } catch (e) {
              // 转换失败时使用原始颜色
              smokeColor = color;
            }
          }
          
          // 绘制烟雾粒子
          ctx.fillStyle = smokeColor;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(smokeX, smokeY, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
      return true;
      
    case 'metallic':
      // 金属笔触 - 模拟金属材质的光泽和反光效果
      if (prevX !== null && prevY !== null) {
        // 计算方向和距离
        const angle = Math.atan2(y - prevY, x - prevX);
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        const perpAngle = angle + Math.PI / 2;
        
        ctx.save();
        
        // 金属参数
        const shine = brushSettings.metallicShine;  // 光泽度
        const texture = brushSettings.metallicTexture;  // 纹理
        const scratch = brushSettings.metallicScratch;  // 划痕
        
        // 绘制基础金属线条
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 添加金属光泽 - 高光线
        if (shine > 0.3) {
          ctx.globalAlpha = shine * 0.8;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = width * 0.3;
          
          // 金属高光通常沿着物体边缘
          const shineOffset = width * 0.2;
          
          ctx.beginPath();
          ctx.moveTo(
            prevX + Math.cos(perpAngle) * shineOffset,
            prevY + Math.sin(perpAngle) * shineOffset
          );
          ctx.lineTo(
            x + Math.cos(perpAngle) * shineOffset,
            y + Math.sin(perpAngle) * shineOffset
          );
          ctx.stroke();
        }
        
        // 添加金属纹理 - 类似木纹但更规则的纹理线
        if (texture > 0.2) {
          const textureLines = Math.max(2, Math.ceil(width * texture));
          const textureGap = width / textureLines;
          
          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          
          for (let i = 0; i < textureLines; i++) {
            // 纹理线平行于主线
            const offset = (i - textureLines / 2) * textureGap;
            
            ctx.beginPath();
            ctx.moveTo(
              prevX + Math.cos(perpAngle) * offset,
              prevY + Math.sin(perpAngle) * offset
            );
            ctx.lineTo(
              x + Math.cos(perpAngle) * offset,
              y + Math.sin(perpAngle) * offset
            );
            ctx.stroke();
          }
        }
        
        // 添加金属划痕 - 类似刮痕但更细更规则
        if (scratch > 0.3) {
          const scratchCount = Math.ceil(distance / 10 * scratch);
          
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          
          for (let i = 0; i < scratchCount; i++) {
            // 在线段上随机位置
            const t = Math.random();
            const scratchX = prevX + (x - prevX) * t;
            const scratchY = prevY + (y - prevY) * t;
            
            // 划痕方向偏离主方向
            const scratchAngle = angle + (Math.random() - 0.5) * Math.PI * 0.5;
            const scratchLength = width * (0.5 + Math.random() * 0.5);
            
            ctx.beginPath();
            ctx.moveTo(scratchX, scratchY);
            ctx.lineTo(
              scratchX + Math.cos(scratchAngle) * scratchLength,
              scratchY + Math.sin(scratchAngle) * scratchLength
            );
            ctx.stroke();
          }
        }
        
        ctx.restore();
      }
      return true;
      
    default:
      // 没有特殊处理，返回false表示应该使用普通绘制
      return false;
  }
};

/**
 * 绘制闪电路径 - 电流效果的辅助函数
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x1 - 起始X坐标
 * @param {number} y1 - 起始Y坐标
 * @param {number} x2 - 终点X坐标
 * @param {number} y2 - 终点Y坐标
 * @param {number} displace - 最大偏移量
 * @param {string} color - 闪电颜色
 * @param {number} width - 线宽
 */
function drawLightningPath(ctx, x1, y1, x2, y2, displace, color, width) {
  // 如果位移太小，直接绘制线段
  if (displace < 3) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }
  
  // 计算中点
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;
  
  // 添加随机位移
  const perpX = (y2 - y1);
  const perpY = -(x2 - x1);
  
  // 单位化垂直向量
  const length = Math.sqrt(perpX * perpX + perpY * perpY);
  const normalX = perpX / length;
  const normalY = perpY / length;
  
  // 添加随机偏移
  const displacement = (Math.random() - 0.5) * displace;
  midX += normalX * displacement;
  midY += normalY * displacement;
  
  // 递归绘制两段
  drawLightningPath(ctx, x1, y1, midX, midY, displace / 2, color, width);
  drawLightningPath(ctx, midX, midY, x2, y2, displace / 2, color, width);
  
  // 在接合处添加亮点
  if (Math.random() < 0.5 && displace > 10) {
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(midX, midY, width * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 创建笔触预览
 * @param {string} brushType - 笔触类型ID
 * @param {Object} settings - 笔触设置
 * @param {string} color - 颜色
 * @param {number} width - 线宽
 * @returns {HTMLCanvasElement} 包含预览的Canvas元素
 */
export const createBrushPreview = (brushType, settings = {}, color = '#000000', width = 5) => {
  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 60;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 设置笔触样式
  setBrushStyle(ctx, brushType, settings, color, width);
  
  // 绘制预览线条
  const centerY = canvas.height / 2;
  
  // 添加所有需要特殊绘制的笔触类型
  if ([
    'spray', 'pixel', 'calligraphy', 'pencil', 'rainbow', 
    'dotted', 'wave', 'mosaic', 'leaf', 'wood', 'fabric', 
    'particle', 'neon', 'pointillism', 'gel', 'smoke', 'metallic'
  ].includes(brushType)) {
    // 特殊笔触需要点对点绘制
    const steps = 50;
    let prevX = 20;
    let prevY = centerY;
    
    for (let i = 1; i <= steps; i++) {
      const x = 20 + (60 / steps) * i;
      const y = centerY - Math.sin((i / steps) * Math.PI) * 10;
      
      drawSpecialBrush(ctx, brushType, x, y, prevX, prevY, settings, color, width);
      
      prevX = x;
      prevY = y;
    }
  } else {
    // 标准笔触可以用路径绘制
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    
    // 绘制波浪线
    for (let x = 20; x <= 80; x++) {
      const t = (x - 20) / 60;
      const y = centerY - Math.sin(t * Math.PI) * 10;
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  }
  
  return canvas;
}; 