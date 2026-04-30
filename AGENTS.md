# AGENTS.md

Developer commands reference for this project.

## Development

```bash
# Student app (localhost:3000)
bun run dev:students

# Staff app
bun run dev:staff

# Instructor app
bun run dev:instructors
```

## Build

```bash
bun run build:students
bun run build:staff
bun run build:instructors
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

# Typecheck single app
npx nuxt typecheck apps/students
npx nuxt typecheck apps/staff
npx nuxt typecheck apps/instructors
```

## Adding New Endpoints - Agent Workflow

When adding a new endpoint to this monorepo, follow this structured workflow. This ensures consistency, code reuse, and maintainability.

### Step 1: Database Schema Check

1. Review the database schema in `server/utils/init.ts`
2. Check existing tables to understand data models
3. Determine if you need new tables or columns
4. If changes needed:
   - Update `server/utils/init.ts`
   - Clear database: `rm db/database.sqlite`
   - Restart dev server to reinitialize

### Step 2: Create Server Endpoint

1. Create API endpoint in `server/api/` following the naming pattern: `[resource].get|post|put|delete.ts`
2. Use the established structure:
   ```typescript
   // server/api/[resource].post.ts
   import { jwtVerify } from "jose";
   import { db } from "../../utils/db";

   const JWT_SECRET = new TextEncoder().encode(
     process.env.JWT_SECRET || "your-secret-key-change-in-production"
   );

   export default defineEventHandler(async (event) => {
     const authHeader = getHeader(event, "authorization");

     if (!authHeader || !authHeader.startsWith("Bearer ")) {
       setResponseStatus(event, 401);
       return { success: false, message: "Unauthorized" };
     }

     const token = authHeader.substring(7);

     let userId: number;
     try {
       const verified = await jwtVerify(token, JWT_SECRET);
       const payload = verified.payload as { userId: number; email: string; role: string };
       userId = payload.userId;
     } catch {
       setResponseStatus(event, 401);
       return { success: false, message: "Invalid or expired token" };
     }

     const body = await readBody(event);
     // ... handle the request

     try {
       const result = db.prepare("INSERT INTO table (...) VALUES (...)").run(...);
       return { success: true, id: result.lastInsertRowid };
     } catch (err) {
       console.error("[resource] Error:", err);
       return { success: false, message: "Failed to create resource" };
     }
   });
   ```
3. Key principles:
   - Use `jwtVerify` from "jose" for JWT validation
   - Use `db` from `server/utils/db` for database operations
   - Use `readBody(event)` for POST/PUT body data
   - Use `getQuery(event)` for GET query parameters
   - Use `setResponseStatus(event, code)` for HTTP status codes
   - Return normalized JSON `{ success: boolean, ... }`
   - No role-based authorization in endpoint - rely on JWT token validation
   - Keep logic simple and focused

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
   interface Props {
     variant?: 'primary' | 'secondary'
     size?: 'sm' | 'md' | 'lg'
   }
   withDefaults(defineProps<Props>(), {
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
   - Use CSS variables from `layers/core/assets/styles/variables.css`
   - Use Tailwind classes for additional styling
   - NO hardcoded color values or magic numbers
   - Keep CSS simple - avoid complex nesting

### Step 5: Create Page Routes

1. **Determine app placement** - which app needs this route?
2. **Create page file:**
   - Student app: `apps/students/pages/[route].vue`
   - Staff app: `apps/staff/pages/[route].vue`
   - Instructor app: `apps/instructors/pages/[route].vue`

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
     middleware: ['auth']
   })

   const title = 'Page Title'
   const handleAction = async () => {
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

4. **Required app files** (if missing):
   - `apps/[app]/app.vue` - Entry point
   - `apps/[app]/layouts/default.vue` - Layout with navbar
   - `apps/[app]/composables/useNavItems.ts` - Nav items
   - `apps/[app]/middleware/auth.ts` - Auth middleware

### Step 6: Apply Theme Consistency

- Use CSS variables from `layers/core/assets/styles/variables.css`
- Available spacing scale: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- Color system: `--color-base`, `--color-text`, `--color-primary`, `--color-secondary`, etc.
- Font system: `--font-body`, `--font-heading`, `--font-mono`
- Breakpoints: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg`, `xl:`)

### Step 7: Authentication & Authorization

**Do NOT implement role-based routing in layout files.**

Instead:
1. All core layout checks only verify JWT presence (not role)
2. Server endpoints validate the JWT token and check role if needed
3. Endpoints return appropriate HTTP status codes:
   - `401` for missing/invalid token
   - `403` for insufficient permissions
4. Frontend components/pages handle role-based UI visibility
5. JWT token structure includes user role: payload contains `{ userId, email, role }`

### Step 8: Code Quality Checklist

Before marking endpoint as complete:

- [ ] Database schema updated (if needed) and tested
- [ ] Server endpoint created with proper error handling
- [ ] No hardcoded values (all data from database)
- [ ] No complex repetition (extract to composables)
- [ ] Components use theme variables, not hardcoded colors
- [ ] Component scope determined (core vs app-specific)
- [ ] Page routes created with proper middleware
- [ ] App has required files (app.vue, layouts, composables)
- [ ] Code follows existing patterns in codebase
- [ ] Linting passes: `npx eslint .`
- [ ] Tested in dev environment

### Workflow Summary

```
1. Check Database Schema (server/utils/init.ts)
   ↓
2. Create Server Endpoint (server/api/)
   ↓
3. Determine Component Reusability
   ├─��� YES: Add to layers/core/components/
   └─→ NO: Add to apps/[app]/components/
   ↓
4. Create Component (if needed)
   ↓
5. Create Page Routes (apps/[app]/pages/)
   ↓
6. Create App Files (if needed)
   ├─→ app.vue
   ├─→ layouts/default.vue
   ├─→ composables/useNavItems.ts
   └─→ middleware/auth.ts
   ↓
7. Apply Theme & Style Consistency
   ↓
8. Verify Authentication (JWT token based)
   ↓
9. Run Linting & Test
   ↓
✓ Complete
```

### Available Apps

| App | Route | Role |
|-----|-------|------|
| students | / | student |
| staff | / | admin |
| instructors | / | professor |

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

**Using auth in server endpoint:**
```typescript
import { jwtVerify } from "jose";
import { db } from "../../utils/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return { success: false, message: "Unauthorized" };
  }

  const token = authHeader.substring(7);
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: number; role: string };
    // use payload.userId, payload.role, payload.email
  } catch {
    setResponseStatus(event, 401);
    return { success: false, message: "Invalid token" };
  }
});
```

**Database access:**
```typescript
import { db } from "../../utils/db";

// Insert
const result = db.prepare("INSERT INTO table (col) VALUES (?)").run(value);
const newId = result.lastInsertRowid;

// Select
const row = db.prepare("SELECT * FROM table WHERE id = ?").get(id);
const rows = db.prepare("SELECT * FROM table").all();
```