<script lang="ts">
	// Import images and videos
	import img_w_01 from "$lib/assets/images/wnetrza/01.jpeg";
	import img_w_02 from "$lib/assets/images/wnetrza/02.jpeg";
	import img_w_03 from "$lib/assets/images/wnetrza/03.jpeg";
	import img_w_04 from "$lib/assets/images/wnetrza/04.jpeg";
	import img_w_05 from "$lib/assets/images/wnetrza/05.jpeg";
	import img_w_06 from "$lib/assets/images/wnetrza/06.jpeg";
	import img_w_07 from "$lib/assets/images/wnetrza/07.jpeg";
	import img_w_08 from "$lib/assets/images/wnetrza/08.jpeg";
	import img_w_09 from "$lib/assets/images/wnetrza/09.jpeg";
	import img_w_10 from "$lib/assets/images/wnetrza/10.jpeg";
	import img_w_11 from "$lib/assets/images/wnetrza/11.jpeg";
	import przedImg from "$lib/assets/images/przed.png";
	import poImg from "$lib/assets/images/po.png";
	import colorsImg from "$lib/assets/images/colors.jpeg";
	import heroVideo from "$lib/assets/videos/vid01.mp4";
	import vid02 from "$lib/assets/videos/vid02.mp4";

	// Import i18n
	import { t, localeStore, getLocale, translationsVersion } from "$lib/i18n";

	// Import CMS components
	import EditableText from "$lib/components/EditableText.svelte";
	import EditableImage from "$lib/components/EditableImage.svelte";
	import { editModeStore } from "$lib/stores/editMode.svelte";

	// Import color extraction utilities
	import {
		extractColorsFromImage,
		assignColorRoles,
		type ColorPalette,
	} from "$lib/utils/colorExtractor";
	import {
		validateForm,
		validateField,
		type FormValidationResult,
		type ValidationField,
	} from "$lib/utils/validation";

	// Color palette extracted from colors image - Eclectic Maximalism
	let colorPalette = $state<ColorPalette>({
		primary: "#27275B", // Deep Navy Blue
		accent: "#F32A61", // Hot Magenta
		secondary: "#1DA898", // Turquoise
		success: "#F2A23E", // Golden Orange
		tertiary: "#F5848E", // Coral Pink
	});

	// Reactive translation function
	let currentLocale = $state(getLocale());
	let translationsVer = $state(0);

	// Subscribe to locale and translations version changes
	$effect(() => {
		const unsubscribeLocale = localeStore.subscribe(() => {
			currentLocale = getLocale();
		});
		const unsubscribeVersion = translationsVersion.subscribe((v) => {
			translationsVer = v;
		});
		return () => {
			unsubscribeLocale();
			unsubscribeVersion();
		};
	});

	// Translate function that reacts to locale and translations version changes
	function translate(key: string): string {
		void currentLocale; // Access to create reactive dependency
		void translationsVer; // Also depend on translations version
		return t(key);
	}

	// Function to convert markdown bold to HTML
	function processMarkdown(text: string): string {
		return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
	}

	// Helper function to convert hex to RGB
	function hexToRgb(hex: string): string {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
			: "39, 39, 91";
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
					root.setProperty("--color-primary", colorPalette.primary);
					root.setProperty("--color-accent", colorPalette.accent);
					root.setProperty(
						"--color-secondary",
						colorPalette.secondary,
					);
					root.setProperty("--color-success", colorPalette.success);
					root.setProperty("--color-tertiary", colorPalette.tertiary);

					// Also set RGB values for opacity support
					root.setProperty(
						"--color-primary-rgb",
						hexToRgb(colorPalette.primary),
					);
					root.setProperty(
						"--color-accent-rgb",
						hexToRgb(colorPalette.accent),
					);
					root.setProperty(
						"--color-secondary-rgb",
						hexToRgb(colorPalette.secondary),
					);
				}
			})
			.catch((error) => {
				console.warn("Could not extract colors from image:", error);
			});
	});

	// Ensure videos play properly
	$effect(() => {
		if (typeof window !== "undefined" && vid02Element) {
			// Ensure vid02 keeps playing
			const checkVideo = () => {
				if (vid02Element && vid02Element.paused) {
					vid02Element.play().catch((error) => {
						console.warn("Video autoplay failed:", error);
					});
				}
			};

			// Check immediately and then periodically
			setTimeout(checkVideo, 100);
			const interval = setInterval(checkVideo, 2000); // Check every 2 seconds

			return () => clearInterval(interval); // Cleanup on effect destroy
		}
	});

	// Handle video playback when scrolling back to video
	$effect(() => {
		if (typeof window !== "undefined" && vid02Element) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (
							entry.isIntersecting &&
							vid02Element &&
							vid02Element.paused
						) {
							// Video is in view and paused, try to resume
							vid02Element.play().catch((error) => {
								console.warn("Video resume failed:", error);
							});
						}
					});
				},
				{
					threshold: 0.1, // Trigger when at least 10% of video is visible
					rootMargin: "50px", // Start observing 50px before video enters viewport
				},
			);

			observer.observe(vid02Element);

			return () => observer.disconnect();
		}
	});

	// Contact form state - use default value, will be updated reactively
	let defaultProjectType = "Projektowanie wnętrz"; // Default fallback
	let formData = $state({
		name: "",
		email: "",
		project: defaultProjectType,
		message: "",
	});

	// Update project type when t is available
	$effect(() => {
		try {
			const projectType = translate("home.form.projectType");
			if (projectType && formData.project === defaultProjectType) {
				formData.project = projectType;
			}
		} catch (e) {
			// t not ready yet, keep default
		}
	});

	let formStatus = $state<"idle" | "submitting" | "success" | "error">(
		"idle",
	);
	let formMessage = $state<string>("");

	// Validation state
	let validationErrors = $state<FormValidationResult>({
		name: { isValid: true },
		email: { isValid: true },
		message: { isValid: true },
		isFormValid: true,
	});

	let touchedFields = $state<{ [key in ValidationField]: boolean }>({
		name: false,
		email: false,
		message: false,
	});
	let isValidating = $state(false);

	// Submit button text - use $t for reactivity
	const submitButtonText = $derived.by(() => {
		if (formStatus === "submitting")
			return translate("home.form.submit.sending");
		if (
			!validationErrors.isFormValid &&
			(touchedFields.name || touchedFields.email || touchedFields.message)
		) {
			return translate("home.form.submit.fixErrors");
		}
		return translate("home.form.submit.send");
	});

	// Project category text - use $t for reactivity
	const getProjectCategoryText = (category: string) => {
		return category === "wnętrza"
			? translate("home.portfolio.categoryInteriors")
			: translate("home.portfolio.categoryGraphics");
	};

	// Video references for playback control
	let vid02Element: HTMLVideoElement;

	// Validation functions
	function validateFieldRealTime(field: ValidationField, value: string) {
		const result = validateField(field, value);
		validationErrors[field] = result;
		validationErrors.isFormValid =
			validationErrors.name.isValid &&
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
			videoElement.play().catch((error) => {
				console.warn("Video autoplay failed:", error);
			});
		}
	}

	// Form submission handler
	async function handleSubmit(event: Event) {
		event.preventDefault();

		// Mark all fields as touched for validation
		markFieldAsTouched("name");
		markFieldAsTouched("email");
		markFieldAsTouched("message");

		// Validate all fields before submission
		const validation = validateAllFields();
		if (!validation.isFormValid) {
			formStatus = "error";
			formMessage = translate("home.form.error");
			return;
		}

		formStatus = "submitting";
		formMessage = "";

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				formStatus = "success";
				formMessage = translate("home.form.success");
				// Reset form
				let resetProjectType = defaultProjectType;
				try {
					resetProjectType = translate("home.form.projectType");
				} catch (e) {
					// t not ready, use default
				}
				formData = {
					name: "",
					email: "",
					project: resetProjectType,
					message: "",
				};
				// Reset validation state
				validationErrors = {
					name: { isValid: true },
					email: { isValid: true },
					message: { isValid: true },
					isFormValid: true,
				};
				touchedFields = {
					name: false,
					email: false,
					message: false,
				};
				// Ensure video continues playing after form submission
				setTimeout(() => ensureVideoPlays(vid02Element), 100);
			} else {
				formStatus = "error";
				formMessage =
					result.error || translate("home.form.errorGeneric");
			}
		} catch (error) {
			formStatus = "error";
			formMessage = translate("home.form.errorNetwork");
			console.error("Form submission error:", error);
		}
	}

	// Before/After showcase data - reactive to locale changes
	const beforeAfterProjects = $derived.by(() => {
		// Access currentLocale to make this reactive to locale changes
		void currentLocale;
		return [
			{
				title: "",
				before: poImg,
				after: przedImg,
				description: translate("home.beforeAfter.description"),
				aiFeatures: ["Kociostrada"],
			},
			{
				title: translate("beforeAfter.project2.title"),
				before: img_w_03,
				after: img_w_04,
				description: translate("beforeAfter.project2.description"),
				aiFeatures: [
					translate("beforeAfter.project2.feature1"),
					translate("beforeAfter.project2.feature2"),
					translate("beforeAfter.project2.feature3"),
				],
			},
			{
				title: translate("beforeAfter.project3.title"),
				before: img_w_05,
				after: img_w_06,
				description: translate("beforeAfter.project3.description"),
				aiFeatures: [
					translate("beforeAfter.project3.feature1"),
					translate("beforeAfter.project3.feature2"),
					translate("beforeAfter.project3.feature3"),
				],
			},
		];
	});

	// Process steps - are reactive to locale changes
	const processSteps = $derived.by(() => {
		// Access currentLocale to make this reactive to locale changes
		void currentLocale;
		return [
			{
				number: "01",
				title: translate("process.consultation.title"),
				description: translate("process.consultation.description"),
				duration: translate("process.consultation.duration"),
				icon: "01",
			},
			{
				number: "02",
				title: translate("process.prototyping.title"),
				description: translate("process.prototyping.description"),
				duration: translate("process.prototyping.duration"),
				icon: "02",
			},
			{
				number: "03",
				title: translate("process.refinement.title"),
				description: translate("process.refinement.description"),
				duration: translate("process.refinement.duration"),
				icon: "03",
			},
			{
				number: "04",
				title: translate("process.documentation.title"),
				description: translate("process.documentation.description"),
				duration: translate("process.documentation.duration"),
				icon: "04",
			},
		];
	});

	// Portfolio data - professionally curated projects - are reactive to locale changes
	const projects = $derived.by(() => {
		// Access currentLocale to make this reactive to locale changes
		void currentLocale;
		return [
			{
				titleKey: "portfolio.scandinavianApartment.title",
				descriptionKey: "portfolio.scandinavianApartment.description",
				title: translate("portfolio.scandinavianApartment.title"),
				description: translate(
					"portfolio.scandinavianApartment.description",
				),
				technologies: ["AutoCAD", "SketchUp", "V-Ray", "3ds Max"],
				image: img_w_07,
				category: "wnętrza",
				year: "2024",
				articleUrl:
					"https://lustrowramie.pl/wystroj-wnetrz/styl-dopamine-decor/?srsltid=AfmBOor3EWvIGXwJqWGvSbosYoU_0w1ga-qzwJm3YQjSijdSFt6uLnrj",
			},
			{
				titleKey: "portfolio.studioIdentity.title",
				descriptionKey: "portfolio.studioIdentity.description",
				title: translate("portfolio.studioIdentity.title"),
				description: translate("portfolio.studioIdentity.description"),
				technologies: [
					"Adobe Creative Suite",
					"Brand Strategy",
					"Print Design",
				],
				image: colorsImg,
				category: "grafika",
				year: "2024",
				articleUrl:
					"https://www.ikea.com/pl/pl/new/przyszlosc-jest-teraz-kolejny-raz-poznaj-kolekcje-nytillverkad-puba2ba1b30/",
			},
			{
				titleKey: "portfolio.coworkingSpace.title",
				descriptionKey: "portfolio.coworkingSpace.description",
				title: translate("portfolio.coworkingSpace.title"),
				description: translate("portfolio.coworkingSpace.description"),
				technologies: [
					"3D Modeling",
					"Space Planning",
					"Smart Solutions",
				],
				image: img_w_08,
				category: "wnętrza",
				year: "2023",
				articleUrl:
					"https://thearq.pl/design/space-age-czyli-design-w-erze-wyscigu-kosmicznego/",
			},
			{
				titleKey: "portfolio.modernHouse.title",
				descriptionKey: "portfolio.modernHouse.description",
				title: translate("portfolio.modernHouse.title"),
				description: translate("portfolio.modernHouse.description"),
				technologies: ["ArchiCAD", "Lumion", "Sustainable Design"],
				image: img_w_09,
				category: "wnętrza",
				year: "2023",
				articleUrl:
					"https://fabrykaform.pl/magazyn/maksymalizm-trend-2025?srsltid=AfmBOoqVcRsXV9QoPhNwb_YbSBekpWXd8M7oixw4AAghTd7Ar2ynv-pX",
			},
			{
				titleKey: "portfolio.cafeConcept.title",
				descriptionKey: "portfolio.cafeConcept.description",
				title: translate("portfolio.cafeConcept.title"),
				description: translate("portfolio.cafeConcept.description"),
				technologies: [
					"Interior Design",
					"Branding",
					"Visual Identity",
				],
				image: img_w_10,
				category: "grafika",
				year: "2024",
				articleUrl:
					"https://gieradesign.pl/mid-century-modern-styl-ktory-nie-przemija",
			},
			{
				titleKey: "portfolio.industrialLoft.title",
				descriptionKey: "portfolio.industrialLoft.description",
				title: translate("portfolio.industrialLoft.title"),
				description: translate("portfolio.industrialLoft.description"),
				technologies: ["Adaptive Reuse", "Industrial Design", "BIM"],
				image: img_w_11,
				category: "wnętrza",
				year: "2023",
				articleUrl:
					"https://lectus24.pl/blog/colorful-minimalism?_gl=1*pwnu37*_up*MQ..*_gs*MQ..&gclid=Cj0KCQiAoZDJBhC0ARIsAERP-F_-pP9ix262air21M8RsRVKIEWMNS_C37vHHEUgK3eRwzgpdfuNpcwaAkKxEALw_wcB",
			},
		];
	});

	const services = $derived.by(() => {
		// Access currentLocale to make this reactive to locale changes
		void currentLocale;
		return [
			{
				title: translate("services.interiorDesign.title"),
				description: translate("services.interiorDesign.description"),
				icon: "■",
				features: [
					translate("services.interiorDesign.feature1"),
					translate("services.interiorDesign.feature2"),
					translate("services.interiorDesign.feature3"),
					translate("services.interiorDesign.feature4"),
					translate("services.interiorDesign.feature5"),
				],
			},
			{
				title: translate("services.graphicDesign.title"),
				description: translate("services.graphicDesign.description"),
				icon: "○",
				features: [
					translate("services.graphicDesign.feature1"),
					translate("services.graphicDesign.feature2"),
					translate("services.graphicDesign.feature3"),
					translate("services.graphicDesign.feature4"),
				],
			},
			{
				title: translate("services.aiTechnology.title"),
				description: translate("services.aiTechnology.description"),
				icon: "△",
				features: [
					translate("services.aiTechnology.feature1"),
					translate("services.aiTechnology.feature2"),
					translate("services.aiTechnology.feature3"),
					translate("services.aiTechnology.feature4"),
				],
			},
			{
				title: translate("services.developersRealEstate.title"),
				description: translate(
					"services.developersRealEstate.description",
				),
				icon: "◆",
				features: [
					translate("services.developersRealEstate.feature1"),
					translate("services.developersRealEstate.feature2"),
					translate("services.developersRealEstate.feature3"),
					translate("services.developersRealEstate.feature4"),
				],
			},
		];
	});

	let activeFilter = $state("wszystkie");
	let activeBeforeAfter = $state(0);
	let sliderPosition = $state(50); // percentage for before/after slider
	let isDragging = $state(false);
	let sliderContainer: HTMLDivElement | null = null;

	// Handle slider position update from mouse/touch events
	function updateSliderPosition(event: MouseEvent | TouchEvent) {
		if (!sliderContainer) return;

		const rect = sliderContainer.getBoundingClientRect();
		const clientX =
			"touches" in event ? event.touches[0].clientX : event.clientX;
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
		if (event.key === "ArrowLeft") {
			sliderPosition = Math.max(0, sliderPosition - 5);
			event.preventDefault();
		} else if (event.key === "ArrowRight") {
			sliderPosition = Math.min(100, sliderPosition + 5);
			event.preventDefault();
		}
	}

	// Add global mouse/touch up listeners
	$effect(() => {
		if (typeof window !== "undefined") {
			const globalMouseUp = () => {
				if (isDragging) {
					isDragging = false;
				}
			};

			window.addEventListener("mouseup", globalMouseUp);
			window.addEventListener("touchend", globalMouseUp);

			return () => {
				window.removeEventListener("mouseup", globalMouseUp);
				window.removeEventListener("touchend", globalMouseUp);
			};
		}
	});

	$effect(() => {
		// Add scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.isIntersecting &&
						!entry.target.classList.contains("animate-fade-in-up")
					) {
						entry.target.classList.add("animate-fade-in-up");
					}
				});
			},
			{ threshold: 0.1 },
		);

		// Immediately animate elements already in view
		document.querySelectorAll(".observe").forEach((el) => {
			const rect = el.getBoundingClientRect();
			const isInView = rect.top < window.innerHeight && rect.bottom > 0;
			if (isInView && !el.classList.contains("animate-fade-in-up")) {
				el.classList.add("animate-fade-in-up");
			}
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Pikastro | Projektowanie Wnętrz | Grafika | AI</title>
	<meta
		name="description"
		content="Projektowanie wnętrz i grafika z AI dla młodych (20-30 lat). Odważne, kolorowe aranżacje mieszkań zamiast beżowo-szarych. Kompleksowa obsługa w Krakowie - szybko i w atrakcyjnych cenach."
	/>
</svelte:head>

<!-- Hero Section - Clean with Video -->
<section
	class="hero-section relative flex items-center text-white overflow-hidden min-h-screen md:h-screen"
>
	<!-- Turquoise/Teal Background - always visible (hardcoded to ensure consistency) -->
	<div
		class="absolute inset-0 z-[0]"
		style="background-color: #1DA898;"
	></div>

	<!-- Background Video - fades in after initial load -->
	<div class="absolute inset-0 z-[1] hero-video-container">
		<video
			autoplay
			loop
			muted
			playsinline
			class="w-full h-full object-cover opacity-30"
		>
			<source src={heroVideo} type="video/mp4" />
		</video>
		<!-- Turquoise-tinted overlay for consistent look -->
		<div
			class="absolute inset-0"
			style="background: linear-gradient(135deg, #1DA89885 0%, #1DA89870 50%, #27275B60 100%);"
		></div>
	</div>

	<div
		class="relative z-20 px-4 md:px-6 lg:px-12 py-8 md:py-24 max-w-7xl mx-auto"
	>
		<div class="max-w-5xl">
			<div class="mb-8 md:mb-8">
				<p
					class="hero-text-animate font-bold tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-6"
					style="color: {colorPalette.accent}; animation-delay: 0.3s;"
				>
					<EditableText key="home.hero.label" />
				</p>
				<h1
					class="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05]"
					style="font-family: 'Playfair Display', serif;"
				>
					<span
						class="hero-text-animate block"
						style="animation-delay: 0.5s;"
					>
						<EditableText key="home.hero.heading1" tag="span" />
					</span>
					<span
						class="hero-text-animate block"
						style="animation-delay: 0.7s;"
						>{#if currentLocale === "en"}<EditableText
								key="home.hero.heading2"
								tag="span"
							/>{:else}<EditableText
								key="home.hero.heading2"
								tag="span"
							/><span style="color: #F5848E"
								><EditableText
									key="home.hero.heading2Accent"
									tag="span"
								/></span
							>{/if}</span
					>
				</h1>
				<p
					class="hero-text-animate text-2xl md:text-3xl font-bold mb-4 leading-tight"
					style="color: #27275B; animation-delay: 0.9s;"
				>
					<EditableText key="home.hero.tagline" />
				</p>
			</div>
			<p
				class="hero-text-animate text-lg md:text-2xl mb-8 max-w-3xl leading-relaxed text-gray-100"
				style="animation-delay: 1.1s; font-weight: 400;"
			>
				<EditableText key="home.hero.description" />
			</p>

			<!-- Value Props -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl">
				<div
					class="hero-text-animate bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20"
					style="animation-delay: 1.3s;"
				>
					<div class="font-black text-lg text-white">
						<EditableText
							key="home.hero.valueProps.time"
							tag="span"
						/>
					</div>
					<div class="text-white/80 text-sm">
						<EditableText
							key="home.hero.valueProps.timeVs"
							tag="span"
						/>
					</div>
				</div>
				<div
					class="hero-text-animate bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20"
					style="animation-delay: 1.5s;"
				>
					<div class="font-black text-lg text-white">
						<EditableText
							key="home.hero.valueProps.variants"
							tag="span"
						/>
					</div>
					<div class="text-white/80 text-sm">
						<EditableText
							key="home.hero.valueProps.variantsDesc"
							tag="span"
						/>
					</div>
				</div>
				<div
					class="hero-text-animate bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20"
					style="animation-delay: 1.7s;"
				>
					<div class="font-black text-lg text-white">
						<EditableText
							key="home.hero.valueProps.price"
							tag="span"
						/>
					</div>
					<div class="text-white/80 text-sm">
						<EditableText
							key="home.hero.valueProps.priceDesc"
							tag="span"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div
		class="hero-text-animate absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
		style="animation-delay: 2s;"
	>
		<svg
			class="w-6 h-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			style="color: {colorPalette.accent}"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 14l-7 7m0 0l-7-7m7 7V3"
			></path>
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

	<!-- Centered Text Content -->
	<div class="relative z-10 flex items-center justify-center h-full">
		<div class="text-center text-white px-6 max-w-4xl">
			<h2
				class="text-3xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight flex flex-col items-center"
				style="font-family: 'Playfair Display', serif; text-shadow: 0 0 20px rgba(39, 39, 91, 0.8), 0 0 40px rgba(39, 39, 91, 0.6), 0 0 60px rgba(39, 39, 91, 0.4), 0 0 80px rgba(39, 39, 91, 0.2);"
			>
				<span><EditableText key="home.video.heading" tag="span" /></span
				>
				<span style="color: #FF6B9D;"
					><EditableText
						key="home.video.headingAccent"
						tag="span"
					/></span
				>
				<span class="flex items-center gap-3 md:gap-4">
					<span style="color: #ffffff;"
						><EditableText
							key="home.video.headingEnd"
							tag="span"
						/></span
					>
					<img
						src="/logo.png"
						alt="Pikastro"
						class="hero-logo w-auto inline-block"
					/>
				</span>
			</h2>
			<p
				class="text-xl md:text-3xl text-gray-200"
				style="text-shadow: 0 0 15px rgba(39, 39, 91, 0.8), 0 0 30px rgba(39, 39, 91, 0.6);"
			>
				<EditableText key="home.video.description" />
			</p>
		</div>
	</div>
</section>

<!-- Full-width border separator -->
<div class="w-full h-2" style="background-color: {colorPalette.success};"></div>

<!-- Before/After Showcase Section - Maximalism -->
<section id="beforeafter" class="section bg-white relative overflow-hidden">
	<div
		class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-25"
		style="background-color: {colorPalette.tertiary};"
	></div>
	<div
		class="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-25"
		style="background-color: {colorPalette.accent};"
	></div>
	<div class="text-center mb-8 md:mb-12 observe">
		<h2
			class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
			style="font-family: 'Playfair Display', serif;"
		>
			<EditableText key="home.beforeAfter.heading" tag="span" /><br
			/><span style="color: {colorPalette.primary}"
				><EditableText
					key="home.beforeAfter.headingAccent"
					tag="span"
				/></span
			>
		</h2>

		<!-- Description moved here -->
		<div class="text-[#27275b]/80 mb-8 space-y-6 max-w-4xl mx-auto">
			<div class="leading-relaxed text-lg md:text-xl">
				<EditableText
					key="home.beforeAfter.description"
					multiline={true}
				/>
			</div>
		</div>
	</div>

	<div class="relative z-10">
		<!-- Main Before/After Slider -->
		<div class="max-w-5xl mx-auto mb-8 observe">
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
				<div
					class="absolute inset-0 pointer-events-none"
					style="clip-path: inset(0 {100 - sliderPosition}% 0 0)"
				>
					<img
						src={beforeAfterProjects[activeBeforeAfter].after}
						alt="Po transformacji AI"
						class="w-full h-full object-cover"
						draggable="false"
					/>
				</div>

				<!-- Slider Handle -->
				<div
					class="absolute inset-y-0 z-10 pointer-events-none transition-shadow duration-200"
					style="left: {sliderPosition}%; {isDragging
						? 'filter: drop-shadow(0 0 8px rgba(251, 113, 133, 0.5));'
						: ''}"
				>
					<div
						class="absolute inset-y-0 w-1 bg-white shadow-lg"
					></div>
					<div
						class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 md:w-12 md:h-12 bg-white rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200 {isDragging
							? 'scale-110'
							: ''}"
					>
						<svg
							class="w-7 h-7 md:w-6 md:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style="color: {colorPalette.primary}"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 8l-4 4 4 4m6 0l4-4-4-4"
							></path>
						</svg>
					</div>
				</div>

				<!-- Labels -->
			</div>
		</div>

		<!-- Project Thumbnails - Hidden as requested -->
		<!-- <div class="grid md:grid-cols-3 gap-6 observe">
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
						alt=<EditableText key={project.titleKey} tag="span" />
						class="w-full h-full object-cover"
					/>
					<div class="absolute inset-0 transition-all duration-300 flex items-center justify-center" style="background-color: {colorPalette.primary}; opacity: 0.4;" role="presentation" onmouseenter={(e) => e.currentTarget.style.opacity = '0.2'} onmouseleave={(e) => e.currentTarget.style.opacity = '0.4'}>
						<p class="text-sm font-bold text-white px-4 text-center"><EditableText key={project.titleKey} tag="span" /></p>
					</div>
				</button>
			{/each}
		</div> -->

		<!-- View Full Portfolio Button -->
		<div class="text-center mt-16 observe relative z-10">
			<a
				href="/portfolio"
				class="inline-flex items-center gap-3 px-10 py-4 text-lg font-bold rounded-xl border-2 transition-all duration-300 transform hover:scale-110"
				style="background: linear-gradient(135deg, {colorPalette.secondary} 0%, {colorPalette.primary} 100%); border-color: {colorPalette.accent}; color: white;"
			>
				<EditableText
					key="home.portfolio.viewFullPortfolio"
					tag="span"
				/>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 7l5 5m0 0l-5 5m5-5H6"
					></path>
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- About Section - Maximalism -->
<section id="omnie" class="section bg-white relative overflow-hidden">
	<div
		class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.secondary};"
	></div>
	<div
		class="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.tertiary};"
	></div>
	<div
		class="absolute top-1/2 left-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-15"
		style="background-color: {colorPalette.success};"
	></div>
	<div
		class="grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10"
	>
		<div class="observe">
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<span style="color: {colorPalette.primary}"
					><EditableText
						key="home.aboutHome.heading"
						tag="span"
					/></span
				>
				<span class="italic"
					><EditableText
						key="home.aboutHome.headingAccent"
						tag="span"
					/></span
				>
			</h2>
			<div class="space-y-6 text-[#27275b]/80 leading-relaxed text-lg">
				<p>
					<EditableText key="home.aboutHome.paragraph1" tag="span" />
				</p>
				<p>
					<strong style="color: {colorPalette.primary}"
						><EditableText
							key="home.aboutHome.paragraph2Title"
							tag="span"
						/></strong
					>
					<EditableText key="home.aboutHome.paragraph2" tag="span" />
				</p>
				<p>
					<EditableText key="home.aboutHome.paragraph3" tag="span" />
				</p>
			</div>
		</div>

		<div class="space-y-8 observe">
			<div
				class="aspect-[4/5] bg-blue-100 relative overflow-hidden group rounded-2xl"
			>
				<img
					src={img_w_07}
					alt="Projektowanie wnętrz dla klientów"
					class="w-full h-full object-cover"
				/>
				<div
					class="absolute inset-0 bg-[#27275b]/30 group-hover:bg-[#27275b]/20 transition-all duration-300"
				></div>
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="text-center p-8">
						<p
							class="text-2xl font-bold text-white mb-3"
							style="font-family: 'Playfair Display', serif;"
						>
							<EditableText
								key="home.aboutHome.imageCaption"
								tag="span"
							/>
						</p>
						<p class="text-base text-white/90">
							<EditableText
								key="home.aboutHome.imageSubCaption"
								tag="span"
							/>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Full-width border separator -->
<div class="w-full h-2" style="background-color: {colorPalette.accent};"></div>

<!-- CTA Banner -->
<section
	class="relative py-12 md:py-16 overflow-hidden"
	style="background-color: {colorPalette.primary};"
>
	<div
		class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.accent};"
	></div>
	<div
		class="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.secondary};"
	></div>
	<div class="max-w-5xl mx-auto px-6 text-center relative z-10">
		<h2
			class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white leading-tight"
			style="font-family: 'Playfair Display', serif;"
		>
			<EditableText key="home.ctaBanner.heading" tag="span" />
		</h2>
		<p class="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
			<EditableText key="home.ctaBanner.description" tag="span" />
		</p>
		<a
			href="#kontakt"
			class="inline-block px-8 py-4 text-sm tracking-wide uppercase font-bold rounded-xl border-2 transition-all duration-300 transform hover:scale-110"
			style="background: linear-gradient(135deg, {colorPalette.secondary} 0%, {colorPalette.primary} 100%); border-color: {colorPalette.accent}; color: white;"
		>
			<EditableText key="home.ctaBanner.button" tag="span" />
		</a>
	</div>
</section>

<!-- Full-width border separator -->
<div class="w-full h-2" style="background-color: {colorPalette.accent};"></div>

<!-- Services Section - Maximalism -->
<section id="oferta" class="section bg-white relative overflow-hidden">
	<div
		class="absolute top-10 left-5 w-32 h-32 md:top-20 md:left-20 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-25 animate-pulse-slow"
		style="background-color: {colorPalette.secondary};"
	></div>
	<div
		class="absolute bottom-10 right-5 w-36 h-36 md:bottom-20 md:right-20 md:w-72 md:h-72 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"
		style="background-color: {colorPalette.success}; animation-delay: 1s;"
	></div>
	<div class="text-center mb-20 observe relative z-10">
		<p
			class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4"
			style="color: {colorPalette.primary}"
		>
			<EditableText key="home.services.label" tag="span" />
		</p>
		<h2
			class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
			style="font-family: 'Playfair Display', serif;"
		>
			<span style="color: {colorPalette.primary}"
				><EditableText key="home.services.heading" tag="span" /></span
			><br /><EditableText key="home.services.headingAccent" tag="span" />
		</h2>
		<p
			class="text-lg md:text-xl text-[#27275b]/80 max-w-2xl mx-auto leading-relaxed"
		>
			<EditableText key="home.services.description" tag="span" />
		</p>
	</div>

	<div class="grid md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 relative z-10">
		<!-- Interior Design Service -->
		<div
			role="article"
			class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
			style="animation-delay: 0ms; border-color: rgb(243, 244, 246);"
			onmouseenter={(e) => {
				e.currentTarget.style.borderColor = colorPalette.accent;
				e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
			}}
			onmouseleave={(e) => {
				e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
				e.currentTarget.style.boxShadow =
					"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
			}}
		>
			<div class="mb-8">
				<div
					class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					■
				</div>
			</div>
			<h3
				class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
				style="font-family: 'Playfair Display', serif;"
				onmouseenter={(e) =>
					(e.currentTarget.style.color = colorPalette.primary)}
				onmouseleave={(e) => (e.currentTarget.style.color = "#27275b")}
			>
				<EditableText key="services.interiorDesign.title" tag="span" />
			</h3>
			<p class="text-[#27275b]/80 mb-8 leading-relaxed">
				<EditableText key="services.interiorDesign.description" />
			</p>
			<ul class="space-y-3">
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.interiorDesign.feature1"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.interiorDesign.feature2"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.interiorDesign.feature3"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.interiorDesign.feature4"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.interiorDesign.feature5"
							tag="span"
						/></span
					>
				</li>
			</ul>
		</div>

		<!-- Graphic Design Service -->
		<div
			role="article"
			class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
			style="animation-delay: 100ms; border-color: rgb(243, 244, 246);"
			onmouseenter={(e) => {
				e.currentTarget.style.borderColor = colorPalette.accent;
				e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
			}}
			onmouseleave={(e) => {
				e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
				e.currentTarget.style.boxShadow =
					"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
			}}
		>
			<div class="mb-8">
				<div
					class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					○
				</div>
			</div>
			<h3
				class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
				style="font-family: 'Playfair Display', serif;"
				onmouseenter={(e) =>
					(e.currentTarget.style.color = colorPalette.primary)}
				onmouseleave={(e) => (e.currentTarget.style.color = "#27275b")}
			>
				<EditableText key="services.graphicDesign.title" tag="span" />
			</h3>
			<p class="text-[#27275b]/80 mb-8 leading-relaxed">
				<EditableText key="services.graphicDesign.description" />
			</p>
			<ul class="space-y-3">
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.graphicDesign.feature1"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.graphicDesign.feature2"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.graphicDesign.feature3"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.graphicDesign.feature4"
							tag="span"
						/></span
					>
				</li>
			</ul>
		</div>

		<!-- AI Technology Service -->
		<div
			role="article"
			class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
			style="animation-delay: 200ms; border-color: rgb(243, 244, 246);"
			onmouseenter={(e) => {
				e.currentTarget.style.borderColor = colorPalette.accent;
				e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
			}}
			onmouseleave={(e) => {
				e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
				e.currentTarget.style.boxShadow =
					"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
			}}
		>
			<div class="mb-8">
				<div
					class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					△
				</div>
			</div>
			<h3
				class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
				style="font-family: 'Playfair Display', serif;"
				onmouseenter={(e) =>
					(e.currentTarget.style.color = colorPalette.primary)}
				onmouseleave={(e) => (e.currentTarget.style.color = "#27275b")}
			>
				<EditableText key="services.aiTechnology.title" tag="span" />
			</h3>
			<p class="text-[#27275b]/80 mb-8 leading-relaxed">
				<EditableText key="services.aiTechnology.description" />
			</p>
			<ul class="space-y-3">
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.aiTechnology.feature1"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.aiTechnology.feature2"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.aiTechnology.feature3"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.aiTechnology.feature4"
							tag="span"
						/></span
					>
				</li>
			</ul>
		</div>

		<!-- Developers/Real Estate Service -->
		<div
			role="article"
			class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
			style="animation-delay: 300ms; border-color: rgb(243, 244, 246);"
			onmouseenter={(e) => {
				e.currentTarget.style.borderColor = colorPalette.accent;
				e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
			}}
			onmouseleave={(e) => {
				e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
				e.currentTarget.style.boxShadow =
					"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
			}}
		>
			<div class="mb-8">
				<div
					class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					◆
				</div>
			</div>
			<h3
				class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
				style="font-family: 'Playfair Display', serif;"
				onmouseenter={(e) =>
					(e.currentTarget.style.color = colorPalette.primary)}
				onmouseleave={(e) => (e.currentTarget.style.color = "#27275b")}
			>
				<EditableText
					key="services.developersRealEstate.title"
					tag="span"
				/>
			</h3>
			<p class="text-[#27275b]/80 mb-8 leading-relaxed">
				<EditableText key="services.developersRealEstate.description" />
			</p>
			<ul class="space-y-3">
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.developersRealEstate.feature1"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.developersRealEstate.feature2"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.developersRealEstate.feature3"
							tag="span"
						/></span
					>
				</li>
				<li class="flex items-start text-[#27275b]/90">
					<span
						class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
					></span>
					<span class="text-sm"
						><EditableText
							key="services.developersRealEstate.feature4"
							tag="span"
						/></span
					>
				</li>
			</ul>
		</div>
	</div>
</section>

<!-- Process Section - Maximalism -->
<section
	id="proces"
	class="relative py-16 md:py-24 text-white overflow-hidden"
	style="background-color: {colorPalette.primary};"
>
	<div
		class="absolute top-5 right-5 w-48 h-48 md:top-10 md:right-10 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000"
		style="background-color: {colorPalette.accent}"
	></div>
	<div
		class="absolute bottom-5 left-5 w-48 h-48 md:bottom-10 md:left-10 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow transition-all duration-1000"
		style="background-color: {colorPalette.secondary}; animation-delay: 1.5s;"
	></div>
	<div
		class="absolute top-1/3 right-1/4 w-40 h-40 md:w-80 md:h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow transition-all duration-1000"
		style="background-color: {colorPalette.success}; animation-delay: 0.7s;"
	></div>

	<div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
		<div class="text-center mb-20 observe relative z-10">
			<p
				class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4 neon-text"
				style="color: {colorPalette.accent}"
			>
				<EditableText key="home.process.label" tag="span" />
			</p>
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<EditableText key="home.process.heading" tag="span" /><br
				/><span class="text-white"
					><EditableText
						key="home.process.headingAccent"
						tag="span"
					/></span
				>
			</h2>
			<p
				class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
			>
				<EditableText key="home.process.description" tag="span" />
			</p>
		</div>

		<div
			class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 items-stretch"
		>
			<!-- Step 1: Consultation -->
			<div
				class="observe group h-full flex flex-col"
				style="animation-delay: 0ms"
			>
				<div
					role="article"
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col flex-grow"
					onmouseenter={(e) => {
						e.currentTarget.style.borderColor = colorPalette.accent;
						e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3)`;
					}}
					onmouseleave={(e) => {
						e.currentTarget.style.borderColor =
							"rgba(255, 255, 255, 0.2)";
						e.currentTarget.style.boxShadow =
							"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
					}}
				>
					<div class="mb-6">
						<div
							class="text-8xl font-black opacity-20 leading-none text-white mb-4"
							style="font-family: 'Playfair Display', serif;"
						>
							01
						</div>
					</div>
					<h3
						class="text-2xl font-black mb-3 text-white transition-colors"
						style="font-family: 'Playfair Display', serif;"
						onmouseenter={(e) =>
							(e.currentTarget.style.color = colorPalette.accent)}
						onmouseleave={(e) =>
							(e.currentTarget.style.color = "white")}
					>
						<EditableText
							key="process.consultation.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 mb-4 leading-relaxed">
						<EditableText key="process.consultation.description" />
					</p>
					<div
						class="flex items-center gap-2 font-bold text-sm text-white"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<EditableText
							key="process.consultation.duration"
							tag="span"
						/>
					</div>
				</div>
				<div
					class="hidden lg:block absolute top-1/2 -right-4 z-20 transform -translate-y-1/2"
				>
					<div
						class="flex items-center justify-center w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-md"
						style="border-color: {colorPalette.accent}30;"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style="color: {colorPalette.accent};"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Step 2: Prototyping -->
			<div
				class="observe group h-full flex flex-col"
				style="animation-delay: 150ms"
			>
				<div
					role="article"
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col flex-grow"
					onmouseenter={(e) => {
						e.currentTarget.style.borderColor = colorPalette.accent;
						e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3)`;
					}}
					onmouseleave={(e) => {
						e.currentTarget.style.borderColor =
							"rgba(255, 255, 255, 0.2)";
						e.currentTarget.style.boxShadow =
							"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
					}}
				>
					<div class="mb-6">
						<div
							class="text-8xl font-black opacity-20 leading-none text-white mb-4"
							style="font-family: 'Playfair Display', serif;"
						>
							02
						</div>
					</div>
					<h3
						class="text-2xl font-black mb-3 text-white transition-colors"
						style="font-family: 'Playfair Display', serif;"
						onmouseenter={(e) =>
							(e.currentTarget.style.color = colorPalette.accent)}
						onmouseleave={(e) =>
							(e.currentTarget.style.color = "white")}
					>
						<EditableText
							key="process.prototyping.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 mb-4 leading-relaxed">
						<EditableText key="process.prototyping.description" />
					</p>
					<div
						class="flex items-center gap-2 font-bold text-sm text-white"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<EditableText
							key="process.prototyping.duration"
							tag="span"
						/>
					</div>
				</div>
				<div
					class="hidden lg:block absolute top-1/2 -right-4 z-20 transform -translate-y-1/2"
				>
					<div
						class="flex items-center justify-center w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-md"
						style="border-color: {colorPalette.accent}30;"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style="color: {colorPalette.accent};"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Step 3: Refinement -->
			<div
				class="observe group h-full flex flex-col"
				style="animation-delay: 300ms"
			>
				<div
					role="article"
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col flex-grow"
					onmouseenter={(e) => {
						e.currentTarget.style.borderColor = colorPalette.accent;
						e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3)`;
					}}
					onmouseleave={(e) => {
						e.currentTarget.style.borderColor =
							"rgba(255, 255, 255, 0.2)";
						e.currentTarget.style.boxShadow =
							"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
					}}
				>
					<div class="mb-6">
						<div
							class="text-8xl font-black opacity-20 leading-none text-white mb-4"
							style="font-family: 'Playfair Display', serif;"
						>
							03
						</div>
					</div>
					<h3
						class="text-2xl font-black mb-3 text-white transition-colors"
						style="font-family: 'Playfair Display', serif;"
						onmouseenter={(e) =>
							(e.currentTarget.style.color = colorPalette.accent)}
						onmouseleave={(e) =>
							(e.currentTarget.style.color = "white")}
					>
						<EditableText
							key="process.refinement.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 mb-4 leading-relaxed">
						<EditableText key="process.refinement.description" />
					</p>
					<div
						class="flex items-center gap-2 font-bold text-sm text-white"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<EditableText
							key="process.refinement.duration"
							tag="span"
						/>
					</div>
				</div>
				<div
					class="hidden lg:block absolute top-1/2 -right-4 z-20 transform -translate-y-1/2"
				>
					<div
						class="flex items-center justify-center w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-md"
						style="border-color: {colorPalette.accent}30;"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style="color: {colorPalette.accent};"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Step 4: Documentation -->
			<div
				class="observe group h-full flex flex-col"
				style="animation-delay: 450ms"
			>
				<div
					role="article"
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col flex-grow"
					onmouseenter={(e) => {
						e.currentTarget.style.borderColor = colorPalette.accent;
						e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.3)`;
					}}
					onmouseleave={(e) => {
						e.currentTarget.style.borderColor =
							"rgba(255, 255, 255, 0.2)";
						e.currentTarget.style.boxShadow =
							"0 20px 25px -5px rgba(0, 0, 0, 0.1)";
					}}
				>
					<div class="mb-6">
						<div
							class="text-8xl font-black opacity-20 leading-none text-white mb-4"
							style="font-family: 'Playfair Display', serif;"
						>
							04
						</div>
					</div>
					<h3
						class="text-2xl font-black mb-3 text-white transition-colors"
						style="font-family: 'Playfair Display', serif;"
						onmouseenter={(e) =>
							(e.currentTarget.style.color = colorPalette.accent)}
						onmouseleave={(e) =>
							(e.currentTarget.style.color = "white")}
					>
						<EditableText
							key="process.documentation.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 mb-4 leading-relaxed">
						<EditableText key="process.documentation.description" />
					</p>
					<div
						class="flex items-center gap-2 font-bold text-sm text-white"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<EditableText
							key="process.documentation.duration"
							tag="span"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Total Time Banner -->
		<div
			class="mt-16 text-center observe animate-fade-in-up"
			style="animation-delay: 0.3s;"
		>
			<div
				class="inline-block bg-white/10 backdrop-blur-sm px-6 md:px-12 py-6 rounded-2xl border-2 border-white/20 transition-all duration-500 hover:border-white/40 hover:bg-white/15"
			>
				<p class="text-sm uppercase tracking-wider text-gray-300 mb-2">
					<EditableText key="home.timeline.totalTime" tag="span" />
				</p>
				<p
					class="text-4xl font-black"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.secondary}; text-shadow: 0 0 20px {colorPalette.secondary}80, 0 0 40px {colorPalette.secondary}40;"
				>
					<EditableText key="home.timeline.workingDays" tag="span" />
				</p>
				<p class="text-sm text-gray-300 mt-2">
					<EditableText
						key="home.timeline.vsTraditional"
						tag="span"
					/>
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Full-width border separator -->
<div class="w-full h-2" style="background-color: {colorPalette.primary};"></div>

<!-- Manifesto / Why Section - Maximalism -->
<section class="section bg-white relative overflow-hidden">
	<div
		class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.secondary};"
	></div>
	<div
		class="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.accent};"
	></div>
	<div class="max-w-4xl mx-auto relative z-10">
		<div class="text-center mb-16 observe">
			<p
				class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4"
				style="color: {colorPalette.primary}"
			>
				<EditableText key="home.philosophy.label" tag="span" />
			</p>
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<span style="color: {colorPalette.primary}"
					><EditableText
						key="home.philosophy.heading"
						tag="span"
					/></span
				><EditableText key="home.philosophy.headingEnd" tag="span" />
			</h2>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-16 observe">
			<div
				class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl"
				style="border-color: {colorPalette.primary};"
			>
				<h3
					class="text-2xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					<EditableText
						key="home.philosophy.fastAndRefined.title"
						tag="span"
					/>
				</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					<EditableText
						key="home.philosophy.fastAndRefined.description"
						tag="span"
					/>
				</p>
			</div>

			<div
				class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl"
				style="border-color: {colorPalette.primary};"
			>
				<h3
					class="text-2xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					<EditableText
						key="home.philosophy.colorfulAndProfessional.title"
						tag="span"
					/>
				</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					<EditableText
						key="home.philosophy.colorfulAndProfessional.description"
						tag="span"
					/>
				</p>
			</div>

			<div
				class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl"
				style="border-color: {colorPalette.primary};"
			>
				<h3
					class="text-2xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary};"
				>
					<EditableText
						key="home.philosophy.boldAndFunctional.title"
						tag="span"
					/>
				</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					<EditableText
						key="home.philosophy.boldAndFunctional.description"
						tag="span"
					/>
				</p>
			</div>

			<div
				class="bg-white p-8 rounded-2xl border-4 transition-all duration-300 hover:shadow-xl"
				style="border-color: {colorPalette.primary};"
			>
				<h3
					class="text-2xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					<EditableText
						key="home.philosophy.accessibleAndQuality.title"
						tag="span"
					/>
				</h3>
				<p class="text-[#27275b]/80 leading-relaxed">
					<EditableText
						key="home.philosophy.accessibleAndQuality.description"
						tag="span"
					/>
				</p>
			</div>
		</div>

		<!-- FAQ Quick Hits -->
		<div
			class="p-10 lg:p-12 rounded-2xl text-white observe"
			style="background-color: {colorPalette.primary}"
		>
			<h3
				class="text-3xl font-black mb-8 text-center"
				style="font-family: 'Playfair Display', serif;"
			>
				<EditableText key="home.faq.heading" tag="span" />
			</h3>

			<div class="space-y-6">
				<div
					class="border-l-4 pl-6"
					style="border-color: {colorPalette.secondary}"
				>
					<p
						class="font-black text-xl mb-2"
						style="color: {colorPalette.secondary};"
					>
						<EditableText key="home.faq.question1.q" tag="span" />
					</p>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="home.faq.question1.a"
							multiline={true}
						/>
					</p>
				</div>

				<div
					class="border-l-4 pl-6"
					style="border-color: {colorPalette.secondary}"
				>
					<p
						class="font-black text-xl mb-2"
						style="color: {colorPalette.secondary};"
					>
						<EditableText key="home.faq.question2.q" tag="span" />
					</p>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="home.faq.question2.a"
							multiline={true}
						/>
					</p>
				</div>

				<div
					class="border-l-4 pl-6"
					style="border-color: {colorPalette.secondary}"
				>
					<p
						class="font-black text-xl mb-2"
						style="color: {colorPalette.secondary};"
					>
						<EditableText key="home.faq.question3.q" tag="span" />
					</p>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="home.faq.question3.a"
							multiline={true}
						/>
					</p>
				</div>

				<div
					class="border-l-4 pl-6"
					style="border-color: {colorPalette.secondary}"
				>
					<p
						class="font-black text-xl mb-2"
						style="color: {colorPalette.secondary};"
					>
						<EditableText key="home.faq.question4.q" tag="span" />
					</p>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="home.faq.question4.a"
							multiline={true}
						/>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Full-width border separator -->
<div class="w-full h-2" style="background-color: {colorPalette.accent};"></div>

<!-- Portfolio Section - Maximalism -->
<section id="portfolio" class="section bg-white relative overflow-hidden">
	<div
		class="absolute top-0 left-1/2 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-25"
		style="background-color: {colorPalette.tertiary};"
	></div>
	<div
		class="absolute bottom-0 right-1/4 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-20"
		style="background-color: {colorPalette.secondary};"
	></div>
	<div class="text-center mb-20 observe relative z-10">
		<p
			class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4"
			style="color: {colorPalette.primary}"
		>
			<EditableText key="home.portfolio.label" tag="span" />
		</p>
		<h2
			class="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
			style="font-family: 'Playfair Display', serif;"
		>
			<span style="color: {colorPalette.primary}"
				><EditableText key="home.portfolio.heading" tag="span" /></span
			><br /><EditableText key="home.portfolio.headingEnd" tag="span" />
		</h2>
		<p
			class="text-lg md:text-xl text-[#27275b]/80 max-w-2xl mx-auto mb-12 leading-relaxed"
		>
			<EditableText key="home.portfolio.description" tag="span" />
		</p>
	</div>

	<div
		class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10"
	>
		{#each projects.filter((p) => activeFilter === "wszystkie" || p.category === activeFilter) as project, i}
			<div
				class="group observe hover-lift pb-3"
				style="animation-delay: {i * 100}ms"
			>
				<a
					href={project.articleUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="aspect-[4/5] bg-blue-100 relative overflow-hidden mb-8 rounded-2xl border-2 border-blue-100 transition-all duration-300 block {editModeStore.isEditMode
						? 'pointer-events-none'
						: ''}"
					onmouseenter={(e) =>
						(e.currentTarget.style.borderColor =
							colorPalette.accent)}
					onmouseleave={(e) =>
						(e.currentTarget.style.borderColor =
							"rgb(243, 244, 246)")}
				>
					<EditableImage
						imageKey={project.titleKey.replace("title", "image")}
						src={project.image}
						alt={project.title}
						class="w-full h-full object-cover"
					/>
					<div
						class="absolute inset-0 transition-all duration-500"
						style="background-color: {colorPalette.primary}; opacity: 0;"
					></div>
					<div
						class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
						style="background-color: rgba(39, 39, 91, 0.7);"
					>
						<div class="text-white text-center">
							<svg
								class="w-12 h-12 mx-auto mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								></path>
							</svg>
							<span
								class="text-sm uppercase tracking-wider font-bold"
								>Zobacz artykuł</span
							>
						</div>
					</div>
				</a>
				<div class="space-y-3 px-2 pt-2">
					<h3
						class="text-2xl font-black text-[#27275b] transition-colors"
						style="font-family: 'Playfair Display', serif;"
						onmouseenter={(e) =>
							(e.currentTarget.style.color =
								colorPalette.primary)}
						onmouseleave={(e) =>
							(e.currentTarget.style.color = "#27275b")}
					>
						<EditableText key={project.titleKey} tag="span" />
					</h3>
					<p class="text-[#27275b]/80 leading-relaxed">
						<EditableText key={project.descriptionKey} tag="span" />
					</p>
					<div class="flex flex-wrap gap-2 pt-2">
						{#each project.technologies.slice(0, 3) as tech}
							<span
								class="text-xs px-3 py-1 border border-[#27275b]/20 text-[#27275b]/80 uppercase tracking-wider"
							>
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
<section class="relative py-16 md:py-24 gradient-bg text-white overflow-hidden">
	<div
		class="absolute top-5 right-5 w-36 h-36 md:top-10 md:right-10 md:w-72 md:h-72 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
	></div>
	<div
		class="absolute bottom-5 left-5 w-36 h-36 md:bottom-10 md:left-10 md:w-72 md:h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
		style="animation-delay: 1.5s;"
	></div>
	<div
		class="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 text-center observe relative z-10"
	>
		<div class="mb-12">
			<svg
				class="w-16 h-16 mx-auto text-[#FB7185] opacity-70"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
				/>
			</svg>
		</div>
		<blockquote
			class="text-2xl md:text-3xl lg:text-4xl font-light mb-8 leading-relaxed"
			style="font-family: 'Playfair Display', serif;"
		>
			<EditableText key="home.testimonial.quote" multiline={true} />
		</blockquote>
		<div class="text-[#FB7185] font-bold">
			<p class="mb-1 text-lg">
				<EditableText key="home.testimonial.author" tag="span" />
			</p>
			<p class="text-sm text-gray-300">
				<EditableText key="home.testimonial.authorTitle" tag="span" />
			</p>
		</div>
	</div>
</section>

<!-- Full-width border separator -->
<div
	class="w-full h-2"
	style="background-color: {colorPalette.tertiary};"
></div>

<!-- Contact Section - Maximalism -->
<section id="kontakt" class="section bg-white relative overflow-hidden">
	<div
		class="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 rounded-full filter blur-3xl opacity-25"
		style="background-color: {colorPalette.secondary};"
	></div>
	<div
		class="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 rounded-full filter blur-3xl opacity-25"
		style="background-color: {colorPalette.success};"
	></div>
	<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
		<div class="observe">
			<p
				class="font-black tracking-[0.15em] md:tracking-[0.3em] uppercase text-sm mb-4"
				style="color: {colorPalette.primary}"
			>
				<EditableText key="home.contact.label" tag="span" />
			</p>
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<span style="color: {colorPalette.secondary};"
					><EditableText
						key="home.contact.heading"
						tag="span"
					/></span
				>
				<span class="italic" style="color: {colorPalette.primary};"
					><EditableText
						key="home.contact.headingAccent"
						tag="span"
					/></span
				>
			</h2>
			<p
				class="text-lg md:text-xl text-[#27275b]/80 mb-12 leading-relaxed"
			>
				<EditableText key="home.contact.description" tag="span" />
			</p>

			<div class="space-y-8">
				<div class="flex items-start space-x-4">
					<div
						class="w-12 h-12 border border-[#27275b]/20 flex items-center justify-center flex-shrink-0"
					>
						<svg
							class="w-5 h-5 text-[#27275b]/80"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							></path>
						</svg>
					</div>
					<div>
						<p
							class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1"
						>
							<EditableText
								key="home.contact.emailLabel"
								tag="span"
							/>
						</p>
						<a
							href="mailto:kontakt@pikastro.eu"
							class="text-lg text-[#27275b] hover:text-[#FB7185] transition-colors"
						>
							<EditableText key="home.contact.email" tag="span" />
						</a>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div
						class="w-12 h-12 border border-[#27275b]/20 flex items-center justify-center flex-shrink-0"
					>
						<svg
							class="w-5 h-5 text-[#27275b]/80"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
						</svg>
					</div>
					<div>
						<p
							class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1"
						>
							<EditableText
								key="home.contact.locationLabel"
								tag="span"
							/>
						</p>
						<p class="text-lg text-[#27275b]">
							<EditableText
								key="home.contact.location"
								tag="span"
							/>
						</p>
						<p class="text-sm text-[#27275b]/70">
							<EditableText
								key="home.contact.locationDesc"
								tag="span"
							/>
						</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div
						class="w-12 h-12 border border-[#27275b]/20 flex items-center justify-center flex-shrink-0"
					>
						<svg
							class="w-5 h-5 text-[#27275b]/80"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<div>
						<p
							class="text-sm uppercase tracking-wider text-[#27275b]/70 mb-1"
						>
							<EditableText
								key="home.contact.availabilityLabel"
								tag="span"
							/>
						</p>
						<p class="text-lg text-[#27275b]">
							<EditableText
								key="home.contact.availability"
								tag="span"
							/>
						</p>
					</div>
				</div>
			</div>

			<div class="flex space-x-4 mt-12">
				<a
					href="https://linkedin.com"
					class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg"
					onmouseenter={(e) =>
						(e.currentTarget.style.backgroundColor =
							colorPalette.primary)}
					onmouseleave={(e) =>
						(e.currentTarget.style.backgroundColor = "transparent")}
				>
					<span class="text-sm font-bold">in</span>
				</a>
				<a
					href="https://behance.net"
					class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg"
					onmouseenter={(e) =>
						(e.currentTarget.style.backgroundColor =
							colorPalette.accent)}
					onmouseleave={(e) =>
						(e.currentTarget.style.backgroundColor = "transparent")}
				>
					<span class="text-sm font-bold">be</span>
				</a>
				<a
					href="https://instagram.com"
					class="w-14 h-14 border-2 border-blue-200 rounded-lg flex items-center justify-center hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg"
					onmouseenter={(e) =>
						(e.currentTarget.style.backgroundColor =
							colorPalette.secondary)}
					onmouseleave={(e) =>
						(e.currentTarget.style.backgroundColor = "transparent")}
				>
					<span class="text-sm font-bold">ig</span>
				</a>
			</div>
		</div>

		<div
			class="bg-white p-10 lg:p-12 observe rounded-2xl border-4 shadow-xl"
			style="border-color: {colorPalette.accent};"
		>
			<form class="space-y-6" onsubmit={handleSubmit}>
				<div>
					<label
						for="name"
						class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2"
						><EditableText
							key="home.form.nameLabel"
							tag="span"
						/></label
					>
					<input
						type="text"
						id="name"
						value={formData.name}
						disabled={formStatus === "submitting"}
						class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white disabled:opacity-50 {touchedFields.name &&
						!validationErrors.name.isValid
							? 'border-red-400 focus:border-red-500'
							: touchedFields.name &&
								  validationErrors.name.isValid
								? 'border-green-400 focus:border-green-500'
								: 'border-blue-200 focus:border-[#27275b]'}"
						placeholder={translate("home.form.namePlaceholder")}
						oninput={(e) =>
							handleFieldInput(
								"name",
								(e.target as HTMLInputElement).value,
							)}
						onblur={() => handleFieldBlur("name")}
					/>
					{#if touchedFields.name && validationErrors.name.error}
						<p class="mt-1 text-sm text-red-600 flex items-center">
							<svg
								class="w-4 h-4 mr-1 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								></path>
							</svg>
							{validationErrors.name.error}
						</p>
					{/if}
					{#if touchedFields.name && validationErrors.name.isValid && formData.name.trim()}
						<p
							class="mt-1 text-sm text-green-600 flex items-center"
						>
							<svg
								class="w-4 h-4 mr-1 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
							<EditableText
								key="home.form.validation.looksGood"
								tag="span"
							/>
						</p>
					{/if}
				</div>

				<div>
					<label
						for="email"
						class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2"
						><EditableText
							key="home.form.emailLabel"
							tag="span"
						/></label
					>
					<input
						type="text"
						id="email"
						value={formData.email}
						disabled={formStatus === "submitting"}
						class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white disabled:opacity-50 {touchedFields.email &&
						!validationErrors.email.isValid
							? 'border-red-400 focus:border-red-500'
							: touchedFields.email &&
								  validationErrors.email.isValid
								? 'border-green-400 focus:border-green-500'
								: 'border-blue-200 focus:border-[#27275b]'}"
						placeholder={translate("home.form.emailPlaceholder")}
						oninput={(e) =>
							handleFieldInput(
								"email",
								(e.target as HTMLInputElement).value,
							)}
						onblur={() => handleFieldBlur("email")}
					/>
					{#if touchedFields.email && validationErrors.email.error}
						<p class="mt-1 text-sm text-red-600 flex items-center">
							<svg
								class="w-4 h-4 mr-1 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								></path>
							</svg>
							{validationErrors.email.error}
						</p>
					{/if}
					{#if touchedFields.email && validationErrors.email.isValid && formData.email.trim()}
						<p
							class="mt-1 text-sm text-green-600 flex items-center"
						>
							<svg
								class="w-4 h-4 mr-1 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
							<EditableText
								key="home.form.validation.looksGood"
								tag="span"
							/>
						</p>
					{/if}
				</div>

				<div>
					<label
						for="project"
						class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2"
						><EditableText
							key="home.form.projectLabel"
							tag="span"
						/></label
					>
					<select
						id="project"
						bind:value={formData.project}
						disabled={formStatus === "submitting"}
						class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-[#27275b] focus:outline-none transition-all bg-white disabled:opacity-50"
					>
						<option
							><EditableText
								key="home.form.projectOptions.interiorDesign"
								tag="span"
							/></option
						>
						<option
							><EditableText
								key="home.form.projectOptions.visualIdentity"
								tag="span"
							/></option
						>
						<option
							><EditableText
								key="home.form.projectOptions.consultations"
								tag="span"
							/></option
						>
						<option
							><EditableText
								key="home.form.projectOptions.other"
								tag="span"
							/></option
						>
					</select>
				</div>

				<div>
					<label
						for="message"
						class="block text-sm uppercase tracking-wider font-bold text-[#27275b]/90 mb-2"
						><EditableText
							key="home.form.messageLabel"
							tag="span"
						/></label
					>
					<textarea
						id="message"
						value={formData.message}
						disabled={formStatus === "submitting"}
						rows="5"
						class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white resize-none disabled:opacity-50 {touchedFields.message &&
						!validationErrors.message.isValid
							? 'border-red-400 focus:border-red-500'
							: touchedFields.message &&
								  validationErrors.message.isValid
								? 'border-green-400 focus:border-green-500'
								: 'border-blue-200 focus:border-[#27275b]'}"
						placeholder={translate("home.form.messagePlaceholder")}
						oninput={(e) =>
							handleFieldInput(
								"message",
								(e.target as HTMLTextAreaElement).value,
							)}
						onblur={() => handleFieldBlur("message")}
					></textarea>
					<div class="flex justify-between items-center mt-1">
						{#if touchedFields.message && validationErrors.message.error}
							<p class="text-sm text-red-600 flex items-center">
								<svg
									class="w-4 h-4 mr-1 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									></path>
								</svg>
								{validationErrors.message.error}
							</p>
						{:else if touchedFields.message && validationErrors.message.isValid && formData.message.trim()}
							<p class="text-sm text-green-600 flex items-center">
								<svg
									class="w-4 h-4 mr-1 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<EditableText
									key="home.form.validation.looksGood"
									tag="span"
								/>
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
					<div
						class="p-4 rounded-lg {formStatus === 'success'
							? 'bg-green-50 border-2 border-green-200 text-green-800'
							: 'bg-red-50 border-2 border-red-200 text-red-800'}"
					>
						<p class="font-bold">{formMessage}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={formStatus === "submitting" ||
						!validationErrors.isFormValid}
					class="w-full px-8 py-4 text-lg font-bold rounded-xl border-2 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed {!validationErrors.isFormValid &&
					(touchedFields.name ||
						touchedFields.email ||
						touchedFields.message)
						? 'opacity-60 cursor-not-allowed'
						: 'hover:scale-105'}"
					style="background: linear-gradient(135deg, {colorPalette.secondary} 0%, {colorPalette.primary} 100%); border-color: {colorPalette.accent};"
				>
					{submitButtonText}
				</button>
			</form>
		</div>
	</div>
</section>

<!-- Full-width border separator -->
<div class="w-full h-2" style="background-color: {colorPalette.primary};"></div>

<style>
	/* Hero logo responsive sizing and positioning */
	.hero-logo {
		height: 2.6rem;
		padding: 13px 0 0 0;
		padding-left: 0px;
		margin-top: -8px;
		margin-left: -4px;
	}

	@media (min-width: 768px) {
		.hero-logo {
			height: 5.4rem;
			padding: 22px 0 0 0;
			margin-left: 0px;
		}
	}

	@media (min-width: 1024px) {
		.hero-logo {
			height: 7.7rem;
			padding: 32px 0 0 0;
			margin-left: 5px;
		}
	}
</style>
