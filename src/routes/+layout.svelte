<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { extractColorsFromImage, assignColorRoles, type ColorPalette } from '$lib/utils/colorExtractor';
	import colorsImg from '$lib/assets/images/colors.jpeg';

	// Color palette extracted from colors image - Eclectic Maximalism
	let colorPalette = $state<ColorPalette>({
		primary: '#27275B',      // Deep Navy Blue
		accent: '#F32A61',       // Hot Magenta
		secondary: '#1DA898',    // Turquoise
		success: '#F2A23E',      // Golden Orange
		tertiary: '#F5848E'      // Coral Pink
	});

	// Extract colors from the colors image on mount
	$effect(() => {
		extractColorsFromImage(colorsImg, 5)
			.then((colors) => {
				if (colors.length > 0) {
					const roles = assignColorRoles(colors);
					colorPalette = roles;
				}
			})
			.catch((error) => {
				console.warn('Could not extract colors from image:', error);
			});
	});

	// Helper function to get the correct link path
	function getNavLink(href: string): string {
		// If we're on the main page, use hash anchors
		if ($page.url.pathname === '/') {
			return href;
		}
		// If we're on a subpage, prefix with / for main page navigation
		return '/' + href;
	}

	let { children } = $props();
	let isMenuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Pikastro - Projektowanie Wnętrz AI | Grafika | Kraków</title>
	<meta name="description" content="Projektowanie wnętrz i grafika z AI dla młodych (20-30 lat). Odważne, kolorowe aranżacje mieszkań zamiast beżowo-szarych. Kompleksowa obsługa w Krakowie - szybko i w atrakcyjnych cenach." />
</svelte:head>

<!-- Navigation -->
<nav class="sticky top-0 z-50 transition-all duration-300 shadow-sm" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="flex justify-between items-center py-6">
			<div class="flex items-center">
				<a href="/" class="flex items-center group px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-50">
					<img src="/logo.png" alt="Pikastro Logo" class="h-12 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				<a href="/o-mnie" class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]">
					O mnie
					<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style="background-color: var(--color-accent);"></span>
				</a>
				<a href={getNavLink('#beforeafter')} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]">
					Metamorfozy
					<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style="background-color: var(--color-accent);"></span>
				</a>
				<a href={getNavLink('#proces')} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]">
					Proces
					<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style="background-color: var(--color-accent);"></span>
				</a>
				<a href={getNavLink('#cennik')} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]">
					Ceny
					<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style="background-color: var(--color-accent);"></span>
				</a>
				<a href={getNavLink('#portfolio')} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]">
					Portfolio
					<span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style="background-color: var(--color-accent);"></span>
				</a>
				<a href={getNavLink('#kontakt')} class="px-6 py-2.5 text-white transition-all duration-300 text-sm tracking-wide uppercase font-bold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105" style="background-color: var(--color-accent);">
					Kontakt
				</a>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={() => isMenuOpen = !isMenuOpen}
					class="text-gray-700 focus:outline-none transition-colors hover:text-[var(--color-primary)]"
					aria-label="Toggle menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						{#if isMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<div class="md:hidden pb-6 mt-2 animate-fade-in-up" style="border-top: 1px solid rgba(0, 0, 0, 0.08);">
				<div class="flex flex-col space-y-4 pt-6">
					<a href="/o-mnie" onclick={() => isMenuOpen = false} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase hover:text-[var(--color-primary)]">O mnie</a>
					<a href={getNavLink('#beforeafter')} onclick={() => isMenuOpen = false} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase hover:text-[var(--color-primary)]">Metamorfozy</a>
					<a href={getNavLink('#proces')} onclick={() => isMenuOpen = false} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase hover:text-[var(--color-primary)]">Proces</a>
					<a href={getNavLink('#cennik')} onclick={() => isMenuOpen = false} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase hover:text-[var(--color-primary)]">Ceny</a>
					<a href={getNavLink('#portfolio')} onclick={() => isMenuOpen = false} class="text-gray-700 transition-colors font-bold text-sm tracking-wide uppercase hover:text-[var(--color-primary)]">Portfolio</a>
					<a href={getNavLink('#kontakt')} onclick={() => isMenuOpen = false} class="px-6 py-3 text-white text-center transition-all duration-300 text-sm tracking-wide uppercase font-bold rounded-lg transform hover:scale-105" style="background-color: var(--color-accent);">Kontakt</a>
				</div>
			</div>
		{/if}
	</div>
</nav>

{@render children()}
