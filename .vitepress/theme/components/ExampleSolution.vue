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
