<template>
  <Teleport to="body">
    <div v-if="visible" class="search-overlay" @click.self="close">
      <div class="search-modal">
        <div class="search-input-wrap">
          <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref="inputRef"
            v-model="query"
            class="search-input"
            placeholder="搜索文章..."
            @keydown.escape="close"
            @keydown.down.prevent="moveDown"
            @keydown.up.prevent="moveUp"
            @keydown.enter.prevent="goTo"
          />
          <button class="search-close" @click="close" aria-label="关闭搜索">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="search-results" ref="resultsRef">
          <div v-if="!query" class="search-hint">
            <kbd>↑</kbd><kbd>↓</kbd> 导航 &nbsp; <kbd>Enter</kbd> 打开 &nbsp; <kbd>Esc</kbd> 关闭
          </div>
          <div v-else-if="results.length === 0" class="search-empty">
            未找到 "{{ query }}" 的相关结果
          </div>
          <template v-else>
            <a
              v-for="(r, i) in results"
              :key="r.href"
              :ref="(el) => setResultRef(el, i)"
              :href="r.href"
              :class="['search-result', { active: i === activeIndex }]"
              @click="close"
            >
              <span class="result-title">{{ r.title }}</span>
              <span class="result-preview" v-if="r.preview">{{ r.preview }}</span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import MiniSearch from 'minisearch'

interface SearchDoc {
  title: string
  text: string
  href: string
}

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const query = ref('')
const results = ref<Array<{ title: string; href: string; preview: string }>>([])
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)
const resultRefs = ref<(Element | null)[]>([])

let miniSearch: MiniSearch | null = null
let searchData: SearchDoc[] = []

function setResultRef(el: any, i: number) {
  resultRefs.value[i] = el
}

async function init() {
  if (miniSearch) return
  try {
    const { default: data } = await import('@localSearchIndex')
    searchData = data as SearchDoc[]

    miniSearch = new MiniSearch({
      fields: ['title', 'text'],
      storeFields: ['title', 'href'],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 4 },
      },
    })
    miniSearch.addAll(searchData)
  } catch {
    // @localSearchIndex not available (dev without search enabled)
  }
}

function search() {
  if (!miniSearch || !query.value.trim()) {
    results.value = []
    activeIndex.value = 0
    return
  }
  const q = query.value.trim()
  const hits = miniSearch.search(q).slice(0, 20)
  results.value = hits.map((h) => {
    const doc = searchData.find((d) => d.href === h.id)
    // Generate preview from matched text
    const text = doc?.text || ''
    const preview = text.substring(0, 120) + (text.length > 120 ? '...' : '')
    return {
      title: h.title || doc?.title || '',
      href: h.id,
      preview,
    }
  })
  activeIndex.value = 0
}

function moveDown() {
  if (activeIndex.value < results.value.length - 1) {
    activeIndex.value++
    scrollActiveIntoView()
  }
}

function moveUp() {
  if (activeIndex.value > 0) {
    activeIndex.value--
    scrollActiveIntoView()
  }
}

function goTo() {
  const r = results.value[activeIndex.value]
  if (r) {
    window.location.href = r.href
  }
}

function scrollActiveIntoView() {
  nextTick(() => {
    const el = resultRefs.value[activeIndex.value]
    if (el) el.scrollIntoView({ block: 'nearest' })
  })
}

function close() {
  emit('close')
  query.value = ''
  results.value = []
}

watch(() => props.visible, async (v) => {
  if (v) {
    await nextTick()
    inputRef.value?.focus()
    await init()
  }
})

watch(query, search)

onMounted(() => {
  // 预加载搜索索引
  if (import.meta.env.PROD) {
    init()
  }
})
</script>

<style lang="scss" scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.search-modal {
  width: 90%;
  max-width: 560px;
  height: fit-content;
  max-height: 70vh;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  html.dark & {
    background: #1e1e1e;
    border: 1px solid #333;
  }
}

.search-input-wrap {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  gap: 10px;
}

.search-input-icon {
  width: 20px;
  height: 20px;
  color: var(--color-gray);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 17px;
  background: transparent;
  color: var(--color-text);
  font-family: inherit;

  &::placeholder {
    color: var(--color-gray);
  }
}

.search-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray);
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: var(--color-accent);
    background: rgba(254, 150, 0, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.search-results {
  overflow-y: auto;
  max-height: 50vh;
  padding: 8px;
}

.search-hint {
  padding: 24px 16px;
  text-align: center;
  color: var(--color-gray);
  font-size: 13px;

  kbd {
    display: inline-block;
    padding: 1px 6px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 11px;
    font-family: monospace;
  }
}

.search-empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--color-gray);
}

.search-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--color-text);
  transition: all 0.15s;

  &:hover,
  &.active {
    background: rgba(254, 150, 0, 0.08);
    color: var(--color-accent);
  }
}

.result-title {
  font-size: 15px;
  font-weight: 600;
}

.result-preview {
  font-size: 13px;
  color: var(--color-gray);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
