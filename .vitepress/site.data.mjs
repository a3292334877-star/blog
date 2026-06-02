/**
 * 站点统计数据加载器
 * 计算总字数、运行时间、近期新增文章数
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const DAY = 24 * 60 * 60 * 1000

export default {
  watch: 'posts/*.md',
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
    const firstDate = posts.reduce((min, p) => Math.min(min, p.date), now)
    const runDays = Math.max(1, Math.floor((now - firstDate) / DAY))

    // 近一周 / 近一月新增
    const weekAgo = now - 7 * DAY
    const monthAgo = now - 30 * DAY
    const weekNew = posts.filter((p) => p.date >= weekAgo).length
    const monthNew = posts.filter((p) => p.date >= monthAgo).length

    return {
      totalWords,
      runDays,
      postCount: posts.length,
      weekNew,
      monthNew,
      lastUpdate: Math.max(...posts.map((p) => p.date)),
    }
  },
}
