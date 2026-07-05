import { useState } from 'react'
import clsx from 'clsx'
import type { Channel } from '../types'
import { HashIcon } from '../../../shared/components/icons/HashIcon'
import { XIcon } from '../../../shared/components/icons/XIcon'
import { PlusIcon } from '../../../shared/components/icons/PlusIcon'
import { TrashIcon } from '../../../shared/components/icons/TrashIcon'
import { Modal } from '../../../shared/components/Modal'
import { CreateChannelForm } from './CreateChannelForm'
import { deleteChannel } from '../api/channelApi'

type ChannelSidebarProps = {
  serverId: number
  channels: Channel[]
  activeChannelId: number | null
  isOpen: boolean
  onSelectChannel: (channelId: number) => void
  onChannelCreated: (channel: Channel) => void
  onChannelDeleted: (channelId: number) => void
  onClose: () => void
}

export function ChannelSidebar({
  serverId,
  channels,
  activeChannelId,
  isOpen,
  onSelectChannel,
  onChannelCreated,
  onChannelDeleted,
  onClose,
}: ChannelSidebarProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [channelPendingDeletion, setChannelPendingDeletion] = useState<Channel | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirmDelete() {
    if (!channelPendingDeletion) return

    setIsDeleting(true)
    try {
      await deleteChannel(channelPendingDeletion.id)
      onChannelDeleted(channelPendingDeletion.id)
      setChannelPendingDeletion(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="사이드바 닫기"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-200 md:static md:z-auto md:w-56 md:translate-x-0 dark:border-slate-700 dark:bg-slate-800/50',
          isOpen && 'translate-x-0',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-3 md:hidden dark:border-slate-700">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">채널</span>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <XIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="flex items-center justify-between px-2 pb-1">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">채널</p>
            <button
              type="button"
              aria-label="채널 추가"
              onClick={() => setIsAdding(true)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700/50 dark:hover:text-slate-300"
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          <ul className="flex flex-col gap-0.5">
            {channels.map((channel) => {
              const isActive = channel.id === activeChannelId
              return (
                <li key={channel.id} className="group">
                  <div
                    className={clsx(
                      'flex items-center rounded-lg pr-1',
                      isActive
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400'
                        : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-700/50',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectChannel(channel.id)}
                      className="flex min-w-0 flex-1 items-center gap-1.5 px-2 py-1.5 text-sm font-medium"
                    >
                      <HashIcon
                        className={clsx(
                          'h-4 w-4 shrink-0',
                          isActive ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500',
                        )}
                      />
                      <span className="truncate">{channel.name}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`${channel.name} 채널 삭제`}
                      onClick={() => setChannelPendingDeletion(channel)}
                      className="shrink-0 rounded p-1 text-slate-400 opacity-0 hover:bg-slate-300/50 hover:text-red-600 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-slate-600/50 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="채널 만들기">
        <CreateChannelForm
          serverId={serverId}
          onChannelCreated={(channel) => {
            onChannelCreated(channel)
            setIsAdding(false)
          }}
        />
      </Modal>

      <Modal isOpen={channelPendingDeletion !== null} onClose={() => setChannelPendingDeletion(null)} title="채널 삭제">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">#{channelPendingDeletion?.name}</span> 채널을 삭제하시겠습니까? 이 작업은 되돌릴
            수 없습니다.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setChannelPendingDeletion(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              삭제
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
