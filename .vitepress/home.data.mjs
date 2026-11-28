/**
 * 首页聚合数据加载器
 * 解析 anime/、shuoshuo/、projects/ 目录，给首页预览组件用
 */
import { parseAnime, parseProjects, parseShuoshuo } from './content-parsers.mjs'

export default {
  watch: ['anime/*.md', 'shuoshuo/*.md', 'projects/*.md'],
  load() {
    const cwd = process.cwd()
    return {
      anime: parseAnime(cwd)
        .slice(0, 6)
        .map(({ name, year, remark }) => ({ name, year, remark })),
      shuoshuo: parseShuoshuo(cwd)
        .slice(0, 3)
        .map(({ date, content }) => ({ date, content })),
      projects: parseProjects(cwd).slice(0, 3),
    }
  },
}
