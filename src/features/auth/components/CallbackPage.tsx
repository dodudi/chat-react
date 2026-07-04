import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/AuthProvider'
import { exchangeCodeForTokens } from '../api/authApi'
import { OAUTH_STATE_STORAGE_KEY, PKCE_VERIFIER_STORAGE_KEY } from '../../../shared/utils/pkce'

export function CallbackPage() {
  const navigate = useNavigate()
  const { completeLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    // StrictMode에서 effect가 두 번 실행되면 authorization code를 재사용하게 되어 인증 서버가 두 번째 요청을 거부함
    if (hasRun.current) return
    hasRun.current = true

    async function completeOAuthCallback() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      const errorParam = params.get('error')

      if (errorParam) {
        setError('로그인이 취소되었거나 실패했습니다.')
        return
      }

      const storedState = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY)
      const codeVerifier = sessionStorage.getItem(PKCE_VERIFIER_STORAGE_KEY)

      if (!code || !state || !codeVerifier || state !== storedState) {
        setError('로그인 요청이 올바르지 않습니다. 다시 시도해주세요.')
        return
      }

      try {
        const tokens = await exchangeCodeForTokens(code, codeVerifier)
        completeLogin(tokens)
        sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY)
        sessionStorage.removeItem(PKCE_VERIFIER_STORAGE_KEY)
        navigate('/', { replace: true })
      } catch {
        setError('토큰 발급에 실패했습니다.')
      }
    }

    completeOAuthCallback()
  }, [completeLogin, navigate])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white px-4 text-center dark:bg-slate-900">
      {error ? (
        <div>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <a href="/login" className="mt-2 inline-block text-sm text-teal-600 hover:underline dark:text-teal-400">
            다시 로그인하기
          </a>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">로그인 처리 중...</p>
      )}
    </div>
  )
}
