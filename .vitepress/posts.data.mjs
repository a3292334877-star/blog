/**
 * 文章数据加载器
 * 扫描 posts/ 目录，解析 frontmatter，提供文章列表数据
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { createMarkdownRenderer } from 'vitepress'

/** @typedef {object} PostData */
/** @typedef {PostData[]} Posts */

const cache = new Map()

export default {
  watch: 'posts/*.md',
  async load(asFeed = false) {
    const cwd = process.cwd()
    const md = await createMarkdownRenderer(cwd)
    const postDir = path.join(cwd, 'posts')

    return fs
      .readdirSync(postDir)
      .filter((file) => file.endsWith('.md') && file !== 'index.md')
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

  const src = fs.readFileSync(fullPath, 'utf-8')
  const { data, excerpt } = matter(src, { excerpt: true, excerpt_separator: '<!-- more -->' })

  // 跳过分页索引文件
  if (!data.title) return null

  const post = {
    title: data.title,
    href: `posts/${file.replace(/\.md$/, '')}`,
    create: +new Date(data.date) || timestamp,
    update: timestamp,
    tags: data.tags || [],
    cover: data.cover || '',
    excerpt: md.render(excerpt || ''),
  }
  if (asFeed) {
    post.data = data
  }

  cache.set(cacheKey, { timestamp, post })
  return post
}
