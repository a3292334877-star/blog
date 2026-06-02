<template>
  <section class="site-stats">
    <h2 class="section-heading">
      <span class="icon">📊</span> 站点统计
    </h2>

    <div class="stats-grid">
      <!-- 来访人数 / 访问次数 -->
      <div class="stat-card">
        <div class="stat-label">👥 来访人数</div>
        <div class="stat-value">
          <template v-if="uv !== null">{{ fmtNum(uv) }}</template>
          <template v-else>-</template>
          <span class="stat-unit">人次</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">👁️ 访问次数</div>
        <div class="stat-value">
          <template v-if="pv !== null">{{ fmtNum(pv) }}</template>
          <template v-else>-</template>
          <span class="stat-unit">次</span>
        </div>
      </div>

      <!-- 总字数 -->
      <div class="stat-card">
        <div class="stat-label">📝 本站总字数</div>
        <div class="stat-value">
          {{ fmtNum(stats.totalWords) }}
          <span class="stat-unit">字</span>
        </div>
      </div>

      <!-- 已运行时间 -->
      <div class="stat-card">
        <div class="stat-label">⏳ 已运行时间</div>
        <div class="stat-value">
          {{ stats.runDays }}
          <span class="stat-unit">天</span>
        </div>
      </div>

      <!-- 活跃时间 (最近更新) -->
      <div class="stat-card">
        <div class="stat-label">🕐 最近更新</div>
        <div class="stat-value small">
          {{ fmtDate(stats.lastUpdate) }}
        </div>
      </div>

      <!-- 近一月新增 -->
      <div class="stat-card">
        <div class="stat-label">📅 近一月新增</div>
        <div class="stat-value">
          {{ stats.monthNew }}
          <span class="stat-unit">篇</span>
        </div>
      </div>

      <!-- 近一周新增 -->
      <div class="stat-card">
        <div class="stat-label">📆 近一周新增</div>
        <div class="stat-value">
          {{ stats.weekNew }}
          <span class="stat-unit">篇</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { data as stats } from '../../site.data.mjs'
import { useVisitorCounter } from '../composables/useVisitorCounter'

const { uv, pv } = useVisitorCounter()

function fmtNum(n: number) {
  return n.toLocaleString('zh-CN')
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}
</script>

<style scoped>
.site-stats {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.section-heading {
  font-size: 22px;
  margin-bottom: 28px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 22px 18px;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(254,150,0,0.1);
  border-color: var(--accent-color);
}

.stat-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent-color);
}

.stat-value.small {
  font-size: 18px;
}

.stat-unit {
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  margin-left: 4px;
}
</style>
