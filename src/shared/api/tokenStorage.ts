const ACCESS_TOKEN_KEY = 'chat-react.access_token'
const REFRESH_TOKEN_KEY = 'chat-react.refresh_token'
const ID_TOKEN_KEY = 'chat-react.id_token'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getIdToken(): string | null {
  return sessionStorage.getItem(ID_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken?: string, idToken?: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  if (idToken) sessionStorage.setItem(ID_TOKEN_KEY, idToken)
}

export function clearTokens(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem(ID_TOKEN_KEY)
}
