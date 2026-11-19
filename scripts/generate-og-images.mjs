/**
 * 社交分享图（og:image）生成器
 *
 * 文章封面是程序化生成的 SVG，页面里用体积小、清晰的矢量版本最合适；
 * 但微信 / X / Facebook / LinkedIn 等平台的爬虫都不渲染 SVG 预览图，
 * 分享链接时只会显示纯文字。所以这里把封面光栅化成 1200×630 的 WebP，
 * 专供 og:image / twitter:image 使用。
 */
import fs from 'node:fs'
import path from 'node:path'

const COVER_DIR = path.join(process.cwd(), 'public/covers')
const OUT_DIR = path.join(process.cwd(), 'public/og')
const WIDTH = 1200
const HEIGHT = 630
const QUALITY = 82

/**
 * 站点默认分享图：栏目页没有文章封面时回退到这张品牌卡片，
 * 避免 /posts/、/tags/、/about/ 等页面分享出去只剩纯文字。
 */
const SITE_OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="'Noto Sans SC','Microsoft YaHei','PingFang SC',sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffc2d1"/>
      <stop offset="0.55" stop-color="#e4596f"/>
      <stop offset="1" stop-color="#7d3f52"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1e151d" stop-opacity="0.52"/>
      <stop offset="0.7" stop-color="#1e151d" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#1e151d" stop-opacity="0.34"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#fff" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1090" cy="120" r="230" fill="#fff" opacity="0.07"/>
  <circle cx="150" cy="590" r="300" fill="#fff" opacity="0.05"/>
  <text x="80" y="96" font-size="18" font-weight="700" letter-spacing="4" fill="#fff" opacity="0.82">SAKIKO / FIELD NOTES</text>
  <line x1="80" y1="124" x2="1120" y2="124" stroke="#fff" stroke-opacity="0.28"/>
  <text x="80" y="300" font-size="82" font-weight="800" fill="#fff">Sakiko の博客</text>
  <text x="80" y="372" font-size="30" fill="#fff" opacity="0.9">记录学习、项目与 ACGN 日常</text>
  <text x="80" y="530" font-size="20" letter-spacing="2" fill="#fff" opacity="0.78">sakikoblog.info</text>
</svg>`

async function writeSiteOgImage(sharp) {
  const target = path.join(OUT_DIR, 'site.webp')
  const scriptMtime = fs.statSync(import.meta.filename).mtimeMs
  if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= scriptMtime) return 0
  await sharp(Buffer.from(SITE_OG_SVG), { density: 200 })
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .webp({ quality: QUALITY })
    .toFile(target)
  return 1
}

async function main() {
  // sharp 是原生依赖，个别环境可能装不上；此时仓库里已有的分享图仍可正常使用，
  // 因此只提示并跳过，不让整个构建失败。
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn('  ⚠ 未安装 sharp，跳过社交分享图生成（沿用仓库中已有的图片）')
    return
  }

  if (!fs.existsSync(COVER_DIR)) {
    console.error('缺少 public/covers 目录，无法生成社交分享图')
    process.exitCode = 1
    return
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const covers = fs.readdirSync(COVER_DIR).filter((file) => file.endsWith('.svg'))
  let built = 0
  let skipped = 0

  for (const file of covers) {
    const source = path.join(COVER_DIR, file)
    const target = path.join(OUT_DIR, `${file.replace(/\.svg$/, '')}.webp`)

    // 封面没变就跳过，避免每次 build 都重新光栅化。
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) {
      skipped += 1
      continue
    }

    await sharp(source, { density: 200 })
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
      .webp({ quality: QUALITY })
      .toFile(target)
    built += 1
  }

  const siteBuilt = await writeSiteOgImage(sharp)
  const total = covers.length + 1
  const updated = built + siteBuilt
  console.log(`  ✓ 社交分享图生成完成: ${updated} 张更新, ${total - updated} 张跳过 (共 ${total} 张)`)
}

main().catch((error) => {
  console.error('社交分享图生成失败:', error)
  process.exitCode = 1
})
