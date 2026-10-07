/**
 * 读取文件在 Git 中的最后一次提交时间。
 *
 * 之前页面上的“更新于”直接复用发布日期，看起来永远是同一天；
 * 这里改用真实的提交时间，没有 Git 环境（例如下载的压缩包）时返回 null，
 * 由调用方决定不显示该字段。结果按文件路径缓存，避免重复调用 git。
 */
import { execFileSync } from 'node:child_process'

const cache = new Map()

export function gitLastUpdated(relativePath) {
  if (!relativePath) return null
  if (cache.has(relativePath)) return cache.get(relativePath)

  let value = null
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (output) value = output
  } catch {
    value = null
  }

  cache.set(relativePath, value)
  return value
}
