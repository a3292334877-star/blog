<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

const MODEL_PATH = withBase('/live2d/model.json')
let loadTimer: ReturnType<typeof setTimeout> | null = null
let idleHandle: number | null = null

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

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
    link.href = withBase('/live2d/font-awesome.min.css')
    link.setAttribute('data-live2d', 'fa')
    document.head.appendChild(link)
  }

  // L2Dwidget JS（已本地化，不依赖 CDN）
  if (!window.L2Dwidget) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = withBase('/live2d/L2Dwidget.min.js')
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Live2D load failed'))
      document.head.appendChild(script)
    })
  }
}

function initWidget(): void {
  // L2Dwidget 的 webpack public path 已调整为根域名下的 /live2d/，
  // 会自动从本地加载 chunk (L2Dwidget.0.min.js) 与模型资源。
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
      show: false,
      scale: 0.5,
      motion: false,
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

function shouldLoad(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches
    && !connection?.saveData
}

async function loadWidget(): Promise<void> {
  try {
    await loadResources()
    initWidget()
  } catch (e) {
    console.error('Live2D load failed:', e)
  }
}

onMounted(() => {
  if (!shouldLoad()) return

  // 浏览器空闲时再加载 1MB+ 的模型；不支持 idle callback 时延迟加载。
  const idleWindow = window as IdleWindow
  if (idleWindow.requestIdleCallback) {
    idleHandle = idleWindow.requestIdleCallback(() => {
      void loadWidget()
    }, { timeout: 5000 })
  } else {
    loadTimer = setTimeout(() => {
      void loadWidget()
    }, 3000)
  }
})

onUnmounted(() => {
  if (loadTimer) clearTimeout(loadTimer)
  if (idleHandle !== null) {
    const idleWindow = window as IdleWindow
    idleWindow.cancelIdleCallback?.(idleHandle)
  }
})
</script>
