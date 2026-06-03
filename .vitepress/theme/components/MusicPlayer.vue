<template>
  <button
    class="music-toggle"
    :class="{ playing: isPlaying, loading: isLoading }"
    :title="titleText"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const MUSIC_JSON = '/blog/music.json'

interface Song { name: string; artist: string; proxyUrl: string }

const isPlaying = ref(false)
const isLoading = ref(false)
const songName = ref('春日影')
let audio: HTMLAudioElement | null = null

const titleText = computed(() => {
  if (isLoading.value) return '加载中...'
  if (isPlaying.value) return `♪ 暂停: ${songName.value}`
  if (audio) return `♪ 播放: ${songName.value}`
  return '♪ 开启音乐'
})

async function resolveAndPlay(): Promise<void> {
  isLoading.value = true

  try {
    // 1. 获取歌曲元数据
    const metaRes = await fetch(MUSIC_JSON)
    if (!metaRes.ok) throw new Error('元数据加载失败')
    const song: Song = await metaRes.json()
    songName.value = song.name

    // 2. 创建 audio 元素，直接用代理链接（浏览器自动跟踪302）
    if (!audio) {
      audio = new Audio()
      audio.loop = true
      audio.addEventListener('play', () => { isPlaying.value = true })
      audio.addEventListener('pause', () => { isPlaying.value = false })
      audio.addEventListener('ended', () => { isPlaying.value = false })
      audio.addEventListener('error', () => {
        isPlaying.value = false
        isLoading.value = false
      })
    }

    // 每次播放前设 src（代理链接每次访问给出最新CDN地址，token不会过期）
    if (!audio.src || audio.paused) {
      audio.src = song.proxyUrl
    }

    // 等音频加载到能播放
    await new Promise<void>((resolve, reject) => {
      if (!audio) return reject()
      const onCanPlay = () => {
        audio!.removeEventListener('canplaythrough', onCanPlay)
        audio!.removeEventListener('error', onErr)
        resolve()
      }
      const onErr = () => {
        audio!.removeEventListener('canplaythrough', onCanPlay)
        audio!.removeEventListener('error', onErr)
        reject(new Error('音频加载失败'))
      }
      audio.addEventListener('canplaythrough', onCanPlay)
      audio.addEventListener('error', onErr)
      audio.load()
    })

    await audio.play()
  } catch (e) {
    console.error('BGM 加载失败:', e)
    if (audio) {
      audio.src = ''
      audio = null
    }
    isPlaying.value = false
  } finally {
    isLoading.value = false
  }
}

async function toggle(): Promise<void> {
  // 首次点击或出错重置后：加载并播放
  if (!audio || !audio.src) {
    await resolveAndPlay()
    return
  }

  // 已加载：切换播放/暂停
  if (audio.paused) {
    audio.play().catch(() => {})
  } else {
    audio.pause()
  }
}
</script>

<style scoped>
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
  pointer-events: none;
}

@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .music-toggle { bottom: 24px; right: 76px; width: 40px; height: 40px; font-size: 18px; }
}
</style>
