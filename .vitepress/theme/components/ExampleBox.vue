<script setup lang="ts">
defineProps<{ title?: string; tag?: string }>()
</script>

<template>
  <div class="example-box">
    <div class="example-header">
      <div class="example-title">
        <span>{{ title }}</span>
      </div>
      <span v-if="tag" class="example-tag">{{ tag }}</span>
    </div>
    <div class="example-body">
      <slot />
    </div>
  </div>
</template>

<style>
.example-box {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-elv);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.example-box:hover {
  border-color: color-mix(in srgb, var(--sakura-pink) 50%, var(--vp-c-divider));
}

.example-header {
  padding: 16px 20px;
  background: color-mix(in srgb, var(--sakura-light) 40%, var(--vp-c-bg-elv));
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.example-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.example-tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  background: var(--sakura-warm);
  color: #8c4e0b;
  font-weight: 600;
}

.dark .example-tag {
  background: #3e2e1a;
  color: #f6c888;
}

.example-body {
  padding: 20px;
}

.example-body > :first-child { margin-top: 0 !important; }
</style>
