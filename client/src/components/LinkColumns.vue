<template>
	<div class="link-card-grid">
		<div v-if="uniqueColumnTypes.length === 0" class="single-column">
			<AddLinkCard :columnType="'default'" :tools="props.tools" :docs="props.docs"
				:userId="props.userId" :maxPins="props.maxPins" :isPlanFree="isPlanFree" />
		</div>
		<div v-else v-for="columnType in uniqueColumnTypes" :key="columnType" :class="columnClass">
			<h2 class="text-xl">{{ columnType.charAt(0).toUpperCase() + columnType.slice(1) }}</h2>
			<LinkCard v-for="(link, index) in getLinksByColumnType(columnType)" :key="link.order_index" :icon="link.icon ?? ''" :title="link.title"
				:description="link.description ?? ''" :link="link.url" :index="index" :shortcut="getShortcut(columnType)" class="mb-2"
				:onDelete="() => handleDeleteLink(link)" :onEdit="() => handleEditLink(link)" />
			<AddLinkCard v-if="canAddLinks" :columnType="columnType" :tools="props.tools" :docs="props.docs"
				:userId="props.userId" :maxPins="props.maxPins" :isPlanFree="isPlanFree" />
		</div>
		<EditLinkModal v-model="showEditModal" :link="editingLink" />
	</div>
</template>

<script setup lang="ts">
	import { defineProps, onMounted, onUnmounted, ref, computed } from "vue";
	import AddLinkCard from "./AddLinkCard.vue";
	import EditLinkModal from "./EditLinkModal.vue";
	import LinkCard from "./LinkCard.vue";
	import type { Link } from "../types/Link";
	import { useLinksStore } from "../stores/links";
	const linkStore = useLinksStore();

	const showEditModal = ref(false);
	const editingLink = ref<Link | undefined>();

	const props = defineProps<{
		tools: Link[];
		docs: Link[];
		canAddLinks?: boolean;
		userId: string | null;
		maxPins: number;
		isPlanFree: boolean;
	}>();

	const uniqueColumnTypes = computed(() => linkStore.uniqueColumnTypes);

	const getLinksByColumnType = (columnType: string) => {
		return linkStore.links.filter(link => link.column_type === columnType);
	};

	const getShortcut = (columnType: string) => {
		return columnType === 'tools' ? 'ctrl' : 'alt';
	};

	const handleDeleteLink = async (link: Link) => linkStore.removeLink(link.id);

	const handleEditLink = (link: Link) => {
		editingLink.value = link;
		showEditModal.value = true;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.ctrlKey) {
			const index = Number.parseInt(event.key) - 1;
			if (index >= 0 && index < props.tools.length) {
				window.open(props.tools[index].url, "_blank");
			}
		} else if (event.altKey) {
			const index = Number.parseInt(event.key) - 1;
			if (index >= 0 && index < props.docs.length) {
				window.open(props.docs[index].url, "_blank");
			}
		}
	};

	const handleDrag = () => {
		const container = document.querySelector('.link-card-grid') as HTMLElement | null;
		if (!container) return;

		let isDown = false;
		let startX: number;
		let scrollLeft: number;
		let velocity = 0;
		let lastX: number;
		let frame: number;

		// Prevent text selection during drag
		container.style.userSelect = 'none';

		// Add touch events support
		container.addEventListener('touchstart', (e: TouchEvent) => {
			isDown = true;
			container.style.cursor = 'grabbing';
			startX = e.touches[0].pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
			lastX = e.touches[0].pageX;
			cancelAnimationFrame(frame);
		});

		container.addEventListener('mousedown', (e: MouseEvent) => {
			isDown = true;
			container.style.cursor = 'grabbing';
			startX = e.pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
			lastX = e.pageX;
			cancelAnimationFrame(frame);
		});

		const handleDragEnd = () => {
			isDown = false;
			container.style.cursor = 'grab';

			// Apply momentum scrolling
			const momentumScroll = () => {
				if (Math.abs(velocity) > 0.1) {
					container.scrollLeft += velocity;
					velocity *= 0.95; // Decay factor
					frame = requestAnimationFrame(momentumScroll);
				}
			};

			momentumScroll();
		};

		container.addEventListener('mouseup', handleDragEnd);
		container.addEventListener('mouseleave', handleDragEnd);
		container.addEventListener('touchend', handleDragEnd);
		container.addEventListener('touchcancel', handleDragEnd);

		container.addEventListener('touchmove', (e: TouchEvent) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.touches[0].pageX - container.offsetLeft;
			const walk = (x - startX) * 2;
			container.scrollLeft = scrollLeft - walk;

			// Calculate velocity for momentum
			velocity = lastX - e.touches[0].pageX;
			lastX = e.touches[0].pageX;
		});

		container.addEventListener('mousemove', (e: MouseEvent) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - container.offsetLeft;
			const walk = (x - startX) * 2;
			container.scrollLeft = scrollLeft - walk;

			// Calculate velocity for momentum
			velocity = lastX - e.pageX;
			lastX = e.pageX;
		});

		// Add CSS overrides for mobile
		const style = document.createElement('style');
		style.textContent = `
			.link-card-grid * {
				-webkit-touch-callout: none;
				-webkit-tap-highlight-color: transparent;
			}

			@media (pointer: coarse) {
				.link-card-grid {
					scroll-snap-type: x mandatory;
					scroll-behavior: smooth;
				}

				.link-card-grid > div {
					scroll-snap-align: start;
				}
			}
		`;
		document.head.appendChild(style);

		onUnmounted(() => {
			cancelAnimationFrame(frame);
		});

	};

	onMounted(() => {
		window.addEventListener("keydown", handleKeydown);
		handleDrag();
	});

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeydown);
	});

	const columnClass = computed(() => {
		const columnCount = uniqueColumnTypes.value.length;
		if (columnCount === 1) return 'single-column';
		if (columnCount === 2) return 'two-columns';
		if (columnCount === 3) return 'three-columns';
		return 'multiple-columns';
	});
</script>

<style scoped>
	.link-card-grid {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		margin-top: 3rem;
		gap: 2rem;
		padding-bottom: 2rem;
		cursor: grab;
		white-space: nowrap;
		-webkit-overflow-scrolling: touch;
	}

	.link-card-grid:active {
		cursor: grabbing;
	}

	/* Stylish and modern scroll bar */
	::-webkit-scrollbar {
		width: 1px;
		height: 20px;
	}

	::-webkit-scrollbar-track {
		background: #181818;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.2);
	}

	.link-card-grid:has(.single-column) {
		justify-content: center;
	}

	.link-card-grid:has(.two-columns) {
		justify-content: space-evenly;
	}

	.link-card-grid:has(.three-columns) {
		justify-content: center;
	}

	.link-card-grid:has(.multiple-columns) {
		justify-content: space-evenly;
	}

	.single-column {
		flex: 0 0 65%;
		margin: 0 auto;
	}

	.two-columns {
		flex: 0 0 45%;
	}

	.three-columns {
		flex: 0 0 30%;
	}

	.multiple-columns {
		flex: 0 0 45%;
	}

	@media (max-width: 600px) {
		.link-card-grid {
			flex-wrap: nowrap;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			justify-content: center;
		}

		.link-card-grid > div {
			flex: 0 0 100%;
			width: 75%;
			scroll-snap-align: start;
			padding-right: 1rem;
			padding-left: 1rem;
		}
	}
</style>