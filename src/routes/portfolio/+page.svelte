<script lang="ts">
	import { onMount } from 'svelte';
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

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			const navHeight = 80; // Height of sticky navigation
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - navHeight;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
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
</script>

<svelte:head>
	<title>Portfolio - Pikastro</title>
	<meta name="description" content="Pełne portfolio projektów Pikastro - wnętrza, branding, grafika i więcej" />
</svelte:head>

<!-- Sticky Navigation -->
<nav class="sticky top-0 z-50 bg-white shadow-lg border-b-4" style="border-bottom-color: {colors.accent};">
	<div class="max-w-7xl mx-auto px-4 md:px-6 py-4">
		<div class="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
			<a href="/" class="text-xl font-black whitespace-nowrap mr-4" style="color: {colors.primary}; font-family: 'Playfair Display', serif;">
				Portfolio
			</a>
			<div class="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
				{#each portfolioSections as section}
					<button
						onclick={() => scrollToSection(section.id)}
						class="px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all duration-300 {activeSection === section.id ? 'text-white shadow-lg' : 'text-gray-600 hover:text-white'}"
						style={activeSection === section.id
							? `background-color: ${colors.primary};`
							: `background-color: transparent; border: 2px solid ${colors.primary}20;`}
						onmouseenter={(e) => {
							if (activeSection !== section.id) {
								e.currentTarget.style.backgroundColor = colors.primary;
								e.currentTarget.style.color = 'white';
							}
						}}
						onmouseleave={(e) => {
							if (activeSection !== section.id) {
								e.currentTarget.style.backgroundColor = 'transparent';
								e.currentTarget.style.color = 'rgb(75, 85, 99)';
							}
						}}
					>
						{section.title}
					</button>
				{/each}
			</div>
		</div>
	</div>
</nav>

<!-- Portfolio Sections -->
<main class="bg-white">
	{#each portfolioSections as section, index}
		<section
			id={section.id}
			class="relative py-12 md:py-16 overflow-hidden"
			style="background: {index % 2 === 0 ? '#ffffff' : '#f9fafb'};"
		>
			<!-- Section Header -->
			<div class="max-w-7xl mx-auto px-4 md:px-6 mb-8">
				<h2
					class="text-4xl md:text-5xl lg:text-6xl font-black"
					style="font-family: 'Playfair Display', serif; color: {colors.primary};"
				>
					{section.title}
				</h2>
				<div class="h-1 w-24 mt-4 rounded-full" style="background-color: {colors.accent};"></div>
			</div>

			<!-- Horizontal Scrolling Carousel -->
			{#if section.images.length > 0}
				<div
					bind:this={scrollContainers[section.id]}
					class="horizontal-scroll-container pb-4"
					style="padding-left: max(1rem, calc((100vw - 80rem) / 2)); padding-right: max(1rem, calc((100vw - 80rem) / 2));"
				>
					<div class="flex gap-6 md:gap-8">
						{#each section.images as image, imgIndex}
							<div
								class="flex-shrink-0 group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
								style="width: 400px; height: 500px;"
							>
								<img
									src={image}
									alt="{section.title} - obraz {imgIndex + 1}"
									class="w-full h-full object-cover"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								></div>
								<div
									class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
								>
									<p class="text-lg font-bold">{section.title} #{imgIndex + 1}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="max-w-7xl mx-auto px-4 md:px-6">
					<div
						class="border-4 border-dashed rounded-2xl p-12 text-center"
						style="border-color: {colors.primary}40;"
					>
						<p class="text-xl text-gray-500 mb-4">
							Sekcja w przygotowaniu
						</p>
						<p class="text-sm text-gray-400">
							Dodaj obrazy do folderu <code class="bg-gray-100 px-2 py-1 rounded">src/lib/assets/images/{section.id}/</code>
						</p>
					</div>
				</div>
			{/if}

			<!-- Decorative elements -->
			<div
				class="absolute -top-10 -right-10 w-40 h-40 rounded-full filter blur-3xl opacity-20 pointer-events-none"
				style="background-color: {index % 3 === 0 ? colors.accent : index % 3 === 1 ? colors.secondary : colors.tertiary};"
			></div>
		</section>

		<!-- Section Separator -->
		{#if index < portfolioSections.length - 1}
			<div class="w-full h-1" style="background: linear-gradient(to right, {colors.accent}, {colors.secondary}, {colors.tertiary});"></div>
		{/if}
	{/each}
</main>

<!-- Back to Top Button -->
<button
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
	class="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40"
	style="background-color: {colors.primary};"
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
		scrollbar-color: #F32A61 #f3f4f6;
	}

	.horizontal-scroll-container::-webkit-scrollbar {
		height: 8px;
	}

	.horizontal-scroll-container::-webkit-scrollbar-track {
		background: #f3f4f6;
		border-radius: 4px;
	}

	.horizontal-scroll-container::-webkit-scrollbar-thumb {
		background: #F32A61;
		border-radius: 4px;
	}

	.horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
		background: #27275B;
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
</style>
