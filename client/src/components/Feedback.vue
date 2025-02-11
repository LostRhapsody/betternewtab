<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        {{ cancelSubscription ? "We're sorry to see you go" : 'Feedback' }}
      </v-card-title>
      <v-card-text>
        <p class="mb-4">
          {{ cancelSubscription
            ? "Would you mind telling us why you're cancelling?"
            : 'We would love to hear your feedback!'
          }}
        </p>
        <v-radio-group v-model="feedbackData.reasons" label="Feedback Reason">
        <v-radio
          v-for="reason in cancelReasons"
          :key="reason.value"
          :label="reason.label"
          :value="reason.value"
        ></v-radio>
        </v-radio-group>
        <v-alert v-if="reasonRequired" type="error" class="mt-2">
          Feedback Reason required
        </v-alert>
        <v-textarea
          v-model="feedbackData.additionalComments"
          label="Additional comments (optional)"
          rows="3"
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          text
          @click="noThanks"
        >
        {{ cancelSubscription ? 'No Thanks' : 'Cancel' }}
        </v-btn>
        <v-btn
          color="primary"
          @click="submitFeedback"
        >
          Submit Feedback
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { cancelReasons } from '@/data/cancelReasons'
import { useFeedbackStore } from '@/stores/feedback'

const dialog = ref(false)
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  cancelSubscription: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const feedbackStore = useFeedbackStore()

const feedbackData = reactive({
  reasons: '',
  additionalComments: ''
})

const reasonRequired = ref(false)

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
})

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
  feedbackStore.storeFeedback(
    feedbackData.reasons,
    feedbackData.additionalComments
  )
  dialog.value = false
  feedbackData.reasons = ''
  feedbackData.additionalComments = ''
}
</script>

<style scoped>
.v-card-text {
  padding-top: 20px;
}
</style>