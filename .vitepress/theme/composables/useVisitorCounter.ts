/**
 * 访客计数器 composable
 *
 * 使用 Supabase 作为后端存储 UV/PV 数据。
 * 用户需要先创建 Supabase 项目，然后替换下方的 SUPABASE_URL 和 SUPABASE_ANON_KEY。
 *
 * 后端初始化脚本见 supabase/visitor-counter.sql。
 */

// ============================================================
// 从环境变量读取 Supabase 配置
// 在项目根目录创建 .env 文件（已在 .gitignore 中忽略）：
//   VITE_VISITOR_COUNTER_ENABLED=true
//   VITE_SUPABASE_URL=https://xxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
// ============================================================
const VISITOR_COUNTER_ENABLED = import.meta.env.VITE_VISITOR_COUNTER_ENABLED === 'true'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
const HAS_VISITOR_CONFIG = Boolean(
  VISITOR_COUNTER_ENABLED && SUPABASE_URL && SUPABASE_ANON_KEY,
)

if (VISITOR_COUNTER_ENABLED && !HAS_VISITOR_CONFIG) {
  console.warn(
    '[useVisitorCounter] 缺少 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 环境变量，访客计数功能将不可用。' +
    ' 请复制 .env.example 为 .env 并填入 Supabase 凭据。',
  )
}

// 防抖间隔（毫秒）：同一浏览器在此时间内不会重复发送 POST
const DEBOUNCE_MS = 5000

// ============================================================
// 内部工具函数
// ============================================================

/**
 * 生成随机会话 ID。它只保存在当前标签页的 sessionStorage 中，
 * 不读取浏览器、屏幕、语言或时区，不用于跨会话识别访客。
 */
function getSessionId(storage: Storage | null): string {
  const key = 'visitor_session_id'
  const existing = storage?.getItem(key)
  if (existing) return existing

  const sessionId = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
  try {
    storage?.setItem(key, sessionId)
  } catch {
    // 存储不可用时仍使用当前页面内的随机 ID
  }
  return sessionId
}

function getStorage(): Storage | null {
  try {
    const key = '__visitor_test__'
    sessionStorage.setItem(key, '1')
    sessionStorage.removeItem(key)
    return sessionStorage
  } catch {
    return null
  }
}

/**
 * 检查是否在防抖间隔内（防止开发时频繁刷新产生大量记录）
 */
function isDebounced(storage: Storage | null): boolean {
  if (!storage) return false
  try {
    const raw = storage.getItem('visitor_last_post')
    if (!raw) return false
    const lastPost = parseInt(raw, 10)
    return Date.now() - lastPost < DEBOUNCE_MS
  } catch {
    return false
  }
}

function markPosted(storage: Storage | null): void {
  if (!storage) return
  try {
    storage.setItem('visitor_last_post', String(Date.now()))
  } catch {
    // 静默忽略
  }
}

// ============================================================
// API 调用
// ============================================================

async function postVisit(sessionId: string): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/visits`
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fingerprint: sessionId,
      page_path: location.pathname,
    }),
  })
  if (!res.ok) throw new Error(`Visitor API returned ${res.status}`)
}

async function fetchStats(): Promise<{ uv: number; pv: number } | null> {
  const url = `${SUPABASE_URL}/rest/v1/rpc/get_site_stats`
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  }

  const res = await fetch(url, { headers })
  if (!res.ok) return null
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  return { uv: data[0].uv ?? 0, pv: data[0].pv ?? 0 }
}

// ============================================================
// Composable
// ============================================================

import { ref, onMounted, type Ref } from 'vue'

export function useVisitorCounter(): { uv: Ref<number | null>; pv: Ref<number | null> } {
  const uv = ref<number | null>(null)
  const pv = ref<number | null>(null)

  onMounted(async () => {
    // 默认关闭；只有显式启用且凭据完整时才请求，避免失效后端污染控制台。
    if (!HAS_VISITOR_CONFIG) return
    if (navigator.doNotTrack === '1') return

    const storage = getStorage()
    const sessionId = getSessionId(storage)

    // 记录访问（带防抖）
    if (!isDebounced(storage)) {
      try {
        await postVisit(sessionId)
        markPosted(storage)
      } catch {
        // 计数失败不影响页面正常浏览
      }
    }

    // 获取统计数据
    try {
      const stats = await fetchStats()
      if (stats) {
        uv.value = stats.uv
        pv.value = stats.pv
      }
    } catch {
      // 获取失败时显示占位 "-"
    }
  })

  return { uv, pv }
}
