export const SITE = Object.freeze({
  title: 'Sakikoの博客',
  description: '一个热爱ACGN的程序员小窝',
  author: 'Sakiko',
  origin: 'https://sakikoblog.info',
  base: '/',
  repository: 'a3292334877-star/blog',
})

export const SITE_URL = `${SITE.origin}${SITE.base.replace(/\/$/, '')}`

export function absoluteUrl(pathname = '') {
  const path = String(pathname).replace(/^\/+/, '')
  return path ? `${SITE_URL}/${path}` : `${SITE_URL}/`
}

export function absoluteAsset(pathname = '') {
  return `${SITE.origin}/${String(pathname).replace(/^\/+/, '')}`
}

/**
 * 把矢量封面映射到脚本光栅化出的社交分享图。
 *
 * 社交平台的爬虫不渲染 SVG，所以 /covers/<name>.svg 统一改用
 * /og/<name>.webp（由 scripts/generate-og-images.mjs 生成）。
 * 其它路径原样返回，rasterized 表示是否为生成出来的分享图。
 */
export function toSocialImage(pathname) {
  const value = String(pathname ?? '')
  const match = /^\/covers\/(.+)\.svg$/.exec(value)
  if (!match) return { path: value, rasterized: false }
  return { path: `/og/${match[1]}.webp`, rasterized: true }
}
