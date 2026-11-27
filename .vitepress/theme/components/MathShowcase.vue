<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="math-showcase">
    <div v-if="title" class="math-showcase-title">
      <span>{{ title }}</span>
    </div>
    <div class="math-showcase-body">
      <slot />
    </div>
  </div>
</template>

<style>
.math-showcase {
  position: relative;
  margin: 24px 0;
  padding: 22px 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--sakura-light) 65%, var(--vp-c-bg)) 0%, color-mix(in srgb, var(--sakura-warm) 25%, var(--vp-c-bg)) 100%);
  border: 1px solid color-mix(in srgb, var(--sakura-pink) 30%, transparent);
  box-shadow: 0 6px 20px rgba(193, 63, 87, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dark .math-showcase {
  background: linear-gradient(135deg, rgba(37, 31, 46, 0.95) 0%, rgba(45, 34, 48, 0.95) 100%);
  border-color: rgba(239, 143, 162, 0.22);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.math-showcase:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(193, 63, 87, 0.1);
}

.math-showcase-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 12px;
}

.math-showcase-body > :first-child { margin-top: 0 !important; }
.math-showcase-body > :last-child { margin-bottom: 0 !important; }
.math-showcase-body .katex-block { margin: 0; }
</style>
