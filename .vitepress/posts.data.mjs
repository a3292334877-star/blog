/**
 * 文章数据加载器
 * 扫描 posts/ 目录，解析 frontmatter，提供文章列表数据
 */
import fs from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer } from 'vitepress'
import { estimateReadingTime, toPlainText } from './post-utils.mjs'
import { listPostFiles, parsePost } from './posts.mjs'

/** @typedef {object} PostData */
/** @typedef {PostData[]} Posts */

const cache = new Map()

export default {
  watch: 'posts/*.md',
  async load(asFeed = false) {
    const cwd = process.cwd()
    const md = await createMarkdownRenderer(cwd)
    const postDir = path.join(cwd, 'posts')

    return listPostFiles(postDir)
      .map((file) => getPost(md, file, postDir, asFeed))
      .filter(Boolean)
      .sort((a, b) => b.create - a.create)
  },
}

function getPost(md, file, postDir, asFeed = false) {
  const fullPath = path.join(postDir, file)
  const timestamp = Math.floor(fs.statSync(fullPath).mtimeMs)
  const cacheKey = `${fullPath}:${asFeed ? 'feed' : 'page'}`

  const cached = cache.get(cacheKey)
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
    update: timestamp,
    tags: parsed.tags,
    cover: parsed.cover,
    excerpt: md.render(parsed.excerpt || ''),
    summary: toPlainText(summarySource).slice(0, 220),
    readingTime: estimateReadingTime(parsed.content),
    type: parsed.type,
    source: parsed.data.source || '',
  }
  if (asFeed) {
    post.data = parsed.data
  }

  cache.set(cacheKey, { timestamp, post })
  return post
}
