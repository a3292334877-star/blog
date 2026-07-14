<template>
  <main class="friends-page">
    <header class="friends-header">
      <p class="eyebrow">LINKS · FRIENDS</p>
      <h1>友情链接</h1>
      <p>在互联网的小路上，遇见一些有趣的人和他们认真经营的角落。</p>
    </header>

    <ul class="friends-grid">
      <li v-for="friend in friends" :key="friend.url">
        <a :href="friend.url" target="_blank" rel="noopener noreferrer" class="friend-card">
          <img
            :src="withBase(friend.avatar)"
            :alt="`${friend.name} 的站点头像`"
            width="72"
            height="72"
            loading="lazy"
          >
          <span class="friend-copy">
            <strong>{{ friend.name }}</strong>
            <span>{{ friend.description }}</span>
            <small>{{ hostname(friend.url) }} <span aria-hidden="true">↗</span></small>
          </span>
        </a>
      </li>
    </ul>

    <section class="exchange-note">
      <span class="note-icon" aria-hidden="true">🌸</span>
      <div>
        <h2>交换友链</h2>
        <p>欢迎同样认真维护内容的个人博客来交换友链，可以通过 GitHub 联系我。</p>
      </div>
      <a href="https://github.com/a3292334877-star" target="_blank" rel="noopener noreferrer">联系我</a>
    </section>
  </main>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

const friends = [
  {
    name: 'Future 的酒馆',
    url: 'https://kkbk.info/',
    description: '足够先进的创意，都与魔法无异。',
    avatar: '/friends/kkbk.png',
  },
]

function hostname(url: string) {
  return new URL(url).hostname
}
</script>

<style scoped>
.friends-page {
  width: min(960px, 100%);
  margin: 0 auto;
  padding: 112px 24px 72px;
}

.friends-header { max-width: 700px; margin-bottom: 44px; }
.eyebrow {
  margin: 0 0 10px;
  color: var(--accent-color);
  font: 700 12px/1.4 var(--vp-font-family-mono);
  letter-spacing: .14em;
}
h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font: 700 clamp(38px, 6vw, 58px)/1.2 var(--vp-font-family-title);
  letter-spacing: -.035em;
}
.friends-header > p:last-child {
  margin: 18px 0 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.8;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.friend-card {
  min-height: 132px;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  box-shadow: var(--site-shadow-sm);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}
.friend-card:hover {
  transform: translateY(-4px);
  border-color: var(--sakura-pink);
  box-shadow: var(--site-shadow-lg);
}
.friend-card img {
  flex: 0 0 auto;
  width: 72px;
  height: 72px;
  border: 3px solid color-mix(in srgb, var(--sakura-light) 70%, var(--vp-c-bg));
  border-radius: 18px;
  object-fit: cover;
}
.friend-copy { min-width: 0; display: grid; gap: 6px; }
.friend-copy strong {
  color: var(--vp-c-text-1);
  font: 700 18px/1.35 var(--vp-font-family-title);
}
.friend-copy > span {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.55;
}
.friend-copy small {
  color: var(--accent-color);
  font: 500 11px/1.4 var(--vp-font-family-mono);
}

.exchange-note {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  margin-top: 48px;
  padding: 24px 28px;
  border: 1px solid color-mix(in srgb, var(--sakura-pink) 55%, var(--vp-c-divider));
  border-radius: 20px;
  background: color-mix(in srgb, var(--sakura-light) 55%, var(--vp-c-bg));
}
.note-icon { font-size: 30px; }
.exchange-note h2 { margin: 0; color: var(--vp-c-text-1); font-size: 18px; }
.exchange-note p { margin: 5px 0 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.6; }
.exchange-note a {
  padding: 9px 15px;
  border-radius: 11px;
  background: var(--accent-color);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}
.exchange-note a:hover { background: var(--vp-c-brand-2); color: #fff; }

@media (max-width: 640px) {
  .friends-page { padding: 96px 18px 56px; }
  .friends-grid { grid-template-columns: 1fr; }
  .friend-card { padding: 20px; }
  .exchange-note { grid-template-columns: auto 1fr; padding: 20px; }
  .exchange-note a { grid-column: 1 / -1; text-align: center; }
}
</style>
