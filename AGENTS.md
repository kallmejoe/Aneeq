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