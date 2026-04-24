/**
 * Theme Configuration
 * 
 * This composable provides access to the shadcn/ui theme system
 * which is configured in layers/core/lib/theme.css
 * 
 * The theme uses OKLch color space for better color consistency
 * and includes both light and dark mode support.
 * 
 * All apps (students, staff, instructors) automatically inherit
 * this theme through the layer extension system.
 */

export const useTheme = () => {
  /**
   * Get the current theme mode
   * Automatically respects system preference via @media (prefers-color-scheme)
   */
  const isDark = computed(() => {
    if (process.client) {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  /**
   * Toggle theme between light and dark mode
   */
  const toggleTheme = () => {
    if (process.client) {
      document.documentElement.classList.toggle('dark')
    }
  }

  /**
   * Set theme explicitly
   */
  const setTheme = (mode: 'light' | 'dark') => {
    if (process.client) {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
