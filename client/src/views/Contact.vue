<!-- Contact.vue -->
<template>
  <div class="min-h-screen bg-[rgb(3,5,21)] relative">
    <!-- Gradient Overlay -->
    <div class="absolute top-0 right-0 w-full h-full animated-gradient"></div>
    <!-- Navigation -->
    <nav
      class="px-4 py-4 min-h-24 flex align-center border-b border-gray-700 bg-white/5 backdrop-filter backdrop-blur-3xl relative z-10">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <span class="text-white text-xl font-semibold"><a href="/">BetterNewTab_</a></span>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-8 border border-gray-300 px-6 py-4 rounded-full">
            <a href="/docs/getting-started" class="text-gray-300 hover:text-white transition-colors">Getting Started</a>
            <span class="text-gray-300 cursor-default">•</span>
            <a href="/docs/integrations" class="text-gray-300 hover:text-white transition-colors">Integrations</a>
            <span class="text-gray-300 cursor-default">•</span>
            <a href="#pricing" class="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <span class="text-gray-300 cursor-default">•</span>
            <a href="/docs/guides" class="text-gray-300 hover:text-white transition-colors">Guides</a>
            <span class="text-gray-300 cursor-default">•</span>
            <a href="/contact" class="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>

          <!-- Get Started and Sign In Buttons -->
          <div class="flex items-center space-x-4">
            <button @click="handleShowSignUp"
              class="px-4 py-4 rounded-l-full backdrop-filter backdrop-blur-lg text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center space-x-2 shadow-inner shadow-white/20">
              <span class="text-lg">Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button @click="handleShowSignIn"
              class="px-4 py-4 rounded-r-full backdrop-filter backdrop-blur-lg text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center space-x-2 shadow-inner shadow-white/20">
              <span class="text-lg">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contact Section -->
    <div class="container mx-auto px-4 py-24">
      <div class="text-center max-w-4xl mx-auto mb-16">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Get in <span class="text-blue-400">touch</span> with us
        </h1>
        <p class="text-xl text-gray-300">
          We'd love to hear from you! Whether you have a question about our product, pricing, or just want to say hello, we're here to help.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Info -->
        <div class="bg-white/5 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <h2 class="text-2xl font-bold text-white mb-6">Contact Information</h2>
          
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-blue-400 mb-2">Email</h3>
            <p class="text-gray-300 flex items-center">
              <v-icon icon="mdi-email" class="mr-3" />
              <a href="mailto:support@betternewtab.com" class="hover:text-white transition-colors">support@betternewtab.com</a>
            </p>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold text-blue-400 mb-2">Phone</h3>
            <p class="text-gray-300 flex items-center">
              <v-icon icon="mdi-phone" class="mr-3" />
              <a href="tel:+1-555-123-4567" class="hover:text-white transition-colors">+1 (555) 123-4567</a>
            </p>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold text-blue-400 mb-2">Office Hours</h3>
            <p class="text-gray-300 flex items-center">
              <v-icon icon="mdi-clock-outline" class="mr-3" />
              Monday - Friday: 9am - 5pm PST
            </p>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-blue-400 mb-4">Connect With Us</h3>
            <div class="flex space-x-4">
              <a href="https://twitter.com/betternewtab" target="_blank" class="text-gray-300 hover:text-white transition-colors">
                <v-icon icon="mdi-twitter" size="large" />
              </a>
              <a href="https://github.com/betternewtab" target="_blank" class="text-gray-300 hover:text-white transition-colors">
                <v-icon icon="mdi-github" size="large" />
              </a>
              <a href="https://linkedin.com/company/betternewtab" target="_blank" class="text-gray-300 hover:text-white transition-colors">
                <v-icon icon="mdi-linkedin" size="large" />
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white/5 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <h2 class="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
          
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="name" class="block text-gray-300 mb-2">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Your Name"
                required
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block text-gray-300 mb-2">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div class="mb-4">
              <label for="subject" class="block text-gray-300 mb-2">Subject</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="What is this about?"
                required
              />
            </div>

            <div class="mb-6">
              <label for="message" class="block text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-3 rounded-full bg-blue-500/70 text-white hover:bg-blue-600 transition-colors w-full flex justify-center items-center"
            >
              <v-progress-circular v-if="isSubmitting" indeterminate color="white" size="20" width="2" class="mr-2"></v-progress-circular>
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>

            <div v-if="formSubmitted" class="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center">
              Thank you for your message! We'll get back to you soon.
            </div>
          </form>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-4xl mx-auto mt-24">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        
        <v-expansion-panels variant="accordion" class="bg-transparent">
          <v-expansion-panel v-for="(faq, index) in faqs" :key="index" class="mb-4 !bg-white/5 !text-white">
            <v-expansion-panel-title class="!text-white">
              {{ faq.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="!text-gray-300">
              {{ faq.answer }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-24 text-center bottom-0 w-full">
      <footer
        class="px-4 py-4 min-h-24 flex align-center border-t border-gray-700 bg-white/5 backdrop-filter backdrop-blur-3xl relative z-10">
        <div class="container mx-auto">
          <div class="flex justify-between items-center">
            <!-- Company Name -->
            <div class="flex items-center space-x-2">
              <span class="text-white text-xl font-semibold">BetterNewTab_</span>
            </div>

            <!-- Footer Links -->
            <div class="hidden md:flex space-x-8 border border-gray-300 px-6 py-4 rounded-full">
              <a href="#" class="text-gray-300 hover:text-white transition-colors">About</a>
              <span class="text-gray-300 cursor-default">•</span>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <span class="text-gray-300 cursor-default">•</span>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <span class="text-gray-300 cursor-default">•</span>
              <a href="/contact" class="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>

            <!-- Social Media Links -->
            <div class="flex items-center space-x-4">
              <a href="https://twitter.com/betternewtab" target="_blank" class="text-gray-300 hover:text-white transition-colors">
                <v-icon icon="mdi-twitter" />
              </a>
              <a href="https://github.com/betternewtab" target="_blank" class="text-gray-300 hover:text-white transition-colors">
                <v-icon icon="mdi-github" />
              </a>
              <a href="https://linkedin.com/company/betternewtab" target="_blank" class="text-gray-300 hover:text-white transition-colors">
                <v-icon icon="mdi-linkedin" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <v-dialog v-model="showSignIn" max-width="600px">
      <div class="m-auto">
        <div id="sign-in"></div>
      </div>
    </v-dialog>
    
    <v-snackbar v-model="showSnackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { Clerk } from "@clerk/clerk-js";
import { cache } from "@/utils/cache";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerk = new Clerk(clerkPubKey);
const showSignIn = ref(false);

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const formSubmitted = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');

const faqs = ref([
  {
    question: 'What is BetterNewTab?',
    answer: 'BetterNewTab is a browser extension that replaces your new tab page with a customizable dashboard featuring quick access to your most used tools and resources.'
  },
  {
    question: 'How do I install BetterNewTab?',
    answer: 'You can install BetterNewTab from the Chrome Web Store, Firefox Add-ons, or Edge Add-ons. Simply search for "BetterNewTab" and click on the install button.'
  },
  {
    question: 'Is my data secure with BetterNewTab?',
    answer: 'Absolutely! We take your privacy seriously. Your data is encrypted and securely stored. We never sell your data to third parties.'
  },
  {
    question: 'What are the pricing plans for BetterNewTab?',
    answer: 'BetterNewTab offers a free plan with basic features, a Plus plan at $5/month with enhanced features, and a Pro plan at $10/month with all features included.'
  },
  {
    question: 'How can I get support for BetterNewTab?',
    answer: 'You can contact our support team through this contact form, email us at support@betternewtab.com, or check our documentation for help.'
  }
]);

const handleShowSignIn = () => {
  // Clear all cache before signing in to ensure a fresh state
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
  // Clear all cache before signing up to ensure a fresh state
  cache.clearAll();
  
  showSignIn.value = true;
  nextTick(() => {
    const signInDiv = document.getElementById("sign-in");
    if (signInDiv) {
      clerk.mountSignUp(signInDiv as HTMLDivElement);
    }
  });
};

const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    // Here you would typically make an API call to submit the form
    // For demo purposes, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form and show success message
    form.value = { name: '', email: '', subject: '', message: '' };
    formSubmitted.value = true;
    
    // After 5 seconds, hide the success message
    setTimeout(() => {
      formSubmitted.value = false;
    }, 5000);
    
    snackbarText.value = 'Message sent successfully!';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error) {
    snackbarText.value = 'Failed to send message. Please try again.';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await clerk.load();
});
</script>

<style scoped>
.v-text-field :deep(.v-field__input) {
  color: white !important;
}

.v-text-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.2;
}

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

/* Style the expansion panels */
.v-expansion-panels :deep(.v-expansion-panel-title) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}

.v-expansion-panels :deep(.v-expansion-panel-text) {
  background-color: rgba(255, 255, 255, 0.03) !important;
  color: rgb(209, 213, 219) !important;
}

/* Form input focus effects */
input:focus, textarea:focus {
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

div {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
}
</style>