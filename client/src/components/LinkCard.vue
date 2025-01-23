<!-- ToolLink.vue -->
<script setup lang="ts">
import { defineProps, computed } from 'vue'

interface Props {
  icon?: string
  title: string
  description: string
  link: string
  index: number
  shortcut: string
}

const props = defineProps<Props>()

const isMdiIcon = computed(() => props.icon?.startsWith('mdi-'))
</script>

<template>
  <v-card
    :href="link"
    target="_blank"
    variant="tonal"
    class="tool-link pa-4 d-flex align-center"
    :ripple="false"
  >
    <div class="d-flex align-center flex-grow-1">
      <div v-if="icon !== ''">
        <v-icon
            v-if="isMdiIcon"
            :icon="icon"
            size="36"
            class="mr-4"
            color="primary"
          />
          <img
            v-else
            :src="icon"
            alt=""
            class="custom-icon mr-4"
          />
      </div>
      <div>
        <div class="text-h6">{{ title }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ description }}</div>
      </div>
    </div>
    <v-icon
      icon="mdi-chevron-right"
      size="24"
      class="chevron"
    />
    <div class="shortcut-text">{{ shortcut }}+{{ index + 1 }}</div>
  </v-card>
</template>

<style scoped>
.tool-link {
  text-decoration: none;
  /* border: 1px solid dimgray; */
  transition: border-color 0.2s ease-in-out;
  background: rgba(0, 0, 0, 0.1);
  position: relative;
}

.shortcut-text {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: none;
}

.tool-link:hover .shortcut-text {
  display: block;
}

.tool-link:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(64, 64, 64, 0.3);
}

.chevron {
  transform: translateX(0);
  transition: transform 0.2s ease-in-out;
}

.tool-link:hover .chevron {
  transform: translateX(8px);
}

a:hover {
    background-color: DimGrey;
}

.custom-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
</style>