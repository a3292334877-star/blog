<template>
  <div class="anime-container">
    <!-- 顶部状态栏与筛选 -->
    <div class="anime-controls">
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: currentTab === tab.id }"
          :aria-pressed="currentTab === tab.id"
          @click="currentTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ getCount(tab.id) }}</span>
        </button>
      </div>

      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索番名、简评、标签或制作组..."
          aria-label="搜索番名、简评、标签或制作组"
          class="search-input"
        />
        <button v-if="searchQuery" type="button" class="clear-btn" aria-label="清空搜索" @click="searchQuery = ''">✕</button>
      </div>
    </div>

    <!-- 追番卡片网格 -->
    <div class="anime-cards-grid">
      <div
        v-for="anime in filteredList"
        :key="anime.name"
        class="anime-item-card"
        :class="{ 'is-kyoto': anime.isKyoAni }"
      >
        <div class="card-header">
          <div class="card-title-group">
            <h3 class="card-title">{{ anime.name }}</h3>
            <span class="year-badge">{{ anime.year }}</span>
          </div>
          <div class="stars-badge" :title="'评分: ' + anime.rating + ' 星'">
            <span class="star" v-for="n in anime.rating" :key="n">★</span>
          </div>
        </div>

        <p class="card-remark">{{ anime.remark }}</p>

        <div class="card-footer">
          <div class="tags-list">
            <span v-if="anime.isKyoAni" class="tag kyoani-tag">🍡 京阿尼</span>
            <span v-for="tag in anime.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredList.length === 0" class="empty-state">
      <div class="empty-icon">🌸</div>
      <p>没有找到匹配的番剧，换个关键词试试吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// @ts-expect-error VitePress 在构建时注入 data 导出，.mjs 源文件里没有这个具名导出。
import { data as animeList } from '../../anime.data.mjs'

const tabs = [
  { id: 'all', label: '全部', icon: '🎬' },
  { id: '5', label: '神作级', icon: '👑' },
  { id: '4', label: '强烈推荐', icon: '✨' },
  { id: '3', label: '值得一看', icon: '🌸' },
  { id: 'kyoani', label: '京阿尼专属', icon: '🍡' },
]

const currentTab = ref('all')
const searchQuery = ref('')

function getCount(tabId: string): number {
  if (tabId === 'all') return animeList.length
  if (tabId === 'kyoani') return animeList.filter((a) => a.isKyoAni).length
  return animeList.filter((a) => a.rating === parseInt(tabId, 10)).length
}

const filteredList = computed(() => {
  return animeList.filter((item) => {
    // 标签筛选
    if (currentTab.value === '5' && item.rating !== 5) return false
    if (currentTab.value === '4' && item.rating !== 4) return false
    if (currentTab.value === '3' && item.rating !== 3) return false
    if (currentTab.value === 'kyoani' && !item.isKyoAni) return false

    // 关键词搜索
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const matchName = item.name.toLowerCase().includes(q)
      const matchRemark = item.remark.toLowerCase().includes(q)
      const matchYear = item.year.toString().includes(q)
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q))
      if (!matchName && !matchRemark && !matchYear && !matchTags) return false
    }

    return true
  })
})
</script>

<style scoped>
.anime-container {
  margin: 24px 0 36px;
}

.anime-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-btn:hover {
  border-color: var(--sakura-pink);
  color: var(--accent-color);
  transform: translateY(-1px);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-deep));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(217, 122, 140, 0.35);
}

.tab-count {
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.08);
}
.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 10px 38px 10px 38px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--sakura-pink);
  box-shadow: 0 0 0 3px rgba(245, 184, 196, 0.25);
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
}
.clear-btn:hover {
  color: var(--vp-c-text-1);
}

.anime-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.anime-item-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 20px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.3s, border-color 0.3s;
  position: relative;
  overflow: hidden;
}

.anime-item-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--sakura-pink), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.anime-item-card:hover {
  transform: translateY(-4px);
  border-color: var(--sakura-pink);
  box-shadow: 0 10px 28px rgba(245, 184, 196, 0.22);
}

.anime-item-card:hover::before {
  opacity: 1;
}

.anime-item-card.is-kyoto {
  background: linear-gradient(145deg, var(--vp-c-bg-elv), color-mix(in srgb, var(--sakura-light) 30%, var(--vp-c-bg-elv)));
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.card-title-group {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.card-title {
  margin: 0 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  color: var(--vp-c-text-1);
  border-bottom: none !important;
  padding-bottom: 0 !important;
}

.year-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.stars-badge {
  display: flex;
  gap: 1px;
  color: #f59e0b;
  font-size: 13px;
  flex-shrink: 0;
}

.card-remark {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 14px 0 !important;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}

.kyoani-tag {
  background: color-mix(in srgb, var(--sakura-pink) 25%, transparent);
  color: var(--sakura-deep);
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--vp-c-text-3);
}
.empty-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

@media (max-width: 640px) {
  .anime-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
