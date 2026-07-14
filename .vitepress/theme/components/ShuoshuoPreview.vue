<template>
  <section class="home-preview shuoshuo-preview">
    <h2 class="section-heading">
      <span class="icon">💬</span> 碎碎念
      <a :href="withBase('shuoshuo/')" class="more-link">全部 →</a>
    </h2>

    <div class="shuoshuo-list">
      <article
        v-for="(s, i) in shuoshuo"
        :key="s.date"
        class="shuoshuo-item"
        :style="{ animationDelay: i * 100 + 'ms' }"
      >
        <div class="bubble">
          <div class="bubble-text">{{ s.content }}</div>
          <div class="bubble-date">{{ s.date }}</div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { data } from '../../home.data.mjs'

const { site } = useData()
const base = site.value.base
function withBase(p: string) { return base + p.replace(/^\//, '') }

const shuoshuo = data.shuoshuo
</script>

<style scoped>
.home-preview {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(44px, 6vw, 76px) 24px;
}

.section-heading {
  font-size: 22px;
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.more-link {
  margin-left: auto;
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  transition: color 0.2s;
}
.more-link:hover { color: var(--accent-color); }

.shuoshuo-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.shuoshuo-item {
  opacity: 0;
  transform: translateX(-16px);
  animation: shuoshuo-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes shuoshuo-in {
  to { opacity: 1; transform: translateX(0); }
}

.bubble {
  position: relative;
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--sakura-light), var(--vp-c-bg));
  border: 1px solid var(--sakura-pink);
  border-radius: 4px 18px 18px 18px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.bubble:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(245,184,196,0.25);
}
/* 气泡左侧尖角 */
.bubble::before {
  content: '';
  position: absolute;
  left: -8px; top: 14px;
  width: 0; height: 0;
  border: 7px solid transparent;
  border-right-color: var(--sakura-pink);
}
.bubble::after {
  content: '';
  position: absolute;
  left: -6px; top: 15px;
  width: 0; height: 0;
  border: 6px solid transparent;
  border-right-color: var(--sakura-light);
}

.bubble-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.bubble-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 8px;
  font-family: var(--vp-font-family-mono);
}
</style>
