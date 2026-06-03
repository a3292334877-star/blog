<template>
  <Transition name="panel">
    <div v-if="showPanel" class="music-panel" @click.stop>
      <!-- 加载中/失败状态 -->
      <div v-if="status === 'loading'" class="panel-status">
        <span class="loading-spinner" />
        <p>正在加载歌单...</p>
      </div>
      <div v-else-if="status === 'error'" class="panel-status error">
        <p>😿 加载失败，请检查网络</p>
        <button class="retry-btn" @click.stop="retry">重试</button>
      </div>
      <!-- APlayer 容器 -->
      <div ref="playerContainer" class="aplayer-container" :class="{ hidden: status !== 'ready' }" />
    </div>
  </Transition>

  <button
    class="music-toggle"
    :class="{ playing: isPlaying, loading: status === 'loading' }"
    :title="titleText"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ============================================================
// BGM 音乐播放器配置
// ============================================================
const MUSIC_CONFIG = {
  server: 'netease',       // 网易云: 'netease' | QQ: 'tencent' | 酷狗: 'kugou'
  type: 'playlist',        // 'playlist' | 'song' | 'album'
  id: '4884101180',        // 你的歌单 ID
  loop: 'all',             // 'all' | 'one' | 'none'
  order: 'random',         // 'list' | 'random'
  volume: 0.7,
  preload: 'auto',
}

declare global {
  interface Window {
    APlayer: any
    Meting: any
  }
}

// --- State ---
const showPanel = ref(false)
const isPlaying = ref(false)
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const playerContainer = ref<HTMLElement | null>(null)

let ap: any = null

const titleText = computed(() => {
  if (status.value === 'loading') return '加载中...'
  if (status.value === 'error') return '加载失败，点击重试'
  return showPanel.value ? '收起播放器' : '♪ 开启音乐'
})

// --- CDN 动态加载（使用国内镜像 npmmirror）---
const APLAYER_CSS = 'https://registry.npmmirror.com/aplayer/1.10.1/files/dist/APlayer.min.css'
const APLAYER_JS  = 'https://registry.npmmirror.com/aplayer/1.10.1/files/dist/APlayer.min.js'
const METING_JS   = 'https://registry.npmmirror.com/meting/2.0.1/files/dist/Meting.min.js'

async function loadScripts(): Promise<void> {
  // Inject APlayer CSS
  if (!document.querySelector('link[data-music="aplayer-css"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = APLAYER_CSS
    link.setAttribute('data-music', 'aplayer-css')
    document.head.appendChild(link)
  }

  // Load APlayer JS
  if (!window.APlayer) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = APLAYER_JS
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('APlayer load failed'))
      document.head.appendChild(script)
    })
  }

  // Load MetingJS
  if (!window.Meting) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = METING_JS
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('MetingJS load failed'))
      document.head.appendChild(script)
    })
  }
}

// --- 使用 MetingJS 正确的 API 初始化播放器 ---
function initPlayer(): void {
  if (!playerContainer.value) return

  // MetingJS 的 render() 内部会创建 APlayer
  const meting = new window.Meting({
    server: MUSIC_CONFIG.server,
    type: MUSIC_CONFIG.type,
    id: MUSIC_CONFIG.id,
    container: playerContainer.value,
    mini: true,
    loop: MUSIC_CONFIG.loop,
    order: MUSIC_CONFIG.order,
    volume: MUSIC_CONFIG.volume,
    preload: MUSIC_CONFIG.preload,
    autoplay: false,
    mutex: true,
    lrcType: 0,
  })

  meting.render()

  // render() 完成后 meting.aplayer 就是 APlayer 实例
  // 需要等一小段时间让 APlayer 完成初始化
  const check = setInterval(() => {
    if (meting.aplayer) {
      clearInterval(check)
      ap = meting.aplayer
      ap.on('play', () => { isPlaying.value = true })
      ap.on('pause', () => { isPlaying.value = false })
      status.value = 'ready'
    }
  }, 200)

  // 超时处理
  setTimeout(() => {
    if (status.value !== 'ready') {
      clearInterval(check)
      if (meting.aplayer) {
        ap = meting.aplayer
        ap.on('play', () => { isPlaying.value = true })
        ap.on('pause', () => { isPlaying.value = false })
        status.value = 'ready'
      }
    }
  }, 8000)
}

// --- 初始化（加载脚本 + 创建播放器）---
async function init(): Promise<void> {
  if (status.value === 'ready') return
  status.value = 'loading'
  try {
    await loadScripts()
    initPlayer()
  } catch {
    status.value = 'error'
    console.error('BGM 播放器：脚本加载失败，请检查网络')
  }
}

// --- 重试 ---
async function retry(): Promise<void> {
  status.value = 'idle'
  await init()
}

// --- 切换面板 ---
async function toggle(): Promise<void> {
  if (status.value === 'idle' || status.value === 'error') {
    await init()
  }

  if (status.value === 'ready') {
    showPanel.value = !showPanel.value
  }
}

// --- 点击面板外关闭 ---
function onClickOutside(): void {
  if (showPanel.value) {
    showPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
</script>

<style scoped>
/* ============================================================
   切换按钮
   ============================================================ */
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

.music-toggle.loading {
  color: var(--sakura-pink);
  border-color: var(--sakura-pink);
}

@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ============================================================
   播放面板
   ============================================================ */
.music-panel {
  position: fixed;
  bottom: 88px;
  right: 24px;
  z-index: 102;
  width: 320px;
  min-height: 80px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  backdrop-filter: blur(12px);
}

/* ============================================================
   加载/错误状态
   ============================================================ */
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

.retry-btn:hover {
  border-color: var(--sakura-pink);
  color: var(--sakura-deep);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--sakura-pink);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.aplayer-container.hidden {
  display: none;
}

/* ============================================================
   面板过渡动画
   ============================================================ */
.panel-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.panel-leave-active {
  transition: all 0.15s ease-in;
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}

/* ============================================================
   APlayer 样式覆盖
   ============================================================ */
.music-panel :deep(.aplayer) {
  background: transparent;
  margin: 0;
  border-radius: 12px;
  box-shadow: none;
  font-family: inherit;
}

.music-panel :deep(.aplayer .aplayer-body .aplayer-pic) { border-radius: 6px; }

.music-panel :deep(.aplayer .aplayer-info .aplayer-music) {
  color: var(--vp-c-text-1);
}
.music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-title) {
  color: var(--vp-c-text-1);
}
.music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-author) {
  color: var(--vp-c-text-3);
}

.music-panel :deep(.aplayer .aplayer-info .aplayer-controller .aplayer-time) {
  color: var(--vp-c-text-3);
}

.music-panel :deep(.aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-loaded) {
  background: var(--sakura-light);
}
.music-panel :deep(.aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-played) {
  background: var(--sakura-deep);
}

.music-panel :deep(.aplayer .aplayer-icon:hover) {
  color: var(--sakura-deep);
}

.music-panel :deep(.aplayer.aplayer-withlrc .aplayer-pic) {
  height: 56px;
  width: 56px;
}
.music-panel :deep(.aplayer.aplayer-withlrc .aplayer-info) {
  margin-left: 56px;
}

/* ============================================================
   深色模式
   ============================================================ */
:global(.dark) .music-panel {
  background: rgba(30, 30, 30, 0.95);
}

:global(.dark) .music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-title),
:global(.dark) .music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-author) {
  color: #ddd;
}

/* ============================================================
   移动端
   ============================================================ */
@media (max-width: 640px) {
  .music-toggle {
    bottom: 24px;
    right: 76px;
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .music-panel {
    width: calc(100vw - 32px);
    right: 16px;
    bottom: 80px;
  }
}
</style>
