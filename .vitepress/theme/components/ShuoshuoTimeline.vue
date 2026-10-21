<template>
  <div class="shuoshuo-page-container">
    <!-- 顶部概览与统计 -->
    <div class="timeline-header-card">
      <div class="author-badge-row">
        <div class="avatar-ring">
          <span class="avatar-icon">🌸</span>
        </div>
        <div class="author-info">
          <div class="author-name">Sakiko</div>
          <div class="author-bio">日常记录 · 灵感碎片 · 学习心路</div>
        </div>
        <div class="stats-pills">
          <span class="stat-pill"><strong>{{ shuoshuoList.length }}</strong> 条碎碎念</span>
          <span class="stat-pill"><strong>{{ years.length }}</strong> 个年份</span>
        </div>
      </div>

      <div class="filter-bar">
        <div class="year-filters">
          <button
            class="filter-chip"
            :class="{ active: selectedYear === 'all' }"
            @click="selectedYear = 'all'"
          >
            全部
          </button>
          <button
            v-for="y in years"
            :key="y"
            class="filter-chip"
            :class="{ active: selectedYear === y }"
            @click="selectedYear = y"
          >
            {{ y }} 年
          </button>
        </div>

        <div class="search-mini">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索碎碎念内容或标签..."
            class="search-mini-input"
          />
        </div>
      </div>
    </div>

    <!-- 时光轴主体 -->
    <div class="timeline-stream">
      <div v-for="(group, yIndex) in groupedShuoshuo" :key="group.year" class="year-group">
        <div class="year-marker">
          <span class="year-flag">{{ group.year }}</span>
          <div class="year-line"></div>
        </div>

        <div class="timeline-nodes">
          <article
            v-for="(item, index) in group.items"
            :key="item.date + index"
            class="timeline-card"
            :style="{ animationDelay: (index * 60) + 'ms' }"
          >
            <!-- 左侧时间与点 -->
            <div class="node-axis">
              <div class="node-dot" :class="'mood-' + item.tagType"></div>
              <div class="node-line"></div>
            </div>

            <!-- 卡片内容 -->
            <div class="card-body">
              <div class="card-meta">
                <span class="date-text">{{ item.displayDate }}</span>
                <span class="tag-badge" :class="'badge-' + item.tagType">{{ item.tag }}</span>
              </div>

              <div class="card-content-text">
                {{ item.content }}
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-if="groupedShuoshuo.length === 0" class="empty-state">
        <span class="empty-emoji">🍃</span>
        <p>没有找到相关碎碎念哦~</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ShuoshuoItem {
  date: string // YYYY-MM-DD
  year: string
  displayDate: string
  content: string
  tag: string
  tagType: 'daily' | 'study' | 'milestone' | 'mood'
}

const rawData = [
  {
    date: '2026-07-29',
    content: '感觉每一天都没什么事干，我现在到底该做什么呢？',
    tag: '思考',
    tagType: 'mood' as const,
  },
  {
    date: '2026-07-22',
    content: '也是不出所料的挂了，不过项目都练熟了，下一次一定过！',
    tag: '驾考',
    tagType: 'daily' as const,
  },
  {
    date: '2026-07-20',
    content: '科三好焦虑啊，就练了两天就因为教练给的压力太大在家自学了，希望周三能一把过~~~~',
    tag: '驾考',
    tagType: 'daily' as const,
  },
  {
    date: '2026-07-15',
    content: '终于回家惹！放假的日子最舒服啦 🏡',
    tag: '日常',
    tagType: 'daily' as const,
  },
  {
    date: '2026-06-24',
    content: '到底是回家过暑假还是打暑假工呢？好难抉择啊！',
    tag: '日常',
    tagType: 'daily' as const,
  },
  {
    date: '2026-06-14',
    content: '英语四级过咯，接下来就要准备六级了，再准备雅思托福，准备去国外闯荡了！🎉',
    tag: '考试通关',
    tagType: 'milestone' as const,
  },
  {
    date: '2026-06-01',
    content: '今天刷完了 LeetCode 的哈希表专题，整理了笔记发到博客上。C++ 的 unordered_map 自定义哈希这个坑，以前被卡过好多次。',
    tag: '算法刷题',
    tagType: 'study' as const,
  },
  {
    date: '2026-05-28',
    content: '在写一个 Flutter 项目，Provider 的状态管理终于弄懂了。之前一直用 setState，代码一多就乱。',
    tag: 'Flutter',
    tagType: 'study' as const,
  },
  {
    date: '2026-04-20',
    content: '蓝桥杯省赛结束，以省三收尾，虽然名次不是很高，但我会再接再厉的！💪',
    tag: '竞赛',
    tagType: 'milestone' as const,
  },
  {
    date: '2026-03-08',
    content: '18 岁生日，成年了，我终于长大啦！🎂✨',
    tag: '生日成人礼',
    tagType: 'milestone' as const,
  },
  {
    date: '2026-01-31',
    content: 'N1 成绩出来了，179 分！努力终究没有白费，日本留学目标又迈近了一大步 🇯🇵',
    tag: '日语N1',
    tagType: 'milestone' as const,
  },
  {
    date: '2025-09-01',
    content: '大学开学了，选择了计算机科学与技术，充满期待！🎒💻',
    tag: '开学启程',
    tagType: 'milestone' as const,
  },
]

const shuoshuoList: ShuoshuoItem[] = rawData.map((d) => {
  const [y, m, day] = d.date.split('-')
  return {
    ...d,
    year: y,
    displayDate: `${m}月${day}日`,
  }
})

const years = Array.from(new Set(shuoshuoList.map((item) => item.year))).sort((a, b) => b.localeCompare(a))

const selectedYear = ref('all')
const searchQuery = ref('')

const filteredList = computed(() => {
  return shuoshuoList.filter((item) => {
    if (selectedYear.value !== 'all' && item.year !== selectedYear.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const matchContent = item.content.toLowerCase().includes(q)
      const matchTag = item.tag.toLowerCase().includes(q)
      const matchDate = item.date.includes(q)
      if (!matchContent && !matchTag && !matchDate) return false
    }
    return true
  })
})

const groupedShuoshuo = computed(() => {
  const groups: { year: string; items: ShuoshuoItem[] }[] = []
  for (const item of filteredList.value) {
    let group = groups.find((g) => g.year === item.year)
    if (!group) {
      group = { year: item.year, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups
})
</script>

<style scoped>
.shuoshuo-page-container {
  margin: 24px 0 48px;
}

.timeline-header-card {
  padding: 22px 24px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 32px;
}

.author-badge-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.avatar-ring {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-deep));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(217, 122, 140, 0.35);
}

.avatar-icon {
  font-size: 24px;
}

.author-info {
  flex: 1;
  min-width: 140px;
}

.author-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.author-bio {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

.stats-pills {
  display: flex;
  gap: 10px;
}

.stat-pill {
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
}

.stat-pill strong {
  color: var(--accent-color);
  font-weight: 700;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px dashed var(--vp-c-divider);
}

.year-filters {
  display: flex;
  gap: 8px;
}

.filter-chip {
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  border-color: var(--sakura-pink);
  color: var(--accent-color);
}

.filter-chip.active {
  background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-deep));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(217, 122, 140, 0.3);
}

.search-mini-input {
  padding: 6px 14px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-1);
  outline: none;
  min-width: 220px;
  transition: border-color 0.2s;
}

.search-mini-input:focus {
  border-color: var(--sakura-pink);
}

.timeline-stream {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.year-marker {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.year-flag {
  font-size: 18px;
  font-weight: 800;
  color: var(--sakura-deep);
  font-family: var(--vp-font-family-mono);
  padding: 4px 14px;
  background: color-mix(in srgb, var(--sakura-light) 60%, var(--vp-c-bg-elv));
  border: 1px solid var(--sakura-pink);
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(245, 184, 196, 0.25);
}

.year-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--sakura-pink), transparent);
}

.timeline-nodes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-card {
  display: flex;
  gap: 20px;
  position: relative;
  animation: fade-in-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.node-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
  padding-top: 14px;
}

.node-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--sakura-pink);
  background: var(--sakura-deep);
  z-index: 2;
  transition: transform 0.3s, box-shadow 0.3s;
}

.timeline-card:hover .node-dot {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px var(--sakura-pink);
}

.node-dot.mood-milestone {
  background: #f59e0b;
  box-shadow: 0 0 0 2px #f59e0b;
}

.node-dot.mood-study {
  background: #3b82f6;
  box-shadow: 0 0 0 2px #3b82f6;
}

.node-line {
  flex: 1;
  width: 2px;
  background: var(--vp-c-divider);
  margin-top: 6px;
}

.card-body {
  flex: 1;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 16px 20px;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.25s,
              border-color 0.25s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}

.timeline-card:hover .card-body {
  transform: translateX(4px);
  border-color: var(--sakura-pink);
  box-shadow: 0 8px 24px rgba(245, 184, 196, 0.2);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.date-text {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.tag-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
}

.badge-milestone {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.badge-study {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.badge-daily {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.badge-mood {
  background: rgba(217, 122, 140, 0.14);
  color: var(--sakura-deep);
}

.card-content-text {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--vp-c-text-3);
}

.empty-emoji {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

@media (max-width: 640px) {
  .search-mini-input {
    width: 100%;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
