<script lang="ts">
	import img07 from '$lib/assets/images/07.jpeg';
	import img08 from '$lib/assets/images/08.jpeg';
	import img09 from '$lib/assets/images/09.jpeg';
	import img10 from '$lib/assets/images/10.jpeg';
	import img11 from '$lib/assets/images/11.jpeg';
	import colorsImg from '$lib/assets/images/colors.jpeg';

	// Portfolio sections with images
	const portfolioSections = [
		{
			id: 'wnetrza',
			title: 'Wnętrza',
			images: [img07, img08, img09, img10, img11]
		},
		{
			id: 'oferty-mieszkan',
			title: 'Oferty Mieszkań',
			images: [] // To be added later
		},
		{
			id: 'branding',
			title: 'Branding',
			images: [colorsImg] // To be expanded
		},
		{
			id: 'plakaty',
			title: 'Plakaty',
			images: [] // To be added later
		},
		{
			id: 'wzory',
			title: 'Wzory',
			images: [] // To be added later
		},
		{
			id: 'postacie',
			title: 'Postacie',
			images: [] // To be added later
		},
		{
			id: 'rysunek',
			title: 'Rysunek',
			images: [] // To be added later
		},
		{
			id: 'fotografia',
			title: 'Fotografia',
			images: [] // To be added later
		},
		{
			id: 'grafika-koncepcyjna',
			title: 'Grafika Koncepcyjna',
			images: [] // To be added later
		}
	];

	// Colors
	const colors = {
		primary: '#27275B',
		accent: '#F32A61',
		secondary: '#1DA898',
		tertiary: '#F5848E'
	};

	let activeSection = $state('wnetrza');
	let scrollContainers = $state<{[key: string]: HTMLElement}>({});
	let autoScrollIntervals = $state<{[key: string]: number}>({});

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			const navHeight = 168; // Height of main layout navigation + portfolio navigation
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - navHeight;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

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
				rootMargin: '-100px 0px -50% 0px'
			}
		);

		portfolioSections.forEach((section) => {
			const element = document.getElementById(section.id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => observer.disconnect();
	});

	// Auto-scroll effect for carousels
	$effect(() => {
		if (typeof window === 'undefined') return;

		const startAutoScroll = (container: HTMLElement, sectionId: string) => {
			if (!container) return;

			// Initialize carousel at middle position (1/3 of total width)
			// This gives us buffer to loop in both directions
			const maxScroll = container.scrollWidth - container.clientWidth;
			const middlePosition = maxScroll / 3;
			container.scrollLeft = middlePosition;

			let isResetting = false;

			const scroll = () => {
				if (isResetting) return;

				const currentScroll = container.scrollLeft;
				// Reset at 2/3 point (after second set completes)
				const resetPoint = (maxScroll / 3) * 2;

				if (currentScroll >= resetPoint) {
					// Reset back to middle position (1/3 point) - seamless due to duplicated images
					isResetting = true;
					container.scrollLeft = middlePosition;
					// Small delay before resuming to ensure reset is complete
					setTimeout(() => {
						isResetting = false;
					}, 50);
				} else {
					// Scroll forward by 1 pixel
					container.scrollBy({ left: 1, behavior: 'auto' });
				}
			};

			// Start auto-scroll interval (60fps for smooth scrolling)
			const intervalId = window.setInterval(scroll, 16);
			autoScrollIntervals[sectionId] = intervalId;

			// Pause on hover
			const handleMouseEnter = () => {
				if (autoScrollIntervals[sectionId]) {
					clearInterval(autoScrollIntervals[sectionId]);
				}
			};

			// Resume on mouse leave
			const handleMouseLeave = () => {
				autoScrollIntervals[sectionId] = window.setInterval(scroll, 16);
			};

			container.addEventListener('mouseenter', handleMouseEnter);
			container.addEventListener('mouseleave', handleMouseLeave);

			// Store cleanup function for this container
			return () => {
				container.removeEventListener('mouseenter', handleMouseEnter);
				container.removeEventListener('mouseleave', handleMouseLeave);
			};
		};

		// Wait for DOM to be ready
		const cleanupFunctions: (() => void)[] = [];

		setTimeout(() => {
			portfolioSections.forEach((section) => {
				const container = scrollContainers[section.id];
				if (container && section.images.length > 0) {
					const cleanup = startAutoScroll(container, section.id);
					if (cleanup) cleanupFunctions.push(cleanup);
				}
			});
		}, 100);

		// Cleanup intervals and event listeners on unmount
		return () => {
			Object.values(autoScrollIntervals).forEach((intervalId) => {
				if (intervalId) clearInterval(intervalId);
			});
			cleanupFunctions.forEach((cleanup) => cleanup());
		};
	});
</script>

<svelte:head>
	<title>Portfolio - Pikastro</title>
	<meta name="description" content="Pełne portfolio projektów Pikastro - wnętrza, branding, grafika i więcej" />
</svelte:head>

<!-- Sticky Navigation -->
<nav class="sticky top-[80px] z-40 shadow-lg border-b-4" style="background: linear-gradient(135deg, {colors.primary} 0%, #1a1a3e 100%); border-bottom-color: {colors.accent}; backdrop-filter: blur(12px);">
	<div class="w-full overflow-x-auto scrollbar-hide py-4">
		<div class="flex gap-2 md:gap-3 justify-center min-w-max px-4 md:px-6">
			{#each portfolioSections as section}
				<button
					onclick={() => scrollToSection(section.id)}
					class="px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all duration-300 {activeSection === section.id ? 'text-white shadow-lg' : 'text-gray-300 hover:text-white'}"
					style={activeSection === section.id
						? `background-color: ${colors.accent};`
						: `background-color: transparent; border: 2px solid ${colors.accent}40;`}
					onmouseenter={(e) => {
						if (activeSection !== section.id) {
							e.currentTarget.style.backgroundColor = `${colors.accent}80`;
							e.currentTarget.style.color = 'white';
						}
					}}
					onmouseleave={(e) => {
						if (activeSection !== section.id) {
							e.currentTarget.style.backgroundColor = 'transparent';
							e.currentTarget.style.color = 'rgb(209, 213, 219)';
						}
					}}
				>
					{section.title}
				</button>
			{/each}
		</div>
	</div>
</nav>

<!-- Portfolio Sections -->
<main style="background: linear-gradient(180deg, {colors.primary} 0%, #1a1a3e 50%, {colors.primary} 100%);">
	{#each portfolioSections as section, index}
		<section
			id={section.id}
			class="relative py-12 md:py-16 overflow-hidden"
			style="background: linear-gradient(135deg,
				{index % 4 === 0 ? `${colors.primary}E6` :
				 index % 4 === 1 ? `${colors.secondary}20` :
				 index % 4 === 2 ? `${colors.accent}20` :
				 `${colors.tertiary}20`} 0%,
				transparent 100%);"
		>
			<!-- Section Header -->
			<div class="max-w-7xl mx-auto px-4 md:px-6 mb-8">
				<h2
					class="text-4xl md:text-5xl lg:text-6xl font-black text-white"
					style="font-family: 'Playfair Display', serif; text-shadow: 0 0 30px rgba(243, 42, 97, 0.5);"
				>
					{section.title}
				</h2>
				<div class="h-1 w-24 mt-4 rounded-full" style="background: linear-gradient(90deg, {colors.accent} 0%, {colors.secondary} 100%);"></div>
			</div>

			<!-- Horizontal Scrolling Carousel -->
			{#if section.images.length > 0}
				<div
					bind:this={scrollContainers[section.id]}
					class="horizontal-scroll-container pb-4"
					style="padding-left: max(1rem, calc((100vw - 80rem) / 2)); padding-right: max(1rem, calc((100vw - 80rem) / 2));"
				>
					<div class="flex gap-6 md:gap-8">
						{#each [...section.images, ...section.images, ...section.images] as image, imgIndex}
							<div
								class="flex-shrink-0 group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2"
								style="width: 400px; height: 500px; border-color: {colors.accent}40; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.3);"
							>
								<img
									src={image}
									alt="{section.title} - obraz {(imgIndex % section.images.length) + 1}"
									class="w-full h-full object-cover"
								/>
								<div
									class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									style="background: linear-gradient(180deg, transparent 0%, {colors.primary}E6 100%);"
								></div>
								<div
									class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
								>
									<p class="text-lg font-bold" style="color: {colors.accent};">{section.title} #{(imgIndex % section.images.length) + 1}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="max-w-7xl mx-auto px-4 md:px-6">
					<div
						class="border-4 border-dashed rounded-2xl p-12 text-center backdrop-blur-sm"
						style="border-color: {colors.accent}60; background: rgba(39, 39, 91, 0.3);"
					>
						<p class="text-xl text-white mb-4 font-bold">
							Sekcja w przygotowaniu
						</p>
						<p class="text-sm" style="color: {colors.tertiary};">
							Dodaj obrazy do folderu <code class="px-2 py-1 rounded" style="background-color: {colors.primary}; color: {colors.accent};">src/lib/assets/images/{section.id}/</code>
						</p>
					</div>
				</div>
			{/if}

			<!-- Decorative elements -->
			<div
				class="absolute -top-10 -right-10 w-40 h-40 rounded-full filter blur-3xl opacity-30 pointer-events-none animate-pulse-slow"
				style="background-color: {index % 3 === 0 ? colors.accent : index % 3 === 1 ? colors.secondary : colors.tertiary};"
			></div>
			<div
				class="absolute -bottom-10 -left-10 w-60 h-60 rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse-slow"
				style="background-color: {index % 3 === 0 ? colors.secondary : index % 3 === 1 ? colors.tertiary : colors.accent}; animation-delay: 1.5s;"
			></div>
		</section>

		<!-- Section Separator -->
		{#if index < portfolioSections.length - 1}
			<div class="w-full h-0.5" style="background: linear-gradient(90deg, {colors.accent} 0%, {colors.secondary} 50%, {colors.tertiary} 100%); opacity: 0.5;"></div>
		{/if}
	{/each}
</main>

<!-- Back to Top Button -->
<button
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
	class="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40 border-2"
	style="background: linear-gradient(135deg, {colors.accent} 0%, {colors.primary} 100%); border-color: {colors.secondary}; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.5);"
	aria-label="Powrót na górę"
>
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
	</svg>
</button>

<style>
	.horizontal-scroll-container {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
		scrollbar-color: #F32A61 rgba(39, 39, 91, 0.5);
	}

	.horizontal-scroll-container::-webkit-scrollbar {
		height: 10px;
	}

	.horizontal-scroll-container::-webkit-scrollbar-track {
		background: rgba(39, 39, 91, 0.5);
		border-radius: 5px;
	}

	.horizontal-scroll-container::-webkit-scrollbar-thumb {
		background: linear-gradient(90deg, #F32A61 0%, #1DA898 100%);
		border-radius: 5px;
		border: 2px solid rgba(39, 39, 91, 0.5);
	}

	.horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(90deg, #1DA898 0%, #F5848E 100%);
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
		0%, 100% {
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
</style>
