/**
 * Login API endpoint
 * POST /api/auth/login
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authenticateUser } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			return json({ success: false, error: 'Email and password are required' }, { status: 400 });
		}

		// Authenticate user
		const result = await authenticateUser(email, password);

		if (!result.success) {
			return json({ success: false, error: result.error }, { status: 401 });
		}

		// Set HTTP-only cookie with token
		const headers = new Headers();
		headers.append(
			'Set-Cookie',
			`auth_token=${result.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
		);

		return json(
			{
				success: true,
				user: {
					id: result.user.id,
					email: result.user.email,
					name: result.user.name
				}
			},
			{ headers }
		);
	} catch (error) {
		console.error('Login error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
