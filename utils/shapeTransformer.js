/**
 * 形状变换工具函数
 * 用于在Canvas上对形状应用各种变换（如旋转、翻转等）
 */

/**
 * 应用变换到Canvas上下文
 * @param {CanvasRenderingContext2D} ctx - Canvas绘图上下文
 * @param {number} centerX - 变换中心X坐标
 * @param {number} centerY - 变换中心Y坐标
 * @param {Object} transform - 变换参数对象
 * @param {number} transform.rotation - 旋转角度（度）
 * @param {boolean} transform.flipX - 是否水平翻转
 * @param {boolean} transform.flipY - 是否垂直翻转
 * @param {number} transform.size - 形状大小（可选）
 */
export const applyTransform = (ctx, centerX, centerY, transform) => {
  // 将原点移动到变换中心
  ctx.translate(centerX, centerY);
  
  // 应用水平和垂直翻转（如果需要）
  const scaleX = transform.flipX ? -1 : 1;
  const scaleY = transform.flipY ? -1 : 1;
  if (scaleX !== 1 || scaleY !== 1) {
    ctx.scale(scaleX, scaleY);
  }
  
  // 应用旋转（如果需要）
  // 将度转换为弧度：弧度 = 度 * (Math.PI / 180)
  if (transform.rotation) {
    const angle = transform.rotation * (Math.PI / 180);
    ctx.rotate(angle);
  }
  
  // 将原点移回去是不必要的，因为后续会调用ctx.restore()恢复状态
};

/**
 * 获取变换后的边界框
 * 用于计算形状变换后的实际边界
 * @param {number} width - 原始宽度
 * @param {number} height - 原始高度
 * @param {Object} transform - 变换参数
 * @returns {Object} - 变换后的边界信息 {width, height}
 */
export const getTransformedBounds = (width, height, transform) => {
  const { rotation = 0 } = transform;
  
  // 如果没有旋转，边界不变（忽略翻转，因为翻转不改变尺寸）
  if (rotation % 90 !== 0) {
    // 对于非90度的旋转，计算旋转后的边界
    const radians = Math.abs(rotation * (Math.PI / 180));
    const newWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
    const newHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));
    return { width: newWidth, height: newHeight };
  }
  
  // 对于90度的倍数，宽高可能互换
  if (Math.abs(rotation) % 180 === 90) {
    return { width: height, height: width };
  }
  
  // 对于180度的倍数，尺寸不变
  return { width, height };
}; 