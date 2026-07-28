import { useEffect } from 'react'

import { appConfig } from '@/config/app'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<ThemeMode>(appConfig.storageKeys.theme, 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
