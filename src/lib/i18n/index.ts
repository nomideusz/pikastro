import { init, locale, dictionary, t, _ } from 'svelte-i18n';
import { derived, get } from 'svelte/store';

// Import translations
import en from '../../locales/en/common.json';
import pl from '../../locales/pl/common.json';

// Add all translations BEFORE init (required for SSR)
dictionary.set({
	en,
	pl
});

// Set default locale BEFORE init (required for SSR)
locale.set('pl');

// Initialize i18n synchronously for SSR
// The dictionary is already set, so this should work immediately
init({
	fallbackLocale: 'pl',
	initialLocale: 'pl'
});

// Ensure locale is set after init (in case init resets it)
locale.set('pl');


// Create a reactive translation store that's safe for SSR
// This derived store will work in $derived blocks
export function createT() {
	return derived(t, ($t) => {
		return (key: string, defaultValue: string = '') => {
			try {
				if (typeof $t === 'function') {
					const value = $t(key);
					return value || defaultValue || key;
				}
				return defaultValue || key;
			} catch (e) {
				return defaultValue || key;
			}
		};
	});
}

// Safe translation function for SSR - can be used in $derived blocks
export function getT(key: string, defaultValue: string = ''): string {
	try {
		const translateFn = get(t);
		if (typeof translateFn === 'function') {
			const value = translateFn(key);
			return value || defaultValue || key;
		}
		return defaultValue || key;
	} catch (e) {
		// Store not ready yet, return default or key
		return defaultValue || key;
	}
}

// Export commonly used stores and functions
export { locale, t, _, dictionary };

// Helper to switch language
export function setLocale(newLocale: string) {
	locale.set(newLocale);
}

// Helper to get current locale
export const currentLocale = derived(locale, ($locale) => $locale);
