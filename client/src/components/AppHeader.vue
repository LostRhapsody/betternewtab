<template>
    <!-- Navigation -->
    <nav
        class="px-4 py-6 min-h-24 flex items-center border-b border-gray-700 bg-white/5 backdrop-filter backdrop-blur-3xl relative z-10">
        <div class="container mx-auto">
            <div class="grid grid-cols-12 gap-4 items-center w-full ">
                <!-- Logo (3 columns) -->
                <div class="col-span-12 md:col-span-3 flex items-center space-x-2">
                    <span class="text-white text-xl font-semibold">
                        <a href="/">BetterNewTab_</a>
                    </span>
                </div>

                <!-- Navigation Links (6 columns) -->
                <div class="col-span-12 md:col-span-6 flex justify-around space-x-4 border border-gray-300 rounded-full px-6 py-4 overflow-x-auto">
                    <a href="/docs/getting-started" class="text-gray-300 hover:text-white transition-colors whitespace-nowrap">Getting Started</a>
                    <span class="text-gray-300">•</span>
                    <a href="/docs/guides/confluence-integration" class="text-gray-300 hover:text-white transition-colors whitespace-nowrap">Integrations</a>
                    <span class="text-gray-300">•</span>
                    <a href="/#pricing" class="text-gray-300 hover:text-white transition-colors whitespace-nowrap">Pricing</a>
                    <span class="text-gray-300">•</span>
                    <a href="/docs/guides" class="text-gray-300 hover:text-white transition-colors whitespace-nowrap">Guides</a>
                    <span class="text-gray-300">•</span>
                    <a href="/contact" class="text-gray-300 hover:text-white transition-colors whitespace-nowrap">Contact</a>
                </div>

                <!-- Unified Pill Button (3 columns) -->
                <div class="col-span-12 md:col-span-3 flex justify-center md:justify-end">
                    <div class="pill-button border border-gray-300 rounded-full">
                        <button @click="handleShowSignUp" class="pill-half">
                            <span class="text-sm">Get Started</span>
                        </button>
                        <button @click="handleShowSignIn" class="pill-half">
                            <span class="text-sm">Sign In</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <v-dialog v-model="showSignIn" max-width="600px">
        <div class="m-auto">
            <div id="sign-in"></div>
        </div>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { Clerk } from "@clerk/clerk-js";
import { cache } from "@/utils/cache";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerk = new Clerk(clerkPubKey);
const showSignIn = ref(false);

const handleShowSignIn = () => {
    cache.clearAll();
    showSignIn.value = true;
    nextTick(() => {
        const signInDiv = document.getElementById("sign-in");
        if (signInDiv) {
            clerk.mountSignIn(signInDiv as HTMLDivElement);
        }
    });
};

const handleShowSignUp = () => {
    cache.clearAll();
    showSignIn.value = true;
    nextTick(() => {
        const signInDiv = document.getElementById("sign-in");
        if (signInDiv) {
            clerk.mountSignUp(signInDiv as HTMLDivElement);
        }
    });
};

onMounted(async () => {
    await clerk.load();
});
</script>

<style scoped>
/* Pill Button Container */
.pill-button {
    display: flex;
    border-radius: 9999px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 16em;
}

/* Half Pill Buttons */
.pill-half {
    flex: 1;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 16px;
    padding-bottom: 16px;
    font-weight: 500;
    color: #ffffff;
    background: none;
    border: none;
    cursor: pointer;
    transition: 0.3s ease, transform 0.1s ease;
}

.pill-half:hover {
    background: rgba(255, 255, 255, 0.1);
    /* Subtle hover effect */
}

.pill-half:active {
    background: rgba(255, 255, 255, 0.2);
    /* Subtle active effect */
}

/* Responsive Design */
@media (max-width: 768px) {
    .flex {
        flex-direction: column;
        text-align: center;
    }

    .pill-button {
        width: 100%;
    }

    .pill-half {
        width: 50%;
        text-align: center;
    }
}
</style>