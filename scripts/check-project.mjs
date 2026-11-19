import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import matter from 'gray-matter'
import { SITE } from '../.vitepress/site.constants.mjs'

const root = resolve(import.meta.dirname, '..')
const errors = []

function fail(message) {
  errors.push(message)
}

function filesUnder(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  })
}

function checkLocalAsset(source, label) {
  if (!source || /^(?:https?:|data:)/.test(source)) return
  const sitePath = source.startsWith(SITE.base) ? source.slice(SITE.base.length) : source
  const relativePath = sitePath.replace(/^\//, '')
  const target = join(root, 'public', relativePath)
  if (!existsSync(target)) fail(`${label}: missing public/${relativePath}`)
  else if (statSync(target).size === 0) fail(`${label}: empty public/${relativePath}`)
}

const postsDir = join(root, 'posts')
for (const file of filesUnder(postsDir).filter((path) => extname(path) === '.md')) {
  if (file === join(postsDir, 'index.md')) continue
  const name = relative(root, file).replaceAll('\\', '/')
  let data
  try {
    data = matter(readFileSync(file, 'utf8')).data
  } catch (error) {
    fail(`${name}: invalid frontmatter (${error.message})`)
    continue
  }
  if (typeof data.title !== 'string' || !data.title.trim()) fail(`${name}: missing title`)
  if (!data.date || Number.isNaN(new Date(data.date).valueOf())) fail(`${name}: invalid date`)
  // 不能按 '/' 切分：Windows 上路径分隔符是 '\\'，会把整条绝对路径当成 slug。
  const slug = basename(file).replace(/\.md$/, '')
  const cover = data.cover === false ? null : (data.cover || `/covers/${slug}.svg`)
  if (cover) checkLocalAsset(String(cover), `${name} cover`)
}

const modelPath = join(root, 'public', 'live2d', 'model.json')
try {
  const model = JSON.parse(readFileSync(modelPath, 'utf8'))
  const references = [model.model, model.physics, ...(model.textures ?? [])]
  for (const reference of references) {
    if (!reference) continue
    const target = join(dirname(modelPath), reference)
    const label = `Live2D ${relative(root, target).replaceAll('\\', '/')}`
    if (!existsSync(target)) fail(`${label}: missing`)
    else if (statSync(target).size === 0) fail(`${label}: empty`)
  }
} catch (error) {
  fail(`public/live2d/model.json: ${error.message}`)
}

/** 校验 public 下的站点绝对路径是否存在且非空。 */
function checkPublicPath(sitePath, label) {
  if (!sitePath || !String(sitePath).startsWith('/')) return
  const relativePath = String(sitePath).replace(/^\//, '').replace(/\/$/, '/index.html')
  const target = join(root, 'public', relativePath)
  if (!existsSync(target)) fail(`${label}: missing public/${relativePath}`)
  else if (statSync(target).size === 0) fail(`${label}: empty public/${relativePath}`)
}

// 轻译 PWA：manifest 图标与 service worker 预缓存文件必须真实存在。
const translateManifest = join(root, 'public', 'translate', 'manifest.webmanifest')
try {
  const manifest = JSON.parse(readFileSync(translateManifest, 'utf8'))
  const icons = Array.isArray(manifest.icons) ? manifest.icons : []
  if (!icons.length) fail('translate manifest: missing icons')
  for (const icon of icons) checkPublicPath(icon?.src, 'translate manifest icon')
} catch (error) {
  fail(`public/translate/manifest.webmanifest: ${error.message}`)
}

const serviceWorkerPath = join(root, 'public', 'translate', 'sw.js')
try {
  const source = readFileSync(serviceWorkerPath, 'utf8')
  const shell = source.match(/const SHELL\s*=\s*\[([\s\S]*?)\]/)
  if (!shell) fail('public/translate/sw.js: SHELL list not found')
  else {
    for (const entry of shell[1].matchAll(/["']([^"']+)["']/g)) {
      checkPublicPath(entry[1], 'translate service worker shell')
    }
  }
} catch (error) {
  fail(`public/translate/sw.js: ${error.message}`)
}

if (errors.length) {
  console.error(`Project check failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Project check passed.')
}
