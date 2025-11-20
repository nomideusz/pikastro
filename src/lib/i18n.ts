/**
 * i18n - Internationalization module
 * Loads translations from database-backed content system
 */

// Simple writable store implementation
function writable<T>(initialValue: T) {
	let value = initialValue;
	const subscribers: Array<() => void> = [];

	return {
		subscribe(fn: () => void) {
			subscribers.push(fn);
			fn(); // Call immediately
			return () => {
				const index = subscribers.indexOf(fn);
				if (index !== -1) subscribers.splice(index, 1);
			};
		},
		set(newValue: T) {
			value = newValue;
			subscribers.forEach(fn => fn());
		},
		update(fn: (val: T) => T) {
			value = fn(value);
			subscribers.forEach(fn => fn());
		},
		get value() {
			return value;
		}
	};
}

// Current locale (default: 'pl')
export const localeStore = writable<string>('pl');

// Translations version - increments when new translations are loaded
export const translationsVersion = writable<number>(0);

// Loading state
let isLoading = false;
let isLoaded = false;

// Translations loaded from database
const translations: Record<string, Record<string, string>> = {
	pl: {},
	en: {}
};

/**
 * Get current locale
 */
export function getLocale(): string {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('locale') || 'pl';
	}
	return 'pl';
}

/**
 * Set locale
 */
export function setLocale(locale: string) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('locale', locale);
	}
	localeStore.set(locale);
}

/**
 * Load translations from API
 * Only runs on client-side, never during SSR
 */
export async function loadTranslations(locale: string) {
	// CRITICAL: Only load translations in the browser (client-side), never during SSR
	if (typeof window === 'undefined') {
		return;  // Silent return during SSR
	}

	if (isLoading) return; // Prevent duplicate loads

	isLoading = true;
	try {
		console.log(`[i18n] Loading translations for locale: ${locale}`);
		const response = await fetch(`/api/content?locale=${locale}`);
		if (response.ok) {
			const result = await response.json();
			console.log(`[i18n] Received ${result.data?.length || 0} translations`);
			if (result.success && result.data) {
				// Convert array of {key, value} to object
				const translationMap: Record<string, string> = {};
				result.data.forEach((item: { key: string; value: string }) => {
					translationMap[item.key] = item.value;
				});
				translations[locale] = translationMap;
				isLoaded = true;

				console.log(`[i18n] Loaded ${Object.keys(translationMap).length} translations for ${locale}`);

				// Trigger reactivity by updating both stores
				localeStore.set(locale);
				translationsVersion.update(v => v + 1);
			}
		}
	} catch (error) {
		console.error(`[i18n] Failed to load translations for locale ${locale}:`, error);
	} finally {
		isLoading = false;
	}
}

/**
 * Translate a key to current locale
 * Falls back to key if translation not found
 */
export function t(key: string): string {
	const locale = getLocale();
	const value = translations[locale]?.[key];

	// If no translation found and translations haven't loaded yet, trigger load
	// But only in browser context, not during SSR
	if (!value && Object.keys(translations[locale] || {}).length === 0) {
		if (typeof window !== 'undefined') {
			loadTranslations(locale);
		}
	}

	return value || key;
}

/**
 * Initialize i18n system
 * Call this on app mount
 */
export async function initI18n() {
	const currentLocale = getLocale();
	await loadTranslations(currentLocale);

	// Load other locales in background
	const otherLocales = ['pl', 'en'].filter(l => l !== currentLocale);
	otherLocales.forEach(locale => loadTranslations(locale));
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
	initI18n();
}
