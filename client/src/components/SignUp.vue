<template>
    <v-dialog v-model="dialog" max-width="400px">
        <v-card class="bg-gray-700">
            <v-card-text class="pt-0 px-0">

                <v-card class="rounded-lg !bg-zinc-800">
                    <v-card-title class="text-center pa-4 mb-4">
                        <p class="text-xl my-2">Sign up for New Tab</p>
                        <p class="text-sm text-gray-200">Create your account to get started.</p>
                    </v-card-title>

                    <v-card-text class="text-center">

                        <div class="d-flex justify-space-around">
                            <v-btn class="px-10 !border-zinc-400" variant="outlined" @click="signUpWithGoogle" aria-label="Sign up with Google" rounded>
                                <img src="/icons/google.svg" alt="Google" class="w-6 h-6">
                            </v-btn>

                            <v-btn class="px-10 !border-zinc-400" variant="outlined" @click="signUpWithMicrosoft" aria-label="Sign up with Microsoft" rounded>
                                <img src="/icons/microsoft.svg" alt="Microsoft" class="w-6 h-6">
                            </v-btn>

                            <v-btn class="px-10 !border-zinc-400" variant="outlined" @click="signUpWithGithub" aria-label="Sign up with Github" rounded>
                                <img src="/icons/github.svg" alt="GitHub" class="w-6 h-6">
                            </v-btn>
                        </div>
                    </v-card-text>

                    <v-divider class="my-4"> Or </v-divider>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field v-model="name" :rules="nameRules" label="Name" required
                                prepend-inner-icon="mdi-account" variant="outlined" rounded></v-text-field>

                            <v-text-field v-model="email" :rules="emailRules" label="Email" required
                                prepend-inner-icon="mdi-email" variant="outlined" rounded></v-text-field>

                            <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password"
                                required prepend-inner-icon="mdi-lock" autocomplete="new-password" variant="outlined" rounded></v-text-field>
                            
                            <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirm Password" 
                                type="password" required prepend-inner-icon="mdi-lock-check" autocomplete="new-password" 
                                variant="outlined" rounded></v-text-field>

                            <v-btn block class="mt-4 bg-white" :disabled="!valid" @click="signUp" rounded>
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

<script setup>
import { ref } from 'vue';
import {supabase} from '@/utils/supabase';

const dialog = ref(true);
const valid = ref(true);
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const form = ref(null);

const nameRules = [
    v => !!v || 'Name is required',
];

const emailRules = [
    v => !!v || 'Email is required',
    v => /.+@.+\..+/.test(v) || 'Email must be valid',
];

const passwordRules = [
    v => !!v || 'Password is required',
    v => v.length >= 6 || 'Password must be at least 6 characters',
];

const confirmPasswordRules = [
    v => !!v || 'Please confirm your password',
    v => v === password.value || 'Passwords do not match',
];

const open = () => {
    dialog.value = true;
};

const close = () => {
    dialog.value = false;
};

const switchToLogin = () => {
    // Emit event to parent to switch to login modal
    console.log('Switching to login');
    emit('switch-to-login');
};

// Define emits for the component
const emit = defineEmits(['switch-to-login']);

// supabase!
const signUp = async () => {
    if (form.value.validate()) {
        console.log('Signing up with email and password');
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });
        if (error) {
            console.error('Error signing up:', error.message);
            return;
        }
        console.log('Sign up successful:', data);
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