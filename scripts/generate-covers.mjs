/**
 * 主题化 SVG 封面生成器 v2
 * 为每篇文章生成独一无二、信息丰富的 SVG 封面
 *
 * 设计语言：
 * - 左下：标题 + 副标题 + 分隔线
 * - 右上：主题装饰图形（非 emoji，用 SVG 路径绘制）
 * - 背景：双色对角渐变 + 噪点 + 装饰圆斑 + 点阵
 *
 * 用法：node scripts/generate-covers.mjs
 * 已接入 package.json 的 dev / build 钩子
 */
import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs'
import path from 'node:path'

const OUT_DIR = path.join(process.cwd(), 'public/covers')

/**
 * 封面配置：每篇一个独立主题
 * gradient: [主色, 副色]
 * decor:    装饰图形绘制函数，返回 SVG 内容字符串
 */
const COVERS = [
  {
    slug: 'hello-world',
    title: '你好，世界',
    subtitle: '博客开篇 · 生活',
    gradient: ['#ffb7c5', '#ffe4b5'],
    decor: decorSakuraEarth,
  },
  {
    slug: 'markdown-guide',
    title: 'Markdown 写作指南',
    subtitle: '教程 · 写作',
    gradient: ['#74c7ec', '#5b8def'],
    decor: decorMarkdown,
  },
  {
    slug: 'linux-tips',
    title: 'Linux 常用操作技巧',
    subtitle: '教程 · Linux',
    gradient: ['#2d3436', '#535c68'],
    decor: decorTerminal,
  },
  {
    slug: 'git-tips',
    title: 'Git 入门与实用技巧',
    subtitle: '教程 · Git',
    gradient: ['#f39c12', '#e74c3c'],
    decor: decorGit,
  },
  {
    slug: 'hashmap-in-cpp',
    title: 'C++ 哈希 Map 应用与竞赛技巧',
    subtitle: '教程 · C++ · 算法',
    gradient: ['#6c5ce7', '#341f97'],
    decor: decorHashmap,
  },
  {
    slug: 'bigint-in-cpp',
    title: 'C++ 高精度算法详解与竞赛模板',
    subtitle: '教程 · C++ · 算法',
    gradient: ['#f9ca24', '#f0932b'],
    decor: decorBigint,
  },
  {
    slug: 'data-structure-basics',
    title: '数据结构基础：从数组到并查集',
    subtitle: '教程 · C++ · 数据结构',
    gradient: ['#00b894', '#00cec9'],
    decor: decorTree,
  },
  {
    slug: 'matrix-basics',
    title: '矩阵入门：从高斯消元到特征值',
    subtitle: '教程 · 线性代数',
    gradient: ['#5f27cd', '#341f97'],
    decor: decorMatrix,
  },
  {
    slug: '2024-zhuanchaben-c-programming',
    title: '专插本《计算机基础与程序设计》真题',
    subtitle: '专插本 · C语言 · 真题',
    gradient: ['#0984e3', '#5f27cd'],
    decor: decorCodeWindow,
  },
  {
    slug: '2024-zhuanchaben-math',
    title: '专插本《高等数学》真题回忆版+详解',
    subtitle: '专插本 · 高等数学 · 真题',
    gradient: ['#2d3436', '#636e72'],
    decor: decorIntegral,
  },
  {
    slug: 'java-tutorial',
    title: 'Java 零基础入门教程',
    subtitle: '教程 · Java · 入门',
    gradient: ['#e17055', '#fdcb6e'],
    decor: decorCoffee,
  },
]

// ============================================================
// 装饰图形：每个函数返回 SVG 内容字符串，画在右上角 ~440x300 区域
// 中心点参考：(940, 220)
// ============================================================

/** 樱花 + 地球：你好世界 */
function decorSakuraEarth() {
  return `
  <!-- 地球：蓝绿圆 -->
  <circle cx="940" cy="220" r="95" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
  <!-- 经纬线 -->
  <ellipse cx="940" cy="220" rx="95" ry="38" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <ellipse cx="940" cy="220" rx="95" ry="70" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
  <line x1="845" y1="220" x2="1035" y2="220" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <line x1="940" y1="125" x2="940" y2="315" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <!-- 简化大陆 -->
  <path d="M 905 190 Q 925 175 950 185 Q 970 195 965 215 Q 945 225 920 220 Z" fill="rgba(255,255,255,0.35)"/>
  <path d="M 960 235 Q 985 240 990 260 Q 980 275 965 265 Z" fill="rgba(255,255,255,0.30)"/>
  <!-- 樱花花瓣环绕 -->
  ${sakuraPetal(820, 130, 26, -20)}
  ${sakuraPetal(1050, 160, 22, 35)}
  ${sakuraPetal(840, 320, 20, 60)}
  ${sakuraPetal(1060, 310, 24, -10)}
  `
}

/** Markdown 符号矩阵 */
function decorMarkdown() {
  const symbols = [
    { x: 870, y: 140, t: '#', s: 64 },
    { x: 960, y: 130, t: '*', s: 56 },
    { x: 1040, y: 150, t: '>', s: 52 },
    { x: 880, y: 230, t: '-', s: 60 },
    { x: 975, y: 220, t: '`', s: 54 },
    { x: 1050, y: 235, t: '[ ]', s: 36 },
    { x: 890, y: 320, t: '**', s: 48 },
    { x: 980, y: 310, t: '==', s: 44 },
  ]
  return symbols.map((s, i) =>
    `<text x="${s.x}" y="${s.y}" font-size="${s.s}" font-weight="700" fill="rgba(255,255,255,${0.18 + (i % 3) * 0.08})" font-family="'Fira Code',monospace">${s.t}</text>`
  ).join('\n  ')
}

/** 终端窗口 */
function decorTerminal() {
  return `
  <g transform="translate(810 110)">
    <rect width="260" height="200" rx="10" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <!-- 顶栏三个圆点 -->
    <circle cx="22" cy="22" r="7" fill="#ff5f56"/>
    <circle cx="44" cy="22" r="7" fill="#ffbd2e"/>
    <circle cx="66" cy="22" r="7" fill="#27c93f"/>
    <!-- 提示符 + 命令 -->
    <text x="20" y="70" font-size="18" fill="#27c93f" font-family="'Fira Code',monospace">$</text>
    <text x="42" y="70" font-size="18" fill="rgba(255,255,255,0.9)" font-family="'Fira Code',monospace">ls -la</text>
    <text x="20" y="100" font-size="15" fill="rgba(255,255,255,0.65)" font-family="'Fira Code',monospace">drwxr-xr-x  home/</text>
    <text x="20" y="125" font-size="15" fill="rgba(255,255,255,0.65)" font-family="'Fira Code',monospace">-rw-r--r--  .bashrc</text>
    <text x="20" y="150" font-size="15" fill="rgba(255,255,255,0.65)" font-family="'Fira Code',monospace">-rwxr-xr-x  script.sh</text>
    <text x="20" y="180" font-size="18" fill="#27c93f" font-family="'Fira Code',monospace">$</text>
    <rect x="42" y="166" width="10" height="18" fill="rgba(255,255,255,0.8)"/>
  </g>
  `
}

/** Git 分支合并图 */
function decorGit() {
  return `
  <g stroke="rgba(255,255,255,0.85)" stroke-width="3.5" fill="none" stroke-linecap="round">
    <!-- main 分支 -->
    <line x1="840" y1="180" x2="1040" y2="180"/>
    <!-- feature 分支：从 main 分出再合回 -->
    <path d="M 900 180 Q 920 200 920 250 Q 920 290 940 290 Q 960 290 970 240 Q 975 210 990 190 Q 1000 182 1010 180"/>
  </g>
  <!-- 节点圆点 -->
  <g>
    <circle cx="840" cy="180" r="9" fill="#fff"/>
    <circle cx="900" cy="180" r="9" fill="#fff"/>
    <circle cx="970" cy="180" r="9" fill="#fff"/>
    <circle cx="1040" cy="180" r="9" fill="#fff"/>
    <circle cx="920" cy="250" r="9" fill="#ffd700"/>
    <circle cx="960" cy="290" r="9" fill="#ffd700"/>
  </g>
  <!-- 分支标签 -->
  <text x="920" y="330" font-size="20" fill="rgba(255,255,255,0.9)" font-family="'Fira Code',monospace" text-anchor="middle">feature</text>
  <text x="940" y="155" font-size="18" fill="rgba(255,255,255,0.85)" font-family="'Fira Code',monospace" text-anchor="middle">main</text>
  <!-- merge 标记 -->
  <text x="985" y="170" font-size="14" fill="#ffd700" font-family="'Fira Code',monospace" text-anchor="middle">merge</text>
  `
}

/** 哈希表：桶 + 链表 */
function decorHashmap() {
  // 5 个桶，部分有链表
  const buckets = [0, 1, 2, 3, 4].map((i) => {
    const y = 130 + i * 42
    return `<rect x="830" y="${y}" width="70" height="32" rx="4" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
            <text x="865" y="${y + 22}" font-size="16" fill="rgba(255,255,255,0.9)" font-family="'Fira Code',monospace" text-anchor="middle">${i}</text>`
  }).join('\n  ')
  // 链表：桶 1、3 挂节点
  const chain1 = `
    <line x1="900" y1="172" x2="940" y2="172" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
    <rect x="940" y="156" width="56" height="32" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <text x="968" y="178" font-size="15" fill="#fff" font-family="'Fira Code',monospace" text-anchor="middle">v1</text>
    <line x1="996" y1="172" x2="1030" y2="172" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
    <rect x="1030" y="156" width="50" height="32" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <text x="1055" y="178" font-size="15" fill="#fff" font-family="'Fira Code',monospace" text-anchor="middle">v2</text>`
  const chain3 = `
    <line x1="900" y1="256" x2="945" y2="256" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
    <rect x="945" y="240" width="56" height="32" rx="4" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <text x="973" y="262" font-size="15" fill="#fff" font-family="'Fira Code',monospace" text-anchor="middle">v3</text>`
  return `
  <text x="920" y="105" font-size="20" fill="rgba(255,255,255,0.7)" font-family="'Fira Code',monospace" text-anchor="middle">hash(key) % N</text>
  ${buckets}
  ${chain1}
  ${chain3}
  `
}

/** 高精度竖式：大数字相加 */
function decorBigint() {
  return `
  <g font-family="'Fira Code',monospace" fill="rgba(255,255,255,0.92)" text-anchor="end">
    <text x="1080" y="170" font-size="42" font-weight="700">9999999999</text>
    <text x="1080" y="220" font-size="42" font-weight="700">+ 8888888888</text>
    <line x1="830" y1="235" x2="1080" y2="235" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
    <text x="1080" y="285" font-size="42" font-weight="700" fill="#fff">18888888887</text>
  </g>
  <!-- 进位小字标注 -->
  <text x="930" y="155" font-size="14" fill="#fff" font-family="'Fira Code',monospace" opacity="0.7">↑进位</text>
  <text x="850" y="335" font-size="16" fill="rgba(255,255,255,0.65)" font-family="'Fira Code',monospace">逐位相加 · 处理进位</text>
  `
}

/** 树 + 并查集 */
function decorTree() {
  return `
  <g stroke="rgba(255,255,255,0.8)" stroke-width="2.5" fill="none" stroke-linecap="round">
    <!-- 树枝 -->
    <line x1="940" y1="150" x2="870" y2="220"/>
    <line x1="940" y1="150" x2="1010" y2="220"/>
    <line x1="870" y1="220" x2="830" y2="290"/>
    <line x1="870" y1="220" x2="910" y2="290"/>
    <line x1="1010" y1="220" x2="980" y2="290"/>
    <line x1="1010" y1="220" x2="1050" y2="290"/>
  </g>
  <!-- 节点 -->
  <g>
    <circle cx="940" cy="150" r="18" fill="rgba(255,255,255,0.9)"/>
    <circle cx="870" cy="220" r="16" fill="rgba(255,255,255,0.75)"/>
    <circle cx="1010" cy="220" r="16" fill="rgba(255,255,255,0.75)"/>
    <circle cx="830" cy="290" r="14" fill="rgba(255,255,255,0.6)"/>
    <circle cx="910" cy="290" r="14" fill="rgba(255,255,255,0.6)"/>
    <circle cx="980" cy="290" r="14" fill="rgba(255,255,255,0.6)"/>
    <circle cx="1050" cy="290" r="14" fill="rgba(255,255,255,0.6)"/>
  </g>
  <!-- 节点数值 -->
  <g font-family="'Fira Code',monospace" font-size="14" fill="#2d3436" text-anchor="middle" font-weight="700">
    <text x="940" y="155">1</text>
    <text x="870" y="225">2</text>
    <text x="1010" y="225">3</text>
    <text x="830" y="295">4</text>
    <text x="910" y="295">5</text>
    <text x="980" y="295">6</text>
    <text x="1050" y="295">7</text>
  </g>
  `
}

/** 矩阵网格 + 变换 */
function decorMatrix() {
  // 3x3 网格
  const cells = []
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 870 + j * 60
      const y = 130 + i * 60
      const opacity = 0.18 + ((i + j) % 2) * 0.15
      cells.push(`<rect x="${x}" y="${y}" width="56" height="56" rx="4" fill="rgba(255,255,255,${opacity})" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>`)
      // 填入简化数值
      const val = (i * 3 + j + 1).toString()
      cells.push(`<text x="${x + 28}" y="${y + 36}" font-size="20" fill="#fff" font-family="'Fira Code',monospace" text-anchor="middle" font-weight="700">${val}</text>`)
    }
  }
  return `
  <!-- 方括号 -->
  <path d="M 855 120 L 845 120 L 845 320 L 855 320" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 1065 120 L 1075 120 L 1075 320 L 1065 320" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="3" stroke-linecap="round"/>
  ${cells.join('\n  ')}
  <!-- 特征值标注 -->
  <text x="960" y="355" font-size="16" fill="rgba(255,255,255,0.7)" font-family="'Fira Code',monospace" text-anchor="middle">λ₁ · λ₂ · λ₃</text>
  `
}

/** 代码窗口 */
function decorCodeWindow() {
  return `
  <g transform="translate(810 110)">
    <rect width="270" height="210" rx="10" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <!-- 顶栏 -->
    <rect width="270" height="36" rx="10" fill="rgba(255,255,255,0.1)"/>
    <rect y="26" width="270" height="10" fill="rgba(255,255,255,0.1)"/>
    <circle cx="22" cy="18" r="6" fill="#ff5f56"/>
    <circle cx="42" cy="18" r="6" fill="#ffbd2e"/>
    <circle cx="62" cy="18" r="6" fill="#27c93f"/>
    <text x="135" y="23" font-size="13" fill="rgba(255,255,255,0.6)" font-family="'Fira Code',monospace" text-anchor="middle">exam_2024.c</text>
    <!-- 代码行 -->
    <text x="20" y="68" font-size="14" fill="#7fcdff" font-family="'Fira Code',monospace">int</text>
    <text x="50" y="68" font-size="14" fill="#fff" font-family="'Fira Code',monospace">main() {</text>
    <text x="35" y="92" font-size="14" fill="#7fcdff" font-family="'Fira Code',monospace">int</text>
    <text x="65" y="92" font-size="14" fill="#fff" font-family="'Fira Code',monospace">n, sum = 0;</text>
    <text x="35" y="116" font-size="14" fill="#c792ea" font-family="'Fira Code',monospace">scanf</text>
    <text x="88" y="116" font-size="14" fill="#fff" font-family="'Fira Code',monospace">("%d", &amp;n);</text>
    <text x="35" y="140" font-size="14" fill="#c792ea" font-family="'Fira Code',monospace">for</text>
    <text x="68" y="140" font-size="14" fill="#fff" font-family="'Fira Code',monospace">(i=0; i&lt;n; i++)</text>
    <text x="50" y="164" font-size="14" fill="#fff" font-family="'Fira Code',monospace">sum += i;</text>
    <text x="35" y="188" font-size="14" fill="#c792ea" font-family="'Fira Code',monospace">printf</text>
    <text x="90" y="188" font-size="14" fill="#fff" font-family="'Fira Code',monospace">("%d", sum);</text>
    <text x="20" y="208" font-size="14" fill="#fff" font-family="'Fira Code',monospace">}</text>
  </g>
  `
}

/** 积分符号 + 曲线 */
function decorIntegral() {
  return `
  <!-- 大积分号 -->
  <text x="900" y="280" font-size="200" fill="rgba(255,255,255,0.92)" font-family="serif" font-style="italic" font-weight="400">∫</text>
  <!-- 积分上下限 -->
  <text x="935" y="130" font-size="22" fill="rgba(255,255,255,0.85)" font-family="serif">∞</text>
  <text x="935" y="300" font-size="22" fill="rgba(255,255,255,0.85)" font-family="serif">0</text>
  <!-- 被积函数 -->
  <text x="955" y="200" font-size="38" fill="#fff" font-family="serif" font-style="italic">f(x)dx</text>
  <!-- 函数曲线 -->
  <path d="M 830 330 Q 920 240 1010 300 T 1080 270" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-dasharray="6 4"/>
  <!-- 坐标轴 -->
  <line x1="830" y1="340" x2="1080" y2="340" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="830" y1="120" x2="830" y2="340" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  `
}

/** 咖啡杯 + 蒸汽 */
function decorCoffee() {
  return `
  <g transform="translate(870 160)">
    <!-- 蒸汽 -->
    <path d="M 40 -20 Q 50 -40 40 -60 Q 30 -80 40 -100" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="3" stroke-linecap="round"/>
    <path d="M 70 -20 Q 80 -45 70 -70 Q 60 -90 70 -110" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round"/>
    <path d="M 100 -20 Q 110 -40 100 -60 Q 90 -80 100 -100" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3" stroke-linecap="round"/>
    <!-- 杯身 -->
    <path d="M 10 0 L 130 0 L 120 110 Q 118 120 108 120 L 32 120 Q 22 120 20 110 Z" fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,1)" stroke-width="2"/>
    <!-- 杯口咖啡液 -->
    <ellipse cx="70" cy="0" rx="60" ry="8" fill="#5d4037"/>
    <!-- 杯把 -->
    <path d="M 130 20 Q 165 20 165 55 Q 165 90 130 90" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="8" stroke-linecap="round"/>
    <!-- 杯身 Java 字样 -->
    <text x="70" y="75" font-size="32" font-weight="700" fill="#5d4037" font-family="'Noto Serif SC',serif" text-anchor="middle">Java</text>
  </g>
  `
}

// ============================================================
// 工具：单片樱花花瓣
// ============================================================
function sakuraPetal(cx, cy, size, rotate) {
  return `<g transform="translate(${cx} ${cy}) rotate(${rotate}) scale(${size / 30})">
    <path d="M 0 -14 C 5 -12 7 -6 3 -2 C 6 0 7 3 2 4 C 4 7 1 11 -4 8 C -2 11 -7 11 -7 5 C -10 7 -13 3 -9 -1 C -13 -4 -10 -11 -5 -8 C -7 -12 -1 -14 0 -14 Z" fill="rgba(255,255,255,0.85)"/>
  </g>`
}

// ============================================================
// SVG 组装
// ============================================================
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function makeSvg({ title, subtitle, gradient, decor }) {
  const [c1, c2] = gradient
  const titleEsc = esc(title)
  const subtitleEsc = esc(subtitle)
  const decorSvg = decor()

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" font-family="'Noto Sans SC','Microsoft YaHei','PingFang SC',sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="30%" r="70%">
      <stop offset="0" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <!-- 噪点纹理 -->
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/>
    </filter>
  </defs>

  <!-- 背景层 -->
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  <rect width="1200" height="675" filter="url(#noise)" opacity="0.5"/>

  <!-- 装饰圆斑 -->
  <circle cx="1080" cy="80" r="180" fill="rgba(255,255,255,0.07)"/>
  <circle cx="120" cy="600" r="140" fill="rgba(255,255,255,0.05)"/>
  <circle cx="60" cy="120" r="60" fill="rgba(255,255,255,0.08)"/>

  <!-- 左上点阵装饰 -->
  <g fill="rgba(255,255,255,0.14)">
    <circle cx="50" cy="80" r="3"/><circle cx="78" cy="80" r="3"/><circle cx="106" cy="80" r="3"/>
    <circle cx="50" cy="108" r="3"/><circle cx="78" cy="108" r="3"/>
    <circle cx="50" cy="136" r="3"/>
  </g>

  <!-- 右上主题装饰图形 -->
  ${decorSvg}

  <!-- 底部品牌区 -->
  <text x="80" y="610" font-size="22" fill="rgba(255,255,255,0.75)" font-family="'Noto Serif SC',serif">🌸 Sakiko の博客</text>

  <!-- 标题区（左下） -->
  <g transform="translate(80 460)">
    <!-- 标题前竖线装饰 -->
    <rect x="0" y="-30" width="5" height="110" rx="2" fill="rgba(255,255,255,0.85)"/>
    <text x="22" y="10" font-size="46" font-weight="700" fill="#ffffff" style="text-shadow: 0 2px 12px rgba(0,0,0,0.3);">${titleEsc}</text>
    <text x="22" y="55" font-size="22" fill="rgba(255,255,255,0.88)" font-family="'Noto Serif SC',serif">${subtitleEsc}</text>
  </g>
</svg>
`
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  let generated = 0
  let skipped = 0
  for (const cfg of COVERS) {
    const file = path.join(OUT_DIR, `${cfg.slug}.svg`)
    // 始终重新生成（v2 升级，覆盖旧的简陋版本）
    const svg = makeSvg(cfg)
    writeFileSync(file, svg, 'utf-8')
    generated++
  }
  console.log(`  ✓ 封面生成完成 v2: ${generated} 张已更新 (共 ${COVERS.length} 张)`)
}

main()
