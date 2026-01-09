<template>
  <div class="min-h-screen bg-[rgb(3,5,21)] flex items-center justify-center relative">
    <!-- Gradient Overlay -->
    <div class="absolute top-0 right-0 w-full h-full animated-gradient"></div>

    <div class="max-w-md w-full mx-4 relative z-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">BetterNewTab_</h1>
        <p class="text-gray-400">Sign in to access your dashboard</p>
      </div>

      <v-card class="!bg-white/5 backdrop-blur-lg">
        <v-card-text>
          <v-alert v-if="errorMessage" type="error" class="mb-4" closable @click:close="errorMessage = ''">
            {{ errorMessage }}
          </v-alert>

          <v-form ref="form" v-model="valid" @submit.prevent="login">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              required
              prepend-inner-icon="mdi-email"
              variant="outlined"
              rounded
              :disabled="isLoading"
            />

            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              type="password"
              required
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              rounded
              :disabled="isLoading"
              autocomplete="current-password"
            />

            <v-btn
              block
              class="mt-4"
              color="primary"
              :disabled="!valid || isLoading"
              :loading="isLoading"
              type="submit"
              rounded
            >
              Sign In
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-text class="text-center pt-0">
          <p class="text-gray-400">
            Don't have an account?
            <a :href="landingUrl" class="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/auth";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const valid = ref(true);
const email = ref("");
const password = ref("");
const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);
const isLoading = ref(false);
const errorMessage = ref("");

const landingUrl = import.meta.env.VITE_LANDING_URL || "https://betternewtab.com";

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
];

const login = async () => {
  if (!form.value) return;

  const validation = await form.value.validate();
  if (!validation.valid) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await authService.login(email.value, password.value);
    authService.setToken(response.token);

    await userStore.fetchUserData({
      id: response.user.id,
      email: response.user.email,
    });

    router.push("/");
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 401) {
      errorMessage.value = "Invalid email or password";
    } else {
      errorMessage.value = "Login failed. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.animated-gradient {
  animation: animateBg 12s ease infinite;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.6), rgb(141, 145, 255));
  background-size: 400% 400%;
  opacity: 0.5;
}

@keyframes animateBg {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
