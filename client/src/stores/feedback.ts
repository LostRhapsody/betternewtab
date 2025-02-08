import { defineStore } from "pinia";

type FeedbackState = {
  reasons: string;
  feedbackComment: string;
};

export const useFeedbackStore = defineStore("feedbackStore", {
  state: (): FeedbackState => ({
    reasons: "",
    feedbackComment: "",
  }),
  actions: {
    addReason(reason: string) {
      this.reasons = reason;
    },
    setFeedbackComment(comment: string) {
      this.feedbackComment = comment;
    },
    storeFeedback(reasons: string, comment: string) {
      this.reasons = reasons;
      this.feedbackComment = comment;
    },
    clearFeedback() {
      this.reasons = "";
      this.feedbackComment = "";
    },
  },
});
