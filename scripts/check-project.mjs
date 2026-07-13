import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
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
  if (data.cover) checkLocalAsset(String(data.cover), `${name} cover`)
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

if (errors.length) {
  console.error(`Project check failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Project check passed.')
}
