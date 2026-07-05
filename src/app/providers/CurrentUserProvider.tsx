import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../../features/user/types'
import { fetchMe } from '../../features/user/api/userApi'
import { useAuth } from './AuthProvider'

type CurrentUserContextValue = {
  currentUser: User | null
  isLoading: boolean
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null)
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)

    fetchMe()
      .then((user) => {
        if (!isCancelled) setCurrentUser(user)
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated])

  return <CurrentUserContext.Provider value={{ currentUser, isLoading }}>{children}</CurrentUserContext.Provider>
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) throw new Error('useCurrentUser must be used within CurrentUserProvider')
  return context
}
