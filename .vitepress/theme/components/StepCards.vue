<template>
  <div class="step-container">
    <slot />
  </div>
</template>

<style>
.step-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
}
</style>
