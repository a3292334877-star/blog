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

  console.log(`  ✓ 社交分享图生成完成: ${built} 张更新, ${skipped} 张跳过 (共 ${covers.length} 张)`)
}

main().catch((error) => {
  console.error('社交分享图生成失败:', error)
  process.exitCode = 1
})
