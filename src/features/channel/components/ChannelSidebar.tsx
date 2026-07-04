import clsx from 'clsx'
import type { Channel } from '../types'
import { HashIcon } from '../../../shared/components/icons/HashIcon'
import { XIcon } from '../../../shared/components/icons/XIcon'

type ChannelSidebarProps = {
  channels: Channel[]
  activeChannelId: string
  isOpen: boolean
  onSelectChannel: (channelId: string) => void
  onClose: () => void
}

export function ChannelSidebar({ channels, activeChannelId, isOpen, onSelectChannel, onClose }: ChannelSidebarProps) {
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
          <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
            채널
          </p>
          <ul className="flex flex-col gap-0.5">
            {channels.map((channel) => {
              const isActive = channel.id === activeChannelId
              return (
                <li key={channel.id}>
                  <button
                    type="button"
                    onClick={() => onSelectChannel(channel.id)}
                    className={clsx(
                      'flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium',
                      isActive
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400'
                        : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-700/50',
                    )}
                  >
                    <HashIcon
                      className={clsx(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500',
                      )}
                    />
                    <span className="truncate">{channel.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}
