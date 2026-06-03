<template>
  <!-- Live2D widget is injected into document.body by the library, no template needed -->
  <div style="display: none" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// ============================================================
// Live2D 看板娘配置
// ============================================================
// 模型文件请放入 public/live2d/ 目录
// 支持的格式：Live2D Cubism 2.x (.model.json)
//
// 使用自己的模型：
//   将 modelPath 改为 '/blog/live2d/你的模型.model.json'
//
// 找模型的地方：
//   - GitHub 搜索 "live2d model"
//   - B站搜索 "live2d模型分享"
//   - https://github.com/stevenjoezhang/live2d-widget-models
// ============================================================

// 本地祥子模型
const MODEL_PATH = '/blog/live2d/model.json'

declare global {
  interface Window {
    L2Dwidget: any
  }
}

// --- 加载 CDN 资源 ---
async function loadResources(): Promise<void> {
  // Font Awesome（live2d-widget 依赖）
  if (!document.querySelector('link[data-live2d="fa"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fastly.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css'
    link.setAttribute('data-live2d', 'fa')
    document.head.appendChild(link)
  }

  // L2Dwidget JS
  if (!window.L2Dwidget) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://fastly.jsdelivr.net/npm/live2d-widget@3.0.4/lib/L2Dwidget.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Live2D 加载失败'))
      document.head.appendChild(script)
    })
  }
}

// --- 初始化看板娘 ---
function initWidget(): void {
  window.L2Dwidget.init({
    pluginRootPath: 'https://fastly.jsdelivr.net/npm/live2d-widget@3.0.4/',
    pluginJsPath: 'lib/',
    pluginModelPath: 'assets/',
    tagMode: false,
    debug: false,
    model: {
      jsonPath: MODEL_PATH,
      scale: 1,
    },
    display: {
      superSample: 2,
      width: 200,
      height: 300,
      position: 'left',
      hOffset: 0,
      vOffset: -20,
    },
    mobile: {
      show: true,
      scale: 0.5,
      motion: true,
    },
    react: {
      opacityDefault: 0.8,
      opacityOnHover: 0.2,
    },
    dialog: {
      enable: true,
      script: {
        'default': [
          '你好，我是{name}',
          '有什么可以帮你的吗？',
          '欢迎来到我的博客~',
        ],
        'hover': {
          'default': ['诶？怎么了？'],
        },
      },
      hitokoto: false,
    },
    name: {
      div: 'live2d-tooltip',
    },
  })
}

onMounted(async () => {
  try {
    await loadResources()
    initWidget()
  } catch (e) {
    console.error('Live2D 看板娘加载失败:', e)
  }
})
</script>
