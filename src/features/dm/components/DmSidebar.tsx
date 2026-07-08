import { useState } from 'react'
import clsx from 'clsx'
import type { Friendship } from '../../friend/types'
import type { DmChannel } from '../types'
import { Avatar } from '../../../shared/components/Avatar'
import { Modal } from '../../../shared/components/Modal'
import { PlusIcon } from '../../../shared/components/icons/PlusIcon'
import { UsersIcon } from '../../../shared/components/icons/UsersIcon'
import { FriendRequestsModal } from '../../friend/components/FriendRequestsModal'
import { NewDmModal } from './NewDmModal'

type DmSidebarProps = {
  channels: DmChannel[]
  activeChannelId: number | null
  onSelectChannel: (channelId: number) => void
  onCreateDirect: (friend: Friendship) => Promise<DmChannel>
  onCreateGroup: (name: string, participantIds: number[]) => Promise<DmChannel>
}

function channelLabel(channel: DmChannel): string {
  if (channel.type === 'GROUP') return channel.name ?? '그룹 DM'
  return channel.peer?.displayName ?? '새 대화'
}

export function DmSidebar({ channels, activeChannelId, onSelectChannel, onCreateDirect, onCreateGroup }: DmSidebarProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isManagingFriends, setIsManagingFriends] = useState(false)

  return (
    <>
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50 md:w-56 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
            다이렉트 메시지
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="친구 요청 관리"
              aria-label="친구 요청 관리"
              onClick={() => setIsManagingFriends(true)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700/50 dark:hover:text-slate-300"
            >
              <UsersIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="새 메시지"
              aria-label="새 메시지"
              onClick={() => setIsCreating(true)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700/50 dark:hover:text-slate-300"
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto px-2">
          {channels.length === 0 && (
            <li className="px-2 py-4 text-center text-sm text-slate-500 dark:text-slate-400">아직 대화가 없습니다.</li>
          )}
          {channels.map((channel) => {
            const isActive = channel.id === activeChannelId
            const label = channelLabel(channel)

            return (
              <li key={channel.id}>
                <button
                  type="button"
                  onClick={() => onSelectChannel(channel.id)}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium',
                    isActive
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400'
                      : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-700/50',
                  )}
                >
                  {channel.type === 'DIRECT' && channel.peer ? (
                    <Avatar user={channel.peer} size="sm" showStatus={false} />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                      {label.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="truncate">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="새 메시지">
        <NewDmModal
          onCreateDirect={onCreateDirect}
          onCreateGroup={onCreateGroup}
          onCreated={(channel) => onSelectChannel(channel.id)}
          onClose={() => setIsCreating(false)}
        />
      </Modal>

      <Modal isOpen={isManagingFriends} onClose={() => setIsManagingFriends(false)} title="친구 요청">
        <FriendRequestsModal />
      </Modal>
    </>
  )
}
