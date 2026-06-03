<template>
  <Transition name="panel">
    <div v-if="showPanel" class="music-panel" @click.stop>
      <div v-if="status === 'loading'" class="panel-status">
        <span class="loading-spinner" />
        <p>加载中...</p>
      </div>
      <div v-else-if="status === 'error'" class="panel-status error">
        <p>😿 加载失败</p>
        <button class="retry-btn" @click.stop="retry">重试</button>
      </div>
      <div ref="playerContainer" class="aplayer-container" :class="{ hidden: status !== 'ready' }" />
    </div>
  </Transition>

  <button
    class="music-toggle"
    :class="{ playing: isPlaying }"
    :title="isPlaying ? '暂停' : '播放'"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// ============================================================
// 歌曲配置
// ============================================================
const SONG_ID = '2097486090'
const API_BASE = 'https://api.injahow.cn/meting/'

declare global {
  interface Window {
    APlayer: any
  }
}

// --- State ---
const showPanel = ref(false)
const isPlaying = ref(false)
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const playerContainer = ref<HTMLElement | null>(null)

let ap: any = null

// --- 加载 APlayer ---
async function loadAPlayer(): Promise<void> {
  if (window.APlayer) return

  if (!document.querySelector('link[data-music="aplayer"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.css'
    link.setAttribute('data-music', 'aplayer')
    document.head.appendChild(link)
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('CDN 加载失败'))
    document.head.appendChild(script)
  })
}

// --- 获取歌曲 ---
async function fetchSong(): Promise<any> {
  const url = `${API_BASE}?server=netease&type=song&id=${SONG_ID}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('空数据')
  return data[0]
}

// --- 初始化 ---
async function init(): Promise<void> {
  if (status.value === 'ready') return
  status.value = 'loading'

  try {
    const [song] = await Promise.all([fetchSong(), loadAPlayer()])
    if (!playerContainer.value) return

    ap = new window.APlayer({
      container: playerContainer.value,
      mini: false,
      loop: 'one',
      volume: 0.7,
      preload: 'auto',
      autoplay: false,
      mutex: true,
      lrcType: 0,
      audio: [{
        name: song.name || song.title || '春日影',
        artist: song.artist || song.author || 'MyGO!!!!!',
        url: song.url,
        cover: song.cover || song.pic,
        lrc: song.lrc || '',
      }],
    })

    ap.on('play', () => { isPlaying.value = true })
    ap.on('pause', () => { isPlaying.value = false })
    status.value = 'ready'

    // 初始化后自动播放
    ap.play()
  } catch (e) {
    console.error('BGM 加载失败:', e)
    status.value = 'error'
  }
}

async function retry(): Promise<void> {
  if (ap) ap.destroy(); ap = null
  status.value = 'idle'
  await init()
}

async function toggle(): Promise<void> {
  if (status.value === 'idle' || status.value === 'error') {
    showPanel.value = true
    await init()
    return
  }
  if (status.value === 'ready') {
    showPanel.value = !showPanel.value
  }
}

function onClickOutside(): void {
  if (showPanel.value) showPanel.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
</script>

<style scoped>
/* 按钮 */
.music-toggle {
  position: fixed;
  bottom: 32px;
  right: 88px;
  z-index: 101;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 22px;
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
.music-toggle:hover {
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
@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* 面板 */
.music-panel {
  position: fixed;
  bottom: 88px;
  right: 24px;
  z-index: 102;
  width: 360px;
  min-height: 80px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  backdrop-filter: blur(12px);
}

/* 状态提示 */
.panel-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.panel-status p { margin: 0; }
.panel-status.error { color: var(--vp-c-danger-1); }
.retry-btn {
  padding: 6px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.retry-btn:hover { border-color: var(--sakura-pink); color: var(--sakura-deep); }
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--sakura-pink);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.aplayer-container.hidden { display: none; }

/* 面板过渡 */
.panel-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.panel-leave-active { transition: all 0.15s ease-in; }
.panel-enter-from { opacity: 0; transform: translateY(12px) scale(0.95); }
.panel-leave-to { opacity: 0; transform: translateY(8px) scale(0.97); }

/* APlayer 覆盖 */
.music-panel :deep(.aplayer) {
  background: transparent; margin: 0; border-radius: 12px;
  box-shadow: none; font-family: inherit;
}
.music-panel :deep(.aplayer .aplayer-body .aplayer-pic) { border-radius: 6px; }
.music-panel :deep(.aplayer .aplayer-info .aplayer-music) { color: var(--vp-c-text-1); }
.music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-title) { color: var(--vp-c-text-1); }
.music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-author) { color: var(--vp-c-text-3); }
.music-panel :deep(.aplayer .aplayer-info .aplayer-controller .aplayer-time) { color: var(--vp-c-text-3); }
.music-panel :deep(.aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-loaded) { background: var(--sakura-light); }
.music-panel :deep(.aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-played) { background: var(--sakura-deep); }
.music-panel :deep(.aplayer .aplayer-icon:hover) { color: var(--sakura-deep); }
.music-panel :deep(.aplayer .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar .aplayer-volume) {
  background: var(--sakura-deep);
}

/* 深色模式 */
:global(.dark) .music-panel { background: rgba(30, 30, 30, 0.95); }
:global(.dark) .music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-title),
:global(.dark) .music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-author) { color: #ddd; }

/* 移动端 */
@media (max-width: 640px) {
  .music-toggle { bottom: 24px; right: 76px; width: 40px; height: 40px; font-size: 18px; }
  .music-panel { width: calc(100vw - 32px); right: 16px; bottom: 80px; }
}
</style>
