<template>
  <div class="loading-skeleton" :style="{ width }">
    <!-- 标题骨架 -->
    <div class="sk-title" :class="{ animated }"></div>

    <!-- 内容行骨架 -->
    <div
      v-for="i in lines"
      :key="i"
      class="sk-line"
      :class="{ animated }"
      :style="{ width: lineWidth(i, lines) }"
    ></div>

    <!-- 卡片骨架 (可选) -->
    <div v-if="cards > 0" class="sk-cards">
      <div
        v-for="c in cards"
        :key="c"
        class="sk-card"
        :class="{ animated }"
      >
        <div class="sk-card-img animated"></div>
        <div class="sk-card-body">
          <div class="sk-line animated" style="width: 80%"></div>
          <div class="sk-line animated" style="width: 100%"></div>
          <div class="sk-line animated" style="width: 40%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  lines?: number
  cards?: number
  animated?: boolean
  width?: string
}>(), {
  lines: 5,
  cards: 0,
  animated: true,
  width: '100%',
})

function lineWidth(i: number, total: number): string {
  // 模拟自然段落长短变化
  const ratios = [0.95, 1, 0.7, 0.85, 0.6, 0.9, 0.75, 0.55, 0.92, 0.68]
  const r = ratios[(i - 1) % ratios.length]
  return `${Math.floor(r * 100)}%`
}
</script>

<style lang="scss" scoped>
.loading-skeleton {
  padding: 24px;
}

.sk-title {
  height: 28px;
  border-radius: 6px;
  margin-bottom: 24px;
  width: 45%;
  background: #e8e8e8;

  html.dark & { background: #2a2a2a; }
}

.sk-line {
  height: 14px;
  border-radius: 4px;
  margin-bottom: 12px;
  background: #e8e8e8;

  html.dark & { background: #2a2a2a; }
}

.sk-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.sk-card {
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;

  html.dark & { background: #1e1e1e; }
}

.sk-card-img {
  height: 160px;
  background: #e8e8e8;

  html.dark & { background: #2a2a2a; }
}

.sk-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 闪烁动画 */
.animated {
  background: linear-gradient(
    90deg,
    #e8e8e8 25%,
    #f5f5f5 50%,
    #e8e8e8 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  html.dark & {
    background: linear-gradient(
      90deg,
      #2a2a2a 25%,
      #333 50%,
      #2a2a2a 75%
    );
    background-size: 200% 100%;
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
