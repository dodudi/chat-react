export type UserStatus = 'ONLINE' | 'IDLE' | 'DND' | 'OFFLINE'

export type User = {
  id: number
  externalId: string
  nickname: string
  status: UserStatus
  createdAt: string
}

// 서버 멤버별 별명(폴백 포함)으로 조립한 화면 전용 표현
export type DisplayUser = User & {
  displayName: string
}
