<template>
	<v-dialog v-model="isModalOpen" width="500" :fullscreen="mobile">
		<v-card class="py-8 sm:py-0 sm:px-0">
			<v-card-title>Edit Link</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleSubmit" ref="form">
					<v-text-field v-model="formData.url" :rules="[v => !!v || 'URL is required', linkStore.validateUrl]" label="URL"
						required type="url" @keyup.enter="handleSubmit"></v-text-field>

					<v-text-field v-model="formData.title" label="Title"
						@keyup.enter="(e: Event) => { e.preventDefault(); handleSubmit() }"></v-text-field>

					<v-textarea @keydown.enter.prevent="(e: KeyboardEvent) => {
						if (e.shiftKey && e.target !== null) {
							(e.target as HTMLTextAreaElement).value += '\n'
						} else {
							handleSubmit()
						}
					}" v-model="formData.description" label="Description" rows="3"></v-textarea>

					<v-select v-model="formData.columnType" :items="columnTypes" label="Column Label" required>
						<template v-slot:append-item>
							<v-divider class="my-4"></v-divider>
							<v-list-item>
								<v-text-field
									v-model="newColumnType"
									label="New Column Type"
									dense
									hide-details
									@keyup.enter="addNewColumnType"
								></v-text-field>
								<v-btn @click="addNewColumnType" color="primary" class="w-full">
									Add
								</v-btn>
							</v-list-item>
						</template>
					</v-select>
				</v-form>
			</v-card-text>

			<v-card-actions>
					<div :class="mobile ? 'hidden' : 'text-xs text-gray-500 grid grid-cols-3 gap-2 ps-4 pb-4'">
						<span class="col-span-1 text-start">Submit:</span>
						<span class="col-span-2">
							<span class="kbd">enter<v-icon size="18">mdi-keyboard-return</v-icon></span>
						</span>
						<span class="col-span-1 text-start">New line:</span>
						<span class="col-span-2">
							<span class="kbd">shift<v-icon size="18">mdi-arrow-up</v-icon></span> + <span class="kbd">enter<v-icon
									size="18">mdi-keyboard-return</v-icon></span>
						</span>
					</div>
					<v-spacer v-if="!mobile"></v-spacer>
					<div :class="mobile ? 'flex flex-col gap-4 w-full' : 'grid grid-rows-2 gap-4'">
						<div :class="mobile ? 'flex justify-around' : ''">
							<v-btn color="grey-darken-1" :variant="mobile ? 'elevated' : 'text' " :size="mobile ? 'x-large' : 'default'" @click="closeModal">
								Cancel
							</v-btn>
							<v-btn color="primary" :variant="mobile ? 'elevated' : 'text'" :size="mobile ? 'x-large' : 'default'" :loading="isLoading" @click="handleSubmit">
								Save Link
							</v-btn>
						</div>
						<div class="flex justify-end">
							<v-tooltip location="left" :z-index="1000" max-width="300" open-on-click>
								<template v-slot:activator="{ props }">
									<v-btn v-bind="props">
										<v-icon size="x-large" icon="mdi-help-circle-outline" class="text-gray-500" />
									</v-btn>
								</template>
								<span>
									<span class="kbd">+Plus Feature</span><br/>
									<strong>Better New Tab</strong> will not attempt to fetch the title or description from the URL when editing a link.
									<br/><br/>
									Add a new link to see this feature in action.
								</span>
							</v-tooltip>
						</div>
					</div>
				</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Link } from "@/types/Link";
import { useLinksStore } from "../stores/links";
import { useDisplay } from 'vuetify';
const linkStore = useLinksStore();
const mobile = useDisplay().smAndDown;

const props = defineProps<{
	modelValue: boolean;
	link?: Link;
}>();

const emit = defineEmits<(e: "update:modelValue", value: boolean) => void>();

const isModalOpen = ref(props.modelValue);
const isLoading = ref(false);
const form = ref<HTMLFormElement | null>(null);

const formData = ref({
	url: "",
	title: "",
	description: "",
	columnType: "",
});

const newColumnType = ref("");

const columnTypes = computed(() => linkStore.uniqueColumnTypes);

watch(
	() => props.modelValue,
	(newValue) => {
		isModalOpen.value = newValue;
		if (newValue && props.link) {
			formData.value = {
				url: props.link.url,
				title: props.link.title,
				description: props.link.description || "",
				columnType: props.link.column_type || "",
			};
		}
	},
);

watch(
	() => isModalOpen.value,
	(newValue) => {
		emit("update:modelValue", newValue);
	},
);

const closeModal = () => {
	isModalOpen.value = false;
	resetForm();
};

const resetForm = () => {
	formData.value = {
		url: "",
		title: "",
		description: "",
		columnType: "",
	};
	newColumnType.value = "";
	if (form.value) {
		form.value.resetValidation();
	}
};

const addNewColumnType = () => {
    if (newColumnType.value.trim() && !columnTypes.value.includes(newColumnType.value.trim())) {
        columnTypes.value.push(newColumnType.value.trim());
        formData.value.columnType = newColumnType.value.trim();
        newColumnType.value = "";
    }
};

const handleSubmit = async () => {
	if (!form.value || !props.link) return;

	const { valid } = await form.value.validate();
	if (!valid) return;

	try {
		isLoading.value = true;
		props.link.url = formData.value.url;
		props.link.title = formData.value.title || new URL(formData.value.url).hostname;
		props.link.description = formData.value.description;
		props.link.column_type = formData.value.columnType;

		await linkStore.updateLink(props.link);
		closeModal();
	} catch (error) {
		console.error("Error updating link:", error);
	} finally {
		isLoading.value = false;
	}
};
</script>
