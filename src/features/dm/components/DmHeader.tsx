import { Link } from 'react-router-dom'
import type { DmChannel } from '../types'
import type { DisplayUser } from '../../user/types'
import { UserMenu } from '../../auth/components/UserMenu'
import { useTheme } from '../../../shared/hooks/useTheme'
import { SunIcon } from '../../../shared/components/icons/SunIcon'
import { MoonIcon } from '../../../shared/components/icons/MoonIcon'

type DmHeaderProps = {
  activeChannel?: DmChannel
  currentUser: DisplayUser
}

function channelLabel(channel: DmChannel): string {
  if (channel.type === 'GROUP') return channel.name ?? '그룹 DM'
  return channel.peer?.displayName ?? '새 대화'
}

export function DmHeader({ activeChannel, currentUser }: DmHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
      <Link
        to="/"
        className="rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        chat-react
      </Link>

      {activeChannel && (
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{channelLabel(activeChannel)}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          aria-label="테마 전환"
          onClick={toggleTheme}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
        <UserMenu user={currentUser} />
      </div>
    </header>
  )
}
