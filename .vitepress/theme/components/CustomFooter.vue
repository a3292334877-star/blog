<template>
  <footer class="custom-footer">
    <div class="footer-inner">
      <!-- 左侧: 版权 -->
      <div class="footer-left">
        <p class="footer-brand">
          <span>🌸</span> 海平的博客
        </p>
        <p class="footer-copy">
          © {{ year }} 谭海平 | 用 VitePress + Sakura 构建
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
            <i :class="s.iconClass"></i>
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
  { name: 'GitHub', url: 'https://github.com/TanHaiping', iconClass: 'fab fa-github' },
]
</script>

<style lang="scss" scoped>
.custom-footer {
  background: #fff;
  border-top: 1px solid var(--color-border);
  margin-top: 80px;
  padding: 48px 24px 24px;
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

    i { font-size: 16px; width: 20px; }
  }
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

  .heart {
    font-size: 16px;
  }
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
