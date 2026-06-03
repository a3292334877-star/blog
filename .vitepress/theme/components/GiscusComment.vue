<template>
  <div v-if="frontmatter.comments !== false" class="giscus-wrapper">
    <div ref="giscusContainer" class="giscus" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// ============================================================
// Giscus 配置 — 用你自己的 GitHub 仓库信息替换
// ============================================================
// 设置步骤：
// 1. 在 https://github.com/a3292334877-star/blog/settings 开启 Discussions
// 2. 安装 Giscus App: https://github.com/apps/giscus
// 3. 访问 https://giscus.app/zh-CN 获取 repo-id, category-id
// ============================================================

const REPO = 'a3292334877-star/blog'
const REPO_ID = 'R_kgDOStv0cA'
const CATEGORY = 'General'
const CATEGORY_ID = 'DIC_kwDOStv0cM4C-XEc'

const giscusContainer = ref<HTMLElement>()
const { isDark, frontmatter } = useData()

function loadGiscus() {
  if (!giscusContainer.value) return

  // 始终清空容器（SPA 导航从有评论页切到无评论页时需清除残留）
  giscusContainer.value.innerHTML = ''

  if (frontmatter.value.comments === false) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.setAttribute('data-repo', REPO)
  script.setAttribute('data-repo-id', REPO_ID)
  script.setAttribute('data-category', CATEGORY)
  script.setAttribute('data-category-id', CATEGORY_ID)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.setAttribute('data-loading', 'lazy')

  giscusContainer.value.appendChild(script)
}

const route = useRoute()

onMounted(loadGiscus)

// 主题切换时重新加载 Giscus
watch(isDark, () => {
  if (typeof window === 'undefined') return
  loadGiscus()
})

// SPA 路由切换时重新加载 Giscus（根据 pathname 映射到对应 Discussion）
watch(
  () => route.path,
  () => {
    if (typeof window === 'undefined') return
    loadGiscus()
  },
)
</script>

<style scoped>
.giscus-wrapper {
  max-width: 688px;
  margin: 48px auto 0;
  padding: 0 24px;
}

.giscus {
  min-height: 200px;
}
</style>
