<template>
  <button
    class="music-toggle"
    :class="{ playing: isPlaying, loading: isLoading }"
    :title="titleText"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
  <audio
    ref="audio"
    :src="audioSrc"
    loop
    @play="onPlay"
    @pause="isPlaying = false"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const MUSIC_JSON = '/blog/music.json'

interface Song { name: string; artist: string; proxyUrl: string }

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isLoading = ref(false)
const audioSrc = ref('')
const songName = ref('春日影')

const titleText = computed(() => {
  if (isLoading.value) return '加载中...'
  if (isPlaying.value) return `♪ 暂停: ${songName.value}`
  if (audioSrc.value) return `♪ 播放: ${songName.value}`
  return '♪ 开启音乐'
})

// 运行时动态解析 mp3 地址 → 下载为 blob → 创建本地 URL
// 这样彻底绕过 CDN 鉴权 token 过期的问题
async function resolveMp3(): Promise<void> {
  if (audioSrc.value) return
  isLoading.value = true

  try {
    // 1. 获取歌曲元数据
    const metaRes = await fetch(MUSIC_JSON)
    if (!metaRes.ok) throw new Error('元数据加载失败')
    const song: Song = await metaRes.json()
    songName.value = song.name

    // 2. 通过代理链接获取真实 mp3（fetch 跟随重定向，下载完整文件）
    const audioRes = await fetch(song.proxyUrl)
    if (!audioRes.ok) throw new Error('音频加载失败')

    // 3. 转为 blob → 创建本地 URL（纯内存，不走 CDN 鉴权）
    const blob = await audioRes.blob()
    audioSrc.value = URL.createObjectURL(blob)
  } catch (e) {
    console.error('BGM 加载失败:', e)
    throw e
  } finally {
    isLoading.value = false
  }
}

function onPlay() {
  isPlaying.value = true
}

function onError() {
  isPlaying.value = false
  // blob URL 通常在页面生命周期内不会出错，出错就释放重来
  if (audioSrc.value) {
    URL.revokeObjectURL(audioSrc.value)
    audioSrc.value = ''
  }
}

async function toggle(): Promise<void> {
  if (!audio.value) return

  // 首次点击：加载歌曲（运行时解析 → blob）
  if (!audioSrc.value) {
    try {
      await resolveMp3()
    } catch {
      return
    }
  }

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
