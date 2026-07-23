import { ref, watch, onUnmounted, type Ref } from 'vue'

/**
 * 数字 count-up 动画
 *
 * @param target 目标数值（响应式，可为 null 表示尚未就绪）
 * @param duration 动画时长（毫秒），默认 1200
 * @returns 当前显示值（从 0 平滑增长到 target）
 */
export function useCountUp(
  target: Ref<number | null>,
  duration = 1200,
): Ref<number> {
  // 静态数据在 SSR 与客户端首次渲染时保持一致，避免 hydration mismatch。
  // 异步数据（初始为 null）仍会在抵达后从 0 开始动画。
  const display = ref(target.value ?? 0)
  let rafId: number | null = null
  let startTime = 0
  let startVal = 0
  let endVal = 0

  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  function tick(now: number) {
    if (startTime === 0) startTime = now
    const progress = Math.min((now - startTime) / duration, 1)
    display.value = Math.round(startVal + (endVal - startVal) * easeOutCubic(progress))
    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      display.value = endVal
      rafId = null
    }
  }

  function start(to: number) {
    // SSR 环境无 requestAnimationFrame，或用户要求减少动画时，直接设为目标值
    if (
      typeof window === 'undefined'
      || typeof requestAnimationFrame === 'undefined'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      display.value = to
      return
    }
    if (rafId !== null) cancelAnimationFrame(rafId)
    startTime = 0
    startVal = display.value
    endVal = to
    if (startVal === endVal) return
    rafId = requestAnimationFrame(tick)
  }

  // 初始值已直接用于 SSR；这里只处理后续的异步变化。
  watch(
    target,
    (v) => {
      if (v !== null && v !== undefined && v !== display.value) start(v)
    },
  )

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return display
}
