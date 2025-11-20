/**
 * Get current user endpoint
 * GET /api/auth/me
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '$lib/server/auth';

export const GET: RequestHandler = async ({ request }) => {
	const user = await getCurrentUser(request);

	if (!user) {
		return json({ authenticated: false }, { status: 401 });
	}

	return json({
		authenticated: true,
		user: {
			id: user.id,
			email: user.email,
			name: user.name
		}
	});
};
