<script lang="ts">
	import '../../app.css';

	// Import color extraction utilities
	import { extractColorsFromImage, assignColorRoles, type ColorPalette } from '$lib/utils/colorExtractor';
	import colorsImg from '$lib/assets/images/colors.jpeg';
	import magdaPhoto from '$lib/assets/images/magda.jpg';

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

<svelte:head>
	<title>O mnie - Magda Makaruk | Projektantka Wnętrz i Grafiki | Kraków</title>
	<meta name="description" content="Poznaj Magdę Makaruk - doświadczoną projektantkę wnętrz i grafiki komputerowej. Łączę wiedzę architektoniczną z kreatywnością plastyczną i technologią AI. Kraków." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[70vh] flex items-center gradient-bg text-white overflow-hidden">
	<!-- Animated AI Network Background -->
	<div class="absolute inset-0">
		<div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
		<!-- AI Neural Network Lines -->
		<svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
			<!-- Animated connecting lines -->
			<line x1="10%" y1="20%" x2="30%" y2="40%" stroke={colorPalette.accent} stroke-width="2" class="animate-pulse-slow" />
			<line x1="30%" y1="40%" x2="50%" y2="30%" stroke={colorPalette.secondary} stroke-width="2" class="animate-pulse-slow" style="animation-delay: 0.5s" />
			<line x1="50%" y1="30%" x2="70%" y2="50%" stroke={colorPalette.primary} stroke-width="2" class="animate-pulse-slow" style="animation-delay: 1s" />
			<line x1="70%" y1="50%" x2="90%" y2="35%" stroke={colorPalette.accent} stroke-width="2" class="animate-pulse-slow" style="animation-delay: 1.5s" />
		</svg>
	</div>

	<!-- Floating gradient blobs -->
	<div class="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style="background-color: {colorPalette.accent}"></div>
	<div class="absolute bottom-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style="background-color: {colorPalette.primary}; animation-delay: 1s;"></div>

	<div class="section relative z-10">
		<div class="max-w-4xl">
			<div class="mb-8 observe">
				<p class="font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text" style="color: {colorPalette.accent}">👋 O mnie</p>
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
					Magda<br>
					<span style="color: #FF6B9D;">Makaruk</span>
				</h1>
				<p class="text-xl md:text-2xl font-bold mb-4 text-white/90 leading-tight">
					Projektantka Wnętrz & Grafiki Komputerowej
				</p>
				<p class="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed text-gray-100">
					Łączę wiedzę architektoniczną z kreatywnością plastyczną i najnowszymi technologiami AI,
					tworząc funkcjonalne przestrzenie i unikalne identyfikacje wizualne.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- About Content -->
<section class="section bg-white">
	<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
		<div class="observe">
			<div class="aspect-[3/4] bg-blue-100 relative overflow-hidden rounded-2xl shadow-2xl group">
				<img
					src={magdaPhoto}
					alt="Magda Makaruk - Projektantka Wnętrz i Grafiki"
					class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>
		</div>

		<div class="space-y-8 observe">
			<div>
				<h2 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
					Doświadczenie<br>
					<span style="color: #00D4FF;">i Pasja</span>
				</h2>
				<div class="space-y-6 text-gray-600 leading-relaxed text-lg">
					<p>
						Jestem projektantką wnętrz i graficzką komputerową z wieloletnim doświadczeniem w branży kreatywnej.
						Moje podejście łączy solidne podstawy architektoniczne z nowoczesnymi technologiami i głębokim
						zrozumieniem potrzeb klientów.
					</p>
					<p>
						Specjalizuję się w projektowaniu przestrzeni mieszkalnych i komercyjnych, tworząc rozwiązania
						funkcjonalne i estetyczne. Moja praca graficzna obejmuje kompleksowe identyfikacje wizualne,
						materiały reklamowe i projekty specjalizowane.
					</p>
					<p>
						<strong style="color: {colorPalette.primary}">Kluczowe kompetencje:</strong> AutoCAD, SketchUp, Adobe Creative Suite, 3ds Max, V-Ray, Lumion.
						Doświadczenie w BIM, projektowaniu zrównoważonym i technologii AI wspomagającej proces kreatywny.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Skills & Expertise -->
<section class="section bg-blue-50">
	<div class="text-center mb-16 observe">
		<p class="font-black tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">🛠️ Umiejętności</p>
		<h2 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Kompetencje<br>
			<span style="color: {colorPalette.primary}">Techniczne</span>
		</h2>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
		<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group">
			<div class="text-4xl mb-4">🏗️</div>
			<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Projektowanie Architektury</h3>
			<p class="text-gray-600 leading-relaxed">
				Kompleksowe projekty architektoniczne od koncepcji po dokumentację wykonawczą.
				Doświadczenie w projektach mieszkalnych, komercyjnych i publicznych.
			</p>
			<ul class="mt-4 space-y-2 text-sm text-gray-600">
				<li>• AutoCAD & ArchiCAD</li>
				<li>• SketchUp & 3ds Max</li>
				<li>• BIM & dokumentacja</li>
			</ul>
		</div>

		<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group">
			<div class="text-4xl mb-4">🎨</div>
			<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Grafika Komputerowa</h3>
			<p class="text-gray-600 leading-relaxed">
				Identyfikacje wizualne, materiały reklamowe, ilustracje i projekty specjalizowane.
				Ponad 50 zrealizowanych projektów brandingowych.
			</p>
			<ul class="mt-4 space-y-2 text-sm text-gray-600">
				<li>• Adobe Creative Suite</li>
				<li>• Branding & Visual Identity</li>
				<li>• Print & Digital Design</li>
			</ul>
		</div>

		<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group">
			<div class="text-4xl mb-4">🤖</div>
			<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Technologia AI</h3>
			<p class="text-gray-600 leading-relaxed">
				Wykorzystanie sztucznej inteligencji do przyspieszenia procesów projektowych i generowania
				innowacyjnych rozwiązań. Optymalizacja kosztów i czasu realizacji.
			</p>
			<ul class="mt-4 space-y-2 text-sm text-gray-600">
				<li>• AI-assisted design</li>
				<li>• Generative workflows</li>
				<li>• Process optimization</li>
			</ul>
		</div>

		<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group">
			<div class="text-4xl mb-4">🌱</div>
			<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Projektowanie Zrównoważone</h3>
			<p class="text-gray-600 leading-relaxed">
				Ekologiczne podejście do projektowania. Wybór materiałów przyjaznych środowisku,
				optymalizacja energetyczna i świadome wykorzystanie przestrzeni.
			</p>
			<ul class="mt-4 space-y-2 text-sm text-gray-600">
				<li>• Green materials</li>
				<li>• Energy efficiency</li>
				<li>• Sustainable design</li>
			</ul>
		</div>

		<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group">
			<div class="text-4xl mb-4">💼</div>
			<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Zarządzanie Projektami</h3>
			<p class="text-gray-600 leading-relaxed">
				Koordynacja prac, współpraca z wykonawcami, nadzór autorski nad realizacją.
				Ponad 50 zakończonych projektów z pełnym nadzorem.
			</p>
			<ul class="mt-4 space-y-2 text-sm text-gray-600">
				<li>• Project coordination</li>
				<li>• Contractor management</li>
				<li>• Quality control</li>
			</ul>
		</div>

		<div class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group">
			<div class="text-4xl mb-4">👥</div>
			<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Doradztwo Kreatywne</h3>
			<p class="text-gray-600 leading-relaxed">
				Kompleksowe konsultacje projektowe, analiza potrzeb, strategia aranżacyjna.
				Indywidualne podejście do każdego klienta i projektu.
			</p>
			<ul class="mt-4 space-y-2 text-sm text-gray-600">
				<li>• Creative consulting</li>
				<li>• Needs assessment</li>
				<li>• Design strategy</li>
			</ul>
		</div>
	</div>
</section>

<!-- Education & Experience -->
<section class="section bg-white">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-16 observe">
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				<span style="color: {colorPalette.primary}">Edukacja</span> i Doświadczenie
			</h2>
		</div>

		<div class="space-y-12">
			<div class="observe">
				<h3 class="text-2xl font-black mb-4" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Wykształcenie</h3>
				<div class="bg-blue-50 p-6 rounded-xl border-l-4" style="border-color: {colorPalette.accent}">
					<h4 class="text-lg font-bold mb-2">Architektura i Urbanistyka</h4>
					<p class="text-gray-600 mb-2">Politechnika Krakowska</p>
					<p class="text-sm text-gray-500">Specjalizacja: Projektowanie Wnętrz i Architektura Krajobrazu</p>
				</div>
			</div>

			<div class="observe">
				<h3 class="text-2xl font-black mb-4" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">Doświadczenie Zawodowe</h3>
				<div class="space-y-6">
					<div class="bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
						<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
							<h4 class="text-lg font-bold" style="color: {colorPalette.primary}">Pikastro - Właścicielka</h4>
							<span class="text-sm text-gray-500 mt-1 md:mt-0">2020 - obecnie</span>
						</div>
						<p class="text-gray-600 mb-3">
							Założenie i prowadzenie własnej pracowni projektowej specjalizującej się w projektowaniu wnętrz i grafice komputerowej.
							Realizacja ponad 50 projektów dla klientów indywidualnych i biznesowych.
						</p>
						<div class="flex flex-wrap gap-2">
							<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Projektowanie Wnętrz</span>
							<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Grafika Komputerowa</span>
							<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Nadzór Projektowy</span>
						</div>
					</div>

					<div class="bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
						<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
							<h4 class="text-lg font-bold" style="color: {colorPalette.primary}">Studio Architektury XYZ</h4>
							<span class="text-sm text-gray-500 mt-1 md:mt-0">2018 - 2020</span>
						</div>
						<p class="text-gray-600 mb-3">
							Projektantka wnętrz w renomowanym studiu architektonicznym. Uczestnictwo w projektach mieszkalnych,
							komercyjnych i publicznych. Współpraca z klientami premium.
						</p>
						<div class="flex flex-wrap gap-2">
							<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Projektowanie Architektury</span>
							<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Współpraca Zespółowa</span>
							<span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Klient Premium</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Philosophy & Approach -->
<section class="section gradient-bg text-white relative overflow-hidden">
	<div class="absolute top-10 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="background-color: {colorPalette.accent}"></div>
	<div class="absolute bottom-10 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="background-color: {colorPalette.secondary}; animation-delay: 1.5s;"></div>

	<div class="max-w-4xl mx-auto text-center observe relative z-10">
		<h2 class="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight" style="font-family: 'Playfair Display', serif;">
			<span style="color: #FF6B9D;">Filozofia</span> Projektowania
		</h2>

		<div class="grid md:grid-cols-2 gap-8 mb-12">
			<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
				<div class="text-4xl mb-4">🎯</div>
				<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif;">Funkcjonalność przede wszystkim</h3>
				<p class="text-gray-200 leading-relaxed">
					Piękno bez funkcjonalności to tylko dekoracja. Każdy projekt musi przede wszystkim działać
					dla swoich użytkowników - być wygodny, praktyczny i bezpieczny.
				</p>
			</div>

			<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
				<div class="text-4xl mb-4">🌈</div>
				<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif;">Osobowość przestrzeni</h3>
				<p class="text-gray-200 leading-relaxed">
					Każda przestrzeń powinna odzwierciedlać charakter swojego właściciela.
					Tworzę miejsca, które opowiadają historię i wyrażają indywidualność.
				</p>
			</div>

			<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
				<div class="text-4xl mb-4">⚡</div>
				<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif;">Innowacja technologiczna</h3>
				<p class="text-gray-200 leading-relaxed">
					Wykorzystuję najnowsze technologie, w tym AI, aby przyspieszyć procesy projektowe
					i osiągnąć lepsze rezultaty w krótszym czasie.
				</p>
			</div>

			<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
				<div class="text-4xl mb-4">🤝</div>
				<h3 class="text-xl font-black mb-3" style="font-family: 'Playfair Display', serif;">Partnerstwo z klientem</h3>
				<p class="text-gray-200 leading-relaxed">
					Projekt to wspólna podróż. Słucham, doradzam i wspólnie tworzymy rozwiązanie
					doskonale dopasowane do potrzeb i marzeń klienta.
				</p>
			</div>
		</div>

		<div class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-2xl mx-auto">
			<blockquote class="text-xl md:text-2xl font-light italic mb-4" style="font-family: 'Playfair Display', serif;">
				"Dobry design to nie tylko piękne formy, ale przede wszystkim rozwiązania problemów."
			</blockquote>
			<p class="font-bold" style="color: #00D4FF;">— Magda Makaruk</p>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section bg-blue-50">
	<div class="max-w-4xl mx-auto text-center observe">
		<h2 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			Gotowa na<br>
			<span style="color: #FF6B9D;">współpracę?</span>
		</h2>
		<p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
			Masz pomysł na projekt? Chcesz stworzyć wyjątkową przestrzeń lub odświeżyć identyfikację wizualną?
			Skontaktuj się ze mną - razem stworzymy coś niesamowitego.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/#kontakt" class="btn">
				Umów Konsultację
			</a>
			<a href="/#portfolio" class="btn-secondary">
				Zobacz Portfolio
			</a>
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
					<li>kontakt@pikastro.eu</li>
					<li>Kraków, Polska</li>
					<li class="pt-2">
						<a href="/o-mnie" class="text-[#FB7185] hover:text-white transition-colors">O mnie</a> •
						<a href="/#oferta" class="text-[#FB7185] hover:text-white transition-colors">Oferta</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="pt-8 border-t border-white/20 text-center text-sm text-gray-300">
			<p class="font-medium">&copy; 2025 Pikastro. Wszystkie prawa zastrzeżone.</p>
		</div>
	</div>
</footer>
