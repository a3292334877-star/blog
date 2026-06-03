/**
 * 生成歌曲元数据（供 RSS 等使用）
 */
import { writeFileSync } from 'node:fs'

writeFileSync('public/music.json', JSON.stringify({
  name: '春日影 (MyGO!!!!! ver.)',
  artist: 'MyGO!!!!!',
  songId: 2097486090,
}, null, 2), 'utf-8')
console.log('  ✓ 歌曲元数据已写入')
