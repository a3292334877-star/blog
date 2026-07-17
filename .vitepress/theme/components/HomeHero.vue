<template>
  <section class="home-hero" aria-labelledby="hero-title">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--one" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--two" aria-hidden="true"></div>

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

      <div class="hero-visual" aria-hidden="true">
        <div class="visual-ring visual-ring--outer"></div>
        <div class="visual-ring visual-ring--inner"></div>
        <div class="avatar-frame">
          <img :src="withBase('/avatar.jpg')" alt="" width="320" height="320">
        </div>
        <span class="floating-note floating-note--code">&lt;/&gt; Code</span>
        <span class="floating-note floating-note--jp">日本語 N1</span>
        <span class="floating-note floating-note--anime">Animation ✦</span>
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
  min-height: 100svh;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 112px 24px 88px;
  isolation: isolate;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(rgba(255,255,255,.7), rgba(255,255,255,.7)),
    linear-gradient(90deg, rgba(228,89,111,.055) 1px, transparent 1px),
    linear-gradient(rgba(228,89,111,.055) 1px, transparent 1px),
    radial-gradient(circle at 18% 20%, #ffe2e8 0, transparent 38%),
    radial-gradient(circle at 82% 72%, #ffedd2 0, transparent 36%),
    #fffafa;
  background-size: auto, 48px 48px, 48px 48px, auto, auto, auto;
}

.hero-orb {
  position: absolute;
  z-index: -2;
  border-radius: 999px;
  filter: blur(4px);
  opacity: .65;
}
.hero-orb--one { width: 240px; height: 240px; left: -100px; top: 18%; background: #ffd7df; }
.hero-orb--two { width: 320px; height: 320px; right: -170px; bottom: 6%; background: #ffe9c9; }

.hero-shell {
  width: min(1180px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, .85fr);
  align-items: center;
  gap: clamp(48px, 8vw, 112px);
}

.hero-copy {
  position: relative;
  z-index: 2;
  padding: 28px 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, .58);
  box-shadow: 0 18px 48px rgba(93, 47, 59, .06);
  backdrop-filter: blur(5px);
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
  font: 700 12px/1.4 var(--vp-font-family-mono);
  letter-spacing: .13em;
}
.eyebrow span { width: 30px; height: 2px; background: var(--accent-color); }

h1 {
  margin: 0;
  max-width: 720px;
  color: var(--vp-c-text-1);
  font: 700 clamp(48px, 7vw, 82px)/1.08 var(--vp-font-family-title);
  letter-spacing: -.045em;
}
h1 strong {
  color: var(--accent-color);
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
  background: var(--sakura-warm);
  z-index: -1;
  transform: rotate(-2deg);
}

.hero-lead {
  max-width: 650px;
  margin: 28px 0 0;
  color: var(--vp-c-text-2);
  font-size: clamp(16px, 1.7vw, 19px);
  line-height: 1.9;
}

.typewriter-line {
  min-height: 28px;
  margin: 18px 0 0;
  color: var(--accent-color);
  font: 500 14px/1.8 var(--vp-font-family-mono);
}
.typing-cursor { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
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
  background: var(--accent-color);
  box-shadow: 0 12px 28px rgba(228,89,111,.24);
}
.hero-action--primary:hover { color: #fff; background: var(--vp-c-brand-2); }
.hero-action--secondary {
  color: var(--vp-c-text-1);
  background: rgba(255,255,255,.72);
  border-color: rgba(228,89,111,.18);
  backdrop-filter: blur(12px);
}
.hero-action--secondary:hover { color: var(--accent-color); border-color: var(--sakura-pink); }
.hero-action svg { width: 18px; height: 18px; }

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  margin: 26px 0 0;
  list-style: none;
}
.hero-badges li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border: 1px solid rgba(228,89,111,.14);
  border-radius: 999px;
  background: rgba(255,255,255,.58);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.hero-visual {
  position: relative;
  width: min(410px, 36vw);
  aspect-ratio: 1;
  justify-self: center;
  display: grid;
  place-items: center;
}
.avatar-frame {
  width: 68%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 10px solid rgba(255,255,255,.78);
  border-radius: 42% 58% 56% 44% / 45% 44% 56% 55%;
  background: linear-gradient(145deg, #fff, #ffe8ed);
  box-shadow: 0 30px 70px rgba(155,68,88,.2);
  animation: avatar-float 6s ease-in-out infinite;
}
.avatar-frame img { width: 100%; height: 100%; display: block; object-fit: cover; }
@keyframes avatar-float { 50% { transform: translateY(-10px) rotate(1deg); } }

.visual-ring { position: absolute; inset: 7%; border: 1px dashed rgba(228,89,111,.32); border-radius: 50%; }
.visual-ring--inner { inset: 18%; border-style: solid; border-color: rgba(228,89,111,.12); }
.floating-note {
  position: absolute;
  padding: 9px 13px;
  border: 1px solid rgba(228,89,111,.15);
  border-radius: 12px;
  background: rgba(255,255,255,.78);
  box-shadow: 0 10px 30px rgba(94,52,62,.1);
  backdrop-filter: blur(12px);
  color: var(--vp-c-text-2);
  font: 600 12px/1 var(--vp-font-family-mono);
}
.floating-note--code { top: 11%; left: 0; transform: rotate(-5deg); }
.floating-note--jp { top: 28%; right: -4%; transform: rotate(4deg); }
.floating-note--anime { left: 4%; bottom: 13%; transform: rotate(3deg); }

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
  color: var(--vp-c-text-3);
  cursor: pointer;
  font: 600 9px/1 var(--vp-font-family-mono);
  letter-spacing: .18em;
}
.scroll-hint svg { width: 20px; animation: bounce 2s ease-in-out infinite; }
@keyframes bounce { 50% { transform: translateY(5px); } }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

:global(.dark) .hero-bg {
  background:
    linear-gradient(rgba(26,22,32,.82), rgba(26,22,32,.82)),
    linear-gradient(90deg, rgba(228,89,111,.08) 1px, transparent 1px),
    linear-gradient(rgba(228,89,111,.08) 1px, transparent 1px),
    radial-gradient(circle at 18% 20%, #4b2835 0, transparent 38%),
    radial-gradient(circle at 82% 72%, #4b3824 0, transparent 36%),
    var(--vp-c-bg);
  background-size: auto, 48px 48px, 48px 48px, auto, auto, auto;
}
:global(.dark) .hero-action--secondary,
:global(.dark) .hero-badges li,
:global(.dark) .floating-note { background: rgba(39,33,48,.72); }
:global(.dark) .hero-copy { background: rgba(39,33,48,.58); }

@media (max-width: 820px) {
  .home-hero { min-height: auto; padding: 120px 24px 88px; }
  .hero-shell { grid-template-columns: 1fr; gap: 54px; text-align: center; }
  .eyebrow, .hero-actions, .hero-badges { justify-content: center; }
  .hero-lead { margin-inline: auto; }
  .hero-visual { width: min(360px, 80vw); grid-row: 1; }
  .hero-copy { grid-row: 2; }
  .floating-note { font-size: 10px; }
}

@media (max-width: 520px) {
  .home-hero { padding-inline: 18px; }
  h1 { font-size: clamp(42px, 14vw, 58px); }
  .hero-lead { font-size: 15px; line-height: 1.8; }
  .hero-visual { width: min(300px, 82vw); }
  .hero-copy { padding: 22px 18px; }
  .hero-action { flex: 1 1 140px; }
  .floating-note--jp { right: 0; }
}
</style>
