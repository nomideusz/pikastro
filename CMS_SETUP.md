# Pikastro Custom CMS Setup Guide

This guide will help you set up the custom inline content management system for Pikastro.

## Overview

The Pikastro CMS is a custom-built inline editing system that allows Magda to edit text content directly on the website. Key features:

- **Inline editing**: Click on any text to edit it in place
- **Database-backed**: Content stored in PostgreSQL on your VPS
- **Secure authentication**: Password-protected admin access
- **No external dependencies**: Everything runs on your infrastructure
- **Version history**: Tracks all content changes

## Architecture

```
┌─────────────────┐
│   SvelteKit     │  Frontend (inline editing UI)
│   Frontend      │
└────────┬────────┘
         │
         │ API calls
         ▼
┌─────────────────┐
│   SvelteKit     │  Backend (API routes)
│   API Routes    │  - /api/auth/* (login, logout)
│                 │  - /api/content (CRUD)
└────────┬────────┘
         │
         │ PostgreSQL
         ▼
┌─────────────────┐
│   PostgreSQL    │  Database on VPS
│   Database      │  - content table
│   (VPS)         │  - admin_users table
│                 │  - content_history table
└─────────────────┘
```

## Prerequisites

1. **VPS with PostgreSQL installed**
   - PostgreSQL 12 or higher
   - Remote access enabled
   - Firewall configured to allow connections from Netlify

2. **Node.js environment**
   - Node.js 18+ (for development)
   - npm or pnpm

## Step 1: VPS Database Setup

### 1.1 Install PostgreSQL (if not already installed)

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.2 Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE pikastro_cms;
CREATE USER pikastro_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE pikastro_cms TO pikastro_user;

# Exit PostgreSQL
\q
```

### 1.3 Configure Remote Access

Edit PostgreSQL configuration to allow remote connections:

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/[version]/main/postgresql.conf

# Find and change:
listen_addresses = '*'  # or specify your IP

# Edit pg_hba.conf
sudo nano /etc/postgresql/[version]/main/pg_hba.conf

# Add this line (adjust IP range for your Netlify deployment):
host    pikastro_cms    pikastro_user    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 1.4 Configure Firewall

```bash
# Allow PostgreSQL port (5432)
sudo ufw allow 5432/tcp
```

## Step 2: Local Development Setup

### 2.1 Clone and Install Dependencies

Dependencies are already installed from the previous steps.

### 2.2 Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database (use your VPS credentials)
DATABASE_URL=postgresql://pikastro_user:your_password@your-vps-ip:5432/pikastro_cms

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_random_32_character_secret_here

# Email (existing)
RESEND_API_KEY=re_your_key_here

# Environment
NODE_ENV=development
```

### 2.3 Initialize Database Schema

Run the SQL schema to create tables:

```bash
npm run db:init
```

Or manually:

```bash
psql $DATABASE_URL -f src/lib/server/db/schema.sql
```

### 2.4 Seed Database with Initial Content

This will populate the database with all content from your i18n JSON files and create the admin user:

```bash
npm run seed
```

**Default admin credentials created:**
- Email: `magda@zaur.app`
- Password: `changeme123`

**⚠️ IMPORTANT: Change this password immediately after first login!**

### 2.5 Test Locally

Start the development server:

```bash
npm run dev
```

1. Visit http://localhost:5173
2. Go to http://localhost:5173/admin/login
3. Login with the default credentials
4. You should see the edit mode toggle in the bottom-right corner
5. Enable edit mode and try editing text

## Step 3: Using the CMS

### For Magda (Content Editor)

1. **Login:**
   - Go to `https://pikastro.eu/admin/login`
   - Enter email and password
   - Click "Zaloguj się"

2. **Enable Edit Mode:**
   - After logging in, you'll see a floating button in the bottom-right corner
   - Click the "Tryb edycji OFF" button to turn it ON
   - The button will turn purple when edit mode is active

3. **Edit Content:**
   - Hover over any text on the page
   - Editable text will highlight with a purple border
   - Click on the text to start editing
   - An input/textarea will appear
   - Make your changes
   - Click "Save" (or press Enter for single-line text)
   - The page will reload with your changes

4. **Keyboard Shortcuts:**
   - **Enter**: Save (single-line text)
   - **Ctrl+Enter**: Save (multi-line text)
   - **Escape**: Cancel editing

5. **Logout:**
   - Click the "Wyloguj się" button in the bottom-right corner

### For Developers

#### Adding Editable Content

To make text editable, replace static text with the `<EditableText>` component:

**Before:**
```svelte
<h1 class="text-4xl font-bold">
	{t('home.hero.heading1')}
</h1>
```

**After:**
```svelte
<script>
	import EditableText from '$lib/components/EditableText.svelte';
</script>

<EditableText
	key="home.hero.heading1"
	tag="h1"
	class="text-4xl font-bold"
	category="home"
/>
```

**Props:**
- `key`: Translation key (required) - e.g., "home.hero.heading1"
- `tag`: HTML tag to render (default: "span")
- `class`: CSS classes
- `category`: Category for grouping (e.g., "home", "portfolio")
- `multiline`: Set to true for textarea (default: false)
- `fallback`: Fallback text if key not found

#### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Check auth status

**Content:**
- `GET /api/content?key=home.hero.heading1` - Get single content
- `GET /api/content?locale=pl` - Get all content for locale
- `GET /api/content?category=home` - Get all content for category
- `PUT /api/content` - Update/create content (requires auth)
- `DELETE /api/content?key=home.hero.heading1` - Delete content (requires auth)

## Step 4: Deployment to Netlify

### 4.1 Add Environment Variables to Netlify

In your Netlify dashboard:

1. Go to Site Settings > Environment Variables
2. Add the following variables:
   - `DATABASE_URL`: Your VPS PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `RESEND_API_KEY`: Your existing Resend API key
   - `NODE_ENV`: `production`

### 4.2 Deploy

```bash
# Commit changes
git add .
git commit -m "Add custom inline CMS"
git push origin main
```

Netlify will automatically build and deploy.

### 4.3 Verify Production

1. Visit your production site
2. Go to `/admin/login`
3. Login and test editing

## Security Considerations

### 1. Change Default Password

After first login, immediately change the default password. You can do this by updating the database:

```sql
-- Generate a new password hash with bcrypt (strength 10)
-- Use this Node.js command to generate:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_new_password', 10).then(hash => console.log(hash));"

UPDATE admin_users
SET password_hash = '$2a$10$YOUR_NEW_BCRYPT_HASH_HERE'
WHERE email = 'magda@zaur.app';
```

### 2. Secure Your VPS

- Use strong database password
- Enable firewall
- Keep PostgreSQL updated
- Consider using SSL for database connections
- Limit IP access if possible (whitelist Netlify IPs)

### 3. HTTPS Only

- Netlify provides free SSL
- Ensure `Secure` flag is set on cookies (automatically handled)

### 4. Rate Limiting

Consider adding rate limiting to login endpoint to prevent brute-force attacks.

## Troubleshooting

### Issue: Cannot connect to database

**Solution:**
- Check VPS firewall: `sudo ufw status`
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check pg_hba.conf allows your IP
- Test connection: `psql $DATABASE_URL -c "SELECT 1;"`

### Issue: Login not working

**Solution:**
- Verify admin user exists: `psql $DATABASE_URL -c "SELECT * FROM admin_users;"`
- Check JWT_SECRET is set in .env and Netlify
- Clear browser cookies and try again

### Issue: Changes not saving

**Solution:**
- Check browser console for errors
- Verify you're authenticated: visit `/api/auth/me`
- Check database connectivity
- Look at Netlify function logs

### Issue: Content not loading

**Solution:**
- Verify database was seeded: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM content;"`
- Re-run seed script: `npm run seed`
- Check content API: `curl https://pikastro.eu/api/content?locale=pl`

## Database Maintenance

### Backup Database

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250120.sql
```

### View Content History

```sql
-- See all changes
SELECT ch.*, au.email
FROM content_history ch
JOIN admin_users au ON ch.changed_by = au.id
ORDER BY ch.changed_at DESC
LIMIT 50;
```

### Reset Content to Original

If you need to reset all content to the original i18n files:

```bash
npm run seed
```

This will update all content to match the JSON files.

## Content Workflow

### How Content Updates Work

The CMS uses a **hybrid approach** for optimal performance:

1. **Normal Users** see content from static JSON files (fast, no database calls)
2. **Magda (authenticated)** sees content from the database and can edit it
3. **After editing**, content must be synced back to JSON files for all users to see changes

### Syncing Database to JSON Files

After Magda makes changes via the CMS:

```bash
# 1. Pull latest changes from git
git pull

# 2. Sync database content to JSON files
npm run sync

# 3. Review changes
git diff src/locales/

# 4. Commit and push
git add src/locales/
git commit -m "Update content from CMS"
git push
```

This will trigger a Netlify deployment and all users will see the updated content.

### Why This Workflow?

- ✅ **Fast page loads** - No database queries for regular visitors
- ✅ **Version control** - All content changes are tracked in git
- ✅ **Easy rollback** - Can revert to previous versions via git
- ✅ **Backup** - JSON files serve as content backup
- ✅ **Offline development** - Developers can work without database access

### Alternative: Real-time Updates

If you want changes to appear immediately without sync/deploy:

Modify `src/lib/i18n/index.ts` to load content from the `/api/content` endpoint instead of JSON files. This will make every page load query the database.

**Tradeoffs:**
- ❌ Slower page loads (database query on every request)
- ❌ Requires database to be available
- ✅ Instant content updates

## Future Enhancements

Possible improvements:

1. **Image Upload**: Add ability to upload and manage images
2. **Rich Text Editor**: WYSIWYG editor for formatted content
3. **Preview Mode**: Preview changes before saving
4. **Undo/Redo**: Rollback to previous versions
5. **Multi-user**: Support multiple admin users with different roles
6. **Draft/Publish**: Content staging workflow
7. **Search**: Full-text search across all content

## Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check Netlify function logs
4. Inspect browser console

## Summary

You now have a fully functional custom CMS! 🎉

**Quick Start:**
1. ✅ VPS PostgreSQL setup
2. ✅ Initialize database schema
3. ✅ Seed with content
4. ✅ Login at `/admin/login`
5. ✅ Enable edit mode
6. ✅ Click and edit text
7. ✅ Changes save to database

**Key Files:**
- `src/lib/components/EditableText.svelte` - Main editing component
- `src/lib/stores/editMode.svelte.ts` - Edit mode state
- `src/routes/api/content/+server.ts` - Content API
- `src/routes/api/auth/login/+server.ts` - Auth API
- `src/lib/server/db/schema.sql` - Database schema
- `scripts/seed-database.ts` - Seeding script
