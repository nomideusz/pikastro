<script lang="ts">
	// Before/After showcase data
	const beforeAfterProjects = [
		{
			title: 'Salon z Kuchnią - Metamorfoza AI',
			before: '/placeholder-before-1.jpg',
			after: '/placeholder-after-1.jpg',
			description: 'Transformacja beżowego salonu w kolorową, funkcjonalną przestrzeń z AI',
			aiFeatures: ['Optymalizacja układu', 'Dobór kolorystyki', 'Smart storage']
		},
		{
			title: 'Sypialnia Młodych Profesjonalistów',
			before: '/placeholder-before-2.jpg',
			after: '/placeholder-after-2.jpg',
			description: 'Z pustego pokoju w nowoczesną sypialnię z home office',
			aiFeatures: ['Zarządzanie przestrzenią', 'Wielofunkcyjność', 'Oświetlenie mood']
		},
		{
			title: 'Biuro Home Office',
			before: '/placeholder-before-3.jpg',
			after: '/placeholder-after-3.jpg',
			description: 'Kreacja przestrzeni do pracy zdalnej',
			aiFeatures: ['Ergonomia', 'Akustyka', 'Smart tech integration']
		}
	];

	// Process steps
	const processSteps = [
		{
			number: '01',
			title: 'Konsultacja & Brief',
			description: 'Zbieramy informacje o Twoich potrzebach, stylu życia i budżecie. AI analizuje podobne projekty.',
			duration: '1-2 dni',
			icon: '💬'
		},
		{
			number: '02',
			title: 'AI Prototyping',
			description: 'Generujemy 5-10 wariantów aranżacji z wykorzystaniem AI. Szybka iteracja koncepcji.',
			duration: '2-3 dni',
			icon: '🤖'
		},
		{
			number: '03',
			title: 'Refinement',
			description: 'Wybierasz ulubiony wariant. Dopracowujemy detale, materiały, kolory według Twoich preferencji.',
			duration: '3-5 dni',
			icon: '✨'
		},
		{
			number: '04',
			title: 'Dokumentacja',
			description: 'Otrzymujesz pełną dokumentację projektową, wizualizacje 3D, listę zakupów i kontakty do wykonawców.',
			duration: '2-3 dni',
			icon: '📐'
		}
	];

	// Pricing packages
	const pricingPackages = [
		{
			name: 'AI Express',
			price: '1,500 - 2,500 zł',
			description: 'Szybka koncepcja dla jednego pomieszczenia',
			features: [
				'Konsultacja online',
				'3-5 wariantów AI',
				'Wizualizacje 3D (3 ujęcia)',
				'Lista zakupów',
				'Wsparcie email przez 2 tyg'
			],
			ideal: 'Idealne dla: Pokój, sypialnia, home office',
			popular: false
		},
		{
			name: 'AI Complete',
			price: '3,500 - 6,000 zł',
			description: 'Kompleksowy projekt mieszkania',
			features: [
				'Konsultacja stacjonarna',
				'8-10 wariantów AI',
				'Wizualizacje 3D (10 ujęć)',
				'Pełna dokumentacja',
				'Lista zakupów + shopping assistance',
				'Wsparcie przez 1 miesiąc',
				'1 rewizja gratis'
			],
			ideal: 'Idealne dla: Mieszkanie 2-3 pokoje, apartament',
			popular: true
		},
		{
			name: 'AI Premium',
			price: 'od 8,000 zł',
			description: 'Pełen zakres + identyfikacja wizualna',
			features: [
				'Wszystko z AI Complete',
				'Brand identity dla przestrzeni',
				'Custom grafiki i dekoracje',
				'Nadzór nad realizacją',
				'Unlimited rewizje',
				'Wsparcie przez 3 miesiące'
			],
			ideal: 'Idealne dla: Domy, biura, lokale komercyjne',
			popular: false
		}
	];

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
			description: 'Kompleksowe projektowanie i aranżacja przestrzeni mieszkalnych i komercyjnych z wykorzystaniem AI.',
			icon: '◻',
			features: [
				'Projektowanie układu pomieszczeń',
				'Optymalizacja ergonomii i funkcjonalności',
				'Aranżacja mieszkań, domów i apartamentów',
				'Przestrzenie komercyjne (biura, hotele)',
				'Graficzne dekoracje wnętrz'
			]
		},
		{
			title: 'Grafika Komputerowa',
			description: 'Pełen zakres usług graficznych - od identyfikacji wizualnej po materiały marketingowe.',
			icon: '○',
			features: [
				'Identyfikacja wizualna dla firm',
				'Grafiki na produkty tekstylne',
				'Materiały reklamowe i digital marketing',
				'Plakaty i dekoracje spersonalizowane'
			]
		},
		{
			title: 'Technologia AI',
			description: 'Innowacyjne wykorzystanie sztucznej inteligencji w procesie projektowym dla szybszych rezultatów.',
			icon: '△',
			features: [
				'Szybkie prototypowanie koncepcji',
				'Optymalizacja kosztów projektu',
				'Automatyczne generowanie wariantów',
				'Efektywność czasowa i budżetowa'
			]
		}
	];

	let activeFilter = $state('wszystkie');
	let activeBeforeAfter = $state(0);
	let sliderPosition = $state(50); // percentage for before/after slider

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

<!-- Hero Section with AI Visualization -->
<section class="relative min-h-[90vh] flex items-center gradient-bg text-white overflow-hidden">
	<!-- Animated AI Network Background -->
	<div class="absolute inset-0">
		<div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
		<!-- AI Neural Network Lines -->
		<svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#FB7185;stop-opacity:0.6" />
					<stop offset="50%" style="stop-color:#10B981;stop-opacity:0.6" />
					<stop offset="100%" style="stop-color:#27275b;stop-opacity:0.6" />
				</linearGradient>
			</defs>
			<!-- Animated connecting lines -->
			<line x1="10%" y1="20%" x2="30%" y2="40%" stroke="url(#lineGradient)" stroke-width="2" class="animate-pulse-slow" />
			<line x1="30%" y1="40%" x2="50%" y2="30%" stroke="url(#lineGradient)" stroke-width="2" class="animate-pulse-slow" style="animation-delay: 0.5s" />
			<line x1="50%" y1="30%" x2="70%" y2="50%" stroke="url(#lineGradient)" stroke-width="2" class="animate-pulse-slow" style="animation-delay: 1s" />
			<line x1="70%" y1="50%" x2="90%" y2="35%" stroke="url(#lineGradient)" stroke-width="2" class="animate-pulse-slow" style="animation-delay: 1.5s" />
			<line x1="20%" y1="70%" x2="40%" y2="85%" stroke="url(#lineGradient)" stroke-width="2" class="animate-pulse-slow" style="animation-delay: 2s" />
			<line x1="60%" y1="75%" x2="80%" y2="80%" stroke="url(#lineGradient)" stroke-width="2" class="animate-pulse-slow" style="animation-delay: 2.5s" />
			<!-- AI Nodes -->
			<circle cx="10%" cy="20%" r="8" fill="#FB7185" class="animate-pulse-slow" />
			<circle cx="30%" cy="40%" r="6" fill="#10B981" class="animate-pulse-slow" style="animation-delay: 0.3s" />
			<circle cx="50%" cy="30%" r="10" fill="#27275b" class="animate-pulse-slow neon-glow" style="animation-delay: 0.6s" />
			<circle cx="70%" cy="50%" r="7" fill="#FB7185" class="animate-pulse-slow" style="animation-delay: 0.9s" />
			<circle cx="90%" cy="35%" r="5" fill="#10B981" class="animate-pulse-slow" style="animation-delay: 1.2s" />
			<circle cx="20%" cy="70%" r="6" fill="#27275b" class="animate-pulse-slow" style="animation-delay: 1.5s" />
			<circle cx="80%" cy="80%" r="8" fill="#FB7185" class="animate-pulse-slow" style="animation-delay: 1.8s" />
		</svg>
	</div>

	<!-- Floating gradient blobs -->
	<div class="absolute top-20 right-20 w-72 h-72 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
	<div class="absolute bottom-20 left-20 w-96 h-96 bg-[#27275b] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style="animation-delay: 1s;"></div>
	<div class="absolute top-1/2 left-1/2 w-80 h-80 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style="animation-delay: 2s;"></div>

	<div class="section relative z-10">
		<div class="max-w-5xl">
			<div class="mb-8 observe">
				<p class="text-[#FB7185] font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text">🤖 AI × Architektura × Grafika</p>
				<h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05]" style="font-family: 'Playfair Display', serif;">
					<span class="block">Dość beżu.</span>
					<span class="block">Czas na <span class="bg-gradient-to-r from-[#FB7185] via-[#10B981] to-[#27275b] bg-clip-text text-transparent">kolor!</span></span>
				</h1>
				<p class="text-2xl md:text-3xl font-bold mb-4 text-white/90 leading-tight">
					AI × Design = Twoje wymarzone wnętrze
				</p>
			</div>
			<p class="text-xl md:text-2xl mb-8 max-w-3xl leading-relaxed text-gray-100 observe" style="font-family: 'Inter', sans-serif; font-weight: 400;">
				Zobacz <span class="text-[#10B981] font-bold">10 wersji swojego wnętrza</span> zanim zdecydujesz.
				Prototypowanie w godziny, nie tygodnie. <span class="text-[#FB7185] font-bold neon-text">Szybciej. Odważniej. Taniej.</span>
			</p>

			<!-- Value Props -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 observe max-w-3xl">
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="text-[#10B981] font-black text-lg">8-13 dni</div>
					<div class="text-white/80 text-sm">vs. 4-6 tygodni</div>
				</div>
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="text-[#FB7185] font-black text-lg neon-text">5-10 wariantów</div>
					<div class="text-white/80 text-sm">do wyboru z AI</div>
				</div>
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="text-[#10B981] font-black text-lg">Od 1,500 zł</div>
					<div class="text-white/80 text-sm">jeden pokój</div>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row gap-6 observe">
				<a href="#beforeafter" class="btn animate-float">
					Zobacz Metamorfozy
				</a>
				<a href="#cennik" class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg hover:bg-white hover:text-[#27275b] transition-all duration-300 shadow-lg hover:shadow-2xl font-bold tracking-wide uppercase text-sm">
					Sprawdź Ceny
				</a>
			</div>
		</div>
	</div>
	<div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-[#FB7185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</section>

<!-- Before/After Showcase Section -->
<section id="beforeafter" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="text-center mb-20 observe">
		<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">✨ Metamorfozy AI</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Przed i Po<br><span class="gradient-text">Transformacji z AI</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Zobacz jak AI pomaga tworzyć kolorowe, funkcjonalne przestrzenie zamiast beżowo-szarych wnętrz
		</p>
	</div>

	<div class="relative z-10">
		<!-- Main Before/After Slider -->
		<div class="max-w-5xl mx-auto mb-16 observe">
			<div class="relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
				<!-- Before Image -->
				<div class="absolute inset-0">
					<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
						<div class="text-center p-8">
							<p class="text-6xl mb-4">📷</p>
							<p class="text-gray-600 font-bold">BEFORE</p>
							<p class="text-sm text-gray-500 mt-2">Placeholder - Zdjęcie przed</p>
						</div>
					</div>
				</div>

				<!-- After Image with slider -->
				<div class="absolute inset-0" style="clip-path: inset(0 {100 - sliderPosition}% 0 0)">
					<div class="w-full h-full bg-gradient-to-br from-blue-400 via-rose-400 to-emerald-400 flex items-center justify-center">
						<div class="text-center p-8">
							<p class="text-6xl mb-4">🎨</p>
							<p class="text-white font-bold">AFTER - AI Design</p>
							<p class="text-sm text-white/80 mt-2">Placeholder - Projekt po AI</p>
						</div>
					</div>
				</div>

				<!-- Slider Handle -->
				<div class="absolute inset-y-0 z-20" style="left: {sliderPosition}%">
					<div class="absolute inset-y-0 w-1 bg-white shadow-lg"></div>
					<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-move hover:scale-110 transition-transform">
						<svg class="w-6 h-6 text-[#27275b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
						</svg>
					</div>
				</div>

				<!-- Slider Input -->
				<input
					type="range"
					min="0"
					max="100"
					bind:value={sliderPosition}
					class="absolute inset-0 w-full h-full opacity-0 cursor-move z-10"
				/>
			</div>

			<!-- Project Info -->
			<div class="mt-8 text-center">
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif;">
					{beforeAfterProjects[activeBeforeAfter].title}
				</h3>
				<p class="text-gray-600 mb-6">{beforeAfterProjects[activeBeforeAfter].description}</p>
				<div class="flex justify-center gap-3 flex-wrap">
					{#each beforeAfterProjects[activeBeforeAfter].aiFeatures as feature}
						<span class="px-4 py-2 bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white text-sm font-bold rounded-lg">
							🤖 {feature}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Project Thumbnails -->
		<div class="grid md:grid-cols-3 gap-6 observe">
			{#each beforeAfterProjects as project, i}
				<button
					onclick={() => activeBeforeAfter = i}
					class="relative aspect-[4/3] rounded-xl overflow-hidden border-4 transition-all duration-300 {activeBeforeAfter === i ? 'border-[#FB7185] shadow-2xl shadow-[#FB7185]/30 scale-105' : 'border-gray-200 hover:border-[#27275b]'}"
				>
					<div class="absolute inset-0 bg-gradient-to-r from-gray-300 to-blue-300 flex items-center justify-center">
						<p class="text-sm font-bold text-gray-700">{project.title}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="section bg-gradient-to-r from-blue-50 via-rose-50 to-emerald-50 border-y border-blue-100">
	<div class="grid grid-cols-2 md:grid-cols-4 gap-12">
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">50+</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Zrealizowanych projektów</div>
		</div>
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">5+</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Lat doświadczenia</div>
		</div>
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">100%</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Zadowolonych klientów</div>
		</div>
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">15+</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Nagród branżowych</div>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="omnie" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
		<div class="observe">
			<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">⭐ O mnie</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight" style="font-family: 'Playfair Display', serif;">
				Design który<br>
				<span class="italic gradient-text">zmienia</span><br>
				przestrzenie
			</h2>
			<div class="space-y-6 text-gray-600 leading-relaxed text-lg">
				<p>
					Jestem projektantką wnętrz i graficzką z wykształceniem architektonicznym.
					Łączę inżynierską wiedzę techniczną z umiejętnościami graficznymi i plastycznymi,
					wykorzystując zaawansowane narzędzia oparte na sztucznej inteligencji.
				</p>
				<p>
					<strong class="text-[#27275b]">Moja przewaga konkurencyjna:</strong> Unikalne połączenie trzech kompetencji -
					podejścia inżynierskiego, talentu plastycznego i technologii AI. To pozwala mi tworzyć
					funkcjonalne, estetyczne rozwiązania szybciej i w atrakcyjnych cenach.
				</p>
				<p>
					Specjalizuję się w projektach dla <strong class="text-[#FB7185]">młodych ludzi (20-30 lat)</strong> -
					odważnych nabywców pierwszych mieszkań, którzy cenią kolorowe aranżacje, przestrzenie do pracy zdalnej
					i rozwiązania smart home, zamiast stonowanych beżowo-szarych wnętrz.
				</p>
				<p class="quote-block">
					„Połączenie wiedzy technicznej, kreatywności i AI tworzy nową jakość projektowania."
				</p>
			</div>
		</div>

		<div class="space-y-8 observe">
			<div class="aspect-[4/5] bg-gradient-to-br from-blue-100 via-rose-100 to-emerald-100 relative overflow-hidden group">
				<div class="absolute inset-0 bg-gradient-to-br from-[#27275b]/20 to-[#FB7185]/20"></div>
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-center p-8">
						<div class="text-6xl mb-4">🏠✨</div>
						<p class="text-lg font-bold text-gray-900 mb-2">Dla Klientów</p>
						<p class="text-sm text-gray-700">Indywidualnych • Deweloperów • Startupów</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-6">
				<div class="p-6 border-2 border-blue-200 hover:border-[#27275b] transition-colors duration-300 rounded-xl neon-glow">
					<div class="text-3xl font-black mb-2 gradient-text" style="font-family: 'Playfair Display', serif;">
						AI
					</div>
					<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">
						Technologia przyszłości
					</div>
				</div>
				<div class="p-6 border-2 border-blue-200 hover:border-[#FB7185] transition-colors duration-300 rounded-xl">
					<div class="text-3xl font-black mb-2 gradient-text" style="font-family: 'Playfair Display', serif;">
						20-30
					</div>
					<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">
						Lat - grupa docelowa
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section id="oferta" class="section bg-gradient-to-br from-blue-50 via-white to-rose-50 relative overflow-hidden">
	<div class="absolute top-20 left-20 w-64 h-64 bg-emerald-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
	<div class="text-center mb-20 observe relative z-10">
		<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">💼 Usługi</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Kompleksowa<br><span class="gradient-text">obsługa projektowa</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Od koncepcji po realizację - pełne wsparcie w procesie projektowania wnętrz i tworzenia identyfikacji wizualnej.
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
		{#each services as service, i}
			<div class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 hover:border-[#FB7185] rounded-2xl hover:shadow-2xl hover:shadow-[#FB7185]/20" style="animation-delay: {i * 100}ms">
				<div class="mb-8">
					<div class="text-6xl font-light gradient-text transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12" style="font-family: 'Playfair Display', serif;">
						{service.icon}
					</div>
				</div>
				<h3 class="text-2xl lg:text-3xl font-black mb-4 text-gray-900 group-hover:text-[#27275b] transition-colors" style="font-family: 'Playfair Display', serif;">
					{service.title}
				</h3>
				<p class="text-gray-600 mb-8 leading-relaxed">
					{service.description}
				</p>
				<ul class="space-y-3">
					{#each service.features as feature}
						<li class="flex items-start text-gray-700">
							<span class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"></span>
							<span class="text-sm">{feature}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Process Section -->
<section id="proces" class="section gradient-bg text-white relative overflow-hidden">
	<div class="absolute top-10 right-10 w-96 h-96 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
	<div class="absolute bottom-10 left-10 w-96 h-96 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 1.5s;"></div>

	<div class="text-center mb-20 observe relative z-10">
		<p class="text-[#FB7185] font-black tracking-[0.3em] uppercase text-sm mb-4 neon-text">⚙️ Jak to działa</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Proces Projektowania<br><span class="text-[#10B981]">z Wykorzystaniem AI</span>
		</h2>
		<p class="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
			Połączenie ludzkiej kreatywności i mocy AI dla najlepszych rezultatów w najkrótszym czasie
		</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
		{#each processSteps as step, i}
			<div class="observe group" style="animation-delay: {i * 150}ms">
				<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 hover:border-[#FB7185] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FB7185]/30 hover:scale-105">
					<!-- Step Number -->
					<div class="mb-6">
						<div class="text-8xl font-black opacity-20 leading-none gradient-text" style="font-family: 'Playfair Display', serif;">
							{step.number}
						</div>
						<div class="text-5xl -mt-8 mb-4">{step.icon}</div>
					</div>

					<!-- Step Content -->
					<h3 class="text-2xl font-black mb-3 text-white group-hover:text-[#FB7185] transition-colors" style="font-family: 'Playfair Display', serif;">
						{step.title}
					</h3>
					<p class="text-gray-200 mb-4 leading-relaxed">
						{step.description}
					</p>
					<div class="flex items-center gap-2 text-[#10B981] font-bold text-sm">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						{step.duration}
					</div>
				</div>

				<!-- Connecting Arrow (except for last item) -->
				{#if i < processSteps.length - 1}
					<div class="hidden lg:block absolute top-1/2 -right-4 z-20">
						<svg class="w-8 h-8 text-[#FB7185] animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
						</svg>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Total Time Banner -->
	<div class="mt-16 text-center observe">
		<div class="inline-block bg-white/10 backdrop-blur-sm px-12 py-6 rounded-2xl border-2 border-white/20">
			<p class="text-sm uppercase tracking-wider text-gray-300 mb-2">Całkowity czas realizacji</p>
			<p class="text-4xl font-black gradient-text" style="font-family: 'Playfair Display', serif;">8-13 dni roboczych</p>
			<p class="text-sm text-gray-300 mt-2">vs. tradycyjne 4-6 tygodni</p>
		</div>
	</div>
</section>

<!-- Manifesto / Why Section -->
<section class="section bg-gradient-to-br from-blue-50 via-white to-rose-50 relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="max-w-4xl mx-auto relative z-10">
		<div class="text-center mb-16 observe">
			<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">💡 Nasza Filozofia</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				<span class="gradient-text">Wierzymy</span>, że design może być...
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-16 observe">
			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">⚡</div>
				<h3 class="text-2xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">Szybki I Dopracowany</h3>
				<p class="text-gray-600 leading-relaxed">
					AI nie zastępuje designera - wzmacnia go. Generujemy warianty w godziny, a potem dopracowujemy każdy detal ręcznie.
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">🎨</div>
				<h3 class="text-2xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">Kolorowy I Profesjonalny</h3>
				<p class="text-gray-600 leading-relaxed">
					Zero beżowo-szarych nudnych wnętrz. Ale też zero chaosu - każdy kolor ma swoje miejsce i funkcję.
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">🚀</div>
				<h3 class="text-2xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">Odważny I Funkcjonalny</h3>
				<p class="text-gray-600 leading-relaxed">
					Projektujemy przestrzenie, które wyróżniają się wizualnie, ale przede wszystkim - działają dla Ciebie każdego dnia.
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">💰</div>
				<h3 class="text-2xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">Dostępny I Wysokiej Jakości</h3>
				<p class="text-gray-600 leading-relaxed">
					AI oszczędza nam czas, więc możemy oferować Ci atrakcyjne ceny bez kompromisów w jakości wykonania.
				</p>
			</div>
		</div>

		<!-- FAQ Quick Hits -->
		<div class="bg-gradient-to-r from-[#27275b] to-[#1e3a5f] p-10 lg:p-12 rounded-2xl text-white observe">
			<h3 class="text-3xl font-black mb-8 text-center" style="font-family: 'Playfair Display', serif;">
				Najczęstsze pytania
			</h3>

			<div class="space-y-6">
				<div class="border-l-4 border-[#FB7185] pl-6">
					<p class="font-bold text-xl mb-2 text-[#FB7185] neon-text">"Czy AI to nie tandetnie?"</p>
					<p class="text-gray-200 leading-relaxed">
						Nie, jeśli ma <strong>inżyniera i designera przy sterach</strong>. AI to narzędzie - jak pędzel dla malarza.
						W moich rękach generuje propozycje, ale każdy projekt przechodzi przez ludzką kurację i dopracowanie.
					</p>
				</div>

				<div class="border-l-4 border-[#10B981] pl-6">
					<p class="font-bold text-xl mb-2 text-[#10B981]">"Ile to kosztuje?"</p>
					<p class="text-gray-200 leading-relaxed">
						<strong>Mniej niż myślisz.</strong> Bo AI oszczędza nam czas, a Tobie pieniądze.
						Jeden pokój od 1,500 zł, mieszkanie 2-3 pokoje od 3,500 zł. Zero ukrytych kosztów.
					</p>
				</div>

				<div class="border-l-4 border-[#FB7185] pl-6">
					<p class="font-bold text-xl mb-2 text-[#FB7185] neon-text">"Czy to naprawdę działa?"</p>
					<p class="text-gray-200 leading-relaxed">
						<strong>50+ zrealizowanych projektów mówi samo za siebie.</strong> Pierwsze studio w Krakowie,
						które połączyło architekturę × grafikę × AI. Sprawdź metamorfozy poniżej.
					</p>
				</div>

				<div class="border-l-4 border-[#10B981] pl-6">
					<p class="font-bold text-xl mb-2 text-[#10B981]">"Dla kogo to jest?"</p>
					<p class="text-gray-200 leading-relaxed">
						Dla <strong>młodych ludzi (20-30 lat)</strong>, którzy kupują pierwsze mieszkanie i chcą przestrzeń
						do pracy zdalnej, smart home, kolorowe aranżacje - zamiast beżowo-szarych wnętrz rodem z showroomu.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Pricing Section -->
<section id="cennik" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>

	<div class="text-center mb-20 observe relative z-10">
		<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">💰 Przejrzyste Ceny</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Wybierz<br><span class="gradient-text">Idealny Pakiet</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Transparentne ceny bez ukrytych kosztów. AI pozwala nam oferować atrakcyjne stawki przy zachowaniu najwyższej jakości
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10 max-w-6xl mx-auto">
		{#each pricingPackages as pkg, i}
			<div class="observe relative" style="animation-delay: {i * 150}ms">
				<!-- Popular Badge -->
				{#if pkg.popular}
					<div class="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
						<div class="bg-gradient-to-r from-[#FB7185] to-[#27275b] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg neon-glow">
							⭐ Najpopularniejszy
						</div>
					</div>
				{/if}

				<div class="bg-white p-8 lg:p-10 rounded-2xl border-2 transition-all duration-300 h-full flex flex-col {pkg.popular ? 'border-[#FB7185] shadow-2xl shadow-[#FB7185]/20 scale-105' : 'border-blue-100 hover:border-[#27275b] hover:shadow-xl'}">
					<!-- Package Header -->
					<div class="mb-8">
						<h3 class="text-3xl font-black mb-2 {pkg.popular ? 'gradient-text' : 'text-gray-900'}" style="font-family: 'Playfair Display', serif;">
							{pkg.name}
						</h3>
						<p class="text-gray-600 mb-4">{pkg.description}</p>
						<div class="text-4xl font-black mb-2 {pkg.popular ? 'text-[#FB7185]' : 'text-[#27275b]'}" style="font-family: 'Playfair Display', serif;">
							{pkg.price}
						</div>
					</div>

					<!-- Features List -->
					<ul class="space-y-4 mb-8 flex-grow">
						{#each pkg.features as feature}
							<li class="flex items-start text-gray-700">
								<svg class="w-5 h-5 text-[#10B981] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
								</svg>
								<span class="text-sm">{feature}</span>
							</li>
						{/each}
					</ul>

					<!-- Ideal For -->
					<div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg">
						<p class="text-xs uppercase tracking-wider text-gray-500 mb-1 font-bold">Idealny dla</p>
						<p class="text-sm text-gray-700 font-semibold">{pkg.ideal}</p>
					</div>

					<!-- CTA Button -->
					<a href="#kontakt" class="{pkg.popular ? 'btn' : 'btn-secondary'} w-full text-center">
						Wybierz {pkg.name}
					</a>
				</div>
			</div>
		{/each}
	</div>

	<!-- Custom Projects Note -->
	<div class="mt-16 text-center observe max-w-3xl mx-auto">
		<div class="bg-gradient-to-r from-blue-50 via-rose-50 to-emerald-50 p-8 rounded-2xl border-2 border-blue-100">
			<h4 class="text-2xl font-black mb-3 gradient-text" style="font-family: 'Playfair Display', serif;">
				Niestandardowy Projekt?
			</h4>
			<p class="text-gray-700 mb-6">
				Potrzebujesz czegoś innego? Skontaktuj się ze mną, a wspólnie ustalimy szczegóły i wycenę dopasowaną do Twoich potrzeb.
			</p>
			<a href="#kontakt" class="inline-block px-8 py-3 bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white rounded-lg hover:shadow-xl transition-all duration-300 font-bold uppercase text-sm">
				Zapytaj o Wycenę
			</a>
		</div>
	</div>
</section>

<!-- Portfolio Section -->
<section id="portfolio" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 left-1/2 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="text-center mb-20 observe relative z-10">
		<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">🎨 Portfolio</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			<span class="gradient-text">Wybrane</span><br>realizacje
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
			Każdy projekt to indywidualna historia połączenia formy, funkcji i charakteru klienta.
		</p>

		<!-- Filter -->
		<div class="flex justify-center gap-4 flex-wrap">
			<button
				onclick={() => activeFilter = 'wszystkie'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'wszystkie' ? 'bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white shadow-lg' : 'bg-transparent text-gray-600 hover:text-[#27275b] border-2 border-gray-200 hover:border-[#27275b]'}"
			>
				Wszystkie
			</button>
			<button
				onclick={() => activeFilter = 'wnętrza'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'wnętrza' ? 'bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white shadow-lg' : 'bg-transparent text-gray-600 hover:text-[#27275b] border-2 border-gray-200 hover:border-[#27275b]'}"
			>
				Wnętrza
			</button>
			<button
				onclick={() => activeFilter = 'grafika'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'grafika' ? 'bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white shadow-lg' : 'bg-transparent text-gray-600 hover:text-[#27275b] border-2 border-gray-200 hover:border-[#27275b]'}"
			>
				Grafika
			</button>
		</div>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
		{#each projects.filter(p => activeFilter === 'wszystkie' || p.category === activeFilter) as project, i}
			<div class="group observe hover-lift" style="animation-delay: {i * 100}ms">
				<div class="aspect-[4/5] bg-gradient-to-br from-blue-100 via-rose-100 to-emerald-100 relative overflow-hidden mb-6 rounded-2xl border-2 border-blue-100 group-hover:border-[#FB7185] transition-all duration-300">
					<div class="absolute inset-0 bg-gradient-to-br from-[#27275b]/10 to-[#FB7185]/10 group-hover:from-[#27275b]/20 group-hover:to-[#FB7185]/20 transition-all duration-500"></div>
					<div class="absolute top-6 right-6 bg-gradient-to-r from-[#27275b] to-[#FB7185] text-white px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg">
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
						<span class="text-xs uppercase tracking-wider text-[#27275b] font-black px-3 py-1 bg-blue-50 rounded-full">
							{project.category === 'wnętrza' ? 'Wnętrza' : 'Grafika'}
						</span>
					</div>
					<h3 class="text-2xl font-black text-gray-900 group-hover:text-[#27275b] transition-colors" style="font-family: 'Playfair Display', serif;">
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
<section class="section gradient-bg text-white relative overflow-hidden">
	<div class="absolute top-10 right-10 w-72 h-72 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
	<div class="absolute bottom-10 left-10 w-72 h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 1.5s;"></div>
	<div class="max-w-4xl mx-auto text-center observe relative z-10">
		<div class="mb-12">
			<svg class="w-16 h-16 mx-auto text-[#FB7185] opacity-70" fill="currentColor" viewBox="0 0 24 24">
				<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
			</svg>
		</div>
		<blockquote class="text-2xl md:text-3xl lg:text-4xl font-light mb-8 leading-relaxed" style="font-family: 'Playfair Display', serif;">
			Współpraca z Pikastro to była <span class="text-[#FB7185] font-bold neon-text">czysta przyjemność</span>. Profesjonalizm, kreatywność i perfekcyjne
			wyczucie naszych potrzeb zaowocowały przestrzenią, która <span class="text-[#10B981] font-bold">przekroczyła nasze oczekiwania</span>.
		</blockquote>
		<div class="text-[#FB7185] font-bold">
			<p class="mb-1 text-lg">Anna Kowalska</p>
			<p class="text-sm text-gray-300">CEO, TechStart Solutions</p>
		</div>
	</div>
</section>

<!-- Contact Section -->
<section id="kontakt" class="section bg-gradient-to-br from-blue-50 via-rose-50 to-emerald-50 relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
	<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
		<div class="observe">
			<p class="text-[#27275b] font-black tracking-[0.3em] uppercase text-sm mb-4">💬 Kontakt</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-gray-900" style="font-family: 'Playfair Display', serif;">
				Rozpocznijmy<br>
				<span class="italic gradient-text">współpracę</span>
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
						<a href="mailto:kontakt@pikastro.pl" class="text-lg text-gray-900 hover:text-[#FB7185] transition-colors">
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
				<a href="#" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-[#27275b] hover:to-[#FB7185] hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow">
					<span class="text-sm font-bold">in</span>
				</a>
				<a href="#" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-[#27275b] hover:to-[#FB7185] hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow">
					<span class="text-sm font-bold">be</span>
				</a>
				<a href="#" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-[#27275b] hover:to-[#FB7185] hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow">
					<span class="text-sm font-bold">ig</span>
				</a>
			</div>
		</div>

		<div class="bg-white p-10 lg:p-12 observe rounded-2xl border-2 border-blue-200 shadow-xl">
			<form class="space-y-6">
				<div>
					<label for="name" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Imię i nazwisko</label>
					<input
						type="text"
						id="name"
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
						placeholder="Jan Kowalski"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Email</label>
					<input
						type="email"
						id="email"
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
						placeholder="jan@example.com"
					/>
				</div>

				<div>
					<label for="project" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Typ projektu</label>
					<select
						id="project"
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
					>
						<option>Projektowanie wnętrz</option>
						<option>Identyfikacja wizualna</option>
						<option>Konsultacje</option>
						<option>Inne</option>
					</select>
				</div>

				<div>
					<label for="message" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Wiadomość</label>
					<textarea
						id="message"
						rows="5"
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white resize-none"
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
<footer class="gradient-bg text-white py-16 px-6 md:px-12 relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
	<div class="max-w-7xl mx-auto relative z-10">
		<div class="grid md:grid-cols-4 gap-12 mb-12">
			<div>
				<h3 class="text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif;">Pikastro</h3>
				<p class="text-gray-200 leading-relaxed">
					Projektowanie wnętrz i grafika z AI dla młodych ludzi. Odważne, kolorowe aranżacje zamiast beżowo-szarych.
				</p>
			</div>
			<div>
				<h4 class="text-sm uppercase tracking-wider mb-4 font-bold text-[#FB7185]">Usługi</h4>
				<ul class="space-y-2 text-gray-200 text-sm">
					<li>• Projektowanie wnętrz</li>
					<li>• Aranżacja przestrzeni</li>
					<li>• Identyfikacja wizualna</li>
					<li>• Grafika komputerowa</li>
					<li>• Technologia AI</li>
				</ul>
			</div>
			<div>
				<h4 class="text-sm uppercase tracking-wider mb-4 font-bold text-[#FB7185]">Klienci</h4>
				<ul class="space-y-2 text-gray-200 text-sm">
					<li>• Nabywcy mieszkań</li>
					<li>• Deweloperzy</li>
					<li>• Biura nieruchomości</li>
					<li>• Startupy i firmy</li>
					<li>• Lokale komercyjne</li>
				</ul>
			</div>
			<div>
				<h4 class="text-sm uppercase tracking-wider mb-4 font-bold text-[#FB7185]">Kontakt</h4>
				<ul class="space-y-2 text-gray-200 font-medium">
					<li>kontakt@pikastro.pl</li>
					<li>Kraków, Polska</li>
					<li class="pt-2">
						<a href="#omnie" class="text-[#FB7185] hover:text-white transition-colors">O mnie</a> •
						<a href="#oferta" class="text-[#FB7185] hover:text-white transition-colors">Oferta</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="pt-8 border-t border-white/20 text-center text-sm text-gray-300">
			<p class="font-medium">&copy; 2025 Pikastro. Wszystkie prawa zastrzeżone.</p>
		</div>
	</div>
</footer>
