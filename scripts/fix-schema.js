// Fix database schema to support multiple locales
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function fixSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    console.log('🔧 Fixing schema to support multiple locales...');

    // Drop the old unique constraint on key
    await client.query(`
      ALTER TABLE content
      DROP CONSTRAINT IF EXISTS content_key_key;
    `);
    console.log('✅ Removed old unique constraint on key');

    // Add new composite unique constraint on (key, locale)
    await client.query(`
      ALTER TABLE content
      ADD CONSTRAINT content_key_locale_unique UNIQUE (key, locale);
    `);
    console.log('✅ Added composite unique constraint on (key, locale)');

    console.log('\n🎉 Schema fixed! You can now run: npm run seed');

  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixSchema();
