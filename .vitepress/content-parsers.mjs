/**
 * 栏目内容共享解析器（追番 / 说说 / 项目）
 *
 * 将 Markdown 文件作为唯一数据源，供首页预览、栏目交互组件与站点统计复用，
 * 避免同一份内容在 .md 与 .vue 组件间重复维护。
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const VALID_TAG_TYPES = new Set(['daily', 'study', 'milestone', 'mood'])

/**
 * 解析 anime/index.md 中的追番表格。
 * 支持 3 列（| 番名 | 年份 | 简评 |）和 4 列（追加标签列）。
 */
export function parseAnime(cwd) {
  const file = path.join(cwd, 'anime', 'index.md')
  if (!fs.existsSync(file)) return []
  const raw = fs.readFileSync(file, 'utf-8')
  const lines = raw.split(/\r?\n/)
  const items = []
  let currentRating = 4

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+.*?([⭐★]+)/)
    if (headingMatch) {
      currentRating = Math.min(5, Math.max(1, headingMatch[1].length))
      continue
    }

    if (!line.startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((c) => c.trim())
    if (cells.length < 3) continue
    if (!/^\d{4}$/.test(cells[1]) || /番名|---/.test(cells[0])) continue

    const name = cells[0]
    const year = parseInt(cells[1], 10)
    const remark = cells[2]
    const rawTags = cells[3]
      ? cells[3].split(/[,，、]/).map((t) => t.trim()).filter(Boolean)
      : []
    const isKyoAni = rawTags.some((t) => /京阿尼/.test(t)) || /京阿尼|京都动画/.test(remark)
    const tags = rawTags.filter((t) => !/^(?:🍡\s*)?京阿尼$/u.test(t))

    items.push({
      name,
      year,
      rating: currentRating,
      remark,
      isKyoAni,
      tags,
    })
  }

  return items
}

function inferShuoshuoMeta(content) {
  if (/生日|毕业|开学|N1|四级|六级|蓝桥杯|省赛|通关/.test(content)) {
    return { tag: '里程碑', tagType: 'milestone' }
  }
  if (/LeetCode|Flutter|C\+\+|算法|代码|博客|刷题|学习/.test(content)) {
    return { tag: '学习', tagType: 'study' }
  }
  if (/思考|焦虑|迷茫|到底该做什么/.test(content)) {
    return { tag: '思考', tagType: 'mood' }
  }
  return { tag: '日常', tagType: 'daily' }
}

/**
 * 解析 shuoshuo/index.md 中的说说记录。
 * 支持在条目下通过 `<!-- tag: 标签名 | daily|study|milestone|mood -->` 指定分类；
 * 若省略则按内容自动推断默认值。
 */
export function parseShuoshuo(cwd) {
  const file = path.join(cwd, 'shuoshuo', 'index.md')
  if (!fs.existsSync(file)) return []
  const raw = fs.readFileSync(file, 'utf-8')
  const lines = raw.split(/\r?\n/)
  const items = []
  let year = ''
  let monthDay = ''
  let buf = []
  let explicitTag = ''
  let explicitType = ''

  function flush() {
    if (year && monthDay && buf.length) {
      const content = buf
        .join('\n')
        .replace(/^---\s*$/gm, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim()
      if (content) {
        const inferred = inferShuoshuoMeta(content)
        const [month, day] = monthDay.split('-')
        const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day), 12)
        items.push({
          date: `${year}-${monthDay}`,
          year,
          displayDate: `${month}月${day}日`,
          timestamp,
          content,
          tag: explicitTag || inferred.tag,
          tagType: VALID_TAG_TYPES.has(explicitType) ? explicitType : inferred.tagType,
        })
      }
    }
    buf = []
    explicitTag = ''
    explicitType = ''
  }

  for (const line of lines) {
    const ym = line.match(/^##\s+(\d{4})\s*$/)
    const dm = line.match(/^###\s+(\d{2}-\d{2})\s*$/)
    if (ym) { flush(); year = ym[1]; monthDay = ''; continue }
    if (dm) { flush(); monthDay = dm[1]; continue }
    if (!monthDay) continue
    if (/^<\/details>\s*$/i.test(line.trim())) break
    const metaMatch = line.match(/<!--\s*tag:\s*([^|>]+?)(?:\s*\|\s*(\w+))?\s*-->/)
    if (metaMatch) {
      explicitTag = metaMatch[1].trim()
      explicitType = (metaMatch[2] || '').trim()
      continue
    }
    buf.push(line)
  }
  flush()

  return items.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * 解析 projects/*.md（除 index.md）项目信息，按日期倒序返回。
 */
export function parseProjects(cwd) {
  const dir = path.join(cwd, 'projects')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      let desc = ''
      const lines = content.split(/\r?\n/)
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
      if (!desc) {
        const first = lines.find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('<!--'))
        desc = first ? first.trim() : ''
      }
      return {
        title: (data.title || f.replace(/\.md$/, '')).replace(/\s*[-–—].*$/, ''),
        slug: f.replace(/\.md$/, ''),
        date: +new Date(data.date) || 0,
        cover: data.cover || '',
        desc,
        tags: data.tags || [],
      }
    })
    .filter((p) => p.date > 0)
    .sort((a, b) => b.date - a.date)
}
