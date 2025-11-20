// Initialize PostgreSQL database schema for Pikastro CMS
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Client } = pg;

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Read schema file
    const schemaPath = join(__dirname, '..', 'src', 'lib', 'server', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('📝 Running schema.sql...');
    await client.query(schema);
    console.log('✅ Database schema created successfully!');

    console.log('\n📊 Tables created:');
    console.log('  - admin_users');
    console.log('  - content');
    console.log('  - content_history');

    console.log('\n🎉 Database initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run seed (to populate content)');
    console.log('2. Start dev server: npm run dev');
    console.log('3. Login at: /admin/login');
    console.log('   Email: magda@zaur.app');
    console.log('   Password: changeme123');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Database connection refused. Please check:');
      console.error('   - Is your DATABASE_URL correct in .env?');
      console.error('   - Is the PostgreSQL server running?');
      console.error('   - Can you connect from this machine?');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();
