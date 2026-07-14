import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, '.vitepress', 'dist')
const errors = []

function fail(message) { errors.push(message) }

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  })
}

if (!existsSync(dist)) {
  fail('missing .vitepress/dist')
} else {
  for (const required of ['index.html', 'CNAME', 'robots.txt', 'sitemap.xml', 'feed.xml']) {
    const target = join(dist, required)
    if (!existsSync(target) || statSync(target).size === 0) fail(`missing or empty ${required}`)
  }

  const homepagePath = join(dist, 'index.html')
  if (existsSync(homepagePath)) {
    const homepage = readFileSync(homepagePath, 'utf8')
    const requiredFragments = [
      '<link rel="canonical" href="https://sakikoblog.info/">',
      '<meta property="og:url" content="https://sakikoblog.info/">',
      '<meta property="og:image" content="https://sakikoblog.info/avatar.jpg">',
    ]
    for (const fragment of requiredFragments) {
      if (!homepage.includes(fragment)) fail(`homepage is missing ${fragment}`)
    }
  }

  const files = filesUnder(dist)
  const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0)
  const maxTotalBytes = 10.5 * 1024 * 1024
  if (totalBytes > maxTotalBytes) {
    fail(`build size ${(totalBytes / 1024 / 1024).toFixed(2)} MB exceeds 10.5 MB budget`)
  }

  const maxJavaScriptBytes = 300 * 1024
  for (const file of files.filter((file) => extname(file) === '.js')) {
    const size = statSync(file).size
    if (size > maxJavaScriptBytes) {
      fail(`${relative(dist, file)} is ${(size / 1024).toFixed(1)} KB; limit is 300 KB`)
    }
  }

  console.log(`  ✓ build budget: ${(totalBytes / 1024 / 1024).toFixed(2)} MB across ${files.length} files`)
}

if (errors.length) {
  console.error(`Build check failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Build output check passed.')
}
