<template>
  <footer class="custom-footer">
    <div class="footer-inner">
      <!-- 左侧: 版权 -->
      <div class="footer-left">
        <p class="footer-brand">
          <span>🌸</span> 海平的博客
        </p>
        <p class="footer-copy">
          © {{ year }} 谭海平 | 用 VitePress 构建
        </p>
      </div>

      <!-- 中间: 快速链接 -->
      <div class="footer-center">
        <h4 class="footer-heading">导航</h4>
        <ul class="footer-links">
          <li><a :href="base">🏠 首页</a></li>
          <li><a :href="`${base}posts/`">📝 文章</a></li>
          <li><a :href="`${base}tags/`">🏷️ 标签</a></li>
          <li><a :href="`${base}about/`">👤 关于</a></li>
        </ul>
      </div>

      <!-- 右侧: 社交 -->
      <div class="footer-right">
        <h4 class="footer-heading">联系</h4>
        <div class="footer-social">
          <a
            v-for="s in socials"
            :key="s.name"
            :href="s.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="s.name"
          >
            <svg class="social-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>{{ s.name }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 底部装饰线 -->
    <div class="footer-decoration">
      <span class="line"></span>
      <span class="heart">🩷</span>
      <span class="line"></span>
    </div>

    <p class="footer-motto">至死不渝</p>
  </footer>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'

const base = useData().site.value.base
const year = new Date().getFullYear()

const socials = [
  { name: 'GitHub', url: 'https://github.com/TanHaiping' },
]
</script>

<style lang="scss" scoped>
.custom-footer {
  background: #fff;
  border-top: 1px solid var(--color-border);
  margin-top: 80px;
  padding: 48px 24px 24px;

  html.dark & {
    background: #1e1e1e;
  }
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
}

.footer-brand {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text);
}

.footer-copy {
  font-size: 13px;
  color: var(--color-gray);
  margin: 0;
}

.footer-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  a {
    color: var(--color-gray);
    font-size: 14px;
    transition: color 0.2s;

    &:hover { color: var(--color-accent); }
  }
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-gray);
    font-size: 14px;
    transition: color 0.2s;

    &:hover { color: var(--color-accent); }
  }
}

.social-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.footer-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 32px 0 12px;

  .line {
    display: block;
    width: 60px;
    height: 1px;
    background: var(--sakura-pink, #ffb7c5);
  }

  .heart { font-size: 16px; }
}

.footer-motto {
  text-align: center;
  font-size: 12px;
  color: var(--color-gray);
  opacity: 0.6;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
