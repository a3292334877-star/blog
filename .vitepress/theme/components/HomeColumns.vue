<template>
  <section class="home-columns">
    <div class="col col-left">
      <BlogList />
    </div>
    <div class="col col-right">
      <BlogTimeline />
    </div>
  </section>
</template>

<script setup lang="ts">
import BlogList from './BlogList.vue'
import BlogTimeline from './BlogTimeline.vue'
</script>

<style scoped>
.home-columns {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px 32px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  align-items: start;
}

.col { min-width: 0; }

/* 窄屏回退单列 */
@media (max-width: 960px) {
  .home-columns {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
