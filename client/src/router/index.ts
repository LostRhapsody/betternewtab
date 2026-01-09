import { API } from "@/constants/api";
import api from "@/services/api";
import { authService } from "@/services/auth";
import { CacheKeys, cache } from "@/utils/cache";
import { createRouter, createWebHistory } from "vue-router";
import { useUserSettingsStore } from "../stores/settings";
import { useUserStore } from "../stores/user";

const isStaging = import.meta.env.VITE_STAGING === "true";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginScreen.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignUpScreen.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/staging-login",
      name: "stagingLogin",
      component: () => import("../views/staging_login.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/Settings.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if we're in staging mode and not logged in (for staging routes)
  if (isStaging && !cache.get(CacheKeys.STAGING_LOGGED_IN)) {
    if (to.path !== "/staging-login") {
      next("/staging-login");
      return;
    }
  }

  const isAuthenticated = authService.isAuthenticated();

  // Handle guest-only routes (like login)
  if (to.meta.requiresGuest && isAuthenticated) {
    next("/");
    return;
  }

  // Handle auth-required routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }

  // For authenticated routes, ensure user data is loaded
  if (to.meta.requiresAuth && isAuthenticated) {
    const userStore = useUserStore();
    const userSettingsStore = useUserSettingsStore();

    // If user data not loaded yet (page refresh scenario)
    if (!userStore.userId) {
      try {
        const response = await api.get<{
          user: { id: string; email: string };
        }>(API.GET_USER_DATA);

        if (!response.data.user) {
          authService.logout();
          next("/login");
          return;
        }

        const authUser = {
          id: response.data.user.id,
          email: response.data.user.email,
        };

        // Fetch user data asynchronously without blocking
        userStore
          .fetchUserData(authUser)
          .then((success) => {
            if (!success) {
              console.error("Failed to fetch user data");
            }
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
          });

        // Always fetch settings
        await userSettingsStore.fetchSettings();
      } catch (err) {
        console.error(err);
        authService.logout();
        next("/login");
        return;
      }
    }
  }

  next();
});

export default router;
