import type { LayoutServerLoad } from './$types';
import '$lib/i18n'; // Ensure i18n is initialized

export const load: LayoutServerLoad = async () => {
	// Return the default locale for SSR
	return {
		locale: 'pl'
	};
};
