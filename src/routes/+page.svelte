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
	import vid02 from '$lib/assets/videos/vid02.mp4';

	// Import i18n
	import { t, locale, getT } from '$lib/i18n';

	// Import color extraction utilities
	import { extractColorsFromImage, assignColorRoles, type ColorPalette } from '$lib/utils/colorExtractor';
	import { validateForm, validateField, type FormValidationResult, type ValidationField } from '$lib/utils/validation';

// Use t store directly - it should work with proper initialization

	// Color palette extracted from colors image - Eclectic Maximalism
	let colorPalette = $state<ColorPalette>({
		primary: '#27275B',      // Deep Navy Blue
		accent: '#F32A61',       // Hot Magenta
		secondary: '#1DA898',    // Turquoise
		success: '#F2A23E',      // Golden Orange
		tertiary: '#F5848E'      // Coral Pink
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

	// Ensure videos play properly
	$effect(() => {
		if (typeof window !== 'undefined' && vid02Element) {
			// Ensure vid02 keeps playing
			const checkVideo = () => {
				if (vid02Element && vid02Element.paused) {
					vid02Element.play().catch(error => {
						console.warn('Video autoplay failed:', error);
					});
				}
			};

			// Check immediately and then periodically
			setTimeout(checkVideo, 100);
			const interval = setInterval(checkVideo, 2000); // Check every 2 seconds

			return () => clearInterval(interval); // Cleanup on effect destroy
		}
	});

	// Contact form state - use default value, will be updated reactively
	let defaultProjectType = 'Projektowanie wnętrz'; // Default fallback
	let formData = $state({
		name: '',
		email: '',
		project: defaultProjectType,
		message: ''
	});

	// Update project type when t is available
	$effect(() => {
		try {
			const projectType = getT('home.form.projectType');
			if (projectType && formData.project === defaultProjectType) {
				formData.project = projectType;
			}
		} catch (e) {
			// t not ready yet, keep default
		}
	});

	let formStatus = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let formMessage = $state<string>('');

	// Validation state
	let validationErrors = $state<FormValidationResult>({
		name: { isValid: true },
		email: { isValid: true },
		message: { isValid: true },
		isFormValid: true
	});

	let touchedFields = $state<{[key in ValidationField]: boolean}>({
		name: false,
		email: false,
		message: false
	});
	let isValidating = $state(false);

	// Submit button text - use getT for SSR safety
	const submitButtonText = $derived.by(() => {
		if (formStatus === 'submitting') return getT('home.form.submit.sending');
		if (!validationErrors.isFormValid && (touchedFields.name || touchedFields.email || touchedFields.message)) {
			return getT('home.form.submit.fixErrors');
		}
		return getT('home.form.submit.send');
	});

	// Project category text - use getT for SSR safety
	const getProjectCategoryText = (category: string) => {
		return category === 'wnętrza' ? getT('home.portfolio.categoryInteriors') : getT('home.portfolio.categoryGraphics');
	};


	// Video references for playback control
	let vid02Element: HTMLVideoElement;

	// Validation functions
	function validateFieldRealTime(field: ValidationField, value: string) {
		const result = validateField(field, value);
		validationErrors[field] = result;
		validationErrors.isFormValid = validationErrors.name.isValid &&
			validationErrors.email.isValid &&
			validationErrors.message.isValid;
		return result;
	}

	function validateAllFields() {
		const result = validateForm(formData);
		validationErrors = result;
		return result;
	}

	function markFieldAsTouched(field: ValidationField) {
		touchedFields[field] = true;
		validateFieldRealTime(field, formData[field]);
	}

	function handleFieldBlur(field: ValidationField) {
		markFieldAsTouched(field);
	}

	function handleFieldInput(field: ValidationField, value: string) {
		formData[field] = value;

		// Only validate if field has been touched
		if (touchedFields[field]) {
			validateFieldRealTime(field, value);
		}
	}

	// Ensure video continues playing
	function ensureVideoPlays(videoElement: HTMLVideoElement) {
		if (videoElement && videoElement.paused) {
			videoElement.play().catch(error => {
				console.warn('Video autoplay failed:', error);
			});
		}
	}

	// Form submission handler
	async function handleSubmit(event: Event) {
		event.preventDefault();

		// Mark all fields as touched for validation
		markFieldAsTouched('name');
		markFieldAsTouched('email');
		markFieldAsTouched('message');

		// Validate all fields before submission
		const validation = validateAllFields();
		if (!validation.isFormValid) {
			formStatus = 'error';
			formMessage = getT('home.form.error');
			return;
		}

		formStatus = 'submitting';
		formMessage = '';

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (response.ok) {
				formStatus = 'success';
				formMessage = getT('home.form.success');
				// Reset form
				let resetProjectType = defaultProjectType;
				try {
					resetProjectType = getT('home.form.projectType');
				} catch (e) {
					// t not ready, use default
				}
				formData = {
					name: '',
					email: '',
					project: resetProjectType,
					message: ''
				};
				// Reset validation state
				validationErrors = {
					name: { isValid: true },
					email: { isValid: true },
					message: { isValid: true },
					isFormValid: true
				};
				touchedFields = {
					name: false,
					email: false,
					message: false
				};
				// Ensure video continues playing after form submission
				setTimeout(() => ensureVideoPlays(vid02Element), 100);
			} else {
				formStatus = 'error';
				formMessage = result.error || getT('home.form.errorGeneric');
			}
		} catch (error) {
			formStatus = 'error';
			formMessage = getT('home.form.errorNetwork');
			console.error('Form submission error:', error);
		}
	}

	// Before/After showcase data - use getT for SSR safety, reactive to locale changes
	const beforeAfterProjects = $derived.by(() => {
		// Access $locale to make this reactive to locale changes
		const _ = $locale;
		const translate = getT;
		return [
			{
				title: translate('beforeAfter.project1.title'),
				before: img01,
				after: img02,
				description: translate('beforeAfter.project1.description'),
				aiFeatures: [translate('beforeAfter.project1.feature1'), translate('beforeAfter.project1.feature2'), translate('beforeAfter.project1.feature3')]
			},
			{
				title: translate('beforeAfter.project2.title'),
				before: img03,
				after: img04,
				description: translate('beforeAfter.project2.description'),
				aiFeatures: [translate('beforeAfter.project2.feature1'), translate('beforeAfter.project2.feature2'), translate('beforeAfter.project2.feature3')]
			},
			{
				title: translate('beforeAfter.project3.title'),
				before: img05,
				after: img06,
				description: translate('beforeAfter.project3.description'),
				aiFeatures: [translate('beforeAfter.project3.feature1'), translate('beforeAfter.project3.feature2'), translate('beforeAfter.project3.feature3')]
			}
		];
	});

	// Process steps - use getT for SSR safety, reactive to locale changes
	const processSteps = $derived.by(() => {
		// Access $locale to make this reactive to locale changes
		const _ = $locale;
		const translate = getT;
		return [
			{
				number: '01',
				title: translate('process.consultation.title'),
				description: translate('process.consultation.description'),
				duration: '1-2 dni',
				icon: '01'
			},
			{
				number: '02',
				title: translate('process.prototyping.title'),
				description: translate('process.prototyping.description'),
				duration: '2-3 dni',
				icon: '02'
			},
			{
				number: '03',
				title: translate('process.refinement.title'),
				description: translate('process.refinement.description'),
				duration: '3-5 dni',
				icon: '03'
			},
			{
				number: '04',
				title: translate('process.documentation.title'),
				description: translate('process.documentation.description'),
				duration: '2-3 dni',
				icon: '04'
			}
		];
	});

	// Portfolio data - professionally curated projects - use getT for SSR safety, reactive to locale changes
	const projects = $derived.by(() => {
		// Access $locale to make this reactive to locale changes
		const _ = $locale;
		const translate = getT;
		return [
			{
				title: translate('portfolio.scandinavianApartment.title'),
				description: translate('portfolio.scandinavianApartment.description'),
				technologies: ['AutoCAD', 'SketchUp', 'V-Ray', '3ds Max'],
				image: img07,
				category: 'wnętrza',
				year: '2024'
			},
			{
				title: translate('portfolio.studioIdentity.title'),
				description: translate('portfolio.studioIdentity.description'),
				technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Print Design'],
				image: colorsImg,
				category: 'grafika',
				year: '2024'
			},
			{
				title: translate('portfolio.coworkingSpace.title'),
				description: translate('portfolio.coworkingSpace.description'),
				technologies: ['3D Modeling', 'Space Planning', 'Smart Solutions'],
				image: img08,
				category: 'wnętrza',
				year: '2023'
			},
			{
				title: translate('portfolio.modernHouse.title'),
				description: translate('portfolio.modernHouse.description'),
				technologies: ['ArchiCAD', 'Lumion', 'Sustainable Design'],
				image: img09,
				category: 'wnętrza',
				year: '2023'
			},
			{
				title: translate('portfolio.cafeConcept.title'),
				description: translate('portfolio.cafeConcept.description'),
				technologies: ['Interior Design', 'Branding', 'Visual Identity'],
				image: img10,
				category: 'grafika',
				year: '2024'
			},
			{
				title: translate('portfolio.industrialLoft.title'),
				description: translate('portfolio.industrialLoft.description'),
				technologies: ['Adaptive Reuse', 'Industrial Design', 'BIM'],
				image: img11,
				category: 'wnętrza',
				year: '2023'
			}
		];
	});

	const services = $derived.by(() => {
		// Access $locale to make this reactive to locale changes
		const _ = $locale;
		const translate = getT;
		return [
			{
				title: translate('services.interiorDesign.title'),
				description: translate('services.interiorDesign.description'),
				icon: '',
				features: [
					translate('services.interiorDesign.feature1'),
					translate('services.interiorDesign.feature2'),
					translate('services.interiorDesign.feature3'),
					translate('services.interiorDesign.feature4'),
					translate('services.interiorDesign.feature5')
				]
			},
			{
				title: translate('services.graphicDesign.title'),
				description: translate('services.graphicDesign.description'),
				icon: '○',
				features: [
					translate('services.graphicDesign.feature1'),
					translate('services.graphicDesign.feature2'),
					translate('services.graphicDesign.feature3'),
					translate('services.graphicDesign.feature4')
				]
			},
			{
				title: translate('services.aiTechnology.title'),
				description: translate('services.aiTechnology.description'),
				icon: '△',
				features: [
					translate('services.aiTechnology.feature1'),
					translate('services.aiTechnology.feature2'),
					translate('services.aiTechnology.feature3'),
					translate('services.aiTechnology.feature4')
				]
			}
		];
	});

	let activeFilter = $state('wszystkie');
	let activeBeforeAfter = $state(0);
	let sliderPosition = $state(50); // percentage for before/after slider
	let isDragging = $state(false);
	let sliderContainer: HTMLDivElement | null = null;

	// Handle slider position update from mouse/touch events
	function updateSliderPosition(event: MouseEvent | TouchEvent) {
		if (!sliderContainer) return;

		const rect = sliderContainer.getBoundingClientRect();
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const x = clientX - rect.left;
		const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
		sliderPosition = percentage;
	}

	// Mouse events
	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		updateSliderPosition(event);
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			updateSliderPosition(event);
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Touch events
	function handleTouchStart(event: TouchEvent) {
		isDragging = true;
		updateSliderPosition(event);
	}

	function handleTouchMove(event: TouchEvent) {
		if (isDragging) {
			event.preventDefault(); // Prevent scrolling while dragging
			updateSliderPosition(event);
		}
	}

	function handleTouchEnd() {
		isDragging = false;
	}

	// Keyboard support for accessibility
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			sliderPosition = Math.max(0, sliderPosition - 5);
			event.preventDefault();
		} else if (event.key === 'ArrowRight') {
			sliderPosition = Math.min(100, sliderPosition + 5);
			event.preventDefault();
		}
	}

	// Add global mouse/touch up listeners
	$effect(() => {
		if (typeof window !== 'undefined') {
			const globalMouseUp = () => {
				if (isDragging) {
					isDragging = false;
				}
			};

			window.addEventListener('mouseup', globalMouseUp);
			window.addEventListener('touchend', globalMouseUp);

			return () => {
				window.removeEventListener('mouseup', globalMouseUp);
				window.removeEventListener('touchend', globalMouseUp);
			};
		}
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

<svelte:head>
	<title>Pikastro - Projektowanie Wnętrz AI | Grafika | Kraków</title>
	<meta name="description" content="Projektowanie wnętrz i grafika z AI dla młodych (20-30 lat). Odważne, kolorowe aranżacje mieszkań zamiast beżowo-szarych. Kompleksowa obsługa w Krakowie - szybko i w atrakcyjnych cenach." />
</svelte:head>

<!-- Hero Section with AI Visualization - Eclectic Maximalism -->
<section class="relative flex items-center text-white overflow-hidden min-h-screen md:h-screen" style="background-color: {colorPalette.primary};">
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
		<div class="absolute inset-0 opacity-40 transition-all duration-1000" style="background-color: {colorPalette.primary}"></div>
	</div>
		<!-- Animated AI Network Background -->
		<div class="absolute inset-0 z-[2]">
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

	<!-- Floating color blobs - Maximalism -->
	<div class="absolute top-10 right-5 w-48 h-48 md:top-20 md:right-20 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.accent}"></div>
	<div class="absolute bottom-10 left-5 w-56 h-56 md:bottom-20 md:left-20 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.success}; animation-delay: 1s;"></div>
	<div class="absolute top-1/2 left-1/2 w-48 h-48 md:w-80 md:h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.secondary}; animation-delay: 2s;"></div>
	<div class="absolute top-20 left-1/4 w-40 h-40 md:top-40 md:w-64 md:h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.tertiary}; animation-delay: 0.5s;"></div>

	<div class="relative z-20 px-4 md:px-6 lg:px-12 py-8 md:py-24 max-w-7xl mx-auto">
		<div class="max-w-5xl">
			<div class="mb-8 md:mb-8 observe animate-fade-in-up">
				<p class="font-bold tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text" style="color: {colorPalette.accent}">{getT('home.hero.label')}</p>
				<h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05]" style="font-family: 'Playfair Display', serif;">
					<span class="block">{getT('home.hero.heading1')}</span>
					<span class="block">{getT('home.hero.heading2')}</span>
				</h1>
				<p class="text-2xl md:text-3xl font-bold mb-4 leading-tight" style="color: #FF6B9D;">
					{getT('home.hero.tagline')}
				</p>
			</div>
				<p class="text-lg md:text-2xl mb-8 max-w-3xl leading-relaxed text-gray-100 observe animate-fade-in-up" style="animation-delay: 0.2s; font-weight: 400;">
				{getT('home.hero.description')}
			</p>

			<!-- Value Props -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 observe animate-fade-in-up max-w-3xl" style="animation-delay: 0.4s;">
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="font-black text-lg text-white">{getT('home.hero.valueProps.time')}</div>
					<div class="text-white/80 text-sm">{getT('home.hero.valueProps.timeVs')}</div>
				</div>
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="font-black text-lg neon-text" style="color: {colorPalette.accent}">{getT('home.hero.valueProps.variants')}</div>
					<div class="text-white/80 text-sm">{getT('home.hero.valueProps.variantsDesc')}</div>
				</div>
				<div class="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
					<div class="font-black text-lg text-white">{getT('home.hero.valueProps.price')}</div>
					<div class="text-white/80 text-sm">{getT('home.hero.valueProps.priceDesc')}</div>
				</div>
			</div>

		</div>
	</div>
	<div class="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: {colorPalette.accent}">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</section>

<!-- Video Section - Transform Your Space -->
<section class="relative w-full h-screen overflow-hidden">
	<!-- Full Width Video Background -->
	<video
		bind:this={vid02Element}
		autoplay
		loop
		muted
		playsinline
		class="absolute inset-0 w-full h-full object-cover"
		onended={() => ensureVideoPlays(vid02Element)}
	>
		<source src={vid02} type="video/mp4" />
	</video>

	<!-- Overlay for better text readability -->
	<div class="absolute inset-0 bg-black/40"></div>

	<!-- Centered Text Content -->
	<div class="relative z-10 flex items-center justify-center h-full">
		<div class="text-center text-white px-6 max-w-4xl">
			<h2 class="text-3xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				{getT('home.video.heading')}<br>
				<span style="color: {colorPalette.accent}">{getT('home.video.headingAccent')}</span><br>
				{getT('home.video.headingEnd')}
			</h2>
			<p class="text-lg md:text-2xl text-gray-200 font-light">
				{getT('home.video.description')}
			</p>
		</div>
	</div>
</section>

<!-- Before/After Showcase Section - Maximalism -->
<section id="beforeafter" class="section bg-white relative overflow-hidden border-t-8" style="border-top-color: {colorPalette.success};">
	<div class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-25" style="background-color: {colorPalette.tertiary};"></div>
	<div class="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-25" style="background-color: {colorPalette.accent};"></div>
	<div class="text-center mb-12 md:mb-20 observe">
		<p class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">{getT('home.beforeAfter.label')}</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			{getT('home.beforeAfter.heading')}<br><span style="color: {colorPalette.primary}">{getT('home.beforeAfter.headingAccent')}</span>
		</h2>
		<p class="text-lg md:text-xl text-[#27275b]/80 max-w-2xl mx-auto leading-relaxed">
			{getT('home.beforeAfter.description')}
		</p>
	</div>

	<div class="relative z-10">
		<!-- Main Before/After Slider -->
		<div class="max-w-5xl mx-auto mb-16 observe">
			<div
				bind:this={sliderContainer}
				class="relative aspect-[16/9] bg-[#27275b] rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none touch-none"
				onmousedown={handleMouseDown}
				onmousemove={handleMouseMove}
				onmouseup={handleMouseUp}
				onmouseleave={handleMouseUp}
				ontouchstart={handleTouchStart}
				ontouchmove={handleTouchMove}
				ontouchend={handleTouchEnd}
				onkeydown={handleKeyDown}
				role="slider"
				aria-label="Slider porównujący zdjęcia przed i po transformacji"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={sliderPosition}
				tabindex="0"
			>
				<!-- Before Image -->
				<div class="absolute inset-0 pointer-events-none">
					<img
						src={beforeAfterProjects[activeBeforeAfter].before}
						alt="Przed transformacją"
						class="w-full h-full object-cover"
						draggable="false"
					/>
				</div>

				<!-- After Image with slider -->
				<div class="absolute inset-0 pointer-events-none" style="clip-path: inset(0 {100 - sliderPosition}% 0 0)">
					<img
						src={beforeAfterProjects[activeBeforeAfter].after}
						alt="Po transformacji AI"
						class="w-full h-full object-cover"
						draggable="false"
					/>
				</div>

				<!-- Slider Handle -->
				<div class="absolute inset-y-0 z-10 pointer-events-none transition-shadow duration-200" style="left: {sliderPosition}%; {isDragging ? 'filter: drop-shadow(0 0 8px rgba(251, 113, 133, 0.5));' : ''}">
					<div class="absolute inset-y-0 w-1 bg-white shadow-lg"></div>
					<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 md:w-12 md:h-12 bg-white rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200 {isDragging ? 'scale-110' : ''}">
						<svg class="w-7 h-7 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: {colorPalette.primary}">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8l-4 4 4 4m6 0l4-4-4-4"></path>
						</svg>
					</div>
				</div>

				<!-- Labels -->
				<div class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-bold pointer-events-none">
					{getT('home.slider.before')}
				</div>
				<div class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-bold pointer-events-none">
					{getT('home.slider.after')}
				</div>
			</div>

			<!-- Project Info -->
			<div class="mt-8 text-center">
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif;">
					{beforeAfterProjects[activeBeforeAfter].title}
				</h3>
				<p class="text-[#27275b]/80 mb-6">{beforeAfterProjects[activeBeforeAfter].description}</p>
				<div class="flex justify-center gap-3 flex-wrap">
					{#each beforeAfterProjects[activeBeforeAfter].aiFeatures as feature}
						<span class="px-4 py-2 text-white text-sm font-bold rounded-lg" style="background-color: {colorPalette.primary}">
							{feature}
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
					class="relative aspect-[4/3] rounded-xl overflow-hidden border-4 transition-all duration-300 {activeBeforeAfter === i ? 'scale-105' : 'border-[#27275b]/20'}"
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

<!-- CTA Banner -->
<section class="relative py-12 md:py-16 overflow-hidden border-t-4" style="background-color: {colorPalette.primary}; border-top-color: {colorPalette.accent};">
	<div class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.accent};"></div>
	<div class="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.secondary};"></div>
	<div class="max-w-5xl mx-auto px-6 text-center relative z-10">
		<h2 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white leading-tight" style="font-family: 'Playfair Display', serif;">
			{getT('home.ctaBanner.heading')}
		</h2>
		<p class="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
			{getT('home.ctaBanner.description')}
		</p>
		<a href="#kontakt" class="inline-block px-8 py-4 text-white text-lg font-bold rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform animate-pulse-subtle" style="background-color: {colorPalette.accent};">
			{getT('home.ctaBanner.button')}
		</a>
	</div>
</section>

<!-- About Section - Maximalism -->
<section id="omnie" class="section bg-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.secondary};"></div>
	<div class="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.tertiary};"></div>
	<div class="absolute top-1/2 left-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-15" style="background-color: {colorPalette.success};"></div>
	<div class="grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
		<div class="observe">
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary};">
				{getT('home.aboutHome.heading')}<br>
				<span class="italic" style="color: {colorPalette.accent}">{getT('home.aboutHome.headingAccent')}</span>
			</h2>
			<div class="space-y-6 text-[#27275b]/80 leading-relaxed text-lg">
				<p>
					{getT('home.aboutHome.paragraph1')}
				</p>
				<p>
					<strong style="color: {colorPalette.primary}">{getT('home.aboutHome.paragraph2Title')}</strong> {getT('home.aboutHome.paragraph2')}
				</p>
				<p>
					{getT('home.aboutHome.paragraph3')}
				</p>
				<p class="quote-block">
					„{getT('home.aboutHome.quote')}"
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
						<p class="text-2xl font-bold text-white mb-3" style="font-family: 'Playfair Display', serif;">{getT('home.aboutHome.imageCaption')}</p>
						<p class="text-base text-white/90">{getT('home.aboutHome.imageSubCaption')}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Services Section - Maximalism -->
<section id="oferta" class="section bg-white relative overflow-hidden border-t-8" style="border-top-color: {colorPalette.secondary};">
	<div class="absolute top-10 left-5 w-32 h-32 md:top-20 md:left-20 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-25 animate-pulse-slow" style="background-color: {colorPalette.secondary};"></div>
	<div class="absolute bottom-10 right-5 w-36 h-36 md:bottom-20 md:right-20 md:w-72 md:h-72 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style="background-color: {colorPalette.success}; animation-delay: 1s;"></div>
		<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">{getT('home.services.label')}</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary};">
			{getT('home.services.heading')}<br><span style="color: {colorPalette.accent}">{getT('home.services.headingAccent')}</span>
		</h2>
		<p class="text-lg md:text-xl text-[#27275b]/80 max-w-2xl mx-auto leading-relaxed">
			{getT('home.services.description')}
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 relative z-10">
		{#each services as service, i}
			<div role="article" class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500" style="animation-delay: {i * 100}ms; border-color: rgb(243, 244, 246);" onmouseenter={(e) => { e.currentTarget.style.borderColor = colorPalette.accent; e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`; }} onmouseleave={(e) => { e.currentTarget.style.borderColor = 'rgb(243, 244, 246)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}>
				<div class="mb-8">
					<div class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">
						{service.icon}
					</div>
				</div>
				<h3 class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors" style="font-family: 'Playfair Display', serif;" onmouseenter={(e) => e.currentTarget.style.color = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.color = '#27275b'}>
					{service.title}
				</h3>
				<p class="text-[#27275b]/80 mb-8 leading-relaxed">
					{service.description}
				</p>
				<ul class="space-y-3">
					{#each service.features as feature}
						<li class="flex items-start text-[#27275b]/90">
							<span class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"></span>
							<span class="text-sm">{feature}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Process Section - Maximalism -->
<section id="proces" class="section text-white relative overflow-hidden" style="background-color: {colorPalette.primary};">
	<div class="absolute top-5 right-5 w-48 h-48 md:top-10 md:right-10 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.accent}"></div>
	<div class="absolute bottom-5 left-5 w-48 h-48 md:bottom-10 md:left-10 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.secondary}; animation-delay: 1.5s;"></div>
	<div class="absolute top-1/3 right-1/4 w-40 h-40 md:w-80 md:h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow transition-all duration-1000" style="background-color: {colorPalette.success}; animation-delay: 0.7s;"></div>

	<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4 neon-text" style="color: {colorPalette.accent}">{getT('home.process.label')}</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			{getT('home.process.heading')}<br><span class="text-white">{getT('home.process.headingAccent')}</span>
		</h2>
		<p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
			{getT('home.process.description')}
		</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 items-stretch">
		{#each processSteps as step, i}
			<div class="observe group h-full flex flex-col" style="animation-delay: {i * 150}ms">
				<div role="article" class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col flex-grow" onmouseenter={(e) => { e.currentTarget.style.borderColor = colorPalette.accent; e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3)`; }} onmouseleave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}>
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
		<div class="inline-block bg-white/10 backdrop-blur-sm px-6 md:px-12 py-6 rounded-2xl border-2 border-white/20 transition-all duration-500 hover:border-white/40 hover:bg-white/15">
			<p class="text-sm uppercase tracking-wider text-gray-300 mb-2">{getT('home.timeline.totalTime')}</p>
			<p class="text-4xl font-black transition-colors duration-300" style="font-family: 'Playfair Display', serif; color: {colorPalette.secondary};">{getT('home.timeline.workingDays')}</p>
			<p class="text-sm text-gray-300 mt-2">{getT('home.timeline.vsTraditional')}</p>
		</div>
	</div>
</section>

<!-- Manifesto / Why Section - Maximalism -->
<section class="section bg-white relative overflow-hidden border-y-8" style="border-top-color: {colorPalette.primary}; border-bottom-color: {colorPalette.success};">
	<div class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.secondary};"></div>
	<div class="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.accent};"></div>
	<div class="max-w-4xl mx-auto relative z-10">
		<div class="text-center mb-16 observe">
			<p class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">{getT('home.philosophy.label')}</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
				<span style="color: {colorPalette.primary}">{getT('home.philosophy.heading')}</span>{getT('home.philosophy.headingEnd')}
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-16 observe">
			<div class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl" style="border-color: {colorPalette.primary};">
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}">{getT('home.philosophy.fastAndRefined.title')}</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					{getT('home.philosophy.fastAndRefined.description')}
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl" style="border-color: {colorPalette.accent};">
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.accent}">{getT('home.philosophy.colorfulAndProfessional.title')}</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					{getT('home.philosophy.colorfulAndProfessional.description')}
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl" style="border-color: {colorPalette.secondary};">
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.secondary};">{getT('home.philosophy.boldAndFunctional.title')}</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					{getT('home.philosophy.boldAndFunctional.description')}
				</p>
			</div>

			<div class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl" style="border-color: {colorPalette.success};">
				<h3 class="text-2xl font-black mb-3" style="font-family: 'Playfair Display', serif; color: {colorPalette.success}">{getT('home.philosophy.accessibleAndQuality.title')}</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					{getT('home.philosophy.accessibleAndQuality.description')}
				</p>
			</div>
		</div>

		<!-- FAQ Quick Hits -->
		<div class="p-10 lg:p-12 rounded-2xl text-white observe" style="background-color: {colorPalette.primary}">
			<h3 class="text-3xl font-black mb-8 text-center" style="font-family: 'Playfair Display', serif;">
				{getT('home.faq.heading')}
			</h3>

			<div class="space-y-6">
				<div class="border-l-4 pl-6" style="border-color: {colorPalette.accent}">
					<p class="font-bold text-xl mb-2 neon-text" style="color: {colorPalette.accent}">{getT('home.faq.question1.q')}</p>
					<p class="text-gray-200 leading-relaxed">
						{@html getT('home.faq.question1.a')}
					</p>
				</div>

				<div class="border-l-4 pl-6" style="border-color: {colorPalette.secondary}">
					<p class="font-bold text-xl mb-2 text-white">{getT('home.faq.question2.q')}</p>
					<p class="text-gray-200 leading-relaxed">
						{@html getT('home.faq.question2.a')}
					</p>
				</div>

				<div class="border-l-4 pl-6" style="border-color: {colorPalette.accent}">
					<p class="font-bold text-xl mb-2 neon-text" style="color: {colorPalette.accent}">{getT('home.faq.question3.q')}</p>
					<p class="text-gray-200 leading-relaxed">
						{@html getT('home.faq.question3.a')}
					</p>
				</div>

				<div class="border-l-4 pl-6" style="border-color: {colorPalette.secondary}">
					<p class="font-bold text-xl mb-2 text-white">{getT('home.faq.question4.q')}</p>
					<p class="text-gray-200 leading-relaxed">
						{@html getT('home.faq.question4.a')}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Portfolio Section - Maximalism -->
<section id="portfolio" class="section bg-white relative overflow-hidden border-t-8" style="border-top-color: {colorPalette.accent};">
	<div class="absolute top-0 left-1/2 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-25" style="background-color: {colorPalette.tertiary};"></div>
	<div class="absolute bottom-0 right-1/4 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-20" style="background-color: {colorPalette.secondary};"></div>
		<div class="text-center mb-20 observe relative z-10">
		<p class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">{getT('home.portfolio.label')}</p>
		<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style="font-family: 'Playfair Display', serif;">
			<span style="color: {colorPalette.primary}">{getT('home.portfolio.heading')}</span><br>{getT('home.portfolio.headingEnd')}
		</h2>
		<p class="text-lg md:text-xl text-[#27275b]/80 max-w-2xl mx-auto mb-12 leading-relaxed">
			{getT('home.portfolio.description')}
		</p>

		<!-- Filter -->
		<div class="flex justify-center gap-4 flex-wrap">
			<button
				onclick={() => activeFilter = 'wszystkie'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'wszystkie' ? 'text-white shadow-lg' : 'bg-transparent text-[#27275b]/80 border-2 border-[#27275b]/20'}"
				style={activeFilter === 'wszystkie' ? `background-color: ${colorPalette.primary}; border-color: ${colorPalette.primary};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeFilter !== 'wszystkie') { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeFilter !== 'wszystkie') { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				{getT('home.portfolio.filterAll')}
			</button>
			<button
				onclick={() => activeFilter = 'wnętrza'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'wnętrza' ? 'text-white shadow-lg' : 'bg-transparent text-[#27275b]/80 border-2 border-[#27275b]/20'}"
				style={activeFilter === 'wnętrza' ? `background-color: ${colorPalette.accent}; border-color: ${colorPalette.accent};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeFilter !== 'wnętrza') { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeFilter !== 'wnętrza') { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				{getT('home.portfolio.filterInteriors')}
			</button>
			<button
				onclick={() => activeFilter = 'grafika'}
				class="px-8 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-lg {activeFilter === 'grafika' ? 'text-white shadow-lg' : 'bg-transparent text-[#27275b]/80 border-2 border-[#27275b]/20'}"
				style={activeFilter === 'grafika' ? `background-color: ${colorPalette.secondary}; border-color: ${colorPalette.secondary};` : `border-color: rgb(229, 231, 235);`}
				onmouseenter={(e) => { if (activeFilter !== 'grafika') { e.currentTarget.style.color = colorPalette.primary; e.currentTarget.style.borderColor = colorPalette.primary; } }}
				onmouseleave={(e) => { if (activeFilter !== 'grafika') { e.currentTarget.style.color = 'rgb(75, 85, 99)'; e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'; } }}
			>
				{getT('home.portfolio.filterGraphics')}
			</button>
		</div>
	</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
		{#each projects.filter(p => activeFilter === 'wszystkie' || p.category === activeFilter) as project, i}
			<div class="group observe hover-lift pb-3" style="animation-delay: {i * 100}ms">
				<div role="figure" class="aspect-[4/5] bg-blue-100 relative overflow-hidden mb-8 rounded-2xl border-2 border-blue-100 transition-all duration-300" onmouseenter={(e) => e.currentTarget.style.borderColor = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.borderColor = 'rgb(243, 244, 246)'}>
					<img
						src={project.image}
						alt={project.title}
						class="w-full h-full object-cover"
					/>
					<div role="presentation" class="absolute inset-0 transition-all duration-500" style="background-color: {colorPalette.primary}; opacity: 0.1;" onmouseenter={(e) => e.currentTarget.style.opacity = '0.2'} onmouseleave={(e) => e.currentTarget.style.opacity = '0.1'}></div>
					<div class="absolute top-6 right-6 text-white px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg" style="background-color: {colorPalette.primary}">
						{project.year}
					</div>
					<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
						<div class="text-white text-center">
							<svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
							</svg>
							<span class="text-sm uppercase tracking-wider">{getT('home.portfolio.viewProject')}</span>
						</div>
					</div>
				</div>
					<div class="space-y-3 px-2 pt-2">
					<div class="flex items-center justify-between">
						<span class="text-xs uppercase tracking-wider font-black px-3 py-1 bg-blue-50 rounded-full" style="color: {colorPalette.primary}">
							{getProjectCategoryText(project.category)}
						</span>
					</div>
					<h3 class="text-2xl font-black text-[#27275b] transition-colors" style="font-family: 'Playfair Display', serif;" onmouseenter={(e) => e.currentTarget.style.color = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.color = '#27275b'}>
						{project.title}
					</h3>
					<p class="text-[#27275b]/80 leading-relaxed">
						{project.description}
					</p>
					<div class="flex flex-wrap gap-2 pt-2">
						{#each project.technologies.slice(0, 3) as tech}
							<span class="text-xs px-3 py-1 border border-[#27275b]/20 text-[#27275b]/80 uppercase tracking-wider">
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
	<div class="absolute top-5 right-5 w-36 h-36 md:top-10 md:right-10 md:w-72 md:h-72 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
	<div class="absolute bottom-5 left-5 w-36 h-36 md:bottom-10 md:left-10 md:w-72 md:h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 1.5s;"></div>
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

<!-- Contact Section - Maximalism -->
<section id="kontakt" class="section bg-white relative overflow-hidden border-t-8 border-b-8" style="border-top-color: {colorPalette.tertiary}; border-bottom-color: {colorPalette.primary};">
	<div class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-25" style="background-color: {colorPalette.secondary};"></div>
	<div class="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-25" style="background-color: {colorPalette.success};"></div>
		<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
		<div class="observe">
			<p class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4" style="color: {colorPalette.primary}">{getT('home.contact.label')}</p>
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight" style="font-family: 'Playfair Display', serif; color: {colorPalette.primary};">
				{getT('home.contact.heading')}<br>
				<span class="italic" style="color: {colorPalette.accent}">{getT('home.contact.headingAccent')}</span>
			</h2>
			<p class="text-lg md:text-xl text-[#27275b]/80 mb-12 leading-relaxed">
				{getT('home.contact.description')}
			</p>

			<div class="space-y-8">
				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 border border-[#27275b]/20 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-[#27275b]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
						</svg>
					</div>
					<div>
						<p class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1">Email</p>
						<a href="mailto:kontakt@pikastro.eu" class="text-lg text-[#27275b] hover:text-[#FB7185] transition-colors">
							kontakt@pikastro.eu
						</a>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 border border-[#27275b]/20 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-[#27275b]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
						</svg>
					</div>
					<div>
						<p class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1">Lokalizacja</p>
						<p class="text-lg text-[#27275b]">{getT('home.contact.location')}</p>
						<p class="text-sm text-[#27275b]/70">{getT('home.contact.locationDesc')}</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 border border-[#27275b]/20 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-[#27275b]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<div>
						<p class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1">Dostępność</p>
						<p class="text-lg text-[#27275b]">{getT('home.contact.availability')}</p>
					</div>
				</div>
			</div>

			<div class="flex space-x-4 mt-12">
				<a href="https://linkedin.com" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = colorPalette.primary} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
					<span class="text-sm font-bold">in</span>
				</a>
				<a href="https://behance.net" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = colorPalette.accent} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
					<span class="text-sm font-bold">be</span>
				</a>
				<a href="https://instagram.com" class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg neon-glow" onmouseenter={(e) => e.currentTarget.style.backgroundColor = colorPalette.secondary} onmouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
					<span class="text-sm font-bold">ig</span>
				</a>
			</div>
		</div>

		<div class="bg-white p-10 lg:p-12 observe rounded-2xl border-4 shadow-xl" style="border-color: {colorPalette.accent};">
			<form class="space-y-6" onsubmit={handleSubmit}>
				<div>
					<label for="name" class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2">{getT('home.form.nameLabel')}</label>
					<input
						type="text"
						id="name"
						value={formData.name}
						disabled={formStatus === 'submitting'}
						class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white disabled:opacity-50 {touchedFields.name && !validationErrors.name.isValid ? 'border-red-400 focus:border-red-500' : touchedFields.name && validationErrors.name.isValid ? 'border-green-400 focus:border-green-500' : 'border-blue-200 focus:border-[#27275b]'}"
						placeholder={getT('home.form.namePlaceholder')}
						oninput={(e) => handleFieldInput('name', (e.target as HTMLInputElement).value)}
						onblur={() => handleFieldBlur('name')}
					/>
					{#if touchedFields.name && validationErrors.name.error}
						<p class="mt-1 text-sm text-red-600 flex items-center">
							<svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
							</svg>
							{validationErrors.name.error}
						</p>
					{/if}
					{#if touchedFields.name && validationErrors.name.isValid && formData.name.trim()}
						<p class="mt-1 text-sm text-green-600 flex items-center">
							<svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
							{getT('home.form.validation.looksGood')}
						</p>
					{/if}
				</div>

				<div>
					<label for="email" class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2">{getT('home.form.emailLabel')}</label>
					<input
						type="text"
						id="email"
						value={formData.email}
						disabled={formStatus === 'submitting'}
						class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white disabled:opacity-50 {touchedFields.email && !validationErrors.email.isValid ? 'border-red-400 focus:border-red-500' : touchedFields.email && validationErrors.email.isValid ? 'border-green-400 focus:border-green-500' : 'border-blue-200 focus:border-[#27275b]'}"
						placeholder={getT('home.form.emailPlaceholder')}
						oninput={(e) => handleFieldInput('email', (e.target as HTMLInputElement).value)}
						onblur={() => handleFieldBlur('email')}
					/>
					{#if touchedFields.email && validationErrors.email.error}
						<p class="mt-1 text-sm text-red-600 flex items-center">
							<svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
							</svg>
							{validationErrors.email.error}
						</p>
					{/if}
					{#if touchedFields.email && validationErrors.email.isValid && formData.email.trim()}
						<p class="mt-1 text-sm text-green-600 flex items-center">
							<svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
							{getT('home.form.validation.looksGood')}
						</p>
					{/if}
				</div>

				<div>
					<label for="project" class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2">{getT('home.form.projectLabel')}</label>
					<select
						id="project"
						bind:value={formData.project}
						disabled={formStatus === 'submitting'}
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white disabled:opacity-50"
					>
						<option>{getT('home.form.projectOptions.interiorDesign')}</option>
						<option>{getT('home.form.projectOptions.visualIdentity')}</option>
						<option>{getT('home.form.projectOptions.consultations')}</option>
						<option>{getT('home.form.projectOptions.other')}</option>
					</select>
				</div>

				<div>
					<label for="message" class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2">{getT('home.form.messageLabel')}</label>
					<textarea
						id="message"
						value={formData.message}
						disabled={formStatus === 'submitting'}
						rows="5"
						class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white resize-none disabled:opacity-50 {touchedFields.message && !validationErrors.message.isValid ? 'border-red-400 focus:border-red-500' : touchedFields.message && validationErrors.message.isValid ? 'border-green-400 focus:border-green-500' : 'border-blue-200 focus:border-[#27275b]'}"
						placeholder={getT('home.form.messagePlaceholder')}
						oninput={(e) => handleFieldInput('message', (e.target as HTMLTextAreaElement).value)}
						onblur={() => handleFieldBlur('message')}
					></textarea>
					<div class="flex justify-between items-center mt-1">
						{#if touchedFields.message && validationErrors.message.error}
							<p class="text-sm text-red-600 flex items-center">
								<svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
								</svg>
								{validationErrors.message.error}
							</p>
						{:else if touchedFields.message && validationErrors.message.isValid && formData.message.trim()}
							<p class="text-sm text-green-600 flex items-center">
								<svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								{getT('home.form.validation.looksGood')}
							</p>
						{:else}
							<span></span>
						{/if}
						<p class="text-xs text-[#27275b]/70">
							{formData.message.length}/5000
						</p>
					</div>
				</div>

				{#if formMessage}
					<div class="p-4 rounded-lg {formStatus === 'success' ? 'bg-green-50 border-2 border-green-200 text-green-800' : 'bg-red-50 border-2 border-red-200 text-red-800'}">
						<p class="font-bold">{formMessage}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={formStatus === 'submitting' || !validationErrors.isFormValid}
					class="w-full btn disabled:opacity-50 disabled:cursor-not-allowed {!validationErrors.isFormValid && (touchedFields.name || touchedFields.email || touchedFields.message) ? 'opacity-60 cursor-not-allowed' : ''}"
				>
					{submitButtonText}
				</button>
			</form>
		</div>
	</div>
</section>

