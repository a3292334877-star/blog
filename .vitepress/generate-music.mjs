/**
 * 构建时预取歌曲元数据（不含 mp3 地址，mp3 运行时动态解析）
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
    proxyUrl: song.url,  // 代理链接，运行时 fetch 获取真实地址
    cover: song.pic || song.cover || '',
    lrc: song.lrc || '',
    generated: new Date().toISOString(),
  }

  writeFileSync('public/music.json', JSON.stringify(musicData, null, 2), 'utf-8')
  console.log(`  ✓ 歌曲数据已缓存: ${musicData.name} - ${musicData.artist}`)
} catch (e) {
  console.warn(`  ⚠ 歌曲数据获取失败 (${e.message})，使用兜底数据`)
  const fallback = {
    name: '春日影 (MyGO!!!!! ver.)',
    artist: 'MyGO!!!!!',
    proxyUrl: `https://api.injahow.cn/meting/?server=netease&type=url&id=${SONG_ID}`,
    cover: `https://api.injahow.cn/meting/?server=netease&type=pic&id=${SONG_ID}`,
    lrc: '',
    generated: new Date().toISOString(),
  }
  writeFileSync('public/music.json', JSON.stringify(fallback, null, 2), 'utf-8')
}
