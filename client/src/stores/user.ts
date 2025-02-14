import { API } from "@/constants/api";
import type { Subscription, SubscriptionResponse } from "@/types/Subscription";
import type { ClerkUser, User, UserState } from "@/types/User";
import { CacheKeys, cache } from "@/utils/cache";
import { defineStore } from "pinia";
import { useLinksStore } from "./links";
import { useUserSettingsStore } from "./settings";

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
    userPlan: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    /**
     * Fetches user data from the API using the Clerk user information and updates the store state.
     * This includes the user record, subscription record, and plan record.
     * @param clerk_user - The Clerk user object containing authentication details.
     * @returns true if the user data was successfully fetched, false otherwise.
     * @throws Error if the user data could not be fetched.
     */
    async fetchUserData(clerk_user: ClerkUser): Promise<boolean> {
      this.isLoading = true;

      // Try to load from cache first
      const cachedData = cache.get<UserState>(CacheKeys.USER);
      if (cachedData) {
        Object.assign(this.$state, cachedData);
        console.log("Loaded user data from cache");
        this.isLoading = false;
        return true;
      }

      try {
        const response = await fetch(
          API.GET_USER_DATA(clerk_user.id, clerk_user.email),
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data, status: ${response.status}`,
          );
        }

        const data = await response.json();

        // Update user store
        this.setEmail(data.user.email);
        this.setUserId(data.user.id);
        this.setFirstName(clerk_user.firstName);
        this.setLastName(clerk_user.lastName);
        if (data.plan) {
          this.setPlan(data.plan);
        }

        // Update links store
        const linksStore = useLinksStore();
        linksStore.$patch({ links: data.links });
        cache.set(CacheKeys.LINKS, data.links);

        // Update settings store
        const settingsStore = useUserSettingsStore();
        if (data.settings) {
          settingsStore.$patch({ settings: data.settings.settings_blob });
          cache.set(CacheKeys.SETTINGS, data.settings.settings_blob);
        }

        // Update cache after successful fetch
        cache.set(CacheKeys.USER, this.$state);
        return true;
      } catch (error) {
        this.error = error as string;
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    setUserId(userId: string) {
      this.userId = userId;
    },

    setFirstName(firstname: string) {
      this.firstName = firstname;
    },

    setLastName(lastName: string) {
      this.lastName = lastName;
    },

    setEmail(email: string) {
      this.email = email;
    },

    setPlan(plan: Subscription) {
      this.userPlan = plan;
    },
  },
});
