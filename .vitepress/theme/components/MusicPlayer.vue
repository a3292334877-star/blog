<template>
  <Transition name="panel">
    <div v-if="showPanel" class="music-panel" @click.stop>
      <div ref="playerContainer" class="aplayer-container" />
    </div>
  </Transition>

  <button
    class="music-toggle"
    :class="{ playing: isPlaying }"
    :title="titleText"
    @click.stop="toggle"
  >
    <span class="music-icon" :class="{ rotating: isPlaying }">♪</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ============================================================
// BGM 音乐播放器配置
// ============================================================
// 使用你自己的网易云歌单：
// 1. 打开 https://music.163.com
// 2. 进入你的歌单，从 URL 复制 ID
//    例：https://music.163.com/#/playlist?id=7256922436
// 3. 将 id 替换为你的歌单 ID
//
// type 可选：'playlist' | 'song' | 'album'
// server 可选：'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu'
// ============================================================
const MUSIC_CONFIG = {
  server: 'netease',
  type: 'playlist',
  id: '4884101180',
  autoPlay: false,
  loop: 'all',
  order: 'random',
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
const isLoaded = ref(false)
const playerContainer = ref<HTMLElement | null>(null)

let ap: any = null

const titleText = computed(() => {
  if (!isLoaded.value) return '开启音乐'
  return showPanel.value ? '收起播放器' : '展开播放器'
})

// --- CDN 动态加载 ---
async function loadScripts(): Promise<void> {
  // APlayer CSS
  if (!document.querySelector('link[href*="APlayer.min.css"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css'
    document.head.appendChild(link)
  }

  // APlayer JS
  if (!window.APlayer) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('APlayer load failed'))
      document.head.appendChild(script)
    })
  }

  // MetingJS
  if (!window.Meting) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('MetingJS load failed'))
      document.head.appendChild(script)
    })
  }
}

// --- 初始化播放器 ---
function initPlayer(): void {
  if (!playerContainer.value) return

  ap = new window.APlayer({
    container: playerContainer.value,
    mini: true,
    loop: MUSIC_CONFIG.loop,
    order: MUSIC_CONFIG.order,
    volume: MUSIC_CONFIG.volume,
    preload: MUSIC_CONFIG.preload,
    mutex: true,
    lrcType: 0,
  })

  // 通过 MetingJS 加载歌单
  new window.Meting({
    server: MUSIC_CONFIG.server,
    type: MUSIC_CONFIG.type,
    id: MUSIC_CONFIG.id,
    aplayer: ap,
  })

  // 同步播放状态
  ap.on('play', () => { isPlaying.value = true })
  ap.on('pause', () => { isPlaying.value = false })
}

// --- 切换面板 ---
async function toggle(): Promise<void> {
  if (!isLoaded.value) {
    try {
      await loadScripts()
      initPlayer()
      isLoaded.value = true
    } catch {
      console.error('BGM 播放器加载失败，请检查网络')
      return
    }
  }

  showPanel.value = !showPanel.value
}

// --- 点击面板外关闭 ---
function onClickOutside(e: MouseEvent): void {
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

/* ============================================================
   音符旋转动画
   ============================================================ */
.music-icon {
  line-height: 1;
  display: inline-block;
  transition: transform 0.3s ease;
}

.music-icon.rotating {
  animation: music-spin 3s linear infinite;
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
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  backdrop-filter: blur(12px);
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

/* 播放按钮 */
.music-panel :deep(.aplayer .aplayer-body .aplayer-pic) { border-radius: 6px; }

/* 歌曲名 */
.music-panel :deep(.aplayer .aplayer-info .aplayer-music) {
  color: var(--vp-c-text-1);
}
.music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-title) {
  color: var(--vp-c-text-1);
}
.music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-author) {
  color: var(--vp-c-text-3);
}

/* 时间 */
.music-panel :deep(.aplayer .aplayer-info .aplayer-controller .aplayer-time) {
  color: var(--vp-c-text-3);
}
.music-panel :deep(.aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon) {
  fill: var(--vp-c-text-2);
}
.music-panel :deep(.aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon:hover) {
  fill: var(--sakura-deep);
}

/* 进度条 */
.music-panel :deep(.aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-loaded) {
  background: var(--sakura-light);
}
.music-panel :deep(.aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-played) {
  background: var(--sakura-deep);
}

/* 图标 hover */
.music-panel :deep(.aplayer .aplayer-icon:hover) {
  color: var(--sakura-deep);
}

/* 迷你模式下的控制器 */
.music-panel :deep(.aplayer.aplayer-withlrc .aplayer-pic) {
  height: 56px;
  width: 56px;
}
.music-panel :deep(.aplayer.aplayer-withlrc .aplayer-info) {
  margin-left: 56px;
}

/* ============================================================
   深色模式微调
   ============================================================ */
:global(.dark) .music-panel {
  background: rgba(30, 30, 30, 0.95);
}

:global(.dark) .music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-title),
:global(.dark) .music-panel :deep(.aplayer .aplayer-info .aplayer-music .aplayer-author) {
  color: #ddd;
}

/* ============================================================
   移动端适配
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
