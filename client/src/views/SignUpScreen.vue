<template>
    <v-dialog v-model="dialog" max-width="400px">
        <v-card class="bg-gray-700">
            <v-card-text class="pt-0 px-0">

                <v-card class="rounded-lg !bg-zinc-800">
                    <v-card-title class="text-center pa-4 mb-4">
                        <p class="text-xl my-2">Sign up for New Tab</p>
                        <p class="text-sm text-gray-200">Create your account to get started.</p>
                    </v-card-title>

                    <v-card-text>
                        <v-alert v-if="errorMessage" type="error" class="mb-4" closable @click:close="errorMessage = ''">
                            {{ errorMessage }}
                        </v-alert>

                        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="signUp">
                            <v-text-field v-model="email" :rules="emailRules" label="Email" required
                                prepend-inner-icon="mdi-email" variant="outlined" rounded :disabled="isLoading"></v-text-field>

                            <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password"
                                required prepend-inner-icon="mdi-lock" autocomplete="new-password" variant="outlined" rounded :disabled="isLoading"></v-text-field>

                            <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirm Password"
                                type="password" required prepend-inner-icon="mdi-lock-check" autocomplete="new-password"
                                variant="outlined" rounded :disabled="isLoading"></v-text-field>

                            <v-btn block class="mt-4 bg-white" :disabled="!valid || isLoading" :loading="isLoading" @click="signUp" rounded>
                                Sign Up
                            </v-btn>
                        </v-form>
                    </v-card-text>

                </v-card>
            </v-card-text>

            <v-card-text class="pt-0">
                <p class="text-center">Already have an account? <strong @click="switchToLogin" class="cursor-pointer">Login here.</strong></p>
            </v-card-text>

        </v-card>

    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/services/auth";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const dialog = ref(true);
const valid = ref(true);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const form = ref<{ validate: () => Promise<boolean> } | null>(null);
const isLoading = ref(false);
const errorMessage = ref("");

const emailRules = [
    (v: string) => !!v || "Email is required",
    (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
    (v: string) => !!v || "Password is required",
    (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const confirmPasswordRules = [
    (v: string) => !!v || "Please confirm your password",
    (v: string) => v === password.value || "Passwords do not match",
];

const open = () => {
    dialog.value = true;
    errorMessage.value = "";
};

const close = () => {
    dialog.value = false;
    errorMessage.value = "";
};

const switchToLogin = () => {
    emit("switch-to-login");
};

const emit = defineEmits<{
    "switch-to-login": [];
    "signup-success": [];
}>();

const signUp = async () => {
    if (!form.value) return;

    const isValid = await form.value.validate();
    if (!isValid) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        const response = await authService.register(email.value, password.value);
        authService.setToken(response.token);

        await userStore.fetchUserData({
            id: response.user.id,
            email: response.user.email,
        });

        emit("signup-success");
        close();
        window.location.reload();
    } catch (error: unknown) {
        const err = error as { response?: { status: number } };
        if (err.response?.status === 409) {
            errorMessage.value = "Email already registered";
        } else {
            errorMessage.value = "Registration failed. Please try again.";
        }
    } finally {
        isLoading.value = false;
    }
};

defineExpose({ open, close });
</script>

<style scoped>
.v-card {
    border-radius: 12px;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
