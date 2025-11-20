/**
 * Sync database content back to JSON files
 * This script exports content from the database back to the i18n JSON files
 *
 * Usage:
 * 1. Make sure DATABASE_URL is set in .env
 * 2. Run: npm run sync
 *
 * This should be run after Magda makes changes via the CMS to update the JSON files
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
 * Unflatten a flat object into nested structure
 */
function unflattenObject(flat: Record<string, string>): any {
	const result: any = {};

	for (const [key, value] of Object.entries(flat)) {
		const parts = key.split('.');
		let current = result;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];

			if (i === parts.length - 1) {
				// Last part, set the value
				current[part] = value;
			} else {
				// Create nested object if it doesn't exist
				if (!current[part] || typeof current[part] !== 'object') {
					current[part] = {};
				}
				current = current[part];
			}
		}
	}

	return result;
}

/**
 * Sync content for a specific locale
 */
async function syncLocale(locale: string) {
	try {
		console.log(`📥 Syncing content for locale: ${locale}`);

		// Fetch all content for this locale from database
		const result = await pool.query('SELECT key, value FROM content WHERE locale = $1 ORDER BY key', [
			locale
		]);

		if (result.rows.length === 0) {
			console.warn(`⚠️  No content found in database for locale: ${locale}`);
			return;
		}

		// Convert to flat object
		const flatContent: Record<string, string> = {};
		for (const row of result.rows) {
			flatContent[row.key] = row.value;
		}

		// Unflatten to nested structure
		const nestedContent = unflattenObject(flatContent);

		// Write to JSON file
		const outputPath = path.join(__dirname, `../src/locales/${locale}/common.json`);

		// Create directory if it doesn't exist
		const dir = path.dirname(outputPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		// Write file with pretty formatting
		fs.writeFileSync(outputPath, JSON.stringify(nestedContent, null, 2) + '\n', 'utf-8');

		console.log(`✅ Synced ${result.rows.length} entries to ${outputPath}`);
	} catch (error) {
		console.error(`❌ Error syncing locale ${locale}:`, error);
		throw error;
	}
}

/**
 * Main sync function
 */
async function main() {
	try {
		console.log('🔄 Starting content sync from database to JSON files...\n');

		// Get all locales from database
		const localesResult = await pool.query('SELECT DISTINCT locale FROM content ORDER BY locale');
		const locales = localesResult.rows.map((row) => row.locale);

		if (locales.length === 0) {
			console.error('❌ No locales found in database. Run seed script first.');
			process.exit(1);
		}

		console.log(`📋 Found locales: ${locales.join(', ')}\n`);

		// Sync each locale
		for (const locale of locales) {
			await syncLocale(locale);
		}

		console.log('\n✅ Content sync completed successfully!');
		console.log('\n💡 Next steps:');
		console.log('   1. Review the changes in src/locales/*/common.json');
		console.log('   2. Commit and push to trigger a deployment');
		console.log('   3. Changes will be live after deployment');
	} catch (error) {
		console.error('\n❌ Content sync failed:', error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

// Run the sync
main();
