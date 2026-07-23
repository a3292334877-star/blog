/**
 * 站点统计数据加载器
 * 计算总字数、运行时间、近期新增文章数
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const DAY = 24 * 60 * 60 * 1000

export default {
  watch: ['posts/*.md', 'projects/*.md', 'shuoshuo/*.md'],
  load() {
    const cwd = process.cwd()
    const postDir = path.join(cwd, 'posts')
    const now = Date.now()

    const posts = fs
      .readdirSync(postDir)
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .map((f) => {
        const raw = fs.readFileSync(path.join(postDir, f), 'utf-8')
        const { data, content } = matter(raw)
        return { date: +new Date(data.date) || 0, content }
      })
      .filter((p) => p.date > 0)

    // 总字数（中文字 + 英文单词）
    let totalWords = 0
    for (const p of posts) {
      const text = p.content
      const cjk = (text.match(/[一-鿿㐀-䶿]/g) || []).length
      const eng = (text.match(/[a-zA-Z]+/g) || []).length
      totalWords += cjk + eng
    }

    // 运行天数（最早文章至今）
    const firstDate = posts.length ? Math.min(...posts.map((p) => p.date)) : now
    const runDays = Math.max(1, Math.floor((now - firstDate) / DAY))

    // 近一周 / 近一月新增
    const weekAgo = now - 7 * DAY
    const monthAgo = now - 30 * DAY
    const weekNew = posts.filter((p) => p.date >= weekAgo).length
    const monthNew = posts.filter((p) => p.date >= monthAgo).length

    // 项目数量
    const projectDir = path.join(cwd, 'projects')
    let projectCount = 0
    let projectDates = []
    try {
      const projectFiles = fs
        .readdirSync(projectDir)
        .filter((f) => f.endsWith('.md') && f !== 'index.md')
      projectCount = projectFiles.length
      projectDates = projectFiles
        .map((f) => {
          const raw = fs.readFileSync(path.join(projectDir, f), 'utf-8')
          return +new Date(matter(raw).data.date) || 0
        })
        .filter((date) => date > 0)
    } catch { /* 目录不存在时忽略 */ }

    // 说说使用「年份 + 月-日」标题，提取日期后一起参与“最近更新”计算。
    const shuoshuoDates = []
    const shuoshuoFile = path.join(cwd, 'shuoshuo', 'index.md')
    if (fs.existsSync(shuoshuoFile)) {
      let year = 0
      const lines = fs.readFileSync(shuoshuoFile, 'utf-8').split(/\r?\n/)
      for (const line of lines) {
        const yearMatch = line.match(/^##\s+(\d{4})\s*$/)
        if (yearMatch) {
          year = Number(yearMatch[1])
          continue
        }
        const dateMatch = line.match(/^###\s+(\d{2})-(\d{2})\s*$/)
        if (year && dateMatch) {
          shuoshuoDates.push(Date.UTC(
            year,
            Number(dateMatch[1]) - 1,
            Number(dateMatch[2]),
            12,
          ))
        }
      }
    }

    const contentDates = [
      ...posts.map((p) => p.date),
      ...projectDates,
      ...shuoshuoDates,
    ]

    return {
      totalWords,
      runDays,
      postCount: posts.length,
      weekNew,
      monthNew,
      lastUpdate: contentDates.length ? Math.max(...contentDates) : now,
      projectCount,
    }
  },
}
