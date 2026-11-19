/**
 * 文章文件扫描与 frontmatter 解析。
 *
 * 站点配置（侧边栏）、数据加载器（列表页）和 RSS 生成器都通过这里读取文章，
 * 保证 slug、日期回退、封面和类型推断只维护一份规则。
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { inferPostType } from './post-utils.mjs'

/** 列出 posts 目录下参与站点的文章文件（排除 index.md）。 */
export function listPostFiles(postsDir) {
  if (!fs.existsSync(postsDir)) return []
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
}

/**
 * 解析一篇文章。缺少 title 时返回 null，视为说明文件而不是文章。
 *
 * @param {string} raw frontmatter + 正文
 * @param {{ filePath: string, mtimeMs: number }} context
 */
export function parsePost(raw, { filePath, mtimeMs }) {
  const { data, content, excerpt } = matter(raw, {
    excerpt: true,
    excerpt_separator: '<!-- more -->',
  })
  if (!data.title) return null

  const slug = path.basename(filePath).replace(/\.md$/, '')
  const tags = Array.isArray(data.tags) ? data.tags : []

  return {
    data,
    content,
    excerpt,
    slug,
    // 没有 date 时回退到文件修改时间，与旧版行为保持一致。
    date: +new Date(data.date) || mtimeMs,
    tags,
    cover: data.cover === false ? '' : (data.cover || `/covers/${slug}.svg`),
    type: data.type || inferPostType(tags, data.title),
  }
}

export function readPost(filePath, mtimeMs) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const timestamp = mtimeMs ?? Math.floor(fs.statSync(filePath).mtimeMs)
  return parsePost(raw, { filePath, mtimeMs: timestamp })
}

/**
 * 按发布日期倒序返回文章元信息，附带文件名供 RSS 读取 Git 更新时间。
 */
export function loadPosts(postsDir) {
  return listPostFiles(postsDir)
    .map((file) => {
      const parsed = readPost(path.join(postsDir, file))
      return parsed ? { ...parsed, file, title: parsed.data.title } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.date - a.date)
}
