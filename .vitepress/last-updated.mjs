/**
 * 读取文件在 Git 中的最后一次提交时间。
 *
 * 之前页面上的“更新于”直接复用发布日期，看起来永远是同一天；
 * 这里改用真实的提交时间，没有 Git 环境（例如下载的压缩包）时返回 null，
 * 由调用方决定不显示该字段。结果按文件路径缓存，避免重复调用 git。
 */
import { execFileSync } from 'node:child_process'

let fileDatesCache = null

function loadGitFileDates() {
  if (fileDatesCache) return fileDatesCache
  const map = new Map()
  try {
    const output = execFileSync(
      'git',
      ['-c', 'core.quotePath=false', 'log', '--format=__COMMIT__%cI', '--name-only'],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        maxBuffer: 16 * 1024 * 1024,
      },
    )
    let currentDate = null
    for (const rawLine of output.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line) continue
      if (line.startsWith('__COMMIT__')) {
        currentDate = line.slice('__COMMIT__'.length)
      } else if (currentDate && !map.has(line)) {
        map.set(line, currentDate)
      }
    }
  } catch {
    // 非 Git 环境（如源码压缩包）保持空映射
  }
  fileDatesCache = map
  return map
}

export function gitLastUpdated(relativePath) {
  if (!relativePath) return null
  const normalized = String(relativePath).replaceAll('\\', '/').replace(/^\.\//, '')
  return loadGitFileDates().get(normalized) ?? null
}
