import { useEffect, useState, type ReactNode } from 'react'
import type { DisplayUser } from '../../user/types'
import { useCurrentUser } from '../../../app/providers/CurrentUserProvider'
import { useDmChannels } from '../hooks/useDmChannels'
import { useDmMessages } from '../hooks/useDmMessages'
import { DmSidebar } from './DmSidebar'
import { DmHeader } from './DmHeader'
import { MessageList } from '../../../shared/components/MessageList'
import { MessageInput } from '../../../shared/components/MessageInput'

function CenteredNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>
    </div>
  )
}

export function DmLayout() {
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser()
  const [activeChannelId, setActiveChannelId] = useState<number | null>(null)

  const { channels, isLoading: isChannelsLoading, createDirect, createGroup } = useDmChannels(currentUser)
  const { messages, send: sendMessage } = useDmMessages(activeChannelId ?? -1, currentUser)

  useEffect(() => {
    if (channels.length === 0) return
    if (channels.some((channel) => channel.id === activeChannelId)) return
    setActiveChannelId(channels[0].id)
  }, [channels, activeChannelId])

  const activeChannel = channels.find((channel) => channel.id === activeChannelId)

  if (isCurrentUserLoading || !currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">불러오는 중...</p>
      </div>
    )
  }

  const displayCurrentUser: DisplayUser = { ...currentUser, displayName: currentUser.nickname }

  let mainContent: ReactNode

  if (isChannelsLoading) {
    mainContent = <CenteredNotice>대화 목록을 불러오는 중...</CenteredNotice>
  } else if (channels.length === 0) {
    mainContent = <CenteredNotice>아직 대화가 없습니다. 새 메시지를 시작해보세요.</CenteredNotice>
  } else if (!activeChannel) {
    mainContent = <CenteredNotice>불러오는 중...</CenteredNotice>
  } else {
    const peerLabel =
      activeChannel.type === 'GROUP' ? (activeChannel.name ?? '그룹 DM') : (activeChannel.peer?.displayName ?? '상대방')

    mainContent = (
      <>
        <MessageList messages={messages} />
        <MessageInput placeholder={`${peerLabel}에게 메시지 보내기`} onSubmit={sendMessage} />
      </>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <DmHeader activeChannel={activeChannel} currentUser={displayCurrentUser} />

      <div className="flex min-h-0 flex-1">
        <DmSidebar
          channels={channels}
          activeChannelId={activeChannel?.id ?? null}
          onSelectChannel={setActiveChannelId}
          onCreateDirect={createDirect}
          onCreateGroup={createGroup}
        />

        <div className="flex min-w-0 flex-1 flex-col">{mainContent}</div>
      </div>
    </div>
  )
}
