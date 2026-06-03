<template>
  <button
    class="music-toggle"
    :class="{ playing: playing }"
    :title="playing ? '暂停' : '♪ 播放'"
    @click.stop="toggle"
  >
    <span class="music-icon">♪</span>
  </button>
  <audio ref="audioEl" :src="src" loop hidden />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const src = '/blog/music.mp3'
const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)

function toggle() {
  const a = audioEl.value
  if (!a) return

  // 先确保有 load 过
  if (a.readyState === 0) a.load()

  if (a.paused) {
    a.play().then(() => { playing.value = true }).catch(() => { playing.value = false })
  } else {
    a.pause()
    playing.value = false
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
