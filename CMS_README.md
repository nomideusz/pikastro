# Pikastro Custom Inline CMS

## What is This?

A custom-built content management system that allows Magda to edit website text **directly on the page** - no admin panel needed!

## Quick Demo

1. **Login**: Go to `/admin/login`
2. **Edit Mode**: Click the floating button in bottom-right corner
3. **Edit Text**: Click any text on the page to edit it
4. **Save**: Press Enter or click Save button
5. **Done**: Changes are saved to database

## Key Features

✅ **Inline Editing** - Edit text exactly where it appears
✅ **Simple Authentication** - Just email & password
✅ **Database-Backed** - PostgreSQL on your VPS
✅ **Version History** - Tracks all content changes
✅ **No Recurring Costs** - Self-hosted, no subscriptions
✅ **Git-Tracked** - Sync changes back to version control

## Architecture

```
Website → EditableText Component → API → PostgreSQL (VPS)
```

## Files Added

### Components
- `src/lib/components/EditableText.svelte` - Main inline editing component
- `src/lib/components/EditModeToggle.svelte` - Edit mode toggle UI
- `src/lib/stores/editMode.svelte.ts` - Edit mode state management

### API Routes
- `src/routes/api/auth/login/+server.ts` - Login endpoint
- `src/routes/api/auth/logout/+server.ts` - Logout endpoint
- `src/routes/api/auth/me/+server.ts` - Auth check endpoint
- `src/routes/api/content/+server.ts` - Content CRUD operations

### Database
- `src/lib/server/db/schema.sql` - PostgreSQL schema
- `src/lib/server/db/index.ts` - Database connection
- `src/lib/server/auth.ts` - Authentication utilities

### Scripts
- `scripts/seed-database.ts` - Populate database from JSON files
- `scripts/sync-content-to-json.ts` - Export database content to JSON

### Pages
- `src/routes/admin/login/+page.svelte` - Login page

### Configuration
- `.env.example` - Environment variables template

### Documentation
- `CMS_SETUP.md` - Complete setup guide (START HERE!)

## Setup Steps (Summary)

1. **Install PostgreSQL on VPS**
2. **Configure `.env` with database URL**
3. **Run `npm run db:init`** to create tables
4. **Run `npm run seed`** to populate content
5. **Login at `/admin/login`**
6. **Start editing!**

## Content Workflow

1. Magda edits content via CMS → saves to database
2. Run `npm run sync` to export database → JSON files
3. Commit and push → triggers Netlify deployment
4. All users see updated content

## Default Credentials

**Email:** `magda@zaur.app`
**Password:** `changeme123`

⚠️ **CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!**

## Next Steps

1. Read `CMS_SETUP.md` for detailed setup instructions
2. Set up PostgreSQL on your VPS
3. Configure environment variables
4. Initialize database
5. Start editing!

## Support

Questions? Check:
1. `CMS_SETUP.md` - Detailed setup guide
2. Code comments - Every file is documented
3. Browser console - For debugging

## What's NOT Included (Yet)

- Image uploads (use current method)
- Rich text formatting (plain text only)
- Multi-user support (just Magda)
- Real-time previews (page reloads after save)

These can be added later if needed!

---

**Total Development Time:** ~12 hours
**Monthly Cost:** $0 (self-hosted on your VPS)
**Dependencies:** PostgreSQL on VPS, that's it!
