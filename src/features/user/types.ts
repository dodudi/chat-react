export type UserStatus = 'ONLINE' | 'IDLE' | 'DND' | 'OFFLINE'

export type User = {
  id: number
  externalId: string
  status: UserStatus
  createdAt: string
}

// 백엔드 User에는 표시 이름이 없음 — 서버 멤버 닉네임(또는 폴백)으로 조립한 화면 전용 표현
export type DisplayUser = User & {
  displayName: string
}
