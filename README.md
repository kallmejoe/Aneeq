# Luemy

Multi-app educational platform built with Nuxt 4, featuring separate applications for students, staff, and instructors.

## Apps

- **students** - Student portal application
- **staff** - Staff/administrator dashboard
- **instructors** - Instructor management interface

## Tech Stack

- **Framework**: Nuxt 4
- **UI**: @nuxt/ui + shadcn-nuxt
- **Database**: SQLite (better-sqlite3)
- **Auth**: Custom JWT-based authentication
- **Validation**: Zod + vee-validate

## Project Structure

```
├── apps/
│   ├── students/      # Student portal (extends core layer)
│   ├── staff/         # Staff dashboard (extends core layer)
│   └── instructors/   # Instructor app (extends core layer)
├── layers/
│   └── core/
│       ├── components/ # Shared UI components
│       ├── composables/ # Shared composables
│       └── lib/        # Shared utilities & themes
├── server/
│   ├── api/           # API routes (auth, etc.)
│   ├── middleware/    # Request middleware
│   └── utils/         # Server utilities
└── db/                # SQLite database
```

## Setup

```bash
# Install dependencies
bun install  # or npm install

# Prepare Nuxt
bun run postinstall
# or: npx nuxt prepare
```

## Development

Each app can run independently:

```bash
# Run student app (localhost:3000)
bun run dev:students

# Run staff app (localhost:3000)
bun run dev:staff
```

## Building for Production

```bash
# Build student app
bun run build:students

# Build staff app
bun run build:staff

# Preview production build
bun run preview
```

## Layer Architecture

All apps extend the `layers/core` layer which provides:

- **Shared UI Components**: 50+ shadcn-based components in `layers/core/components/ui/`
- **Shared Composables**: Reusable Vue composables in `layers/core/composables/`
- **Theme System**: CSS variables and styling in `layers/core/lib/theme.css`

Each app automatically imports components and composables from the core layer without explicit imports.

## Database

SQLite database located at `db/database.sqlite`.

To reset the database:

```bash
rm db/database.sqlite
# Restart dev server to reinitialize
```

# Jira + GitHub Automation Rules

## Rules Summary

| Trigger                       | Result                |
| ----------------------------- | --------------------- |
| PR opened referencing a story | Story → **In Review** |
| PR merged into `main`         | Story → **Done**      |

---

## Rule Setup

### Rule 1 — PR Opened → In Review

**Trigger:** `Pull request created`  
**Condition:** `If stories present`  
**Action:** `Transition issue → In Review`

### Rule 2 — PR Merged → Done

**Trigger:** `Pull request merged`  
**Condition 1:** `If stories present`  
**Condition 2:** `{{smart values}}` → `{{pullRequest.destinationBranch}} equals main`  
**Action:** `Transition issue → Done`

---

## Developer Workflow

Always include the issue key (e.g. `FMAP-141`) in your branch and PR:

```
Branch:   feature/FMAP-141-short-description
Commit:   FMAP-141: what you did
PR title: [FMAP-141] Short description
PR base:  main
```
