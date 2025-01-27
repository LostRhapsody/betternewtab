import { defineStore } from 'pinia'
import type { Tables } from '../types/Database'

interface UserState {
  userId: string | null
  firstName: string | null
  lastName: string | null
  email: string | null
  userPlan: Tables<'plans'> | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
    userPlan: null
  }),

  actions: {
    setUserId(userId: string) {
      this.userId = userId
    },

    setFirstName(firstname: string) {
      this.firstName = firstname
    },

    setLastName(lastName: string) {
      this.lastName = lastName
    },

    setEmail(email: string) {
      this.email = email
    },

    setPlan(plan: Tables<'plans'>) {
      this.userPlan = plan
    }
  }
})