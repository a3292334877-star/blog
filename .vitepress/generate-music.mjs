/**
 * 构建时从网易云下载 mp3 到 public/music.mp3
 */
import { writeFileSync } from 'node:fs'

const SONG_ID = 2097486090
const API = `https://api.injahow.cn/meting/?server=netease&type=song&id=${SONG_ID}`

try {
  const res = await fetch(API)
  const [song] = await res.json()
  if (!song) throw new Error('empty')

  // 下载 mp3
  const audio = await fetch(song.url, { redirect: 'follow' })
  const buf = Buffer.from(await audio.arrayBuffer())
  writeFileSync('public/music.mp3', buf)
  console.log(`  ✓ mp3 已下载: ${(buf.length / 1024).toFixed(0)} KB - ${song.name}`)
} catch (e) {
  console.warn(`  ⚠ mp3 下载失败: ${e.message}`)
}
