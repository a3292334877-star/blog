<template>
  <button
    class="music-toggle"
    :class="{ active: showPlayer }"
    :title="showPlayer ? '收起播放器' : '♪ 开启音乐'"
    @click.stop="showPlayer = !showPlayer"
  >
    <span class="music-icon">♪</span>
  </button>
  <div v-if="showPlayer" class="music-bar" @click.stop>
    <iframe
      id="music-iframe"
      frameborder="no"
      marginwidth="0"
      marginheight="0"
      width="280"
      height="52"
      :src="iframeSrc"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const SONG_ID = 2097486090
const iframeSrc = `https://music.163.com/outchain/player?type=2&id=${SONG_ID}&auto=0&height=32`

const showPlayer = ref(false)
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
.music-toggle.active {
  border-color: var(--sakura-pink);
  color: var(--sakura-deep);
  box-shadow: 0 0 16px rgba(255, 183, 197, 0.4);
}
.music-toggle.active .music-icon {
  animation: music-spin 3s linear infinite;
}

@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* 播放条 */
.music-bar {
  position: fixed;
  bottom: 32px;
  right: 140px;
  z-index: 102;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 4px 0 0 0;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  line-height: 1;
}
.music-bar iframe {
  display: block;
}

@media (max-width: 640px) {
  .music-toggle { bottom: 24px; right: 76px; width: 40px; height: 40px; font-size: 18px; }
  .music-bar { right: 16px; bottom: 80px; }
}
</style>
