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
