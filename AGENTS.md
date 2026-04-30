# AGENTS.md

Developer commands reference for this project.

## Development

```bash
# Student app (localhost:3000)
bun run dev:students

# Staff app
bun run dev:staff
```

## Build

```bash
bun run build:students
bun run build:staff
bun run preview
bun run generate
```

## Database

```bash
# Reset database (delete and reinitialize)
rm db/database.sqlite
# Then restart dev server to reinitialize
```

## Linting

```bash
# Run ESLint
npx eslint .
```

## Nuxt

```bash
# Prepare Nuxt (runs automatically via postinstall)
npx nuxt prepare

# Typecheck
npx nuxt typecheck
```

## Adding New Endpoints - Agent Workflow

When adding a new endpoint to this monorepo, follow this structured workflow. This ensures consistency, code reuse, and maintainability.

### Step 1: Database Schema Check

1. Review the database schema in `db/schema.ts`
2. Check existing tables to understand data models
3. Determine if you need new tables or columns
4. If changes needed:
   - Update `db/schema.ts`
   - Update `db/seed.ts` if default data is required
   - Clear database: `rm db/database.sqlite`
   - Restart dev server to reinitialize

### Step 2: Create Server Endpoint

1. Create API endpoint in `server/api/` following the naming pattern: `[resource].get|post|put|delete.ts`
2. Use the established structure:
   ```typescript
   // server/api/[resource].get.ts
   export default defineEventHandler(async (event) => {
     // Extract query/body parameters
     const data = await readBody(event) // for POST/PUT
     const query = getQuery(event) // for GET
     
     // Validate JWT token (via middleware)
     const user = await getValidatedUser(event)
     
     // Access database - use getDatabase() helper
     const db = getDatabase()
     
     // Execute query and return result
     return db.selectFrom('tableName').selectAll().execute()
   })
   ```
3. Key principles:
   - No hardcoded values - use database queries
   - No role-based authorization in endpoint - rely on JWT token validation
   - Keep logic simple and focused
   - Return normalized JSON responses
   - Use proper HTTP status codes (200, 201, 400, 401, 404, 500)

### Step 3: Determine Component Scope

Before creating UI components, ask: **"Can this component be reused across multiple apps?"**

- **YES** → Add to `layers/core/components/`
- **NO** → Add to specific app at `apps/[app-name]/components/`

### Step 4: Create Component (if needed)

Components should follow this structure:

1. **Location:**
   - Shared: `layers/core/components/[Category]/ComponentName.vue`
   - App-specific: `apps/[app-name]/components/ComponentName.vue`

2. **Implementation:**
   ```vue
   <template>
     <div class="component-class">
       <!-- Use CSS variables from theme - NO hardcoded colors -->
       <slot />
     </div>
   </template>

   <script setup lang="ts">
   // Use defineProps, no prop drilling
   interface Props {
     variant?: 'primary' | 'secondary'
     size?: 'sm' | 'md' | 'lg'
   }
   const props = withDefaults(defineProps<Props>(), {
     variant: 'primary',
     size: 'md'
   })
   </script>

   <style scoped>
   /* Use CSS variables for theming */
   .component-class {
     background-color: var(--color-base);
     color: var(--color-text);
   }
   </style>
   ```

3. **Styling Principles:**
   - Use OKLch color variables from `layers/core/assets/styles/variables.css`
   - Apply Tailwind classes for spacing, sizing
   - Use CVA (Class Variance Authority) for component variants
   - NO hardcoded color values or magic numbers
   - Keep CSS simple - avoid complex nesting

### Step 5: Create Page Routes

1. **Determine app placement** - which app needs this route?
2. **Create page file:**
   - Student app: `apps/students/pages/[route].vue`
   - Staff app: `apps/staff/pages/[route].vue`

3. **Page structure:**
   ```vue
   <template>
     <div class="page-container">
       <h1>{{ title }}</h1>
       <YourComponent @action="handleAction" />
     </div>
   </template>

   <script setup lang="ts">
   definePageMeta({
     middleware: ['auth'] // Automatically enforced by middleware
   })

   const title = 'Page Title'
   const handleAction = async () => {
     // Fetch from /server/api endpoint
     const data = await $fetch('/api/[resource]', {
       method: 'POST',
       body: { /* data */ }
     })
   }
   </script>

   <style scoped>
   .page-container {
     padding: var(--spacing-md);
   }
   </style>
   ```

### Step 6: Apply Theme Consistency

- Use CSS variables from `layers/core/assets/styles/variables.css`
- Available spacing scale: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- Color system: `--color-base`, `--color-text`, `--color-primary`, `--color-secondary`, etc.
- Font system: `--font-body`, `--font-heading`, `--font-mono`
- Breakpoints: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)

### Step 7: Authentication & Authorization

**Do NOT implement role-based routing in layout files.**

Instead:
1. All core layout checks only verify JWT presence (not role)
2. Individual endpoints validate the JWT token via middleware: `validateToken(event)`
3. Endpoints return appropriate HTTP status codes:
   - `401` for missing/invalid token
   - `403` for insufficient permissions
4. Frontend components/pages handle role-based UI visibility
5. JWT token structure includes user role: payload contains `{ id, email, role }`

### Step 8: Code Quality Checklist

Before marking endpoint as complete:

- [ ] Database schema updated (if needed) and tested
- [ ] Server endpoint created with proper error handling
- [ ] No hardcoded values (all data from database)
- [ ] No complex repetition (extract to composables)
- [ ] Components use theme variables, not hardcoded colors
- [ ] Component scope determined (core vs app-specific)
- [ ] Page routes created with proper middleware
- [ ] Code follows existing patterns in codebase
- [ ] Linting passes: `npx eslint .`
- [ ] Types are correct: `npx nuxt typecheck`
- [ ] Tested in dev environment

### Workflow Summary

```
1. Check Database Schema (db/schema.ts)
   ↓
2. Create Server Endpoint (server/api/)
   ↓
3. Determine Component Reusability
   ├─→ YES: Add to layers/core/components/
   └─→ NO: Add to apps/[app]/components/
   ↓
4. Create Component (if needed)
   ↓
5. Create Page Routes (apps/[app]/pages/)
   ↓
6. Apply Theme & Style Consistency
   ↓
7. Verify Authentication (JWT token based)
   ↓
8. Run Linting & Type Checking
   ↓
✓ Complete
```

### Common Patterns

**Fetching data in a page:**
```typescript
const { data: items } = await useFetch('/api/items')
```

**Creating a shared component:**
```
layers/core/components/Common/CardLayout.vue
// Auto-imported - no imports needed
```

**Adding middleware for auth:**
```
server/middleware/auth.ts
// Automatically runs on all requests
```

**Accessing database in composable:**
```typescript
export const useFetchCourses = () => {
  return useFetch('/api/courses')
}
```