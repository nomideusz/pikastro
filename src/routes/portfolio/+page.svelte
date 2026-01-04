<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import img01 from "$lib/assets/images/grafika/1.png";
	import img02 from "$lib/assets/images/grafika/2.png";
	import img03 from "$lib/assets/images/grafika/3.png";
	import img04 from "$lib/assets/images/grafika/4.png";
	import img05 from "$lib/assets/images/grafika/5.png";
	import img06 from "$lib/assets/images/grafika/6.png";
	import img07 from "$lib/assets/images/grafika/7.png";
	import img08 from "$lib/assets/images/grafika/8.jpg";
	import img09 from "$lib/assets/images/grafika/9.png";
	import img10 from "$lib/assets/images/grafika/10.png";
	import img11 from "$lib/assets/images/grafika/11.png";
	import img12 from "$lib/assets/images/grafika/12.png";
	import img13 from "$lib/assets/images/grafika/13.png";
	import img14 from "$lib/assets/images/grafika/14.png";
	import img15 from "$lib/assets/images/grafika/15.png";
	import img16 from "$lib/assets/images/grafika/16.png";
	import img17 from "$lib/assets/images/grafika/17.png";
	import img18 from "$lib/assets/images/grafika/18.png";
	import img19 from "$lib/assets/images/grafika/19.png";
	import img20 from "$lib/assets/images/grafika/20.png";
	import img21 from "$lib/assets/images/grafika/21.png";
	import img22 from "$lib/assets/images/grafika/22.jpg";
	import img_w_01 from "$lib/assets/images/wnetrza/01.jpeg";
	import img_w_02 from "$lib/assets/images/wnetrza/02.jpeg";
	import img_w_03 from "$lib/assets/images/wnetrza/03.jpeg";
	import img_w_04 from "$lib/assets/images/wnetrza/04.jpeg";
	import img_w_05 from "$lib/assets/images/wnetrza/05.jpeg";
	import img_w_06 from "$lib/assets/images/wnetrza/06.jpeg";
	import colorsImg from "$lib/assets/images/colors.jpeg";
	import EditableText from "$lib/components/EditableText.svelte";
	import PortfolioCard from "$lib/components/PortfolioCard.svelte";
	import ImagePicker from "$lib/components/ImagePicker.svelte";
	import { editModeStore } from "$lib/stores/editMode.svelte";
	import { t } from "$lib/i18n";
	import { filekitToken } from "$lib/stores/filekit.svelte";

	// Portfolio sections with images
	// Data structure: strings (legacy/static) OR objects { reference, description }
	interface ImageObject {
		reference: string;
		description?: string;
	}

	let portfolioSections = $state<
		{
			id: string;
			titleKey: string;
			images: (string | ImageObject)[];
		}[]
	>([
		{
			id: "grafika",
			titleKey: "portfolio.sections.graphics",
			images: [
				img01,
				img02,
				img03,
				img04,
				img05,
				img06,
				img07,
				img08,
				img09,
				img10,
				img11,
				img12,
				img13,
				img14,
				img15,
				img16,
				img17,
				img18,
				img19,
				img20,
				img21,
				img22,
			],
		},
		{
			id: "wnetrza",
			titleKey: "portfolio.sections.interiors",
			images: [
				img_w_01,
				img_w_02,
				img_w_03,
				img_w_04,
				img_w_05,
				img_w_06,
			],
		},
		{
			id: "branding",
			titleKey: "portfolio.sections.branding",
			images: [colorsImg], // To be expanded
		},
		{
			id: "rysunek",
			titleKey: "portfolio.sections.drawing",
			images: [], // To be added later
		},
	]);

	// Edit state
	let pickerOpen = $state(false);
	let editingSectionId = $state<string | null>(null);
	let editingImageIndex = $state<number | null>(null); // null means adding new

	async function loadPortfolioContent() {
		try {
			const response = await fetch("/api/content?category=portfolio");
			if (response.ok) {
				const result = await response.json();
				if (result.success && Array.isArray(result.data)) {
					result.data.forEach((item: any) => {
						// Key format: "portfolio.{sectionId}.images"
						const match = item.key.match(
							/^portfolio\.(\w+)\.images$/,
						);
						if (match) {
							const sectionId = match[1];
							const section = portfolioSections.find(
								(s) => s.id === sectionId,
							);
							if (section) {
								try {
									section.images = JSON.parse(item.value);
								} catch (e) {
									console.error(
										"Failed to parse images for",
										sectionId,
										e,
									);
								}
							}
						}
					});
				}
			}
		} catch (error) {
			console.error("Error loading portfolio content", error);
		}
	}

	async function saveSectionImages(sectionId: string) {
		const section = portfolioSections.find((s) => s.id === sectionId);
		if (!section) return;

		try {
			await fetch("/api/content", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					key: `portfolio.${sectionId}.images`,
					value: JSON.stringify(section.images),
					category: "portfolio",
				}),
			});
		} catch (error) {
			console.error("Error saving portfolio content", error);
		}
	}

	function checkEditAuth() {
		return editModeStore.isEditMode && editModeStore.isAuthenticated;
	}

	function openAddImage(sectionId: string) {
		if (!checkEditAuth()) return;
		editingSectionId = sectionId;
		editingImageIndex = null;
		pickerOpen = true;
	}

	function openEditImage(sectionId: string, index: number) {
		if (!checkEditAuth()) return;
		editingSectionId = sectionId;
		editingImageIndex = index;
		pickerOpen = true;
	}

	function handleImageSelected(url: string) {
		if (!editingSectionId) return;
		const section = portfolioSections.find(
			(s) => s.id === editingSectionId,
		);
		if (!section) return;

		// New image object structure. Logic to preserve description if updating.
		let newImageObj = { reference: url, description: "" };

		if (editingImageIndex !== null) {
			// Replace existing
			const existing = section.images[editingImageIndex];
			if (typeof existing === "object" && existing !== null) {
				newImageObj.description = existing.description || "";
			}
			section.images[editingImageIndex] = newImageObj;
		} else {
			// Add new
			section.images.push(newImageObj);
		}
		saveSectionImages(editingSectionId);
	}

	async function handleDeleteImage(sectionId: string, index: number) {
		if (!checkEditAuth() || !confirm("Czy na pewno usunąć to zdjęcie?"))
			return;
		const section = portfolioSections.find((s) => s.id === sectionId);
		if (!section) return;

		const item = section.images[index];
		const imgSrc = typeof item === "string" ? item : item.reference;
		// Check if it's a FileKit image (UUID, no slashes or http)
		const isFileKit =
			imgSrc && !imgSrc.includes("/") && !imgSrc.startsWith("http");

		if (isFileKit) {
			try {
				const res = await fetch("/api/filekit/delete", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ fileId: imgSrc }),
				});
				if (!res.ok) {
					console.warn(
						"Failed to delete from FileKit, but removing from portfolio.",
					);
				}
			} catch (e) {
				console.error("Error deleting from FileKit", e);
			}
		}

		section.images.splice(index, 1);
		saveSectionImages(sectionId);
	}

	function handleDescriptionUpdate(
		sectionId: string,
		index: number,
		description: string,
	) {
		if (!checkEditAuth()) return;
		const section = portfolioSections.find((s) => s.id === sectionId);
		if (!section) return;

		const item = section.images[index];
		if (typeof item === "string") {
			// Convert to object
			section.images[index] = { reference: item, description };
		} else if (typeof item === "object") {
			// Update object
			item.description = description;
		}

		saveSectionImages(sectionId);
	}

	// Colors
	const colors = {
		primary: "#27275B",
		accent: "#F32A61",
		secondary: "#1DA898",
		tertiary: "#F5848E",
	};

	let activeSection = $state("grafika");
	let scrollContainers = $state<{ [key: string]: HTMLElement }>({});
	let pausedContainers = new Set<string>();
	let scrollPositions: { [key: string]: number } = {};
	let animationFrameId: number;

	// Drag/swipe state
	let isDragging = $state<{ [key: string]: boolean }>({});
	let dragStartX: { [key: string]: number } = {};
	let dragScrollLeft: { [key: string]: number } = {};
	let scrollProgress = $state<{ [key: string]: number }>({});

	// Handle drag start
	function handleDragStart(e: MouseEvent | TouchEvent, sectionId: string) {
		isDragging[sectionId] = true;
		pausedContainers.add(sectionId);
		const container = scrollContainers[sectionId];
		if (!container) return;

		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		dragStartX[sectionId] = clientX;
		dragScrollLeft[sectionId] = container.scrollLeft;
		container.style.cursor = "grabbing";
	}

	// Handle drag move
	function handleDragMove(e: MouseEvent | TouchEvent, sectionId: string) {
		if (!isDragging[sectionId]) return;
		e.preventDefault();

		const container = scrollContainers[sectionId];
		if (!container) return;

		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const walk = (clientX - dragStartX[sectionId]) * 1.5; // Multiply for faster scrolling
		container.scrollLeft = dragScrollLeft[sectionId] - walk;
		scrollPositions[sectionId] = container.scrollLeft;
		updateScrollProgress(sectionId);
	}

	// Handle drag end
	function handleDragEnd(sectionId: string) {
		isDragging[sectionId] = false;
		const container = scrollContainers[sectionId];
		if (container) {
			container.style.cursor = "grab";
		}
		// Resume auto-scroll after a delay
		setTimeout(() => {
			if (!isDragging[sectionId]) {
				pausedContainers.delete(sectionId);
			}
		}, 2000);
	}

	// Update scroll progress for indicator
	function updateScrollProgress(sectionId: string) {
		const container = scrollContainers[sectionId];
		if (!container) return;

		const singleSetWidth = container.scrollWidth / 2;
		const progress =
			((container.scrollLeft % singleSetWidth) / singleSetWidth) * 100;
		scrollProgress[sectionId] = Math.min(100, Math.max(0, progress));
	}

	// Handle scroll indicator click/drag
	function handleIndicatorClick(e: MouseEvent, sectionId: string) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const percentage = clickX / rect.width;

		const container = scrollContainers[sectionId];
		if (!container) return;

		const singleSetWidth = container.scrollWidth / 2;
		container.scrollLeft = percentage * singleSetWidth;
		scrollPositions[sectionId] = container.scrollLeft;
		updateScrollProgress(sectionId);
	}

	function startAutoScroll() {
		const speed = 0.5;

		function animate() {
			Object.entries(scrollContainers).forEach(([id, container]) => {
				if (!container) return;

				// Initialize position if needed
				if (typeof scrollPositions[id] === "undefined") {
					scrollPositions[id] = container.scrollLeft;
				}

				if (!pausedContainers.has(id)) {
					scrollPositions[id] += speed;

					// Get the scroll width of a single set (half of total since we duplicate)
					const singleSetWidth = container.scrollWidth / 2;

					// When we've scrolled past the first set, seamlessly reset to the start
					if (scrollPositions[id] >= singleSetWidth) {
						scrollPositions[id] = 0;
					}

					container.scrollLeft = scrollPositions[id];
					updateScrollProgress(id);
				} else {
					// Sync position in case user scrolled manually while paused
					scrollPositions[id] = container.scrollLeft;
					updateScrollProgress(id);
				}
			});
			animationFrameId = requestAnimationFrame(animate);
		}

		animationFrameId = requestAnimationFrame(animate);
	}

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			const navHeight = 80; // Height of sticky navigation
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition =
				elementPosition + window.pageYOffset - navHeight;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	}

	onMount(() => {
		// Set up intersection observer for active section tracking
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{
				rootMargin: "-100px 0px -50% 0px",
			},
		);

		portfolioSections.forEach((section) => {
			const element = document.getElementById(section.id);
			if (element) {
				observer.observe(element);
			}
		});

		loadPortfolioContent();
		startAutoScroll();

		// Init FileKit token
		if (!$filekitToken) {
			filekitToken.init();
		}

		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<svelte:head>
	<title>Portfolio - Pikastro</title>
	<meta
		name="description"
		content="Pełne portfolio projektów Pikastro - wnętrza, branding, grafika i więcej"
	/>
</svelte:head>

<!-- Sticky Navigation -->
<nav
	class="sticky top-20 z-40 shadow-lg border-b-4"
	style="background: linear-gradient(135deg, {colors.primary} 0%, #1a1a3e 100%); border-bottom-color: {colors.accent}; backdrop-filter: blur(12px);"
>
	<div class="overflow-x-auto scrollbar-hide">
		<div class="max-w-7xl mx-auto flex gap-2 md:gap-3 py-4">
			{#each portfolioSections as section}
				<button
					onclick={() => scrollToSection(section.id)}
					class="px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl whitespace-nowrap transition-all duration-300 flex-shrink-0 border-2 {activeSection ===
					section.id
						? 'text-white'
						: 'text-gray-300 hover:text-white'}"
					style={activeSection === section.id
						? `background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%); border-color: ${colors.secondary}; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.5);`
						: `background-color: transparent; border-color: ${colors.accent}40;`}
					onmouseenter={(e) => {
						if (activeSection !== section.id) {
							e.currentTarget.style.transform = "scale(1.05)";
							e.currentTarget.style.borderColor = colors.accent;
						}
					}}
					onmouseleave={(e) => {
						if (activeSection !== section.id) {
							e.currentTarget.style.transform = "scale(1)";
							e.currentTarget.style.borderColor = `${colors.accent}40`;
						}
					}}
				>
					<EditableText key={section.titleKey} tag="span" />
				</button>
			{/each}
		</div>
	</div>
</nav>

<!-- Portfolio Sections -->
<main
	style="background: linear-gradient(180deg, {colors.primary} 0%, #1a1a3e 50%, {colors.primary} 100%);"
>
	{#each portfolioSections as section, index}
		<section
			id={section.id}
			class="relative pt-8 md:pt-12 pb-8 md:pb-10 overflow-hidden"
			style="background: linear-gradient(135deg,
				{index % 4 === 0
				? `${colors.primary}E6`
				: index % 4 === 1
					? `${colors.secondary}20`
					: index % 4 === 2
						? `${colors.accent}20`
						: `${colors.tertiary}20`} 0%,
				transparent 100%);"
		>
			<!-- Section Header -->
			<div class="max-w-7xl mx-auto mb-4">
				<h2
					class="text-2xl md:text-3xl lg:text-4xl font-black flex items-center gap-4"
					style="font-family: 'Playfair Display', serif; text-shadow: 0 0 30px rgba(243, 42, 97, 0.5); letter-spacing: 0.08em; color: {colors.accent};"
				>
					<EditableText key={section.titleKey} tag="span" />
					{#if checkEditAuth()}
						<button
							onclick={() => openAddImage(section.id)}
							class="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform hover:scale-110"
							title="Dodaj zdjęcie"
						>
							+
						</button>
					{/if}
				</h2>
				<div
					class="h-1 w-24 mt-4 rounded-full"
					style="background: linear-gradient(90deg, {colors.accent} 0%, {colors.secondary} 100%);"
				></div>
			</div>

			<!-- Horizontal Scrolling Carousel -->
			{#if section.images.length > 0}
				<div class="carousel-wrapper w-full">
					<!-- Carousel Container with drag support -->
					<div
						bind:this={scrollContainers[section.id]}
						class="horizontal-scroll-container py-2 cursor-grab select-none"
						style="padding-left: 1rem; padding-right: 1rem;"
						onmouseenter={() => pausedContainers.add(section.id)}
						onmouseleave={() => {
							pausedContainers.delete(section.id);
							handleDragEnd(section.id);
						}}
						onmousedown={(e) => handleDragStart(e, section.id)}
						onmousemove={(e) => handleDragMove(e, section.id)}
						onmouseup={() => handleDragEnd(section.id)}
						ontouchstart={(e) => handleDragStart(e, section.id)}
						ontouchmove={(e) => handleDragMove(e, section.id)}
						ontouchend={() => handleDragEnd(section.id)}
						role="region"
						aria-label="Galeria zdjęć {t(section.titleKey)}"
					>
						<div class="flex gap-6 md:gap-8 items-center pt-2 pb-8">
							<!-- First set of images -->
							{#each section.images as image, imgIndex}
								<PortfolioCard
									item={image}
									index={imgIndex}
									token={$filekitToken}
									isEditable={!!checkEditAuth()}
									altText="{t(
										section.titleKey,
									)} - img {imgIndex + 1}"
									imageClass="h-full w-auto object-contain"
									style="height: 550px; border-color: {colors.accent}40; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.3);"
									onEditImage={(idx) =>
										openEditImage(section.id, idx)}
									onDeleteImage={(idx) =>
										handleDeleteImage(section.id, idx)}
									onUpdateDescription={(idx, desc) =>
										handleDescriptionUpdate(
											section.id,
											idx,
											desc,
										)}
								/>
							{/each}
							<!-- Duplicate set for seamless loop -->
							{#if section.images.length > 3}
								{#each section.images as image, imgIndex}
									<PortfolioCard
										item={image}
										index={imgIndex}
										token={$filekitToken}
										isEditable={!!checkEditAuth()}
										altText="{t(
											section.titleKey,
										)} - img {imgIndex + 1} (dup)"
										imageClass="h-full w-auto object-contain"
										style="height: 550px; border-color: {colors.accent}40; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.3);"
										onEditImage={(idx) =>
											openEditImage(section.id, idx)}
										onDeleteImage={(idx) =>
											handleDeleteImage(section.id, idx)}
										onUpdateDescription={(idx, desc) =>
											handleDescriptionUpdate(
												section.id,
												idx,
												desc,
											)}
									/>
								{/each}
							{/if}
						</div>
					</div>

					<!-- Scroll Progress Indicator - only show if enough images to scroll -->
					{#if section.images.length > 3}
						<div
							class="scroll-indicator-container mt-6 mx-auto cursor-pointer"
							style="max-width: 400px;"
							onclick={(e) => handleIndicatorClick(e, section.id)}
							role="slider"
							aria-label="Przewiń galerię"
							aria-valuenow={scrollProgress[section.id] || 0}
							aria-valuemin="0"
							aria-valuemax="100"
							tabindex="0"
						>
							<div
								class="scroll-indicator-track h-2 rounded-full"
								style="background: {colors.primary}60;"
							>
								<div
									class="scroll-indicator-thumb h-full rounded-full transition-all duration-150"
									style="width: {scrollProgress[section.id] ||
										0}%; background: linear-gradient(90deg, {colors.accent} 0%, {colors.secondary} 100%);"
								></div>
							</div>
							<p
								class="text-center text-xs text-gray-400 mt-2 opacity-70"
							>
								← Przeciągnij lub kliknij aby przewinąć →
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="px-4 md:px-8 lg:px-12">
					<div
						class="border-4 border-dashed rounded-2xl p-12 text-center backdrop-blur-sm"
						style="border-color: {colors.accent}60; background: rgba(39, 39, 91, 0.3);"
					>
						<p class="text-xl text-white mb-4 font-bold">
							<EditableText
								key="portfolio.sectionInProgress"
								tag="span"
							/>
						</p>
						<p class="text-sm" style="color: {colors.tertiary};">
							<EditableText
								key="portfolio.addImagesInstruction"
								tag="span"
							/>
							<code
								class="px-2 py-1 rounded"
								style="background-color: {colors.primary}; color: {colors.accent};"
								>src/lib/assets/images/{section.id}/</code
							>
						</p>
					</div>
				</div>
			{/if}

			<!-- Decorative elements -->
			<div
				class="absolute -top-10 -right-10 w-40 h-40 rounded-full filter blur-3xl opacity-30 pointer-events-none animate-pulse-slow"
				style="background-color: {index % 3 === 0
					? colors.accent
					: index % 3 === 1
						? colors.secondary
						: colors.tertiary};"
			></div>
			<div
				class="absolute -bottom-10 -left-10 w-60 h-60 rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse-slow"
				style="background-color: {index % 3 === 0
					? colors.secondary
					: index % 3 === 1
						? colors.tertiary
						: colors.accent}; animation-delay: 1.5s;"
			></div>
		</section>

		<!-- Section Separator -->
		{#if index < portfolioSections.length - 1}
			<div
				class="w-full h-0.5"
				style="background: linear-gradient(90deg, {colors.accent} 0%, {colors.secondary} 50%, {colors.tertiary} 100%); opacity: 0.5;"
			></div>
		{/if}
	{/each}
</main>

<!-- Back to Top Button -->
<button
	onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
	class="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40 border-2"
	style="background: linear-gradient(135deg, {colors.accent} 0%, {colors.primary} 100%); border-color: {colors.secondary}; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.5);"
	aria-label="Powrót na górę"
>
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M5 10l7-7m0 0l7 7m-7-7v18"
		></path>
	</svg>
</button>

<ImagePicker bind:isOpen={pickerOpen} onSelect={handleImageSelected} />

<style>
	.horizontal-scroll-container {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		/* Hide scrollbar completely */
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.horizontal-scroll-container::-webkit-scrollbar {
		display: none;
	}

	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 768px) {
		.horizontal-scroll-container {
			padding-left: 1rem !important;
			padding-right: 1rem !important;
		}
	}

	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(1.05);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	/* Carousel drag states */
	.horizontal-scroll-container.cursor-grab {
		cursor: grab;
	}

	.horizontal-scroll-container:active {
		cursor: grabbing;
	}

	/* Scroll indicator styling */
	.scroll-indicator-container {
		padding: 0.5rem;
	}

	.scroll-indicator-track {
		position: relative;
		overflow: hidden;
	}

	.scroll-indicator-thumb {
		min-width: 20px;
	}

	/* Carousel image containers - auto width based on image */
	.carousel-image-container {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(39, 39, 91, 0.2);
	}

	.carousel-image-container img {
		max-width: none;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.carousel-image-container {
			height: 300px !important;
		}

		.scroll-indicator-container {
			max-width: 280px !important;
		}
	}
</style>
