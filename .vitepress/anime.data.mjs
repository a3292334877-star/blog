/**
 * 追番数据加载器（与 anime/index.md 共享同一数据源）
 */
import { parseAnime } from './content-parsers.mjs'

export default {
  watch: ['anime/*.md'],
  load() {
    return parseAnime(process.cwd())
  },
}
