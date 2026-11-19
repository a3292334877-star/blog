/**
 * 生成「轻译」PWA 图标。
 *
 * 纯几何图形（⇄ 交换箭头），不依赖任何字体，因此在 Windows / Linux
 * 上生成结果一致。图标提交进仓库，只有修改设计时才需要重新运行：
 *
 *   node scripts/generate-pwa-icons.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT_DIR = path.join(process.cwd(), 'public/translate/icons')

function iconSvg(rounded) {
  const radius = rounded ? 112 : 0
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f49a7f"/>
      <stop offset="0.55" stop-color="#df6b52"/>
      <stop offset="1" stop-color="#b0452f"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="url(#bg)"/>
  <circle cx="92" cy="92" r="150" fill="#fff" opacity="0.09"/>
  <circle cx="438" cy="430" r="170" fill="#fff" opacity="0.07"/>
  <g fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 208 H344"/>
    <path d="M306 166 L350 208 L306 250"/>
    <path d="M362 304 H168"/>
    <path d="M206 262 L162 304 L206 346"/>
  </g>
</svg>`
}

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn('  ⚠ 未安装 sharp，跳过 PWA 图标生成')
    return
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const targets = [
    { file: 'icon-192.png', size: 192, rounded: true },
    { file: 'icon-512.png', size: 512, rounded: true },
    { file: 'icon-maskable-512.png', size: 512, rounded: false },
    { file: 'apple-touch-icon.png', size: 180, rounded: false },
  ]

  for (const { file, size, rounded } of targets) {
    await sharp(Buffer.from(iconSvg(rounded)), { density: 384 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, file))
  }

  console.log(`  ✓ PWA 图标生成完成 (${targets.length} 个)`)
}

main().catch((error) => {
  console.error('PWA 图标生成失败:', error)
  process.exitCode = 1
})
