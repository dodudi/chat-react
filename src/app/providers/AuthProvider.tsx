import { createContext, useContext, useState, type ReactNode } from 'react'
import type { TokenResponse } from '../../features/auth/types'
import { redirectToAuthorize } from '../../features/auth/api/authApi'
import { clearTokens, getAccessToken, setTokens } from '../../shared/api/tokenStorage'

type AuthContextValue = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  completeLogin: (tokens: TokenResponse) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAccessToken() !== null)

  function completeLogin(tokens: TokenResponse) {
    setTokens(tokens.access_token, tokens.refresh_token)
    setIsAuthenticated(true)
  }

  function logout() {
    clearTokens()
    setIsAuthenticated(false)
  }

  const value: AuthContextValue = {
    isAuthenticated,
    login: redirectToAuthorize,
    logout,
    completeLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
