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
