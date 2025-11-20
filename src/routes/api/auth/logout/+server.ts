/**
 * Logout API endpoint
 * POST /api/auth/logout
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	// Clear the auth cookie
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`auth_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
	);

	return json({ success: true }, { headers });
};
