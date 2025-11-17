import { init, locale, dictionary, t, _, addMessages } from 'svelte-i18n';
import { derived, get } from 'svelte/store';

// Import translations
import en from '../../locales/en/common.json';
import pl from '../../locales/pl/common.json';

// Keep a direct reference to translations for SSR fallback
const translations: Record<string, any> = {
	en,
	pl
};

// Add messages for each locale BEFORE init (required for SSR)
addMessages('en', en);
addMessages('pl', pl);

// Initialize i18n with proper SSR settings
init({
	fallbackLocale: 'pl',
	initialLocale: 'pl'
});

// Set locale after init
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
	// Helper function to navigate nested object by key path
	const getNestedValue = (obj: any, keyPath: string): string | null => {
		const keys = keyPath.split('.');
		let value: any = obj;

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = value[k];
			} else {
				return null;
			}
		}

		return typeof value === 'string' ? value : null;
	};

	try {
		// Get current locale - try store first, fall back to default
		let currentLocale = 'pl';
		try {
			const localeValue = get(locale);
			if (localeValue) {
				currentLocale = localeValue;
			}
		} catch (e) {
			// Store not available, use default 'pl'
		}

		// ALWAYS try direct translations first (most reliable, always available)
		if (translations) {
			const value = getNestedValue(translations[currentLocale], key);
			if (value) return value;

			// Try fallback locale if current locale fails
			if (currentLocale !== 'pl') {
				const fallbackValue = getNestedValue(translations['pl'], key);
				if (fallbackValue) return fallbackValue;
			}
		}

		// Try dictionary store as fallback (for dynamic locale changes on client)
		try {
			const dict = get(dictionary);
			if (dict && dict[currentLocale]) {
				const value = getNestedValue(dict[currentLocale], key);
				if (value) return value;
			}
		} catch (e) {
			// Dictionary not available
		}

		// Last resort: try t store (for client-side reactivity)
		try {
			const translateFn = get(t);
			if (typeof translateFn === 'function') {
				const value = translateFn(key);
				if (value && value !== key) {
					return value;
				}
			}
		} catch (e) {
			// t store not available
		}

		// Return default or key if nothing worked
		return defaultValue || key;
	} catch (e) {
		// Complete failure, return default or key
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
