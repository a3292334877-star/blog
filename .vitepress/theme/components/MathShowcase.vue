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
