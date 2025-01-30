export const API = {
  CREATE_USER: '/create_user',
  CONFIRM_SUBSCRIPTION: '/confirm',
  GET_USER: (userId: string) => `/user/${userId}`,
  GET_USER_PLAN: (planId: string) => `/plan/${planId}`,
  GET_USER_LINKS: (userId: string) => `/user/${userId}/links`,
} as const;