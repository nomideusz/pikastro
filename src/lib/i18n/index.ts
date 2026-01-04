// SSR-safe i18n for Svelte 5 with runes
import en from '../../locales/en/common.json';
import pl from '../../locales/pl/common.json';

// Type for translations
type Translations = Record<string, any>;
export type Locale = 'en' | 'pl';

// Store all translations
const translations: Record<Locale, Translations> = {
	en,
	pl
};

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

// Create a simple reactive locale using a class with getters/setters
class LocaleStore {
	private _value: Locale = 'pl';
	private listeners: Set<() => void> = new Set();

	constructor() {
		// Initialize from localStorage on client
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('locale');
			if (saved === 'en' || saved === 'pl') {
				this._value = saved;
			}
		}
	}

	get value(): Locale {
		return this._value;
	}

	set value(newValue: Locale) {
		if (this._value !== newValue) {
			this._value = newValue;
			if (typeof window !== 'undefined') {
				localStorage.setItem('locale', newValue);
			}
			this.notify();
		}
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private notify() {
		this.listeners.forEach(listener => listener());
	}
}

export const localeStore = new LocaleStore();

// Translation function
export function t(key: string): string {
	const currentLocale = localeStore.value;

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

// Helper to switch language
export function setLocale(newLocale: Locale) {
	localeStore.value = newLocale;
}

// Helper to get current locale
export function getLocale(): Locale {
	return localeStore.value;
}
