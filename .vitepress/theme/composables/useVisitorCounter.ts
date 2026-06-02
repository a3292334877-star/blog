/**
 * 访客计数器 composable
 *
 * 使用 Supabase 作为后端存储 UV/PV 数据。
 * 用户需要先创建 Supabase 项目，然后替换下方的 SUPABASE_URL 和 SUPABASE_ANON_KEY。
 *
 * 设置步骤：
 * 1. 注册 https://supabase.com（可用 GitHub 登录）
 * 2. 创建新项目，选择 ap-southeast-1（新加坡）区域
 * 3. 在 SQL Editor 中运行：
 *
 *    CREATE TABLE visits (
 *      id BIGSERIAL PRIMARY KEY,
 *      fingerprint TEXT NOT NULL,
 *      page_path TEXT NOT NULL DEFAULT '/',
 *      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *    );
 *    CREATE INDEX idx_visits_fingerprint ON visits (fingerprint);
 *    ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
 *    CREATE POLICY "allow_public_insert" ON visits FOR INSERT TO anon WITH CHECK (true);
 *    CREATE POLICY "allow_public_select" ON visits FOR SELECT TO anon USING (true);
 *
 *    CREATE OR REPLACE FUNCTION get_site_stats()
 *    RETURNS TABLE (uv BIGINT, pv BIGINT)
 *    LANGUAGE plpgsql AS $$
 *    BEGIN
 *      RETURN QUERY
 *      SELECT
 *        COUNT(DISTINCT fingerprint) AS uv,
 *        COUNT(*) AS pv
 *      FROM visits;
 *    END;
 *    $$;
 *
 * 4. 从 Settings > API 复制 Project URL 和 anon public key
 * 5. 替换下方占位符
 */

// ============================================================
// TODO: 替换为你的 Supabase 项目信息
// ============================================================
const SUPABASE_URL = 'https://izzxptzeblxecmwfbyzd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6enhwdHplYmx4ZWNtd2ZieXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzODM5MjUsImV4cCI6MjA5NTk1OTkyNX0.LlMOGUnicnxmCWG40QNvHDzCAar3Mmdfv-EsCXspTRU'

// 防抖间隔（毫秒）：同一浏览器在此时间内不会重复发送 POST
const DEBOUNCE_MS = 5000

// ============================================================
// 内部工具函数
// ============================================================

/**
 * 生成浏览器指纹（不含日期，同一浏览器始终产生相同指纹）
 * 用于 Supabase 中的 COUNT(DISTINCT fingerprint) 计算 UV
 */
function generateFingerprint(): string {
  const components = [
    navigator.userAgent || '',
    screen.width || 0,
    screen.height || 0,
    screen.colorDepth || 0,
    navigator.language || '',
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  ].join('|')

  // djb2 hash — 简单高效的非加密哈希
  let hash = 5381
  for (let i = 0; i < components.length; i++) {
    hash = ((hash << 5) + hash + components.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}

function getStorage(): Storage | null {
  try {
    const key = '__visitor_test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return localStorage
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

async function postVisit(fingerprint: string): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/visits`
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  }

  await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fingerprint,
      page_path: location.pathname,
    }),
  })
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
    const storage = getStorage()
    const fp = generateFingerprint()

    // 记录访问（带防抖）
    if (!isDebounced(storage)) {
      markPosted(storage)
      try {
        await postVisit(fp)
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
