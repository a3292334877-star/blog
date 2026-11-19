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
