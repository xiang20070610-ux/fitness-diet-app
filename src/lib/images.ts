/**
 * 统一图片解析入口 —— 所有图片都经由此函数取 URL。
 * 当前：直接返回传入的 URL（为空则返回空串，DishImage 据此回退到 emoji 占位）。
 * 后续替换：给各菜谱的 image / stepImages 字段填入真实 URL 即可；
 * 如需接入生成图 API，只需在这里按 id 拼出真实地址，例如：
 *   return src ?? getDishImage(id)
 * 布局与样式无需改动。
 */
export function resolveImage(src?: string | null): string {
  return src ?? ''
}

/** 预留：按菜品 id 获取图片 URL（未来接入生成图 API 时实现） */
export function getDishImage(_dishId: string): string {
  return ''
}
