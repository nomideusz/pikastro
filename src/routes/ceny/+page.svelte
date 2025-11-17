<script lang="ts">
	import '../../app.css';

	// Import color extraction utilities
	import { extractColorsFromImage, assignColorRoles, type ColorPalette } from '$lib/utils/colorExtractor';
	import colorsImg from '$lib/assets/images/colors.jpeg';
	import { t, localeStore, getLocale } from '$lib/i18n';
	import { pricingTiers } from '$lib/data/pricing';

	// Color palette extracted from colors image - Eclectic Maximalism
	let colorPalette = $state<ColorPalette>({
		primary: '#27275B',      // Deep Navy Blue
		accent: '#F32A61',       // Hot Magenta
		secondary: '#1DA898',    // Turquoise
		success: '#F2A23E',      // Golden Orange
		tertiary: '#F5848E'      // Coral Pink
	});

	// Reactive translation function
	let currentLocale = $state(getLocale());

	// Subscribe to locale changes
	$effect(() => {
		const unsubscribe = localeStore.subscribe(() => {
			currentLocale = getLocale();
		});
		return unsubscribe;
	});

	// Translate function that reacts to locale changes
	function translate(key: string): string {
		void currentLocale; // Access to create reactive dependency
		return t(key);
	}

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
	<title>{translate('meta.pricing.title')}</title>
	<meta name="description" content={translate('meta.pricing.description')} />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[70vh] flex items-center gradient-bg text-white overflow-hidden">
	<!-- Animated AI Network Background -->
	<div class="absolute inset-0">
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
				<p class="font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text" style="color: {colorPalette.accent}">{translate('pricing.page.label')}</p>
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
					{translate('pricing.page.heading')}<br>
					<span style="color: #00D4FF;">{translate('pricing.page.headingAccent')}</span>
				</h1>
				<p class="text-xl md:text-2xl font-bold mb-4 text-white/90 leading-tight">
					{translate('pricing.page.tagline')}
				</p>
				<p class="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed text-gray-100">
					{translate('pricing.page.description')}
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Design Journeys Section - Maximalism -->
<section class="section bg-white relative overflow-hidden">
	<!-- Colorful background elements - Maximalism -->
	<div class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.tertiary}"></div>
	<div class="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.secondary}"></div>
	<div class="absolute top-1/2 right-1/3 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-15" style="background-color: {colorPalette.success}"></div>

	<div class="space-y-16 relative z-10 max-w-7xl mx-auto">
		{#each pricingTiers as journey, i}
			<div class="observe" style="animation-delay: {i * 200}ms">
				<div class="bg-white rounded-3xl shadow-sm border border-[#27275b]/10 overflow-hidden transition-all duration-500 hover:shadow-2xl {journey.highlight ? 'ring-2 ring-offset-4' : ''}" style={journey.highlight ? `ring-color: ${colorPalette.primary}; --tw-ring-offset-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);` : ''}>

					<!-- Journey Header -->
					<div class="relative">
						{#if journey.highlight}
							<div class="absolute top-0 left-0 right-0 h-2 rounded-full" style="background-color: {colorPalette.accent};"></div>
						{/if}

						<div class="p-8 lg:p-12">
							<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
								<div class="flex-1">
									<h3 class="text-3xl lg:text-4xl font-black mb-2" style="font-family: 'Playfair Display', serif; color: {journey.highlight ? colorPalette.primary : '#27275b'}">
										{translate(journey.titleKey)}
									</h3>
									<p class="text-lg font-medium mb-3 text-[#27275b]/80">{translate(journey.subtitleKey)}</p>
									<p class="text-[#27275b]/90 leading-relaxed max-w-2xl">
										{translate(journey.descriptionKey)}
									</p>
								</div>

								<!-- Investment & Duration -->
								<div class="lg:text-right">
									<div class="inline-block p-6 bg-[#27275b]/5 rounded-2xl border border-[#27275b]/10">
										<div class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1 font-bold">{translate('pricing.page.investmentLabel')}</div>
										<div class="text-2xl font-black mb-2" style="color: {colorPalette.primary}">{translate(journey.investmentKey)}</div>
										<div class="text-sm text-[#27275b]/80">{translate(journey.titleKey + 'Duration') || journey.duration}</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Process Steps -->
					<div class="px-8 lg:px-12 pb-12">
						<div class="border-t border-[#27275b]/10 pt-8">
							<h4 class="text-lg font-bold mb-6 text-[#27275b]">{translate('pricing.page.processLabel')}</h4>
							<div class="grid md:grid-cols-2 gap-6">
								{#each journey.processKeys as processKey, stepIndex}
									<div class="flex items-start gap-4">
										<div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style="background-color: {colorPalette.primary}; color: white;">
											{stepIndex + 1}
										</div>
										<p class="text-[#27275b]/90 leading-relaxed">{translate(processKey)}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- CTA -->
						<div class="mt-8 pt-8 border-t border-[#27275b]/10 text-center">
							<p class="text-sm text-[#27275b]/70 mb-4">{translate('pricing.page.ctaQuestion')}</p>
							<a href="/#kontakt" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm group" style="background-color: {colorPalette.secondary}; color: {colorPalette.primary};">
								<span>{translate('pricing.page.ctaButton')} {translate(journey.titleKey).toLowerCase()}</span>
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
		<div class="p-8 lg:p-12 rounded-3xl border-4" style="background-color: rgba(29, 168, 152, 0.05); border-color: {colorPalette.secondary};">
			<h3 class="text-3xl lg:text-4xl font-black mb-4" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">
				{translate('pricing.page.everyProjectHeading')}
			</h3>
			<p class="text-lg text-[#27275b]/90 mb-8 leading-relaxed">
				{translate('pricing.page.everyProjectDescription')}
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a href="/#kontakt" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm" style="background-color: {colorPalette.secondary}; color: {colorPalette.primary};">
					<span>{translate('pricing.page.ctaConsultation')}</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
					</svg>
				</a>
				<div class="text-sm text-[#27275b]/70">
					{translate('pricing.page.consultationDetails')}
				</div>
			</div>
		</div>
	</div>
</section>
