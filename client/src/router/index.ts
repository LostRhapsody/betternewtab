// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { Clerk } from "@clerk/clerk-js";
import { useUserStore } from "../stores/user";
import { useApi } from "../composables/useApi";
import Home from "../views/Home.vue";
import Plans from "../views/Plans.vue";
import Test from "../views/Test.vue";
import Confirm from "../views/Confirm.vue";
import Settings from "../views/Settings.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
		},
		{
			path: "/plans",
			name: "plans",
			component: Plans,
		},
		{
			path: "/test",
			name: "test",
			component: Test,
		},
		{
			path: "/confirm",
			name: "confirm",
			component: Confirm,
		},
		{
			path: "/settings",
			name: "settings",
			component: Settings,
			beforeEnter: async (to, from, next) => {
				const userStore = useUserStore();
        const { api } = useApi();
				if (!userStore.userId) {
					const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
					await clerk.load();

					if (clerk.user) {
            if (!clerk.user?.emailAddresses[0]) {
              throw new Error('No user email found');
            }

						const email = clerk.user.emailAddresses[0].emailAddress;

            // Set user in store
            userStore.setUserId(clerk.user.id);
            userStore.setFirstName(clerk.user.firstName);
            userStore.setLastName(clerk.user.lastName);
            userStore.setEmail(email);
            const subscriptionData = await api('/confirm', {
              method: 'POST',
              body: JSON.stringify({
                email: email
              })
            });
						const userPlan = await api(`/plan/${subscriptionData.plan_id}`);
						userStore.setPlan(userPlan);
						next();
					} else {
						next("/");
					}
				} else {
					next();
				}
			},
		},
	],
});

export default router;
