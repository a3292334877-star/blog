/**
 * 构建时预取歌曲数据，避免运行时依赖外部 API
 */
import { writeFileSync } from 'fs'

const SONG_ID = '2097486090'
const API_URL = `https://api.injahow.cn/meting/?server=netease&type=song&id=${SONG_ID}`

try {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('empty')

  const song = data[0]
  const musicData = {
    name: song.name || song.title || '未知歌曲',
    artist: song.artist || song.author || '未知歌手',
    url: song.url,       // 音频代理链接（重定向到网易CDN）
    cover: song.pic || song.cover || '',
    lrc: song.lrc || '',
    generated: new Date().toISOString(),
  }

  writeFileSync('public/music.json', JSON.stringify(musicData, null, 2), 'utf-8')
  console.log(`  ✓ 歌曲数据已缓存: ${musicData.name} - ${musicData.artist}`)
} catch (e) {
  console.warn(`  ⚠ 歌曲数据获取失败 (${e.message})，使用兜底数据`)
  // 兜底：写入基本数据，URL 用代理链接拼接线
  const fallback = {
    name: '春日影 (MyGO!!!!! ver.)',
    artist: 'MyGO!!!!!',
    url: `https://api.injahow.cn/meting/?server=netease&type=url&id=${SONG_ID}`,
    cover: `https://api.injahow.cn/meting/?server=netease&type=pic&id=${SONG_ID}`,
    lrc: '',
    generated: new Date().toISOString(),
  }
  writeFileSync('public/music.json', JSON.stringify(fallback, null, 2), 'utf-8')
}
