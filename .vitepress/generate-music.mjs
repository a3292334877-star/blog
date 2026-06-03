/**
 * 构建时下载完整 mp3 到 public/music.mp3
 * 彻底消除浏览器运行时走代理重定向导致的音频截断问题
 */
import { writeFileSync } from 'node:fs'

const SONG_ID = '2097486090'
const API_URL = `https://api.injahow.cn/meting/?server=netease&type=song&id=${SONG_ID}`

try {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('empty')
  const song = data[0]

  // 下载 mp3 到本地
  const audioRes = await fetch(song.url, { redirect: 'follow' })
  if (!audioRes.ok) throw new Error(`mp3 download ${audioRes.status}`)
  const buf = Buffer.from(await audioRes.arrayBuffer())
  writeFileSync('public/music.mp3', buf)
  console.log(`  ✓ mp3 已下载: ${(buf.length / 1024).toFixed(0)} KB`)

  // 写元数据
  writeFileSync('public/music.json', JSON.stringify({
    name: song.name || '未知歌曲',
    artist: song.artist || '未知歌手',
    url: '/blog/music.mp3',
    cover: song.pic || '',
    generated: new Date().toISOString(),
  }, null, 2), 'utf-8')
  console.log(`  ✓ 歌曲: ${song.name} - ${song.artist}`)
} catch (e) {
  console.warn(`  ⚠ 歌曲获取失败 (${e.message})，使用兜底`)
  writeFileSync('public/music.json', JSON.stringify({
    name: '春日影 (MyGO!!!!! ver.)',
    artist: 'MyGO!!!!!',
    url: '/blog/music.mp3',
    cover: '',
    generated: new Date().toISOString(),
  }, null, 2), 'utf-8')
}
