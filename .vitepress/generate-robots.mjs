/**
 * 生成 robots.txt。
 *
 * 站点域名统一来自 site.constants.mjs，避免换域名时 robots.txt 与 sitemap
 * 指向不同地址。在 vitepress build 之后运行，写入 dist。
 */
import fs from 'node:fs'
import path from 'node:path'
import { SITE } from './site.constants.mjs'

const dist = path.join(process.cwd(), '.vitepress/dist')

fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`,
)
console.log('  ✓ robots.txt generated')
