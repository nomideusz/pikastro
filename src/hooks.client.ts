import { browser } from '$app/environment';
import { locale } from '$lib/i18n';

// Initialize locale on client
if (browser) {
	// Try to get saved language from localStorage
	const savedLocale = localStorage.getItem('locale');
	if (savedLocale && (savedLocale === 'en' || savedLocale === 'pl')) {
		locale.set(savedLocale);
	} else {
		// Fallback to navigator language
		const navigatorLocale = navigator.language;
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
