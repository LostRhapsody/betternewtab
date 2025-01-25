<!-- TeamManageModal.vue -->
<template>
  <v-dialog v-model="isOpen" width="800">
    <v-card>
      <v-card-title>{{ props.teamId ? 'Manage Team' : 'Create Team' }}</v-card-title>

      <v-alert v-if="errorMessage" type="error" class="mx-4 mt-4">{{ errorMessage }}</v-alert>

      <template v-if="!props.teamId">
        <v-card-text>
          <v-form @submit.prevent="createTeam" ref="createTeamForm">
            <v-text-field v-model="newTeamName" label="Team Name" :rules="[v => !!v || 'Team name is required']"
              required></v-text-field>
            <v-btn type="submit" color="primary" :loading="isCreating">
              Create Team
            </v-btn>
          </v-form>
        </v-card-text>
      </template>

      <template v-else>
        <v-tabs v-model="activeTab">
          <v-tab value="members">Team Members</v-tab>
          <v-tab value="links">Team Links</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="activeTab">
            <!-- Members Tab -->
            <v-window-item value="members">
              <div class="mt-4">
                <v-form @submit.prevent="addMember" ref="addMemberForm">
                  <v-text-field v-model="newMemberEmail" label="Add member by email" type="email"
                    :rules="[v => !!v || 'Email is required']"></v-text-field>
                  <v-btn type="submit" color="primary" :loading="isAddingMember">
                    Add Member
                  </v-btn>
                </v-form>

                <v-list class="mt-4">
                  <v-list-item v-for="member in teamMembers" :key="member.user_id">
                    <v-list-item-title>{{ member.email }}</v-list-item-title>
                    <template v-slot:append>
                      <div>
                        <div v-if="member.role === 'owner'">
                          <v-icon>mdi-crown</v-icon>Owner
                        </div>
                        <div v-else class="flex flex-row">
                          <v-select v-model="member.role" :items="['admin', 'member']" density="compact"
                          @update:model-value="updateMemberRole(member.user_id, $event)" class="min-w-32 pl-4"
                          variant="underlined"></v-select>
                          <v-btn icon="mdi-delete" variant="text" color="error"
                          @click="removeMember(member.user_id)"></v-btn>
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-window-item>

            <!-- Links Tab -->
            <v-window-item value="links">
              <div class="mt-4 grid grid-cols-1 gap-4">
                <LinkCard v-for="(link, index) in teamLinks" :key="link.id" :icon="link.icon ?? undefined"
                  :title="link.title" :description="link.description ?? ''" :link="link.url" :index="index"
                  :shortcut="ctrl" :onDelete="() => removeLink(link.id)" :onEdit="() => {}">
                  <template v-slot:actions>
                    <v-btn icon="mdi-delete" variant="text" color="error" @click="removeLink(link.id)"></v-btn>
                  </template>
                </LinkCard>

                <AddLinkCard columnType="tools" :tools="[]" :docs="[]" :userId="teamId ?? null" :ownerType="'team'"
                  @linkAdded="handleNewLink" :maxPins="0" />
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </template>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="isOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { linkUtils, teamUtils, membershipUtils, userUtils } from '@/composables/useDatabase';
import type { Tables } from '../types/Database';
import LinkCard from './LinkCard.vue';
import AddLinkCard from './AddLinkCard.vue';

type Link = Tables<'links'>;
const ctrl = "ctrl";

const props = defineProps<{
  modelValue: boolean;
  teamId?: string;
  userId: string | null;
  planId: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'teamCreated'): void;
  (e: 'linkAdded', link: Link): void;
}>();

const isOpen = ref(props.modelValue);
const activeTab = ref('members');
const errorMessage = ref('');
const teamMembers = ref<Array<{ user_id: string; email: string; role: string }>>([]);
const teamLinks = ref<Link[]>([]);
const newMemberEmail = ref('');
const isAddingMember = ref(false);
const newTeamName = ref('');
const isCreating = ref(false);
const createTeamForm = ref<HTMLFormElement | null>(null);
const addMemberForm = ref<HTMLFormElement | null>(null);

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
});

watch(() => isOpen.value, (newValue) => {
  emit('update:modelValue', newValue);
});

watch([() => props.teamId, () => isOpen.value], async ([newTeamId, newIsOpen]) => {
  if (newTeamId && newIsOpen) {
    await loadTeamMembers();
    await loadTeamLinks();
  }
});

onMounted(async () => {
  if (props.teamId) {
    await loadTeamMembers();
    await loadTeamLinks();
  }
});

function showError(message: string) {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
}

async function createTeam() {
  if (!createTeamForm.value) return;
  const { valid } = await createTeamForm.value.validate();
  if (!valid) return;

  try {
    isCreating.value = true;
    if (!props.userId) throw new Error('User not found');
    if (!props.planId) throw new Error('Plan not found');

    await teamUtils.createTeam(
      props.userId,
      props.planId,
      newTeamName.value,
    );
    emit('teamCreated');
    isOpen.value = false;
  } catch (error) {
    console.error('Error creating team:', error);
    showError('Failed to create team. Please try again.');
  } finally {
    isCreating.value = false;
  }
}

async function loadTeamMembers() {
  if (!props.teamId) return;
  const members = await teamUtils.getTeamMembers(props.teamId);
  teamMembers.value = members;
  console.log(teamMembers.value);
}

async function loadTeamLinks() {
  if (!props.teamId) return;
  teamLinks.value = await linkUtils.getTeamLinks(props.teamId);
}

async function addMember() {
  if (!addMemberForm.value || !props.teamId) return;
  const { valid } = await addMemberForm.value.validate();
  if (!valid) return;

  try {
    isAddingMember.value = true;
    const user = await userUtils.getUserByEmail(newMemberEmail.value);

    if (!user) {
      showError('User not found. They need to sign up first.');
      return;
    }

    await membershipUtils.addMember(user.id, props.teamId, 'team', 'member');
    await loadTeamMembers();
    newMemberEmail.value = '';
    await addMemberForm.value?.resetValidation();
  } catch (error) {
    console.error('Error adding member:', error);
    showError('Failed to add member. Please try again.');
  } finally {
    isAddingMember.value = false;
  }
}

async function updateMemberRole(userId: string, newRole: string) {
  if (!props.teamId) return;
  try {
    await membershipUtils.updateMemberRole(userId, props.teamId, newRole);
    await loadTeamMembers();
  } catch (error) {
    console.error('Error updating member role:', error);
    showError('Failed to update member role. Please try again.');
  }
}

async function removeMember(userId: string) {
  if (!props.teamId) return;
  try {
    await membershipUtils.removeMember(userId, props.teamId);
    await loadTeamMembers();
  } catch (error) {
    console.error('Error removing member:', error);
    showError('Failed to remove member. Please try again.');
  }
}

async function removeLink(linkId: string) {
  try {
    await linkUtils.deleteLink(linkId);
    await loadTeamLinks();
  } catch (error) {
    console.error('Error removing link:', error);
    showError('Failed to remove link. Please try again.');
  }
}

function handleNewLink(link: Link) {
  emit('linkAdded', link);
  loadTeamLinks();
}
</script>