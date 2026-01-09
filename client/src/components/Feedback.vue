<template>
  <TpModal v-model="dialog" :title="modalTitle" size="sm">
    <div class="feedback-form">
      <p class="feedback-form__intro">
        {{
          cancelSubscription
            ? "Would you mind telling us why you're cancelling?"
            : 'We would love to hear your feedback!'
        }}
      </p>

      <TpRadio
        v-model="feedbackData.reasons"
        label="Feedback Reason"
        :options="radioOptions"
      />

      <TpAlert v-if="reasonRequired" variant="error">
        Feedback Reason required
      </TpAlert>

      <TpTextarea
        v-model="feedbackData.additionalComments"
        label="Additional comments (optional)"
        :rows="3"
      />
    </div>

    <template #actions>
      <div class="feedback-form__actions">
        <TpButton variant="ghost" @click="noThanks">
          {{ cancelSubscription ? 'No Thanks' : 'Cancel' }}
        </TpButton>
        <TpButton variant="primary" @click="submitFeedback">
          Submit Feedback
        </TpButton>
      </div>
    </template>
  </TpModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { cancelReasons } from '@/data/cancelReasons'
import { useFeedbackStore } from '@/stores/feedback'
import { TpModal, TpRadio, TpAlert, TpTextarea, TpButton } from '@/components/ui'

const dialog = ref(false)
const props = defineProps<{
  modelValue?: boolean
  cancelSubscription?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const feedbackStore = useFeedbackStore()

const feedbackData = reactive({
  reasons: '',
  additionalComments: ''
})

const reasonRequired = ref(false)

const modalTitle = computed(() =>
  props.cancelSubscription ? "We're sorry to see you go" : 'Feedback'
)

const radioOptions = computed(() =>
  cancelReasons.map((reason) => ({
    value: reason.value,
    label: reason.label
  }))
)

watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal ?? false
  }
)

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
})

const noThanks = () => {
  feedbackData.reasons = ''
  feedbackData.additionalComments = ''
  dialog.value = false
}

const submitFeedback = () => {
  if (feedbackData.reasons === '') {
    reasonRequired.value = true
    return
  }
  reasonRequired.value = false
  feedbackStore.storeFeedback(feedbackData.reasons, feedbackData.additionalComments)
  dialog.value = false
  feedbackData.reasons = ''
  feedbackData.additionalComments = ''
}
</script>

<style scoped>
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-4);
}

.feedback-form__intro {
  color: var(--tp-text-secondary);
  font-size: var(--tp-text-base);
  margin-bottom: var(--tp-space-2);
}

.feedback-form__actions {
  display: flex;
  gap: var(--tp-space-2);
  justify-content: flex-end;
}
</style>
