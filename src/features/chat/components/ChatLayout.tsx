import { useState } from 'react'
import type { Server } from '../../server/types'
import type { Channel } from '../../channel/types'
import type { User } from '../../user/types'
import type { Message } from '../types'
import { ChannelSidebar } from '../../channel/components/ChannelSidebar'
import { MemberList } from '../../server/components/MemberList'
import { AppHeader } from './AppHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

const CURRENT_USER: User = { id: 'u1', username: 'rudy', status: 'ONLINE' }

const MOCK_USERS: User[] = [
  CURRENT_USER,
  { id: 'u2', username: '지수', status: 'ONLINE' },
  { id: 'u3', username: '민준', status: 'IDLE' },
  { id: 'u4', username: '서연', status: 'DND' },
  { id: 'u5', username: '도윤', status: 'OFFLINE' },
  { id: 'u6', username: '하은', status: 'OFFLINE' },
]

const MOCK_SERVERS: Server[] = [
  { id: 's1', name: 'chat-react' },
  { id: 's2', name: '스터디 모임' },
  { id: 's3', name: '게임 친구들' },
]

const MOCK_CHANNELS_BY_SERVER: Record<string, Channel[]> = {
  s1: [
    { id: 'c1', serverId: 's1', name: '공지사항', type: 'TEXT' },
    { id: 'c2', serverId: 's1', name: '잡담', type: 'TEXT' },
    { id: 'c3', serverId: 's1', name: '개발-프론트엔드', type: 'TEXT' },
  ],
  s2: [
    { id: 'c4', serverId: 's2', name: '공지', type: 'TEXT' },
    { id: 'c5', serverId: 's2', name: '질문답변', type: 'TEXT' },
  ],
  s3: [{ id: 'c6', serverId: 's3', name: '일반', type: 'TEXT' }],
}

const MOCK_MESSAGES_BY_CHANNEL: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      channelId: 'c1',
      author: MOCK_USERS[1],
      content: '이번 주 배포는 금요일 오후로 예정되어 있어요.',
      createdAt: '2026-07-02T09:00:00',
    },
  ],
  c2: [
    {
      id: 'm2',
      channelId: 'c2',
      author: MOCK_USERS[2],
      content: '다들 점심 뭐 드셨어요?',
      createdAt: '2026-07-02T12:01:00',
    },
    {
      id: 'm3',
      channelId: 'c2',
      author: MOCK_USERS[2],
      content: '저는 김치찌개 먹었습니다 ㅎㅎ',
      createdAt: '2026-07-02T12:01:30',
    },
    {
      id: 'm4',
      channelId: 'c2',
      author: MOCK_USERS[3],
      content: '오 맛있겠다',
      createdAt: '2026-07-02T12:02:10',
    },
  ],
  c3: [
    {
      id: 'm5',
      channelId: 'c3',
      author: CURRENT_USER,
      content: 'Tailwind 세팅 끝났고 STOMP 클라이언트 붙이는 중입니다.',
      createdAt: '2026-07-02T14:30:00',
    },
  ],
}

export function ChatLayout() {
  const [activeServerId, setActiveServerId] = useState(MOCK_SERVERS[0].id)
  const [activeChannelId, setActiveChannelId] = useState(MOCK_CHANNELS_BY_SERVER[MOCK_SERVERS[0].id][0].id)
  const [isMemberListOpen, setIsMemberListOpen] = useState(true)
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false)
  const [messagesByChannel, setMessagesByChannel] = useState(MOCK_MESSAGES_BY_CHANNEL)

  const activeServer = MOCK_SERVERS.find((server) => server.id === activeServerId) ?? MOCK_SERVERS[0]
  const channels = MOCK_CHANNELS_BY_SERVER[activeServerId] ?? []
  const activeChannel = channels.find((channel) => channel.id === activeChannelId) ?? channels[0]
  const messages = messagesByChannel[activeChannel.id] ?? []

  function handleSelectServer(serverId: string) {
    setActiveServerId(serverId)
    setActiveChannelId(MOCK_CHANNELS_BY_SERVER[serverId][0].id)
  }

  function handleSelectChannel(channelId: string) {
    setActiveChannelId(channelId)
    setIsChannelDrawerOpen(false)
  }

  function handleSendMessage(text: string) {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      channelId: activeChannel.id,
      author: CURRENT_USER,
      content: text,
      createdAt: new Date().toISOString(),
    }

    setMessagesByChannel((previous) => ({
      ...previous,
      [activeChannel.id]: [...(previous[activeChannel.id] ?? []), newMessage],
    }))
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <AppHeader
        servers={MOCK_SERVERS}
        activeServer={activeServer}
        activeChannel={activeChannel}
        currentUser={CURRENT_USER}
        isMemberListOpen={isMemberListOpen}
        onSelectServer={handleSelectServer}
        onToggleMemberList={() => setIsMemberListOpen((open) => !open)}
        onToggleChannelDrawer={() => setIsChannelDrawerOpen((open) => !open)}
      />

      <div className="flex min-h-0 flex-1">
        <ChannelSidebar
          channels={channels}
          activeChannelId={activeChannel.id}
          isOpen={isChannelDrawerOpen}
          onSelectChannel={handleSelectChannel}
          onClose={() => setIsChannelDrawerOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <MessageList messages={messages} />
          <MessageInput channelName={activeChannel.name} onSubmit={handleSendMessage} />
        </div>

        {isMemberListOpen && <MemberList members={MOCK_USERS} />}
      </div>
    </div>
  )
}
