import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      className="rounded-full border border-slate-200 px-3 py-2 dark:border-white/10"
      aria-label="Cambiar tema"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
