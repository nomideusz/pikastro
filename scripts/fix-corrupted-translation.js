// Fix corrupted translation
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function fixTranslation() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    console.log('🔧 Fixing corrupted translation...');

    await client.query(`
      UPDATE content
      SET value = 'Dość beżu.'
      WHERE key = 'home.hero.heading1' AND locale = 'pl';
    `);

    console.log('✅ Fixed: home.hero.heading1');
    console.log('\n🎉 Translation fixed!');

  } catch (error) {
    console.error('❌ Error fixing translation:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixTranslation();
