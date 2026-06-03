<template>
  <button
    class="music-toggle"
    :class="{ playing: isPlaying }"
    :title="isPlaying ? '暂停' : '♪ 播放'"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const SRC = '/blog/music.mp3'
const isPlaying = ref(false)
let audio: HTMLAudioElement | null = null
let loadFailed = false

function toggle(): void {
  // 如果之前加载失败过，重置
  if (loadFailed) {
    audio = null
    loadFailed = false
  }

  if (!audio) {
    audio = new Audio()
    audio.preload = 'auto'
    audio.loop = true
    audio.src = SRC

    audio.addEventListener('play', () => { isPlaying.value = true })
    audio.addEventListener('pause', () => { isPlaying.value = false })
    audio.addEventListener('ended', () => { isPlaying.value = false })
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      loadFailed = true
      isPlaying.value = false
    })

    // 添加加载反馈
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio ready')
    })
  }

  if (audio.paused) {
    const p = audio.play()
    if (p) {
      p.catch((err) => {
        console.error('Play failed:', err.name, err.message)
        loadFailed = true
      })
    }
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

@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .music-toggle { bottom: 24px; right: 76px; width: 40px; height: 40px; font-size: 18px; }
}
</style>
