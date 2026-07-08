import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, UserStatus } from '../../features/user/types'
import { fetchMe, updateMyNickname, updateMyStatus } from '../../features/user/api/userApi'
import { useAuth } from './AuthProvider'

type CurrentUserContextValue = {
  currentUser: User | null
  isLoading: boolean
  updateStatus: (status: UserStatus) => Promise<void>
  updateNickname: (nickname: string) => Promise<void>
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
      .catch(() => {
        if (!isCancelled) setCurrentUser(null)
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated])

  async function updateStatus(status: UserStatus) {
    const updated = await updateMyStatus(status)
    setCurrentUser(updated)
  }

  async function updateNickname(nickname: string) {
    const updated = await updateMyNickname(nickname)
    setCurrentUser(updated)
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoading, updateStatus, updateNickname }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) throw new Error('useCurrentUser must be used within CurrentUserProvider')
  return context
}
