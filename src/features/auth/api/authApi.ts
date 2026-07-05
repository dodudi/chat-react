import type { TokenResponse } from '../types'
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateOAuthState,
  OAUTH_STATE_STORAGE_KEY,
  PKCE_VERIFIER_STORAGE_KEY,
} from '../../../shared/utils/pkce'

const AUTH_ISSUER = import.meta.env.VITE_AUTH_ISSUER
const CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI
const SCOPE = import.meta.env.VITE_AUTH_SCOPE
const POST_LOGOUT_REDIRECT_URI = import.meta.env.VITE_AUTH_POST_LOGOUT_REDIRECT_URI

// 인증 서버가 별도로 JWT를 발급하는 리소스 서버 구조라, chat-spring용 axios 인스턴스 대신
// 인증 서버에 직접 fetch로 요청한다 (응답 형식도 chat-spring의 {code,message,data}가 아닌 표준 OAuth2 토큰 응답).
export async function redirectToAuthorize(): Promise<void> {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateOAuthState()

  sessionStorage.setItem(PKCE_VERIFIER_STORAGE_KEY, codeVerifier)
  sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  window.location.href = `${AUTH_ISSUER}/oauth2/authorize?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
  const response = await fetch(`${AUTH_ISSUER}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) throw new Error('토큰 발급에 실패했습니다.')

  return response.json()
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const response = await fetch(`${AUTH_ISSUER}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  })

  if (!response.ok) throw new Error('토큰 갱신에 실패했습니다.')

  return response.json()
}

// 로컬 토큰만 지우면 인증 서버의 SSO 세션(쿠키)이 남아있어 재로그인 시 계정 선택 없이 자동 재인증됨 —
// OIDC RP-Initiated Logout(/connect/logout)으로 인증 서버 세션까지 끝내야 한다
export function redirectToEndSession(idToken: string | null): void {
  if (!idToken) {
    window.location.href = POST_LOGOUT_REDIRECT_URI
    return
  }

  const params = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  })

  window.location.href = `${AUTH_ISSUER}/connect/logout?${params.toString()}`
}
