/**
 * 构建时下载 mp3 到 public/music.mp3
 * 如果已手动放入完整 mp3（>1MB）则跳过下载
 */
import { existsSync, statSync, writeFileSync } from 'node:fs'

const SONG_ID = 2097486090
const DEST = 'public/music.mp3'

// 已存在完整文件 → 跳过
if (existsSync(DEST) && statSync(DEST).size > 1024 * 1024) {
  console.log(`  ✓ music.mp3 已存在 (${(statSync(DEST).size / 1024).toFixed(0)} KB)，跳过下载`)
} else {
  const API = `https://api.injahow.cn/meting/?server=netease&type=song&id=${SONG_ID}`
  try {
    const res = await fetch(API)
    const [song] = await res.json()
    if (!song) throw new Error('empty')

    const audio = await fetch(song.url, { redirect: 'follow' })
    const buf = Buffer.from(await audio.arrayBuffer())
    writeFileSync(DEST, buf)
    console.log(`  ✓ mp3 已下载: ${(buf.length / 1024).toFixed(0)} KB - ${song.name}`)
  } catch (e) {
    console.warn(`  ⚠ mp3 下载失败: ${e.message}`)
  }
}
