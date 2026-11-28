/**
 * 站点统计数据加载器
 * 计算总字数、运行时间、近期新增文章数
 */
import path from 'node:path'
import { loadPosts } from './posts.mjs'
import { parseProjects, parseShuoshuo } from './content-parsers.mjs'

const DAY = 24 * 60 * 60 * 1000

export default {
  watch: ['posts/*.md', 'projects/*.md', 'shuoshuo/*.md'],
  load() {
    const cwd = process.cwd()
    const postDir = path.join(cwd, 'posts')
    const now = Date.now()

    const posts = loadPosts(postDir)

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

    const projects = parseProjects(cwd)
    const shuoshuoDates = parseShuoshuo(cwd).map((item) => item.timestamp)

    const contentDates = [
      ...posts.map((p) => p.date),
      ...projects.map((p) => p.date),
      ...shuoshuoDates,
    ]

    return {
      totalWords,
      runDays,
      postCount: posts.length,
      weekNew,
      monthNew,
      lastUpdate: contentDates.length ? Math.max(...contentDates) : now,
      projectCount: projects.length,
    }
  },
}
