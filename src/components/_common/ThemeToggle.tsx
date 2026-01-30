// https://ui.shadcn.com/docs/dark-mode/vite
import { Button } from '@/components/ui/button'
import { useTheme } from '@/providers/ThemeProvider'
import { SunMoon } from 'lucide-react'

type ThemeToggleProps = {
  showLabel?: boolean
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <Button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="p-0 text-xs h-fit gap-1"
      variant="ghost"
    >
      <div className="relative size-4">
        <SunMoon className="dark:-rotate-90 size-4 rotate-0 scale-100 transition-all dark:scale-0" />
        <SunMoon className="absolute top-0 left-0 size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      {showLabel && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
