import { useEffect, useState } from 'react'
import type { User } from '../../user/types'
import type { Friendship } from '../../friend/types'
import type { DmChannel, DmChannelResponse } from '../types'
import { createDirectDm, createGroupDm, fetchDmChannels, fetchDmMessages, leaveDmChannel } from '../api/dmApi'

function toPeerFromFriend(friend: Friendship): NonNullable<DmChannel['peer']> {
  return {
    id: friend.friendId,
    externalId: friend.friendExternalId,
    nickname: friend.friendExternalId,
    status: 'OFFLINE',
    createdAt: friend.createdAt,
    displayName: friend.friendExternalId,
  }
}

// 백엔드가 DM 채널의 참가자 목록을 내려주지 않으므로 최근 메시지 1건을 조회해 상대방을 추론한다
async function resolvePeer(channel: DmChannelResponse, currentUser: User): Promise<DmChannel['peer']> {
  if (channel.type !== 'DIRECT') return null

  const [latest] = await fetchDmMessages(channel.id, { limit: 1 })
  if (!latest || latest.senderId === currentUser.id) return null

  return {
    id: latest.senderId,
    externalId: latest.senderExternalId,
    nickname: latest.senderExternalId,
    status: 'OFFLINE',
    createdAt: latest.createdAt,
    displayName: latest.senderExternalId,
  }
}

export function useDmChannels(currentUser: User | null) {
  const [channels, setChannels] = useState<DmChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!currentUser) {
      setChannels([])
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)

    fetchDmChannels()
      .then(async (responses) => {
        const resolved = await Promise.all(
          responses.map(async (channel) => ({ ...channel, peer: await resolvePeer(channel, currentUser) })),
        )
        if (!isCancelled) setChannels(resolved)
      })
      .catch(() => {
        if (!isCancelled) setChannels([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [currentUser, reloadKey])

  function refresh() {
    setReloadKey((key) => key + 1)
  }

  async function createDirect(friend: Friendship): Promise<DmChannel> {
    const response = await createDirectDm(friend.friendId)
    const channel: DmChannel = { ...response, peer: toPeerFromFriend(friend) }
    setChannels((previous) => (previous.some((existing) => existing.id === channel.id) ? previous : [...previous, channel]))
    return channel
  }

  async function createGroup(name: string, participantIds: number[]): Promise<DmChannel> {
    const response = await createGroupDm({ name, participantIds })
    const channel: DmChannel = { ...response, peer: null }
    setChannels((previous) => [...previous, channel])
    return channel
  }

  async function leave(channelId: number) {
    await leaveDmChannel(channelId)
    setChannels((previous) => previous.filter((channel) => channel.id !== channelId))
  }

  return { channels, isLoading, refresh, createDirect, createGroup, leave }
}
