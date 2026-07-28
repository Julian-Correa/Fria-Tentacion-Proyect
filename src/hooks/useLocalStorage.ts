import { useEffect, useState } from 'react'

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return initialValue
    }

    try {
      return JSON.parse(storedValue) as T
    } catch (error) {
      console.error(`No se pudo leer LocalStorage para ${key}`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`No se pudo guardar LocalStorage para ${key}`, error)
    }
  }, [key, value])

  return [value, setValue] as const
}
