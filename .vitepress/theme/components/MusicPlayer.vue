<template>
  <div class="music-player-root">
    <Transition name="lyrics-pop">
      <div
        v-if="lyricsMode === 'pill'"
        class="lyrics-pill"
        role="region"
        aria-label="当前歌词"
      >
        <button
          class="lyrics-pill-body"
          type="button"
          title="展开完整歌词"
          @click="lyricsMode = 'drawer'"
        >
          <span class="lyrics-pill-badge" :class="{ active: playing }">♪</span>
          <span class="lyrics-pill-text">
            <span class="lyrics-pill-main">{{ pillMainText }}</span>
            <span v-if="pillSubText" class="lyrics-pill-sub">{{ pillSubText }}</span>
          </span>
        </button>
        <button
          class="lyrics-mini-btn"
          type="button"
          aria-label="展开歌词面板"
          title="展开歌词面板"
          @click="lyricsMode = 'drawer'"
        >⤢</button>
        <button
          class="lyrics-mini-btn"
          type="button"
          aria-label="关闭歌词"
          title="关闭歌词"
          @click="closeLyrics"
        >×</button>
      </div>
    </Transition>

    <Transition name="lyrics-pop">
      <section
        v-if="lyricsMode === 'drawer'"
        class="lyrics-drawer"
        aria-label="歌曲歌词面板"
      >
        <header class="lyrics-header">
          <div class="lyrics-meta">
            <strong class="lyrics-title">{{ songMeta.name }}</strong>
            <span class="lyrics-artist">{{ songMeta.artist }}</span>
          </div>
          <div class="lyrics-header-actions">
            <button
              class="lyrics-icon-btn"
              type="button"
              :aria-label="playing ? '暂停' : '播放'"
              :title="playing ? '暂停' : '播放'"
              @click="toggle"
            >{{ buffering ? '⟳' : (playing ? '⏸' : '▶') }}</button>
            <button
              class="lyrics-icon-btn"
              type="button"
              aria-label="收起为悬浮词条"
              title="收起为悬浮词条"
              @click="lyricsMode = 'pill'"
            >—</button>
            <button
              class="lyrics-icon-btn"
              type="button"
              aria-label="关闭歌词"
              title="关闭歌词"
              @click="closeLyrics"
            >×</button>
          </div>
        </header>

        <div class="lyrics-progress-row">
          <span class="lyrics-time">{{ formatClock(currentTime) }}</span>
          <input
            class="lyrics-seek"
            type="range"
            min="0"
            :max="duration || 1"
            step="0.1"
            :value="currentTime"
            :disabled="!duration"
            aria-label="播放进度"
            @input="onSeekInput"
          >
          <span class="lyrics-time">{{ formatClock(duration) }}</span>
        </div>

        <div ref="scrollBox" class="lyrics-scroll">
          <p v-if="lyricsLoading" class="lyrics-empty">歌词加载中…</p>
          <p v-else-if="lyricsError" class="lyrics-empty">暂无歌词内容</p>
          <template v-else>
            <button
              v-for="(line, index) in displayLines"
              :key="`${line.time}-${index}`"
              :ref="(el) => setLineRef(line.index, el)"
              class="lyrics-line"
              :class="{ active: line.index === activeIndex, past: line.index < activeIndex }"
              type="button"
              @click="seekTo(line.time)"
            >
              <span class="lyrics-line-main">{{ line.main }}</span>
              <span v-if="line.sub" class="lyrics-line-sub">{{ line.sub }}</span>
            </button>
          </template>
        </div>
      </section>
    </Transition>

    <button
      class="lyrics-toggle"
      :class="{ active: lyricsMode !== 'hidden' }"
      :title="lyricsMode === 'hidden' ? '显示歌词' : '切换歌词显示'"
      :aria-label="lyricsMode === 'hidden' ? '显示歌词' : '切换歌词显示'"
      :aria-expanded="lyricsMode === 'drawer'"
      type="button"
      @click.stop="toggleLyricsMode"
    >词</button>

    <button
      class="music-toggle"
      :class="{ playing: playing, buffering: buffering }"
      :title="buffering ? '加载中...' : (playing ? '暂停' : '♪ 播放')"
      :aria-label="buffering ? '音乐加载中' : (playing ? '暂停背景音乐' : '播放背景音乐')"
      :aria-pressed="playing"
      type="button"
      @click.stop="toggle"
    >
      <span class="music-icon">{{ buffering ? '⟳' : '♪' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { withBase } from 'vitepress'

interface LyricLine {
  index: number
  time: number
  main: string
  sub: string
}

type LyricsMode = 'hidden' | 'pill' | 'drawer'

const playing = ref(false)
const buffering = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const lyricsMode = ref<LyricsMode>('hidden')
const lyricsDismissed = ref(false)
const lyricsLoading = ref(false)
const lyricsError = ref(false)
const lyrics = ref<LyricLine[]>([])
const songMeta = ref({ name: '春日影 (MyGO!!!!! ver.)', artist: 'MyGO!!!!!' })
const scrollBox = ref<HTMLElement | null>(null)
const lineRefs = new Map<number, HTMLElement>()

let audio: HTMLAudioElement | null = null
let sourceAttached = false
let lyricsLoaded = false

function splitLyricText(rawText: string): { main: string; sub: string } {
  const text = rawText.trim()
  if (!text) return { main: '', sub: '' }
  if (/^(?:作词|作曲|编曲|制作人|混音|录音)\s*[:：]/.test(text)) {
    return { main: text, sub: '' }
  }
  const match = text.match(/^(.+?)\s+\(([^()]+)\)$/)
  if (match) {
    return { main: match[1].trim(), sub: match[2].trim() }
  }
  return { main: text, sub: '' }
}

function parseLrc(raw: string): LyricLine[] {
  const parsed: Array<{ time: number; main: string; sub: string }> = []
  let offsetSec = 0

  for (const line of raw.split(/\r?\n/)) {
    const offsetMatch = line.match(/^\[offset:([+-]?\d+)\]/i)
    if (offsetMatch) {
      offsetSec = Number(offsetMatch[1]) / 1000
      continue
    }
    const timestamps = [...line.matchAll(/\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]/g)]
    if (!timestamps.length) continue
    const content = line.replace(/\[[^\]]+\]/g, '').trim()
    const { main, sub } = splitLyricText(content)
    for (const ts of timestamps) {
      const min = Number(ts[1])
      const sec = Number(ts[2])
      const frac = ts[3] ? Number(ts[3].padEnd(3, '0')) / 1000 : 0
      const time = Math.max(0, min * 60 + sec + frac + offsetSec)
      parsed.push({ time, main, sub })
    }
  }

  parsed.sort((a, b) => a.time - b.time)
  return parsed.map((item, index) => ({ index, ...item }))
}

const displayLines = computed(() => lyrics.value.filter((line) => line.main.length > 0))

const activeIndex = computed(() => {
  const list = lyrics.value
  if (!list.length) return -1
  const now = currentTime.value + 0.15
  let low = 0
  let high = list.length - 1
  let match = -1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (list[mid].time <= now) {
      match = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return match
})

const activeLine = computed(() => (activeIndex.value >= 0 ? lyrics.value[activeIndex.value] : null))

const pillMainText = computed(() => {
  if (lyricsLoading.value) return '正在加载歌词…'
  if (activeLine.value?.main) return activeLine.value.main
  if (playing.value && lyrics.value.length) return `♪ 间奏中 · ${songMeta.value.name}`
  return `${songMeta.value.name} · ${songMeta.value.artist}`
})

const pillSubText = computed(() => {
  if (activeLine.value?.main) return activeLine.value.sub
  return playing.value ? '点击展开完整歌词' : '点击查看或点选歌词播放'
})

function setLineRef(index: number, el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLElement) lineRefs.set(index, el)
  else lineRefs.delete(index)
}

function scrollToActive(smooth = true) {
  const box = scrollBox.value
  const activeEl = lineRefs.get(activeIndex.value)
  if (!box || !activeEl) return
  const targetTop = activeEl.offsetTop - box.clientHeight / 2 + activeEl.clientHeight / 2
  box.scrollTo({
    top: Math.max(0, targetTop),
    behavior: smooth ? 'smooth' : 'auto',
  })
}

watch(activeIndex, () => {
  if (lyricsMode.value === 'drawer') nextTick(() => scrollToActive(true))
})

watch(lyricsMode, (mode) => {
  if (mode === 'drawer') nextTick(() => scrollToActive(false))
})

async function ensureLyricsLoaded() {
  if (lyricsLoaded || lyricsLoading.value) return
  lyricsLoading.value = true
  lyricsError.value = false
  try {
    const [lrcRes, metaRes] = await Promise.all([
      fetch(withBase('/music.lrc')),
      fetch(withBase('/music.json')).catch(() => null),
    ])
    if (metaRes?.ok) {
      const meta = await metaRes.json().catch(() => null)
      if (meta?.name) songMeta.value = { name: String(meta.name), artist: String(meta.artist || '') }
    }
    if (!lrcRes.ok) throw new Error(`HTTP ${lrcRes.status}`)
    const raw = await lrcRes.text()
    lyrics.value = parseLrc(raw)
    if (!lyrics.value.length) throw new Error('empty lrc')
    lyricsLoaded = true
  } catch {
    lyricsError.value = true
  } finally {
    lyricsLoading.value = false
  }
}

function attachAudioSource() {
  if (!audio || sourceAttached) return
  audio.src = withBase('/music.mp3')
  sourceAttached = true
}

const onPlay = () => { playing.value = true; buffering.value = false }
const onPause = () => { playing.value = false }
const onEnded = () => { playing.value = false }
const onWaiting = () => { buffering.value = true }
const onCanPlay = () => { buffering.value = false }
const onTimeUpdate = () => { if (audio) currentTime.value = audio.currentTime }
const onDurationChange = () => {
  if (audio && Number.isFinite(audio.duration)) duration.value = audio.duration
}
const onError = (e: Event) => {
  console.error('音乐加载失败:', audio?.error?.message || e)
  playing.value = false
  buffering.value = false
}

onMounted(() => {
  // 不在首屏设置 src；只有用户主动播放时才开始请求 4MB+ 音频。
  audio = new Audio()
  audio.loop = true
  audio.preload = 'none'
  audio.addEventListener('play', onPlay)
  audio.addEventListener('pause', onPause)
  audio.addEventListener('ended', onEnded)
  audio.addEventListener('waiting', onWaiting)
  audio.addEventListener('canplay', onCanPlay)
  audio.addEventListener('timeupdate', onTimeUpdate)
  audio.addEventListener('durationchange', onDurationChange)
  audio.addEventListener('loadedmetadata', onDurationChange)
  audio.addEventListener('error', onError)
})

onUnmounted(() => {
  if (!audio) return
  audio.pause()
  audio.removeEventListener('play', onPlay)
  audio.removeEventListener('pause', onPause)
  audio.removeEventListener('ended', onEnded)
  audio.removeEventListener('waiting', onWaiting)
  audio.removeEventListener('canplay', onCanPlay)
  audio.removeEventListener('timeupdate', onTimeUpdate)
  audio.removeEventListener('durationchange', onDurationChange)
  audio.removeEventListener('loadedmetadata', onDurationChange)
  audio.removeEventListener('error', onError)
  audio.src = ''
  audio = null
})

function startPlayback() {
  if (!audio) return
  attachAudioSource()
  void ensureLyricsLoaded()
  if (lyricsMode.value === 'hidden' && !lyricsDismissed.value) {
    lyricsMode.value = 'pill'
  }
  buffering.value = true
  audio.play().then(() => {
    buffering.value = false
  }).catch((e) => {
    console.error('音乐播放失败:', e)
    playing.value = false
    buffering.value = false
  })
}

function toggle() {
  if (!audio) return
  if (audio.paused) {
    startPlayback()
  } else {
    audio.pause()
  }
}

function toggleLyricsMode() {
  void ensureLyricsLoaded()
  if (lyricsMode.value === 'hidden') {
    lyricsDismissed.value = false
    lyricsMode.value = 'drawer'
  } else if (lyricsMode.value === 'pill') {
    lyricsMode.value = 'drawer'
  } else {
    closeLyrics()
  }
}

function closeLyrics() {
  lyricsDismissed.value = true
  lyricsMode.value = 'hidden'
}

function seekTo(time: number) {
  if (!audio) return
  attachAudioSource()
  const seekAndPlay = () => {
    if (!audio) return
    audio.currentTime = time
    currentTime.value = time
    if (audio.paused) startPlayback()
  }
  if (audio.readyState >= 1) {
    seekAndPlay()
  } else {
    audio.addEventListener('loadedmetadata', seekAndPlay, { once: true })
    startPlayback()
  }
}

function onSeekInput(event: Event) {
  if (!audio) return
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  if (!Number.isFinite(value)) return
  audio.currentTime = value
  currentTime.value = value
}

function formatClock(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>

<style scoped>
.music-toggle,
.lyrics-toggle {
  position: fixed;
  bottom: 32px;
  z-index: 101;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.music-toggle {
  right: 88px;
  font-size: 22px;
}
.lyrics-toggle {
  right: 140px;
  font-size: 14px;
  font-weight: 700;
}
.music-toggle:hover,
.lyrics-toggle:hover,
.lyrics-toggle.active {
  color: var(--sakura-deep);
  border-color: var(--sakura-pink);
  box-shadow: 0 4px 16px rgba(232, 138, 154, 0.25);
}
.music-toggle.playing {
  border-color: var(--sakura-pink);
  color: var(--sakura-deep);
  box-shadow: 0 0 16px rgba(255, 183, 197, 0.4);
}
.music-toggle.playing .music-icon {
  animation: music-spin 3s linear infinite;
}
.music-toggle.buffering .music-icon {
  animation: music-spin 0.8s linear infinite;
  opacity: 0.7;
}

.lyrics-pill {
  position: fixed;
  right: 32px;
  bottom: 88px;
  z-index: 102;
  max-width: min(360px, calc(100vw - 32px));
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px 6px 10px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--sakura-pink) 55%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: var(--site-shadow-lg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.lyrics-pill-body {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 4px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.lyrics-pill-badge {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--accent-color);
  background: var(--sakura-light);
}
.lyrics-pill-badge.active {
  animation: music-spin 4s linear infinite;
}
.lyrics-pill-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lyrics-pill-main {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lyrics-pill-sub {
  font-size: 11px;
  line-height: 1.3;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lyrics-mini-btn,
.lyrics-icon-btn {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}
.lyrics-mini-btn:hover,
.lyrics-icon-btn:hover {
  background: var(--sakura-light);
  color: var(--accent-color);
}

.lyrics-drawer {
  position: fixed;
  right: 32px;
  bottom: 88px;
  z-index: 102;
  width: min(360px, calc(100vw - 32px));
  max-height: min(440px, calc(100vh - 140px));
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--sakura-pink) 50%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  box-shadow: var(--site-shadow-lg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;
}
.lyrics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.lyrics-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lyrics-title {
  font-size: 14px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lyrics-artist {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.lyrics-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.lyrics-progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 60%, transparent);
}
.lyrics-time {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  flex-shrink: 0;
}
.lyrics-seek {
  flex: 1;
  height: 4px;
  accent-color: var(--accent-color);
  cursor: pointer;
}
.lyrics-seek:disabled {
  cursor: default;
  opacity: 0.5;
}
.lyrics-scroll {
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  padding: 12px 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lyrics-empty {
  margin: auto;
  padding: 24px 12px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: center;
}
.lyrics-line {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}
.lyrics-line:hover {
  background: var(--sakura-light);
}
.lyrics-line-main {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}
.lyrics-line-sub {
  font-size: 11.5px;
  line-height: 1.4;
  color: var(--vp-c-text-3);
}
.lyrics-line.past .lyrics-line-main {
  color: var(--vp-c-text-3);
}
.lyrics-line.active {
  background: color-mix(in srgb, var(--sakura-light) 85%, transparent);
}
.lyrics-line.active .lyrics-line-main {
  color: var(--accent-color);
  font-weight: 700;
}
.lyrics-line.active .lyrics-line-sub {
  color: var(--vp-c-text-2);
}

.lyrics-pop-enter-active,
.lyrics-pop-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.lyrics-pop-enter-from,
.lyrics-pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .music-toggle { bottom: 24px; right: 76px; width: 40px; height: 40px; font-size: 18px; }
  .lyrics-toggle { bottom: 24px; right: 124px; width: 40px; height: 40px; font-size: 13px; }
  .lyrics-pill,
  .lyrics-drawer {
    right: 16px;
    left: 16px;
    bottom: 74px;
    width: auto;
    max-width: none;
  }
}
</style>
