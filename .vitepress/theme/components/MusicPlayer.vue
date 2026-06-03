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

const MUSIC_URL = '/blog/music.mp3'
const SONG_NAME = '春日影'

const isPlaying = ref(false)
const isLoading = ref(false)
let audio: HTMLAudioElement | null = null

const titleText = computed(() => {
  if (isLoading.value) return '加载中...'
  if (isPlaying.value) return `♪ 暂停: ${SONG_NAME}`
  if (audio) return `♪ 播放: ${SONG_NAME}`
  return '♪ 开启音乐'
})

async function initAndPlay(): Promise<void> {
  isLoading.value = true

  try {
    audio = new Audio()
    audio.loop = true
    audio.src = MUSIC_URL

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
        reject(new Error('加载失败'))
      }
      audio.addEventListener('canplaythrough', onCanPlay)
      audio.addEventListener('error', onErr)
      audio.load()
    })

    audio.addEventListener('play', () => { isPlaying.value = true })
    audio.addEventListener('pause', () => { isPlaying.value = false })
    audio.addEventListener('ended', () => { isPlaying.value = false })

    await audio.play()
  } catch {
    console.error('BGM 加载失败')
    if (audio) { audio.src = ''; audio = null }
    isPlaying.value = false
  } finally {
    isLoading.value = false
  }
}

async function toggle(): Promise<void> {
  if (isLoading.value) return

  if (!audio || !audio.src) {
    await initAndPlay()
    return
  }

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
