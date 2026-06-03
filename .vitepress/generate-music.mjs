/**
 * 构建时预取歌曲数据 + 解析最终 mp3 地址
 * 避免浏览器走代理重定向导致音频被截断/跳回开头
 */
import { writeFileSync } from 'fs'

const SONG_ID = '2097486090'
const API_URL = `https://api.injahow.cn/meting/?server=netease&type=song&id=${SONG_ID}`

async function resolveAudioUrl(proxyUrl) {
  // 用 HEAD + redirect: 'manual' 只拿重定向地址，不下载整个mp3
  const res = await fetch(proxyUrl, { method: 'HEAD', redirect: 'manual' })
  const location = res.headers.get('location')
  return location || proxyUrl
}

try {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('empty')

  const song = data[0]

  // 解析出真实的 mp3 URL（绕过代理重定向）
  let realUrl = song.url
  try {
    realUrl = await resolveAudioUrl(song.url)
    console.log(`  ✓ mp3 地址已解析: ${realUrl.slice(0, 80)}...`)
  } catch {
    console.warn(`  ⚠ mp3 解析失败，使用代理链接`)
  }

  const musicData = {
    name: song.name || song.title || '未知歌曲',
    artist: song.artist || song.author || '未知歌手',
    url: realUrl,
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
    url: `https://api.injahow.cn/meting/?server=netease&type=url&id=${SONG_ID}`,
    cover: `https://api.injahow.cn/meting/?server=netease&type=pic&id=${SONG_ID}`,
    lrc: '',
    generated: new Date().toISOString(),
  }
  writeFileSync('public/music.json', JSON.stringify(fallback, null, 2), 'utf-8')
}
