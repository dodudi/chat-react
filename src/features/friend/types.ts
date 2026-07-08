export type Friendship = {
  id: number
  friendId: number
  friendExternalId: string
  createdAt: string
}

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'

export type FriendRequest = {
  id: number
  requesterId: number
  requesterExternalId: string
  receiverId: number
  receiverExternalId: string
  status: FriendRequestStatus
  createdAt: string
}
