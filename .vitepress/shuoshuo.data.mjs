/**
 * 说说数据加载器（与 shuoshuo/index.md 共享同一数据源）
 */
import { parseShuoshuo } from './content-parsers.mjs'

export default {
  watch: ['shuoshuo/*.md'],
  load() {
    return parseShuoshuo(process.cwd()).map(({ date, year, displayDate, content, tag, tagType }) => ({
      date,
      year,
      displayDate,
      content,
      tag,
      tagType,
    }))
  },
}
