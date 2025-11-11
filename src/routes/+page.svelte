<script lang="ts">
	// Portfolio data - professionally curated projects
	const projects = [
		{
			title: 'Apartament w Stylu Skandynawskim',
			description: 'Minimalistyczna elegancja połączona z funkcjonalnością. Projekt 85m² mieszkania dla młodej rodziny w sercu Krakowa.',
			technologies: ['AutoCAD', 'SketchUp', 'V-Ray', '3ds Max'],
			image: '/placeholder-project-1.jpg',
			category: 'wnętrza',
			year: '2024'
		},
		{
			title: 'Identyfikacja Wizualna Studia',
			description: 'Kompleksowy branding dla studia architektury - od logo po materiały firmowe i przestrzeń biurową.',
			technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Print Design'],
			image: '/placeholder-project-2.jpg',
			category: 'grafika',
			year: '2024'
		},
		{
			title: 'Przestrzeń Coworkingowa',
			description: 'Nowoczesne biuro kolaboracyjne dla startupów technologicznych. 300m² przestrzeni kreatywnej.',
			technologies: ['3D Modeling', 'Space Planning', 'Smart Solutions'],
			image: '/placeholder-project-3.jpg',
			category: 'wnętrza',
			year: '2023'
		},
		{
			title: 'Dom Jednorodzinny Modern',
			description: 'Projekt domu o powierzchni 180m² łączący nowoczesną architekturę z naturalnymi materiałami.',
			technologies: ['ArchiCAD', 'Lumion', 'Sustainable Design'],
			image: '/placeholder-project-4.jpg',
			category: 'wnętrza',
			year: '2023'
		},
		{
			title: 'Kawiarnia Concept Store',
			description: 'Design wnętrza i identyfikacja wizualna autorskiej kawiarni z galerią sztuki.',
			technologies: ['Interior Design', 'Branding', 'Visual Identity'],
			image: '/placeholder-project-5.jpg',
			category: 'grafika',
			year: '2024'
		},
		{
			title: 'Loft Industrialny',
			description: 'Adaptacja przestrzeni poprzemysłowej na nowoczesne mieszkanie z otwartym planem.',
			technologies: ['Adaptive Reuse', 'Industrial Design', 'BIM'],
			image: '/placeholder-project-6.jpg',
			category: 'wnętrza',
			year: '2023'
		}
	];

	const services = [
		{
			title: 'Projektowanie Wnętrz',
			description: 'Kompleksowe projekty mieszkalne i komercyjne - od koncepcji po nadzór wykonawczy.',
			icon: '◻',
			features: [
				'Analiza przestrzeni i potrzeb',
				'Wizualizacje 3D fotorealistyczne',
				'Dobór materiałów i kolorystyki',
				'Nadzór autorski'
			]
		},
		{
			title: 'Identyfikacja Wizualna',
			description: 'Spójny branding i materiały graficzne dla firm i przestrzeni komercyjnych.',
			icon: '○',
			features: [
				'Projektowanie logo i identyfikacji',
				'Brand guidelines',
				'Materiały marketingowe',
				'Grafika środowiskowa'
			]
		},
		{
			title: 'Doradztwo Projektowe',
			description: 'Profesjonalne konsultacje i optymalizacja projektów architektonicznych.',
			icon: '△',
			features: [
				'Audyt przestrzeni',
				'Optymalizacja układu',
				'Dobór rozwiązań technicznych',
				'Strategia realizacji'
			]
		}
	];

	let activeFilter = $state('wszystkie');

	$effect(() => {
		// Add scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-fade-in-up');
					}
				});
			},
			{ threshold: 0.1 }
		);

		document.querySelectorAll('.observe').forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

<!-- Hero Section -->
<section class="relative min-h-[90vh] flex items-center gradient-bg text-white overflow-hidden">
	<div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
	<div class="section relative z-10">
		<div class="max-w-5xl">
			<div class="mb-8 observe">
				<p class="text-amber-400 font-medium tracking-[0.3em] uppercase text-sm mb-6">Portfolio & Studio</p>
				<h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1]" style="font-family: 'Playfair Display', serif;">
					Projektowanie<br>
					Przestrzeni<br>
					<span class="text-amber-400">& Identyfikacji</span>
				</h1>
			</div>
			<p class="text-xl md:text-2xl mb-12 max-w-3xl leading-relaxed text-gray-200 observe" style="font-family: 'Inter', sans-serif; font-weight: 300;">
				Tworzę harmonijne przestrzenie i spójne identyfikacje wizualne.
				Łączę architektoniczne wykształcenie z pasją do designu graficznego.
			</p>
			<div class="flex flex-col sm:flex-row gap-6 observe">
				<a href="#portfolio" class="btn">
					Zobacz Portfolio
				</a>
				<a href="#kontakt" class="btn-secondary">
					Skontaktuj się
				</a>
			</div>
		</div>
	</div>
	<div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</section>

<!-- Stats Section -->
<section class="section bg-gray-50 border-y border-gray-200">
	<div class="grid grid-cols-2 md:grid-cols-4 gap-12">
		<div class="text-center observe">
			<div class="text-5xl font-bold mb-3 text-gray-900" style="font-family: 'Playfair Display', serif;">50+</div>
			<div class="text-sm text-gray-600 uppercase tracking-wider">Zrealizowanych projektów</div>
		</div>
		<div class="text-center observe">
			<div class="text-5xl font-bold mb-3 text-gray-900" style="font-family: 'Playfair Display', serif;">5+</div>
			<div class="text-sm text-gray-600 uppercase tracking-wider">Lat doświadczenia</div>
		</div>
		<div class="text-center observe">
			<div class="text-5xl font-bold mb-3 text-gray-900" style="font-family: 'Playfair Display', serif;">100%</div>
			<div class="text-sm text-gray-600 uppercase tracking-wider">Zadowolonych klientów</div>
		</div>
		<div class="text-center observe">
			<div class="text-5xl font-bold mb-3 text-gray-900" style="font-family: 'Playfair Display', serif;">15+</div>
			<div class="text-sm text-gray-600 uppercase tracking-wider">Nagród branżowych</div>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="omnie" class="section bg-white">
	<div class="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
		<div class="observe">
			<p class="text-amber-600 font-medium tracking-[0.3em] uppercase text-sm mb-4">O mnie</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight" style="font-family: 'Playfair Display', serif;">
				Design który<br>
				<span class="italic">zmienia</span><br>
				przestrzenie
			</h2>
			<div class="space-y-6 text-gray-600 leading-relaxed text-lg">
				<p>
					Jestem projektantką wnętrz i graficzką z wykształceniem architektonicznym.
					Specjalizuję się w tworzeniu przestrzeni mieszkalnych i komercyjnych oraz
					kompleksowych identyfikacji wizualnych.
				</p>
				<p>
					Moje projekty charakteryzuje minimalizm, funkcjonalność i dbałość o detal.
					Wierzę, że dobre projektowanie to połączenie estetyki z ergonomią i
					zrównoważonym podejściem do materiałów.
				</p>
				<p class="quote-block">
					„Architektura to harmonia pomiędzy przestrzenią, światłem i człowiekiem."
				</p>
			</div>
		</div>

		<div class="space-y-8 observe">
			<div class="aspect-[4/5] bg-gray-100 relative overflow-hidden group">
				<div class="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-amber-600/20"></div>
				<div class="absolute bottom-0 left-0 right-0 p-8 text-white">
					<p class="text-sm tracking-wider uppercase mb-2">Studio</p>
					<p class="text-2xl font-bold" style="font-family: 'Playfair Display', serif;">Pikastro Design</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-6">
				<div class="p-6 border border-gray-200 hover:border-amber-600 transition-colors duration-300">
					<div class="text-3xl font-bold mb-2 text-gray-900" style="font-family: 'Playfair Display', serif;">
						15+
					</div>
					<div class="text-sm text-gray-600 uppercase tracking-wider">
						Nagród projektowych
					</div>
				</div>
				<div class="p-6 border border-gray-200 hover:border-amber-600 transition-colors duration-300">
					<div class="text-3xl font-bold mb-2 text-gray-900" style="font-family: 'Playfair Display', serif;">
						5k m²
					</div>
					<div class="text-sm text-gray-600 uppercase tracking-wider">
						Zaprojektowanej przestrzeni
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section id="oferta" class="section bg-gray-50">
	<div class="text-center mb-20 observe">
		<p class="text-amber-600 font-medium tracking-[0.3em] uppercase text-sm mb-4">Usługi</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Kompleksowa<br>obsługa projektowa
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Od koncepcji po realizację - pełne wsparcie w procesie projektowania wnętrz i tworzenia identyfikacji wizualnej.
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8 lg:gap-12">
		{#each services as service, i}
			<div class="bg-white p-10 lg:p-12 hover-lift observe group border border-gray-100" style="animation-delay: {i * 100}ms">
				<div class="mb-8">
					<div class="text-6xl font-light text-gray-300 group-hover:text-amber-600 transition-colors duration-500" style="font-family: 'Playfair Display', serif;">
						{service.icon}
					</div>
				</div>
				<h3 class="text-2xl lg:text-3xl font-bold mb-4 text-gray-900" style="font-family: 'Playfair Display', serif;">
					{service.title}
				</h3>
				<p class="text-gray-600 mb-8 leading-relaxed">
					{service.description}
				</p>
				<ul class="space-y-3">
					{#each service.features as feature}
						<li class="flex items-start text-gray-700">
							<span class="w-1.5 h-1.5 bg-amber-600 mt-2.5 mr-3 flex-shrink-0"></span>
							<span class="text-sm">{feature}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Portfolio Section -->
<section id="portfolio" class="section bg-white">
	<div class="text-center mb-20 observe">
		<p class="text-amber-600 font-medium tracking-[0.3em] uppercase text-sm mb-4">Portfolio</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Wybrane<br>realizacje
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
			Każdy projekt to indywidualna historia połączenia formy, funkcji i charakteru klienta.
		</p>

		<!-- Filter -->
		<div class="flex justify-center gap-4 flex-wrap">
			<button
				onclick={() => activeFilter = 'wszystkie'}
				class="px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 {activeFilter === 'wszystkie' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600 hover:text-gray-900 border border-gray-200'}"
			>
				Wszystkie
			</button>
			<button
				onclick={() => activeFilter = 'wnętrza'}
				class="px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 {activeFilter === 'wnętrza' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600 hover:text-gray-900 border border-gray-200'}"
			>
				Wnętrza
			</button>
			<button
				onclick={() => activeFilter = 'grafika'}
				class="px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 {activeFilter === 'grafika' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600 hover:text-gray-900 border border-gray-200'}"
			>
				Grafika
			</button>
		</div>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
		{#each projects.filter(p => activeFilter === 'wszystkie' || p.category === activeFilter) as project, i}
			<div class="group observe hover-lift" style="animation-delay: {i * 100}ms">
				<div class="aspect-[4/5] bg-gray-100 relative overflow-hidden mb-6">
					<div class="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-amber-600/10 group-hover:from-gray-900/30 group-hover:to-amber-600/30 transition-all duration-500"></div>
					<div class="absolute top-6 right-6 bg-white px-4 py-2 text-xs font-medium tracking-wider uppercase">
						{project.year}
					</div>
					<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
						<div class="text-white text-center">
							<svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
							</svg>
							<span class="text-sm uppercase tracking-wider">Zobacz projekt</span>
						</div>
					</div>
				</div>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-xs uppercase tracking-wider text-amber-600 font-medium">
							{project.category === 'wnętrza' ? 'Wnętrza' : 'Grafika'}
						</span>
					</div>
					<h3 class="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors" style="font-family: 'Playfair Display', serif;">
						{project.title}
					</h3>
					<p class="text-gray-600 leading-relaxed">
						{project.description}
					</p>
					<div class="flex flex-wrap gap-2 pt-2">
						{#each project.technologies.slice(0, 3) as tech}
							<span class="text-xs px-3 py-1 border border-gray-200 text-gray-600 uppercase tracking-wider">
								{tech}
							</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Testimonial Section -->
<section class="section bg-gray-900 text-white">
	<div class="max-w-4xl mx-auto text-center observe">
		<div class="mb-12">
			<svg class="w-16 h-16 mx-auto text-amber-600 opacity-50" fill="currentColor" viewBox="0 0 24 24">
				<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
			</svg>
		</div>
		<blockquote class="text-2xl md:text-3xl lg:text-4xl font-light mb-8 leading-relaxed" style="font-family: 'Playfair Display', serif;">
			Współpraca z Pikastro to była czysta przyjemność. Profesjonalizm, kreatywność i perfekcyjne
			wyczucie naszych potrzeb zaowocowały przestrzenią, która przekroczyła nasze oczekiwania.
		</blockquote>
		<div class="text-amber-400 font-medium">
			<p class="mb-1">Anna Kowalska</p>
			<p class="text-sm text-gray-400">CEO, TechStart Solutions</p>
		</div>
	</div>
</section>

<!-- Contact Section -->
<section id="kontakt" class="section bg-white">
	<div class="grid lg:grid-cols-2 gap-16 lg:gap-24">
		<div class="observe">
			<p class="text-amber-600 font-medium tracking-[0.3em] uppercase text-sm mb-4">Kontakt</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900" style="font-family: 'Playfair Display', serif;">
				Rozpocznijmy<br>
				<span class="italic">współpracę</span>
			</h2>
			<p class="text-xl text-gray-600 mb-12 leading-relaxed">
				Masz pomysł na projekt? Chcesz stworzyć wyjątkową przestrzeń lub odświeżyć identyfikację wizualną?
				Skontaktuj się ze mną - razem znajdziemy idealne rozwiązanie.
			</p>

			<div class="space-y-8">
				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 border border-gray-200 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
						</svg>
					</div>
					<div>
						<p class="text-sm uppercase tracking-wider text-gray-500 mb-1">Email</p>
						<a href="mailto:kontakt@pikastro.pl" class="text-lg text-gray-900 hover:text-amber-600 transition-colors">
							kontakt@pikastro.pl
						</a>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 border border-gray-200 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
						</svg>
					</div>
					<div>
						<p class="text-sm uppercase tracking-wider text-gray-500 mb-1">Lokalizacja</p>
						<p class="text-lg text-gray-900">Kraków, Polska</p>
						<p class="text-sm text-gray-500">Współpraca zdalna w całej Polsce</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 border border-gray-200 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<div>
						<p class="text-sm uppercase tracking-wider text-gray-500 mb-1">Dostępność</p>
						<p class="text-lg text-gray-900">Pn - Pt, 9:00 - 17:00</p>
					</div>
				</div>
			</div>

			<div class="flex space-x-4 mt-12">
				<a href="#" class="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
					<span class="text-sm font-medium">in</span>
				</a>
				<a href="#" class="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
					<span class="text-sm font-medium">be</span>
				</a>
				<a href="#" class="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
					<span class="text-sm font-medium">ig</span>
				</a>
			</div>
		</div>

		<div class="bg-gray-50 p-10 lg:p-12 observe">
			<form class="space-y-6">
				<div>
					<label for="name" class="block text-sm uppercase tracking-wider text-gray-700 mb-2">Imię i nazwisko</label>
					<input
						type="text"
						id="name"
						class="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-white"
						placeholder="Jan Kowalski"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm uppercase tracking-wider text-gray-700 mb-2">Email</label>
					<input
						type="email"
						id="email"
						class="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-white"
						placeholder="jan@example.com"
					/>
				</div>

				<div>
					<label for="project" class="block text-sm uppercase tracking-wider text-gray-700 mb-2">Typ projektu</label>
					<select
						id="project"
						class="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-white"
					>
						<option>Projektowanie wnętrz</option>
						<option>Identyfikacja wizualna</option>
						<option>Konsultacje</option>
						<option>Inne</option>
					</select>
				</div>

				<div>
					<label for="message" class="block text-sm uppercase tracking-wider text-gray-700 mb-2">Wiadomość</label>
					<textarea
						id="message"
						rows="5"
						class="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-white resize-none"
						placeholder="Opowiedz o swoim projekcie..."
					></textarea>
				</div>

				<button type="submit" class="w-full btn">
					Wyślij wiadomość
				</button>
			</form>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-gray-900 text-white py-16 px-6 md:px-12">
	<div class="max-w-7xl mx-auto">
		<div class="grid md:grid-cols-3 gap-12 mb-12">
			<div>
				<h3 class="text-2xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">Pikastro</h3>
				<p class="text-gray-400 leading-relaxed">
					Studio projektowe specjalizujące się w projektowaniu wnętrz i identyfikacji wizualnej.
				</p>
			</div>
			<div>
				<h4 class="text-sm uppercase tracking-wider mb-4 text-gray-400">Nawigacja</h4>
				<ul class="space-y-2">
					<li><a href="#omnie" class="text-gray-400 hover:text-white transition-colors">O mnie</a></li>
					<li><a href="#oferta" class="text-gray-400 hover:text-white transition-colors">Oferta</a></li>
					<li><a href="#portfolio" class="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
					<li><a href="#kontakt" class="text-gray-400 hover:text-white transition-colors">Kontakt</a></li>
				</ul>
			</div>
			<div>
				<h4 class="text-sm uppercase tracking-wider mb-4 text-gray-400">Kontakt</h4>
				<ul class="space-y-2 text-gray-400">
					<li>kontakt@pikastro.pl</li>
					<li>Kraków, Polska</li>
				</ul>
			</div>
		</div>
		<div class="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
			<p>&copy; 2025 Pikastro. Wszystkie prawa zastrzeżone.</p>
		</div>
	</div>
</footer>
