<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}>(), {
  position: 'top',
  delay: 300,
  disabled: false
})

const isVisible = ref(false)
const triggerRef = ref<HTMLElement>()
let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const show = () => {
  if (props.disabled) return
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  showTimeout = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hide = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}

const hideImmediately = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  isVisible.value = false
}

onUnmounted(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})
</script>

<template>
  <div
    ref="triggerRef"
    class="tp-tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hideImmediately"
  >
    <slot />

    <Transition name="tp-tooltip">
      <div
        v-if="isVisible && content"
        :class="['tp-tooltip', `tp-tooltip--${position}`]"
        role="tooltip"
      >
        {{ content }}
      </div>
    </Transition>
  </div>
</template>

<style>
.tp-tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tp-tooltip {
  position: absolute;
  z-index: var(--tp-z-tooltip);
  padding: var(--tp-space-1) var(--tp-space-2);
  font-size: var(--tp-text-sm);
  font-family: var(--tp-font-mono);
  color: var(--tp-bg-primary);
  background: var(--tp-text-primary);
  border-radius: var(--tp-radius-sm);
  white-space: nowrap;
  pointer-events: none;
}

/* Positions */
.tp-tooltip--top {
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}

.tp-tooltip--bottom {
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}

.tp-tooltip--left {
  right: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}

.tp-tooltip--right {
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}

/* Transitions */
.tp-tooltip-enter-active,
.tp-tooltip-leave-active {
  transition:
    opacity var(--tp-transition-fast),
    transform var(--tp-transition-fast);
}

.tp-tooltip-enter-from,
.tp-tooltip-leave-to {
  opacity: 0;
}

.tp-tooltip--top.tp-tooltip-enter-from,
.tp-tooltip--top.tp-tooltip-leave-to {
  transform: translateX(-50%) translateY(4px);
}

.tp-tooltip--bottom.tp-tooltip-enter-from,
.tp-tooltip--bottom.tp-tooltip-leave-to {
  transform: translateX(-50%) translateY(-4px);
}

.tp-tooltip--left.tp-tooltip-enter-from,
.tp-tooltip--left.tp-tooltip-leave-to {
  transform: translateY(-50%) translateX(4px);
}

.tp-tooltip--right.tp-tooltip-enter-from,
.tp-tooltip--right.tp-tooltip-leave-to {
  transform: translateY(-50%) translateX(-4px);
}
</style>
