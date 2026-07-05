import { useEffect, useMemo, useState } from 'react'
import { useChatSocket } from '../../../app/providers/ChatSocketProvider'
import type { ServerMember } from '../../server/types'
import type { DisplayUser } from '../../user/types'
import type { ChannelSocketEvent, Message, MessageResponse } from '../types'
import { fetchMessages, sendMessage } from '../api/messageApi'

const MESSAGE_PAGE_LIMIT = 50

function toDisplayAuthor(response: MessageResponse, members: ServerMember[]): DisplayUser {
  const member = members.find((candidate) => candidate.userId === response.senderId)
  return {
    id: response.senderId,
    externalId: response.senderExternalId,
    status: 'OFFLINE',
    createdAt: response.createdAt,
    displayName: member?.nickname ?? response.senderExternalId,
  }
}

export function useMessages(channelId: number, members: ServerMember[]) {
  const { subscribe } = useChatSocket()
  const [responses, setResponses] = useState<MessageResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (channelId <= 0) return

    return subscribe(`/topic/channels/${channelId}`, (message) => {
      const event: ChannelSocketEvent = JSON.parse(message.body)

      if (event.type === 'MESSAGE_CREATED') {
        setResponses((previous) =>
          previous.some((response) => response.id === event.data.id) ? previous : [...previous, event.data],
        )
      } else if (event.type === 'MESSAGE_EDITED') {
        setResponses((previous) =>
          previous.map((response) => (response.id === event.data.id ? event.data : response)),
        )
      } else if (event.type === 'MESSAGE_DELETED') {
        setResponses((previous) => previous.filter((response) => response.id !== event.data))
      }
    })
  }, [channelId, subscribe])

  useEffect(() => {
    if (channelId <= 0) {
      setResponses([])
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)

    fetchMessages(channelId, { limit: MESSAGE_PAGE_LIMIT })
      .then((data) => {
        if (isCancelled) return
        // 백엔드가 최신순(id desc)으로 내려주므로 화면 표시 순서(오래된 순)로 뒤집어 저장
        setResponses([...data].reverse())
        setHasMore(data.length >= MESSAGE_PAGE_LIMIT)
      })
      .catch(() => {
        if (!isCancelled) setResponses([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [channelId])

  const messages = useMemo<Message[]>(
    () => responses.map((response) => ({ ...response, author: toDisplayAuthor(response, members) })),
    [responses, members],
  )

  async function loadMore() {
    const oldest = responses[0]
    if (!oldest || !hasMore) return

    const data = await fetchMessages(channelId, { before: oldest.id, limit: MESSAGE_PAGE_LIMIT })
    setResponses((previous) => [...[...data].reverse(), ...previous])
    setHasMore(data.length >= MESSAGE_PAGE_LIMIT)
  }

  async function send(content: string) {
    const response = await sendMessage(channelId, content)
    // STOMP 브로드캐스트가 이 REST 응답보다 먼저 도착해 이미 추가돼 있을 수 있음
    setResponses((previous) =>
      previous.some((existing) => existing.id === response.id) ? previous : [...previous, response],
    )
  }

  return { messages, isLoading, hasMore, loadMore, send }
}
