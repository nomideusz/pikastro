/**
 * Authentication utilities
 * Password hashing and JWT session management
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { query } from './db';
import type { AdminUser } from './db';

const TOKEN_EXPIRY = '7d'; // Session lasts 7 days

export interface SessionPayload {
	userId: number;
	email: string;
	iat?: number;
	exp?: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user session
 */
export function generateToken(userId: number, email: string): string {
	const JWT_SECRET = env.JWT_SECRET;
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET environment variable is not set');
	}

	const payload: SessionPayload = {
		userId,
		email
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): SessionPayload | null {
	const JWT_SECRET = env.JWT_SECRET;
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET environment variable is not set');
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
		return decoded;
	} catch (error) {
		console.error('Token verification failed:', error);
		return null;
	}
}

/**
 * Authenticate a user by email and password
 */
export async function authenticateUser(
	email: string,
	password: string
): Promise<{ success: true; user: AdminUser; token: string } | { success: false; error: string }> {
	try {
		// Find user by email
		const result = await query('SELECT * FROM admin_users WHERE email = $1', [email]);

		if (result.rows.length === 0) {
			return { success: false, error: 'Invalid email or password' };
		}

		const user = result.rows[0] as AdminUser;

		// Verify password
		const isValid = await verifyPassword(password, user.password_hash);

		if (!isValid) {
			return { success: false, error: 'Invalid email or password' };
		}

		// Generate token
		const token = generateToken(user.id, user.email);

		return { success: true, user, token };
	} catch (error) {
		console.error('Authentication error:', error);
		return { success: false, error: 'Authentication failed' };
	}
}

/**
 * Get the currently authenticated user from a request
 */
export async function getCurrentUser(request: Request): Promise<AdminUser | null> {
	const authHeader = request.headers.get('Authorization');
	const cookieHeader = request.headers.get('Cookie');

	let token: string | null = null;

	// Try to get token from Authorization header (Bearer token)
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.substring(7);
	}
	// Or from cookie
	else if (cookieHeader) {
		const cookies = Object.fromEntries(
			cookieHeader.split('; ').map((c) => {
				const [key, ...v] = c.split('=');
				return [key, v.join('=')];
			})
		);
		token = cookies.auth_token || null;
	}

	if (!token) {
		return null;
	}

	// Verify token
	const payload = verifyToken(token);
	if (!payload) {
		return null;
	}

	// Get user from database
	try {
		const result = await query('SELECT * FROM admin_users WHERE id = $1', [payload.userId]);
		if (result.rows.length === 0) {
			return null;
		}
		return result.rows[0] as AdminUser;
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
}

/**
 * Check if a request is authenticated
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
	const user = await getCurrentUser(request);
	return user !== null;
}
