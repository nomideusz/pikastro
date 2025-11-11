<script lang="ts">
	import '../app.css';

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
<nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="flex justify-between items-center py-6">
			<div class="flex items-center">
				<a href="/" class="flex items-center group">
					<img src="/logo.png" alt="Pikastro Logo" class="h-12 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-12">
				<a href="#omnie" class="text-gray-700 hover:text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group">
					O mnie
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#27275b] to-[#FB7185] transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="#oferta" class="text-gray-700 hover:text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group">
					Oferta
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#27275b] to-[#FB7185] transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="#portfolio" class="text-gray-700 hover:text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group">
					Portfolio
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#27275b] to-[#FB7185] transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="#kontakt" class="px-6 py-2.5 bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white hover:from-[#1e1e4a] hover:to-[#e55b6f] transition-all duration-300 text-sm tracking-wide uppercase font-bold rounded-lg shadow-md hover:shadow-lg">
					Kontakt
				</a>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={() => isMenuOpen = !isMenuOpen}
					class="text-gray-700 hover:text-gray-900 focus:outline-none transition-colors"
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
			<div class="md:hidden pb-6 border-t border-gray-100 mt-2 animate-fade-in-up">
				<div class="flex flex-col space-y-4 pt-6">
					<a href="#omnie" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase">O mnie</a>
					<a href="#oferta" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase">Oferta</a>
					<a href="#portfolio" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase">Portfolio</a>
					<a href="#kontakt" onclick={() => isMenuOpen = false} class="px-6 py-3 bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white text-center hover:from-[#1e1e4a] hover:to-[#e55b6f] transition-all duration-300 text-sm tracking-wide uppercase font-bold rounded-lg">Kontakt</a>
				</div>
			</div>
		{/if}
	</div>
</nav>

{@render children()}
