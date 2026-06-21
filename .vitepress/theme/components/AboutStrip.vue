<template>
  <section class="about-strip">
    <div class="strip-inner">
      <span class="strip-item"><span class="emoji">🎓</span> 深大 · 人工智能</span>
      <span class="divider"></span>
      <span class="strip-item"><span class="emoji">☕</span> Java / C++ / Flutter</span>
      <span class="divider"></span>
      <span class="strip-item"><span class="emoji">🗾</span> 日语 N1</span>
      <span class="divider"></span>
      <span class="strip-item"><span class="emoji">🍡</span> 京阿尼忠实蜜</span>
      <span class="divider"></span>
      <span class="strip-item"><span class="emoji">🏆</span> 蓝桥杯省三</span>
    </div>
  </section>
</template>

<style scoped>
.about-strip {
  background: linear-gradient(90deg,
    transparent,
    rgba(245,184,196,0.12),
    rgba(255,233,201,0.12),
    transparent);
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  overflow: hidden;
  padding: 14px 0;
}

.strip-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
}

.strip-item {
  font-size: 14px;
  color: var(--vp-c-text-2);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-title);
}
.strip-item .emoji { font-size: 16px; }

.divider {
  width: 1px;
  height: 14px;
  background: var(--vp-c-divider);
}

@media (max-width: 720px) {
  .strip-inner { gap: 12px; }
  .divider { display: none; }
  .strip-item { font-size: 13px; }
}
</style>
