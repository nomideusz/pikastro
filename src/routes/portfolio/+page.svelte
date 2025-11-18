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

	let scrollContainers = $state<{[key: string]: HTMLElement}>({});
</script>

<svelte:head>
	<title>Portfolio - Pikastro</title>
	<meta name="description" content="Pełne portfolio projektów Pikastro - wnętrza, branding, grafika i więcej" />
</svelte:head>

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
						{#each section.images as image, imgIndex}
							<div
								class="flex-shrink-0 group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2"
								style="width: 400px; height: 500px; border-color: {colors.accent}40; box-shadow: 0 10px 30px rgba(243, 42, 97, 0.3);"
							>
								<img
									src={image}
									alt="{section.title} - obraz {imgIndex + 1}"
									class="w-full h-full object-cover"
								/>
								<div
									class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									style="background: linear-gradient(180deg, transparent 0%, {colors.primary}E6 100%);"
								></div>
								<div
									class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
								>
									<p class="text-lg font-bold" style="color: {colors.accent};">{section.title} #{imgIndex + 1}</p>
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
