import { Link } from 'react-router-dom'
import type { Server } from '../../server/types'
import type { Channel } from '../../channel/types'
import type { DisplayUser } from '../../user/types'
import { ServerSwitcher } from '../../server/components/ServerSwitcher'
import { ServerSettingsModal } from '../../server/components/ServerSettingsModal'
import { UserMenu } from '../../auth/components/UserMenu'
import { useTheme } from '../../../shared/hooks/useTheme'
import { HashIcon } from '../../../shared/components/icons/HashIcon'
import { SearchIcon } from '../../../shared/components/icons/SearchIcon'
import { CompassIcon } from '../../../shared/components/icons/CompassIcon'
import { MailIcon } from '../../../shared/components/icons/MailIcon'
import { UsersIcon } from '../../../shared/components/icons/UsersIcon'
import { MenuIcon } from '../../../shared/components/icons/MenuIcon'
import { SunIcon } from '../../../shared/components/icons/SunIcon'
import { MoonIcon } from '../../../shared/components/icons/MoonIcon'

type AppHeaderProps = {
  servers: Server[]
  activeServer?: Server
  activeChannel?: Channel
  currentUser: DisplayUser
  isMemberListOpen: boolean
  onSelectServer: (serverId: number) => void
  onServerCreated: (server: Server) => void
  onServerJoined: () => void
  onServerUpdated: (server: Server) => void
  onToggleMemberList: () => void
  onToggleChannelDrawer: () => void
}

export function AppHeader({
  servers,
  activeServer,
  activeChannel,
  currentUser,
  isMemberListOpen,
  onSelectServer,
  onServerCreated,
  onServerJoined,
  onServerUpdated,
  onToggleMemberList,
  onToggleChannelDrawer,
}: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        aria-label="채널 목록"
        onClick={onToggleChannelDrawer}
        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {activeServer ? (
        <ServerSwitcher
          servers={servers}
          activeServer={activeServer}
          onSelectServer={onSelectServer}
          onServerCreated={onServerCreated}
          onServerJoined={onServerJoined}
        />
      ) : (
        <span className="px-2 text-sm font-semibold text-slate-800 dark:text-slate-100">chat-react</span>
      )}

      {activeServer && activeServer.ownerId === currentUser.id && (
        <ServerSettingsModal server={activeServer} onServerUpdated={onServerUpdated} />
      )}

      {activeChannel && (
        <div className="hidden items-center gap-1 text-slate-500 sm:flex dark:text-slate-400">
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <HashIcon className="h-4 w-4" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{activeChannel.name}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Link
          to="/dm"
          aria-label="다이렉트 메시지"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <MailIcon className="h-5 w-5" />
        </Link>
        <Link
          to="/discover"
          aria-label="공개 서버 둘러보기"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <CompassIcon className="h-5 w-5" />
        </Link>
        <button
          type="button"
          aria-label="검색"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
        {activeServer && (
          <button
            type="button"
            aria-label="멤버 목록"
            aria-pressed={isMemberListOpen}
            onClick={onToggleMemberList}
            className={
              isMemberListOpen
                ? 'rounded-lg bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400'
                : 'rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }
          >
            <UsersIcon className="h-5 w-5" />
          </button>
        )}
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
