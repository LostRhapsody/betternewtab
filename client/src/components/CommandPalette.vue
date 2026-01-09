<template>
  <TpModal v-model="isOpen" title="Command Palette" size="md">
    <div class="command-palette">
      <TpInput
        v-model="query"
        placeholder="Type a command or search..."
        @keydown="handleKeydown"
        ref="inputRef"
        class="command-palette__input"
      />

      <TpList v-if="filteredResults.length > 0" class="command-palette__results">
        <TpListItem
          v-for="(result, index) in filteredResults"
          :key="index"
          :class="{ 'command-palette__item--focused': focusedIndex === index }"
          @click="handleSelect(result)"
          @mouseenter="focusedIndex = index"
        >
          <div class="command-palette__item-content">
            <span class="command-palette__title">{{ result.title }}</span>
            <span class="command-palette__subtitle">{{ result.subtitle }}</span>
          </div>
        </TpListItem>
      </TpList>

      <div v-else class="command-palette__empty">
        No results found
      </div>
    </div>
  </TpModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLinksStore } from '../stores/links'
import { useSearchEngineStore } from '../stores/searchEngine'
import { storeToRefs } from 'pinia'
import { openUrl } from '../utils/openUrl'
import { TpModal, TpInput, TpList, TpListItem } from '@/components/ui'

type Result = {
  title: string
  subtitle: string
  action: () => void
}

const isOpen = ref(false)
const query = ref('')
const focusedIndex = ref(-1)
const inputRef = ref<InstanceType<typeof TpInput> | null>(null)

const router = useRouter()
const linksStore = useLinksStore()
const searchEngineStore = useSearchEngineStore()
const { links } = storeToRefs(linksStore)

const commands = [
  {
    title: 'Navigate to Settings',
    subtitle: 'Go to settings page',
    action: () => router.push('/settings')
  },
  { title: 'Add New Link', subtitle: 'Add a new link', action: () => triggerAddLink() }
]

const filteredResults = computed(() => {
  const lowerQuery = query.value.toLowerCase()
  const linkResults = links.value
    .filter((link) => link.title.toLowerCase().includes(lowerQuery))
    .map((link) => ({
      title: link.title,
      subtitle: link.url,
      action: () => openUrl(link.url)
    }))

  const commandResults = commands.filter((command) =>
    command.title.toLowerCase().includes(lowerQuery)
  )

  const searchEngineResults = searchEngineStore.searchEngines
    .map((engine) => ({
      title: `Switch to ${engine.name}`,
      subtitle: `Change search engine to ${engine.name}`,
      action: () => searchEngineStore.setSearchEngine(engine.url)
    }))
    .filter(
      (engineResult) =>
        engineResult.title.toLowerCase().includes(lowerQuery) ||
        engineResult.subtitle.toLowerCase().includes(lowerQuery)
    )

  return [...linkResults, ...commandResults, ...searchEngineResults]
})

const handleKeydown = (event: KeyboardEvent) => {
  const totalItems = filteredResults.value.length

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = (focusedIndex.value + 1) % totalItems
      break
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = (focusedIndex.value - 1 + totalItems) % totalItems
      break
    case 'Enter':
      event.preventDefault()
      if (focusedIndex.value >= 0) {
        filteredResults.value[focusedIndex.value].action()
      } else if (filteredResults.value.length > 0) {
        filteredResults.value[0].action()
      }
      closePalette()
      break
    case 'Escape':
      closePalette()
      break
  }
}

const handleSelect = (result: Result) => {
  result.action()
  closePalette()
}

const openPalette = (event: KeyboardEvent) => {
  if (event.key === 'k' && event.ctrlKey) {
    event.preventDefault()
    isOpen.value = true
  }
}

// Focus input when modal opens
watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      const inputEl = inputRef.value?.$el?.querySelector('input')
      inputEl?.focus()
    })
  }
})

const closePalette = () => {
  isOpen.value = false
  query.value = ''
  focusedIndex.value = -1
}

const triggerAddLink = () => {
  const addLinkButton = document.querySelector('#add-link-card')
  if (addLinkButton) {
    ;(addLinkButton as HTMLElement).click()
  }
}

const handleTriggerAddLink = (event: KeyboardEvent) => {
  if (event.key === 'n' && event.altKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
    triggerAddLink()
  }
}

onMounted(() => {
  window.addEventListener('keydown', openPalette)
  window.addEventListener('keydown', handleTriggerAddLink)
})

onUnmounted(() => {
  window.removeEventListener('keydown', openPalette)
  window.removeEventListener('keydown', handleTriggerAddLink)
})
</script>

<style scoped>
.command-palette {
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-4);
}

.command-palette__input {
  margin-bottom: var(--tp-space-2);
}

.command-palette__results {
  max-height: 300px;
  overflow-y: auto;
}

.command-palette__item-content {
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-1);
}

.command-palette__title {
  font-size: var(--tp-text-base);
  font-weight: var(--tp-font-medium);
  color: var(--tp-text-primary);
}

.command-palette__subtitle {
  font-size: var(--tp-text-sm);
  color: var(--tp-text-muted);
  font-family: var(--tp-font-mono);
}

.command-palette__item--focused {
  background: var(--tp-accent-glow);
  border-left: 2px solid var(--tp-accent);
}

.command-palette__empty {
  text-align: center;
  padding: var(--tp-space-8);
  color: var(--tp-text-muted);
  font-size: var(--tp-text-sm);
}
</style>
