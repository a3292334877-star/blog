/**
 * 构建时同步 public/music.mp3 与 public/music.lrc
 * 如果已手动放入完整 mp3（>1MB）则跳过下载
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'

let SONG_ID = 2097486090
try {
  const meta = JSON.parse(readFileSync('public/music.json', 'utf8'))
  if (meta?.songId) SONG_ID = meta.songId
} catch { /* 回退默认曲目 ID */ }

const DEST = 'public/music.mp3'
const LRC_DEST = 'public/music.lrc'

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

if (!existsSync(LRC_DEST) || statSync(LRC_DEST).size === 0) {
  const LRC_API = `https://api.injahow.cn/meting/?server=netease&type=lrc&id=${SONG_ID}`
  try {
    const res = await fetch(LRC_API)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const lrc = (await res.text()).replace(/\r\n/g, '\n').trim()
    if (!lrc) throw new Error('empty')
    writeFileSync(LRC_DEST, `${lrc}\n`, 'utf8')
    console.log(`  ✓ music.lrc 已下载 (${Buffer.byteLength(lrc, 'utf8')} B)`)
  } catch (e) {
    console.warn(`  ⚠ music.lrc 下载失败: ${e.message}`)
  }
}
