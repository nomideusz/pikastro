<script lang="ts">
	import "../../app.css";

	// Import i18n
	import { t, localeStore, getLocale } from "$lib/i18n";
	import EditableText from "$lib/components/EditableText.svelte";
	import EditableImage from "$lib/components/EditableImage.svelte";

	// Import color extraction utilities
	import {
		extractColorsFromImage,
		assignColorRoles,
		type ColorPalette,
	} from "$lib/utils/colorExtractor";
	import colorsImg from "$lib/assets/images/colors.jpeg";
	import magdaPhoto from "$lib/assets/images/magda.jpg";
	import oMnieBg from "$lib/assets/images/o-mnie-bg.webp";

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

	$effect(() => {
		// Add scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate-fade-in-up");
					}
				});
			},
			{ threshold: 0.1 },
		);

		document
			.querySelectorAll(".observe")
			.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{translate("meta.about.title")}</title>
	<meta name="description" content={translate("meta.about.description")} />
</svelte:head>

<!-- Hero Section -->
<section
	class="relative min-h-[70vh] flex items-center text-white overflow-hidden"
>
	<!-- Background Image -->
	<div class="absolute inset-0">
		<EditableImage
			imageKey="about.hero.background"
			src={oMnieBg}
			alt="O mnie background"
			class="w-full h-full object-cover"
		/>
		<!-- Dark overlay for text readability -->
		<div
			class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"
		></div>
	</div>

	<div class="section relative z-10">
		<div class="max-w-4xl">
			<div class="mb-8 observe">
				<p
					class="font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text"
					style="color: {colorPalette.accent}"
				>
					<EditableText key="about.hero.label" tag="span" />
				</p>
				<h1
					class="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
					style="font-family: 'Playfair Display', serif;"
				>
					<EditableText key="about.hero.name" tag="span" /><br />
					<span style="color: #FF6B9D;"
						><EditableText
							key="about.hero.surname"
							tag="span"
						/></span
					>
				</h1>
				<p
					class="text-xl md:text-2xl font-bold mb-4 text-white/90 leading-tight"
				>
					<EditableText key="about.hero.title" tag="span" />
				</p>
				<p
					class="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed text-gray-100"
				>
					<EditableText key="about.hero.description" tag="span" />
				</p>
			</div>
		</div>
	</div>
</section>

<!-- About Content -->
<section class="bg-white">
	<div class="section">
		<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
			<div class="observe">
				<div
					class="aspect-[3/4] bg-blue-100 relative overflow-hidden rounded-2xl shadow-2xl group"
				>
					<EditableImage
						imageKey="about.profile.photo"
						src={magdaPhoto}
						alt="{translate('about.hero.name')} {translate(
							'about.hero.surname',
						)} - {translate('about.hero.title')}"
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
					<div
						class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						style="background-color: rgba(39, 39, 91, 0.15);"
					></div>
				</div>
			</div>

			<div class="space-y-8 observe">
				<div>
					<h2
						class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight"
						style="font-family: 'Playfair Display', serif;"
					>
						<EditableText
							key="about.experience.heading"
							tag="span"
						/><br />
						<span style="color: #1DA898;"
							><EditableText
								key="about.experience.headingAccent"
								tag="span"
							/></span
						>
					</h2>
					<div
						class="space-y-6 text-gray-600 leading-relaxed text-lg"
					>
						<p>
							<EditableText
								key="about.experience.paragraph1"
								tag="span"
							/>
						</p>
						<p>
							<EditableText
								key="about.experience.paragraph2"
								tag="span"
							/>
						</p>
						<p>
							<strong style="color: {colorPalette.primary}"
								><EditableText
									key="about.experience.paragraph3"
									tag="span"
								/></strong
							>
							<EditableText
								key="about.experience.skills"
								tag="span"
							/>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Skills & Expertise -->
<section
	class="bg-blue-50 border-t-4"
	style="border-top-color: {colorPalette.accent};"
>
	<div class="section">
		<div class="text-center mb-16 observe">
			<p
				class="font-black tracking-[0.3em] uppercase text-sm mb-4"
				style="color: {colorPalette.primary}"
			>
				<EditableText key="about.skills.label" tag="span" />
			</p>
			<h2
				class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<EditableText key="about.skills.heading" tag="span" /><br />
				<span style="color: {colorPalette.primary}"
					><EditableText
						key="about.skills.headingAccent"
						tag="span"
					/></span
				>
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			<div
				class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group"
			>
				<h3
					class="text-xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					<EditableText
						key="about.skills.architecture.title"
						tag="span"
					/>
				</h3>
				<p class="text-gray-600 leading-relaxed">
					<EditableText
						key="about.skills.architecture.description"
						tag="span"
					/>
				</p>
				<ul class="mt-4 space-y-2 text-sm text-gray-600">
					<li>
						• <EditableText
							key="about.skills.architecture.skill1"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="about.skills.architecture.skill2"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="about.skills.architecture.skill3"
							tag="span"
						/>
					</li>
				</ul>
			</div>

			<div
				class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group"
			>
				<h3
					class="text-xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					<EditableText
						key="about.skills.graphics.title"
						tag="span"
					/>
				</h3>
				<p class="text-gray-600 leading-relaxed">
					<EditableText
						key="about.skills.graphics.description"
						tag="span"
					/>
				</p>
				<ul class="mt-4 space-y-2 text-sm text-gray-600">
					<li>
						• <EditableText
							key="about.skills.graphics.skill1"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="about.skills.graphics.skill2"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="about.skills.graphics.skill3"
							tag="span"
						/>
					</li>
				</ul>
			</div>

			<div
				class="bg-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 observe group"
			>
				<h3
					class="text-xl font-black mb-3"
					style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
				>
					<EditableText key="about.skills.ai.title" tag="span" />
				</h3>
				<p class="text-gray-600 leading-relaxed">
					<EditableText
						key="about.skills.ai.description"
						tag="span"
					/>
				</p>
				<ul class="mt-4 space-y-2 text-sm text-gray-600">
					<li>
						• <EditableText
							key="about.skills.ai.skill1"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="about.skills.ai.skill2"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="about.skills.ai.skill3"
							tag="span"
						/>
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Philosophy & Approach -->
<section
	class="gradient-bg text-white relative overflow-hidden border-t-4"
	style="border-top-color: {colorPalette.accent};"
>
	<div class="section">
		<div
			class="absolute top-10 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
			style="background-color: {colorPalette.accent}"
		></div>
		<div
			class="absolute bottom-10 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
			style="background-color: {colorPalette.secondary}; animation-delay: 1.5s;"
		></div>

		<div class="max-w-4xl mx-auto text-center observe relative z-10">
			<h2
				class="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<span style="color: #FF6B9D;"
					><EditableText
						key="about.philosophy.heading"
						tag="span"
					/></span
				>
				<EditableText key="about.philosophy.headingAccent" tag="span" />
			</h2>

			<div class="grid md:grid-cols-2 gap-8 mb-12">
				<div
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
				>
					<h3
						class="text-xl font-black mb-3"
						style="font-family: 'Playfair Display', serif;"
					>
						<EditableText
							key="about.philosophy.functionality.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="about.philosophy.functionality.description"
							tag="span"
						/>
					</p>
				</div>

				<div
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
				>
					<h3
						class="text-xl font-black mb-3"
						style="font-family: 'Playfair Display', serif;"
					>
						<EditableText
							key="about.philosophy.personality.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="about.philosophy.personality.description"
							tag="span"
						/>
					</p>
				</div>

				<div
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
				>
					<h3
						class="text-xl font-black mb-3"
						style="font-family: 'Playfair Display', serif;"
					>
						<EditableText
							key="about.philosophy.innovation.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="about.philosophy.innovation.description"
							tag="span"
						/>
					</p>
				</div>

				<div
					class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
				>
					<h3
						class="text-xl font-black mb-3"
						style="font-family: 'Playfair Display', serif;"
					>
						<EditableText
							key="about.philosophy.partnership.title"
							tag="span"
						/>
					</h3>
					<p class="text-gray-200 leading-relaxed">
						<EditableText
							key="about.philosophy.partnership.description"
							tag="span"
						/>
					</p>
				</div>
			</div>

			<div
				class="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-2xl mx-auto"
			>
				<blockquote
					class="text-xl md:text-2xl font-light italic mb-4"
					style="font-family: 'Playfair Display', serif;"
				>
					"<EditableText key="about.philosophy.quote" tag="span" />"
				</blockquote>
				<p class="font-bold" style="color: #00D4FF;">
					— <EditableText key="about.hero.name" tag="span" />
					<EditableText key="about.hero.surname" tag="span" />
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section
	class="bg-blue-50 border-t-4"
	style="border-top-color: {colorPalette.accent};"
>
	<div class="section">
		<div class="max-w-4xl mx-auto text-center observe">
			<h2
				class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight"
				style="font-family: 'Playfair Display', serif;"
			>
				<EditableText key="about.cta.heading" tag="span" /><br />
				<span style="color: #FF6B9D;"
					><EditableText
						key="about.cta.headingAccent"
						tag="span"
					/></span
				>
			</h2>
			<p
				class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
			>
				<EditableText key="about.cta.description" tag="span" />
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/#kontakt" class="btn">
					<EditableText key="about.cta.button1" tag="span" />
				</a>
				<a href="/#portfolio" class="btn-secondary">
					<EditableText key="about.cta.button2" tag="span" />
				</a>
			</div>
		</div>
	</div>
</section>
