<template>
  <TpModal v-model="isModalOpen" title="Edit Link" :size="mobile ? 'full' : 'md'" initial-focus="#edit-link-url">
    <form @submit.prevent="handleSubmit" ref="formRef" class="edit-link-form">
      <TpInput
        input-id="edit-link-url"
        v-model="formData.url"
        label="URL"
        type="url"
        placeholder="https://example.com"
        required
        :error="urlError"
        @enter="handleSubmit"
      />

      <TpInput
        v-model="formData.title"
        label="Title"
        placeholder="My Link"
        @enter="handleSubmit"
      />

      <TpTextarea
        v-model="formData.description"
        label="Description"
        placeholder="Optional description"
        :rows="3"
      />

      <div class="edit-link-form__column-select">
        <TpSelect
          v-model="formData.columnType"
          :options="columnTypeOptions"
          label="Column Label"
        />

        <div class="edit-link-form__new-column">
          <TpInput
            v-model="newColumnType"
            placeholder="New column name"
            @enter="addNewColumnType"
          />
          <TpButton variant="secondary" size="sm" @click="addNewColumnType">
            Add
          </TpButton>
        </div>
      </div>
    </form>

    <template #actions>
      <div class="edit-link-form__hints" v-if="!mobile">
        <span>Submit: <kbd>Enter</kbd></span>
        <span>New line: <kbd>Shift</kbd> + <kbd>Enter</kbd></span>
      </div>

      <div class="edit-link-form__actions">
        <TpTooltip
          content="Better New Tab will not attempt to fetch the title or description from the URL when editing a link. Add a new link to see this feature in action."
          position="left"
        >
          <TpButton variant="ghost" icon-only>
            <TpIcon name="help" />
          </TpButton>
        </TpTooltip>

        <TpButton variant="ghost" @click="closeModal">
          Cancel
        </TpButton>
        <TpButton variant="primary" :loading="isLoading" @click="handleSubmit">
          Save Link
        </TpButton>
      </div>
    </template>
  </TpModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Link } from '@/types/Link'
import { useLinksStore } from '../stores/links'
import { useBreakpoint } from '@/composables/useBreakpoint'
import {
  TpModal,
  TpInput,
  TpTextarea,
  TpSelect,
  TpButton,
  TpTooltip,
  TpIcon
} from '@/components/ui'

const linksStore = useLinksStore()
const { smAndDown: mobile } = useBreakpoint()

const props = defineProps<{
  modelValue: boolean
  link?: Link
}>()

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>()

const isModalOpen = ref(props.modelValue)
const isLoading = ref(false)
const formRef = ref<HTMLFormElement | null>(null)
const urlError = ref('')

const formData = ref({
  url: '',
  title: '',
  description: '',
  columnType: ''
})

const newColumnType = ref('')

const columnTypes = computed(() => linksStore.uniqueColumnTypes)

const columnTypeOptions = computed(() =>
  columnTypes.value.map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))
)

watch(
  () => props.modelValue,
  (newValue) => {
    isModalOpen.value = newValue
    if (newValue && props.link) {
      formData.value = {
        url: props.link.url,
        title: props.link.title,
        description: props.link.description || '',
        columnType: props.link.column_type || ''
      }
    }
  }
)

watch(
  () => isModalOpen.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  }
)

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    url: '',
    title: '',
    description: '',
    columnType: ''
  }
  newColumnType.value = ''
  urlError.value = ''
}

const addNewColumnType = () => {
  if (
    newColumnType.value.trim() &&
    !columnTypes.value.includes(newColumnType.value.trim())
  ) {
    formData.value.columnType = newColumnType.value.trim()
    newColumnType.value = ''
  }
}

const validateForm = (): boolean => {
  if (!formData.value.url) {
    urlError.value = 'URL is required'
    return false
  }

  const urlValidation = linksStore.validateUrl(formData.value.url)
  if (urlValidation !== true) {
    urlError.value = urlValidation as string
    return false
  }

  urlError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!props.link) return
  if (!validateForm()) return

  try {
    isLoading.value = true
    props.link.url = formData.value.url
    props.link.title =
      formData.value.title || new URL(formData.value.url).hostname
    props.link.description = formData.value.description
    props.link.column_type = formData.value.columnType

    await linksStore.updateLink(props.link)
    closeModal()
  } catch (error) {
    console.error('Error updating link:', error)
  } finally {
    isLoading.value = false
  }
}

watch(isModalOpen, (newVal) => {
  if (!newVal) {
    if (newColumnType.value) {
      newColumnType.value = ''
    }
    if (!formData.value.url) {
      resetForm()
    }
  }
})
</script>

<style scoped>
.edit-link-form {
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-4);
}

.edit-link-form__column-select {
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-3);
}

.edit-link-form__new-column {
  display: flex;
  gap: var(--tp-space-2);
  align-items: flex-end;
}

.edit-link-form__new-column > :first-child {
  flex: 1;
}

.edit-link-form__hints {
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-1);
  font-size: var(--tp-text-xs);
  color: var(--tp-text-muted);
}

.edit-link-form__hints kbd {
  font-size: var(--tp-text-xs);
}

.edit-link-form__actions {
  display: flex;
  align-items: center;
  gap: var(--tp-space-2);
  margin-left: auto;
}
</style>
