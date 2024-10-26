import { useState, useEffect } from 'react' 

export function useClientOnly<T>(getter: () => T): T | undefined {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    setValue(getter())
  }, [getter])

  return value
}
