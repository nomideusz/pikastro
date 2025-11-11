<script lang="ts">
	// Portfolio data - this can be moved to a separate file later
	const projects = [
		{
			title: 'Projektowanie Wnętrz Mieszkania',
			description: 'Kompleksowe rozwiązanie aranżacyjne dla młodej pary - połączenie stylu nowoczesnego z funkcjonalnymi rozwiązaniami smart home.',
			technologies: ['AutoCAD', 'SketchUp', 'AI Design Tools', 'V-Ray'],
			image: '/placeholder-project-1.jpg',
			category: 'wnętrza'
		},
		{
			title: 'Identyfikacja Wizualna Kawiarni',
			description: 'Pełna identyfikacja wizualna dla nowoczesnej kawiarni w Krakowie, łącząca branding z projektem przestrzeni.',
			technologies: ['Adobe Creative Suite', 'AI Branding Tools', 'Brand Guidelines'],
			image: '/placeholder-project-2.jpg',
			category: 'grafika'
		},
		{
			title: 'Projekt Przestrzeni Biurowej Startup',
			description: 'Innowacyjne rozwiązanie dla przestrzeni coworkingowej - połączenie ergonomii, designu i rozwiązań technologicznych.',
			technologies: ['3D Modeling', 'AI Space Planning', 'Sustainable Materials'],
			image: '/placeholder-project-3.jpg',
			category: 'wnętrza'
		}
	];

	const services = [
		{
			title: 'Projektowanie Wnętrz',
			description: 'Kompleksowe projektowanie przestrzeni mieszkalnych i komercyjnych z uwzględnieniem ergonomii i nowoczesnych rozwiązań.',
			icon: '🏠',
			features: ['Optymalizacja układu pomieszczeń', 'Aranżacja elementów wystroju', 'Wizualizacje 3D', 'Konsultacje ergonomiczne']
		},
		{
			title: 'Grafika Komputerowa',
			description: 'Profesjonalne usługi graficzne od identyfikacji wizualnej po materiały reklamowe i dekoracje wnętrz.',
			icon: '🎨',
			features: ['Identyfikacja wizualna firm', 'Grafiki na produkty tekstylne', 'Materiały reklamowe', 'Dekoracje spersonalizowane']
		},
		{
			title: 'Rozwiązania AI',
			description: 'Wykorzystanie sztucznej inteligencji w procesie projektowym dla szybszych i bardziej innowacyjnych rozwiązań.',
			icon: '🤖',
			features: ['Automatyczne generowanie koncepcji', 'Analiza trendów designu', 'Optymalizacja kosztów', 'Prototypowanie błyskawiczne']
		}
	];
</script>

<!-- Hero Section -->
<section class="section gradient-bg text-white rounded-2xl mb-8">
	<div class="text-center py-20">
		<h1 class="text-5xl font-bold mb-6 leading-tight">
			Odważne wnętrza.<br>
			Innowacyjna grafika.<br>
			<span class="gradient-text">Sztuczna inteligencja.</span>
		</h1>
		<p class="text-xl mb-8 max-w-3xl mx-auto opacity-90">
			Kompleksowe projektowanie wnętrz i usług graficznych dla młodych ludzi,
			którzy cenią nowoczesne rozwiązania i odważne, kolorowe aranżacje.
			Łączę wiedzę architektoniczną z umiejętnościami graficznymi i narzędziami AI.
		</p>
		<div class="flex flex-col sm:flex-row gap-6 justify-center">
			<a href="#portfolio" class="btn">Zobacz moje projekty</a>
			<a href="#kontakt" class="btn-secondary">
				Skontaktuj się ze mną
			</a>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="omnie" class="section bg-white">
	<div class="grid md:grid-cols-2 gap-12 items-center">
		<div>
			<h2 class="text-4xl font-bold gradient-text mb-6">O mnie</h2>
			<p class="text-gray-700 mb-4 text-lg">
				Jestem projektantką wnętrz i grafiki z pasją do tworzenia funkcjonalnych,
				estetycznych rozwiązań w branży wnętrzarskiej i graficznej. Moje podejście łączy
				wiedzę inżynierską, umiejętności plastyczne i wyczucie estetyczne.
			</p>
			<p class="text-gray-700 mb-6 text-lg">
				Szczególną uwagę poświęcam młodym ludziom w wieku 20-30 lat, którzy szukają
				odważnych, kolorowych aranżacji. Wykorzystuję sztuczną inteligencję, aby przyspieszyć
				i ulepszyć proces projektowy, oferując innowacyjne rozwiązania w atrakcyjnych cenach.
			</p>
			<div class="grid grid-cols-2 gap-6">
				<div class="text-center p-6 card rounded-xl">
					<div class="text-3xl font-bold gradient-text">25+</div>
					<div class="text-sm text-gray-600 mt-2">Zrealizowanych projektów</div>
				</div>
				<div class="text-center p-6 card rounded-xl">
					<div class="text-3xl font-bold gradient-text">3+</div>
					<div class="text-sm text-gray-600 mt-2">Lata doświadczenia</div>
				</div>
			</div>
		</div>
		<div class="card p-8 rounded-xl">
			<h3 class="text-2xl font-semibold gradient-text mb-6">Moja przewaga konkurencyjna</h3>
			<ul class="space-y-4 text-gray-700">
				<li class="flex items-start">
					<span class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 mt-2"></span>
					<div>
						<strong class="gradient-text">Integracja podejścia inżynierskiego z designem</strong><br>
						Połączenie wiedzy technicznej z projektowaniem wnętrz i grafiką
					</div>
				</li>
				<li class="flex items-start">
					<span class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 mt-2"></span>
					<div>
						<strong class="gradient-text">Wykorzystanie sztucznej inteligencji</strong><br>
						Główny wyróżnik rynkowy - innowacyjne narzędzia w procesie projektowym
					</div>
				</li>
				<li class="flex items-start">
					<span class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 mt-2"></span>
					<div>
						<strong class="gradient-text">Kompleksowa obsługa</strong><br>
						Projektowanie wnętrz połączone z identyfikacją wizualną w spójną koncepcję
					</div>
				</li>
				<li class="flex items-start">
					<span class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 mt-2"></span>
					<div>
						<strong class="gradient-text">Specjalizacja dla młodego pokolenia</strong><br>
						Odważne, kolorowe aranżacje dostosowane do współczesnych potrzeb
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>

<!-- Services Section -->
<section id="oferta" class="section bg-gradient-to-br from-purple-50 to-pink-50">
	<div class="text-center mb-16">
		<h2 class="text-4xl font-bold gradient-text mb-4">Oferta usług</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto">
			Kompleksowe rozwiązania łączące projektowanie wnętrz z grafiką komputerową,
			wzbogacone wykorzystaniem sztucznej inteligencji
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8">
		{#each services as service}
			<div class="card p-8 text-center group hover:scale-105 transition-transform duration-300">
				<div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
				<h3 class="text-2xl font-bold gradient-text mb-4">{service.title}</h3>
				<p class="text-gray-600 mb-6">{service.description}</p>
				<ul class="text-left space-y-2">
					{#each service.features as feature}
						<li class="flex items-center text-gray-700">
							<span class="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex-shrink-0"></span>
							{feature}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Portfolio Section -->
<section id="portfolio" class="section bg-white">
	<div class="text-center mb-16">
		<h2 class="text-4xl font-bold gradient-text mb-4">Portfolio</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto">
			Wybrane realizacje łączące projektowanie wnętrz z identyfikacją wizualną.
			Każdy projekt to unikalne rozwiązanie dostosowane do indywidualnych potrzeb klientów.
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8">
		{#each projects as project}
			<div class="card overflow-hidden group hover:scale-105 transition-all duration-300">
				<div class="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
					<span class="text-gray-500 text-lg font-medium">Wizualizacja projektu</span>
					<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-600">
						{project.category === 'wnętrza' ? 'Wnętrza' : 'Grafika'}
					</div>
				</div>
				<div class="p-6">
					<h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">{project.title}</h3>
					<p class="text-gray-600 mb-4">{project.description}</p>
					<div class="flex flex-wrap gap-2">
						{#each project.technologies as tech}
							<span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full font-medium">
								{tech}
							</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="text-center mt-16">
		<a href="#kontakt" class="btn">Zobacz więcej projektów</a>
	</div>
</section>

<!-- Contact Section -->
<section id="kontakt" class="section gradient-bg text-white">
	<div class="text-center">
		<h2 class="text-4xl font-bold mb-4">Rozpocznijmy współpracę</h2>
		<p class="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
			Masz pomysł na projekt? Szukasz odważnych, nowoczesnych rozwiązań?
			Skontaktuj się ze mną - razem stworzymy coś wyjątkowego.
		</p>

		<div class="grid md:grid-cols-3 gap-8 mb-12">
			<div class="card p-8 text-center bg-white/10 backdrop-blur-sm border border-white/20">
				<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-3xl">✉</span>
				</div>
				<h3 class="text-xl font-semibold mb-3">Email</h3>
				<p class="opacity-90">kontakt@pikastro.pl</p>
			</div>
			<div class="card p-8 text-center bg-white/10 backdrop-blur-sm border border-white/20">
				<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-3xl">📍</span>
				</div>
				<h3 class="text-xl font-semibold mb-3">Lokalizacja</h3>
				<p class="opacity-90">Kraków<br><small class="text-sm">oraz współpraca zdalna</small></p>
			</div>
			<div class="card p-8 text-center bg-white/10 backdrop-blur-sm border border-white/20">
				<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-3xl">💼</span>
				</div>
				<h3 class="text-xl font-semibold mb-3">Specjalizacja</h3>
				<p class="opacity-90">Projektowanie wnętrz<br><small class="text-sm">dla młodego pokolenia</small></p>
			</div>
		</div>

		<div class="flex justify-center space-x-8">
			<a href="#" class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
				<span class="text-xl">📘</span>
			</a>
			<a href="#" class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
				<span class="text-xl">📷</span>
			</a>
			<a href="#" class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
				<span class="text-xl">💼</span>
			</a>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-gradient-to-r from-purple-900 via-pink-900 to-teal-900 py-12 px-4">
	<div class="max-w-6xl mx-auto text-center text-white">
		<div class="mb-6">
			<img src="/logo.png" alt="Pikastro Logo" class="h-12 w-auto mx-auto mb-4 brightness-0 invert" />
		</div>
		<p class="opacity-80 mb-4">&copy; 2025 Pikastro. Wszelkie prawa zastrzeżone.</p>
		<p class="text-sm opacity-60">Projektowanie wnętrz • Grafika komputerowa • Sztuczna inteligencja</p>
	</div>
</footer>

