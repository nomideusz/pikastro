<script lang="ts">
	// Import images and videos
	import img01 from '$lib/assets/images/01.jpeg';
	import img02 from '$lib/assets/images/02.jpeg';
	import img03 from '$lib/assets/images/03.jpeg';
	import img04 from '$lib/assets/images/04.jpeg';
	import img05 from '$lib/assets/images/05.jpeg';
	import img06 from '$lib/assets/images/06.jpeg';
	import img07 from '$lib/assets/images/07.jpeg';
	import img08 from '$lib/assets/images/08.jpeg';
	import img09 from '$lib/assets/images/09.jpeg';
	import img10 from '$lib/assets/images/10.jpeg';
	import img11 from '$lib/assets/images/11.jpeg';
	import colorsImg from '$lib/assets/images/colors.jpeg';
	import heroVideo from '$lib/assets/videos/vid01.mp4';

	// Import color extraction utilities
	import { extractColorsFromImage, assignColorRoles, type ColorPalette } from '$lib/utils/colorExtractor';

	// Color palette extracted from colors image
	let colorPalette = $state<ColorPalette>({
		primary: '#27275b',
		accent: '#FB7185',
		secondary: '#10B981',
		success: '#10B981',
		tertiary: '#27275b'
	});

	// Helper function to convert hex to RGB
	function hexToRgb(hex: string): string {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
			: '39, 39, 91';
	}

	// Extract colors from the colors image on mount
	$effect(() => {
		extractColorsFromImage(colorsImg, 5)
			.then((colors) => {
				if (colors.length > 0) {
					const roles = assignColorRoles(colors);
					colorPalette = roles;

					// Apply colors as CSS variables
					const root = document.documentElement.style;
					root.setProperty('--color-primary', colorPalette.primary);
					root.setProperty('--color-accent', colorPalette.accent);
					root.setProperty('--color-secondary', colorPalette.secondary);
					root.setProperty('--color-success', colorPalette.success);
					root.setProperty('--color-tertiary', colorPalette.tertiary);

					// Also set RGB values for opacity support
					root.setProperty('--color-primary-rgb', hexToRgb(colorPalette.primary));
					root.setProperty('--color-accent-rgb', hexToRgb(colorPalette.accent));
					root.setProperty('--color-secondary-rgb', hexToRgb(colorPalette.secondary));
				}
			})
			.catch((error) => {
				console.warn('Could not extract colors from image:', error);
			});
	});

	// Before/After showcase data
	const beforeAfterProjects = [
		{
			title: 'Salon z Kuchnią - Metamorfoza AI',
			before: img01,
			after: img02,
			description: 'Transformacja beżowego salonu w kolorową, funkcjonalną przestrzeń z AI',
			aiFeatures: ['Optymalizacja układu', 'Dobór kolorystyki', 'Smart storage']
		},
		{
			title: 'Sypialnia Młodych Profesjonalistów',
			before: img03,
			after: img04,
			description: 'Z pustego pokoju w nowoczesną sypialnię z home office',
			aiFeatures: ['Zarządzanie przestrzenią', 'Wielofunkcyjność', 'Oświetlenie mood']
		},
		{
			title: 'Biuro Home Office',
			before: img05,
			after: img06,
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

	// Design journeys - Professional creative process
	const designJourneys = [
		{
			title: 'Pojedyncze Przestrzenie',
			subtitle: 'Sypialnia • Salon • Kuchnia • Biuro',
			description: 'Intymna współpraca nad jednym pomieszczeniem. Odkryjemy jego potencjał i stworzymy przestrzeń, która odzwierciedla Twój styl życia.',
			process: [
				'Rozmowa o Twoich potrzebach i marzeniach',
				'Wizyta na miejscu i analiza przestrzeni',
				'3-5 koncepcji projektowych z AI',
				'Wizualizacje 3D i dokumentacja techniczna',
				'Lista zakupów z rekomendacjami',
				'Wsparcie podczas realizacji'
			],
			duration: '2-3 tygodnie',
			investment: 'Od 1,500 zł',
			priceDetails: [
				{ label: 'Sypialnia / Gabinet', price: '1,500 - 2,500 zł' },
				{ label: 'Salon z aneksem', price: '2,500 - 3,500 zł' },
				{ label: 'Kuchnia pełna', price: '3,000 - 4,500 zł' }
			],
			whatsIncluded: [
				'5-10 wariantów AI do wyboru',
				'2-3 wizualizacje 3D wybranego projektu',
				'Rzuty techniczne z wymiarami',
				'Lista materiałów i mebli (z linkami)',
				'1 poprawka projektu',
				'Wsparcie mailowe przez 30 dni'
			],
			image: '🎨',
			highlight: false
		},
		{
			title: 'Pełne Mieszkanie',
			subtitle: 'Kompleksowa metamorfoza',
			description: 'Całkowita transformacja mieszkania. Od pierwszego szkicu po klucz w drzwiach - stworzymy przestrzeń, która będzie Twoim domem na lata.',
			process: [
				'Głęboka analiza stylu życia i potrzeb',
				'Kompletny projekt wszystkich pomieszczeń',
				'Wizualizacje 3D wszystkich przestrzeni',
				'Koordynacja wykonawców i dostawców',
				'Nadzór autorski nad realizacją',
				'Finalne dopracowanie detali'
			],
			duration: '6-8 tygodni',
			investment: 'Od 3,500 zł',
			priceDetails: [
				{ label: 'Kawalerka (25-35m²)', price: '3,500 - 5,500 zł' },
				{ label: 'Mieszkanie 2-pokojowe (40-55m²)', price: '5,500 - 8,500 zł' },
				{ label: 'Mieszkanie 3-pokojowe (60-80m²)', price: '8,500 - 12,000 zł' },
				{ label: 'Duże mieszkanie (80m²+)', price: 'od 12,000 zł' }
			],
			whatsIncluded: [
				'10-15 wariantów AI wszystkich pomieszczeń',
				'5-8 wizualizacji 3D pełnych przestrzeni',
				'Kompletna dokumentacja techniczna',
				'Kosztorys materiałów i mebli',
				'2 poprawki projektu',
				'Lista sprawdzonych wykonawców',
				'Wsparcie podczas realizacji (3 miesiące)',
				'Nadzór autorski (opcjonalnie za dopłatą)'
			],
			image: '🏡',
			highlight: true,
			bestValue: true
		},
		{
			title: 'Przestrzenie Biznesowe',
			subtitle: 'Biura • Kawiarnie • Sklepy • Restauracje',
			description: 'Profesjonalne projekty komercyjne łączące ergonomię, branding i funkcjonalność. Tworzymy przestrzenie, które przyciągają klientów i wspierają biznes.',
			process: [
				'Analiza biznesowa i brief strategiczny',
				'Projekt funkcjonalny i ergonomiczny',
				'Identyfikacja wizualna przestrzeni',
				'Wizualizacje i animacje 3D',
				'Dokumentacja wykonawcza',
				'Współpraca z wykonawcami'
			],
			duration: '8-12 tygodni',
			investment: 'Od 8,000 zł',
			priceDetails: [
				{ label: 'Home office / Małe biuro', price: '8,000 - 12,000 zł' },
				{ label: 'Kawiarnia / Mały lokal', price: '12,000 - 18,000 zł' },
				{ label: 'Restauracja / Większy lokal', price: '18,000 - 30,000 zł' },
				{ label: 'Tylko branding (bez wnętrz)', price: '5,000 - 10,000 zł' }
			],
			whatsIncluded: [
				'Analiza konkurencji i target group',
				'Branding + projekt wnętrz',
				'Wielowariantowe propozycje AI',
				'Wizualizacje 3D i ewentualnie render wideo',
				'Dokumentacja techniczna dla wykonawców',
				'Materiały marketingowe przestrzeni',
				'Nadzór autorski (do uzgodnienia)',
				'Lista dostawców i wykonawców'
			],
			image: '🏢',
			highlight: false
		}
	];

	// Portfolio data - professionally curated projects
	const projects = [
		{
			title: 'Apartament w Stylu Skandynawskim',
			description: 'Minimalistyczna elegancja połączona z funkcjonalnością. Projekt 85m² mieszkania dla młodej rodziny w sercu Krakowa.',
			technologies: ['AutoCAD', 'SketchUp', 'V-Ray', '3ds Max'],
			image: img07,
			category: 'wnętrza',
			year: '2024'
		},
		{
			title: 'Identyfikacja Wizualna Studia',
			description: 'Kompleksowy branding dla studia architektury - od logo po materiały firmowe i przestrzeń biurową.',
			technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Print Design'],
			image: colorsImg,
			category: 'grafika',
			year: '2024'
		},
		{
			title: 'Przestrzeń Coworkingowa',
			description: 'Nowoczesne biuro kolaboracyjne dla startupów technologicznych. 300m² przestrzeni kreatywnej.',
			technologies: ['3D Modeling', 'Space Planning', 'Smart Solutions'],
			image: img08,
			category: 'wnętrza',
			year: '2023'
		},
		{
			title: 'Dom Jednorodzinny Modern',
			description: 'Projekt domu o powierzchni 180m² łączący nowoczesną architekturę z naturalnymi materiałami.',
			technologies: ['ArchiCAD', 'Lumion', 'Sustainable Design'],
			image: img09,
			category: 'wnętrza',
			year: '2023'
		},
		{
			title: 'Kawiarnia Concept Store',
			description: 'Design wnętrza i identyfikacja wizualna autorskiej kawiarni z galerią sztuki.',
			technologies: ['Interior Design', 'Branding', 'Visual Identity'],
			image: img10,
			category: 'grafika',
			year: '2024'
		},
		{
			title: 'Loft Industrialny',
			description: 'Adaptacja przestrzeni poprzemysłowej na nowoczesne mieszkanie z otwartym planem.',
			technologies: ['Adaptive Reuse', 'Industrial Design', 'BIM'],
			image: img11,
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
	let formStatus = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let formMessage = $state('');
	let showStickyButton = $state(false);

	$effect(() => {
		// Show sticky button after scrolling past hero
		const handleScroll = () => {
			showStickyButton = window.scrollY > 600;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

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

		// Immediately animate elements already in view
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

<!-- Hero Section with AI Visualization -->
<section class="relative min-h-[90vh] flex items-center text-white overflow-hidden" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
	<!-- Background Video -->
	<div class="absolute inset-0 z-[1]">
		<video 
			autoplay 
			loop 
			muted 
			playsinline
			class="w-full h-full object-cover opacity-20"
		>
			<source src={heroVideo} type="video/mp4" />
		</video>
		<div class="absolute inset-0 opacity-60 transition-all duration-1000" style="background-color: {colorPalette.primary}"></div>
	</div>
	<!-- Animated AI Network Background -->
	<div class="absolute inset-0 z-[2]">
		<div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
		<!-- AI Neural Network Lines -->
		<svg class="absolute inset-0 w-full h-full opacity-20 transition-all duration-1000" xmlns="http://www.w3.org/2000/svg">
			<!-- Animated connecting lines -->
			<line x1="10%" y1="20%" x2="30%" y2="40%" stroke={colorPalette.accent} stroke-width="2" class="animate-pulse-slow transition-all duration-1000" />
			<line x1="30%" y1="40%" x2="50%" y2="30%" stroke={colorPalette.secondary} stroke-width="2" class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 0.5s" />
			<line x1="50%" y1="30%" x2="70%" y2="50%" stroke={colorPalette.primary} stroke-width="2" class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 1s" />
			<line x1="70%" y1="50%" x2="90%" y2="35%" stroke={colorPalette.accent} stroke-width="2" class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 1.5s" />
			<line x1="20%" y1="70%" x2="40%" y2="85%" stroke={colorPalette.secondary} stroke-width="2" class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 2s" />
			<line x1="60%" y1="75%" x2="80%" y2="80%" stroke={colorPalette.primary} stroke-width="2" class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 2.5s" />
			<!-- AI Nodes -->
			<circle cx="10%" cy="20%" r="8" fill={colorPalette.accent} class="animate-pulse-slow transition-all duration-1000" />
			<circle cx="30%" cy="40%" r="6" fill={colorPalette.secondary} class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 0.3s" />
			<circle cx="50%" cy="30%" r="10" fill={colorPalette.primary} class="animate-pulse-slow neon-glow transition-all duration-1000" style="animation-delay: 0.6s" />
			<circle cx="70%" cy="50%" r="7" fill={colorPalette.accent} class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 0.9s" />
			<circle cx="90%" cy="35%" r="5" fill={colorPalette.secondary} class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 1.2s" />
			<circle cx="20%" cy="70%" r="6" fill={colorPalette.primary} class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 1.5s" />
			<circle cx="80%" cy="80%" r="8" fill={colorPalette.accent} class="animate-pulse-slow transition-all duration-1000" style="animation-delay: 1.8s" />
		</svg>
	</div>

	<!-- Floating gradient blobs -->
	<div class="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.accent}"></div>
	<div class="absolute bottom-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.primary}; animation-delay: 1s;"></div>
	<div class="absolute top-1/2 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.secondary}; animation-delay: 2s;"></div>

	<div class="section relative z-20">
		<div class="max-w-5xl">
			<!-- Market Position Badge -->
			<div class="mb-6 observe animate-fade-in-up">
				<div class="inline-block">
					<div class="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 shadow-lg">
						<p class="font-black tracking-wider uppercase text-xs text-white flex items-center gap-2">
							<span class="animate-pulse">⭐</span>
							<span>Pierwsze studio AI w Krakowie</span>
							<span class="animate-pulse">⭐</span>
						</p>
					</div>
				</div>
			</div>
			<div class="mb-8 observe animate-fade-in-up">
				<p class="font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text" style="color: {colorPalette.accent}">🤖 AI × Architektura × Grafika</p>
				<h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05]" style="font-family: 'Playfair Display', serif;">
					<span class="block">Dość beżu.</span>
					<span class="block">Czas na <span style="color: #00D4FF;">kolor!</span></span>
				</h1>
				<p class="text-2xl md:text-3xl font-bold mb-4 leading-tight" style="color: #FF6B9D;">
					AI × Design = Twoje wymarzone wnętrze
				</p>
			</div>
				<p class="text-xl md:text-2xl mb-8 max-w-3xl leading-relaxed text-gray-100 observe animate-fade-in-up" style="animation-delay: 0.2s; font-weight: 400;">
				Zobacz <span class="font-bold text-white">10 wersji swojego wnętrza</span> zanim zdecydujesz.
				Prototypowanie w godziny, nie tygodnie. <span class="font-bold neon-text" style="color: {colorPalette.accent}">Szybciej. Odważniej. Taniej.</span>
			</p>

			<!-- Value Props -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 observe animate-fade-in-up max-w-3xl" style="animation-delay: 0.4s;">
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="font-black text-lg text-white">8-13 dni</div>
					<div class="text-white/80 text-sm">vs. 4-6 tygodni</div>
				</div>
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="font-black text-lg neon-text" style="color: {colorPalette.accent}">5-10 wariantów</div>
					<div class="text-white/80 text-sm">do wyboru z AI</div>
				</div>
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="font-black text-lg text-white">Od 1,500 zł</div>
					<div class="text-white/80 text-sm">jeden pokój</div>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row gap-6 observe animate-fade-in-up" style="animation-delay: 0.6s;">
				<a href="#beforeafter" class="btn animate-float">
					Zobacz Metamorfozy
				</a>
				<a href="#cennik" class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-2xl font-bold tracking-wide uppercase text-sm" style="--hover-text-color: {colorPalette.primary};" onmouseenter={(e) => e.currentTarget.style.color = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.color = 'white'}>
					Sprawdź Ceny
				</a>
			</div>
		</div>
	</div>
	<div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: {colorPalette.accent}">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</section>

<!-- Before/After Showcase Section -->
<section id="beforeafter" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="text-center mb-20 observe">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">✨ Metamorfozy AI</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Przed i Po<br><span style="color: {colorPalette.primary}">Transformacji z AI</span>
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
					<img 
						src={beforeAfterProjects[activeBeforeAfter].before} 
						alt="Przed transformacją"
						class="w-full h-full object-cover"
					/>
				</div>

				<!-- After Image with slider -->
				<div class="absolute inset-0" style="clip-path: inset(0 {100 - sliderPosition}% 0 0)">
					<img 
						src={beforeAfterProjects[activeBeforeAfter].after} 
						alt="Po transformacji AI"
						class="w-full h-full object-cover"
					/>
				</div>

				<!-- Slider Handle -->
				<div class="absolute inset-y-0 z-10 pointer-events-none" style="left: {sliderPosition}%">
					<div class="absolute inset-y-0 w-1 bg-white shadow-lg"></div>
					<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: {colorPalette.primary}">
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
					class="absolute inset-0 w-full h-full opacity-0 cursor-move z-20"
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
						<span class="px-4 py-2 text-white text-sm font-bold rounded-lg" style="background-color: {colorPalette.primary}">
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
					class="relative aspect-[4/3] rounded-xl overflow-hidden border-4 transition-all duration-300 {activeBeforeAfter === i ? 'scale-105' : 'border-gray-200'}"
					style={activeBeforeAfter === i ? `border-color: ${colorPalette.accent}; box-shadow: 0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3);` : `border-color: rgb(229, 231, 235);`}
					onmouseenter={(e) => { if (activeBeforeAfter !== i) e.currentTarget.style.borderColor = colorPalette.primary; }}
					onmouseleave={(e) => { if (activeBeforeAfter !== i) e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; }}
				>
					<img 
						src={project.after} 
						alt={project.title}
						class="w-full h-full object-cover"
					/>
					<div class="absolute inset-0 transition-all duration-300 flex items-center justify-center" style="background-color: {colorPalette.primary}; opacity: 0.4;" role="presentation" onmouseenter={(e) => e.currentTarget.style.opacity = '0.2'} onmouseleave={(e) => e.currentTarget.style.opacity = '0.4'}>
						<p class="text-sm font-bold text-white px-4 text-center">{project.title}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="section bg-blue-50 border-y border-blue-100">
	<div class="grid grid-cols-2 md:grid-cols-4 gap-12">
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 text-[#27275b]" style="font-family: 'Playfair Display', serif;">50+</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Zrealizowanych projektów</div>
		</div>
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 text-[#FB7185]" style="font-family: 'Playfair Display', serif;">5+</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Lat doświadczenia</div>
		</div>
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 text-[#10B981]" style="font-family: 'Playfair Display', serif;">100%</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Zadowolonych klientów</div>
		</div>
		<div class="text-center observe transform hover:scale-110 transition-transform duration-300">
			<div class="text-5xl font-black mb-3 text-[#27275b]" style="font-family: 'Playfair Display', serif;">15+</div>
			<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">Nagród branżowych</div>
		</div>
	</div>
</section>

<!-- Target Audience Section - First-time Homeowners -->
<section class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-20"></div>
	<div class="max-w-6xl mx-auto relative z-10">
		<div class="text-center mb-16 observe">
			<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">🏠 Dla Kogo?</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				Specjalizacja:<br>
				<span style="color: {colorPalette.accent}">Pierwsi Właściciele Mieszkań</span>
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
				Tworzymy dla młodych ludzi (20-30 lat), którzy kupują pierwszą nieruchomość i chcą przestrzeń odzwierciedlającą ich styl życia
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 observe">
			<!-- Home Office / Remote Work -->
			<div class="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 group">
				<div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform">💻</div>
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Home Office</h3>
				<p class="text-gray-600 leading-relaxed mb-4">
					Ergonomiczne stanowisko do pracy zdalnej w małym mieszkaniu. Wielofunkcyjne rozwiązania, dobre oświetlenie i akustyka.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-green-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Optymalizacja przestrzeni</span>
					</li>
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-green-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Smart storage solutions</span>
					</li>
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-green-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Strefy work-life balance</span>
					</li>
				</ul>
			</div>

			<!-- Smart Home Integration -->
			<div class="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 group">
				<div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🏡</div>
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.accent}">Smart Home</h3>
				<p class="text-gray-600 leading-relaxed mb-4">
					Nowoczesne rozwiązania technologiczne: inteligentne oświetlenie, sterowanie głosowe, automatyka domowa dopasowana do budżetu.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>AI-powered lighting scenes</span>
					</li>
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Integracja urządzeń IoT</span>
					</li>
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-purple-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Budget-friendly tech</span>
					</li>
				</ul>
			</div>

			<!-- Instagram-Worthy Interiors -->
			<div class="bg-gradient-to-br from-rose-50 to-white p-8 rounded-2xl border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 group">
				<div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform">📸</div>
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.secondary}">Instagram-Worthy</h3>
				<p class="text-gray-600 leading-relaxed mb-4">
					Odważne, kolorowe aranżacje zamiast beżowo-szarych. Przestrzenie, które chcesz pokazać znajomym i na social mediach.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-rose-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Zero beżowych nudnych wnętrz</span>
					</li>
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-rose-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Kolorystyka z charakterem</span>
					</li>
					<li class="flex items-start">
						<span class="w-1.5 h-1.5 bg-rose-500 mt-2 mr-2 flex-shrink-0"></span>
						<span>Viral-ready design</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Budget-Conscious Banner -->
		<div class="mt-16 observe">
			<div class="bg-gradient-to-r from-blue-600 to-purple-600 p-10 lg:p-12 rounded-3xl text-white text-center shadow-2xl">
				<div class="max-w-3xl mx-auto">
					<div class="text-5xl mb-4">💰</div>
					<h3 class="text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif;">
						Świadomi Budżetu, Bez Kompromisów w Stylu
					</h3>
					<p class="text-lg text-white/90 mb-6 leading-relaxed">
						AI oszczędza czas projektowania = niższe koszty dla Ciebie. Więcej opcji do wyboru, szybsze prototypowanie, atrakcyjne ceny.
						Idealne dla pierwszych właścicieli, którzy inwestują w dom marzeń, nie mając nieograniczonego budżetu.
					</p>
					<div class="grid md:grid-cols-3 gap-6 mt-8">
						<div class="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg">
							<div class="text-2xl font-black">40% taniej</div>
							<div class="text-sm text-white/80">niż tradycyjne studia</div>
						</div>
						<div class="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg">
							<div class="text-2xl font-black">3x szybciej</div>
							<div class="text-sm text-white/80">realizacja projektu</div>
						</div>
						<div class="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg">
							<div class="text-2xl font-black">10 wariantów</div>
							<div class="text-sm text-white/80">do wyboru dzięki AI</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="omnie" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
		<div class="observe">
			<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">⭐ O mnie</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight" style="font-family: 'Playfair Display', serif;">
				Design który<br>
				<span class="italic" style="color: {colorPalette.accent}">zmienia</span><br>
				przestrzenie
			</h2>
			<div class="space-y-6 text-gray-600 leading-relaxed text-lg">
				<p>
					Jestem projektantką wnętrz i graficzką z wykształceniem architektonicznym.
					Łączę inżynierską wiedzę techniczną z umiejętnościami graficznymi i plastycznymi,
					wykorzystując zaawansowane narzędzia oparte na sztucznej inteligencji.
				</p>
				<p>
					<strong style="color: {colorPalette.primary}">Moja przewaga konkurencyjna:</strong> Unikalne połączenie trzech kompetencji -
					podejścia inżynierskiego, talentu plastycznego i technologii AI. To pozwala mi tworzyć
					funkcjonalne, estetyczne rozwiązania szybciej i w atrakcyjnych cenach.
				</p>
				<p>
					Specjalizuję się w projektach dla <strong style="color: {colorPalette.accent}">młodych ludzi (20-30 lat)</strong> -
					odważnych nabywców pierwszych mieszkań, którzy cenią kolorowe aranżacje, przestrzenie do pracy zdalnej
					i rozwiązania smart home, zamiast stonowanych beżowo-szarych wnętrz.
				</p>
				<p class="quote-block">
					„Połączenie wiedzy technicznej, kreatywności i AI tworzy nową jakość projektowania."
				</p>
			</div>
		</div>

		<div class="space-y-8 observe">
			<div class="aspect-[4/5] bg-blue-100 relative overflow-hidden group rounded-2xl">
				<img 
					src={img07} 
					alt="Projektowanie wnętrz dla klientów"
					class="w-full h-full object-cover"
				/>
				<div class="absolute inset-0 bg-[#27275b]/30 group-hover:bg-[#27275b]/20 transition-all duration-300"></div>
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-center p-8">
						<div class="text-6xl mb-4">🏠✨</div>
						<p class="text-lg font-bold text-white mb-2">Dla Klientów</p>
						<p class="text-sm text-white/90">Indywidualnych • Deweloperów • Startupów</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-6">
				<div class="p-6 border-2 border-blue-200 transition-colors duration-300 rounded-xl neon-glow" style="border-color: rgb(239, 246, 255);" onmouseenter={(e) => e.currentTarget.style.borderColor = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.borderColor = 'rgb(239, 246, 255)'}>
					<div class="text-3xl font-black mb-2" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">
						AI
					</div>
					<div class="text-sm text-gray-700 uppercase tracking-wider font-bold">
						Technologia przyszłości
					</div>
				</div>
				<div class="p-6 border-2 border-blue-200 transition-colors duration-300 rounded-xl" onmouseenter={(e) => e.currentTarget.style.borderColor = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.borderColor = 'rgb(239, 246, 255)'}>
					<div class="text-3xl font-black mb-2" style="font-family: 'Playfair Display', serif; color: {colorPalette.accent}">
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
<section id="oferta" class="section bg-white relative overflow-hidden">
	<div class="absolute top-20 left-20 w-64 h-64 bg-emerald-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
		<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">💼 Usługi</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Kompleksowa<br><span style="color: {colorPalette.primary}">obsługa projektowa</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Od koncepcji po realizację - pełne wsparcie w procesie projektowania wnętrz i tworzenia identyfikacji wizualnej.
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
		{#each services as service, i}
			<div class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500" style="animation-delay: {i * 100}ms; border-color: rgb(243, 244, 246);" onmouseenter={(e) => { e.currentTarget.style.borderColor = colorPalette.accent; e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`; }} onmouseleave={(e) => { e.currentTarget.style.borderColor = 'rgb(243, 244, 246)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}>
				<div class="mb-8">
					<div class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">
						{service.icon}
					</div>
				</div>
				<h3 class="text-2xl lg:text-3xl font-black mb-4 text-gray-900 transition-colors" style="font-family: 'Playfair Display', serif;" onmouseenter={(e) => e.currentTarget.style.color = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.color = 'rgb(31, 41, 55)'}>
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
<section id="proces" class="section text-white relative overflow-hidden" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
	<div class="absolute top-10 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.accent}"></div>
	<div class="absolute bottom-10 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.secondary}; animation-delay: 1.5s;"></div>

	<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4 neon-text" style="color: {colorPalette.accent}">⚙️ Jak to działa</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Proces Projektowania<br><span class="text-white">z Wykorzystaniem AI</span>
		</h2>
		<p class="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
			Połączenie ludzkiej kreatywności i mocy AI dla najlepszych rezultatów w najkrótszym czasie
		</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 items-stretch">
		{#each processSteps as step, i}
			<div class="observe group h-full flex flex-col" style="animation-delay: {i * 150}ms">
				<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col flex-grow" onmouseenter={(e) => { e.currentTarget.style.borderColor = colorPalette.accent; e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3)`; }} onmouseleave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}>
					<!-- Step Number -->
					<div class="mb-6">
						<div class="text-8xl font-black opacity-20 leading-none text-white" style="font-family: 'Playfair Display', serif;">
							{step.number}
						</div>
						<div class="text-5xl -mt-8 mb-4">{step.icon}</div>
					</div>

					<!-- Step Content -->
					<h3 class="text-2xl font-black mb-3 text-white transition-colors" style="font-family: 'Playfair Display', serif;" onmouseenter={(e) => e.currentTarget.style.color = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.color = 'white'}>
						{step.title}
					</h3>
					<p class="text-gray-200 mb-4 leading-relaxed">
						{step.description}
					</p>
					<div class="flex items-center gap-2 font-bold text-sm text-white">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						{step.duration}
					</div>
				</div>

				<!-- Connecting Arrow (except for last item) -->
				{#if i < processSteps.length - 1}
					<div class="hidden lg:block absolute top-1/2 -right-4 z-20 transform -translate-y-1/2">
						<div class="flex items-center justify-center w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-md" style="border-color: {colorPalette.accent}30;">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: {colorPalette.accent};">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Total Time Banner -->
	<div class="mt-16 text-center observe animate-fade-in-up" style="animation-delay: 0.3s;">
		<div class="inline-block bg-white/10 backdrop-blur-sm px-12 py-6 rounded-2xl border-2 border-white/20 transition-all duration-500 hover:border-white/40 hover:bg-white/15">
			<p class="text-sm uppercase tracking-wider text-gray-300 mb-2">Całkowity czas realizacji</p>
			<p class="text-4xl font-black transition-colors duration-300" style="font-family: 'Playfair Display', serif; color: {colorPalette.secondary};">8-13 dni roboczych</p>
			<p class="text-sm text-gray-300 mt-2">vs. tradycyjne 4-6 tygodni</p>
		</div>
	</div>
</section>

<!-- Comparison Section - AI Studio vs Traditional -->
<section class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
	<div class="text-center mb-16 observe relative z-10">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">⚖️ Porównanie</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Pikastro AI vs<br>
			<span style="color: {colorPalette.accent}">Tradycyjne Studia</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Zobacz konkretne różnice i przekonaj się, dlaczego AI to przyszłość projektowania
		</p>
	</div>

	<div class="max-w-6xl mx-auto relative z-10">
		<!-- Comparison Table -->
		<div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden observe">
			<div class="grid md:grid-cols-3 gap-px bg-gray-200">
				<!-- Header Row -->
				<div class="bg-white p-6">
					<h3 class="text-lg font-bold text-gray-600 uppercase tracking-wider"></h3>
				</div>
				<div class="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-center">
					<div class="inline-block px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-black uppercase mb-2">
						⭐ Najlepszy wybór
					</div>
					<h3 class="text-2xl font-black text-white mb-1">Pikastro AI</h3>
					<p class="text-sm text-white/80">Pierwsze studio AI w Krakowie</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<h3 class="text-2xl font-black text-gray-600 mb-1">Tradycyjne Studio</h3>
					<p class="text-sm text-gray-500">Standardowa obsługa</p>
				</div>

				<!-- Time to Delivery -->
				<div class="bg-white p-6">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl">⏱️</span>
						<h4 class="font-bold text-gray-900">Czas realizacji</h4>
					</div>
					<p class="text-sm text-gray-600">Od konsultacji do projektu</p>
				</div>
				<div class="bg-blue-50 p-6 text-center border-l-4 border-green-500">
					<p class="text-4xl font-black mb-1" style="color: {colorPalette.secondary}">8-13 dni</p>
					<p class="text-xs text-gray-600 font-medium">Ekspresowa realizacja</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<p class="text-4xl font-black text-gray-400 mb-1">4-6 tyg</p>
					<p class="text-xs text-gray-500">Standardowy czas</p>
				</div>

				<!-- Number of Variants -->
				<div class="bg-white p-6">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl">🎨</span>
						<h4 class="font-bold text-gray-900">Warianty do wyboru</h4>
					</div>
					<p class="text-sm text-gray-600">Opcje aranżacyjne</p>
				</div>
				<div class="bg-blue-50 p-6 text-center border-l-4 border-green-500">
					<p class="text-4xl font-black mb-1" style="color: {colorPalette.secondary}">5-10</p>
					<p class="text-xs text-gray-600 font-medium">Dzięki AI</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<p class="text-4xl font-black text-gray-400 mb-1">1-2</p>
					<p class="text-xs text-gray-500">Ręczne rysowanie</p>
				</div>

				<!-- Price -->
				<div class="bg-white p-6">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl">💰</span>
						<h4 class="font-bold text-gray-900">Cena za pokój</h4>
					</div>
					<p class="text-sm text-gray-600">Projekt + wizualizacje</p>
				</div>
				<div class="bg-blue-50 p-6 text-center border-l-4 border-green-500">
					<p class="text-4xl font-black mb-1" style="color: {colorPalette.secondary}">Od 1,500 zł</p>
					<p class="text-xs text-gray-600 font-medium">40% taniej</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<p class="text-4xl font-black text-gray-400 mb-1">Od 2,500 zł</p>
					<p class="text-xs text-gray-500">Wyższa cena</p>
				</div>

				<!-- Revisions -->
				<div class="bg-white p-6">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl">🔄</span>
						<h4 class="font-bold text-gray-900">Poprawki</h4>
					</div>
					<p class="text-sm text-gray-600">Modyfikacje projektu</p>
				</div>
				<div class="bg-blue-50 p-6 text-center border-l-4 border-green-500">
					<p class="text-4xl font-black mb-1" style="color: {colorPalette.secondary}">Szybkie</p>
					<p class="text-xs text-gray-600 font-medium">1-2 dni na poprawkę</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<p class="text-4xl font-black text-gray-400 mb-1">Wolne</p>
					<p class="text-xs text-gray-500">5-7 dni na poprawkę</p>
				</div>

				<!-- Technology -->
				<div class="bg-white p-6">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl">🤖</span>
						<h4 class="font-bold text-gray-900">Technologia</h4>
					</div>
					<p class="text-sm text-gray-600">Narzędzia projektowe</p>
				</div>
				<div class="bg-blue-50 p-6 text-center border-l-4 border-green-500">
					<p class="text-2xl font-black mb-2" style="color: {colorPalette.primary}">AI + Człowiek</p>
					<p class="text-xs text-gray-600 font-medium">Najnowsze rozwiązania</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<p class="text-2xl font-black text-gray-400 mb-2">Tylko ręcznie</p>
					<p class="text-xs text-gray-500">Tradycyjne metody</p>
				</div>

				<!-- Target Audience -->
				<div class="bg-white p-6">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl">🎯</span>
						<h4 class="font-bold text-gray-900">Specjalizacja</h4>
					</div>
					<p class="text-sm text-gray-600">Grupa docelowa</p>
				</div>
				<div class="bg-blue-50 p-6 text-center border-l-4 border-green-500">
					<p class="text-lg font-black mb-2" style="color: {colorPalette.accent}">20-30 lat</p>
					<p class="text-xs text-gray-600 font-medium">Kolorowe, odważne</p>
				</div>
				<div class="bg-gray-50 p-6 text-center">
					<p class="text-lg font-black text-gray-400 mb-2">Ogólne</p>
					<p class="text-xs text-gray-500">Beżowo-szare</p>
				</div>
			</div>
		</div>

		<!-- Bottom CTA -->
		<div class="mt-12 text-center observe">
			<div class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-8 lg:p-10 rounded-3xl text-white shadow-2xl">
				<div class="max-w-2xl">
					<div class="text-5xl mb-4">🚀</div>
					<h3 class="text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif;">
						Przekonaj się sam!
					</h3>
					<p class="text-lg text-white/90 mb-6 leading-relaxed">
						Bezpłatna konsultacja online - pokażemy Ci jak AI może zmienić Twoje wnętrze.
						Zobaczysz pierwsze propozycje jeszcze podczas spotkania!
					</p>
					<a href="#kontakt" class="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm transform hover:scale-105">
						<span>Umów bezpłatną konsultację</span>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</a>
					<p class="text-xs text-white/70 mt-4">💡 30 minut • Online lub stacjonarnie • Bez zobowiązań</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Manifesto / Why Section -->
<section class="section bg-blue-50 relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30"></div>
	<div class="max-w-4xl mx-auto relative z-10">
		<div class="text-center mb-16 observe">
			<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">💡 Nasza Filozofia</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				<span style="color: {colorPalette.primary}">Wierzymy</span>, że design może być...
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-16 observe">
			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">⚡</div>
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Szybki I Dopracowany</h3>
				<p class="text-gray-600 leading-relaxed">
					AI nie zastępuje designera - wzmacnia go. Generujemy warianty w godziny, a potem dopracowujemy każdy detal ręcznie.
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">🎨</div>
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.accent}">Kolorowy I Profesjonalny</h3>
				<p class="text-gray-600 leading-relaxed">
					Zero beżowo-szarych nudnych wnętrz. Ale też zero chaosu - każdy kolor ma swoje miejsce i funkcję.
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">🚀</div>
				<h3 class="text-2xl font-black mb-3 text-gray-900" style="font-family: 'Playfair Display', serif;">Odważny I Funkcjonalny</h3>
				<p class="text-gray-600 leading-relaxed">
					Projektujemy przestrzenie, które wyróżniają się wizualnie, ale przede wszystkim - działają dla Ciebie każdego dnia.
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-[#FB7185] transition-all duration-300 hover:shadow-xl">
				<div class="text-4xl mb-4">💰</div>
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Dostępny I Wysokiej Jakości</h3>
				<p class="text-gray-600 leading-relaxed">
					AI oszczędza nam czas, więc możemy oferować Ci atrakcyjne ceny bez kompromisów w jakości wykonania.
				</p>
			</div>
		</div>

		<!-- FAQ Quick Hits -->
		<div class="p-10 lg:p-12 rounded-2xl text-white observe" style="background-color: {colorPalette.primary}">
			<h3 class="text-3xl font-black mb-8 text-center" style="font-family: 'Playfair Display', serif;">
				Najczęstsze pytania
			</h3>

			<div class="space-y-6">
				<div class="border-l-4 pl-6" style="border-color: {colorPalette.accent}">
					<p class="font-bold text-xl mb-2 neon-text" style="color: {colorPalette.accent}">"Czy AI to nie tandetnie?"</p>
					<p class="text-gray-200 leading-relaxed">
						Nie, jeśli ma <strong>inżyniera i designera przy sterach</strong>. AI to narzędzie - jak pędzel dla malarza.
						W moich rękach generuje propozycje, ale każdy projekt przechodzi przez ludzką kurację i dopracowanie.
					</p>
				</div>

				<div class="border-l-4 pl-6" style="border-color: {colorPalette.secondary}">
					<p class="font-bold text-xl mb-2 text-white">"Ile to kosztuje?"</p>
					<p class="text-gray-200 leading-relaxed">
						<strong>Mniej niż myślisz.</strong> Bo AI oszczędza nam czas, a Tobie pieniądze.
						Jeden pokój od 1,500 zł, mieszkanie 2-3 pokoje od 3,500 zł. Zero ukrytych kosztów.
					</p>
				</div>

				<div class="border-l-4 pl-6" style="border-color: {colorPalette.accent}">
					<p class="font-bold text-xl mb-2 neon-text" style="color: {colorPalette.accent}">"Czy to naprawdę działa?"</p>
					<p class="text-gray-200 leading-relaxed">
						<strong>50+ zrealizowanych projektów mówi samo za siebie.</strong> Pierwsze studio w Krakowie,
						które połączyło architekturę × grafikę × AI. Sprawdź metamorfozy poniżej.
					</p>
				</div>

				<div class="border-l-4 pl-6" style="border-color: {colorPalette.secondary}">
					<p class="font-bold text-xl mb-2 text-white">"Dla kogo to jest?"</p>
					<p class="text-gray-200 leading-relaxed">
						Dla <strong>młodych ludzi (20-30 lat)</strong>, którzy kupują pierwsze mieszkanie i chcą przestrzeń
						do pracy zdalnej, smart home, kolorowe aranżacje - zamiast beżowo-szarych wnętrz rodem z showroomu.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Design Journeys Section -->
<section id="cennik" class="section bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
	<!-- Subtle background elements -->
	<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full filter blur-3xl opacity-40"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-full filter blur-3xl opacity-40"></div>

	<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4 text-gray-500">🎨 Proces Projektowy</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Podróż do<br><span style="color: {colorPalette.primary}">Doskonalej Przestrzeni</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
			Każdy projekt to unikalna historia. Wybierz ścieżkę, która najlepiej odzwierciedla Twoją wizję i potrzeby.
		</p>
	</div>

	<div class="space-y-16 relative z-10 max-w-7xl mx-auto">
		{#each designJourneys as journey, i}
			<div class="observe" style="animation-delay: {i * 200}ms">
				<div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl {journey.highlight ? 'ring-2 ring-offset-4' : ''}" style={journey.highlight ? `ring-color: ${colorPalette.primary}; --tw-ring-offset-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);` : ''}>

					<!-- Journey Header -->
					<div class="relative">
						{#if journey.highlight}
							<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent" style="background: linear-gradient(90deg, transparent, {colorPalette.primary}, transparent);"></div>
						{/if}

						<div class="p-8 lg:p-12">
							<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
								<div class="flex-1">
									<div class="text-6xl mb-4">{journey.image}</div>
									<h3 class="text-3xl lg:text-4xl font-black mb-2" style="font-family: 'Playfair Display', serif; color: {journey.highlight ? colorPalette.primary : 'rgb(31, 41, 55)'}">
										{journey.title}
									</h3>
									<p class="text-lg font-medium mb-3 text-gray-600">{journey.subtitle}</p>
									<p class="text-gray-700 leading-relaxed max-w-2xl">
										{journey.description}
									</p>
								</div>

								<!-- Investment & Duration -->
								<div class="lg:text-right">
									<div class="inline-block p-6 bg-gray-50 rounded-2xl border border-gray-100">
										<div class="text-sm uppercase tracking-wider text-gray-500 mb-1 font-bold">Inwestycja</div>
										<div class="text-2xl font-black mb-2" style="color: {colorPalette.primary}">{journey.investment}</div>
										<div class="text-sm text-gray-600">{journey.duration}</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Price Details -->
					{#if journey.priceDetails}
						<div class="px-8 lg:px-12 pb-8">
							<div class="border-t border-gray-100 pt-8">
								<h4 class="text-lg font-bold mb-6 text-gray-900">Szczegółowa wycena:</h4>
								<div class="grid md:grid-cols-2 gap-4">
									{#each journey.priceDetails as detail}
										<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
											<span class="text-gray-700 font-medium">{detail.label}</span>
											<span class="font-black" style="color: {colorPalette.primary}">{detail.price}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- What's Included -->
					{#if journey.whatsIncluded}
						<div class="px-8 lg:px-12 pb-8">
							<div class="border-t border-gray-100 pt-8">
								<h4 class="text-lg font-bold mb-6 text-gray-900">Co jest w cenie:</h4>
								<div class="grid md:grid-cols-2 gap-4">
									{#each journey.whatsIncluded as item}
										<div class="flex items-start gap-3">
											<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: {colorPalette.secondary}">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
											</svg>
											<span class="text-gray-700 text-sm leading-relaxed">{item}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- Process Steps -->
					<div class="px-8 lg:px-12 pb-12">
						<div class="border-t border-gray-100 pt-8">
							<h4 class="text-lg font-bold mb-6 text-gray-900">Jak wygląda współpraca:</h4>
							<div class="grid md:grid-cols-2 gap-6">
								{#each journey.process as step, stepIndex}
									<div class="flex items-start gap-4">
										<div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style="background-color: {colorPalette.primary}; color: white;">
											{stepIndex + 1}
										</div>
										<p class="text-gray-700 leading-relaxed">{step}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- CTA -->
						<div class="mt-8 pt-8 border-t border-gray-100 text-center">
							<p class="text-sm text-gray-500 mb-4">Gotowy na transformację swojej przestrzeni?</p>
							<a href="#kontakt" class="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm group" style="background: linear-gradient(135deg, {colorPalette.primary}, {colorPalette.accent});">
								<span>Rozpocznij {journey.title.toLowerCase()}</span>
								<svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Personal Consultation Note -->
	<div class="mt-20 text-center observe max-w-4xl mx-auto">
		<div class="bg-gradient-to-r from-gray-50 to-blue-50 p-8 lg:p-12 rounded-3xl border border-gray-200">
			<div class="text-6xl mb-4">🤝</div>
			<h3 class="text-2xl lg:text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">
				Każdy Projekt Jest Inny
			</h3>
			<p class="text-lg text-gray-700 mb-8 leading-relaxed">
				Masz unikalną wizję lub nietypową przestrzeń? Niezależnie od skali projektu,
				każda współpraca jest tworzona indywidualnie. Podziel się swoimi marzeniami -
				razem stworzymy coś wyjątkowego.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a href="#kontakt" class="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm" style="background: linear-gradient(135deg, {colorPalette.primary}, {colorPalette.accent});">
					<span>Umów Bezpłatną Konsultację</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
					</svg>
				</a>
				<div class="text-sm text-gray-500">
					💡 Bez zobowiązań • 30 minut • Online lub stacjonarnie
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Developer & B2B Partnership Section -->
<section class="section bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
	<div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 1.5s;"></div>

	<div class="relative z-10">
		<div class="text-center mb-16 observe">
			<p class="font-black tracking-[0.3em] uppercase text-sm mb-4 neon-text" style="color: {colorPalette.accent}">🏢 Współpraca B2B</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				Dla Deweloperów<br>
				<span style="color: #00D4FF;">i Biznesu</span>
			</h2>
			<p class="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
				Skalowalne rozwiązania projektowe dla firm - wizualizacje, projekty showroomów i kompleksowa obsługa projektowa
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-12 mb-16">
			<!-- Developers -->
			<div class="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 observe hover:bg-white/15 transition-all duration-300">
				<div class="text-6xl mb-6">🏗️</div>
				<h3 class="text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif;">Deweloperzy Mieszkaniowi</h3>
				<p class="text-gray-200 mb-6 leading-relaxed">
					Szybkie wizualizacje i projekty wnętrz dla Twoich inwestycji. AI przyspiesza proces tworzenia
					wariantów aranżacyjnych dla mieszkań pokazowych.
				</p>

				<div class="space-y-4 mb-8">
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.accent}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Pakiety wielomieszkaniowe</h4>
							<p class="text-sm text-gray-300">Rabaty przy realizacji 5+ mieszkań</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.accent}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Ekspresowa realizacja</h4>
							<p class="text-sm text-gray-300">Wizualizacje 3D w 3-5 dni roboczych</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.accent}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Materiały marketingowe</h4>
							<p class="text-sm text-gray-300">Gotowe do publikacji na stronę i social media</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.accent}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Różne warianty aranżacyjne</h4>
							<p class="text-sm text-gray-300">10+ propozycji dla każdego metrażu</p>
						</div>
					</div>
				</div>

				<div class="bg-white/10 p-4 rounded-lg border border-white/20">
					<p class="text-sm text-gray-300 mb-2">Przykładowa cena pakietu</p>
					<p class="text-3xl font-black" style="color: {colorPalette.accent}">Od 8,000 zł</p>
					<p class="text-xs text-gray-400 mt-1">za 5 mieszkań + wizualizacje 3D</p>
				</div>
			</div>

			<!-- Real Estate & Commercial -->
			<div class="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 observe hover:bg-white/15 transition-all duration-300">
				<div class="text-6xl mb-6">🏪</div>
				<h3 class="text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif;">Biura & Lokale Komercyjne</h3>
				<p class="text-gray-200 mb-6 leading-relaxed">
					Kompleksowe projekty dla biur nieruchomości, restauracji, kawiarni, sklepów.
					Łączymy design wnętrz z brandingiem.
				</p>

				<div class="space-y-4 mb-8">
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.secondary}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Rzuty i modele 3D</h4>
							<p class="text-sm text-gray-300">Profesjonalna dokumentacja dla biur nieruchomości</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.secondary}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Branding + Wnętrza</h4>
							<p class="text-sm text-gray-300">Spójna identyfikacja wizualna i projekt przestrzeni</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.secondary}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Ergonomia biznesowa</h4>
							<p class="text-sm text-gray-300">Przestrzenie zoptymalizowane pod klienta końcowego</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {colorPalette.secondary}">✓</div>
						<div>
							<h4 class="font-bold mb-1">Stała współpraca</h4>
							<p class="text-sm text-gray-300">Partnerstwo długoterminowe z dedykowanymi cenami</p>
						</div>
					</div>
				</div>

				<div class="bg-white/10 p-4 rounded-lg border border-white/20">
					<p class="text-sm text-gray-300 mb-2">Wycena indywidualna</p>
					<p class="text-3xl font-black" style="color: {colorPalette.secondary}">Od 12,000 zł</p>
					<p class="text-xs text-gray-400 mt-1">projekt + branding + nadzór</p>
				</div>
			</div>
		</div>

		<!-- Partnership CTA -->
		<div class="bg-white/5 backdrop-blur-md p-10 lg:p-12 rounded-3xl border border-white/20 text-center observe max-w-4xl mx-auto">
			<div class="text-5xl mb-4">🤝</div>
			<h3 class="text-3xl font-black mb-4" style="font-family: 'Playfair Display', serif;">
				Zainteresowany współpracą B2B?
			</h3>
			<p class="text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto">
				Przygotujemy dedykowaną ofertę dopasowaną do specyfiki Twojego biznesu.
				Skontaktuj się z nami, aby omówić szczegóły współpracy.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="#kontakt" class="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm transform hover:scale-105">
					<span>Umów spotkanie B2B</span>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
					</svg>
				</a>
				<a href="mailto:kontakt@pikastro.eu?subject=Współpraca B2B" class="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-sm">
					<span>kontakt@pikastro.eu</span>
				</a>
			</div>

			<!-- Trust Indicators -->
			<div class="mt-10 pt-8 border-t border-white/20">
				<p class="text-sm text-gray-400 mb-4">Zaufali nam:</p>
				<div class="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
					<span class="px-4 py-2 bg-white/5 rounded-lg">Deweloperzy z Krakowa</span>
					<span class="px-4 py-2 bg-white/5 rounded-lg">Biura nieruchomości</span>
					<span class="px-4 py-2 bg-white/5 rounded-lg">Lokale gastronomiczne</span>
					<span class="px-4 py-2 bg-white/5 rounded-lg">Startupy tech</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Portfolio Section -->
<section id="portfolio" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 left-1/2 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>
		<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">🎨 Portfolio</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			<span style="color: {colorPalette.primary}">Wybrane</span><br>realizacje
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
			Każdy projekt to indywidualna historia połączenia formy, funkcji i charakteru klienta.
		</p>

		<!-- Filter -->
		<div class="flex justify-center gap-4 flex-wrap">
			<button
				onclick={() => activeFilter = 'wszystkie'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'wszystkie' ? 'text-white shadow-lg' : 'bg-transparent text-gray-600 border-2 border-gray-200'}"
				style={activeFilter === 'wszystkie' ? `background-color: ${colorPalette.primary}; border-color: ${colorPalette.primary};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeFilter !== 'wszystkie') { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeFilter !== 'wszystkie') { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				Wszystkie
			</button>
			<button
				onclick={() => activeFilter = 'wnętrza'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'wnętrza' ? 'text-white shadow-lg' : 'bg-transparent text-gray-600 border-2 border-gray-200'}"
				style={activeFilter === 'wnętrza' ? `background-color: ${colorPalette.accent}; border-color: ${colorPalette.accent};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeFilter !== 'wnętrza') { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeFilter !== 'wnętrza') { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				Wnętrza
			</button>
			<button
				onclick={() => activeFilter = 'grafika'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'grafika' ? 'text-white shadow-lg' : 'bg-transparent text-gray-600 border-2 border-gray-200'}"
				style={activeFilter === 'grafika' ? `background-color: ${colorPalette.secondary}; border-color: ${colorPalette.secondary};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeFilter !== 'grafika') { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeFilter !== 'grafika') { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				Grafika
			</button>
		</div>
	</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
		{#each projects.filter(p => activeFilter === 'wszystkie' || p.category === activeFilter) as project, i}
			<div class="group observe hover-lift pb-3" style="animation-delay: {i * 100}ms">
				<div class="aspect-[4/5] bg-blue-100 relative overflow-hidden mb-8 rounded-2xl border-2 border-blue-100 transition-all duration-300" onmouseenter={(e) => e.currentTarget.style.borderColor = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.borderColor = 'rgb(243, 244, 246)'}>
					<img
						src={project.image}
						alt={project.title}
						class="w-full h-full object-cover"
					/>
					<div class="absolute inset-0 transition-all duration-500" style="background-color: {colorPalette.primary}; opacity: 0.1;" onmouseenter={(e) => e.currentTarget.style.opacity = '0.2'} onmouseleave={(e) => e.currentTarget.style.opacity = '0.1'}></div>
					<div class="absolute top-6 right-6 text-white px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg" style="background-color: {colorPalette.primary}">
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
					<div class="space-y-3 px-2 pt-2">
					<div class="flex items-center justify-between">
						<span class="text-xs uppercase tracking-wider font-black px-3 py-1 bg-blue-50 rounded-full" style="color: {colorPalette.primary}">
							{project.category === 'wnętrza' ? 'Wnętrza' : 'Grafika'}
						</span>
					</div>
					<h3 class="text-2xl font-black text-gray-900 transition-colors" style="font-family: 'Playfair Display', serif;" onmouseenter={(e) => e.currentTarget.style.color = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.color = 'rgb(31, 41, 55)'}>
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
<section id="kontakt" class="section bg-blue-50 relative overflow-hidden">
	<div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
		<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
		<div class="observe">
			<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">💬 Kontakt</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-gray-900" style="font-family: 'Playfair Display', serif;">
				Rozpocznijmy<br>
				<span class="italic" style="color: {colorPalette.accent}">współpracę</span>
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
						<a href="mailto:kontakt@pikastro.eu" class="text-lg text-gray-900 hover:text-[#FB7185] transition-colors">
							kontakt@pikastro.eu
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
				<a href="https://www.instagram.com/pikastro.design/" target="_blank" rel="noopener noreferrer" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} title="Instagram @pikastro.design">
					<span class="text-sm font-bold">ig</span>
				</a>
				<a href="https://www.linkedin.com/in/pikastro/" target="_blank" rel="noopener noreferrer" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} title="LinkedIn">
					<span class="text-sm font-bold">in</span>
				</a>
				<a href="https://www.behance.net/pikastro" target="_blank" rel="noopener noreferrer" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = colorPalette.secondary} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} title="Behance Portfolio">
					<span class="text-sm font-bold">be</span>
				</a>
				<a href="https://www.facebook.com/pikastro.design" target="_blank" rel="noopener noreferrer" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = '#1877F2'} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} title="Facebook">
					<span class="text-sm font-bold">fb</span>
				</a>
			</div>
		</div>

		<div class="bg-white p-10 lg:p-12 observe rounded-2xl border-2 border-blue-200 shadow-xl" style="border-color: rgb(239, 246, 255);">
			<form
				name="contact"
				method="POST"
				data-netlify="true"
				netlify-honeypot="bot-field"
				class="space-y-6"
				onsubmit={(e) => {
					e.preventDefault();
					formStatus = 'submitting';
					const formData = new FormData(e.currentTarget);

					fetch('/', {
						method: 'POST',
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams(formData).toString()
					})
					.then(() => {
						formStatus = 'success';
						formMessage = 'Dziękujemy! Wiadomość została wysłana. Odezwiemy się w ciągu 24h.';
						e.currentTarget.reset();
						setTimeout(() => { formStatus = 'idle'; formMessage = ''; }, 5000);
					})
					.catch(() => {
						formStatus = 'error';
						formMessage = 'Wystąpił błąd. Spróbuj ponownie lub napisz na kontakt@pikastro.eu';
						setTimeout(() => { formStatus = 'idle'; formMessage = ''; }, 5000);
					});
				}}
			>
				<!-- Netlify form name -->
				<input type="hidden" name="form-name" value="contact" />

				<!-- Honeypot for spam prevention -->
				<p class="hidden">
					<label>
						Don't fill this out: <input name="bot-field" />
					</label>
				</p>

				{#if formStatus === 'success'}
					<div class="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
						<p class="text-green-800 font-bold flex items-center gap-2">
							<span>✓</span>
							<span>{formMessage}</span>
						</p>
					</div>
				{/if}

				{#if formStatus === 'error'}
					<div class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
						<p class="text-red-800 font-bold flex items-center gap-2">
							<span>⚠</span>
							<span>{formMessage}</span>
						</p>
					</div>
				{/if}

				<div>
					<label for="name" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Imię i nazwisko *</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
						placeholder="Jan Kowalski"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Email *</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
						placeholder="jan@example.com"
					/>
				</div>

				<div>
					<label for="phone" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Telefon (opcjonalnie)</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
						placeholder="+48 123 456 789"
					/>
				</div>

				<div>
					<label for="project" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Typ projektu *</label>
					<select
						id="project"
						name="project"
						required
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white"
					>
						<option value="">Wybierz...</option>
						<option>Pojedyncze pomieszczenie (sypialnia, salon, etc.)</option>
						<option>Pełne mieszkanie (2-3 pokoje)</option>
						<option>Przestrzeń biznesowa (biuro, kawiarnia, etc.)</option>
						<option>Identyfikacja wizualna / Grafika</option>
						<option>Konsultacja projektowa</option>
						<option>Inne</option>
					</select>
				</div>

				<div>
					<label for="message" class="block text-sm uppercase tracking-wider font-bold text-gray-700 mb-2">Wiadomość *</label>
					<textarea
						id="message"
						name="message"
						required
						rows="5"
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white resize-none"
						placeholder="Opowiedz o swoim projekcie... Jaka przestrzeń? Jaki budżet? Kiedy start?"
					></textarea>
				</div>

				<button
					type="submit"
					class="w-full btn disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={formStatus === 'submitting'}
				>
					{formStatus === 'submitting' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
				</button>

				<p class="text-xs text-gray-500 text-center">
					* Pola wymagane. Odpowiadamy w ciągu 24h w dni robocze.
				</p>
			</form>
		</div>
	</div>
</section>

<!-- Sticky Consultation Button -->
{#if showStickyButton}
	<div class="fixed bottom-8 right-8 z-40 animate-fade-in-up">
		<a
			href="#kontakt"
			class="flex items-center gap-3 px-6 py-4 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-bold text-sm group"
			style="background: linear-gradient(135deg, {colorPalette.primary}, {colorPalette.accent});"
		>
			<span class="hidden sm:inline">Umów Konsultację</span>
			<span class="sm:hidden">Kontakt</span>
			<svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
			</svg>
		</a>
	</div>
{/if}

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
					<li>kontakt@pikastro.eu</li>
					<li>Kraków, Polska</li>
					<li class="pt-2">
						<a href="/o-mnie" class="text-[#FB7185] hover:text-white transition-colors">O mnie</a> •
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
