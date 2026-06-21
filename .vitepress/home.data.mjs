/**
 * 首页聚合数据加载器
 * 解析 anime/、shuoshuo/、projects/ 目录，给首页预览组件用
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const DAY = 24 * 60 * 60 * 1000

/**
 * 从 anime/index.md 提取最近番剧
 * 解析表格行 | 番名 | 年份 | 简评 |
 */
function parseAnime(cwd) {
  const file = path.join(cwd, 'anime/index.md')
  if (!fs.existsSync(file)) return []
  const raw = fs.readFileSync(file, 'utf-8')
  const lines = raw.split('\n')
  const items = []
  for (const line of lines) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*(\d{4})\s*\|\s*([^|]+?)\s*\|$/)
    if (m && !/番名|---/.test(m[1])) {
      items.push({
        name: m[1].trim(),
        year: parseInt(m[2], 10),
        remark: m[3].trim(),
      })
    }
  }
  return items.slice(0, 6)
}

/**
 * 从 shuoshuo/index.md 提取最近说说
 * 按 ### MM-DD 分段，标题年份来自 ## YYYY
 */
function parseShuoshuo(cwd) {
  const file = path.join(cwd, 'shuoshuo/index.md')
  if (!fs.existsSync(file)) return []
  const raw = fs.readFileSync(file, 'utf-8')
  const lines = raw.split('\n')
  const items = []
  let year = ''
  let monthDay = ''
  let buf = []
  function flush() {
    if (year && monthDay && buf.length) {
      items.push({
        date: `${year}-${monthDay}`,
        content: buf.join('\n').replace(/^---\s*$/gm, '').trim(),
      })
    }
    buf = []
  }
  for (const line of lines) {
    const ym = line.match(/^##\s+(\d{4})/)
    const dm = line.match(/^###\s+(\d{2}-\d{2})/)
    if (ym) { flush(); year = ym[1]; monthDay = ''; continue }
    if (dm) { flush(); monthDay = dm[1]; continue }
    if (monthDay) buf.push(line)
  }
  flush()
  // 按日期降序，取最近 3 条
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
}

/**
 * 从 projects/*.md（除 index.md）提取项目
 * 用 frontmatter 的 title/cover/tags，desc 取"项目简介"段第一句
 */
function parseProjects(cwd) {
  const dir = path.join(cwd, 'projects')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      // 提取 ## 项目简介 下的第一段非空非引用行作为简介
      let desc = ''
      const lines = content.split('\n')
      let inIntro = false
      for (const line of lines) {
        if (line.startsWith('## ')) {
          inIntro = /项目简介/.test(line)
          continue
        }
        if (inIntro && line.trim() && !line.startsWith('>') && !line.startsWith('<!--')) {
          desc = line.trim()
          break
        }
      }
      // fallback：取第一个非标题非空行
      if (!desc) {
        const first = lines.find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('<!--'))
        desc = first ? first.trim() : ''
      }
      return {
        title: (data.title || f.replace(/\.md$/, '')).replace(/\s*[-–—].*$/, ''), // 去掉副标题
        slug: f.replace(/\.md$/, ''),
        cover: data.cover || '',
        desc,
        tags: data.tags || [],
      }
    })
    .slice(0, 3)
}

export default {
  watch: ['anime/*.md', 'shuoshuo/*.md', 'projects/*.md'],
  load() {
    const cwd = process.cwd()
    return {
      anime: parseAnime(cwd),
      shuoshuo: parseShuoshuo(cwd),
      projects: parseProjects(cwd),
    }
  },
}
