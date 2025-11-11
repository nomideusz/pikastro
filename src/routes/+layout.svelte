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
<nav class="bg-white shadow-lg sticky top-0 z-50">
	<div class="max-w-6xl mx-auto px-4">
		<div class="flex justify-between items-center py-4">
			<div class="flex items-center space-x-4">
				<img src="/logo.png" alt="Pikastro Logo" class="h-12 w-auto" />
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				<a href="#omnie" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">O mnie</a>
				<a href="#oferta" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Oferta</a>
				<a href="#portfolio" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Portfolio</a>
				<a href="#kontakt" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Kontakt</a>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={() => isMenuOpen = !isMenuOpen}
					class="text-gray-700 hover:text-purple-600 focus:outline-none"
					aria-label="Toggle menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<div class="md:hidden pb-4 border-t border-gray-200 mt-4">
				<div class="flex flex-col space-y-4 pt-4">
					<a href="#omnie" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-purple-600 transition-colors font-medium">O mnie</a>
					<a href="#oferta" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Oferta</a>
					<a href="#portfolio" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Portfolio</a>
					<a href="#kontakt" onclick={() => isMenuOpen = false} class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Kontakt</a>
				</div>
			</div>
		{/if}
	</div>
</nav>

{@render children()}
