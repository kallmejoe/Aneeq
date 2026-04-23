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
│   ├── students/      # Student portal
│   ├── staff/        # Staff dashboard
│   └── instructors/   # Instructor app
├── layers/core/      # Shared UI components
├── server/
│   ├── api/          # API routes (auth, etc.)
│   ├── middleware/  # Auth middleware
│   ├── plugins/      # Database plugin
│   └── utils/         # DB utilities
└── db/               # SQLite database
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

```bash
# Run student app
bun run dev:students

# Run staff app
bun run dev:staff
```

Production builds are available:
```bash
bun run build:students
bun run build:staff
```

## Database

SQLite database located at `db/database.sqlite`. Schema is managed via server-side initialization.
