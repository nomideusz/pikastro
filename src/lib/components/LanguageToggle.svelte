<script lang="ts">
	import { locale, setLocale, currentLocale } from '$lib/i18n';
	import { get } from 'svelte/store';

	function toggleLanguage() {
		const current = get(locale);
		const newLocale = current === 'pl' ? 'en' : 'pl';
		setLocale(newLocale);
	}

	// Reactive declaration to get the current locale value
	$: lang = $currentLocale || 'pl';
</script>

<button
	onclick={toggleLanguage}
	class="flex items-center gap-2 px-3 py-2 text-sm font-bold tracking-wide uppercase transition-all duration-300 rounded-lg hover:bg-gray-100"
	aria-label="Toggle language"
	title={lang === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
>
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
	</svg>
	<span class="hidden sm:inline">{lang === 'pl' ? 'EN' : 'PL'}</span>
	<span class="inline sm:hidden">{lang === 'pl' ? 'EN' : 'PL'}</span>
</button>

<style>
	button {
		color: rgb(55, 65, 81);
	}

	button:hover {
		color: var(--color-primary, #27275B);
	}
</style>
