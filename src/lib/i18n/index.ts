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
	try {
		// Get current locale (default to 'pl')
		let currentLocale = 'pl';
		try {
			currentLocale = get(locale) || 'pl';
		} catch (e) {
			// Locale store not ready, use default
		}

		// First, try direct access to imported translations (most reliable for SSR)
		if (translations && translations[currentLocale]) {
			const keys = key.split('.');
			let value: any = translations[currentLocale];

			for (const k of keys) {
				if (value && typeof value === 'object' && k in value) {
					value = value[k];
				} else {
					value = null;
					break;
				}
			}

			if (value && typeof value === 'string') {
				return value;
			}
		}

		// Fallback to dictionary store if direct access fails
		try {
			const dict = get(dictionary);
			if (dict && dict[currentLocale]) {
				const keys = key.split('.');
				let value: any = dict[currentLocale];

				for (const k of keys) {
					if (value && typeof value === 'object' && k in value) {
						value = value[k];
					} else {
						value = null;
						break;
					}
				}

				if (value && typeof value === 'string') {
					return value;
				}
			}
		} catch (e) {
			// Dictionary not ready
		}

		// Last resort: try t store
		try {
			const translateFn = get(t);
			if (typeof translateFn === 'function') {
				const value = translateFn(key);
				if (value && value !== key) {
					return value;
				}
			}
		} catch (e) {
			// t store not ready
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
