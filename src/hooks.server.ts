import type { Handle } from '@sveltejs/kit';
import '$lib/i18n'; // Import to ensure i18n module is initialized

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	return response;
};
