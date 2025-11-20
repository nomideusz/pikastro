/**
 * Database connection utility
 * PostgreSQL connection using pg library
 */

import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

// Create a connection pool
let pool: pkg.Pool | null = null;

export function getPool(): pkg.Pool {
	if (!pool) {
		const DATABASE_URL = env.DATABASE_URL;
		if (!DATABASE_URL) {
			throw new Error('DATABASE_URL environment variable is not set');
		}

		pool = new Pool({
			connectionString: DATABASE_URL,
			ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
			max: 10, // Maximum number of clients in the pool
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000
		});

		// Handle pool errors
		pool.on('error', (err) => {
			console.error('Unexpected error on idle PostgreSQL client', err);
		});
	}

	return pool;
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
	const pool = getPool();
	const start = Date.now();
	try {
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		console.log('Executed query', { text, duration, rows: res.rowCount });
		return res;
	} catch (error) {
		console.error('Database query error:', error);
		throw error;
	}
}

// Close the pool (useful for cleanup)
export async function closePool() {
	if (pool) {
		await pool.end();
		pool = null;
	}
}

// Type definitions for database tables
export interface AdminUser {
	id: number;
	email: string;
	password_hash: string;
	name: string | null;
	created_at: Date;
}

export interface Content {
	id: number;
	key: string;
	value: string;
	locale: string;
	category: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface ContentHistory {
	id: number;
	content_id: number;
	content_key: string;
	old_value: string;
	new_value: string;
	changed_by: number;
	changed_at: Date;
}
