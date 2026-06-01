<template>
  <section class="home-hero">
    <!-- 渐变背景 -->
    <div class="hero-bg"></div>

    <!-- Glitch 标题 -->
    <div class="glitch" :data-text="greeting">{{ greeting }}</div>

    <!-- 打字机 -->
    <p class="typewriter-line">
      <span class="quote">"</span>
      <span class="typed">{{ displayedText }}</span>
      <span class="typing-cursor">|</span>
      <span class="quote">"</span>
    </p>

    <!-- 标签 -->
    <div class="hero-badges">
      <span v-for="t in badges" :key="t" class="badge">{{ t }}</span>
    </div>

    <!-- GitHub -->
    <a class="gh-btn" href="https://github.com/a3292334877-star" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      GitHub
    </a>

    <!-- 向下 -->
    <div class="scroll-hint" @click="scrollDown">
      <span>往下看</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="bounce-arrow">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const greeting = 'Hello, Sakiko 🌸'

const mottos = [
  '至死不渝地追逐清华梦 🩷',
  '一个热爱ACGN的程序员小窝',
  '每天更爱Sakiko一点',
  'コードを書くのが好きです',
]

const badges = ['☕ Java Learner', '🗾 日语N1', '🍡 忠实京蜜', '🌸 ACGN']

// Typewriter
const displayedText = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  let charIdx = 0
  let textIdx = 0
  let deleting = false

  function tick() {
    const current = mottos[textIdx]
    if (!deleting) {
      displayedText.value = current.substring(0, charIdx + 1)
      charIdx++
      if (charIdx === current.length) {
        timer = setTimeout(() => { deleting = true; tick() }, 2000)
        return
      }
      timer = setTimeout(tick, 100)
    } else {
      displayedText.value = current.substring(0, charIdx - 1)
      charIdx--
      if (charIdx === 0) {
        deleting = false
        textIdx = (textIdx + 1) % mottos.length
        timer = setTimeout(tick, 500)
        return
      }
      timer = setTimeout(tick, 50)
    }
  }
  tick()
})

onUnmounted(() => { if (timer) clearTimeout(timer) })

function scrollDown() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}
</script>

<style scoped>
.home-hero {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ffb7c5, #ffd1dc 25%, #fff0f3 50%, #ffe4b5 75%, #ffb7c5);
  background-size: 400% 400%;
  animation: bg-shift 15s ease infinite;
}

@keyframes bg-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Glitch */
.glitch {
  position: relative;
  font-weight: bold;
  font-size: 72px;
  color: #fff;
  text-shadow: rgba(0,0,0,0.2) 4px 4px 8px;
  z-index: 1;
}
.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0; width: 100%;
  clip: rect(0,0,0,0);
}
.glitch::before { left: -1px; text-shadow: 1px 0 #ff3f1a; }
.glitch::after  { left: 1px;  text-shadow: -1px 0 #00a7e0; }
.glitch:hover::before {
  text-shadow: 4px 0 #ff3f1a;
  animation: glitch-1 0.8s infinite ease-in-out alternate-reverse;
}
.glitch:hover::after {
  text-shadow: -4px 0 #00a7e0;
  animation: glitch-2 0.8s infinite ease-in-out alternate-reverse;
}

@keyframes glitch-1 {
  0% { clip: rect(36px,9999px,9px,0); }
  25% { clip: rect(25px,9999px,99px,0); }
  50% { clip: rect(50px,9999px,102px,0); }
  75% { clip: rect(30px,9999px,92px,0); }
  100% { clip: rect(91px,9999px,98px,0); }
}
@keyframes glitch-2 {
  0% { top:-1px; left:1px; clip: rect(65px,9999px,119px,0); }
  25% { top:-6px; left:4px; clip: rect(79px,9999px,19px,0); }
  50% { top:-3px; left:2px; clip: rect(68px,9999px,11px,0); }
  75% { top:0; left:-4px; clip: rect(95px,9999px,53px,0); }
  100% { top:-1px; left:-1px; clip: rect(31px,9999px,149px,0); }
}

/* Typewriter */
.typewriter-line {
  position: relative;
  z-index: 1;
  font-size: 16px;
  color: #555;
  text-align: center;
  margin: 24px 0 0;
  min-height: 28px;
}
.quote { color: var(--sakura-deep); margin: 0 6px; font-size: 18px; }
.typing-cursor { color: var(--sakura-deep); animation: blink 1s step-end infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Badges */
.hero-badges {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}
.badge {
  padding: 6px 16px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  font-size: 13px;
  color: #777;
  transition: all 0.2s;
}
.badge:hover {
  background: var(--sakura-pink);
  color: #fff;
  transform: translateY(-1px);
}

/* GitHub btn */
.gh-btn {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px 28px;
  background: #333;
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
}
.gh-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(254,150,0,0.3);
}

/* Scroll hint */
.scroll-hint {
  position: absolute;
  bottom: 40px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(0,0,0,0.35);
  font-size: 13px;
  cursor: pointer;
}
.scroll-hint:hover { color: rgba(0,0,0,0.55); }
.bounce-arrow {
  width: 24px;
  height: 24px;
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%,20%,50%,80%,100% { transform: translateY(0); }
  40% { transform: translateY(6px); }
  60% { transform: translateY(3px); }
}

@media (max-width: 720px) {
  .glitch { font-size: 42px; }
  .typewriter-line { font-size: 14px; }
}
</style>
