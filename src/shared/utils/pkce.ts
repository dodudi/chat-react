export const PKCE_VERIFIER_STORAGE_KEY = 'chat-react.pkce_verifier'
export const OAUTH_STATE_STORAGE_KEY = 'chat-react.oauth_state'

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomBytes(length: number): ArrayBuffer {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return array.buffer
}

export function generateCodeVerifier(): string {
  return base64UrlEncode(randomBytes(32))
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64UrlEncode(digest)
}

export function generateOAuthState(): string {
  return base64UrlEncode(randomBytes(16))
}
