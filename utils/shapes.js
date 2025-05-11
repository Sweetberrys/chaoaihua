import { 
  Circle, Square, Triangle, Star, Hexagon, Moon, Heart, Diamond, Plus, ArrowUp,
  LoaderCircle, Droplet, Cloud, Zap, Leaf, Flower, TreePine, Sun, Snowflake,
  Car, Bike, Home, Building2, Umbrella, Wind, Castle, Rocket, Sword, Swords, 
  Axe, Hammer, Wand, Pencil, Shield, Dumbbell, Scroll
} from "lucide-react";

// 形状库定义
export const shapesLibrary = [
  { id: 'circle', name: '圆形', icon: 'circle' },
  { id: 'rectangle', name: '矩形', icon: 'square' },
  { id: 'triangle', name: '三角形', icon: 'triangle' },
  { id: 'star', name: '星形', icon: 'star', hasSettings: true },
  { id: 'polygon', name: '多边形', icon: 'hexagon', hasSettings: true },
  { id: 'ellipse', name: '椭圆形', icon: 'circle' },
  { id: 'semicircle', name: '半圆', icon: 'circle' },
  { id: 'crescent', name: '月牙形', icon: 'moon' },
  { id: 'diamond', name: '菱形', icon: 'diamond' },
  { id: 'trapezoid', name: '梯形', icon: 'square' },
  { id: 'parallelogram', name: '平行四边形', icon: 'square' },
  { id: 'heart', name: '心形', icon: 'heart' },
  { id: 'cross', name: '十字形', icon: 'plus' },
  { id: 'arrow', name: '箭头', icon: 'arrow-up' },
  { id: 'spiral', name: '螺旋形', icon: 'loader' },
  { id: 'teardrop', name: '水滴形', icon: 'droplet' },
  { id: 'cloud', name: '云形', icon: 'cloud' },
  { id: 'lightning', name: '闪电形', icon: 'zap' },
  { id: 'leaf', name: '叶形', icon: 'leaf' },
  { id: 'flower', name: '花形', icon: 'flower' },
  { id: 'grass', name: '草形', icon: 'leaf' },
  { id: 'house', name: '房屋形', icon: 'home' },
  { id: 'skyscraper', name: '摩天大楼形', icon: 'building2' },
  { id: 'electric-scooter', name: '电动滑板车形', icon: 'bike' },
  { id: 'motorcycle', name: '摩托车形', icon: 'bike' },
  { id: 'car', name: '汽车形', icon: 'car' },
  { id: 'tree', name: '树形', icon: 'tree-pine' },
  { id: 'sun', name: '太阳形', icon: 'sun' },
  { id: 'raindrop', name: '雨滴形', icon: 'umbrella' },
  { id: 'snowflake', name: '雪花形', icon: 'snowflake' },
  { id: 'snowman', name: '雪人形', icon: 'snowflake' },
  { id: 'airplane', name: '飞机形', icon: 'plane' },
  { id: 'sailboat', name: '帆船形', icon: 'ship' },
  { id: 'castle', name: '城堡形', icon: 'castle', hasSettings: true },
  { id: 'windmill', name: '风车形', icon: 'wind', hasSettings: true },
  { id: 'rocket', name: '火箭形', icon: 'rocket', hasSettings: true },
  // 十八般兵器
  { id: 'dao', name: '刀形', icon: 'sword', hasSettings: true },
  { id: 'qiang', name: '枪形', icon: 'wand', hasSettings: true },
  { id: 'jian', name: '剑形', icon: 'sword', hasSettings: true },
  { id: 'ji', name: '戟形', icon: 'swords', hasSettings: true },
  { id: 'fu', name: '斧形', icon: 'axe', hasSettings: true },
  { id: 'yue', name: '钺形', icon: 'axe', hasSettings: true },
  { id: 'gou', name: '钩形', icon: 'swords', hasSettings: true },
  { id: 'cha', name: '叉形', icon: 'swords', hasSettings: true },
  { id: 'bian', name: '鞭形', icon: 'scroll', hasSettings: true },
  { id: 'jian2', name: '锏形', icon: 'hammer', hasSettings: true },
  { id: 'chui', name: '锤形', icon: 'hammer', hasSettings: true },
  { id: 'zhua', name: '抓形', icon: 'swords', hasSettings: true },
  { id: 'tang', name: '镗形', icon: 'wand', hasSettings: true },
  { id: 'gun', name: '棍形', icon: 'wand', hasSettings: true },
  { id: 'shuo', name: '槊形', icon: 'swords', hasSettings: true },
  { id: 'bang', name: '棒形', icon: 'wand', hasSettings: true },
  { id: 'guai', name: '拐形', icon: 'wand', hasSettings: true },
  { id: 'liuxingchui', name: '流星锤形', icon: 'dumbbell', hasSettings: true },
];

// 在画布上绘制形状
export const drawShape = (ctx, shapeId, x, y, size, options = {}, saveCallback = null) => {
  // 保存当前状态
  ctx.save();
  
  // 设置填充和边框样式
  const fillColor = options.fillColor || ctx.fillStyle;
  const borderColor = options.borderColor || ctx.strokeStyle;
  const borderWidth = options.borderWidth || ctx.lineWidth;
  const borderStyle = options.borderStyle || 'solid'; // solid, dashed, dotted
  
  // 应用翻转
  ctx.translate(x, y);
  if (options.flipHorizontal) {
    ctx.scale(-1, 1);
  }
  if (options.flipVertical) {
    ctx.scale(1, -1);
  }
  ctx.translate(-x, -y);
  
  // 设置边框样式
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColor;
  
  // 设置填充颜色
  ctx.fillStyle = fillColor;
  
  // 设置虚线或点状线的样式
  if (borderStyle === 'dashed') {
    // 优化虚线样式，使用更长的线段
    const dashSize = borderWidth * 4; // 增加长度
    const gapSize = borderWidth * 1.5;
    ctx.setLineDash([dashSize, gapSize]);
  } else if (borderStyle === 'dotted') {
    // 优化点状线，使点更小且间距更紧密
    const dotSize = borderWidth * 0.6; // 减小点的大小
    const dotGap = borderWidth * 1.8;  // 调整间距
    ctx.lineCap = 'round'; // 确保点是圆的
    ctx.setLineDash([dotSize, dotGap]);
  } else {
    ctx.setLineDash([]);
  }
  
  // 根据形状ID绘制不同形状
  switch (shapeId) {
    case 'circle':
      drawCircle(ctx, x, y, size/2);
      break;
    case 'rectangle':
      drawRectangle(ctx, x, y, size, size * 0.8);
      break;
    case 'triangle':
      drawTriangle(ctx, x, y, size);
      break;
    case 'star':
      drawStar(ctx, x, y, size/2, options.points || 5, options.innerRadius || 0.4);
      break;
    case 'polygon':
      drawPolygon(ctx, x, y, size/2, options.sides || 6);
      break;
    case 'ellipse':
      drawEllipse(ctx, x, y, size/2, size/3);
      break;
    case 'semicircle':
      drawSemiCircle(ctx, x, y, size/2);
      break;
    case 'crescent':
      drawCrescent(ctx, x, y, size/2);
      break;
    case 'diamond':
      drawDiamond(ctx, x, y, size, size*0.6);
      break;
    case 'trapezoid':
      drawTrapezoid(ctx, x, y, size, size*0.8);
      break;
    case 'parallelogram':
      drawParallelogram(ctx, x, y, size, size*0.7);
      break;
    case 'heart':
      drawHeart(ctx, x, y, size/2);
      break;
    case 'cross':
      drawCross(ctx, x, y, size);
      break;
    case 'arrow':
      drawArrow(ctx, x, y, size);
      break;
    case 'spiral':
      drawSpiral(ctx, x, y, size/2);
      break;
    case 'teardrop':
      drawTeardrop(ctx, x, y, size/2);
      break;
    case 'cloud':
      drawCloud(ctx, x, y, size/2);
      break;
    case 'lightning':
      drawLightning(ctx, x, y, size);
      break;
    case 'leaf':
      drawLeaf(ctx, x, y, size/2);
      break;
    case 'flower':
      drawFlower(ctx, x, y, size/2);
      break;
    case 'grass':
      drawGrass(ctx, x, y, size/2);
      break;
    case 'house':
      drawHouse(ctx, x, y, size/2);
      break;
    case 'skyscraper':
      drawSkyscraper(ctx, x, y, size/2);
      break;
    case 'electric-scooter':
      drawElectricScooter(ctx, x, y, size/2);
      break;
    case 'motorcycle':
      drawMotorcycle(ctx, x, y, size/2);
      break;
    case 'car':
      drawCar(ctx, x, y, size/2);
      break;
    case 'tree':
      drawTree(ctx, x, y, size/2);
      break;
    case 'sun':
      drawSun(ctx, x, y, size/2);
      break;
    case 'raindrop':
      drawRaindrop(ctx, x, y, size/2);
      break;
    case 'snowflake':
      drawSnowflake(ctx, x, y, size/2);
      break;
    case 'snowman':
      drawSnowman(ctx, x, y, size/2);
      break;
    case 'airplane':
      drawAirplane(ctx, x, y, size/2);
      break;
    case 'sailboat':
      drawSailboat(ctx, x, y, size/2);
      break;
    case 'castle':
      drawCastle(ctx, x, y, size/2);
      break;
    case 'windmill':
      drawWindmill(ctx, x, y, size/2);
      break;
    case 'rocket':
      drawRocket(ctx, x, y, size/2);
      break;
    // 十八般兵器
    case 'dao':
      drawDao(ctx, x, y, size/2);
      break;
    case 'qiang':
      drawQiang(ctx, x, y, size/2);
      break;
    case 'jian':
      drawJian(ctx, x, y, size/2);
      break;
    case 'ji':
      drawJi(ctx, x, y, size/2);
      break;
    case 'fu':
      drawFu(ctx, x, y, size/2);
      break;
    case 'yue':
      drawYue(ctx, x, y, size/2);
      break;
    case 'gou':
      drawGou(ctx, x, y, size/2);
      break;
    case 'cha':
      drawCha(ctx, x, y, size/2);
      break;
    case 'bian':
      drawBian(ctx, x, y, size/2);
      break;
    case 'jian2':
      drawJian2(ctx, x, y, size/2);
      break;
    case 'chui':
      drawChui(ctx, x, y, size/2);
      break;
    case 'zhua':
      drawZhua(ctx, x, y, size/2);
      break;
    case 'tang':
      drawTang(ctx, x, y, size/2);
      break;
    case 'gun':
      drawGun(ctx, x, y, size/2);
      break;
    case 'shuo':
      drawShuo(ctx, x, y, size/2);
      break;
    case 'bang':
      drawBang(ctx, x, y, size/2);
      break;
    case 'guai':
      drawGuai(ctx, x, y, size/2);
      break;
    case 'liuxingchui':
      drawLiuxingchui(ctx, x, y, size/2);
      break;
    default:
      // 默认绘制圆形
      drawCircle(ctx, x, y, size/2);
  }
  
  // 恢复画布状态
  ctx.restore();
  
  // 如果提供了保存回调函数，则调用它
  if (typeof saveCallback === 'function') {
    saveCallback();
  }
};

// 圆形
export const drawCircle = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

// 矩形
export const drawRectangle = (ctx, x, y, width, height) => {
  ctx.beginPath();
  ctx.rect(x - width/2, y - height/2, width, height);
  ctx.fill();
  ctx.stroke();
};

// 三角形
export const drawTriangle = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x + size/2, y + size/2);
  ctx.lineTo(x - size/2, y + size/2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 星形
export const drawStar = (ctx, x, y, outerRadius, points, innerRadiusRatio) => {
  const innerRadius = outerRadius * innerRadiusRatio;
  const step = Math.PI / points;
  
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    if (i === 0) {
      ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    } else {
      ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 多边形
export const drawPolygon = (ctx, x, y, radius, sides) => {
  ctx.beginPath();
  const angle = (Math.PI * 2) / sides;
  for (let i = 0; i < sides; i++) {
    const currentAngle = i * angle - Math.PI / 2;
    const pointX = x + radius * Math.cos(currentAngle);
    const pointY = y + radius * Math.sin(currentAngle);
    
    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 椭圆
export const drawEllipse = (ctx, x, y, radiusX, radiusY) => {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

// 半圆
export const drawSemiCircle = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI, false);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 月牙形
export const drawCrescent = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, -Math.PI/4, Math.PI/4, true);
  ctx.arc(x - radius/3, y, radius*0.9, Math.PI/4, -Math.PI/4, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 菱形
export const drawDiamond = (ctx, x, y, width, height) => {
  ctx.beginPath();
  ctx.moveTo(x, y - height/2);
  ctx.lineTo(x + width/2, y);
  ctx.lineTo(x, y + height/2);
  ctx.lineTo(x - width/2, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 梯形
export const drawTrapezoid = (ctx, x, y, width, height) => {
  const topWidth = width * 0.6;
  ctx.beginPath();
  ctx.moveTo(x - topWidth/2, y - height/2);
  ctx.lineTo(x + topWidth/2, y - height/2);
  ctx.lineTo(x + width/2, y + height/2);
  ctx.lineTo(x - width/2, y + height/2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 平行四边形
export const drawParallelogram = (ctx, x, y, width, height) => {
  const offset = width * 0.2;
  ctx.beginPath();
  ctx.moveTo(x - width/2 + offset, y - height/2);
  ctx.lineTo(x + width/2 + offset, y - height/2);
  ctx.lineTo(x + width/2 - offset, y + height/2);
  ctx.lineTo(x - width/2 - offset, y + height/2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 心形
export const drawHeart = (ctx, x, y, size) => {
  ctx.beginPath();
  
  // 从底部尖角开始
  ctx.moveTo(x, y + size/2);
  
  // 左侧曲线
  ctx.bezierCurveTo(
    x - size, y,           // 控制点1：向左拉伸
    x - size/2, y - size/2, // 控制点2：向左上方塑形
    x, y - size/4          // 终点：心形顶部中央凹槽
  );
  
  // 右侧曲线
  ctx.bezierCurveTo(
    x + size/2, y - size/2, // 控制点1：与左侧对称
    x + size, y,           // 控制点2：向右拉伸
    x, y + size/2          // 终点：回到底部尖角
  );
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};


// 十字形
export const drawCross = (ctx, x, y, size) => {
  const thickness = size / 3;
  ctx.beginPath();
  // 水平部分
  ctx.rect(x - size/2, y - thickness/2, size, thickness);
  // 垂直部分
  ctx.rect(x - thickness/2, y - size/2, thickness, size);
  ctx.fill();
  ctx.stroke();
};

// 箭头
export const drawArrow = (ctx, x, y, size) => {
  const headSize = size * 0.6;
  const stemWidth = size * 0.2;
  
  ctx.beginPath();
  // 箭头头部
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x + headSize/2, y - size/2 + headSize);
  ctx.lineTo(x + stemWidth/2, y - size/2 + headSize);
  ctx.lineTo(x + stemWidth/2, y + size/2);
  ctx.lineTo(x - stemWidth/2, y + size/2);
  ctx.lineTo(x - stemWidth/2, y - size/2 + headSize);
  ctx.lineTo(x - headSize/2, y - size/2 + headSize);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 水滴形
export const drawTeardrop = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.bezierCurveTo(
    x + size, y - size/2, 
    x + size, y + size/2, 
    x, y + size/2
  );
  ctx.bezierCurveTo(
    x - size, y + size/2, 
    x - size, y - size/2, 
    x, y - size
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 云形
export const drawCloud = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x - size * 0.5, y + size * 0.2);
  ctx.bezierCurveTo(
    x - size * 0.8, y, 
    x - size * 0.8, y - size * 0.3, 
    x - size * 0.5, y - size * 0.4
  );
  ctx.bezierCurveTo(
    x - size * 0.3, y - size * 0.8, 
    x + size * 0.3, y - size * 0.8, 
    x + size * 0.5, y - size * 0.4
  );
  ctx.bezierCurveTo(
    x + size * 0.8, y - size * 0.3, 
    x + size * 0.8, y, 
    x + size * 0.5, y + size * 0.2
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 闪电形
export const drawLightning = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x + size/4, y - size/6);
  ctx.lineTo(x + size/8, y);
  ctx.lineTo(x + size/3, y);
  ctx.lineTo(x - size/4, y + size/2);
  ctx.lineTo(x, y + size/6);
  ctx.lineTo(x - size/8, y + size/6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 螺旋形（使用多条贝塞尔曲线绘制简化版螺旋）
export const drawSpiral = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // 绘制四段贝塞尔曲线来模拟螺旋
  const spiralSegments = 4;
  let radius = size / spiralSegments;
  let angle = 0;
  
  for (let i = 0; i < spiralSegments; i++) {
    angle += Math.PI / 2;
    radius += size / spiralSegments;
    
    const endX = x + radius * Math.cos(angle);
    const endY = y + radius * Math.sin(angle);
    
    const controlX1 = x + (radius * 0.8) * Math.cos(angle - Math.PI / 4);
    const controlY1 = y + (radius * 0.8) * Math.sin(angle - Math.PI / 4);
    
    const controlX2 = endX + (radius * 0.2) * Math.cos(angle - Math.PI / 4);
    const controlY2 = endY + (radius * 0.2) * Math.sin(angle - Math.PI / 4);
    
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    
    x = endX;
    y = endY;
  }
  
  ctx.lineWidth = size / 10;
  ctx.stroke();
};

// 叶形
export const drawLeaf = (ctx, x, y, size) => {
  ctx.beginPath();
  ctx.moveTo(x, y - size/2); // 顶部起点
  
  // 右侧曲线
  ctx.bezierCurveTo(
    x + size/2, y - size/3,
    x + size/2, y + size/3,
    x, y + size/2 // 底部
  );
  
  // 左侧曲线
  ctx.bezierCurveTo(
    x - size/2, y + size/3,
    x - size/2, y - size/3,
    x, y - size/2 // 回到顶部
  );
  
  // 叶脉
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x, y + size/2);
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};


// 花形
export const drawFlower = (ctx, x, y, size) => {
  // 绘制五个花瓣
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const petalX = x + Math.cos(angle) * size/2;
    const petalY = y + Math.sin(angle) * size/2;
    
    ctx.beginPath();
    ctx.ellipse(
      petalX, petalY,
      size/3, size/4,
      angle, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
  }
  
  // 花蕊
  ctx.beginPath();
  ctx.arc(x, y, size/4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcc00';
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#000'; // 重置填充颜色
};


// 草形
export const drawGrass = (ctx, x, y, size) => {
  const stemCount = 5;
  const stemWidth = size / 20;
  
  for (let i = 0; i < stemCount; i++) {
    const offsetX = (i - stemCount/2) * (size/4);
    
    ctx.beginPath();
    ctx.moveTo(x + offsetX, y + size/2);
    
    // 随机高度和弯曲度
    const height = size * (0.7 + Math.random() * 0.3);
    const bend = (Math.random() - 0.5) * size/3;
    
    ctx.bezierCurveTo(
      x + offsetX + bend, y + size/4,
      x + offsetX + bend, y - size/4, 
      x + offsetX, y - height
    );
    
    ctx.lineWidth = stemWidth;
    ctx.stroke();
  }
  
  ctx.lineWidth = 1; // 重置线宽
};


// 房屋形
export const drawHouse = (ctx, x, y, size) => {
  const width = size;
  const height = size * 0.8;
  
  ctx.save();
  
  // 主体
  ctx.beginPath();
  ctx.rect(x - width/2, y, width, height/2);
  ctx.fill();
  ctx.stroke();
  
  // 屋顶
  ctx.beginPath();
  ctx.moveTo(x - width/2 - size/10, y);
  ctx.lineTo(x, y - height/2);
  ctx.lineTo(x + width/2 + size/10, y);
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle; // 使用描边颜色作为屋顶填充色
  ctx.fill();
  ctx.stroke();
  
  // 门
  ctx.beginPath();
  ctx.rect(x - width/6, y + height/4, width/3, height/4);
  ctx.fillStyle = '#8B4513'; // 门的颜色
  ctx.fill();
  ctx.stroke();
  
  // 门把手
  ctx.beginPath();
  ctx.arc(x - width/12, y + 3*height/8, width/40, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700'; // 金色门把手
  ctx.fill();
  ctx.stroke();
  
  // 窗户
  ctx.beginPath();
  
  // 左窗户
  const windowSize = width/5;
  ctx.rect(x - width/3, y + height/8, windowSize, windowSize);
  
  // 右窗户
  ctx.rect(x + width/6, y + height/8, windowSize, windowSize);
  
  ctx.fillStyle = '#87CEEB'; // 窗户蓝色
  ctx.fill();
  ctx.stroke();
  
  // 窗户格栅
  ctx.beginPath();
  // 左窗户格栅
  ctx.moveTo(x - width/3, y + height/8 + windowSize/2);
  ctx.lineTo(x - width/3 + windowSize, y + height/8 + windowSize/2);
  ctx.moveTo(x - width/3 + windowSize/2, y + height/8);
  ctx.lineTo(x - width/3 + windowSize/2, y + height/8 + windowSize);
  
  // 右窗户格栅
  ctx.moveTo(x + width/6, y + height/8 + windowSize/2);
  ctx.lineTo(x + width/6 + windowSize, y + height/8 + windowSize/2);
  ctx.moveTo(x + width/6 + windowSize/2, y + height/8);
  ctx.lineTo(x + width/6 + windowSize/2, y + height/8 + windowSize);
  
  ctx.stroke();
  
  // 烟囱
  ctx.beginPath();
  ctx.rect(x + width/4, y - height/3, width/10, -height/6);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.stroke();
  
  ctx.restore(); // 恢复原有的填充颜色
};


// 摩天大楼形
export const drawSkyscraper = (ctx, x, y, size) => {
  const width = size * 0.6;
  const height = size * 1.8;
  
  ctx.save();
  
  // 主体
  ctx.beginPath();
  ctx.rect(x - width/2, y - height + height/2, width, height/2);
  ctx.fill();
  ctx.stroke();
  
  // 渐变底座
  const baseWidth = width * 1.2;
  const baseHeight = height * 0.1;
  ctx.beginPath();
  ctx.rect(x - baseWidth/2, y, baseWidth, baseHeight);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.stroke();
  
  // 顶部
  ctx.beginPath();
  ctx.moveTo(x - width/2, y - height);
  ctx.lineTo(x - width/4, y - height - size/5);
  ctx.lineTo(x + width/4, y - height - size/5);
  ctx.lineTo(x + width/2, y - height);
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.stroke();
  
  // 天线
  ctx.beginPath();
  ctx.moveTo(x, y - height - size/5);
  ctx.lineTo(x, y - height - size/3);
  ctx.lineWidth = width/20;
  ctx.stroke();
  ctx.lineWidth = width/40;
  
  // 窗户 - 现代化格栅设计
  const floors = 10;
  const roomsPerFloor = 5;
  const windowWidth = width / (roomsPerFloor + 1);
  const windowHeight = (height/2) / (floors + 1);
  const startY = y - height + height/2;
  
  // 画水平线 (楼层分隔)
  for (let floor = 1; floor <= floors; floor++) {
    ctx.beginPath();
    const floorY = startY + floor * windowHeight;
    ctx.moveTo(x - width/2, floorY);
    ctx.lineTo(x + width/2, floorY);
    ctx.strokeStyle = '#rgba(200, 200, 200, 0.5)';
    ctx.stroke();
  }
  
  // 画垂直线 (房间分隔)
  for (let room = 1; room <= roomsPerFloor-1; room++) {
    ctx.beginPath();
    const roomX = x - width/2 + room * windowWidth;
    ctx.moveTo(roomX, startY);
    ctx.lineTo(roomX, y);
    ctx.strokeStyle = '#rgba(200, 200, 200, 0.5)';
    ctx.stroke();
  }
  
  // 随机点亮一些窗户
  ctx.fillStyle = '#FFD700'; // 金色窗户灯光
  for (let floor = 0; floor < floors; floor++) {
    for (let room = 0; room < roomsPerFloor; room++) {
      // 随机决定是否点亮这个窗户 (约30%的窗户被点亮)
      if (Math.random() < 0.3) {
        const windowX = x - width/2 + room * windowWidth + windowWidth/2;
        const windowY = startY + floor * windowHeight + windowHeight/2;
        ctx.beginPath();
        ctx.rect(
          windowX - windowWidth * 0.4,
          windowY - windowHeight * 0.4,
          windowWidth * 0.8,
          windowHeight * 0.8
        );
        ctx.fill();
      }
    }
  }
  
  ctx.restore();
};


// 电动滑板车形
export const drawElectricScooter = (ctx, x, y, size) => {
  ctx.save();
  
  // 车轮
  const wheelRadius = size/6;
  const frontWheelX = x + size/2.5;
  const backWheelX = x - size/2.5;
  const wheelY = y + size/6;
  
  // 轮胎
  ctx.beginPath();
  ctx.arc(frontWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.arc(backWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.stroke();
  
  // 轮毂
  ctx.beginPath();
  ctx.arc(frontWheelX, wheelY, wheelRadius/2, 0, Math.PI * 2);
  ctx.arc(backWheelX, wheelY, wheelRadius/2, 0, Math.PI * 2);
  ctx.fillStyle = '#DDD';
  ctx.fill();
  ctx.stroke();
  
  // 滑板主体
  ctx.beginPath();
  ctx.moveTo(backWheelX, wheelY - wheelRadius/2);
  ctx.lineTo(frontWheelX, wheelY - wheelRadius/2);
  ctx.lineTo(frontWheelX + wheelRadius/2, wheelY - wheelRadius);
  ctx.lineTo(backWheelX - wheelRadius/2, wheelY - wheelRadius);
  ctx.closePath();
  ctx.fillStyle = '#4CAF50'; // 绿色
  ctx.fill();
  ctx.stroke();
  
  // 车把立柱
  ctx.beginPath();
  ctx.moveTo(frontWheelX, wheelY - wheelRadius);
  ctx.lineTo(frontWheelX, y - size/2.5);
  ctx.lineWidth = size/25;
  ctx.stroke();
  ctx.lineWidth = size/50;
  
  // 车把横杆
  ctx.beginPath();
  ctx.moveTo(frontWheelX - size/6, y - size/2.5);
  ctx.lineTo(frontWheelX + size/6, y - size/2.5);
  ctx.lineWidth = size/25;
  ctx.stroke();
  ctx.lineWidth = size/50;
  
  // 手柄
  ctx.beginPath();
  ctx.arc(frontWheelX - size/6, y - size/2.5, size/25, 0, Math.PI * 2);
  ctx.arc(frontWheelX + size/6, y - size/2.5, size/25, 0, Math.PI * 2);
  ctx.fillStyle = '#FF5722'; // 橙色手柄
  ctx.fill();
  ctx.stroke();
  
  // 踏板
  ctx.beginPath();
  ctx.moveTo(backWheelX, wheelY - wheelRadius);
  ctx.lineTo(frontWheelX - size/5, wheelY - wheelRadius);
  ctx.lineWidth = size/15;
  ctx.stroke();
  
  // 电池盒
  ctx.beginPath();
  ctx.rect(backWheelX - size/10, wheelY - wheelRadius*2, size/5, size/5);
  ctx.fillStyle = '#607D8B'; // 蓝灰色
  ctx.fill();
  ctx.stroke();
  
  // 前灯
  ctx.beginPath();
  ctx.arc(frontWheelX, y - size/2.5, size/20, 0, Math.PI * 2);
  ctx.fillStyle = '#FFEB3B'; // 黄色灯
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};


// 摩托车形
export const drawMotorcycle = (ctx, x, y, size) => {
  ctx.save();
  
  // 定义关键点位置
  const wheelRadius = size/3.5;
  const frontWheelX = x + size/2;
  const backWheelX = x - size/2;
  const wheelY = y + wheelRadius/2;
  
  // 轮胎
  ctx.beginPath();
  ctx.arc(frontWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.arc(backWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#333'; // 黑色轮胎
  ctx.fill();
  ctx.stroke();
  
  // 轮毂
  ctx.beginPath();
  ctx.arc(frontWheelX, wheelY, wheelRadius * 0.6, 0, Math.PI * 2);
  ctx.arc(backWheelX, wheelY, wheelRadius * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = '#CCC'; // 灰色轮毂
  ctx.fill();
  ctx.stroke();
  
  // 轮毂花纹
  for (let wheel of [frontWheelX, backWheelX]) {
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      ctx.beginPath();
      ctx.moveTo(wheel, wheelY);
      ctx.lineTo(
        wheel + Math.cos(angle) * wheelRadius * 0.5,
        wheelY + Math.sin(angle) * wheelRadius * 0.5
      );
      ctx.stroke();
    }
  }
  
  // 后支架
  ctx.beginPath();
  ctx.moveTo(backWheelX, wheelY - wheelRadius * 0.7);
  ctx.lineTo(backWheelX + size/6, y - size/6);
  ctx.lineTo(backWheelX + size/3, y - size/6);
  ctx.stroke();
  
  // 后减震
  ctx.beginPath();
  ctx.moveTo(backWheelX + size/10, wheelY - wheelRadius * 0.7);
  ctx.lineTo(backWheelX + size/5, y - size/4);
  ctx.lineWidth = size/30;
  ctx.stroke();
  ctx.lineWidth = size/60;
  
  // 油箱/主体
  ctx.beginPath();
  ctx.moveTo(backWheelX + size/4, y - size/6);
  ctx.lineTo(backWheelX + size/2, y - size/6);
  ctx.lineTo(backWheelX + size/1.5, y - size/3);
  ctx.lineTo(backWheelX + size/3, y - size/3);
  ctx.closePath();
  ctx.fillStyle = '#D32F2F'; // 摩托车经典红色
  ctx.fill();
  ctx.stroke();
  
  // 座椅
  ctx.beginPath();
  ctx.ellipse(backWheelX + size/3, y - size/4.5, size/6, size/12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#212121'; // 黑色座椅
  ctx.fill();
  ctx.stroke();
  
  // 前叉
  ctx.beginPath();
  ctx.moveTo(frontWheelX, wheelY - wheelRadius * 0.8);
  ctx.lineTo(frontWheelX, y - size/3);
  ctx.lineWidth = size/25;
  ctx.stroke();
  ctx.lineWidth = size/60;
  
  // 龙头
  ctx.beginPath();
  ctx.moveTo(frontWheelX, y - size/3);
  ctx.lineTo(frontWheelX - size/6, y - size/2.5);
  ctx.lineWidth = size/30;
  ctx.stroke();
  ctx.lineWidth = size/60;
  
  // 车把
  ctx.beginPath();
  ctx.moveTo(frontWheelX - size/6 - size/12, y - size/2.5);
  ctx.lineTo(frontWheelX - size/6 + size/12, y - size/2.5);
  ctx.stroke();
  
  // 前灯
  ctx.beginPath();
  ctx.arc(frontWheelX, y - size/3.5, size/15, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF9C4'; // 浅黄色前灯
  ctx.fill();
  ctx.stroke();
  
  // 引擎
  ctx.beginPath();
  ctx.rect(backWheelX + size/5, y - size/10, size/5, size/6);
  ctx.fillStyle = '#424242'; // 深灰色引擎
  ctx.fill();
  ctx.stroke();
  
  // 排气管
  ctx.beginPath();
  ctx.moveTo(backWheelX + size/4, y);
  ctx.lineTo(backWheelX + size/2, y);
  ctx.lineWidth = size/25;
  ctx.stroke();
  
  ctx.restore();
};


// 汽车形
export const drawCar = (ctx, x, y, size) => {
  ctx.save();
  
  const width = size * 1.2;
  const height = size * 0.45;
  const wheelRadius = height/2.5;
  const wheelY = y + height/2 + wheelRadius/3;
  const frontWheelX = x + width/3;
  const backWheelX = x - width/3;
  
  // 车身主体 - 使用圆润的线条
  ctx.beginPath();
  ctx.moveTo(x - width/2, y);
  // 车身底部
  ctx.lineTo(x + width/2, y);
  // 前部
  ctx.lineTo(x + width/2, y - height/4);
  // 前挡风玻璃
  ctx.lineTo(x + width/4, y - height);
  // 车顶
  ctx.lineTo(x - width/4, y - height);
  // 后挡风玻璃
  ctx.lineTo(x - width/2, y - height/4);
  ctx.closePath();
  ctx.fillStyle = '#3F51B5'; // 深蓝色车身
  ctx.fill();
  ctx.stroke();
  
  // 车轮 - 轮胎
  ctx.beginPath();
  ctx.arc(frontWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.arc(backWheelX, wheelY, wheelRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#212121'; // 黑色轮胎
  ctx.fill();
  ctx.stroke();
  
  // 轮毂
  ctx.beginPath();
  ctx.arc(frontWheelX, wheelY, wheelRadius * 0.6, 0, Math.PI * 2);
  ctx.arc(backWheelX, wheelY, wheelRadius * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = '#E0E0E0'; // 银色轮毂
  ctx.fill();
  ctx.stroke();
  
  // 轮毂花纹
  for (let wheel of [frontWheelX, backWheelX]) {
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(wheel, wheelY);
      ctx.lineTo(
        wheel + Math.cos(angle) * wheelRadius * 0.5,
        wheelY + Math.sin(angle) * wheelRadius * 0.5
      );
      ctx.stroke();
    }
  }
  
  // 前灯
  ctx.beginPath();
  ctx.ellipse(x + width/2 - width/40, y - height/8, width/20, height/8, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FFEB3B'; // 黄色前灯
  ctx.fill();
  ctx.stroke();
  
  // 后灯
  ctx.beginPath();
  ctx.ellipse(x - width/2 + width/40, y - height/8, width/20, height/8, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#F44336'; // 红色后灯
  ctx.fill();
  ctx.stroke();
  
  // 侧窗
  ctx.beginPath();
  // 前窗
  ctx.rect(x, y - height * 0.9, width/4 - width/20, height * 0.5);
  // 后窗
  ctx.rect(x - width/4, y - height * 0.9, width/4 - width/20, height * 0.5);
  ctx.fillStyle = '#90CAF9'; // 蓝色玻璃
  ctx.fill();
  ctx.stroke();
  
  // 车门把手
  ctx.beginPath();
  ctx.moveTo(x - width/8, y - height/2);
  ctx.lineTo(x, y - height/2);
  ctx.moveTo(x - width/3, y - height/2);
  ctx.lineTo(x - width/4, y - height/2);
  ctx.stroke();
  
  // 门缝
  ctx.beginPath();
  ctx.moveTo(x, y - height/4);
  ctx.lineTo(x, y - height * 0.9);
  ctx.stroke();
  
  // 保险杠
  ctx.beginPath();
  ctx.rect(x - width/2 - width/40, y - height/12, width/20, height/6);
  ctx.rect(x + width/2, y - height/12, width/20, height/6);
  ctx.fillStyle = '#BDBDBD'; // 灰色保险杠
  ctx.fill();
  ctx.stroke();
  
  // 牌照位置
  ctx.beginPath();
  ctx.rect(x - width/10, y - height/20, width/5, height/10);
  ctx.fillStyle = '#EEEEEE'; // 白色牌照底色
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};


// 树形
export const drawTree = (ctx, x, y, size) => {
  ctx.save();
  
  // 树干 - 使用更自然的宽度和颜色
  const trunkWidth = size/6;
  const trunkHeight = size/1.8;
  const trunkX = x - trunkWidth/2;
  const trunkY = y;
  
  // 绘制树干
  ctx.beginPath();
  // 稍微弯曲的树干
  ctx.moveTo(trunkX, trunkY);
  ctx.quadraticCurveTo(
    x - trunkWidth, y - trunkHeight/2, 
    trunkX, y - trunkHeight
  );
  ctx.lineTo(trunkX + trunkWidth, y - trunkHeight);
  ctx.quadraticCurveTo(
    x + trunkWidth, y - trunkHeight/2, 
    trunkX + trunkWidth, trunkY
  );
  ctx.closePath();
  
  // 木质纹理的棕色
  const woodGradient = ctx.createLinearGradient(
    trunkX, y, 
    trunkX + trunkWidth, y
  );
  woodGradient.addColorStop(0, '#8B4513');  // 深棕色
  woodGradient.addColorStop(0.4, '#A0522D'); // 中棕色
  woodGradient.addColorStop(1, '#8B4513');  // 深棕色
  
  ctx.fillStyle = woodGradient;
  ctx.fill();
  ctx.stroke();
  
  // 树枝
  ctx.beginPath();
  ctx.moveTo(x, y - trunkHeight * 0.7);
  ctx.lineTo(x - size/4, y - trunkHeight * 0.9);
  ctx.moveTo(x, y - trunkHeight * 0.5);
  ctx.lineTo(x + size/5, y - trunkHeight * 0.7);
  ctx.stroke();
  
  // 树冠 - 多层次的叶子
  // 底部叶层
  ctx.beginPath();
  ctx.arc(x, y - trunkHeight * 0.9, size/1.8, 0, Math.PI * 2);
  // 使用渐变色增加立体感
  const leafGradient = ctx.createRadialGradient(
    x, y - trunkHeight, 0,
    x, y - trunkHeight, size/1.6
  );
  leafGradient.addColorStop(0, '#2E7D32'); // 深绿色中心
  leafGradient.addColorStop(0.7, '#388E3C'); // 中绿色
  leafGradient.addColorStop(1, '#43A047'); // 浅绿色边缘
  
  ctx.fillStyle = leafGradient;
  ctx.fill();
  ctx.stroke();
  
  // 中部叶层
  ctx.beginPath();
  ctx.arc(x, y - trunkHeight - size/6, size/2.2, 0, Math.PI * 2);
  ctx.fillStyle = '#388E3C'; // 稍浅一点的绿色
  ctx.fill();
  ctx.stroke();
  
  // 顶部叶层
  ctx.beginPath();
  ctx.arc(x, y - trunkHeight - size/3, size/3, 0, Math.PI * 2);
  ctx.fillStyle = '#43A047'; // 最浅的绿色
  ctx.fill();
  ctx.stroke();
  
  // 为树冠添加一些简单的纹理点缀
  ctx.fillStyle = '#81C784'; // 浅绿色点缀
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * size/2;
    const dotSize = Math.random() * size/20 + size/40;
    
    ctx.beginPath();
    ctx.arc(
      x + Math.cos(angle) * distance, 
      y - trunkHeight - size/6 + Math.sin(angle) * distance,
      dotSize, 0, Math.PI * 2
    );
    ctx.fill();
  }
  
  ctx.restore();
};


// 太阳形
export const drawSun = (ctx, x, y, size) => {
  // 太阳主体
  ctx.beginPath();
  ctx.arc(x, y, size/3, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.stroke();
  
  // 太阳光芒
  const rays = 12;
  const rayLength = size/2;
  
  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays;
    const startX = x + Math.cos(angle) * (size/3);
    const startY = y + Math.sin(angle) * (size/3);
    const endX = x + Math.cos(angle) * rayLength;
    const endY = y + Math.sin(angle) * rayLength;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.fillStyle = '#000'; // 重置填充颜色
};


// 雨滴形
export const drawRaindrop = (ctx, x, y, size) => {
  ctx.save();
  
  const dropWidth = size/2;
  const dropHeight = size;
  
  // 雨滴形状轮廓
  ctx.beginPath();
  
  // 绘制带尖顶的雨滴
  ctx.moveTo(x, y - dropHeight/2);
  
  // 左侧曲线
  ctx.bezierCurveTo(
    x - dropWidth/2, y - dropHeight/4,  // 控制点1
    x - dropWidth/2, y + dropHeight/4,  // 控制点2
    x, y + dropHeight/2                // 底部中心点
  );
  
  // 右侧曲线
  ctx.bezierCurveTo(
    x + dropWidth/2, y + dropHeight/4,  // 控制点1
    x + dropWidth/2, y - dropHeight/4,  // 控制点2
    x, y - dropHeight/2                // 回到顶部
  );
  
  ctx.closePath();
  
  // 创建水滴渐变
  const dropGradient = ctx.createLinearGradient(
    x - dropWidth/2, y - dropHeight/2,
    x + dropWidth/2, y + dropHeight/2
  );
  
  dropGradient.addColorStop(0, '#E3F2FD'); // 浅蓝色顶部
  dropGradient.addColorStop(0.5, '#2196F3'); // 中间蓝色
  dropGradient.addColorStop(1, '#1565C0'); // 深蓝色底部
  
  ctx.fillStyle = dropGradient;
  ctx.fill();
  
  // 绘制雨滴反光亮点
  ctx.beginPath();
  // 主亮点
  ctx.ellipse(
    x - dropWidth/5, 
    y - dropHeight/4, 
    dropWidth/6, 
    dropHeight/10, 
    Math.PI/4, 
    0, Math.PI * 2
  );
  
  // 小亮点
  ctx.moveTo(x - dropWidth/10, y);
  ctx.arc(
    x - dropWidth/10, 
    y, 
    dropWidth/10, 
    0, Math.PI * 2
  );
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();
  
  // 外边框
  ctx.strokeStyle = '#1976D2';
  ctx.lineWidth = size/50;
  ctx.stroke();
  
  // 水滴底部的水花效果
  const splashY = y + dropHeight/2 + size/20;
  
  // 左侧水花
  ctx.beginPath();
  ctx.moveTo(x - size/8, splashY);
  ctx.lineTo(x - size/4, splashY - size/12);
  ctx.lineTo(x - size/5, splashY);
  ctx.lineTo(x - size/3, splashY + size/15);
  
  // 右侧水花
  ctx.moveTo(x + size/8, splashY);
  ctx.lineTo(x + size/4, splashY - size/12);
  ctx.lineTo(x + size/5, splashY);
  ctx.lineTo(x + size/3, splashY + size/15);
  
  ctx.strokeStyle = 'rgba(25, 118, 210, 0.6)';
  ctx.lineWidth = size/60;
  ctx.stroke();
  
  ctx.restore();
};


// 雪花
export const drawSnowflake = (ctx, x, y, size) => {
  const branches = 6;
  const branchLength = size/2;
  
  for (let i = 0; i < branches; i++) {
    const angle = (i * Math.PI * 2) / branches;
    const endX = x + Math.cos(angle) * branchLength;
    const endY = y + Math.sin(angle) * branchLength;
    
    // 主干
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // 分支
    const sideLength = branchLength / 3;
    const midX = x + Math.cos(angle) * (branchLength / 2);
    const midY = y + Math.sin(angle) * (branchLength / 2);
    
    const perpAngle1 = angle + Math.PI / 3;
    const perpAngle2 = angle - Math.PI / 3;
    
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(
      midX + Math.cos(perpAngle1) * sideLength,
      midY + Math.sin(perpAngle1) * sideLength
    );
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(
      midX + Math.cos(perpAngle2) * sideLength,
      midY + Math.sin(perpAngle2) * sideLength
    );
    ctx.stroke();
  }
};

/**
 * 绘制雪人
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {number} x - 中心点X坐标
 * @param {number} y - 中心点Y坐标
 * @param {number} size - 雪人大小
 */
export const drawSnowman = (ctx, x, y, size) => {
  // 保存绘图状态
  ctx.save();
  
  // 设置雪球比例
  const bottomRadius = size * 0.55;
  const middleRadius = size * 0.38;
  const headRadius = size * 0.25;
  
  // 雪球位置
  const bottomY = y + size * 0.3;
  const middleY = y - size * 0.15;
  const headY = y - size * 0.65;
  
  // 雪的颜色和纹理
  const snowGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, size
  );
  snowGradient.addColorStop(0, '#FFFFFF');
  snowGradient.addColorStop(0.8, '#F5F5F5');
  snowGradient.addColorStop(1, '#E0E0E0');
  
  // 底部大雪球
  ctx.beginPath();
  ctx.arc(x, bottomY, bottomRadius, 0, Math.PI * 2);
  ctx.fillStyle = snowGradient;
  ctx.fill();
  ctx.stroke();
  
  // 添加雪球纹理
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * bottomRadius * 0.8;
    ctx.moveTo(
      x + Math.cos(angle) * distance, 
      bottomY + Math.sin(angle) * distance
    );
    ctx.arc(
      x + Math.cos(angle) * distance, 
      bottomY + Math.sin(angle) * distance, 
      size/50, 0, Math.PI * 2
    );
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // 中间雪球
  ctx.beginPath();
  ctx.arc(x, middleY, middleRadius, 0, Math.PI * 2);
  ctx.fillStyle = snowGradient;
  ctx.fill();
  ctx.stroke();
  
  // 添加雪球纹理
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * middleRadius * 0.8;
    ctx.moveTo(
      x + Math.cos(angle) * distance, 
      middleY + Math.sin(angle) * distance
    );
    ctx.arc(
      x + Math.cos(angle) * distance, 
      middleY + Math.sin(angle) * distance, 
      size/60, 0, Math.PI * 2
    );
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // 头部小雪球
  ctx.beginPath();
  ctx.arc(x, headY, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = snowGradient;
  ctx.fill();
  ctx.stroke();
  
  // 添加雪球纹理
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * headRadius * 0.7;
    ctx.moveTo(
      x + Math.cos(angle) * distance, 
      headY + Math.sin(angle) * distance
    );
    ctx.arc(
      x + Math.cos(angle) * distance, 
      headY + Math.sin(angle) * distance, 
      size/70, 0, Math.PI * 2
    );
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // 眼睛
  const eyeSize = size * 0.05;
  const eyeY = headY - headRadius * 0.15;
  const eyeDistance = headRadius * 0.4;
  
  // 左眼
  ctx.beginPath();
  ctx.arc(x - eyeDistance, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fillStyle = '#212121';
  ctx.fill();
  
  // 右眼
  ctx.beginPath();
  ctx.arc(x + eyeDistance, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fillStyle = '#212121';
  ctx.fill();
  
  // 眼睛高光
  ctx.beginPath();
  ctx.arc(x - eyeDistance + eyeSize/3, eyeY - eyeSize/3, eyeSize/3, 0, Math.PI * 2);
  ctx.arc(x + eyeDistance + eyeSize/3, eyeY - eyeSize/3, eyeSize/3, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // 笑容
  ctx.beginPath();
  ctx.arc(x, headY + headRadius * 0.1, headRadius * 0.6, 0.2, Math.PI - 0.2, false);
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = size/50;
  ctx.stroke();
  ctx.lineWidth = size/60;
  
  // 鼻子（胡萝卜）
  ctx.beginPath();
  ctx.moveTo(x, headY);
  ctx.lineTo(x + headRadius * 0.7, headY + headRadius * 0.1);
  ctx.lineTo(x, headY + headRadius * 0.2);
  ctx.closePath();
  ctx.fillStyle = '#FF9800'; // 橙色胡萝卜
  ctx.fill();
  ctx.stroke();
  
  // 帽子
  ctx.beginPath();
  // 帽子底部
  ctx.moveTo(x - headRadius * 1.1, headY - headRadius * 0.7);
  ctx.lineTo(x + headRadius * 1.1, headY - headRadius * 0.7);
  ctx.lineTo(x + headRadius * 0.8, headY - headRadius * 1.1);
  ctx.lineTo(x - headRadius * 0.8, headY - headRadius * 1.1);
  ctx.closePath();
  ctx.fillStyle = '#D32F2F'; // 红色帽子
  ctx.fill();
  ctx.stroke();
  
  // 帽子顶部
  ctx.beginPath();
  ctx.moveTo(x - headRadius * 0.8, headY - headRadius * 1.1);
  ctx.lineTo(x + headRadius * 0.8, headY - headRadius * 1.1);
  ctx.lineTo(x, headY - headRadius * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 帽子毛球
  ctx.beginPath();
  ctx.arc(x, headY - headRadius * 2, headRadius * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.stroke();
  
  // 纽扣
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const buttonY = middleY - middleRadius * 0.5 + i * middleRadius * 0.5;
    ctx.moveTo(x, buttonY);
    ctx.arc(x, buttonY, size * 0.04, 0, Math.PI * 2);
  }
  ctx.fillStyle = '#212121';
  ctx.fill();
  
  // 围巾
  ctx.beginPath();
  ctx.ellipse(x, middleY - middleRadius * 0.8, middleRadius * 1.1, middleRadius * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#4CAF50'; // 绿色围巾
  ctx.fill();
  ctx.stroke();
  
  // 围巾垂下部分
  ctx.beginPath();
  ctx.moveTo(x + middleRadius * 0.5, middleY - middleRadius * 0.7);
  ctx.quadraticCurveTo(
    x + middleRadius * 0.7, middleY - middleRadius * 0.3,
    x + middleRadius * 0.9, middleY
  );
  ctx.quadraticCurveTo(
    x + middleRadius * 0.8, middleY + middleRadius * 0.1,
    x + middleRadius * 0.6, middleY
  );
  ctx.quadraticCurveTo(
    x + middleRadius * 0.7, middleY - middleRadius * 0.4,
    x + middleRadius * 0.5, middleY - middleRadius * 0.6
  );
  ctx.closePath();
  ctx.fillStyle = '#4CAF50';
  ctx.fill();
  ctx.stroke();
  
  // 手臂 (树枝)
  ctx.beginPath();
  // 左臂
  ctx.moveTo(x - middleRadius * 0.8, middleY);
  ctx.lineTo(x - middleRadius * 1.5, middleY - middleRadius * 0.8);
  ctx.moveTo(x - middleRadius * 1.3, middleY - middleRadius * 0.6);
  ctx.lineTo(x - middleRadius * 1.6, middleY - middleRadius * 0.4);
  
  // 右臂
  ctx.moveTo(x + middleRadius * 0.8, middleY);
  ctx.lineTo(x + middleRadius * 1.5, middleY - middleRadius * 0.4);
  ctx.moveTo(x + middleRadius * 1.2, middleY - middleRadius * 0.2);
  ctx.lineTo(x + middleRadius * 1.4, middleY);
  
  ctx.lineWidth = size/40;
  ctx.strokeStyle = '#5D4037'; // 深棕色树枝
  ctx.stroke();
  
  // 恢复绘图状态
  ctx.restore();
};

// 渲染形状图标
export const renderShapeIcon = (iconName) => {
  switch (iconName) {
    case 'circle': return <Circle className="w-6 h-6" />;
    case 'square': return <Square className="w-6 h-6" />;
    case 'triangle': return <Triangle className="w-6 h-6" />;
    case 'star': return <Star className="w-6 h-6" />;
    case 'hexagon': return <Hexagon className="w-6 h-6" />;
    case 'moon': return <Moon className="w-6 h-6" />;
    case 'heart': return <Heart className="w-6 h-6" />;
    case 'diamond': return <Diamond className="w-6 h-6" />;
    case 'plus': return <Plus className="w-6 h-6" />;
    case 'arrow-up': return <ArrowUp className="w-6 h-6" />;
    case 'loader': return <LoaderCircle className="w-6 h-6" />;
    case 'droplet': return <Droplet className="w-6 h-6" />;
    case 'cloud': return <Cloud className="w-6 h-6" />;
    case 'zap': return <Zap className="w-6 h-6" />;
    case 'leaf': return <Leaf className="w-6 h-6" />;
    case 'flower': return <Flower className="w-6 h-6" />;
    case 'grass': return <Leaf className="w-6 h-6" />;
    case 'house': return <Home className="w-6 h-6" />;
    case 'skyscraper': return <Building2 className="w-6 h-6" />;
    case 'electric-scooter': return <Bike className="w-6 h-6" />;
    case 'motorcycle': return <Bike className="w-6 h-6" />;
    case 'car': return <Car className="w-6 h-6" />;
    case 'tree': return <TreePine className="w-6 h-6" />;
    case 'sun': return <Sun className="w-6 h-6" />;
    case 'raindrop': return <Umbrella className="w-6 h-6" />;
    case 'snowflake': return <Snowflake className="w-6 h-6" />;
    case 'snowman': return <Snowflake className="w-6 h-6" />;
    case 'sailboat': return <Ship className="w-6 h-6" />;
    case 'castle': return <Castle className="w-6 h-6" />;
    case 'wind': return <Wind className="w-6 h-6" />;
    case 'windmill': return <Wind className="w-6 h-6" />;
    case 'rocket': return <Rocket className="w-6 h-6" />;
    // 十八般兵器图标
    case 'sword': return <Sword className="w-6 h-6" />;
    case 'swords': return <Swords className="w-6 h-6" />;
    case 'axe': return <Axe className="w-6 h-6" />;
    case 'wand': return <Wand className="w-6 h-6" />;
    case 'hammer': return <Hammer className="w-6 h-6" />;
    case 'scroll': return <Scroll className="w-6 h-6" />;
    case 'dumbbell': return <Dumbbell className="w-6 h-6" />;
    case 'shield': return <Shield className="w-6 h-6" />;
    case 'staff': return <Wand className="w-6 h-6" />;
    default: return <Square className="w-6 h-6" />;
  }
};

/**
 * 创建形状预览
 * @param {string} shapeId - 形状类型ID
 * @param {Object} settings - 形状设置
 * @param {Object} options - 预览选项
 * @returns {HTMLCanvasElement} 包含预览的Canvas元素
 */
export const createShapePreview = (shapeId, settings = {}, options = {}) => {
  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 120;
  canvas.height = options.height || 120;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 设置背景
  if (options.showBackground) {
    ctx.fillStyle = '#f9fafb'; // 浅灰背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格或参考线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // 垂直中线
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // 水平中线
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
  
  // 绘制形状
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // 根据形状确定默认大小
  let shapeSize = Math.min(canvas.width, canvas.height) * 0.7;
  if (options.size) {
    shapeSize = options.size;
  }
  
  // 从合并设置和预览特定选项
  const previewSettings = {
    ...settings,
    fillColor: settings.fillColor || options.defaultFillColor || '#4b5563',
    borderColor: settings.borderColor || options.defaultBorderColor || '#1f2937',
    borderWidth: settings.borderWidth || options.defaultBorderWidth || 2,
    // 确保边框样式在预览中更加明显
    borderStyle: settings.borderStyle || 'solid'
  };
  
  // 适当增大边框宽度以便在预览中更清晰地看到样式
  if (previewSettings.borderStyle === 'dashed' || previewSettings.borderStyle === 'dotted') {
    previewSettings.borderWidth = Math.max(previewSettings.borderWidth, 3);
  }
  
  // 在中心绘制形状
  drawShape(ctx, shapeId, centerX, centerY, shapeSize, previewSettings);
  
  return canvas;
};

// 飞机形
export const drawAirplane = (ctx, x, y, size) => {
  ctx.save();
  
  // 飞机尺寸
  const length = size * 1.5;
  const width = size * 0.6;
  
  // 机身
  ctx.beginPath();
  ctx.ellipse(x, y, length/2, width/6, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#F5F5F5'; // 白色机身
  ctx.fill();
  ctx.stroke();
  
  // 机头细节
  ctx.beginPath();
  ctx.ellipse(x + length/2 - width/10, y, width/8, width/10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#212121'; // 黑色机头
  ctx.fill();
  
  // 机翼
  ctx.beginPath();
  // 左翼
  ctx.moveTo(x - width/2, y);
  ctx.lineTo(x - width, y - width/6);
  ctx.lineTo(x - width * 1.2, y - width/6);
  ctx.lineTo(x - width * 1.1, y);
  ctx.lineTo(x - width, y + width/6);
  ctx.lineTo(x - width/2, y);
  
  // 右翼
  ctx.moveTo(x + width/2, y);
  ctx.lineTo(x + width, y - width/6);
  ctx.lineTo(x + width * 1.2, y - width/6);
  ctx.lineTo(x + width * 1.1, y);
  ctx.lineTo(x + width, y + width/6);
  ctx.lineTo(x + width/2, y);
  
  ctx.fillStyle = '#2196F3'; // 蓝色机翼
  ctx.fill();
  ctx.stroke();
  
  // 尾翼
  ctx.beginPath();
  // 垂直尾翼
  ctx.moveTo(x - length/2 + width/6, y);
  ctx.lineTo(x - length/2, y - width/3);
  ctx.lineTo(x - length/2 - width/6, y - width/3);
  ctx.lineTo(x - length/2 - width/4, y);
  ctx.closePath();
  
  ctx.fillStyle = '#2196F3'; // 蓝色尾翼
  ctx.fill();
  ctx.stroke();
  
  // 水平尾翼
  ctx.beginPath();
  ctx.moveTo(x - length/2 + width/3, y);
  ctx.lineTo(x - length/2, y - width/8);
  ctx.lineTo(x - length/2 - width/3, y - width/8);
  ctx.lineTo(x - length/2, y + width/8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 窗户
  const windowSize = width/10;
  const windowGap = width/8;
  const windowY = y - width/8;
  const windowsCount = 5;
  const startX = x - length/4;
  
  for (let i = 0; i < windowsCount; i++) {
    ctx.beginPath();
    ctx.rect(startX + i * windowGap, windowY, windowSize, windowSize);
    ctx.fillStyle = '#90CAF9'; // 浅蓝色窗户
    ctx.fill();
    ctx.stroke();
  }
  
  // 机轮
  ctx.beginPath();
  ctx.moveTo(x, y + width/6);
  ctx.lineTo(x, y + width/3);
  ctx.moveTo(x - length/3, y + width/6);
  ctx.lineTo(x - length/3, y + width/3);
  ctx.moveTo(x + length/3, y + width/6);
  ctx.lineTo(x + length/3, y + width/3);
  ctx.stroke();
  
  // 轮子
  ctx.beginPath();
  ctx.arc(x, y + width/3, width/12, 0, Math.PI * 2);
  ctx.arc(x - length/3, y + width/3, width/12, 0, Math.PI * 2);
  ctx.arc(x + length/3, y + width/3, width/12, 0, Math.PI * 2);
  ctx.fillStyle = '#424242'; // 深灰色轮子
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};

// 帆船形
export const drawSailboat = (ctx, x, y, size) => {
  ctx.save();
  
  // 帆船尺寸
  const width = size * 1.2;
  const height = size * 1.4;
  const hullHeight = height / 4;
  
  // 绘制船体
  ctx.beginPath();
  // 船体弧线
  ctx.moveTo(x - width/2, y);
  ctx.quadraticCurveTo(
    x, y + hullHeight * 1.2,
    x + width/2, y
  );
  ctx.lineTo(x + width/3, y - hullHeight/2);
  ctx.lineTo(x - width/3, y - hullHeight/2);
  ctx.closePath();
  
  // 使用渐变为船体上色
  const hullGradient = ctx.createLinearGradient(
    x - width/2, y,
    x + width/2, y
  );
  hullGradient.addColorStop(0, '#5D4037'); // 深木色
  hullGradient.addColorStop(0.5, '#795548'); // 中木色
  hullGradient.addColorStop(1, '#5D4037'); // 深木色
  
  ctx.fillStyle = hullGradient;
  ctx.fill();
  ctx.stroke();
  
  // 船舱
  ctx.beginPath();
  ctx.rect(x - width/8, y - hullHeight/2, width/4, hullHeight/2);
  ctx.fillStyle = '#8D6E63'; // 浅木色
  ctx.fill();
  ctx.stroke();
  
  // 船舱窗户
  ctx.beginPath();
  ctx.arc(x, y - hullHeight/4, width/16, 0, Math.PI * 2);
  ctx.fillStyle = '#FFECB3'; // 淡黄色窗户灯
  ctx.fill();
  ctx.stroke();
  
  // 桅杆
  ctx.beginPath();
  ctx.moveTo(x, y - hullHeight/2);
  ctx.lineTo(x, y - height);
  ctx.lineWidth = width/30;
  ctx.stroke();
  ctx.lineWidth = width/60;
  
  // 主帆 - 三角形
  ctx.beginPath();
  ctx.moveTo(x, y - height + height/10);
  ctx.lineTo(x, y - hullHeight/2);
  ctx.lineTo(x + width/2, y - hullHeight);
  ctx.closePath();
  
  // 帆的渐变
  const sailGradient = ctx.createLinearGradient(
    x, y - height/2, 
    x + width/2, y - height/2
  );
  sailGradient.addColorStop(0, '#ECEFF1'); // 几乎白色的帆
  sailGradient.addColorStop(0.8, '#CFD8DC'); // 浅灰色阴影
  
  ctx.fillStyle = sailGradient;
  ctx.fill();
  ctx.stroke();
  
  // 船帆褶皱线条 (添加一些细节)
  ctx.beginPath();
  for (let i = 1; i < 4; i++) {
    const factor = i / 4;
    ctx.moveTo(x, y - hullHeight/2 - factor * (height - hullHeight/2));
    ctx.quadraticCurveTo(
      x + width/4, y - hullHeight/2 - factor * (height - hullHeight),
      x + width/2 * factor, y - hullHeight - factor * 5
    );
  }
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.stroke();
  ctx.strokeStyle = '#000';
  
  // 次帆 - 三角形
  ctx.beginPath();
  ctx.moveTo(x, y - height * 0.7);
  ctx.lineTo(x, y - height * 0.4);
  ctx.lineTo(x - width/3, y - height * 0.5);
  ctx.closePath();
  ctx.fillStyle = sailGradient;
  ctx.fill();
  ctx.stroke();
  
  // 波浪
  ctx.beginPath();
  for (let i = -2; i <= 2; i++) {
    const waveX = x + i * width/5;
    const waveWidth = width/10;
    
    ctx.moveTo(waveX - waveWidth, y + hullHeight/2);
    ctx.quadraticCurveTo(
      waveX, y + hullHeight/4,
      waveX + waveWidth, y + hullHeight/2
    );
  }
  ctx.strokeStyle = '#64B5F6'; // 蓝色波浪
  ctx.stroke();
  
  // 旗帜
  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x + width/6, y - height + height/10);
  ctx.lineTo(x, y - height + height/5);
  ctx.fillStyle = '#EF5350'; // 红色旗帜
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};

// 城堡形
export const drawCastle = (ctx, x, y, size) => {
  ctx.save();
  
  // 城堡尺寸
  const width = size * 1.4;
  const height = size * 1.6;
  const baseHeight = height * 0.7;
  const towerWidth = width * 0.15;
  
  // 使用石头质感的渐变
  const stoneGradient = ctx.createLinearGradient(
    x - width/2, y,
    x + width/2, y
  );
  stoneGradient.addColorStop(0, '#9E9E9E');  // 灰色
  stoneGradient.addColorStop(0.3, '#BDBDBD'); // 浅灰色
  stoneGradient.addColorStop(0.7, '#BDBDBD'); // 浅灰色
  stoneGradient.addColorStop(1, '#9E9E9E');  // 灰色
  
  // 主体城墙
  ctx.beginPath();
  ctx.rect(x - width/2, y - baseHeight, width, baseHeight);
  ctx.fillStyle = stoneGradient;
  ctx.fill();
  ctx.stroke();
  
  // 垛口 (在顶部绘制)
  const merlon = width / 12; // 垛口宽度
  const merlonHeight = height * 0.05;
  const merlonCount = 10;
  
  ctx.beginPath();
  for (let i = 0; i < merlonCount; i++) {
    const merlonX = x - width/2 + i * (width / merlonCount);
    // 垛口 (方形齿) - 交替绘制凹槽和齿
    if (i % 2 === 0) {
      ctx.rect(merlonX, y - baseHeight - merlonHeight, merlon, merlonHeight);
    }
  }
  ctx.fillStyle = stoneGradient;
  ctx.fill();
  ctx.stroke();
  
  // 主门
  const doorWidth = width * 0.2;
  const doorHeight = baseHeight * 0.4;
  
  ctx.beginPath();
  // 拱形门
  ctx.moveTo(x - doorWidth/2, y);
  ctx.lineTo(x - doorWidth/2, y - doorHeight + doorWidth/2);
  ctx.arc(x, y - doorHeight + doorWidth/2, doorWidth/2, Math.PI, 0, true);
  ctx.lineTo(x + doorWidth/2, y);
  ctx.closePath();
  
  ctx.fillStyle = '#5D4037'; // 深棕色木门
  ctx.fill();
  ctx.stroke();
  
  // 门上的铰链和门把手
  ctx.beginPath();
  ctx.arc(x - doorWidth/3, y - doorHeight/3, doorWidth/15, 0, Math.PI * 2);
  ctx.arc(x + doorWidth/3, y - doorHeight/3, doorWidth/15, 0, Math.PI * 2);
  ctx.fillStyle = '#FFC107'; // 金色门把手
  ctx.fill();
  
  // 窗户
  const windowSize = width * 0.08;
  const windowRows = 2;
  const windowCols = 5;
  const windowSpacing = width * 0.15;
  const windowStartY = y - baseHeight * 0.3;
  const windowStartX = x - width * 0.35;
  
  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      // 跳过门的位置
      if (row === 1 && col === 2) continue;
      
      ctx.beginPath();
      // 拱形窗户
      const winX = windowStartX + col * windowSpacing;
      const winY = windowStartY - row * windowSpacing;
      
      ctx.moveTo(winX, winY);
      ctx.lineTo(winX, winY - windowSize + windowSize/2);
      ctx.arc(winX + windowSize/2, winY - windowSize + windowSize/2, windowSize/2, Math.PI, 0, true);
      ctx.lineTo(winX + windowSize, winY);
      ctx.closePath();
      
      ctx.fillStyle = '#64B5F6'; // 蓝色玻璃窗
      ctx.fill();
      ctx.stroke();
      
      // 窗格十字
      ctx.beginPath();
      ctx.moveTo(winX + windowSize/2, winY);
      ctx.lineTo(winX + windowSize/2, winY - windowSize);
      ctx.moveTo(winX, winY - windowSize/2);
      ctx.lineTo(winX + windowSize, winY - windowSize/2);
      ctx.stroke();
    }
  }
  
  // 四个角塔
  const towerPositions = [
    {x: x - width/2, y: y - baseHeight}, // 左下
    {x: x + width/2 - towerWidth, y: y - baseHeight}, // 右下
    {x: x - width/2, y: y - baseHeight}, // 左上
    {x: x + width/2 - towerWidth, y: y - baseHeight}, // 右上
  ];
  
  for (let tower of towerPositions) {
    drawTower(ctx, tower.x, tower.y, towerWidth, height - baseHeight, stoneGradient);
  }
  
  // 中央塔
  drawTower(ctx, x - towerWidth/2, y - baseHeight, towerWidth * 1.5, (height - baseHeight) * 1.4, stoneGradient);
  
  // 旗帜
  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x, y - baseHeight - (height - baseHeight) * 1.4 - towerWidth * 0.5);
  ctx.lineWidth = width/100;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x, y - height + towerWidth * 0.4);
  ctx.lineTo(x + towerWidth, y - height + towerWidth * 0.6);
  ctx.lineTo(x, y - height + towerWidth * 0.8);
  ctx.fillStyle = '#EF5350'; // 红色旗帜
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // 辅助函数：绘制塔
  function drawTower(ctx, x, y, width, height, gradient) {
    // 塔身
    ctx.beginPath();
    ctx.rect(x, y - height, width, height);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();
    
    // 塔顶
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x + width/2, y - height - width*0.8);
    ctx.lineTo(x + width, y - height);
    ctx.closePath();
    ctx.fillStyle = '#B71C1C'; // 深红色塔顶
    ctx.fill();
    ctx.stroke();
    
    // 塔窗
    ctx.beginPath();
    ctx.rect(x + width*0.25, y - height*0.6, width*0.5, height*0.3);
    ctx.fillStyle = '#64B5F6'; // 蓝色窗户
    ctx.fill();
    ctx.stroke();
    
    // 垛口
    const merlonWidth = width / 4;
    const merlonHeight = height * 0.1;
    
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      if (i % 2 === 0) {
        ctx.rect(x + i * merlonWidth, y - height - merlonHeight, merlonWidth, merlonHeight);
      }
    }
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();
  }
};

// 风车形
export const drawWindmill = (ctx, x, y, size) => {
  ctx.save();
  
  // 风车尺寸
  const width = size * 0.7;
  const height = size * 1.8;
  const baseWidth = width * 1.2;
  const baseHeight = height * 0.3;
  
  // 风车主体（圆柱形）
  const bodyGradient = ctx.createLinearGradient(
    x - width/2, y, 
    x + width/2, y
  );
  bodyGradient.addColorStop(0, '#A1887F'); // 木质棕色
  bodyGradient.addColorStop(0.3, '#BCAAA4'); // 浅木色
  bodyGradient.addColorStop(0.7, '#BCAAA4'); // 浅木色
  bodyGradient.addColorStop(1, '#A1887F'); // 木质棕色
  
  // 基座（圆滑的梯形）
  ctx.beginPath();
  ctx.moveTo(x - baseWidth/2, y);
  ctx.lineTo(x - width/2, y - baseHeight);
  ctx.lineTo(x + width/2, y - baseHeight);
  ctx.lineTo(x + baseWidth/2, y);
  ctx.closePath();
  ctx.fillStyle = '#795548'; // 棕色基座
  ctx.fill();
  ctx.stroke();
  
  // 主体圆柱
  ctx.beginPath();
  ctx.rect(x - width/3, y - baseHeight, width*2/3, -height + baseHeight + width);
  ctx.fillStyle = bodyGradient;
  ctx.fill();
  ctx.stroke();
  
  // 门
  ctx.beginPath();
  const doorWidth = width/3;
  const doorHeight = baseHeight * 1.5;
  ctx.rect(x - doorWidth/2, y - doorHeight, doorWidth, doorHeight);
  ctx.fillStyle = '#5D4037'; // 深棕色门
  ctx.fill();
  ctx.stroke();
  
  // 门把手
  ctx.beginPath();
  ctx.arc(x + doorWidth/4, y - doorHeight/2, width/30, 0, Math.PI * 2);
  ctx.fillStyle = '#FFC107'; // 金色门把手
  ctx.fill();
  
  // 窗户
  ctx.beginPath();
  const windowSize = width/4;
  ctx.rect(x - windowSize/2, y - baseHeight - height*0.3, windowSize, windowSize);
  ctx.fillStyle = '#BBDEFB'; // 淡蓝色窗户
  ctx.fill();
  ctx.stroke();
  
  // 窗户十字格
  ctx.beginPath();
  ctx.moveTo(x, y - baseHeight - height*0.3);
  ctx.lineTo(x, y - baseHeight - height*0.3 + windowSize);
  ctx.moveTo(x - windowSize/2, y - baseHeight - height*0.3 + windowSize/2);
  ctx.lineTo(x + windowSize/2, y - baseHeight - height*0.3 + windowSize/2);
  ctx.stroke();
  
  // 风车顶部圆顶
  ctx.beginPath();
  ctx.arc(x, y - height + baseHeight + width*0.4, width/3, 0, Math.PI * 2);
  ctx.fillStyle = '#D7CCC8'; // 灰色顶部
  ctx.fill();
  ctx.stroke();
  
  // 风车轴心
  ctx.beginPath();
  ctx.arc(x, y - height + baseHeight + width*0.4, width/12, 0, Math.PI * 2);
  ctx.fillStyle = '#616161'; // 深灰色轴心
  ctx.fill();
  ctx.stroke();
  
  // 叶片 - 绘制四个风车叶片
  const bladeLength = size;
  const bladeWidth = width / 4;
  
  // 为叶片设置颜色
  const bladeGradient = ctx.createLinearGradient(
    x, y - height + baseHeight + width*0.4 - bladeLength,
    x, y - height + baseHeight + width*0.4 + bladeLength
  );
  bladeGradient.addColorStop(0, '#F5F5F5'); // 白色叶片
  bladeGradient.addColorStop(1, '#E0E0E0'); // 浅灰色
  
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI/2) + Math.PI/4; // 以45度角放置叶片
    
    ctx.save();
    ctx.translate(x, y - height + baseHeight + width*0.4);
    ctx.rotate(angle);
    
    // 叶片 - 较窄的平行四边形
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(bladeWidth/2, -bladeLength/6);
    ctx.lineTo(0, -bladeLength);
    ctx.lineTo(-bladeWidth/2, -bladeLength/6);
    ctx.closePath();
    ctx.fillStyle = bladeGradient;
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }
  
  ctx.restore();
};

// 火箭形
export const drawRocket = (ctx, x, y, size) => {
  ctx.save();
  
  // 火箭尺寸和方向
  const rocketWidth = size * 0.7;
  const rocketHeight = size * 1.8;
  
  // 火箭身体
  const bodyWidth = rocketWidth * 0.8;
  const bodyHeight = rocketHeight * 0.6;
  
  // 创建火箭身体渐变
  const bodyGradient = ctx.createLinearGradient(
    x - bodyWidth/2, y, 
    x + bodyWidth/2, y
  );
  bodyGradient.addColorStop(0, '#E0E0E0');  // 亮灰色
  bodyGradient.addColorStop(0.5, '#FFFFFF'); // 白色
  bodyGradient.addColorStop(1, '#E0E0E0');  // 亮灰色
  
  // 绘制火箭身体
  ctx.beginPath();
  ctx.ellipse(x, y, bodyWidth/2, bodyHeight/2, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyGradient;
  ctx.fill();
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 绘制火箭头部
  const noseHeight = rocketHeight * 0.2;
  const noseWidth = bodyWidth * 0.9;
  
  ctx.beginPath();
  ctx.moveTo(x, y - bodyHeight/2 - noseHeight);
  ctx.lineTo(x - noseWidth/2, y - bodyHeight/2);
  ctx.lineTo(x + noseWidth/2, y - bodyHeight/2);
  ctx.closePath();
  ctx.fillStyle = '#FF4136'; // 红色火箭头部
  ctx.fill();
  ctx.strokeStyle = '#888888';
  ctx.stroke();
  
  // 绘制火箭尾翼
  const finWidth = bodyWidth * 0.5;
  const finHeight = rocketHeight * 0.25;
  const finY = y + bodyHeight/2 - finHeight * 0.3;
  
  // 左尾翼
  ctx.beginPath();
  ctx.moveTo(x - bodyWidth/2, finY);
  ctx.lineTo(x - bodyWidth/2 - finWidth, finY + finHeight);
  ctx.lineTo(x - bodyWidth/2 - finWidth * 0.7, finY + finHeight);
  ctx.lineTo(x - bodyWidth/2, finY + finHeight * 0.3);
  ctx.closePath();
  ctx.fillStyle = '#FF4136'; // 红色尾翼
  ctx.fill();
  ctx.strokeStyle = '#888888';
  ctx.stroke();
  
  // 右尾翼
  ctx.beginPath();
  ctx.moveTo(x + bodyWidth/2, finY);
  ctx.lineTo(x + bodyWidth/2 + finWidth, finY + finHeight);
  ctx.lineTo(x + bodyWidth/2 + finWidth * 0.7, finY + finHeight);
  ctx.lineTo(x + bodyWidth/2, finY + finHeight * 0.3);
  ctx.closePath();
  ctx.fillStyle = '#FF4136'; // 红色尾翼
  ctx.fill();
  ctx.strokeStyle = '#888888';
  ctx.stroke();
  
  // 底部尾翼
  ctx.beginPath();
  ctx.moveTo(x, y + bodyHeight/2);
  ctx.lineTo(x - finWidth/2, y + bodyHeight/2 + finHeight);
  ctx.lineTo(x + finWidth/2, y + bodyHeight/2 + finHeight);
  ctx.closePath();
  ctx.fillStyle = '#FF4136'; // 红色尾翼
  ctx.fill();
  ctx.strokeStyle = '#888888';
  ctx.stroke();
  
  // 窗口
  const windowRadius = bodyWidth * 0.15;
  ctx.beginPath();
  ctx.arc(x, y - bodyHeight/5, windowRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#7FDBFF'; // 蓝色窗口
  ctx.fill();
  ctx.strokeStyle = '#0074D9';
  ctx.stroke();
  
  // 火箭装饰环
  const ringHeight = bodyHeight * 0.05;
  const ringY1 = y - bodyHeight/4;
  const ringY2 = y + bodyHeight/6;
  
  // 上环
  ctx.beginPath();
  ctx.rect(x - bodyWidth/2, ringY1 - ringHeight/2, bodyWidth, ringHeight);
  ctx.fillStyle = '#AAAAAA';
  ctx.fill();
  
  // 下环
  ctx.beginPath();
  ctx.rect(x - bodyWidth/2, ringY2 - ringHeight/2, bodyWidth, ringHeight);
  ctx.fillStyle = '#AAAAAA';
  ctx.fill();
  
  // 火焰
  const flameWidth = bodyWidth * 0.6;
  const flameHeight = rocketHeight * 0.4;
  const flameY = y + bodyHeight/2 + finHeight/2;
  
  // 创建火焰渐变
  const flameGradient = ctx.createLinearGradient(
    x, flameY,
    x, flameY + flameHeight
  );
  flameGradient.addColorStop(0, '#FF4136');  // 红色
  flameGradient.addColorStop(0.4, '#FF851B'); // 橙色
  flameGradient.addColorStop(1, '#FFDC00');  // 黄色
  
  // 绘制主火焰
  ctx.beginPath();
  ctx.moveTo(x - flameWidth/2, flameY);
  ctx.quadraticCurveTo(x, flameY + flameHeight * 1.2, x + flameWidth/2, flameY);
  ctx.closePath();
  ctx.fillStyle = flameGradient;
  ctx.fill();
  
  // 内部火焰
  const innerFlameWidth = flameWidth * 0.6;
  const innerFlameHeight = flameHeight * 0.7;
  
  // 创建内部火焰渐变
  const innerFlameGradient = ctx.createLinearGradient(
    x, flameY,
    x, flameY + innerFlameHeight
  );
  innerFlameGradient.addColorStop(0, '#FFDC00'); // 黄色
  innerFlameGradient.addColorStop(1, '#FFFFFF');  // 白色
  
  // 绘制内部火焰
  ctx.beginPath();
  ctx.moveTo(x - innerFlameWidth/2, flameY);
  ctx.quadraticCurveTo(x, flameY + innerFlameHeight * 1.2, x + innerFlameWidth/2, flameY);
  ctx.closePath();
  ctx.fillStyle = innerFlameGradient;
  ctx.fill();
  
  // 星星点缀
  const stars = [
    { x: x - bodyWidth * 0.8, y: y - bodyHeight * 0.3, radius: size * 0.03 },
    { x: x + bodyWidth * 0.7, y: y - bodyHeight * 0.5, radius: size * 0.05 },
    { x: x - bodyWidth, y: y + bodyHeight * 0.2, radius: size * 0.04 },
    { x: x + bodyWidth * 0.9, y: y + bodyHeight * 0.4, radius: size * 0.03 }
  ];
  
  stars.forEach(star => {
    const spikes = 5;
    const outerRadius = star.radius;
    const innerRadius = outerRadius * 0.4;
    const rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(star.x, star.y - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      const x1 = star.x + Math.cos(rot + i * step) * outerRadius;
      const y1 = star.y + Math.sin(rot + i * step) * outerRadius;
      ctx.lineTo(x1, y1);
      
      const x2 = star.x + Math.cos(rot + i * step + step/2) * innerRadius;
      const y2 = star.y + Math.sin(rot + i * step + step/2) * innerRadius;
      ctx.lineTo(x2, y2);
    }
    
    ctx.closePath();
    ctx.fillStyle = '#FFDC00'; // 黄色星星
    ctx.fill();
  });
  
  ctx.restore();
};

// 刀形
export const drawDao = (ctx, x, y, size) => {
  ctx.save();
  
  // 刀的尺寸
  const bladeLength = size * 1.6;
  const bladeWidth = size * 0.25;
  const handleLength = size * 0.5;
  const handleWidth = size * 0.15;
  
  // 创建刀身渐变
  const bladeGradient = ctx.createLinearGradient(
    x - bladeLength/2, y, 
    x + bladeLength/2, y
  );
  bladeGradient.addColorStop(0, '#D6D6D6');  // 淡银色
  bladeGradient.addColorStop(0.5, '#F5F5F5'); // 亮银色
  bladeGradient.addColorStop(1, '#D6D6D6');  // 淡银色
  
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4); // 倾斜45度
  
  // 刀身
  ctx.beginPath();
  ctx.moveTo(-bladeLength/2, 0);
  ctx.lineTo(bladeLength/3, -bladeWidth/2);
  ctx.quadraticCurveTo(bladeLength/2.5, -bladeWidth/2.2, bladeLength/2, 0);
  ctx.quadraticCurveTo(bladeLength/2.5, bladeWidth/2.2, bladeLength/3, bladeWidth/2);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 刀柄
  ctx.beginPath();
  ctx.rect(-bladeLength/2, -handleWidth/2, handleLength, handleWidth);
  ctx.fillStyle = '#8B4513'; // 棕色刀柄
  ctx.fill();
  ctx.stroke();
  
  // 刀柄纹路
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    const xPos = -bladeLength/2 + i * (handleLength / 5);
    ctx.moveTo(xPos, -handleWidth/2);
    ctx.lineTo(xPos, handleWidth/2);
  }
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 刀铭
  ctx.beginPath();
  ctx.moveTo(-bladeLength/4, 0);
  ctx.lineTo(bladeLength/4, 0);
  ctx.strokeStyle = '#A7A7A7';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  ctx.restore();
};

// 枪形
export const drawQiang = (ctx, x, y, size) => {
  ctx.save();
  
  // 枪的尺寸
  const spearLength = size * 2.5;
  const spearHeadLength = size * 0.6;
  const spearHeadWidth = size * 0.2;
  const shaftWidth = size * 0.06;
  
  // 创建枪尖渐变
  const headGradient = ctx.createLinearGradient(
    x, y - spearLength/2, 
    x, y - spearLength/2 + spearHeadLength
  );
  headGradient.addColorStop(0, '#C0C0C0');  // 银色
  headGradient.addColorStop(0.5, '#E8E8E8'); // 亮银色
  headGradient.addColorStop(1, '#A8A8A8');  // 暗银色
  
  // 枪杆
  ctx.beginPath();
  ctx.rect(x - shaftWidth/2, y - spearLength/2 + spearHeadLength, shaftWidth, spearLength - spearHeadLength);
  ctx.fillStyle = '#8B4513'; // 棕色枪杆
  ctx.fill();
  ctx.stroke();
  
  // 枪尖
  ctx.beginPath();
  ctx.moveTo(x, y - spearLength/2);
  ctx.lineTo(x + spearHeadWidth/2, y - spearLength/2 + spearHeadLength);
  ctx.lineTo(x - spearHeadWidth/2, y - spearLength/2 + spearHeadLength);
  ctx.closePath();
  ctx.fillStyle = headGradient;
  ctx.fill();
  ctx.stroke();
  
  // 枪缨
  const ribbonColor = '#B71C1C'; // 深红色
  ctx.beginPath();
  const ribbonY = y - spearLength/2 + spearHeadLength;
  
  // 左侧缨子
  ctx.moveTo(x - shaftWidth/2, ribbonY);
  ctx.quadraticCurveTo(
    x - spearHeadWidth/2 - spearHeadWidth/4, ribbonY + spearHeadLength/2,
    x - spearHeadWidth/2 - spearHeadWidth/3, ribbonY + spearHeadLength
  );
  
  // 右侧缨子
  ctx.moveTo(x + shaftWidth/2, ribbonY);
  ctx.quadraticCurveTo(
    x + spearHeadWidth/2 + spearHeadWidth/4, ribbonY + spearHeadLength/2,
    x + spearHeadWidth/2 + spearHeadWidth/3, ribbonY + spearHeadLength
  );
  
  ctx.strokeStyle = ribbonColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // 绑缚处
  ctx.beginPath();
  ctx.rect(x - spearHeadWidth/3, ribbonY, spearHeadWidth*2/3, spearHeadLength/6);
  ctx.fillStyle = ribbonColor;
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};

// 剑形
export const drawJian = (ctx, x, y, size) => {
  ctx.save();
  
  // 剑的尺寸
  const bladeLength = size * 1.6;
  const bladeWidth = size * 0.18;
  const handleLength = size * 0.6;
  const guardWidth = size * 0.4;
  
  // 创建剑身渐变
  const bladeGradient = ctx.createLinearGradient(
    x, y - bladeLength/2 - handleLength, 
    x, y + bladeLength/2 - handleLength
  );
  bladeGradient.addColorStop(0, '#B0BEC5');  // 青灰色
  bladeGradient.addColorStop(0.5, '#ECEFF1'); // 亮银色
  bladeGradient.addColorStop(1, '#B0BEC5');  // 青灰色
  
  // 剑身
  ctx.beginPath();
  ctx.moveTo(x, y - bladeLength/2 - handleLength);
  ctx.lineTo(x + bladeWidth/2, y + bladeLength/2 - handleLength);
  ctx.lineTo(x - bladeWidth/2, y + bladeLength/2 - handleLength);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 剑格
  ctx.beginPath();
  ctx.rect(x - guardWidth/2, y + bladeLength/2 - handleLength, guardWidth, guardWidth/5);
  ctx.fillStyle = '#FFC107'; // 金色
  ctx.fill();
  ctx.stroke();
  
  // 剑柄
  ctx.beginPath();
  ctx.rect(x - bladeWidth/3, y + bladeLength/2 - handleLength + guardWidth/5, bladeWidth*2/3, handleLength - guardWidth/5);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 剑柄纹路
  ctx.beginPath();
  for (let i = 1; i < 6; i++) {
    const yPos = y + bladeLength/2 - handleLength + guardWidth/5 + i * ((handleLength - guardWidth/5) / 6);
    ctx.moveTo(x - bladeWidth/3, yPos);
    ctx.lineTo(x + bladeWidth*2/3 - bladeWidth/3, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 剑脊
  ctx.beginPath();
  ctx.moveTo(x, y - bladeLength/2 - handleLength);
  ctx.lineTo(x, y + bladeLength/2 - handleLength);
  ctx.strokeStyle = '#78909C';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 戟形
export const drawJi = (ctx, x, y, size) => {
  ctx.save();
  
  // 戟的尺寸
  const halberdLength = size * 2.4;
  const bladeHeight = size * 0.8;
  const bladeWidth = size * 0.5;
  const shaftWidth = size * 0.08;
  
  // 创建戟刃渐变
  const bladeGradient = ctx.createLinearGradient(
    x, y - halberdLength/2, 
    x, y - halberdLength/2 + bladeHeight
  );
  bladeGradient.addColorStop(0, '#B0BEC5');  // 青灰色
  bladeGradient.addColorStop(0.5, '#ECEFF1'); // 亮银色
  bladeGradient.addColorStop(1, '#B0BEC5');  // 青灰色
  
  // 戟杆
  ctx.beginPath();
  ctx.rect(x - shaftWidth/2, y - halberdLength/2 + bladeHeight, shaftWidth, halberdLength - bladeHeight);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 主刃
  ctx.beginPath();
  ctx.moveTo(x, y - halberdLength/2);
  ctx.lineTo(x + bladeWidth/3, y - halberdLength/2 + bladeHeight*0.4);
  ctx.lineTo(x + bladeWidth/6, y - halberdLength/2 + bladeHeight);
  ctx.lineTo(x - bladeWidth/6, y - halberdLength/2 + bladeHeight);
  ctx.lineTo(x - bladeWidth/3, y - halberdLength/2 + bladeHeight*0.4);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 侧刃
  ctx.beginPath();
  ctx.moveTo(x, y - halberdLength/2 + bladeHeight*0.6);
  ctx.lineTo(x + bladeWidth/2, y - halberdLength/2 + bladeHeight*0.7);
  ctx.lineTo(x + bladeWidth/3, y - halberdLength/2 + bladeHeight*0.8);
  ctx.lineTo(x + bladeWidth/4, y - halberdLength/2 + bladeHeight);
  ctx.lineTo(x, y - halberdLength/2 + bladeHeight*0.9);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 反向侧刃
  ctx.beginPath();
  ctx.moveTo(x, y - halberdLength/2 + bladeHeight*0.6);
  ctx.lineTo(x - bladeWidth/2, y - halberdLength/2 + bladeHeight*0.7);
  ctx.lineTo(x - bladeWidth/3, y - halberdLength/2 + bladeHeight*0.8);
  ctx.lineTo(x - bladeWidth/4, y - halberdLength/2 + bladeHeight);
  ctx.lineTo(x, y - halberdLength/2 + bladeHeight*0.9);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 红缨
  const ribbonColor = '#D32F2F'; // 红色
  ctx.beginPath();
  const ribbonY = y - halberdLength/2 + bladeHeight;
  
  // 缨子
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI/3;
    ctx.moveTo(x, ribbonY);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * bladeWidth/2, ribbonY + bladeHeight/2,
      x + Math.cos(angle) * bladeWidth*0.7, ribbonY + bladeHeight
    );
  }
  
  ctx.strokeStyle = ribbonColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.restore();
};

// 斧形
export const drawFu = (ctx, x, y, size) => {
  ctx.save();
  
  // 斧的尺寸
  const axeLength = size * 2;
  const bladeHeight = size * 0.8;
  const bladeWidth = size * 0.6;
  const handleWidth = size * 0.1;
  
  // 创建斧刃渐变
  const bladeGradient = ctx.createLinearGradient(
    x - bladeWidth/2, y - axeLength/2 + bladeHeight/2, 
    x + bladeWidth/2, y - axeLength/2 + bladeHeight/2
  );
  bladeGradient.addColorStop(0, '#B0BEC5');  // 青灰色
  bladeGradient.addColorStop(0.5, '#ECEFF1'); // 亮银色
  bladeGradient.addColorStop(1, '#B0BEC5');  // 青灰色
  
  // 斧柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - axeLength/2, handleWidth, axeLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 斧刃 - 近似半月形
  ctx.beginPath();
  ctx.moveTo(x, y - axeLength/2 + bladeHeight/3);
  ctx.quadraticCurveTo(
    x + bladeWidth/2, y - axeLength/2 + bladeHeight/5,
    x + bladeWidth/2, y - axeLength/2 + bladeHeight/2
  );
  ctx.quadraticCurveTo(
    x + bladeWidth/2, y - axeLength/2 + bladeHeight*0.8,
    x, y - axeLength/2 + bladeHeight
  );
  ctx.quadraticCurveTo(
    x - bladeWidth/2, y - axeLength/2 + bladeHeight*0.8,
    x - bladeWidth/2, y - axeLength/2 + bladeHeight/2
  );
  ctx.quadraticCurveTo(
    x - bladeWidth/2, y - axeLength/2 + bladeHeight/5,
    x, y - axeLength/2 + bladeHeight/3
  );
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 加固环
  ctx.beginPath();
  ctx.ellipse(x, y - axeLength/2 + bladeHeight/2, handleWidth*1.5, handleWidth, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 装饰纹路
  ctx.beginPath();
  ctx.arc(x, y - axeLength/2 + bladeHeight/2, bladeHeight/4, 0, Math.PI*2);
  ctx.strokeStyle = '#78909C';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 钺形 (类似斧但更宽大威严)
export const drawYue = (ctx, x, y, size) => {
  ctx.save();
  
  // 钺的尺寸
  const axeLength = size * 2.2;
  const bladeHeight = size * 1;
  const bladeWidth = size * 0.9;
  const handleWidth = size * 0.12;
  
  // 创建钺刃渐变
  const bladeGradient = ctx.createLinearGradient(
    x - bladeWidth/2, y - axeLength/2 + bladeHeight/2, 
    x + bladeWidth/2, y - axeLength/2 + bladeHeight/2
  );
  bladeGradient.addColorStop(0, '#607D8B');  // 青蓝灰色
  bladeGradient.addColorStop(0.5, '#B0BEC5'); // 亮银蓝色
  bladeGradient.addColorStop(1, '#607D8B');  // 青蓝灰色
  
  // 钺柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - axeLength/2, handleWidth, axeLength);
  ctx.fillStyle = '#3E2723'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 钺刃 - 近似半月形但更方正
  ctx.beginPath();
  ctx.moveTo(x, y - axeLength/2 + bladeHeight/4);
  ctx.lineTo(x + bladeWidth/2, y - axeLength/2 + bladeHeight/2);
  ctx.lineTo(x + bladeWidth/3, y - axeLength/2 + bladeHeight);
  ctx.lineTo(x - bladeWidth/3, y - axeLength/2 + bladeHeight);
  ctx.lineTo(x - bladeWidth/2, y - axeLength/2 + bladeHeight/2);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 钺刃纹饰 - 古代图腾式纹路
  ctx.beginPath();
  
  // 中心纹路
  ctx.moveTo(x, y - axeLength/2 + bladeHeight/4);
  ctx.lineTo(x, y - axeLength/2 + bladeHeight);
  
  // 横向纹路
  for (let i = 1; i < 4; i++) {
    const yPos = y - axeLength/2 + bladeHeight/4 + i * (bladeHeight*0.75/4);
    ctx.moveTo(x - bladeWidth/2 + bladeWidth/10, yPos);
    ctx.lineTo(x + bladeWidth/2 - bladeWidth/10, yPos);
  }
  
  ctx.strokeStyle = '#455A64';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 加固环 - 更为华丽
  ctx.beginPath();
  ctx.ellipse(x, y - axeLength/2 + bladeHeight/2, handleWidth*2, handleWidth*1.2, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 红缨装饰
  const ribbonColor = '#C62828'; // 深红色
  ctx.beginPath();
  
  // 五条缨带
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI/6) - Math.PI/3;
    ctx.moveTo(x, y - axeLength/2 + bladeHeight);
    const endX = x + Math.cos(angle) * bladeWidth/3;
    const endY = y - axeLength/2 + bladeHeight + Math.sin(angle) * bladeHeight/2;
    
    ctx.bezierCurveTo(
      x + Math.cos(angle) * bladeWidth/6, y - axeLength/2 + bladeHeight + bladeHeight/6,
      endX - Math.cos(angle) * bladeWidth/6, endY - bladeHeight/6,
      endX, endY
    );
  }
  
  ctx.strokeStyle = ribbonColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.restore();
};

// 钩形
export const drawGou = (ctx, x, y, size) => {
  ctx.save();
  
  // 钩的尺寸
  const totalLength = size * 2.2;
  const handleWidth = size * 0.08;
  const hookLength = size * 0.6;
  const hookWidth = size * 0.3;
  
  // 创建钩刃渐变
  const hookGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + hookLength
  );
  hookGradient.addColorStop(0, '#9E9E9E');  // 银灰色
  hookGradient.addColorStop(0.5, '#E0E0E0'); // 亮银色
  hookGradient.addColorStop(1, '#9E9E9E');  // 银灰色
  
  // 钩杆
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + hookLength, handleWidth, totalLength - hookLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 钩子部分
  ctx.beginPath();
  ctx.moveTo(x, y - totalLength/2);
  ctx.lineTo(x + hookWidth/3, y - totalLength/2 + hookLength/3);
  ctx.lineTo(x + hookWidth, y - totalLength/2 + hookLength/2);
  ctx.quadraticCurveTo(
    x + hookWidth/2, y - totalLength/2 + hookLength*0.8,
    x, y - totalLength/2 + hookLength
  );
  ctx.quadraticCurveTo(
    x - hookWidth/2, y - totalLength/2 + hookLength*0.8,
    x - hookWidth, y - totalLength/2 + hookLength/2
  );
  ctx.lineTo(x - hookWidth/3, y - totalLength/2 + hookLength/3);
  ctx.closePath();
  ctx.fillStyle = hookGradient;
  ctx.fill();
  ctx.stroke();
  
  // 加固环
  ctx.beginPath();
  ctx.ellipse(x, y - totalLength/2 + hookLength, handleWidth*1.8, handleWidth, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 钩子尖刃
  ctx.beginPath();
  ctx.moveTo(x + hookWidth, y - totalLength/2 + hookLength/2);
  ctx.lineTo(x + hookWidth*1.2, y - totalLength/2 + hookLength/2 + hookWidth/2);
  ctx.lineTo(x + hookWidth, y - totalLength/2 + hookLength/2 + hookWidth);
  ctx.lineTo(x + hookWidth*0.8, y - totalLength/2 + hookLength/2 + hookWidth/2);
  ctx.closePath();
  ctx.fillStyle = hookGradient;
  ctx.fill();
  ctx.stroke();
  
  // 装饰纹路
  ctx.beginPath();
  ctx.arc(x, y - totalLength/2 + hookLength/2, hookLength/5, 0, Math.PI*2);
  ctx.strokeStyle = '#757575';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 叉形
export const drawCha = (ctx, x, y, size) => {
  ctx.save();
  
  // 叉的尺寸
  const totalLength = size * 2.5;
  const handleWidth = size * 0.08;
  const forkLength = size * 0.7;
  const forkWidth = size * 0.5;
  const tineWidth = size * 0.06;
  
  // 创建叉尖渐变
  const forkGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + forkLength
  );
  forkGradient.addColorStop(0, '#B0BEC5');  // 青灰色
  forkGradient.addColorStop(0.5, '#ECEFF1'); // 亮银色
  forkGradient.addColorStop(1, '#B0BEC5');  // 青灰色
  
  // 叉杆
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + forkLength, handleWidth, totalLength - forkLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 中间叉尖
  ctx.beginPath();
  ctx.moveTo(x, y - totalLength/2);
  ctx.lineTo(x + tineWidth/2, y - totalLength/2 + forkLength);
  ctx.lineTo(x - tineWidth/2, y - totalLength/2 + forkLength);
  ctx.closePath();
  ctx.fillStyle = forkGradient;
  ctx.fill();
  ctx.stroke();
  
  // 左侧叉尖
  ctx.beginPath();
  ctx.moveTo(x - forkWidth/2, y - totalLength/2 + forkLength/4);
  ctx.lineTo(x - forkWidth/4, y - totalLength/2 + forkLength);
  ctx.lineTo(x - forkWidth/2 - tineWidth/2, y - totalLength/2 + forkLength);
  ctx.closePath();
  ctx.fillStyle = forkGradient;
  ctx.fill();
  ctx.stroke();
  
  // 右侧叉尖
  ctx.beginPath();
  ctx.moveTo(x + forkWidth/2, y - totalLength/2 + forkLength/4);
  ctx.lineTo(x + forkWidth/4, y - totalLength/2 + forkLength);
  ctx.lineTo(x + forkWidth/2 + tineWidth/2, y - totalLength/2 + forkLength);
  ctx.closePath();
  ctx.fillStyle = forkGradient;
  ctx.fill();
  ctx.stroke();
  
  // 叉尖连接处
  ctx.beginPath();
  ctx.rect(x - forkWidth/2 - tineWidth/2, y - totalLength/2 + forkLength - tineWidth, forkWidth + tineWidth, tineWidth*2);
  ctx.fillStyle = '#795548'; // 棕色
  ctx.fill();
  ctx.stroke();
  
  // 装饰环
  ctx.beginPath();
  ctx.ellipse(x, y - totalLength/2 + forkLength + handleWidth*4, handleWidth*1.5, handleWidth, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#FFC107';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
};

// 鞭形
export const drawBian = (ctx, x, y, size) => {
  ctx.save();
  
  // 鞭的尺寸
  const whipLength = size * 1.8;
  const handleLength = size * 0.6;
  const whipWidth = size * 0.12;
  const handleWidth = size * 0.18;
  
  // 创建鞭身渐变
  const whipGradient = ctx.createLinearGradient(
    x, y - whipLength/2, 
    x, y + whipLength/2
  );
  whipGradient.addColorStop(0, '#5D4037');  // 深棕色
  whipGradient.addColorStop(0.3, '#795548');  // 棕色
  whipGradient.addColorStop(0.7, '#795548');  // 棕色
  whipGradient.addColorStop(1, '#5D4037');  // 深棕色
  
  // 鞭身 - 曲线模拟弯曲的鞭子
  ctx.beginPath();
  ctx.moveTo(x, y - whipLength/2);
  
  // 曲线模拟弯曲的鞭子
  ctx.bezierCurveTo(
    x + whipLength/3, y - whipLength/3,
    x + whipLength/4, y + whipLength/3,
    x, y + whipLength/2
  );
  
  ctx.lineWidth = whipWidth;
  ctx.strokeStyle = whipGradient;
  ctx.stroke();
  
  // 鞭梢细节
  ctx.beginPath();
  ctx.moveTo(x, y - whipLength/2);
  ctx.lineTo(x - whipWidth, y - whipLength/2 - whipWidth*2);
  ctx.lineTo(x + whipWidth, y - whipLength/2 - whipWidth);
  ctx.closePath();
  ctx.fillStyle = '#3E2723'; // 深褐色
  ctx.fill();
  
  // 鞭柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y + whipLength/2, handleWidth, handleLength);
  ctx.fillStyle = '#3E2723'; // 深褐色鞭柄
  ctx.fill();
  ctx.stroke();
  
  // 鞭柄纹路
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    const yPos = y + whipLength/2 + i * (handleLength / 5);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 鞭拍细节
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const t = i / 2; // 参数从0到1
    const xPos = x + whipLength/3 * (1-t) + (x + whipLength/4) * t;
    const yPos = y - whipLength/3 * (1-t) + (y + whipLength/3) * t;
    
    ctx.moveTo(xPos, yPos);
    ctx.lineTo(xPos + whipWidth/2, yPos + whipWidth);
  }
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 锏形
export const drawJian2 = (ctx, x, y, size) => {
  ctx.save();
  
  // 锏的尺寸
  const totalLength = size * 2;
  const bladeLength = size * 1.2;
  const handleLength = totalLength - bladeLength;
  const maceWidth = size * 0.18;
  const handleWidth = size * 0.12;
  
  // 创建锏身渐变
  const maceGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + bladeLength
  );
  maceGradient.addColorStop(0, '#5D6D7E');  // 青铁色
  maceGradient.addColorStop(0.5, '#85939E'); // 亮铁色
  maceGradient.addColorStop(1, '#5D6D7E');  // 青铁色
  
  // 锏柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + bladeLength, handleWidth, handleLength);
  ctx.fillStyle = '#3E2723'; // 深褐色
  ctx.fill();
  ctx.stroke();
  
  // 锏身 - 多棱形
  ctx.beginPath();
  
  // 创建一个六边形的锏身
  const sideCount = 6;
  const sectionCount = 5; // 锏身分几段
  
  for (let j = 0; j < sectionCount; j++) {
    const sectionLength = bladeLength / sectionCount;
    const sectionY = y - totalLength/2 + j * sectionLength;
    const nextSectionY = y - totalLength/2 + (j + 1) * sectionLength;
    
    // 每一段的宽度，中间宽两端窄
    let sectionWidth = maceWidth;
    if (j === 0 || j === sectionCount - 1) {
      sectionWidth = maceWidth * 0.7;
    } else if (j === 1 || j === sectionCount - 2) {
      sectionWidth = maceWidth * 0.9;
    }
    
    // 绘制每一段的六边形
    ctx.beginPath();
    for (let i = 0; i < sideCount; i++) {
      const angle = (i / sideCount) * Math.PI * 2;
      const nextAngle = ((i + 1) / sideCount) * Math.PI * 2;
      
      // 当前段的顶点
      const x1 = x + Math.cos(angle) * sectionWidth / 2;
      const y1 = sectionY;
      
      // 下一段对应的顶点
      const x2 = x + Math.cos(nextAngle) * sectionWidth / 2;
      const y2 = sectionY;
      
      // 连接顶点
      if (i === 0) {
        ctx.moveTo(x1, y1);
      } else {
        ctx.lineTo(x1, y1);
      }
      ctx.lineTo(x2, y2);
    }
    
    // 连接到下一段
    ctx.lineTo(x + Math.cos(0) * sectionWidth / 2, nextSectionY);
    
    ctx.closePath();
    ctx.fillStyle = maceGradient;
    ctx.fill();
    ctx.stroke();
  }
  
  // 锏身菱形纹饰
  for (let j = 0; j < sectionCount; j++) {
    const sectionLength = bladeLength / sectionCount;
    const sectionY = y - totalLength/2 + j * sectionLength + sectionLength/2;
    
    ctx.beginPath();
    ctx.arc(x, sectionY, maceWidth/6, 0, Math.PI*2);
    ctx.fillStyle = '#FFC107'; // 金色
    ctx.fill();
    ctx.stroke();
  }
  
  // 锏柄纹路
  ctx.beginPath();
  for (let i = 1; i < 4; i++) {
    const yPos = y - totalLength/2 + bladeLength + i * (handleLength / 4);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 护手
  ctx.beginPath();
  ctx.rect(x - maceWidth/2, y - totalLength/2 + bladeLength, maceWidth, handleWidth/2);
  ctx.fillStyle = '#D4AF37'; // 金色
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};

// 锤形
export const drawChui = (ctx, x, y, size) => {
  ctx.save();
  
  // 锤的尺寸
  const totalLength = size * 2.2;
  const hammerLength = size * 0.7;
  const hammerWidth = size * 0.6;
  const hammerHeight = size * 0.5;
  const handleWidth = size * 0.1;
  
  // 创建锤身渐变
  const hammerGradient = ctx.createLinearGradient(
    x - hammerWidth/2, y - totalLength/2 + hammerHeight/2, 
    x + hammerWidth/2, y - totalLength/2 + hammerHeight/2
  );
  hammerGradient.addColorStop(0, '#455A64');  // 深青灰色
  hammerGradient.addColorStop(0.5, '#78909C'); // 亮青灰色
  hammerGradient.addColorStop(1, '#455A64');  // 深青灰色
  
  // 锤柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + hammerHeight, handleWidth, totalLength - hammerHeight);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 锤头 - 方形
  ctx.beginPath();
  ctx.rect(x - hammerWidth/2, y - totalLength/2, hammerWidth, hammerHeight);
  ctx.fillStyle = hammerGradient;
  ctx.fill();
  ctx.stroke();
  
  // 锤头纹饰
  ctx.beginPath();
  
  // 横向纹路
  for (let i = 1; i < 3; i++) {
    const yPos = y - totalLength/2 + i * (hammerHeight / 3);
    ctx.moveTo(x - hammerWidth/2, yPos);
    ctx.lineTo(x + hammerWidth/2, yPos);
  }
  
  // 纵向纹路
  for (let i = 1; i < 3; i++) {
    const xPos = x - hammerWidth/2 + i * (hammerWidth / 3);
    ctx.moveTo(xPos, y - totalLength/2);
    ctx.lineTo(xPos, y - totalLength/2 + hammerHeight);
  }
  
  ctx.strokeStyle = '#37474F';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 加固环
  ctx.beginPath();
  ctx.rect(x - hammerWidth/4, y - totalLength/2 + hammerHeight, hammerWidth/2, handleWidth*1.5);
  ctx.fillStyle = '#D4AF37'; // 金色
  ctx.fill();
  ctx.stroke();
  
  // 锤柄纹路
  ctx.beginPath();
  for (let i = 1; i < 6; i++) {
    const yPos = y - totalLength/2 + hammerHeight + handleWidth*1.5 + i * ((totalLength - hammerHeight - handleWidth*1.5) / 6);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 抓形
export const drawZhua = (ctx, x, y, size) => {
  ctx.save();
  
  // 抓的尺寸
  const totalLength = size * 1.8;
  const clawLength = size * 0.7;
  const clawWidth = size * 0.8;
  const handleLength = totalLength - clawLength;
  const handleWidth = size * 0.15;
  const fingerCount = 3; // 抓子数量
  
  // 创建抓刃渐变
  const clawGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + clawLength
  );
  clawGradient.addColorStop(0, '#9E9E9E');  // 银灰色
  clawGradient.addColorStop(0.5, '#E0E0E0'); // 亮银色
  clawGradient.addColorStop(1, '#9E9E9E');  // 银灰色
  
  // 抓柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + clawLength, handleWidth, handleLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 抓子基座
  ctx.beginPath();
  ctx.rect(x - clawWidth/3, y - totalLength/2 + clawLength - handleWidth, clawWidth*2/3, handleWidth);
  ctx.fillStyle = '#795548'; // 褐色
  ctx.fill();
  ctx.stroke();
  
  // 抓子 (3个弯曲的爪)
  for (let i = 0; i < fingerCount; i++) {
    const angle = (i / fingerCount) * Math.PI - Math.PI/2.5;
    
    ctx.beginPath();
    ctx.moveTo(x, y - totalLength/2 + clawLength - handleWidth);
    
    // 曲线模拟弯曲的爪子
    const controlX1 = x + Math.cos(angle) * clawWidth*0.3;
    const controlY1 = y - totalLength/2 + clawLength*0.4;
    
    const controlX2 = x + Math.cos(angle) * clawWidth*0.5;
    const controlY2 = y - totalLength/2 + clawLength*0.2;
    
    const endX = x + Math.cos(angle) * clawWidth*0.4;
    const endY = y - totalLength/2;
    
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    
    // 绘制爪子的宽度
    ctx.lineWidth = handleWidth*0.6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = clawGradient;
    ctx.stroke();
    
    // 爪尖
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX + Math.cos(angle-Math.PI/4) * handleWidth*0.8, endY + Math.sin(angle-Math.PI/4) * handleWidth*0.8);
    ctx.lineWidth = handleWidth*0.3;
    ctx.strokeStyle = '#757575';
    ctx.stroke();
  }
  
  // 加固环
  ctx.beginPath();
  ctx.ellipse(x, y - totalLength/2 + clawLength + handleWidth*2, handleWidth*1.2, handleWidth*0.8, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 柄部纹路
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    const yPos = y - totalLength/2 + clawLength + handleWidth*3 + i * ((handleLength - handleWidth*3) / 5);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 镗形
export const drawTang = (ctx, x, y, size) => {
  ctx.save();
  
  // 镗的尺寸
  const totalLength = size * 2.4;
  const bladeLength = size * 0.8;
  const bladeWidth = size * 0.3;
  const handleWidth = size * 0.08;
  
  // 创建镗身渐变
  const bladeGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + bladeLength
  );
  bladeGradient.addColorStop(0, '#9E9E9E');  // 银灰色
  bladeGradient.addColorStop(0.5, '#E0E0E0'); // 亮银色
  bladeGradient.addColorStop(1, '#9E9E9E');  // 银灰色
  
  // 镗杆
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + bladeLength, handleWidth, totalLength - bladeLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 镗尖 - 尖形状
  ctx.beginPath();
  ctx.moveTo(x, y - totalLength/2);
  ctx.lineTo(x + bladeWidth/6, y - totalLength/2 + bladeLength/2);
  ctx.lineTo(x + bladeWidth/2, y - totalLength/2 + bladeLength);
  ctx.lineTo(x - bladeWidth/2, y - totalLength/2 + bladeLength);
  ctx.lineTo(x - bladeWidth/6, y - totalLength/2 + bladeLength/2);
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 镗身锋刃（两侧）
  ctx.beginPath();
  // 左侧锋刃
  ctx.moveTo(x - bladeWidth/6, y - totalLength/2 + bladeLength/4);
  ctx.lineTo(x - bladeWidth/2 - bladeWidth/4, y - totalLength/2 + bladeLength/2);
  ctx.lineTo(x - bladeWidth/6, y - totalLength/2 + bladeLength*3/4);
  
  // 右侧锋刃
  ctx.moveTo(x + bladeWidth/6, y - totalLength/2 + bladeLength/4);
  ctx.lineTo(x + bladeWidth/2 + bladeWidth/4, y - totalLength/2 + bladeLength/2);
  ctx.lineTo(x + bladeWidth/6, y - totalLength/2 + bladeLength*3/4);
  
  ctx.strokeStyle = bladeGradient;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 加固环
  ctx.beginPath();
  ctx.ellipse(x, y - totalLength/2 + bladeLength + handleWidth*2, handleWidth*1.5, handleWidth, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 镗柄纹路
  ctx.beginPath();
  for (let i = 1; i < 8; i++) {
    const yPos = y - totalLength/2 + bladeLength + handleWidth*3 + i * ((totalLength - bladeLength - handleWidth*3) / 8);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
};

// 棍形
export const drawGun = (ctx, x, y, size) => {
  ctx.save();
  
  // 棍的尺寸
  const staffLength = size * 2.5;
  const staffWidth = size * 0.1;
  
  // 创建棍身渐变
  const staffGradient = ctx.createLinearGradient(
    x, y - staffLength/2, 
    x, y + staffLength/2
  );
  staffGradient.addColorStop(0, '#5D4037');  // 深棕色
  staffGradient.addColorStop(0.3, '#795548');  // 棕色
  staffGradient.addColorStop(0.7, '#795548');  // 棕色
  staffGradient.addColorStop(1, '#5D4037');  // 深棕色
  
  // 棍身
  ctx.beginPath();
  ctx.rect(x - staffWidth/2, y - staffLength/2, staffWidth, staffLength);
  ctx.fillStyle = staffGradient;
  ctx.fill();
  ctx.stroke();
  
  // 棍头缠绕物
  ctx.beginPath();
  ctx.rect(x - staffWidth*0.7, y - staffLength/2, staffWidth*1.4, staffWidth*2);
  ctx.fillStyle = '#D4AF37'; // 金色
  ctx.fill();
  ctx.stroke();
  
  // 棍底缠绕物
  ctx.beginPath();
  ctx.rect(x - staffWidth*0.7, y + staffLength/2 - staffWidth*2, staffWidth*1.4, staffWidth*2);
  ctx.fillStyle = '#D4AF37'; // 金色
  ctx.fill();
  ctx.stroke();
  
  // 棍身纹路
  ctx.beginPath();
  for (let i = 1; i < 10; i++) {
    const yPos = y - staffLength/2 + staffWidth*3 + i * ((staffLength - staffWidth*6) / 10);
    ctx.moveTo(x - staffWidth/2, yPos);
    ctx.lineTo(x + staffWidth/2, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // 装饰线条
  ctx.beginPath();
  ctx.moveTo(x, y - staffLength/2 + staffWidth*2);
  ctx.lineTo(x, y + staffLength/2 - staffWidth*2);
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  ctx.restore();
};

// 槊形
export const drawShuo = (ctx, x, y, size) => {
  ctx.save();
  
  // 槊的尺寸
  const totalLength = size * 2.6;
  const bladeLength = size * 0.9;
  const bladeWidth = size * 0.4;
  const handleWidth = size * 0.08;
  
  // 创建槊刃渐变
  const bladeGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + bladeLength
  );
  bladeGradient.addColorStop(0, '#B0BEC5');  // 青灰色
  bladeGradient.addColorStop(0.5, '#ECEFF1'); // 亮银色
  bladeGradient.addColorStop(1, '#B0BEC5');  // 青灰色
  
  // 槊杆
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + bladeLength, handleWidth, totalLength - bladeLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 槊刃主体 - 叶状
  ctx.beginPath();
  ctx.moveTo(x, y - totalLength/2);
  
  // 右弧线
  ctx.quadraticCurveTo(
    x + bladeWidth/2, y - totalLength/2 + bladeLength*0.4,
    x + bladeWidth/3, y - totalLength/2 + bladeLength
  );
  
  // 底部
  ctx.lineTo(x - bladeWidth/3, y - totalLength/2 + bladeLength);
  
  // 左弧线
  ctx.quadraticCurveTo(
    x - bladeWidth/2, y - totalLength/2 + bladeLength*0.4,
    x, y - totalLength/2
  );
  
  ctx.closePath();
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.stroke();
  
  // 槊刃中脊
  ctx.beginPath();
  ctx.moveTo(x, y - totalLength/2);
  ctx.lineTo(x, y - totalLength/2 + bladeLength);
  ctx.strokeStyle = '#78909C';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 侧刃装饰
  ctx.beginPath();
  
  // 左侧装饰
  for (let i = 1; i < 4; i++) {
    const yPos = y - totalLength/2 + bladeLength * i/4;
    ctx.moveTo(x, yPos);
    ctx.lineTo(x - bladeWidth/4, yPos);
  }
  
  // 右侧装饰
  for (let i = 1; i < 4; i++) {
    const yPos = y - totalLength/2 + bladeLength * i/4;
    ctx.moveTo(x, yPos);
    ctx.lineTo(x + bladeWidth/4, yPos);
  }
  
  ctx.strokeStyle = '#78909C';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // 加固环
  ctx.beginPath();
  ctx.ellipse(x, y - totalLength/2 + bladeLength + handleWidth*2, handleWidth*1.5, handleWidth, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 红缨
  const ribbonColor = '#D32F2F'; // 红色
  ctx.beginPath();
  const ribbonY = y - totalLength/2 + bladeLength;
  
  // 缨子
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI/3) - Math.PI/2;
    ctx.moveTo(x, ribbonY);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * bladeWidth/3, ribbonY + bladeLength/3,
      x + Math.cos(angle) * bladeWidth/2, ribbonY + bladeLength/2
    );
  }
  
  ctx.strokeStyle = ribbonColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.restore();
};

// 棒形
export const drawBang = (ctx, x, y, size) => {
  ctx.save();
  
  // 棒的尺寸
  const totalLength = size * 2.2;
  const clubLength = size * 1;
  const handleLength = totalLength - clubLength;
  const clubWidth = size * 0.25;
  const handleWidth = size * 0.15;
  
  // 创建棒身渐变
  const clubGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y - totalLength/2 + clubLength
  );
  clubGradient.addColorStop(0, '#5D4037');  // 深棕色
  clubGradient.addColorStop(0.5, '#8D6E63'); // 亮棕色
  clubGradient.addColorStop(1, '#5D4037');  // 深棕色
  
  // 棒柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + clubLength, handleWidth, handleLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 棒身 - 长条形
  ctx.beginPath();
  // 绘制一个略成锥形的棒身
  ctx.moveTo(x - clubWidth*0.4, y - totalLength/2);
  ctx.lineTo(x + clubWidth*0.4, y - totalLength/2);
  ctx.lineTo(x + clubWidth/2, y - totalLength/2 + clubLength);
  ctx.lineTo(x - clubWidth/2, y - totalLength/2 + clubLength);
  ctx.closePath();
  ctx.fillStyle = clubGradient;
  ctx.fill();
  ctx.stroke();
  
  // 棒身纹理 - 横向金属环
  for (let i = 1; i < 5; i++) {
    const yPos = y - totalLength/2 + i * (clubLength / 5);
    const radius = clubWidth/2 - (clubWidth*0.1) * (i / 5);
    
    ctx.beginPath();
    ctx.moveTo(x - radius, yPos);
    ctx.lineTo(x + radius, yPos);
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // 棒柄纹路
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    const yPos = y - totalLength/2 + clubLength + i * (handleLength / 5);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 棒身钉刺 (装饰)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI * 2;
      const yPos = y - totalLength/2 + (i+1) * (clubLength / 4);
      const radius = clubWidth/2 - (clubWidth*0.1) * (yPos - (y - totalLength/2)) / clubLength;
      
      const spikeX = x + Math.cos(angle) * radius;
      const spikeY = yPos;
      
      ctx.beginPath();
      ctx.moveTo(spikeX, spikeY);
      ctx.lineTo(spikeX + Math.cos(angle) * (clubWidth*0.15), spikeY);
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(spikeX + Math.cos(angle) * (clubWidth*0.15), spikeY, clubWidth*0.05, 0, Math.PI*2);
      ctx.fillStyle = '#3E2723';
      ctx.fill();
    }
  }
  
  ctx.restore();
};

// 拐形
export const drawGuai = (ctx, x, y, size) => {
  ctx.save();
  
  // 拐的尺寸
  const totalLength = size * 2;
  const hookLength = size * 0.7;
  const handleWidth = size * 0.12;
  
  // 创建拐渐变
  const crookGradient = ctx.createLinearGradient(
    x, y - totalLength/2, 
    x, y + totalLength/2
  );
  crookGradient.addColorStop(0, '#5D4037');  // 深棕色
  crookGradient.addColorStop(0.5, '#8D6E63'); // 亮棕色
  crookGradient.addColorStop(1, '#5D4037');  // 深棕色
  
  // 拐杖主干
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y - totalLength/2 + hookLength, handleWidth, totalLength - hookLength);
  ctx.fillStyle = crookGradient;
  ctx.fill();
  ctx.stroke();
  
  // 拐杖弯钩部分
  ctx.beginPath();
  ctx.moveTo(x, y - totalLength/2 + hookLength);
  
  // 弯钩曲线
  ctx.quadraticCurveTo(
    x - hookLength/2, y - totalLength/2 + hookLength/2,
    x - hookLength, y - totalLength/2 + hookLength/2
  );
  
  ctx.quadraticCurveTo(
    x - hookLength*1.2, y - totalLength/2 + hookLength/2,
    x - hookLength*1.1, y - totalLength/2
  );
  
  ctx.lineWidth = handleWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = crookGradient;
  ctx.stroke();
  
  // 拐杖纹理 - 横向纹路
  for (let i = 1; i < 8; i++) {
    const yPos = y - totalLength/2 + hookLength + i * ((totalLength - hookLength) / 8);
    ctx.beginPath();
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
    ctx.strokeStyle = '#4E342E';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  
  // 拐杖底部金属帽
  ctx.beginPath();
  ctx.rect(x - handleWidth*0.7, y + totalLength/2 - handleWidth, handleWidth*1.4, handleWidth);
  ctx.fillStyle = '#D4AF37'; // 金色
  ctx.fill();
  ctx.stroke();
  
  // 钩部装饰带
  const bandY = y - totalLength/2 + hookLength/2;
  ctx.beginPath();
  ctx.arc(x - hookLength, bandY, handleWidth*0.8, 0, Math.PI*2);
  ctx.fillStyle = '#D4AF37'; // 金色
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};

// 流星锤形
export const drawLiuxingchui = (ctx, x, y, size) => {
  ctx.save();
  
  // 流星锤的尺寸
  const chainLength = size * 1.2;
  const ballRadius = size * 0.3;
  const handleLength = size * 0.7;
  const handleWidth = size * 0.1;
  const spikeLength = size * 0.15;
  
  // 创建锤球渐变
  const ballGradient = ctx.createRadialGradient(
    x, y - chainLength - ballRadius, 0,
    x, y - chainLength - ballRadius, ballRadius
  );
  ballGradient.addColorStop(0, '#757575');  // 银灰色
  ballGradient.addColorStop(0.7, '#9E9E9E'); // 亮银色
  ballGradient.addColorStop(1, '#616161');  // 深银灰色
  
  // 手柄
  ctx.beginPath();
  ctx.rect(x - handleWidth/2, y, handleWidth, handleLength);
  ctx.fillStyle = '#5D4037'; // 深棕色
  ctx.fill();
  ctx.stroke();
  
  // 铁链
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - chainLength);
  
  // 用小线段模拟链条
  const linkCount = 12;
  const linkLength = chainLength / linkCount;
  
  for (let i = 0; i < linkCount; i++) {
    const linkY = y - i * linkLength;
    
    // 左侧链环
    ctx.moveTo(x, linkY);
    ctx.lineTo(x - handleWidth/3, linkY - linkLength/2);
    ctx.lineTo(x, linkY - linkLength);
    
    // 右侧链环
    ctx.moveTo(x, linkY);
    ctx.lineTo(x + handleWidth/3, linkY - linkLength/2);
    ctx.lineTo(x, linkY - linkLength);
  }
  
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 流星锤球体
  ctx.beginPath();
  ctx.arc(x, y - chainLength - ballRadius, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballGradient;
  ctx.fill();
  ctx.stroke();
  
  // 流星锤刺
  const spikeCount = 12;
  for (let i = 0; i < spikeCount; i++) {
    const angle = (i / spikeCount) * Math.PI * 2;
    
    ctx.beginPath();
    ctx.moveTo(
      x + Math.cos(angle) * ballRadius,
      y - chainLength - ballRadius + Math.sin(angle) * ballRadius
    );
    ctx.lineTo(
      x + Math.cos(angle) * (ballRadius + spikeLength),
      y - chainLength - ballRadius + Math.sin(angle) * (ballRadius + spikeLength)
    );
    ctx.strokeStyle = '#616161';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // 手柄纹路
  ctx.beginPath();
  for (let i = 1; i < 6; i++) {
    const yPos = y + i * (handleLength / 6);
    ctx.moveTo(x - handleWidth/2, yPos);
    ctx.lineTo(x + handleWidth/2, yPos);
  }
  ctx.strokeStyle = '#4E342E';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // 手柄底部
  ctx.beginPath();
  ctx.rect(x - handleWidth*0.7, y + handleLength - handleWidth, handleWidth*1.4, handleWidth);
  ctx.fillStyle = '#8D6E63'; // 棕色
  ctx.fill();
  ctx.stroke();
  
  // 链条与锤球连接环
  ctx.beginPath();
  ctx.ellipse(x, y - chainLength, handleWidth*0.8, handleWidth*0.5, 0, 0, Math.PI*2);
  ctx.strokeStyle = '#757575';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.restore();
};