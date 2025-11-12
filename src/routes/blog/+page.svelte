<script lang="ts">
	import colorsImg from '$lib/assets/images/colors.jpeg';
	import { extractColorsFromImage, assignColorRoles, type ColorPalette } from '$lib/utils/colorExtractor';

	// Color palette
	let colorPalette = $state<ColorPalette>({
		primary: '#27275b',
		accent: '#FB7185',
		secondary: '#10B981',
		success: '#10B981',
		tertiary: '#27275b'
	});

	// Extract colors from the colors image on mount
	$effect(() => {
		extractColorsFromImage(colorsImg, 5)
			.then((colors) => {
				if (colors.length > 0) {
					const roles = assignColorRoles(colors);
					colorPalette = roles;

					const root = document.documentElement.style;
					root.setProperty('--color-primary', colorPalette.primary);
					root.setProperty('--color-accent', colorPalette.accent);
					root.setProperty('--color-secondary', colorPalette.secondary);
				}
			})
			.catch((error) => {
				console.warn('Could not extract colors from image:', error);
			});
	});

	// SEO-optimized blog posts focused on "projektowanie wnętrz AI Kraków"
	const blogPosts = [
		{
			title: 'Projektowanie Wnętrz AI w Krakowie - Przyszłość Designu',
			slug: 'projektowanie-wnetrz-ai-krakow-przyszlosc-designu',
			excerpt: 'Odkryj jak sztuczna inteligencja rewolucjonizuje projektowanie wnętrz w Krakowie. AI + Design = szybsze realizacje i niższe koszty.',
			date: '2025-01-15',
			category: 'AI & Design',
			readTime: '5 min czytania',
			image: colorsImg,
			tags: ['projektowanie wnętrz AI', 'Kraków', 'design AI', 'technologia'],
			featured: true
		},
		{
			title: 'Jak AI Pomaga w Projektowaniu Mieszkań dla Młodych w Krakowie',
			slug: 'ai-projektowanie-mieszkan-mlodzi-krakow',
			excerpt: 'Pierwsze mieszkanie? Zobacz jak AI pomaga stworzyć funkcjonalną przestrzeń do pracy zdalnej i życia dla młodych profesjonalistów.',
			date: '2025-01-12',
			category: 'Poradniki',
			readTime: '7 min czytania',
			image: colorsImg,
			tags: ['pierwsze mieszkanie', 'młodzi nabywcy', 'Kraków', 'home office'],
			featured: true
		},
		{
			title: '10 Błędów Pierwszych Właścicieli Mieszkań - Przewodnik',
			slug: '10-bledow-pierwszych-wlascicieli-mieszkan',
			excerpt: 'Kupujesz pierwsze mieszkanie? Uniknij tych 10 najczęstszych błędów w projektowaniu i aranżacji wnętrz.',
			date: '2025-01-10',
			category: 'Poradniki',
			readTime: '8 min czytania',
			image: colorsImg,
			tags: ['poradnik', 'błędy', 'pierwsze mieszkanie', 'tips'],
			featured: false
		},
		{
			title: 'Kolorowe Wnętrza zamiast Beżu - Trendy 2025 w Krakowie',
			slug: 'kolorowe-wnetrza-zamiast-bezu-trendy-2025',
			excerpt: 'Dość beżowo-szarych wnętrz! Poznaj trendy kolorystyczne 2025 i dowiedz się jak wprowadzić odważne kolory do mieszkania.',
			date: '2025-01-08',
			category: 'Trendy',
			readTime: '6 min czytania',
			image: colorsImg,
			tags: ['trendy 2025', 'kolory', 'design', 'maximalism'],
			featured: false
		},
		{
			title: 'Smart Home dla Młodych - Inteligentne Rozwiązania',
			slug: 'smart-home-mlodych-inteligentne-rozwiazania',
			excerpt: 'Jak zintegrować smart home z designem? Praktyczny przewodnik po inteligentnych rozwiązaniach dla nowoczesnych mieszkań.',
			date: '2025-01-05',
			category: 'Technologia',
			readTime: '5 min czytania',
			image: colorsImg,
			tags: ['smart home', 'technologia', 'automatyka', 'IoT'],
			featured: false
		},
		{
			title: 'Cennik Projektowania Wnętrz w Krakowie 2025',
			slug: 'cennik-projektowania-wnetrz-krakow-2025',
			excerpt: 'Transparentny cennik usług projektowych w Krakowie. Dowiedz się ile kosztuje projekt wnętrza z AI i co wpływa na cenę.',
			date: '2025-01-03',
			category: 'Biznes',
			readTime: '4 min czytania',
			image: colorsImg,
			tags: ['cennik', 'Kraków', 'ceny', 'projektowanie'],
			featured: false
		}
	];

	let activeCategory = $state('wszystkie');

	const categories = ['wszystkie', 'AI & Design', 'Poradniki', 'Trendy', 'Technologia', 'Biznes'];

	let filteredPosts = $derived(activeCategory === 'wszystkie'
		? blogPosts
		: blogPosts.filter(post => post.category === activeCategory));

	$effect(() => {
		// Add scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !entry.target.classList.contains('animate-fade-in-up')) {
						entry.target.classList.add('animate-fade-in-up');
					}
				});
			},
			{ threshold: 0.1 }
		);

		document.querySelectorAll('.observe').forEach((el) => {
			const rect = el.getBoundingClientRect();
			const isInView = rect.top < window.innerHeight && rect.bottom > 0;
			if (isInView && !el.classList.contains('animate-fade-in-up')) {
				el.classList.add('animate-fade-in-up');
			}
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Blog - Projektowanie Wnętrz AI Kraków | Pikastro</title>
	<meta name="description" content="Blog o projektowaniu wnętrz z AI w Krakowie. Trendy, poradniki i inspiracje dla młodych nabywców pierwszych mieszkań. Ekspert designu AI." />
	<meta name="keywords" content="projektowanie wnętrz AI Kraków, blog design, trendy wnętrz 2025, smart home, pierwsze mieszkanie" />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[50vh] flex items-center text-white overflow-hidden" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
	<div class="absolute inset-0 z-[1]">
		<div class="absolute inset-0 opacity-60 transition-all duration-1000" style="background-color: {colorPalette.primary}"></div>
	</div>

	<div class="section relative z-20">
		<div class="max-w-5xl mx-auto text-center">
			<div class="mb-8 observe animate-fade-in-up">
				<p class="font-bold tracking-[0.3em] uppercase text-sm mb-6 neon-text" style="color: {colorPalette.accent}">📚 Blog</p>
				<h1 class="text-5xl md:text-7xl font-black mb-6 leading-[1.05]" style="font-family: 'Playfair Display', serif;">
					Inspiracje & Wiedza<br>
					<span style="color: {colorPalette.accent}">o Designie AI</span>
				</h1>
				<p class="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
					Poznaj trendy, praktyczne porady i sekrety projektowania wnętrz z wykorzystaniem AI
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Category Filter -->
<section class="section bg-white border-b border-gray-200">
	<div class="flex justify-center gap-3 flex-wrap observe">
		{#each categories as cat}
			<button
				onclick={() => activeCategory = cat}
				class="px-6 py-2 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeCategory === cat ? 'text-white shadow-lg' : 'bg-transparent text-gray-600 border-2 border-gray-200'}"
				style={activeCategory === cat ? `background-color: ${colorPalette.primary}; border-color: ${colorPalette.primary};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeCategory !== cat) { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeCategory !== cat) { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				{cat}
			</button>
		{/each}
	</div>
</section>

<!-- Featured Posts -->
{#if activeCategory === 'wszystkie'}
	<section class="section bg-gradient-to-br from-blue-50 to-white">
		<div class="text-center mb-16 observe">
			<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">⭐ Wyróżnione</p>
			<h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight" style="font-family: 'Playfair Display', serif;">
				<span style="color: {colorPalette.primary}">Najnowsze</span> Artykuły
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-16">
			{#each blogPosts.filter(p => p.featured) as post, i}
				<a href="/blog/{post.slug}" class="group observe hover-lift block" style="animation-delay: {i * 100}ms">
					<div class="bg-white rounded-2xl overflow-hidden border-2 border-blue-100 transition-all duration-300 hover:shadow-2xl" onmouseenter={(e) => e.currentTarget.style.borderColor = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.borderColor = 'rgb(243, 244, 246)'}>
						<div class="aspect-[16/9] bg-blue-100 relative overflow-hidden">
							<img
								src={post.image}
								alt={post.title}
								class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
							/>
							<div class="absolute inset-0 transition-all duration-500" style="background-color: {colorPalette.primary}; opacity: 0.2;" role="presentation"></div>
						</div>
						<div class="p-8">
							<div class="flex items-center gap-3 mb-4 flex-wrap">
								<span class="text-xs uppercase tracking-wider font-black px-3 py-1 rounded-full" style="background-color: {colorPalette.accent}; color: white;">
									{post.category}
								</span>
								<span class="text-xs text-gray-500">{post.date}</span>
								<span class="text-xs text-gray-500">• {post.readTime}</span>
							</div>
							<h3 class="text-2xl font-black mb-3 text-gray-900 group-hover:text-opacity-80 transition-colors" style="font-family: 'Playfair Display', serif;">
								{post.title}
							</h3>
							<p class="text-gray-600 leading-relaxed mb-4">
								{post.excerpt}
							</p>
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag}
									<span class="text-xs px-3 py-1 bg-blue-50 text-gray-700 rounded-full">
										#{tag}
									</span>
								{/each}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

<!-- All Posts -->
<section class="section bg-white">
	<div class="text-center mb-16 observe">
		<h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight" style="font-family: 'Playfair Display', serif;">
			{activeCategory === 'wszystkie' ? 'Wszystkie' : activeCategory}
			<span style="color: {colorPalette.primary}">Artykuły</span>
		</h2>
	</div>

	<div class="grid md:grid-cols-3 gap-8">
		{#each filteredPosts as post, i}
			<a href="/blog/{post.slug}" class="group observe hover-lift block" style="animation-delay: {i * 100}ms">
				<div class="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 transition-all duration-300 hover:shadow-xl" onmouseenter={(e) => e.currentTarget.style.borderColor = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.borderColor = 'rgb(243, 244, 246)'}>
					<div class="aspect-[16/9] bg-blue-100 relative overflow-hidden">
						<img
							src={post.image}
							alt={post.title}
							class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
						/>
						<div class="absolute inset-0 transition-all duration-500" style="background-color: {colorPalette.primary}; opacity: 0.15;" role="presentation"></div>
					</div>
					<div class="p-6">
						<div class="flex items-center gap-3 mb-3 flex-wrap text-xs">
							<span class="uppercase tracking-wider font-black px-3 py-1 rounded-full" style="background-color: {colorPalette.secondary}20; color: {colorPalette.secondary};">
								{post.category}
							</span>
							<span class="text-gray-500">{post.date}</span>
						</div>
						<h3 class="text-xl font-black mb-2 text-gray-900 group-hover:text-opacity-80 transition-colors" style="font-family: 'Playfair Display', serif;">
							{post.title}
						</h3>
						<p class="text-gray-600 text-sm leading-relaxed mb-3">
							{post.excerpt}
						</p>
						<div class="flex items-center justify-between">
							<span class="text-xs text-gray-500">{post.readTime}</span>
							<span class="text-xs font-bold transition-colors" style="color: {colorPalette.primary}">Czytaj więcej →</span>
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<!-- Newsletter CTA -->
<section class="section text-white relative overflow-hidden" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
	<div class="absolute inset-0 opacity-60 transition-all duration-1000" style="background-color: {colorPalette.primary}"></div>

	<div class="max-w-3xl mx-auto text-center relative z-10 observe">
		<div class="text-6xl mb-6">📬</div>
		<h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Bądź na Bieżąco
		</h2>
		<p class="text-xl mb-8 text-gray-100 leading-relaxed">
			Otrzymuj najnowsze artykuły, trendy i porady prosto na swoją skrzynkę
		</p>
		<form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
			<input
				type="email"
				placeholder="Twój adres email"
				class="flex-1 px-6 py-4 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 transition-all"
			/>
			<button
				type="submit"
				class="px-8 py-4 font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
				style="background-color: {colorPalette.accent}; color: white;"
			>
				Zapisz się
			</button>
		</form>
		<p class="text-xs text-gray-300 mt-4">Bez spamu. Tylko wartościowe treści. Możesz zrezygnować w każdej chwili.</p>
	</div>
</section>
