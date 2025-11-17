// Simple, SSR-safe i18n for Svelte 5
import { writable, derived } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

// Import translations
import en from '../../locales/en/common.json';
import pl from '../../locales/pl/common.json';

// Type for translations
type Translations = Record<string, any>;
type Locale = 'en' | 'pl';

// Store all translations
const translations: Record<Locale, Translations> = {
	en,
	pl
};

// Create locale store with default value
export const locale: Writable<Locale> = writable('pl');

// Helper to navigate nested object by key path
function getNestedValue(obj: any, keyPath: string): string | null {
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
}

// Simple translation function - works in both SSR and client
export function getT(key: string, providedLocale?: Locale): string {
	// Determine which locale to use
	let currentLocale: Locale = 'pl';

	if (providedLocale) {
		// Use provided locale if given
		currentLocale = providedLocale;
	} else if (typeof window !== 'undefined') {
		// On client, try to get from localStorage
		const saved = localStorage.getItem('locale');
		if (saved === 'en' || saved === 'pl') {
			currentLocale = saved;
		}
	}

	// Try current locale
	const value = getNestedValue(translations[currentLocale], key);
	if (value) return value;

	// Try fallback locale
	if (currentLocale !== 'pl') {
		const fallbackValue = getNestedValue(translations['pl'], key);
		if (fallbackValue) return fallbackValue;
	}

	// Return key if no translation found
	return key;
}

// Reactive translation store for client-side use
export const t: Readable<(key: string) => string> = derived(
	locale,
	($locale) => (key: string) => getT(key, $locale)
);

// Helper to switch language
export function setLocale(newLocale: Locale) {
	locale.set(newLocale);

	// Save to localStorage if in browser
	if (typeof window !== 'undefined') {
		localStorage.setItem('locale', newLocale);
	}
}

// Get current locale value (for SSR and client)
export function getCurrentLocale(): Locale {
	if (typeof window !== 'undefined') {
		// Client-side: try localStorage first
		const saved = localStorage.getItem('locale');
		if (saved === 'en' || saved === 'pl') {
			return saved;
		}
	}
	return 'pl';
}

// Initialize locale on client
if (typeof window !== 'undefined') {
	const initialLocale = getCurrentLocale();
	locale.set(initialLocale);
}
