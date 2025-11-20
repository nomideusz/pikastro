#!/bin/bash

# Database Initialization Script for Pikastro CMS
# This script initializes the PostgreSQL database schema and seeds it with content

set -e  # Exit on error

echo "🗄️  Pikastro CMS Database Initialization"
echo "========================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set it using:"
    echo "export DATABASE_URL='postgresql://postgres:edfd973f35b268d1@pikastro-db.zaur.app:5432/postgres'"
    echo ""
    echo "Or for internal access:"
    echo "export DATABASE_URL='postgresql://postgres:edfd973f35b268d1@srv-captain--pikastro-db:5432/postgres'"
    exit 1
fi

echo "📍 Database URL: $DATABASE_URL"
echo ""

# Test connection
echo "🔌 Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ ERROR: Cannot connect to database"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if database is running"
    echo "  2. Verify firewall allows port 5432"
    echo "  3. Confirm credentials are correct"
    echo "  4. Try using SSH tunnel if external access is blocked"
    exit 1
fi
echo ""

# Initialize schema
echo "📋 Creating database tables..."
if psql "$DATABASE_URL" -f src/lib/server/db/schema.sql > /dev/null 2>&1; then
    echo "✅ Database schema initialized"
else
    echo "⚠️  Schema initialization had warnings (this is OK if tables already exist)"
fi
echo ""

# Verify tables exist
echo "🔍 Verifying tables..."
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('content', 'admin_users', 'content_history');" | tr -d ' ')

if [ "$TABLE_COUNT" -eq "3" ]; then
    echo "✅ All 3 tables created successfully"
else
    echo "⚠️  Expected 3 tables, found $TABLE_COUNT"
fi
echo ""

# Check if Node.js is available for seeding
if command -v node > /dev/null 2>&1; then
    echo "🌱 Seeding database with initial content..."
    if npm run seed; then
        echo "✅ Database seeded successfully"
    else
        echo "❌ ERROR: Failed to seed database"
        exit 1
    fi
    echo ""

    # Verify content
    echo "🔍 Verifying seeded data..."
    CONTENT_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM content;" | tr -d ' ')
    ADMIN_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM admin_users;" | tr -d ' ')

    echo "   📝 Content entries: $CONTENT_COUNT"
    echo "   👤 Admin users: $ADMIN_COUNT"

    if [ "$ADMIN_COUNT" -eq "1" ]; then
        echo ""
        echo "✅ Database initialization complete!"
        echo ""
        echo "🔐 Default Admin Credentials:"
        echo "   Email: magda@zaur.app"
        echo "   Password: changeme123"
        echo ""
        echo "⚠️  IMPORTANT: Change the default password immediately after first login!"
        echo ""
        echo "📝 Next Steps:"
        echo "   1. Deploy to Netlify with environment variables"
        echo "   2. Login at /admin/login"
        echo "   3. Change the default password"
        echo "   4. Start editing content!"
    else
        echo "⚠️  Warning: Expected 1 admin user, found $ADMIN_COUNT"
    fi
else
    echo "⚠️  Node.js not found, skipping seeding"
    echo "   Run 'npm run seed' manually after installing Node.js"
fi

echo ""
echo "✨ Done!"
