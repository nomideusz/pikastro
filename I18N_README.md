# Internationalization (i18n) Implementation Guide

## Overview

The Pikastro website now supports bilingual content in Polish (pl) and English (en). This document explains the implementation and how to use it.

## Features

- ✅ Full Polish and English translations
- ✅ Language toggle in navigation
- ✅ LocalStorage persistence of language preference
- ✅ Browser language detection
- ✅ Dynamic content switching
- ✅ CMS-ready data structure
- ✅ Separated content from presentation

## File Structure

\`\`\`
src/
├── lib/
│   ├── i18n/
│   │   └── index.ts              # i18n configuration
│   ├── components/
│   │   └── LanguageToggle.svelte # Language switcher component
│   └── data/                      # CMS-ready data files
│       ├── services.ts
│       ├── projects.ts
│       ├── pricing.ts
│       ├── process.ts
│       └── beforeAfter.ts
├── locales/
│   ├── en/
│   │   └── common.json            # English translations
│   └── pl/
│       └── common.json            # Polish translations
└── routes/
    └── +layout.svelte              # Initialized with i18n
\`\`\`

## Usage

### In Svelte Components

Import the translation function:

\`\`\`svelte
<script>
  import { t } from '$lib/i18n';
</script>

<h1>{$t('nav.about')}</h1>
<p>{$t('home.hero.description')}</p>
\`\`\`

### Accessing Current Locale

\`\`\`svelte
<script>
  import { locale } from '$lib/i18n';
</script>

<p>Current language: {$locale}</p>
\`\`\`

### Switching Languages

Use the LanguageToggle component (already in navigation):

\`\`\`svelte
<script>
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';
</script>

<LanguageToggle />
\`\`\`

Or programmatically:

\`\`\`svelte
<script>
  import { setLocale } from '$lib/i18n';

  function switchToEnglish() {
    setLocale('en');
  }
</script>
\`\`\`

## Adding New Translations

### 1. Add to Polish translation file (\`src/locales/pl/common.json\`)

\`\`\`json
{
  "yourSection": {
    "title": "Twój Tytuł",
    "description": "Twój opis"
  }
}
\`\`\`

### 2. Add to English translation file (\`src/locales/en/common.json\`)

\`\`\`json
{
  "yourSection": {
    "title": "Your Title",
    "description": "Your description"
  }
}
\`\`\`

### 3. Use in your component

\`\`\`svelte
<h1>{$t('yourSection.title')}</h1>
<p>{$t('yourSection.description')}</p>
\`\`\`

## Translation Keys Structure

### Navigation
- `nav.about` - About link
- `nav.offer` - Services link
- `nav.pricing` - Pricing link
- `nav.portfolio` - Portfolio link
- `nav.contact` - Contact link

### Meta Tags
- `meta.home.title` - Homepage title
- `meta.home.description` - Homepage description
- `meta.about.title` - About page title
- `meta.about.description` - About page description

### Home Page
- `home.hero.*` - Hero section
- `home.video.*` - Video section
- `home.beforeAfter.*` - Before/after section
- `home.ctaBanner.*` - CTA banner
- `home.aboutHome.*` - About section on home
- `home.services.*` - Services section
- `home.process.*` - Process section
- `home.form.*` - Contact form messages

### About Page
- `about.hero.*` - Hero section
- `about.experience.*` - Experience section
- `about.skills.*` - Skills section
- `about.philosophy.*` - Philosophy section
- `about.cta.*` - CTA section

### Services
- `services.interiorDesign.*` - Interior design service
- `services.graphicDesign.*` - Graphic design service
- `services.aiTechnology.*` - AI technology service

### Process Steps
- `process.consultation.*` - Consultation step
- `process.prototyping.*` - Prototyping step
- `process.refinement.*` - Refinement step
- `process.documentation.*` - Documentation step

### Pricing Tiers
- `pricing.singleRoom.*` - Single room package
- `pricing.fullApartment.*` - Full apartment package
- `pricing.businessSpaces.*` - Business spaces package

### Before/After Projects
- `beforeAfter.project1.*` - Living room project
- `beforeAfter.project2.*` - Bedroom project
- `beforeAfter.project3.*` - Home office project

### Portfolio
- `portfolio.scandinavianApartment.*` - Scandinavian apartment
- `portfolio.studioIdentity.*` - Studio identity
- `portfolio.coworkingSpace.*` - Coworking space
- `portfolio.modernHouse.*` - Modern house
- `portfolio.cafeConcept.*` - Cafe concept
- `portfolio.industrialLoft.*` - Industrial loft

### Footer
- `footer.description` - Footer description
- `footer.offer` - Offer section title
- `footer.clients` - Clients section title
- `footer.contact` - Contact section title
- `footer.services.*` - Footer services list
- `footer.clientTypes.*` - Footer client types list
- `footer.location` - Location
- `footer.copyright` - Copyright text

## Dynamic Data with i18n

For dynamic content (services, projects, etc.), we use translation keys in data files:

### Example: Services Data

\`\`\`typescript
// src/lib/data/services.ts
export const services = [
  {
    id: 'interior-design',
    titleKey: 'services.interiorDesign.title',
    descriptionKey: 'services.interiorDesign.description',
    // ...
  }
];
\`\`\`

### Using in Component

\`\`\`svelte
<script>
  import { t } from '$lib/i18n';
  import { services } from '$lib/data/services';
</script>

{#each services as service}
  <h3>{$t(service.titleKey)}</h3>
  <p>{$t(service.descriptionKey)}</p>
{/each}
\`\`\`

## Browser Language Detection

The i18n system automatically detects the browser's language on first visit:

\`\`\`typescript
init({
  fallbackLocale: 'pl',
  initialLocale: getLocaleFromNavigator() || 'pl',
});
\`\`\`

## LocalStorage Persistence

Language preferences are saved to localStorage and persist across sessions:

\`\`\`typescript
// Automatically handled in src/lib/i18n/index.ts
locale.subscribe((value) => {
  if (value) {
    localStorage.setItem('locale', value);
  }
});
\`\`\`

## Best Practices

1. **Consistent Naming**: Use descriptive, hierarchical keys (e.g., `home.hero.title`)
2. **Avoid Hardcoded Text**: Always use translation keys, never hardcode text
3. **Keep Translations in Sync**: When adding a key to one language, add it to all languages
4. **Use Semantic Keys**: Key names should describe content, not location (e.g., `services.title` not `section3.heading`)
5. **Pluralization**: For plural forms, use separate keys (e.g., `item` and `items`)

## Testing Language Switching

1. Open the website
2. Click the language toggle (EN/PL) in navigation
3. Verify all content switches language
4. Refresh the page - language preference should persist
5. Check browser DevTools > Application > Local Storage for `locale` key

## Adding New Languages

To add a third language (e.g., German):

1. Create `src/locales/de/common.json`
2. Copy structure from `pl/common.json`
3. Translate all values
4. Update `src/lib/i18n/index.ts`:

\`\`\`typescript
import de from '../../locales/de/common.json';

dictionary.set({
  en,
  pl,
  de
});
\`\`\`

5. Update LanguageToggle component to include German option

## Troubleshooting

### Translations not appearing

1. Check browser console for errors
2. Verify translation keys exist in JSON files
3. Ensure i18n is imported: `import { t } from '$lib/i18n';`
4. Check if using `$t()` not `t()` in template

### Language not persisting

1. Check browser localStorage is enabled
2. Verify no console errors
3. Clear localStorage and try again

### Wrong language on load

1. Check localStorage value for 'locale'
2. Verify browser language settings
3. Clear cache and reload

## Migration from Hardcoded Text

To migrate a component from hardcoded text to i18n:

1. **Before:**
\`\`\`svelte
<h1>O mnie</h1>
\`\`\`

2. **After:**
\`\`\`svelte
<script>
  import { t } from '$lib/i18n';
</script>

<h1>{$t('nav.about')}</h1>
\`\`\`

## Performance Considerations

- Translation files are loaded once and cached
- Language switching is instant (no page reload)
- Minimal bundle size increase (~15KB for both languages)
- No impact on page load speed

## Future Enhancements

- [ ] Add URL-based language routing (/en/, /pl/)
- [ ] Implement language-specific meta tags for SEO
- [ ] Add more languages (German, Spanish, etc.)
- [ ] Integrate with CMS for editor-friendly translations
- [ ] Add translation management UI

## Resources

- [svelte-i18n Documentation](https://github.com/kaisermann/svelte-i18n)
- [SvelteKit i18n Guide](https://kit.svelte.dev/docs/i18n)
- [Web Localization Best Practices](https://www.w3.org/International/questions/qa-i18n)
