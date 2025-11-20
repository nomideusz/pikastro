# Database Initialization Guide

Your PostgreSQL database is deployed and ready at:
- **Internal (CapRover network)**: `srv-captain--pikastro-db:5432`
- **External**: `pikastro-db.zaur.app:5432`
- **Credentials**:
  - User: `postgres`
  - Password: `edfd973f35b268d1`
  - Database: `postgres`

## Option 1: Initialize from a Machine with Access

If you have a machine that can access `pikastro-db.zaur.app`, run:

```bash
# 1. Set the DATABASE_URL
export DATABASE_URL="postgresql://postgres:edfd973f35b268d1@pikastro-db.zaur.app:5432/postgres"

# 2. Initialize the database schema
psql $DATABASE_URL -f src/lib/server/db/schema.sql

# 3. Seed the database with content
npm run seed
```

## Option 2: Initialize via SSH Tunnel

If the database is not directly accessible, create an SSH tunnel through your VPS:

```bash
# On your local machine:
ssh -L 5433:srv-captain--pikastro-db:5432 user@your-vps-ip

# In another terminal, run:
export DATABASE_URL="postgresql://postgres:edfd973f35b268d1@localhost:5433/postgres"
psql $DATABASE_URL -f src/lib/server/db/schema.sql
npm run seed
```

## Option 3: Initialize Directly on VPS

SSH into your VPS and run:

```bash
# 1. Install Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone the repo (if not already there)
git clone https://github.com/nomideusz/pikastro.git
cd pikastro

# 3. Install dependencies
npm install

# 4. Set environment variable
export DATABASE_URL="postgresql://postgres:edfd973f35b268d1@srv-captain--pikastro-db:5432/postgres"

# 5. Initialize database
psql $DATABASE_URL -f src/lib/server/db/schema.sql

# 6. Seed database
npm run seed
```

## Option 4: Manual SQL Execution

Copy the SQL from `src/lib/server/db/schema.sql` and execute it manually using your database management tool (pgAdmin, DBeaver, etc.) or CapRover's database UI.

## For Netlify Deployment

When deploying to Netlify, add these environment variables in your Netlify dashboard:

```env
DATABASE_URL=postgresql://postgres:edfd973f35b268d1@pikastro-db.zaur.app:5432/postgres
JWT_SECRET=e0bd07e8b14d3b09b5fd50921b9a681a9ad4a2e2e2cf86eb55f729ebb95d8c34
RESEND_API_KEY=your_resend_key_here
NODE_ENV=production
```

**Note**: If Netlify is on the same network as CapRover, you can use the internal hostname:
```
DATABASE_URL=postgresql://postgres:edfd973f35b268d1@srv-captain--pikastro-db:5432/postgres
```

## Verify Database Setup

After initialization, verify the setup:

```bash
# Check tables were created
psql $DATABASE_URL -c "\dt"

# Check content was seeded
psql $DATABASE_URL -c "SELECT COUNT(*) FROM content;"

# Check admin user exists
psql $DATABASE_URL -c "SELECT email FROM admin_users;"
```

Expected output:
- 3 tables: `content`, `admin_users`, `content_history`
- ~100+ content entries (depends on your i18n files)
- 1 admin user: `magda@zaur.app`

## Troubleshooting

### Connection Refused
- Check firewall allows port 5432
- Verify database is running: `docker ps` (if using CapRover)
- Test with: `telnet pikastro-db.zaur.app 5432`

### Authentication Failed
- Double-check password: `edfd973f35b268d1`
- Verify user exists in database

### Host Not Found
- If external hostname doesn't resolve, use SSH tunnel or initialize from VPS directly

## Next Steps

After database is initialized:
1. Test login at `/admin/login` with credentials:
   - Email: `magda@zaur.app`
   - Password: `changeme123` (CHANGE THIS IMMEDIATELY!)
2. Enable edit mode and test editing
3. Run `npm run sync` after making changes to export content back to JSON files

## Security Note

⚠️ **IMPORTANT**: The default admin password is `changeme123`. Change it immediately after first login!

To change the password, connect to the database and run:

```sql
-- Generate new hash with bcrypt (run this in Node.js):
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_new_password', 10).then(hash => console.log(hash));"

UPDATE admin_users
SET password_hash = '$2a$10$YOUR_NEW_BCRYPT_HASH_HERE'
WHERE email = 'magda@zaur.app';
```
