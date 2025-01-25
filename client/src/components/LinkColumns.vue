<template>
  <div class="link-card-grid">
    <div>
      <h2 class="text-xl">Tools</h2>
      <LinkCard v-for="(tool, index) in tools" :key="tool.title" :icon="tool.icon ?? ''" :title="tool.title"
        :description="tool.description ?? ''" :link="tool.url" :index="index" :shortcut="ctrl" class="mb-2"
        :onDelete="() => handleDeleteLink('tool', index)" :onEdit="() => handleEditLink(tools[index])" />
      <AddLinkCard v-if="canAddLinks" :columnType="'tools'" :tools="props.tools" :docs="props.docs"
        :userId="props.userId" :maxPins="props.maxPins" @linkAdded="handleNewTool" />
    </div>
    <div>
      <h2 class="text-xl">Docs</h2>
      <LinkCard v-for="(doc, index) in docs" :key="doc.title" :icon="doc.icon ?? ''" :title="doc.title"
        :description="doc.description ?? ''" :link="doc.url" :index="index" :shortcut="alt" class="mb-2"
        :onDelete="() => handleDeleteLink('doc', index)" :onEdit="() => handleEditLink(docs[index])" />
      <AddLinkCard v-if="canAddLinks" :columnType="'docs'" :tools="props.tools" :docs="props.docs"
        :userId="props.userId" :maxPins="props.maxPins" @linkAdded="handleNewDoc" />
    </div>
  </div>
  <EditLinkModal v-model="showEditModal" :link="editingLink" @linkUpdated="handleLinkUpdated" />
</template>

<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, ref } from 'vue';
import LinkCard from './LinkCard.vue';
import AddLinkCard from './AddLinkCard.vue';
import type { Tables } from '../types/Database';
import { linkUtils } from '@/composables/useDatabase';
import EditLinkModal from './EditLinkModal.vue';
type Link = Tables<'links'>;

const ctrl = "ctrl";
const alt = "alt";
const showEditModal = ref(false);
const editingLink = ref<Link | undefined>();

const props = defineProps<{
  tools: Link[];
  docs: Link[];
  canAddLinks?: boolean;
  userId: string | null;
  maxPins: number;
}>();

const emit = defineEmits<{
  (e: 'toolAdded', tool: Link): void;
  (e: 'docAdded', doc: Link): void;
}>();

const handleNewTool = (tool: Link) => {
  emit('toolAdded', tool);
};

const handleNewDoc = (doc: Link) => {
  emit('docAdded', doc);
};

const handleDeleteLink = (type: string, index: number) => {
  if (type === 'tool') {
    if (confirm(`Are you sure you want to delete the link "${props.tools[index].title}"?`)) {
      linkUtils.deleteLink(props.tools[index].id);
      props.tools.splice(index, 1);
    }
  } else {
    if (confirm(`Are you sure you want to delete the link "${props.docs[index].title}"?`)) {
      linkUtils.deleteLink(props.docs[index].id);
      props.docs.splice(index, 1);
    }
  }
};

const handleEditLink = (link: Link) => {
  editingLink.value = link;
  showEditModal.value = true;
};

const handleLinkUpdated = (updatedLink: Link) => {
  const index = updatedLink.column_type === 'tools'
    ? props.tools.findIndex(t => t.id === updatedLink.id)
    : props.docs.findIndex(d => d.id === updatedLink.id);

  if (index !== -1) {
    if (updatedLink.column_type === 'tools') {
      props.tools[index] = updatedLink;
    } else {
      props.docs[index] = updatedLink;
    }
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey) {
    const index = Number.parseInt(event.key) - 1;
    if (index >= 0 && index < props.tools.length) {
      window.open(props.tools[index].url, '_blank');
    }
  } else if (event.altKey) {
    const index = Number.parseInt(event.key) - 1;
    if (index >= 0 && index < props.docs.length) {
      window.open(props.docs[index].url, '_blank');
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.link-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 3rem;
  gap: 2rem;
}
</style>