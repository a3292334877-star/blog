<template>
  <section class="about-strip" aria-label="个人简介">
    <ul class="strip-inner">
      <li v-for="item in items" :key="item.text">
        <span class="emoji" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.text }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: '🎓', text: '深大 · 计算机科学与技术' },
  { icon: '☕', text: 'Java / C++ / Flutter' },
  { icon: '🗾', text: '日语 N1' },
  { icon: '🍡', text: '京阿尼忠实蜜' },
]
</script>

<style scoped>
.about-strip {
  border-block: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--sakura-light) 52%, var(--vp-c-bg));
}
.strip-inner {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 18px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  list-style: none;
}
li {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 14px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-align: center;
}
li + li { border-left: 1px solid var(--vp-c-divider); }
.emoji { flex: 0 0 auto; font-size: 16px; }

@media (max-width: 900px) {
  .strip-inner { grid-template-columns: repeat(2, 1fr); gap: 10px; padding-block: 16px; }
  li { justify-content: flex-start; border: 0 !important; padding: 8px 12px; }
}

@media (max-width: 520px) {
  .strip-inner { width: min(100% - 24px, 420px); }
  li { font-size: 12px; padding-inline: 4px; }
}
</style>
