/**
 * Database seeding script
 * Populates the database with content from i18n JSON files
 *
 * Usage:
 * 1. Make sure DATABASE_URL is set in .env
 * 2. Run: npm run seed
 */

import pkg from 'pg';
const { Pool } = pkg;
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL environment variable is not set');
	process.exit(1);
}

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Flatten nested JSON object into key-value pairs
 */
function flattenObject(obj: any, prefix = ''): Record<string, string> {
	const flattened: Record<string, string> = {};

	for (const key in obj) {
		const newKey = prefix ? `${prefix}.${key}` : key;
		const value = obj[key];

		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			// Recursively flatten nested objects
			Object.assign(flattened, flattenObject(value, newKey));
		} else if (typeof value === 'string') {
			// Only store string values
			flattened[newKey] = value;
		}
	}

	return flattened;
}

/**
 * Extract category from key (first part before the dot)
 */
function extractCategory(key: string): string {
	const parts = key.split('.');
	return parts[0];
}

/**
 * Seed content from a locale JSON file
 */
async function seedLocale(locale: string, filePath: string) {
	try {
		console.log(`📝 Seeding content for locale: ${locale}`);

		// Read and parse JSON file
		const jsonContent = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(jsonContent);

		// Flatten the nested structure
		const flattened = flattenObject(data);

		let insertedCount = 0;
		let updatedCount = 0;

		// Insert each key-value pair
		for (const [key, value] of Object.entries(flattened)) {
			const category = extractCategory(key);

			// Check if content already exists
			const existingResult = await pool.query(
				'SELECT id FROM content WHERE key = $1 AND locale = $2',
				[key, locale]
			);

			if (existingResult.rows.length > 0) {
				// Update existing content
				await pool.query(
					'UPDATE content SET value = $1, category = $2, updated_at = CURRENT_TIMESTAMP WHERE key = $3 AND locale = $4',
					[value, category, key, locale]
				);
				updatedCount++;
			} else {
				// Insert new content
				await pool.query(
					'INSERT INTO content (key, value, locale, category) VALUES ($1, $2, $3, $4)',
					[key, value, locale, category]
				);
				insertedCount++;
			}
		}

		console.log(
			`✅ Locale ${locale}: ${insertedCount} inserted, ${updatedCount} updated (total: ${Object.keys(flattened).length})`
		);
	} catch (error) {
		console.error(`❌ Error seeding locale ${locale}:`, error);
		throw error;
	}
}

/**
 * Create admin user (Magda)
 */
async function createAdminUser() {
	try {
		console.log('\n👤 Setting up admin user...');

		const email = 'magda@zaur.app';
		const defaultPassword = 'changeme123'; // MUST BE CHANGED

		// Check if admin user already exists
		const existingResult = await pool.query('SELECT id FROM admin_users WHERE email = $1', [
			email
		]);

		if (existingResult.rows.length > 0) {
			console.log(`ℹ️  Admin user ${email} already exists. Skipping creation.`);
			return;
		}

		// Hash password using bcrypt
		const bcrypt = await import('bcryptjs');
		const passwordHash = await bcrypt.hash(defaultPassword, 10);

		// Insert admin user
		await pool.query(
			'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3)',
			[email, passwordHash, 'Magda']
		);

		console.log(`✅ Admin user created: ${email}`);
		console.log(
			`⚠️  DEFAULT PASSWORD: ${defaultPassword} - PLEASE CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!`
		);
	} catch (error) {
		console.error('❌ Error creating admin user:', error);
		throw error;
	}
}

/**
 * Main seeding function
 */
async function main() {
	try {
		console.log('🌱 Starting database seeding...\n');

		// Paths to locale files
		const localesDir = path.join(__dirname, '../src/locales');
		const plFilePath = path.join(localesDir, 'pl/common.json');
		const enFilePath = path.join(localesDir, 'en/common.json');

		// Seed Polish content
		if (fs.existsSync(plFilePath)) {
			await seedLocale('pl', plFilePath);
		} else {
			console.warn(`⚠️  Polish locale file not found: ${plFilePath}`);
		}

		// Seed English content
		if (fs.existsSync(enFilePath)) {
			await seedLocale('en', enFilePath);
		} else {
			console.warn(`⚠️  English locale file not found: ${enFilePath}`);
		}

		// Create admin user
		await createAdminUser();

		console.log('\n✅ Database seeding completed successfully!');
	} catch (error) {
		console.error('\n❌ Database seeding failed:', error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

// Run the seeding
main();
