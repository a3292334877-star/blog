export const SITE = Object.freeze({
  title: 'Sakikoの博客',
  description: '一个热爱ACGN的程序员小窝',
  author: 'Sakiko',
  origin: 'https://a3292334877-star.github.io',
  base: '/blog/',
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
