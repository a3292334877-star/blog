/**
 * 主题化 SVG 封面生成器
 * 为每篇文章生成独一无二的 SVG 封面，永不 404，与樱花主题统一
 *
 * 用法：node scripts/generate-covers.mjs
 * 已接入 package.json 的 dev / build 钩子
 */
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const OUT_DIR = path.join(process.cwd(), 'public/covers')

/**
 * 封面配置：每篇文章一个独立主题
 * gradient: 背景双色对角渐变
 * emoji:    中央大图标
 * subtitle: 副标题（分类/标签）
 */
const COVERS = [
  {
    slug: 'hello-world',
    title: '你好，世界',
    subtitle: '博客开篇 · 生活',
    gradient: ['#ffb7c5', '#ffe4b5'],
    emoji: '🌸',
  },
  {
    slug: 'markdown-guide',
    title: 'Markdown 写作指南',
    subtitle: '教程 · 写作',
    gradient: ['#74c7ec', '#89b4fa'],
    emoji: '✍️',
  },
  {
    slug: 'linux-tips',
    title: 'Linux 常用操作技巧',
    subtitle: '教程 · Linux',
    gradient: ['#45474f', '#7f8c8d'],
    emoji: '🐧',
  },
  {
    slug: 'git-tips',
    title: 'Git 入门与实用技巧',
    subtitle: '教程 · Git',
    gradient: ['#f39c12', '#e74c3c'],
    emoji: '🔀',
  },
  {
    slug: 'hashmap-in-cpp',
    title: 'C++ 哈希 Map 应用与竞赛技巧',
    subtitle: '教程 · C++ · 算法',
    gradient: ['#9b59b6', '#6c5ce7'],
    emoji: '#️⃣',
  },
  {
    slug: 'bigint-in-cpp',
    title: 'C++ 高精度算法详解与竞赛模板',
    subtitle: '教程 · C++ · 算法',
    gradient: ['#f9ca24', '#f0932b'],
    emoji: '🔢',
  },
  {
    slug: 'data-structure-basics',
    title: '数据结构基础：从数组到并查集',
    subtitle: '教程 · C++ · 数据结构',
    gradient: ['#00b894', '#55efc4'],
    emoji: '🌳',
  },
  {
    slug: 'matrix-basics',
    title: '矩阵入门：从高斯消元到特征值',
    subtitle: '教程 · 线性代数',
    gradient: ['#6c5ce7', '#341f97'],
    emoji: '📊',
  },
  {
    slug: '2024-zhuanchaben-c-programming',
    title: '专插本《计算机基础与程序设计》真题',
    subtitle: '专插本 · C语言 · 真题',
    gradient: ['#5f27cd', '#341f97'],
    emoji: '💻',
  },
  {
    slug: '2024-zhuanchaben-math',
    title: '专插本《高等数学》真题回忆版+详解',
    subtitle: '专插本 · 高等数学 · 真题',
    gradient: ['#2d3436', '#636e72'],
    emoji: '∫',
  },
  {
    slug: 'java-tutorial',
    title: 'Java 零基础入门教程',
    subtitle: '教程 · Java · 入门',
    gradient: ['#e17055', '#fdcb6e'],
    emoji: '☕',
  },
]

/**
 * 转义 SVG 文本中的特殊字符
 */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 生成单个封面 SVG
 */
function makeSvg({ title, subtitle, gradient, emoji }) {
  const [c1, c2] = gradient
  // 标题可能很长，按宽度估算换行（粗略：每 22 字符换行）
  const titleEsc = esc(title)
  const subtitleEsc = esc(subtitle)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" font-family="'Noto Sans SC','Microsoft YaHei','PingFang SC',sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="60%">
      <stop offset="0" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>

  <!-- 背景 -->
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>

  <!-- 装饰圆斑 -->
  <circle cx="980" cy="120" r="220" fill="rgba(255,255,255,0.08)"/>
  <circle cx="180" cy="560" r="160" fill="rgba(255,255,255,0.06)"/>
  <circle cx="1080" cy="540" r="90" fill="rgba(255,255,255,0.10)"/>

  <!-- 装饰线条（点阵） -->
  <g fill="rgba(255,255,255,0.12)">
    <circle cx="80" cy="100" r="3"/>
    <circle cx="110" cy="100" r="3"/>
    <circle cx="140" cy="100" r="3"/>
    <circle cx="80" cy="130" r="3"/>
    <circle cx="110" cy="130" r="3"/>
    <circle cx="140" cy="130" r="3"/>
  </g>

  <!-- 中央大 emoji 图标 -->
  <text x="600" y="320" font-size="200" text-anchor="middle" dominant-baseline="central" opacity="0.92">${emoji}</text>

  <!-- 标题 -->
  <text x="600" y="470" font-size="52" font-weight="700" text-anchor="middle" fill="#ffffff" style="text-shadow: 0 2px 12px rgba(0,0,0,0.25);">${titleEsc}</text>

  <!-- 副标题 -->
  <text x="600" y="525" font-size="22" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="'Noto Serif SC',serif">${subtitleEsc}</text>

  <!-- 底部分隔线 -->
  <line x1="540" y1="565" x2="660" y2="565" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round"/>

  <!-- 右下角小樱花 logo -->
  <text x="1140" y="640" font-size="28" text-anchor="end" opacity="0.7">🌸 Sakiko</text>
</svg>
`
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  let generated = 0
  let skipped = 0
  for (const cfg of COVERS) {
    const file = path.join(OUT_DIR, `${cfg.slug}.svg`)
    // 简单跳过逻辑：文件已存在则跳过（如需重新生成先删除）
    if (existsSync(file)) {
      skipped++
      continue
    }
    const svg = makeSvg(cfg)
    writeFileSync(file, svg, 'utf-8')
    generated++
  }
  console.log(`  ✓ 封面生成完成: ${generated} 新建, ${skipped} 已存在跳过 (共 ${COVERS.length} 张)`)
}

main()
