import { derived } from 'svelte/store';
import { init, locale, dictionary, t, _, getLocaleFromNavigator } from 'svelte-i18n';

// Import translations
import en from '../../locales/en/common.json';
import pl from '../../locales/pl/common.json';

// Add all translations
dictionary.set({
	en,
	pl
});

// Initialize i18n with proper SSR support
init({
	fallbackLocale: 'pl',
	initialLocale: 'pl', // Set a default locale for SSR
});

// Set initial locale - for SSR compatibility
locale.set('pl');

// Browser-side language persistence and locale detection
if (typeof window !== 'undefined') {
	// Try to get saved language from localStorage first
	const savedLocale = localStorage.getItem('locale');
	if (savedLocale && (savedLocale === 'en' || savedLocale === 'pl')) {
		locale.set(savedLocale);
	} else {
		// Fallback to navigator language
		const navigatorLocale = getLocaleFromNavigator();
		if (navigatorLocale && (navigatorLocale === 'en' || navigatorLocale.startsWith('en'))) {
			locale.set('en');
		} else {
			locale.set('pl');
		}
	}

	// Save locale changes to localStorage
	locale.subscribe((value) => {
		if (value) {
			localStorage.setItem('locale', value);
		}
	});
}

// Create a safe translation function that works with SSR
export function tSafe(key: string): string {
	if (typeof window === 'undefined') {
		// Server-side rendering: return key as fallback
		return key;
	}

	// Client-side: get current translation function
	let currentT: ((key: string) => string) | null = null;
	const unsubscribe = t.subscribe(($t) => {
		currentT = $t;
	});

	// Get current value synchronously
	if (currentT) {
		unsubscribe();
		return currentT(key);
	}

	// Fallback if store isn't ready
	unsubscribe();
	return key;
}

// Export commonly used stores and functions
export { locale, t, _, dictionary };

// Helper to switch language
export function setLocale(newLocale: string) {
	locale.set(newLocale);
}

// Helper to get current locale
export const currentLocale = derived(locale, ($locale) => $locale);
