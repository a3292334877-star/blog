import { onMounted, onUnmounted, ref } from 'vue'

const scrollY = ref(0)
const progress = ref(0)

let subscriberCount = 0
let ticking = false

function updateScrollMetrics() {
  const top = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollY.value = top
  progress.value = docHeight > 0 ? Math.min((top / docHeight) * 100, 100) : 0
}

function onViewportChange() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateScrollMetrics()
    ticking = false
  })
}

/** Share a single passive window scroll/resize listener across layout components. */
export function useWindowScroll() {
  onMounted(() => {
    if (subscriberCount === 0) {
      updateScrollMetrics()
      window.addEventListener('scroll', onViewportChange, { passive: true })
      window.addEventListener('resize', onViewportChange, { passive: true })
    }
    subscriberCount += 1
  })

  onUnmounted(() => {
    subscriberCount = Math.max(0, subscriberCount - 1)
    if (subscriberCount === 0) {
      window.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
    }
  })

  return { scrollY, progress }
}
