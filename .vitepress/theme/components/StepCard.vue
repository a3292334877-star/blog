<script setup lang="ts">
defineProps<{ num: string | number; title?: string }>()
</script>

<template>
  <div class="step-card">
    <div class="step-number">{{ num }}</div>
    <div class="step-content">
      <h4 v-if="title">{{ title }}</h4>
      <slot />
    </div>
  </div>
</template>

<style>
.step-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s ease;
}

.step-card:hover {
  border-color: var(--sakura-pink);
  box-shadow: 0 6px 18px rgba(193, 63, 87, 0.06);
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sakura-pink), var(--accent-color));
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(193, 63, 87, 0.3);
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 6px !important;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.step-content p {
  margin: 0 !important;
  font-size: 14.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.step-content > :last-child { margin-bottom: 0 !important; }
.step-content .katex-block { margin: 10px 0; }
</style>
