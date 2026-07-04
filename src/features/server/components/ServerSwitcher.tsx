import { useState } from 'react'
import clsx from 'clsx'
import type { Server } from '../types'
import { ChevronDownIcon } from '../../../shared/components/icons/ChevronDownIcon'

type ServerSwitcherProps = {
  servers: Server[]
  activeServer: Server
  onSelectServer: (serverId: string) => void
}

export function ServerSwitcher({ servers, activeServer, onSelectServer }: ServerSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleSelect(serverId: string) {
    onSelectServer(serverId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-xs font-semibold text-white">
          {activeServer.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="max-w-40 truncate">{activeServer.name}</span>
        <ChevronDownIcon
          className={clsx('h-4 w-4 text-slate-400 transition-transform dark:text-slate-500', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul className="absolute top-full left-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {servers.map((server) => (
              <li key={server.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(server.id)}
                  className={clsx(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                    server.id === activeServer.id
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50',
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-600 text-[10px] font-semibold text-white">
                    {server.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="truncate">{server.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
