<template>
  <section class="home-columns">
    <BlogList :limit="4" />
  </section>
</template>

<script setup lang="ts">
import BlogList from './BlogList.vue'
</script>

<style scoped>
.home-columns {
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 24px 32px;
}

@media (max-width: 720px) {
  .home-columns { padding: 8px 16px 24px; }
}
</style>
