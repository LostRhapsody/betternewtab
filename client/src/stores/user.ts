import type { Subscription } from "@/types/Subscription";
import { defineStore } from "pinia";
import { API } from "@/constants/api";
import type { UserState, User, ClerkUser } from "@/types/User";

export const useUserStore = defineStore("user", {
	state: (): UserState => ({
		userId: null,
		firstName: null,
		lastName: null,
		email: null,
		userPlan: null,
	}),

	getters: {},

	actions: {
		/** TODO - move subscription/plan fetching to here as well
		 * Fetches user data from the API using the Clerk user information and updates the store state.
		 * @param clerk_user - The Clerk user object containing authentication details.
		 * @returns true if the user data was successfully fetched, false otherwise.
		 * @throws Error if the user data could not be fetched.
		 */
		async fetchUserData(clerk_user: ClerkUser) {
			let user: User;
			// first fetch user from DB / confirm user exists
			const response1 = await fetch(API.GET_USER(clerk_user.id));
			/*
				if 200, set user data
				if 404, create user
				else, throw error
			*/
			switch (response1.status) {
				case 200: {
					user = await response1.json();
					break;
				}
				case 404: {
					/*
						if 404 create user
						if can't create user, throw error
					*/
					const response2 = await fetch(API.CREATE_USER, {
						method: "POST",
						body: JSON.stringify({
							user_id: clerk_user.id,
							email: clerk_user.email,
						}),
					});
					if (!response2.ok) {
						throw new Error("User does not exist, failed to create");
					}
					user = await response2.json();
					break;
				}
				default:
					throw new Error("Failed to fetch user data");
			}
			this.setEmail(user.email);
			this.setUserId(user.id);
			this.setFirstName(clerk_user.firstName);
			this.setLastName(clerk_user.lastName);
			return true;
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
