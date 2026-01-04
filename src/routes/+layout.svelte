<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import {
		extractColorsFromImage,
		assignColorRoles,
		type ColorPalette,
	} from "$lib/utils/colorExtractor";
	import colorsImg from "$lib/assets/images/colors.jpeg";
	import { t, localeStore, getLocale } from "$lib/i18n";
	import LanguageToggle from "$lib/components/LanguageToggle.svelte";
	import EditModeToggle from "$lib/components/EditModeToggle.svelte";
	import EditableText from "$lib/components/EditableText.svelte";

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

	// Extract colors from the colors image on mount
	// Disabled to use static color palette
	// $effect(() => {
	// 	extractColorsFromImage(colorsImg, 5)
	// 		.then((colors) => {
	// 			if (colors.length > 0) {
	// 				const roles = assignColorRoles(colors);
	// 				colorPalette = roles;
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.warn('Could not extract colors from image:', error);
	// 		});
	// });

	// Update HTML lang attribute when locale changes
	$effect(() => {
		if (typeof document !== "undefined") {
			document.documentElement.lang = currentLocale;
		}
	});

	// Helper function to get the correct link path
	function getNavLink(href: string): string {
		// If we're on the main page, use hash anchors
		if ($page.url.pathname === "/") {
			return href;
		}
		// If we're on a subpage, prefix with / for main page navigation
		return "/" + href;
	}

	let { children } = $props();
	let isMenuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Pikastro | Projektowanie Wnętrz | Grafika | AI</title>
	<meta
		name="description"
		content="Projektowanie wnętrz i grafika z AI dla młodych (20-30 lat). Odważne, kolorowe aranżacje mieszkań zamiast beżowo-szarych. Kompleksowa obsługa w Krakowie - szybko i w atrakcyjnych cenach."
	/>
</svelte:head>

<!-- Navigation -->
<nav
	class="sticky top-0 z-50 transition-all duration-300 shadow-sm px-6 md:px-12"
	style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);"
>
	<div class="max-w-7xl mx-auto">
		<div class="flex justify-between items-center py-4">
			<div class="flex items-center">
				<a
					href="/"
					class="flex items-center group transition-all duration-300"
				>
					<img
						src="/logo.png"
						alt="Pikastro Logo"
						class="h-12 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
					/>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center space-x-8">
				<a
					href="/o-mnie"
					class="text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]"
				>
					{translate("nav.about")}
					<span
						class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
						style="background-color: var(--color-accent);"
					></span>
				</a>
				<a
					href="/oferta"
					class="text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]"
				>
					{translate("nav.offer")}
					<span
						class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
						style="background-color: var(--color-accent);"
					></span>
				</a>
				<a
					href="/ceny"
					class="text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]"
				>
					{translate("nav.pricing")}
					<span
						class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
						style="background-color: var(--color-accent);"
					></span>
				</a>
				<a
					href="/portfolio"
					class="text-[#27275b] transition-colors font-bold text-sm tracking-wide uppercase relative group hover:text-[var(--color-primary)]"
				>
					{translate("nav.portfolio")}
					<span
						class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
						style="background-color: var(--color-accent);"
					></span>
				</a>
				<LanguageToggle />
				<a
					href={getNavLink("#kontakt")}
					class="px-6 py-3 text-white transition-all duration-300 text-sm tracking-wide uppercase font-bold rounded-xl border-2 transform hover:scale-110"
					style="background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%); border-color: var(--color-accent);"
				>
					{translate("nav.contact")}
				</a>
			</div>

			<!-- Mobile menu button -->
			<div class="lg:hidden">
				<button
					onclick={() => (isMenuOpen = !isMenuOpen)}
					class="text-[#27275b] focus:outline-none transition-colors hover:text-[var(--color-primary)]"
					aria-label="Toggle menu"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="2"
					>
						{#if isMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6 18L18 6M6 6l12 12"
							></path>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<div
				class="lg:hidden pb-6 mt-2 animate-fade-in-up"
				style="border-top: 1px solid rgba(0, 0, 0, 0.08);"
			>
				<div class="px-4 pt-6 space-y-3">
					<!-- Navigation Items -->
					<div class="space-y-2">
						<a
							href="/o-mnie"
							onclick={() => (isMenuOpen = false)}
							class="block px-4 py-3 text-[#27275b] transition-all duration-300 font-bold text-sm tracking-wide uppercase rounded-lg hover:bg-gray-50 hover:text-[var(--color-primary)] transform hover:translate-x-1"
						>
							{translate("nav.about")}
						</a>
						<a
							href="/oferta"
							onclick={() => (isMenuOpen = false)}
							class="block px-4 py-3 text-[#27275b] transition-all duration-300 font-bold text-sm tracking-wide uppercase rounded-lg hover:bg-gray-50 hover:text-[var(--color-primary)] transform hover:translate-x-1"
						>
							{translate("nav.offer")}
						</a>
						<a
							href="/ceny"
							onclick={() => (isMenuOpen = false)}
							class="block px-4 py-3 text-[#27275b] transition-all duration-300 font-bold text-sm tracking-wide uppercase rounded-lg hover:bg-gray-50 hover:text-[var(--color-primary)] transform hover:translate-x-1"
						>
							{translate("nav.pricing")}
						</a>
						<a
							href="/portfolio"
							onclick={() => (isMenuOpen = false)}
							class="block px-4 py-3 text-[#27275b] transition-all duration-300 font-bold text-sm tracking-wide uppercase rounded-lg hover:bg-gray-50 hover:text-[var(--color-primary)] transform hover:translate-x-1"
						>
							{translate("nav.portfolio")}
						</a>
					</div>

					<!-- Language Toggle -->
					<div class="px-4">
						<LanguageToggle />
					</div>

					<!-- CTA Button -->
					<div class="pt-3 border-t border-gray-100">
						<a
							href={getNavLink("#kontakt")}
							onclick={() => (isMenuOpen = false)}
							class="block px-4 py-3 text-center text-white transition-all duration-300 text-sm tracking-wide uppercase font-bold rounded-xl border-2 transform hover:scale-105"
							style="background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%); border-color: var(--color-accent);"
						>
							{translate("nav.contact")}
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>

{@render children()}

<!-- Edit Mode Toggle (only visible when authenticated) -->
<EditModeToggle />

<!-- Footer -->
<footer
	class="gradient-bg text-white py-16 px-6 md:px-12 relative overflow-hidden"
>
	<div
		class="absolute top-0 right-0 w-96 h-96 bg-[#FB7185] rounded-full mix-blend-multiply filter blur-3xl opacity-10"
	></div>
	<div
		class="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-10"
	></div>
	<div class="max-w-7xl mx-auto relative z-10">
		<div class="grid md:grid-cols-4 gap-12 mb-12">
			<div>
				<div class="inline-block mb-4">
					<img
						src="/logo_teal.png"
						alt="Pikastro Logo"
						class="h-10 w-auto"
					/>
				</div>
				<p class="text-gray-200 leading-relaxed">
					<EditableText key="footer.description" tag="span" />
				</p>
			</div>
			<div>
				<h4
					class="text-sm uppercase tracking-wider mb-4 font-bold text-[#FB7185]"
				>
					<EditableText key="footer.offer" tag="span" />
				</h4>
				<ul class="space-y-2 text-gray-200 text-sm">
					<li>
						• <EditableText
							key="footer.services.interior_design"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.services.space_arrangement"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.services.visual_identity"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.services.computer_graphics"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.services.ai_technology"
							tag="span"
						/>
					</li>
				</ul>
			</div>
			<div>
				<h4
					class="text-sm uppercase tracking-wider mb-4 font-bold text-[#FB7185]"
				>
					<EditableText key="footer.clients" tag="span" />
				</h4>
				<ul class="space-y-2 text-gray-200 text-sm">
					<li>
						• <EditableText
							key="footer.clientTypes.apartment_buyers"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.clientTypes.developers"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.clientTypes.real_estate"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.clientTypes.startups"
							tag="span"
						/>
					</li>
					<li>
						• <EditableText
							key="footer.clientTypes.commercial"
							tag="span"
						/>
					</li>
				</ul>
			</div>
			<div>
				<h4
					class="text-sm uppercase tracking-wider mb-4 font-bold text-[#FB7185]"
				>
					<EditableText key="footer.contact" tag="span" />
				</h4>
				<ul class="space-y-2 text-gray-200 font-medium">
					<li>kontakt@pikastro.eu</li>
					<li><EditableText key="footer.location" tag="span" /></li>
				</ul>
			</div>
		</div>
		<div
			class="pt-8 border-t border-white/20 text-center text-sm text-gray-300"
		>
			<p class="font-medium">
				&copy; 2025 Pikastro. <EditableText
					key="footer.copyright"
					tag="span"
				/>
			</p>
		</div>
	</div>
</footer>
