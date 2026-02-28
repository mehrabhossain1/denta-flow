# OpenUser AI Coding Agent Instructions

# Coding Instructions
- Variable that contain Proptypes for a component should be named `PropTypes`
- Make code in small reusable chunks. Use small reusable functions and components
- Variable names should be generic. For example if we are in Product.tsx file then its understood that all context is around Product, hence the variable names should be generic for example use id instead of productId, since its assumed that id is for product
- Do not use String literals in logic, instead make them into CONSTANT Variables and refer the variable for easy configuration and reusablity. Variables which are application level config should be in its own constant file, local variables such as Logo size should remain with the file where the logic belongs.
- shadcn components in @/components/ui/ folder should be ignored from this optimization
- Use principals of Clean Code by Robert C. Martin to code

## Project Overview
OpenUser is a profile showcase platform built with **TanStack Start** (full-stack React framework), using **Postgres with Drizzle ORM** for all data storage and authentication.

## Critical Architecture Patterns

### Database Architecture
- **Postgres + Drizzle**: All data including authentication (better-auth tables: `user`, `session`, `account`, `verification`)
- Application tables: `userProfile`, `follow`, `product`, `project`, `tool`, `toolCategory`, `profileTool`
- User IDs from Postgres auth are referenced as foreign keys in application tables
- Schema defined in `drizzle/schema.ts` and `src/db/schema/`

### File-Based Routing (TanStack Router)
- Routes in `src/routes/` with auto-generated `routeTree.gen.ts`
- Use `createFileRoute()` for routes: `export const Route = createFileRoute('/path')({ component: ... })`
- Profile routes use special syntax: `@{$handle}` (e.g., `src/routes/@{$handle}/about.tsx`)
- Protected routes with underscore: `@{$handle}_/` (requires authentication)
- Route parameters accessed via `Route.useParams()` or `getRouteApi()`

### Data Fetching Patterns

#### Server Functions (TanStack Start)
```typescript
// src/lib/server/profile.ts
export const getProfileByHandle = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    return db.query.userProfile.findFirst({
      where: eq(userProfile.handle, data.handle.toLowerCase())
    })
  })
```
- All data operations go through server functions in `src/lib/server/`
- Server functions use Drizzle queries to access Postgres database
- Use `authMiddleware` from `src/lib/auth-middleware.ts` to inject user context
- Access database via `db` instance from `src/db/index.ts`

#### Drizzle ORM Integration
```typescript
// Frontend: Use server functions or TanStack Query for data fetching
import { useSuspenseQuery } from '@tanstack/react-query'
import { getProfileByHandle } from '@/lib/server/profile'

const { data: profile } = useSuspenseQuery({
  queryKey: ['profile', handle],
  queryFn: () => getProfileByHandle({ data: { handle } })
})
```
- Custom hooks in `src/hooks/useProfiles.ts` wrap common queries
- Data is fetched server-side and returned to client
- Use TanStack Query for client-side caching and state management

### Authentication Flow
- **better-auth** with email OTP (no password login)
- Session middleware: `authMiddleware` injects `context.user` into routes
- Auth pages: `src/routes/auth/` (sign-in, sign-up, verify)
- Session config: 30-day expiry with 24-hour sliding window (see `src/lib/auth.ts`)
- Access user in routes: `Route.useMatch()` returns `context.user`

### Profile System
- **Created vs Claimed**: Users can create profiles for others (unclaimed) or claim their own
- `createdBy`: User ID who created the profile (foreign key to `user.id`)
- `claimedBy`: User ID who claimed ownership (can be null)
- Only one claimed profile per user allowed
- Handle uniqueness enforced at database level (Drizzle unique constraint)

## Development Workflow

### Starting Development
```bash
pnpm dev              # Runs Vite dev server with TanStack Start
```

### Code Quality
- **Biome** for linting/formatting (replaces ESLint + Prettier)
- Husky pre-commit: Runs `biome check --write` on staged files
- Commands: `pnpm check:fix` (lint + format), `pnpm format:fix`, `pnpm lint:fix`

### Database Operations
```bash
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push schema to Postgres
pnpm db:studio        # Open Drizzle Studio to view/manage data
```

### Deployment
- **Netlify** for hosting (SSR via TanStack Start)
- Build: `pnpm build` (includes Sentry instrumentation copy)

## Component Conventions

### Directory Structure
- `src/components/_common/`: Shared components (Header, Footer, ThemeProvider)
- `src/components/profile/`: Profile-specific components
- `src/components/ui/`: shadcn/ui components (do not manually edit)

### Common Patterns
- **ProfileAvatar**: Shows user avatar with fallback initials
- **ProfileBadge**: Compact profile display with avatar + name
- **ProfileCard**: Full profile card for lists/grids
- Use `Link` from `@tanstack/react-router`, not React Router

### Form Handling
- **react-hook-form** with **Zod** validation
- Example: `src/components/profile/ProfileForm.tsx`
- Form schema validations in `src/lib/validations/`

### Rich Text (Tiptap)
- Bio field uses Tiptap editor (see `src/components/profile/AboutSection.tsx`)
- Stored as JSONB in Postgres
- Utils: `src/lib/tiptap-utils.ts` (HTML conversion, JSON validation)

## Key Files to Reference

### Configuration
- `src/appConfig.ts`: App name, URL, description
- `drizzle/schema.ts`: Legacy Drizzle setup (main schema in `src/db/schema/`)
- `src/db/schema/`: Complete database schema with Drizzle

### Essential Utilities
- `src/lib/utils.ts`: Contains `cn()` (classname merge), date utils
- `src/lib/socialLinks.ts`: Social media icon/URL helpers
- `src/hooks/useFollow.ts`: Complete follow/unfollow logic (reference for similar features)

### Route Templates
- Public profile: `src/routes/@{$handle}/route.tsx` (fetches from Postgres via server function)
- Protected edit: `src/routes/@{$handle}_/about.edit.tsx` (auth-gated mutations)
- Nested layouts: `__root.tsx` → page-specific layouts

## Common Pitfalls

1. **Use Drizzle for all data**: All tables (auth and app data) are in Postgres with Drizzle ORM
2. **Handle normalization**: Always `.toLowerCase()` handles in queries/mutations
3. **Route params**: Use `Route.useParams()`, not `useParams()` from react-router
4. **Drizzle schema**: Regenerate types after schema changes with `pnpm db:generate`
5. **Foreign keys**: User IDs are numeric (Postgres `id`), reference properly in all tables
6. **Theme**: Uses `next-themes` with custom ThemeProvider (not Next.js app)

## Adding New Features

### New Database Table
1. Add schema to `src/db/schema/`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:push` to apply to Postgres
4. Create server functions in `src/lib/server/newFeature.ts` for queries/mutations
5. Create custom hook in `src/hooks/useNewFeature.ts` wrapping server functions
6. Use in components via the custom hook

### New Profile Section
1. Add route: `src/routes/@{$handle}/section.tsx` (public, fetches from Postgres via server function)
2. Add edit route: `src/routes/@{$handle}_/section.edit.tsx` (protected, mutates Postgres)
3. Update profile menu: `src/data/profileMenuData.tsx`
4. Add data model to `src/db/schema/` if needed, then generate migration

### Follow System Example
See `FOLLOW_FEATURE.md` for complete implementation reference showing:
- Postgres table with Drizzle schema and composite indexes
- Server functions with mutation/query logic and validation
- Custom React hook wrapping server functions
- Component integration with loading states

### Products Database Pattern
See `src/db/schema/` and `src/hooks/useProducts.ts` for reference implementation:
- Central `product` table with usage tracking
- Foreign key relationships to profiles
- Server functions in `src/lib/server/` for queries and mutations
- Search functionality with debouncing
- `ProductSelector` component for reusable product selection UI

## Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- CSS variables for theming (see `src/styles/app.css`)
- shadcn/ui components styled with CVA (class-variance-authority)
- Dark mode: Toggle via `useTheme()` from ThemeProvider

## External Services

- **Supabase**: Hosts Postgres database for all data

## Testing Strategy

No test framework configured yet. When adding tests:
- Use Vitest (compatible with Vite)
- Test server functions and Drizzle queries with integration tests
- Component tests with React Testing Library

## Questions to Ask Before Changes

1. Is this data-related? → Use Postgres/Drizzle via server functions
2. Does it need a database table? → Add to `src/db/schema/` and generate migration
3. Does it modify data? → Create server function mutation in `src/lib/server/`
4. Is it a new route? → Follow file-based routing conventions
5. Does it need authentication? → Use `authMiddleware` and underscore routes
