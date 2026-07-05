import axios, { type InternalAxiosRequestConfig } from 'axios'
import { refreshAccessToken } from '../../features/auth/api/authApi'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage'

type RetriableRequestConfig = InternalAxiosRequestConfig & { isRetry?: boolean }

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data
    if (!body) return undefined
    if (body.code !== '200') return Promise.reject(body)
    return body.data
  },
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest.isRetry) {
      if (error.response?.status === 401) redirectToLogin()
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      redirectToLogin()
      return Promise.reject(error)
    }

    try {
      const tokens = await refreshAccessTokenOnce(refreshToken)
      setTokens(tokens.access_token, tokens.refresh_token)
      originalRequest.isRetry = true
      return apiClient(originalRequest)
    } catch {
      redirectToLogin()
      return Promise.reject(error)
    }
  },
)

function redirectToLogin() {
  clearTokens()
  window.location.href = '/login'
}

// 여러 요청이 동시에 401을 받아도 리프레시 요청은 한 번만 나가도록 진행 중인 Promise를 공유
let pendingRefresh: ReturnType<typeof refreshAccessToken> | null = null

function refreshAccessTokenOnce(refreshToken: string) {
  if (!pendingRefresh) {
    pendingRefresh = refreshAccessToken(refreshToken).finally(() => {
      pendingRefresh = null
    })
  }
  return pendingRefresh
}
