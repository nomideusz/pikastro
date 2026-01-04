/**
 * i18n - Internationalization module
 * Loads translations from database-backed content system with JSON fallback
 */

// Import JSON translations as fallback
import plTranslations from '../locales/pl/common.json';
import enTranslations from '../locales/en/common.json';

// Simple writable store implementation
function writable<T>(initialValue: T) {
	let value = initialValue;
	const subscribers: Array<(val: T) => void> = [];

	return {
		subscribe(fn: (val: T) => void) {
			subscribers.push(fn);
			fn(value); // Call immediately with current value
			return () => {
				const index = subscribers.indexOf(fn);
				if (index !== -1) subscribers.splice(index, 1);
			};
		},
		set(newValue: T) {
			value = newValue;
			subscribers.forEach(fn => fn(value));
		},
		update(fn: (val: T) => T) {
			value = fn(value);
			subscribers.forEach(fn => fn(value));
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

// Helper function to flatten nested JSON object into key-value pairs
function flattenObject(obj: any, prefix = ''): Record<string, string> {
	const flattened: Record<string, string> = {};

	for (const key in obj) {
		const newKey = prefix ? `${prefix}.${key}` : key;
		const value = obj[key];

		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			// Recursively flatten nested objects
			Object.assign(flattened, flattenObject(value, newKey));
		} else if (typeof value === 'string') {
			// Only store string values
			flattened[newKey] = value;
		}
	}

	return flattened;
}

// Translations loaded from database, with JSON fallback
const translations: Record<string, Record<string, string>> = {
	pl: flattenObject(plTranslations),
	en: flattenObject(enTranslations)
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
 * Merges database translations with JSON fallback
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
			console.log(`[i18n] Received ${result.data?.length || 0} translations from database`);
			if (result.success && result.data && result.data.length > 0) {
				// Convert array of {key, value} to object
				const dbTranslations: Record<string, string> = {};
				result.data.forEach((item: { key: string; value: string }) => {
					dbTranslations[item.key] = item.value;
				});

				// Merge database translations with JSON fallback
				// Database translations take precedence (CMS updates)
				translations[locale] = {
					...translations[locale], // JSON fallback
					...dbTranslations // Database overrides
				};
				isLoaded = true;

				console.log(`[i18n] Merged ${Object.keys(dbTranslations).length} database translations with JSON fallback for ${locale}`);

				// Trigger reactivity by updating both stores
				localeStore.set(locale);
				translationsVersion.update(v => v + 1);
			} else {
				console.log(`[i18n] No database translations found, using JSON fallback for ${locale}`);
			}
		} else {
			console.warn(`[i18n] Failed to load from database (status ${response.status}), using JSON fallback for ${locale}`);
		}
	} catch (error) {
		console.warn(`[i18n] Failed to load translations from database for ${locale}, using JSON fallback:`, error);
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

	// Try to load from database in the background (will merge with JSON fallback)
	// This ensures CMS updates are loaded if available
	if (typeof window !== 'undefined' && !isLoading && !isLoaded) {
		loadTranslations(locale);
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
