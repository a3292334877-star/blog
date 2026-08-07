<template>
  <section class="home-hero" aria-labelledby="hero-title">
    <div class="hero-bg" aria-hidden="true"></div>

    <div class="hero-shell">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> PROGRAMMER · ACGN ENTHUSIAST</p>
        <h1 id="hero-title">你好，我是 <strong>Sakiko</strong></h1>
        <p class="hero-lead">
          在代码、动画与日语之间持续探索。这里记录我的学习笔记、项目实践，以及那些值得反复回味的作品。
        </p>

        <p class="typewriter-line">
          <span class="sr-only">{{ mottos[0] }}</span>
          <span aria-hidden="true">{{ displayedText }}<span class="typing-cursor">_</span></span>
        </p>

        <div class="hero-actions">
          <a :href="withBase('/posts/')" class="hero-action hero-action--primary">
            开始阅读
            <span aria-hidden="true">→</span>
          </a>
          <a
            class="hero-action hero-action--secondary"
            href="https://github.com/a3292334877-star"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        <ul class="hero-badges" aria-label="个人标签">
          <li v-for="badge in badges" :key="badge.label">
            <span aria-hidden="true">{{ badge.icon }}</span>{{ badge.label }}
          </li>
        </ul>
      </div>

    </div>

    <button type="button" class="scroll-hint" aria-label="继续浏览" @click="scrollDown">
      <span>SCROLL</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7 10 5 5 5-5" />
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'

const mottos = [
  '至死不渝地追逐清华梦 🩷',
  '一个热爱 ACGN 的程序员小窝',
  '每天更爱 Sakiko 一点',
  'コードを書くのが好きです',
]

const badges = [
  { icon: '☕', label: 'Java Learner' },
  { icon: '🗾', label: '日语 N1' },
  { icon: '🌸', label: 'ACGN' },
]

const displayedText = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayedText.value = mottos[0]
    return
  }

  let charIndex = 0
  let textIndex = 0
  let deleting = false

  const tick = () => {
    const current = mottos[textIndex]
    displayedText.value = current.slice(0, deleting ? charIndex - 1 : charIndex + 1)
    charIndex += deleting ? -1 : 1

    if (!deleting && charIndex === current.length) {
      deleting = true
      timer = setTimeout(tick, 2200)
      return
    }
    if (deleting && charIndex === 0) {
      deleting = false
      textIndex = (textIndex + 1) % mottos.length
      timer = setTimeout(tick, 450)
      return
    }
    timer = setTimeout(tick, deleting ? 42 : 82)
  }

  tick()
})

onUnmounted(() => clearTimeout(timer))

function scrollDown() {
  document.querySelector('.about-strip')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}
</script>

<style scoped>
.home-hero {
  position: relative;
  min-height: calc(100svh - var(--vp-nav-height, 64px));
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 112px 24px 64px;
  isolation: isolate;
  background: #071026;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(90deg, rgba(4, 9, 28, .78) 0%, rgba(4, 10, 31, .48) 38%, rgba(4, 10, 31, .1) 68%, rgba(4, 9, 28, .2) 100%),
    linear-gradient(0deg, rgba(3, 7, 23, .9) 0%, rgba(3, 8, 26, .34) 46%, rgba(3, 8, 26, .12) 76%, rgba(3, 7, 23, .3) 100%),
    url('/backgrounds/k-on-hero.webp') center center / cover no-repeat;
  filter: saturate(.96) contrast(1.02);
  transform: scale(1.01);
}

.hero-shell {
  width: min(1240px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
}

.hero-copy {
  position: relative;
  z-index: 2;
  width: min(720px, 100%);
  padding: 26px 30px;
  border: 1px solid rgba(255, 255, 255, .2);
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(7, 13, 34, .78), rgba(10, 18, 43, .62));
  box-shadow: 0 24px 70px rgba(0, 0, 0, .3);
  backdrop-filter: blur(16px) saturate(1.15);
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  color: rgba(255, 255, 255, .7);
  font: 700 12px/1.4 var(--vp-font-family-mono);
  letter-spacing: .13em;
}
.eyebrow span { width: 30px; height: 2px; background: #ff9db0; }

h1 {
  margin: 0;
  max-width: 720px;
  color: #fff;
  font: 700 clamp(46px, 6vw, 72px)/1.08 var(--vp-font-family-title);
  letter-spacing: -.045em;
  text-shadow: 0 4px 28px rgba(0, 0, 0, .3);
}
h1 strong {
  color: #ffc4d1;
  font-weight: inherit;
  position: relative;
  white-space: nowrap;
}
h1 strong::after {
  content: '';
  position: absolute;
  left: 2%; right: 0; bottom: .02em;
  height: .12em;
  border-radius: 999px;
  background: rgba(255, 190, 145, .78);
  z-index: -1;
  transform: rotate(-2deg);
}

.hero-lead {
  max-width: 650px;
  margin: 18px 0 0;
  color: rgba(255, 255, 255, .84);
  font-size: clamp(15px, 1.55vw, 18px);
  line-height: 1.72;
  text-shadow: 0 2px 16px rgba(0, 0, 0, .25);
}

.typewriter-line {
  min-height: 28px;
  margin: 12px 0 0;
  color: #ffb4c3;
  font: 500 14px/1.8 var(--vp-font-family-mono);
}
.typing-cursor { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.hero-action {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 14px;
  font-weight: 700;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.hero-action:hover { transform: translateY(-2px); }
.hero-action--primary {
  color: #fff;
  background: var(--accent-solid);
  box-shadow: 0 12px 28px rgba(228,89,111,.24);
}
.hero-action--primary:hover { color: #fff; background: var(--accent-solid-hover); }
.hero-action--secondary {
  color: #fff;
  background: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .24);
  backdrop-filter: blur(12px);
}
.hero-action--secondary:hover { color: #ffd0da; border-color: rgba(255, 208, 218, .68); background: rgba(255, 255, 255, .16); }
.hero-action svg { width: 18px; height: 18px; }

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  margin: 18px 0 0;
  list-style: none;
}
.hero-badges li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border: 1px solid rgba(255, 255, 255, .16);
  border-radius: 999px;
  background: rgba(255, 255, 255, .09);
  color: rgba(255, 255, 255, .78);
  font-size: 12px;
}

.scroll-hint {
  position: absolute;
  left: 50%; bottom: 24px;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 8px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, .72);
  cursor: pointer;
  font: 600 9px/1 var(--vp-font-family-mono);
  letter-spacing: .18em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, .5);
}
.scroll-hint svg { width: 20px; animation: bounce 2s ease-in-out infinite; }
@keyframes bounce { 50% { transform: translateY(5px); } }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

:global(.dark) .hero-bg {
  background:
    linear-gradient(90deg, rgba(2, 6, 21, .82) 0%, rgba(3, 8, 26, .54) 42%, rgba(3, 8, 26, .18) 72%, rgba(2, 6, 21, .3) 100%),
    linear-gradient(0deg, rgba(2, 5, 18, .94) 0%, rgba(2, 6, 21, .42) 48%, rgba(2, 6, 21, .2) 100%),
    url('/backgrounds/k-on-hero.webp') center center / cover no-repeat;
  filter: saturate(.82) brightness(.88);
}
:global(.dark) .hero-copy { background: linear-gradient(135deg, rgba(4, 8, 24, .84), rgba(8, 13, 31, .72)); }

@media (max-width: 820px) {
  .home-hero { padding: 88px 18px 28px; }
  .hero-bg,
  :global(.dark) .hero-bg {
    background:
      linear-gradient(0deg, rgba(3, 7, 23, .72) 0%, rgba(3, 8, 26, .26) 42%, rgba(3, 8, 26, .04) 76%, rgba(3, 7, 23, .16) 100%),
      linear-gradient(90deg, rgba(3, 8, 25, .14), rgba(3, 8, 25, .02)),
      url('/backgrounds/k-on-hero-mobile.webp') center center / cover no-repeat;
    filter: saturate(.94) contrast(1.02);
  }
  :global(.dark) .hero-bg {
    background:
      linear-gradient(0deg, rgba(2, 5, 18, .82) 0%, rgba(2, 6, 21, .36) 42%, rgba(2, 6, 21, .08) 76%, rgba(2, 5, 18, .22) 100%),
      linear-gradient(90deg, rgba(2, 6, 21, .2), rgba(2, 6, 21, .04)),
      url('/backgrounds/k-on-hero-mobile.webp') center center / cover no-repeat;
    filter: saturate(.86) brightness(.92);
  }
  .hero-shell { display: flex; text-align: left; }
  .hero-copy { width: min(620px, 100%); padding: 24px; }
  .scroll-hint { display: none; }
}

@media (max-width: 520px) {
  .home-hero { padding: 72px 12px 72px; }
  .hero-copy { padding: 18px 16px; border-radius: 20px; }
  h1 { font-size: clamp(34px, 10.5vw, 43px); }
  .hero-lead { font-size: 14px; line-height: 1.62; }
  .eyebrow { margin-bottom: 9px; font-size: 9px; letter-spacing: .09em; }
  .eyebrow span { width: 20px; }
  .hero-lead { margin-top: 11px; }
  .typewriter-line { min-height: 22px; margin-top: 5px; font-size: 12px; }
  .hero-actions { margin-top: 14px; gap: 8px; }
  .hero-action { min-height: 43px; padding: 0 14px; flex: 1 1 130px; }
  .hero-badges { display: none; }
}

@media (max-height: 680px) and (min-width: 821px) {
  .home-hero { padding-top: 88px; padding-bottom: 32px; }
  .hero-copy { padding: 20px 24px; }
  h1 { font-size: clamp(42px, 5.5vw, 60px); }
  .hero-lead { margin-top: 12px; line-height: 1.55; }
  .hero-actions { margin-top: 16px; }
  .hero-badges { margin-top: 12px; }
}
</style>
