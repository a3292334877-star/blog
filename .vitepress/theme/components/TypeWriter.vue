<template>
  <span class="type-writer">
    <span class="typed-text">{{ displayedText }}</span>
    <span class="cursor" :class="{ blink: !isDeleting }">|</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  texts: string[]
  typingSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
}>(), {
  typingSpeed: 100,
  deleteSpeed: 50,
  pauseDuration: 2000,
})

const displayedText = ref('')
const isDeleting = ref(false)
let charIndex = 0
let textIndex = 0
let timer: ReturnType<typeof setTimeout> | null = null

function type() {
  const current = props.texts[textIndex]

  if (!isDeleting.value) {
    // 打字
    displayedText.value = current.substring(0, charIndex + 1)
    charIndex++

    if (charIndex === current.length) {
      // 打完，等待后开始删除
      timer = setTimeout(() => {
        isDeleting.value = true
        type()
      }, props.pauseDuration)
      return
    }

    timer = setTimeout(type, props.typingSpeed)
  } else {
    // 删除
    displayedText.value = current.substring(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting.value = false
      textIndex = (textIndex + 1) % props.texts.length
      timer = setTimeout(type, 500)
      return
    }

    timer = setTimeout(type, props.deleteSpeed)
  }
}

onMounted(() => { type() })
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<style lang="scss" scoped>
.type-writer {
  display: inline;
}

.typed-text {
  color: #444;
}

.cursor {
  color: var(--sakura-deep, #e88a9a);
  font-weight: 400;

  &.blink {
    animation: blink 1s step-end infinite;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
