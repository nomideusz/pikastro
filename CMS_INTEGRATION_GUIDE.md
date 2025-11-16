# CMS Integration Guide for Pikastro Website

## Overview

This guide explains the data structure and internationalization setup for the Pikastro website, making it ready for integration with a headless CMS.

## Current Architecture

### Internationalization (i18n)

The website now supports Polish (pl) and English (en) languages using `svelte-i18n`:

- **Translation files**: `src/locales/{lang}/common.json`
- **i18n configuration**: `src/lib/i18n/index.ts`
- **Language toggle**: `src/lib/components/LanguageToggle.svelte`

### Data Structure

All content has been separated into structured data files in `src/lib/data/`:

1. **Services** (`services.ts`)
2. **Portfolio Projects** (`projects.ts`)
3. **Pricing Tiers** (`pricing.ts`)
4. **Process Steps** (`process.ts`)
5. **Before/After Projects** (`beforeAfter.ts`)

## Recommended CMS Options

### 1. Netlify CMS (Best for current setup)

**Pros:**
- Free and open-source
- Git-based (no external database needed)
- Already on Netlify hosting
- Easy to configure

**Setup Steps:**
1. Install Netlify CMS:
   \`\`\`bash
   npm install netlify-cms-app
   \`\`\`

2. Create `static/admin/config.yml`:
   \`\`\`yaml
   backend:
     name: git-gateway
     branch: main

   media_folder: "static/images/uploads"
   public_folder: "/images/uploads"

   collections:
     - name: "translations-pl"
       label: "Polish Translations"
       files:
         - file: "src/locales/pl/common.json"
           label: "Polish Common"
           name: "pl-common"
           fields:
             - {label: "Navigation", name: "nav", widget: "object", fields: [
                 {label: "About", name: "about", widget: "string"},
                 {label: "Offer", name: "offer", widget: "string"},
                 {label: "Pricing", name: "pricing", widget: "string"},
                 {label: "Portfolio", name: "portfolio", widget: "string"},
                 {label: "Contact", name: "contact", widget: "string"}
               ]}

     - name: "translations-en"
       label: "English Translations"
       files:
         - file: "src/locales/en/common.json"
           label: "English Common"
           name: "en-common"
           fields:
             - {label: "Navigation", name: "nav", widget: "object"}
   \`\`\`

3. Create `static/admin/index.html`:
   \`\`\`html
   <!doctype html>
   <html>
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Content Manager</title>
   </head>
   <body>
     <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
   </body>
   </html>
   \`\`\`

4. Enable Netlify Identity and Git Gateway in Netlify dashboard

### 2. Contentful

**Pros:**
- Powerful API
- Rich media handling
- Good free tier

**Migration Path:**
1. Create Contentful space
2. Define content models based on TypeScript interfaces in `src/lib/data/`
3. Migrate JSON translations to Contentful entries
4. Install Contentful SDK:
   \`\`\`bash
   npm install contentful
   \`\`\`
5. Create data fetching functions in `src/lib/contentful.ts`

### 3. Strapi

**Pros:**
- Self-hosted option
- GraphQL and REST APIs
- Full control over data

**Migration Path:**
1. Set up Strapi instance
2. Create content types matching data structures
3. Import existing content
4. Configure i18n plugin for Polish/English

## Content Schema Documentation

### Services Schema

\`\`\`typescript
interface Service {
  id: string;
  titleKey: string;        // Translation key
  descriptionKey: string;  // Translation key
  icon: string;
  featuresKeys: string[];  // Array of translation keys
}
\`\`\`

**CMS Fields:**
- ID (unique identifier)
- Title (translatable)
- Description (translatable, rich text)
- Icon (text/emoji)
- Features (list of translatable items)

### Portfolio Projects Schema

\`\`\`typescript
interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  technologies: string[];
  image: string;
  category: 'interiors' | 'graphics' | 'all';
  year: string;
}
\`\`\`

**CMS Fields:**
- ID
- Title (translatable)
- Description (translatable, rich text)
- Technologies (list of strings)
- Image (media upload)
- Category (select: interiors, graphics, all)
- Year (string)

### Pricing Tiers Schema

\`\`\`typescript
interface PricingTier {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  processKeys: string[];
  duration: string;
  investmentKey: string;
  image: string;
  highlight: boolean;
}
\`\`\`

**CMS Fields:**
- ID
- Title (translatable)
- Subtitle (translatable)
- Description (translatable, rich text)
- Process Steps (list of translatable items)
- Duration (string)
- Investment (translatable)
- Image (emoji or media)
- Highlight (boolean)

### Process Steps Schema

\`\`\`typescript
interface ProcessStep {
  id: string;
  number: string;
  titleKey: string;
  descriptionKey: string;
  duration: string;
  icon: string;
}
\`\`\`

**CMS Fields:**
- ID
- Number (string: "01", "02", etc.)
- Title (translatable)
- Description (translatable)
- Duration (string)
- Icon (emoji/text)

### Before/After Projects Schema

\`\`\`typescript
interface BeforeAfterProject {
  id: string;
  titleKey: string;
  descriptionKey: string;
  beforeImageId: string;
  afterImageId: string;
  aiFeaturesKeys: string[];
}
\`\`\`

**CMS Fields:**
- ID
- Title (translatable)
- Description (translatable)
- Before Image (media upload)
- After Image (media upload)
- AI Features (list of translatable items)

## Migration Steps

### Phase 1: CMS Setup (1-2 days)
1. Choose CMS (recommended: Netlify CMS for simplicity)
2. Install and configure CMS
3. Set up authentication
4. Create content models

### Phase 2: Content Migration (2-3 days)
1. Import existing translations to CMS
2. Upload images and media assets
3. Create entries for all services, projects, pricing, etc.
4. Test content editing workflow

### Phase 3: Frontend Integration (3-4 days)
1. Install CMS SDK
2. Create data fetching functions
3. Update components to fetch from CMS instead of local files
4. Implement caching strategy
5. Add loading states

### Phase 4: Testing & Deployment (1-2 days)
1. Test all content changes
2. Verify language switching works with CMS data
3. Performance optimization
4. Deploy to production

## Environment Variables

Add these to your `.env` file and Netlify environment variables:

\`\`\`
# For Netlify CMS
NETLIFY_SITE_ID=your-site-id

# For Contentful (if using)
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token

# For Strapi (if using)
STRAPI_API_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your-api-token
\`\`\`

## Best Practices

1. **Preview Changes**: Always preview content changes before publishing
2. **Backup**: Keep regular backups of your content
3. **Version Control**: Use Git to track configuration changes
4. **Media Optimization**: Compress images before uploading
5. **SEO**: Ensure meta titles and descriptions are translatable
6. **Performance**: Implement caching for CMS data fetching

## Translation Keys Reference

All translation keys are organized in `/src/locales/{lang}/common.json`:

- `nav.*` - Navigation items
- `meta.*` - SEO meta tags
- `footer.*` - Footer content
- `home.*` - Home page sections
- `about.*` - About page content
- `services.*` - Service descriptions
- `process.*` - Process steps
- `pricing.*` - Pricing tiers
- `beforeAfter.*` - Transformation projects
- `portfolio.*` - Portfolio projects

## Next Steps

1. Choose your CMS platform
2. Set up CMS instance
3. Configure content models
4. Migrate content
5. Update components to fetch from CMS
6. Test thoroughly
7. Deploy

For questions or assistance, refer to the respective CMS documentation:
- [Netlify CMS Docs](https://www.netlifycms.org/docs/)
- [Contentful Docs](https://www.contentful.com/developers/docs/)
- [Strapi Docs](https://docs.strapi.io/)
