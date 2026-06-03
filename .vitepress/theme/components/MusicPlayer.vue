<template>
  <button
    class="music-toggle"
    :class="{ playing: isPlaying, loading: isLoading }"
    :title="titleText"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
  <audio ref="audio" :src="audioSrc" preload="auto" loop @play="isPlaying = true" @pause="isPlaying = false" @ended="isPlaying = false" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ============================================================
// 歌曲数据由构建时预取到 public/music.json
// generate-music.mjs 生成音频代理链接
// ============================================================
const MUSIC_JSON = '/blog/music.json'

interface Song { name: string; artist: string; url: string; cover: string; lrc?: string }

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isLoading = ref(false)
const audioSrc = ref('')
const songName = ref('春日影')

const titleText = computed(() => {
  if (isLoading.value) return '加载中...'
  if (audioSrc.value && !isPlaying.value) return `播放: ${songName.value}`
  if (isPlaying.value) return `暂停: ${songName.value}`
  return '♪ 开启音乐'
})

// --- 加载歌曲数据 ---
async function loadSong(): Promise<void> {
  if (audioSrc.value) return
  isLoading.value = true

  try {
    const res = await fetch(MUSIC_JSON)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const song: Song = await res.json()
    audioSrc.value = song.url
    songName.value = song.name
  } catch {
    console.error('歌曲数据加载失败')
  } finally {
    isLoading.value = false
  }
}

// --- 切换播放/暂停 ---
async function toggle(): Promise<void> {
  if (!audio.value) return

  // 首次点击：加载歌曲
  if (!audioSrc.value) {
    await loadSong()
  }

  if (!audioSrc.value) return

  if (audio.value.paused) {
    audio.value.play().catch(() => {})
  } else {
    audio.value.pause()
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
