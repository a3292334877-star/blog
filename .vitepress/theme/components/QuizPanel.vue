<template>
  <details class="quiz-panel">
    <summary>
      <slot name="question" />
      <span class="quiz-hint">点击查看解析 ▼</span>
    </summary>
    <div class="quiz-answer">
      <slot />
    </div>
  </details>
</template>

<style>
.quiz-panel {
  margin: 16px 0;
  border-radius: 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.quiz-panel > summary {
  padding: 14px 18px;
  cursor: pointer;
  font-weight: 600;
  color: var(--vp-c-text-1);
  user-select: none;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--sakura-light) 25%, var(--vp-c-bg-elv));
}

.quiz-panel[open] > summary {
  border-bottom: 1px solid var(--vp-c-divider);
}

.quiz-answer {
  padding: 16px 18px;
  font-size: 14.5px;
  line-height: 1.6;
}

.quiz-panel > summary > p {
  margin: 0 !important;
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.quiz-hint {
  flex-shrink: 0;
  margin-left: 12px;
  color: var(--accent-color);
  font-size: 13px;
  white-space: nowrap;
}

.quiz-answer > :first-child { margin-top: 0 !important; }
.quiz-answer > :last-child { margin-bottom: 0 !important; }
.quiz-answer .katex-block { margin: 12px 0; }
</style>
