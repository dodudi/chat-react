import { useEffect, useState, type ReactNode } from 'react'
import type { DisplayUser } from '../../user/types'
import type { Server } from '../../server/types'
import type { Channel } from '../../channel/types'
import { useCurrentUser } from '../../../app/providers/CurrentUserProvider'
import { useMyServers } from '../../server/hooks/useMyServers'
import { useChannels } from '../../channel/hooks/useChannels'
import { useServerMembers } from '../../server/hooks/useServerMembers'
import { useMessages } from '../hooks/useMessages'
import { ChannelSidebar } from '../../channel/components/ChannelSidebar'
import { CreateChannelForm } from '../../channel/components/CreateChannelForm'
import { MemberList } from '../../server/components/MemberList'
import { CreateOrJoinServerPanel } from '../../server/components/CreateOrJoinServerPanel'
import { AppHeader } from './AppHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

function CenteredNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>
    </div>
  )
}

export function ChatLayout() {
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser()
  const { servers, isLoading: isServersLoading, refresh: refreshServers } = useMyServers()
  const [activeServerId, setActiveServerId] = useState<number | null>(null)
  const [activeChannelId, setActiveChannelId] = useState<number | null>(null)
  const [isMemberListOpen, setIsMemberListOpen] = useState(true)
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false)

  useEffect(() => {
    if (servers.length === 0) return
    if (servers.some((server) => server.id === activeServerId)) return
    setActiveServerId(servers[0].id)
  }, [servers, activeServerId])

  const { channels, isLoading: isChannelsLoading, refresh: refreshChannels } = useChannels(activeServerId ?? -1)
  const { members } = useServerMembers(activeServerId ?? -1)
  const { messages, send: sendMessage } = useMessages(activeChannelId ?? -1, members)

  useEffect(() => {
    if (channels.length === 0) return
    if (channels.some((channel) => channel.id === activeChannelId)) return
    setActiveChannelId(channels[0].id)
  }, [channels, activeChannelId])

  const activeServer = servers.find((server) => server.id === activeServerId)
  const activeChannel = channels.find((channel) => channel.id === activeChannelId)

  if (isCurrentUserLoading || !currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">불러오는 중...</p>
      </div>
    )
  }

  // 서버 멤버 닉네임 연동 전까지는 표시 이름으로 externalId를 임시로 사용
  const displayCurrentUser: DisplayUser = { ...currentUser, displayName: currentUser.externalId }

  function handleSelectServer(serverId: number) {
    setActiveServerId(serverId)
    setActiveChannelId(null)
  }

  function handleSelectChannel(channelId: number) {
    setActiveChannelId(channelId)
    setIsChannelDrawerOpen(false)
  }

  function handleServerReady(server: Server) {
    refreshServers()
    setActiveServerId(server.id)
  }

  function handleChannelCreated(channel: Channel) {
    refreshChannels()
    setActiveChannelId(channel.id)
  }

  function handleChannelDeleted(channelId: number) {
    refreshChannels()
    if (activeChannelId === channelId) setActiveChannelId(null)
  }

  let mainContent: ReactNode

  if (isServersLoading) {
    mainContent = <CenteredNotice>서버 목록을 불러오는 중...</CenteredNotice>
  } else if (servers.length === 0) {
    mainContent = (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">아직 속한 서버가 없습니다.</p>
          <CreateOrJoinServerPanel onServerCreated={handleServerReady} onServerJoined={refreshServers} />
        </div>
      </div>
    )
  } else if (!activeServer) {
    mainContent = <CenteredNotice>불러오는 중...</CenteredNotice>
  } else if (isChannelsLoading) {
    mainContent = <CenteredNotice>채널을 불러오는 중...</CenteredNotice>
  } else if (channels.length === 0) {
    mainContent = (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {activeServer.name}에 아직 채널이 없습니다.
          </p>
          <CreateChannelForm serverId={activeServer.id} onChannelCreated={handleChannelCreated} />
        </div>
      </div>
    )
  } else if (!activeChannel) {
    mainContent = <CenteredNotice>불러오는 중...</CenteredNotice>
  } else {
    mainContent = (
      <>
        <MessageList messages={messages} />
        <MessageInput channelName={activeChannel.name} onSubmit={sendMessage} />
      </>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <AppHeader
        servers={servers}
        activeServer={activeServer}
        activeChannel={activeChannel}
        currentUser={displayCurrentUser}
        isMemberListOpen={isMemberListOpen}
        onSelectServer={handleSelectServer}
        onServerCreated={handleServerReady}
        onServerJoined={refreshServers}
        onServerUpdated={refreshServers}
        onToggleMemberList={() => setIsMemberListOpen((open) => !open)}
        onToggleChannelDrawer={() => setIsChannelDrawerOpen((open) => !open)}
      />

      <div className="flex min-h-0 flex-1">
        {activeServer && (
          <ChannelSidebar
            serverId={activeServer.id}
            channels={channels}
            activeChannelId={activeChannel?.id ?? null}
            isOpen={isChannelDrawerOpen}
            onSelectChannel={handleSelectChannel}
            onChannelCreated={handleChannelCreated}
            onChannelDeleted={handleChannelDeleted}
            onClose={() => setIsChannelDrawerOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">{mainContent}</div>

        {isMemberListOpen && activeServer && <MemberList members={members} />}
      </div>
    </div>
  )
}
