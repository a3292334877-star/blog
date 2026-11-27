<script setup lang="ts">
withDefaults(
  defineProps<{ summary?: string; open?: boolean }>(),
  {
    summary: '🔍 点击展开详细解答',
    open: false,
  }
)
</script>

<template>
  <details class="example-details" :open="open">
    <summary>{{ summary }}</summary>
    <div class="example-solution">
      <slot />
    </div>
  </details>
</template>

<style>
.example-details {
  margin-top: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
}

.example-details > summary {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 600;
  color: var(--accent-color);
  user-select: none;
  font-size: 14.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.example-details > summary:hover {
  text-decoration: underline;
}

.example-details[open] > summary {
  border-bottom: 1px dashed var(--vp-c-divider);
}

.example-solution {
  padding: 18px;
}

.example-solution > :first-child { margin-top: 0 !important; }
.example-solution > :last-child { margin-bottom: 0 !important; }
.example-solution .katex-block { margin: 14px 0; }
</style>
