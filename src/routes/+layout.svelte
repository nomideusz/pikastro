<script lang="ts">
	import '../app.css';

	let { children } = $props();
	let isMenuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Pikastro - Projektowanie Wnętrz i Grafiki</title>
	<meta name="description" content="Kompleksowe projektowanie wnętrz i usług graficznych z wykorzystaniem sztucznej inteligencji. Odważne, kolorowe aranżacje dla młodych ludzi." />
</svelte:head>

<!-- Navigation -->
<nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="flex justify-between items-center py-6">
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3 group">
					<img src="/logo.png" alt="Pikastro Logo" class="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
					<span class="text-2xl font-bold tracking-tight hidden sm:block" style="font-family: 'Playfair Display', serif;">Pikastro</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-12">
				<a href="#omnie" class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide uppercase relative group">
					O mnie
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="#oferta" class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide uppercase relative group">
					Oferta
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="#portfolio" class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide uppercase relative group">
					Portfolio
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="#kontakt" class="px-6 py-2.5 bg-gray-900 text-white hover:bg-amber-600 transition-all duration-300 text-sm tracking-wide uppercase font-medium">
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
					<a href="#omnie" onclick={() => isMenuOpen = false} class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide uppercase">O mnie</a>
					<a href="#oferta" onclick={() => isMenuOpen = false} class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide uppercase">Oferta</a>
					<a href="#portfolio" onclick={() => isMenuOpen = false} class="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide uppercase">Portfolio</a>
					<a href="#kontakt" onclick={() => isMenuOpen = false} class="px-6 py-3 bg-gray-900 text-white text-center hover:bg-amber-600 transition-all duration-300 text-sm tracking-wide uppercase font-medium">Kontakt</a>
				</div>
			</div>
		{/if}
	</div>
</nav>

{@render children()}
