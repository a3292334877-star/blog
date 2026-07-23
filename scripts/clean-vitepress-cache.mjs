import fs from 'node:fs'
import path from 'node:path'

const cacheDir = path.resolve(process.cwd(), '.vitepress/cache')

fs.rmSync(cacheDir, { recursive: true, force: true })
console.log('✓ 已清理 VitePress 构建缓存')
