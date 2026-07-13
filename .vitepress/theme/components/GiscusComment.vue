<template>
  <div v-if="frontmatter.comments !== false" class="giscus-wrapper">
    <div ref="giscusContainer" class="giscus" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

// ============================================================
// Giscus 配置
// ============================================================
// 设置步骤：
// 1. 在 https://github.com/a3292334877-star/blog/settings 开启 Discussions
// 2. 安装 Giscus App: https://github.com/apps/giscus
// 3. 访问 https://giscus.app/zh-CN 获取 repo-id, category-id
// 4. 在项目根目录 .env 文件中填入：
//    VITE_GISCUS_REPO_ID=R_kgDO...
//    VITE_GISCUS_CATEGORY_ID=DIC_kwDO...
// ============================================================

const REPO = 'a3292334877-star/blog'
const REPO_ID = import.meta.env.VITE_GISCUS_REPO_ID ?? ''
const CATEGORY = 'General'
const CATEGORY_ID = import.meta.env.VITE_GISCUS_CATEGORY_ID ?? ''

const giscusContainer = ref<HTMLElement>()
const { isDark, frontmatter } = useData()

function loadGiscus() {
  if (!giscusContainer.value) return

  // 始终清空容器（SPA 导航从有评论页切到无评论页时需清除残留）
  giscusContainer.value.replaceChildren()

  if (frontmatter.value.comments === false) return

  // 缺少 IDs 时不挂载 Giscus，避免加载失败
  if (!REPO_ID || !CATEGORY_ID) {
    console.warn(
      '[GiscusComment] 缺少 VITE_GISCUS_REPO_ID / VITE_GISCUS_CATEGORY_ID 环境变量，评论功能未启用。' +
      ' 请复制 .env.example 为 .env 并填入 Giscus IDs。',
    )
    return
  }

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

function updateTheme() {
  const iframe = giscusContainer.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
    'https://giscus.app',
  )
}

// 主题切换只更新现有 iframe，避免重复请求和评论区闪烁
watch(isDark, () => {
  if (typeof window === 'undefined') return
  updateTheme()
})

// SPA 路由切换时重新加载 Giscus（根据 pathname 映射到对应 Discussion）
watch(
  () => route.path,
  () => {
    if (typeof window === 'undefined') return
    nextTick(() => loadGiscus())
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
