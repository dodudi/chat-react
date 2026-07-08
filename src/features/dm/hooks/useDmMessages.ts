import { useEffect, useMemo, useState } from 'react'
import { useChatSocket } from '../../../app/providers/ChatSocketProvider'
import type { DisplayUser, User } from '../../user/types'
import type { DmMessage, DmMessageResponse, DmSocketEvent } from '../types'
import { fetchDmMessages, sendDmMessage } from '../api/dmApi'

const DM_MESSAGE_PAGE_LIMIT = 50

function toDisplayAuthor(response: DmMessageResponse, currentUser: User | null): DisplayUser {
  const isMe = currentUser !== null && response.senderId === currentUser.id
  const displayName = isMe ? currentUser.nickname : response.senderExternalId
  return {
    id: response.senderId,
    externalId: response.senderExternalId,
    nickname: displayName,
    status: 'OFFLINE',
    createdAt: response.createdAt,
    displayName,
  }
}

export function useDmMessages(channelId: number, currentUser: User | null) {
  const { subscribe } = useChatSocket()
  const [responses, setResponses] = useState<DmMessageResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (channelId <= 0) return

    return subscribe(`/topic/dm/${channelId}`, (message) => {
      const event: DmSocketEvent = JSON.parse(message.body)

      if (event.type === 'MESSAGE_CREATED') {
        setResponses((previous) =>
          previous.some((response) => response.id === event.data.id) ? previous : [...previous, event.data],
        )
      } else if (event.type === 'MESSAGE_EDITED') {
        setResponses((previous) => previous.map((response) => (response.id === event.data.id ? event.data : response)))
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

    fetchDmMessages(channelId, { limit: DM_MESSAGE_PAGE_LIMIT })
      .then((data) => {
        if (isCancelled) return
        // 백엔드가 최신순(id desc)으로 내려주므로 화면 표시 순서(오래된 순)로 뒤집어 저장
        setResponses([...data].reverse())
        setHasMore(data.length >= DM_MESSAGE_PAGE_LIMIT)
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

  const messages = useMemo<DmMessage[]>(
    () => responses.map((response) => ({ ...response, author: toDisplayAuthor(response, currentUser) })),
    [responses, currentUser],
  )

  async function loadMore() {
    const oldest = responses[0]
    if (!oldest || !hasMore) return

    const data = await fetchDmMessages(channelId, { before: oldest.id, limit: DM_MESSAGE_PAGE_LIMIT })
    setResponses((previous) => [...[...data].reverse(), ...previous])
    setHasMore(data.length >= DM_MESSAGE_PAGE_LIMIT)
  }

  async function send(content: string) {
    const response = await sendDmMessage(channelId, content)
    // STOMP 브로드캐스트가 이 REST 응답보다 먼저 도착해 이미 추가돼 있을 수 있음
    setResponses((previous) =>
      previous.some((existing) => existing.id === response.id) ? previous : [...previous, response],
    )
  }

  return { messages, isLoading, hasMore, loadMore, send }
}
