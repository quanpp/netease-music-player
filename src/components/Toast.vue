<script setup>
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <Transition name="toast">
    <div v-if="player.toast" class="toast">{{ player.toast }}</div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 120px;
  transform: translateX(-50%);
  z-index: 30;
  max-width: min(420px, 86vw);
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 13px;
  color: #fff;
  background: rgba(30, 30, 38, 0.95);
  border: 1px solid var(--border);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
