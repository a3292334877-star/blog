/**
 * 文章相关的纯函数。
 *
 * 不依赖 Node API，因此构建脚本（config / RSS / 数据加载器）和浏览器端
 * 的 Layout.vue 都可以复用同一套规则，避免类型推断等逻辑各写一份。
 */

export function inferPostType(tags = [], title = '') {
  const key = `${title} ${tags.join(' ')}`
  if (/项目/.test(key)) return '个人项目'
  if (/真题|专插本|考点|考试/.test(key)) return '资料整理'
  if (/教程|指南|入门|技巧|基础|学习/.test(key)) return '教程'
  if (/随笔|生活|日常/.test(key)) return '随笔'
  return '学习笔记'
}

export function toPlainText(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function estimateReadingTime(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_|~-]/g, ' ')
  const cjkCount = (plain.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length
  const wordCount = (plain.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  return Math.max(1, Math.ceil(cjkCount / 300 + wordCount / 200))
}
