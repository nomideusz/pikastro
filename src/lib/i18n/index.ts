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

// Initialize i18n
init({
	fallbackLocale: 'pl',
	initialLocale: getLocaleFromNavigator() || 'pl',
});

// Browser-side language persistence
if (typeof window !== 'undefined') {
	// Try to get saved language from localStorage
	const savedLocale = localStorage.getItem('locale');
	if (savedLocale && (savedLocale === 'en' || savedLocale === 'pl')) {
		locale.set(savedLocale);
	}

	// Save locale changes to localStorage
	locale.subscribe((value) => {
		if (value) {
			localStorage.setItem('locale', value);
		}
	});
}

// Export commonly used stores and functions
export { locale, t, _, dictionary };

// Helper to switch language
export function setLocale(newLocale: string) {
	locale.set(newLocale);
}

// Helper to get current locale
export const currentLocale = derived(locale, ($locale) => $locale);
