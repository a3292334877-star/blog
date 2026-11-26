import { withBase } from 'vitepress'

/** Resolve internal site paths with VitePress base, safely handling paths without a leading slash. */
export function resolveSitePath(path: string): string {
  if (!path || /^(?:https?:|data:|mailto:|#)/.test(path)) return path
  return withBase(path.startsWith('/') ? path : `/${path}`)
}

/** Strip VitePress base and leading/trailing slashes for route matching. */
export function normalizeSitePath(path: string, base = '/'): string {
  return path.replace(base, '/').replace(/^\//, '').replace(/\/$/, '')
}
