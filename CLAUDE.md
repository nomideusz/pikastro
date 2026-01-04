# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pikastro** is a single-page portfolio website for interior design and graphic design services built with SvelteKit 5, showcasing an eclectic maximalism design aesthetic with AI-powered prototyping capabilities. The site is in Polish and targets young professionals in Krakow.

## Development Commands

### Essential Commands
```bash
# Start development server with HMR
npm run dev

# Type checking (use this before commits)
npm run check

# Type checking in watch mode
npm run check:watch

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Setup
1. Copy `.env.example` to `.env` (if it exists)
2. Add your Resend API key: `RESEND_API_KEY=re_your_key_here`
3. Restart dev server after adding environment variables

## Architecture Overview

### Technology Stack
- **SvelteKit 2.x** with **Svelte 5** (using new runes syntax: `$state`, `$effect`, `$props`)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS 3.4** + custom CSS in `src/app.css`
- **Resend** for email delivery via serverless functions
- **Netlify** deployment with adapter-netlify

### Routing Structure
- `/` - Home page (main portfolio showcase, 1,439 lines)
- `/o-mnie` - About page
- `/api/contact` - POST endpoint for contact form (serverless function)
- Hash-based navigation within home page: `#oferta`, `#cennik`, `#portfolio`, `#kontakt`

### Key Architectural Patterns

#### 1. Dynamic Color System
The codebase features a unique **dynamic color extraction system** (`src/lib/utils/colorExtractor.ts`) that:
- Extracts dominant colors from portfolio images using canvas API
- Applies color quantization algorithm
- Calculates luminance for contrast checking
- Assigns colors to semantic roles (primary, accent, secondary, success, tertiary)
- Injects colors as CSS custom properties at runtime
- Powers the eclectic maximalism design aesthetic

**Important**: Colors are applied via inline styles and CSS variables, not hardcoded in Tailwind config.

#### 2. State Management with Svelte 5 Runes
No external state management library. Uses Svelte 5's new runes pattern:
- `$state` for reactive variables (formData, colorPalette, isMenuOpen, activeFilter, etc.)
- `$effect` for side effects (color extraction, scroll animations, video control)
- `$props` for component props
- `$app/stores` for SvelteKit-specific state (page context)

#### 3. Form Validation Architecture
Two-layer validation system:
- **Client-side**: `src/lib/utils/validation.ts` with comprehensive rules:
  - Email validation (format, length, typo detection, disposable domain blocking)
  - Name validation (character sets, length, word count)
  - Message validation (minimum length, repetition detection)
  - "Touched fields" pattern for UX
- **Server-side**: Validation in `src/routes/api/contact/+server.ts` before sending emails

#### 4. Animation System
- Intersection Observer API for scroll-triggered animations
- Elements with `.observe` class animate when entering viewport
- Immediate animation for elements already visible on load
- Custom CSS keyframes: `fadeInUp`, `pulse`, `float` in `src/app.css`
- Video playback management with auto-retry logic

#### 5. Navigation Pattern
Navigation adapts based on current route:
- On home page (`/`): Uses hash links (`#oferta`, etc.)
- On other pages: Uses full paths with hash (`/#oferta`, etc.)
- Mobile: Hamburger menu with slide-in navigation

### File Organization

**Key Files to Know:**
- `src/routes/+page.svelte` (1,439 lines) - Main home page with all portfolio content
- `src/routes/+layout.svelte` - Root layout with navigation component
- `src/lib/utils/colorExtractor.ts` - Dynamic color palette generation
- `src/lib/utils/validation.ts` - Form validation logic
- `src/app.css` - Global styles, custom component classes, animations, Google Fonts
- `src/routes/api/contact/+server.ts` - Contact form API endpoint

**Asset Organization:**
- `src/lib/assets/images/` - Portfolio images (1.8MB total: 01-11.jpeg, magda.jpg, colors.jpeg)
- `src/lib/assets/videos/` - Hero videos (15MB total: vid01.mp4, vid02.mov/mp4)
- `static/` - Public assets (favicon, logo, robots.txt)

### Styling Approach

**Hybrid CSS Strategy:**
1. **Tailwind utility classes** - Layout, spacing, responsive design
2. **Custom component classes** in `app.css` - Reusable patterns (`.btn`, `.card`, `.section`, `.hover-lift`, `.neon-glow`)
3. **Inline styles** - Dynamic colors from extracted palette (e.g., `style="color: {colorPalette.primary}"`)
4. **CSS custom properties** - Runtime color variables

**Typography:**
- Primary: Montserrat (sans-serif)
- Headings: Playfair Display (serif)
- Imported via Google Fonts in `app.css`

**Design Philosophy:**
- Eclectic maximalism aesthetic
- Vibrant, bold colors vs. "beige-gray" interiors
- Floating blobs, gradients, neon effects
- Heavy use of visual hierarchy

## Email System (Resend)

**Setup Requirements:**
1. Environment variable: `RESEND_API_KEY`
2. Sends from: `noreply@auth.zaur.app`
3. Recipient: `magda@zaur.app`
4. Reply-To header: sender's email address

**Free Tier Limits:**
- 100 emails/day
- 3,000 emails/month

**Troubleshooting:** See `CONTACT_FORM_SETUP.md` for detailed setup and troubleshooting steps.

## Code Conventions

### File Naming
- SvelteKit conventions: `+page.svelte`, `+layout.svelte`, `+server.ts`
- Utilities: camelCase (e.g., `colorExtractor.ts`, `validation.ts`)
- Routes: lowercase with hyphens (e.g., `o-mnie/`)

### TypeScript
- Strict mode enabled
- Explicit return types on utility functions
- Interfaces for complex types
- Use TypeScript, not JSDoc

### Language
- UI strings: Polish
- Code comments: Polish
- Variable names: English
- Git commits: English

### Accessibility
- Always add ARIA roles to interactive `<div>` elements with mouse handlers
- Use semantic HTML
- Include keyboard navigation support
- Add focus states to interactive elements

## Common Development Scenarios

### Adding New Portfolio Projects
1. Add image to `src/lib/assets/images/`
2. Update `projects` array in `src/routes/+page.svelte`
3. Include properties: `title`, `description`, `category` ('wnętrza' or 'grafika'), `image`, `year`
4. Portfolio filtering system will automatically include it

### Modifying Color Palette
- **For dynamic colors**: Edit `src/lib/utils/colorExtractor.ts` algorithm
- **For static colors**: Update `src/app.css` custom properties or Tailwind config
- Colors are extracted from `src/lib/assets/images/colors.jpeg` by default

### Adding New Sections to Home Page
1. Add section to `src/routes/+page.svelte`
2. Use consistent structure: `<section id="section-name" class="section">`
3. Update navigation in `src/routes/+layout.svelte` with hash link
4. Add `.observe` class to elements that should animate on scroll

### Updating Contact Form
1. **Fields**: Modify `formData` state and form markup in `src/routes/+page.svelte`
2. **Validation**: Update rules in `src/lib/utils/validation.ts`
3. **Email template**: Edit HTML in `src/routes/api/contact/+server.ts`
4. Test both client and server-side validation

## Deployment (Netlify)

1. **Adapter**: Uses `@sveltejs/adapter-netlify`
2. **Build command**: `npm run build`
3. **Publish directory**: `.svelte-kit/netlify`
4. **Environment variables**: Add `RESEND_API_KEY` in Netlify dashboard
5. **Functions**: API routes automatically deploy as Netlify Functions

## Performance Considerations

- **Large assets**: Videos (15MB) and images (1.8MB) - consider optimization
- **Video handling**: Auto-retry logic for playback failures
- **Lazy loading**: Scroll-triggered animations reduce initial load
- **Code splitting**: Automatic per-route via SvelteKit

## Important Notes

- **Large file alert**: `src/routes/+page.svelte` is 1,439 lines - the entire home page in one file
- **No component library**: Uses custom components inline (no separate component files)
- **Hash navigation**: Same-page navigation uses hash anchors, not route changes
- **Svelte 5 syntax**: Uses new runes (`$state`, `$effect`) - not Svelte 4 stores
- **Polish content**: All user-facing text is in Polish language
