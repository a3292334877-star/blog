<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const MODEL_PATH = '/blog/live2d/model-static.json'

declare global {
  interface Window {
    L2Dwidget: any
  }
}

async function loadResources(): Promise<void> {
  // Font Awesome（live2d-widget 依赖）
  if (!document.querySelector('link[data-live2d="fa"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/blog/live2d/font-awesome.min.css'
    link.setAttribute('data-live2d', 'fa')
    document.head.appendChild(link)
  }

  // L2Dwidget JS（已本地化，不依赖 CDN）
  if (!window.L2Dwidget) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = '/blog/live2d/L2Dwidget.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Live2D load failed'))
      document.head.appendChild(script)
    })
  }
}

function initWidget(): void {
  // L2Dwidget 的 webpack public path 已硬编码为 /blog/live2d/，
  // 会自动从本地加载 chunk (L2Dwidget.0.min.js) 与模型资源，
  // pluginRootPath / pluginJsPath / pluginModelPath 在 bundle 中未被引用，无需设置。
  window.L2Dwidget.init({
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
      enable: false,
      hitokoto: false,
    },
    name: {
      div: 'live2d-tooltip',
    },
    dev: {
      border: false,
    },
  })
}

onMounted(async () => {
  try {
    await loadResources()
    initWidget()
  } catch (e) {
    console.error('Live2D load failed:', e)
  }
})
</script>
