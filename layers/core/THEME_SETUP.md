# Theme Configuration Guide

## Overview

The project uses **shadcn/ui** components with a centralized theme system defined in the **core layer**. All apps (students, staff, instructors) inherit and use this unified theme.

## Theme Setup

### Core Theme File
- **Location**: `layers/core/lib/theme.css`
- **Colors**: Uses OKLch color space for better color consistency
- **Modes**: Light mode (default) and dark mode support
- **CSS Variables**: All colors are defined as CSS custom properties

### Theme Colors

#### Light Mode
- **Background**: White (`oklch(1 0 0)`)
- **Foreground**: Dark Gray (`oklch(0.145 0 0)`)
- **Primary**: Dark (`oklch(0.205 0 0)`) with white text
- **Secondary**: Light (`oklch(0.97 0 0)`) with dark text
- **Destructive**: Red (`oklch(0.577 0.245 27.325)`)
- **Border**: Light Gray (`oklch(0.922 0 0)`)

#### Dark Mode
- **Background**: Dark Gray (`oklch(0.145 0 0)`)
- **Foreground**: White (`oklch(0.985 0 0)`)
- **Primary**: Light (`oklch(0.922 0 0)`) with dark text
- **Secondary**: Dark (`oklch(0.269 0 0)`) with light text
- **Destructive**: Red (`oklch(0.704 0.191 22.216)`)
- **Border**: White with 10% opacity

## Importing Theme

### Automatic (Recommended)
The theme is automatically imported in `layers/core/nuxt.config.ts`:
```typescript
css: [
  '@core/lib/theme.css',
],
```

All child apps inherit this configuration through layer extension.

### Manual Import
If needed, you can import the theme directly in a component:
```vue
<script setup>
import '@core/lib/theme.css'
</script>
```

## Using shadcn Components

### Available Components
All shadcn/ui components are pre-configured and available throughout the project:
- `UiButton`, `UiInput`, `UiLabel`
- `UiCard`, `UiCardHeader`, `UiCardContent`, `UiCardFooter`
- `UiAlert`, `UiAlertDescription`, `UiAlertTitle`
- `UiDialog`, `UiDrawer`, `UiMenu`, `UiPopover`
- And many more...

### Example Usage
```vue
<script setup>
import { UiButton, UiInput, UiLabel } from '@/components/ui'
</script>

<template>
  <div class="space-y-4">
    <UiLabel for="email">Email</UiLabel>
    <UiInput id="email" type="email" />
    <UiButton>Submit</UiButton>
  </div>
</template>
```

## Theme Utilities

### CSS Utility Function
```typescript
import { cn } from '@/lib/utils'

// Merge Tailwind classes intelligently
const classes = cn(
  'px-2 py-1',
  isActive && 'bg-primary text-white'
)
```

### Theme Composable
```typescript
import { useTheme } from '@/composables/useTheme'

export default {
  setup() {
    const { isDark, toggleTheme, setTheme } = useTheme()
    
    return {
      isDark,
      toggleTheme,
      setTheme,
    }
  }
}
```

## Configuration Files

### `layers/core/components.json`
Defines shadcn CLI settings:
- Style: `new-york`
- Font: `Noto Sans`
- Icon Library: `lucide`
- CSS Variables: Enabled
- Base Color: `neutral`

### `layers/core/nuxt.config.ts`
Enables and configures modules:
- `shadcn-nuxt`: Component library
- `@nuxtjs/tailwindcss`: Tailwind CSS support

### `layers/core/lib/utils.ts`
Exports `cn()` utility for merging Tailwind classes.

## App Configuration

Each app inherits the theme automatically:

**apps/students/nuxt.config.ts**
```typescript
export default defineNuxtConfig({
  extends: ['../../layers/core'],
  modules: ['shadcn-nuxt'],
})
```

**apps/staff/nuxt.config.ts**
```typescript
export default defineNuxtConfig({
  extends: ['../../layers/core'],
  modules: ['shadcn-nuxt'],
})
```

**apps/instructors/nuxt.config.ts**
```typescript
export default defineNuxtConfig({
  extends: ['../../layers/core'],
  modules: ['shadcn-nuxt'],
})
```

## Examples

### SignupForm Component
```vue
<script setup lang="ts">
import { UiAlert, UiAlertDescription, UiButton, UiInput, UiLabel } from '@/components/ui'

const email = ref('')
const error = ref('')

async function handleSubmit() {
  try {
    // Submit logic
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <UiAlert v-if="error" variant="destructive">
      <UiAlertDescription>{{ error }}</UiAlertDescription>
    </UiAlert>
    
    <div>
      <UiLabel for="email">Email</UiLabel>
      <UiInput v-model="email" id="email" type="email" />
    </div>
    
    <UiButton type="submit" class="w-full">Sign Up</UiButton>
  </form>
</template>
```

## Customization

To customize the theme:

1. Edit `layers/core/lib/theme.css`
2. Update CSS variables in `:root` (light mode) or `.dark` (dark mode)
3. All apps will automatically reflect the changes

## Browser Support

The theme uses modern CSS features:
- CSS Custom Properties (Variables)
- OKLch color space
- Supported in all modern browsers

## Migration Guide

To migrate existing components to use shadcn:

1. Replace `<input>` with `<UiInput />`
2. Replace `<button>` with `<UiButton />`
3. Replace `<label>` with `<UiLabel />`
4. Remove inline Tailwind classes and use shadcn component props/variants
5. Use `cn()` utility to merge conditional classes

See `layers/core/components/SignupForm.vue` for a complete example.
