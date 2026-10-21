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
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
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

interface AnimeItem {
  name: string
  year: number
  rating: number // 3, 4, 5
  remark: string
  isKyoAni: boolean
  tags: string[]
}

const animeList: AnimeItem[] = [
  {
    name: '紫罗兰永恒花园',
    year: 2018,
    rating: 5,
    remark: '每一帧都是壁纸。薇尔莉特追寻"爱"的旅程，让人重新理解什么是真挚',
    isKyoAni: true,
    tags: ['唯美催泪', '壁纸级画质', '人偶少女'],
  },
  {
    name: 'CLANNAD ～AFTER STORY～',
    year: 2008,
    rating: 5,
    remark: '人生番。看完第二季才知道，之前所有的欢笑都是为后来的泪水做铺垫',
    isKyoAni: true,
    tags: ['Key社', '人生神作', '催泪巅峰'],
  },
  {
    name: '凉宫春日的忧郁',
    year: 2006,
    rating: 5,
    remark: '入宅作。团长改变了轻小说和业界，也改变了我',
    isKyoAni: true,
    tags: ['入宅作', 'SOS团', '轻改神作'],
  },
  {
    name: '魔法少女小圆',
    year: 2011,
    rating: 5,
    remark: '三集定理的诞生地。老虚教你什么叫真正的魔法少女',
    isKyoAni: false,
    tags: ['虚渊玄', '三集定理', '反套路魔女'],
  },
  {
    name: 'K-ON! 轻音少女',
    year: 2009,
    rating: 4,
    remark: '放学后茶会，最纯粹的青春。呆唯是世界珍宝',
    isKyoAni: true,
    tags: ['放学后TEA TIME', '萌系日常', '乐队'],
  },
  {
    name: '幸运☆星',
    year: 2007,
    rating: 4,
    remark: '御宅族日常圣经。此方就是二次元宅的终极形态',
    isKyoAni: true,
    tags: ['泉此方', '宅文化日常', '京都电波'],
  },
  {
    name: '冰菓',
    year: 2012,
    rating: 4,
    remark: '节能主义的青春推理。折木奉太郎，教科书级的人物塑造',
    isKyoAni: true,
    tags: ['折木奉太郎', '千反田爱瑠', '青春日常推理'],
  },
  {
    name: '吹响吧！上低音号',
    year: 2015,
    rating: 4,
    remark: '京阿尼的巅峰制作水准。黄前久美子的成长线极其扎实',
    isKyoAni: true,
    tags: ['吹奏乐部', '真实青春', '作画天花板'],
  },
  {
    name: '命运石之门',
    year: 2011,
    rating: 4,
    remark: '时间穿越题材的标杆。一切都是命运石之门的选择——El Psy Kongroo',
    isKyoAni: false,
    tags: ['世界线变动', '时间机器', '助手与冈伦'],
  },
  {
    name: "BanG Dream! It's MyGO!!!!!",
    year: 2023,
    rating: 4,
    remark: '迷茫中奔跑的青春。一生一次的乐队组建，重力与真挚情感交织的破圈神作',
    isKyoAni: false,
    tags: ['重力青春', '少女乐队', '破圈热度'],
  },
  {
    name: '莉可丽丝',
    year: 2022,
    rating: 3,
    remark: '千束太可爱了。美少女特工日常，轻松愉快',
    isKyoAni: false,
    tags: ['锦木千束', '美少女特工', '动作爽番'],
  },
  {
    name: '孤独摇滚！',
    year: 2022,
    rating: 3,
    remark: '社恐吉他手的乐队梦。波奇酱就是世界上另一个我',
    isKyoAni: false,
    tags: ['后藤一里', '社恐共鸣', '结束乐队'],
  },
  {
    name: '葬送的芙莉莲',
    year: 2023,
    rating: 3,
    remark: '旅途的意义不在于终点。公路片 × 剑与魔法，寿命论背景下的情感刻画与巅峰打戏',
    isKyoAni: false,
    tags: ['寿命论', '奇幻公路片', '神仙打戏'],
  },
  {
    name: '无职转生',
    year: 2021,
    rating: 3,
    remark: '异世界转生标杆，制作精良，人物成长弧线饱满',
    isKyoAni: false,
    tags: ['异世界转生', '鲁迪乌斯', '沉浸式世界观'],
  },
]

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
