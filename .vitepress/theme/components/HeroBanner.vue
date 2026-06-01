<template>
  <section class="hero-banner">
    <!-- 背景层 -->
    <div class="hero-bg">
      <div class="hero-overlay"></div>
      <!-- 浮动樱花粒子 -->
      <div class="sakura-particles" aria-hidden="true">
        <span v-for="p in petals" :key="p.i" class="petal" :style="p.style"></span>
      </div>
    </div>

    <!-- 内容层 -->
    <div class="hero-content">
      <!-- 故障艺术标题 -->
      <GlitchText :text="greeting" />

      <!-- 副标题卡片 -->
      <div class="hero-card">
        <p class="hero-motto">
          <span class="quote-mark">"</span>
          <TypeWriter
            :texts="mottos"
            :typingSpeed="100"
            :deleteSpeed="50"
            :pauseDuration="2000"
          />
          <span class="quote-mark">"</span>
        </p>

        <!-- 状态标签行 -->
        <div class="hero-tags">
          <span class="status-tag" v-for="t in tags" :key="t.label">
            <span class="tag-icon">{{ t.icon }}</span>
            <span class="tag-text">{{ t.label }}</span>
          </span>
        </div>

        <!-- 社交链接 -->
        <div class="hero-social">
          <a
            v-for="s in socials"
            :key="s.url"
            :href="s.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="s.name"
            class="hero-social-link"
          >
            <svg class="social-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>{{ s.name }}</span>
          </a>
        </div>
      </div>

      <!-- 向下滚动提示 -->
      <div class="scroll-hint" @click="scrollDown">
        <span>往下看</span>
        <svg class="chevron bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import GlitchText from './GlitchText.vue'
import TypeWriter from './TypeWriter.vue'

const { theme } = useData()
const themeConfig = theme.value

const greeting = themeConfig.hello || 'Hello, World 🌸'
const mottos = [
  '至死不渝地追逐清华梦 🩷',
  '一个热爱ACGN的程序员小窝',
  '每天更爱海平君一点',
  'コードを書くのが好きです',
]

const tags = [
  { icon: '🎓', label: '25计应2班' },
  { icon: '☕', label: 'Java Learner' },
  { icon: '🗾', label: '日语N1' },
  { icon: '🍡', label: '忠实京蜜' },
]

const socials = [
  { name: 'GitHub', url: 'https://github.com/TanHaiping' },
]

// SSR安全: 客户端生成随机花瓣位置
const petals = ref<Array<{ i: number; style: Record<string, string> }>>([])

onMounted(() => {
  petals.value = Array.from({ length: 20 }, (_, i) => ({
    i,
    style: {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 12}s`,
      width: `${8 + Math.random() * 16}px`,
      height: `${8 + Math.random() * 16}px`,
      opacity: String(0.3 + Math.random() * 0.5),
    },
  }))
})

function scrollDown() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.hero-banner {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ffb7c5 0%, #ffd1dc 25%, #fff0f3 50%, #ffe4b5 75%, #ffb7c5 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%);
}

/* 樱花粒子 */
.sakura-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -20px;
  background: #ffb7c5;
  border-radius: 50% 0 50% 0;
  animation: petal-fall linear infinite;
  transform: rotate(0deg);
}

@keyframes petal-fall {
  0% {
    transform: translateY(-20px) rotate(0deg) scale(1);
    opacity: 1;
  }
  80% { opacity: 0.6; }
  100% {
    transform: translateY(105vh) rotate(720deg) scale(0.3);
    opacity: 0;
  }
}

/* 内容层 */
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
}

.hero-card {
  margin-top: 24px;
  max-width: 600px;
  width: 100%;
  padding: 32px 40px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.hero-motto {
  text-align: center;
  font-size: 15px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
  min-height: 54px;

  .quote-mark {
    color: var(--sakura-deep);
    font-size: 18px;
  }
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  background: var(--sakura-light);
  border-radius: 20px;
  font-size: 13px;
  color: #888;
  transition: all 0.2s;

  &:hover {
    background: var(--sakura-pink);
    color: #fff;
    transform: translateY(-1px);
  }

  .tag-icon { font-size: 15px; }
}

.hero-social {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.hero-social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #333;
  color: #fff;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(254, 150, 0, 0.3);
  }
}

.social-svg {
  width: 18px;
  height: 18px;
}

/* 向下滚动 */
.scroll-hint {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover { color: rgba(0, 0, 0, 0.6); }

  .chevron {
    width: 24px;
    height: 24px;
  }

  .bounce {
    animation: bounce-down 2s infinite;
  }
}

@keyframes bounce-down {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(6px); }
  60% { transform: translateY(3px); }
}

@media (max-width: 768px) {
  .hero-card {
    padding: 24px 20px;
    margin: 16px 16px 0;
  }
  .hero-motto { font-size: 14px; }
}
</style>
