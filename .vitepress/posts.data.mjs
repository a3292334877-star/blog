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
  const { data, content, excerpt } = matter(src, { excerpt: true, excerpt_separator: '<!-- more -->' })

  // 跳过分页索引文件
  if (!data.title) return null

  const slug = file.replace(/\.md$/, '')
  const summarySource = data.description || excerpt || content
  const post = {
    title: data.title,
    href: `posts/${slug}`,
    create: +new Date(data.date) || timestamp,
    update: timestamp,
    tags: data.tags || [],
    cover: data.cover === false ? '' : (data.cover || `/covers/${slug}.svg`),
    excerpt: md.render(excerpt || ''),
    summary: toPlainText(summarySource).slice(0, 220),
    readingTime: estimateReadingTime(content),
  }
  if (asFeed) {
    post.data = data
  }

  cache.set(cacheKey, { timestamp, post })
  return post
}

function toPlainText(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function estimateReadingTime(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_|~-]/g, ' ')
  const cjkCount = (plain.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length
  const wordCount = (plain.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  return Math.max(1, Math.ceil(cjkCount / 300 + wordCount / 200))
}
