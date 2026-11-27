/**
 * 文章数据加载器
 * 扫描 posts/ 目录，解析 frontmatter，提供文章列表数据。
 *
 * 结果会整体打包进客户端 chunk（文章页的上下篇/相关推荐也会加载），
 * 因此只保留列表与导航组件真正读取的字段。RSS 由 generate-rss.mjs 单独生成。
 */
import fs from 'node:fs'
import path from 'node:path'
import { estimateReadingTime, toPlainText } from './post-utils.mjs'
import { listPostFiles, parsePost } from './posts.mjs'

/** @typedef {object} PostData */
/** @typedef {PostData[]} Posts */

const cache = new Map()

export default {
  watch: 'posts/*.md',
  load() {
    const postDir = path.join(process.cwd(), 'posts')

    return listPostFiles(postDir)
      .map((file) => getPost(file, postDir))
      .filter(Boolean)
      .sort((a, b) => b.create - a.create)
  },
}

function getPost(file, postDir) {
  const fullPath = path.join(postDir, file)
  const timestamp = Math.floor(fs.statSync(fullPath).mtimeMs)
  const cached = cache.get(fullPath)
  if (cached && timestamp === cached.timestamp) {
    return cached.post
  }

  const raw = fs.readFileSync(fullPath, 'utf-8')
  const parsed = parsePost(raw, { filePath: fullPath, mtimeMs: timestamp })

  // 跳过分页索引文件
  if (!parsed) return null

  const summarySource = parsed.data.description || parsed.excerpt || parsed.content
  const post = {
    title: parsed.data.title,
    href: `posts/${parsed.slug}`,
    create: parsed.date,
    tags: parsed.tags,
    cover: parsed.cover,
    summary: toPlainText(summarySource).slice(0, 220),
    readingTime: estimateReadingTime(parsed.content),
    type: parsed.type,
  }

  cache.set(fullPath, { timestamp, post })
  return post
}
