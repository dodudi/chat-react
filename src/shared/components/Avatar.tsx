import clsx from 'clsx'
import type { DisplayUser, UserStatus } from '../../features/user/types'

type AvatarProps = {
  user: DisplayUser
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
} as const

const STATUS_DOT_CLASSES: Record<UserStatus, string> = {
  ONLINE: 'bg-emerald-500',
  IDLE: 'bg-amber-400',
  DND: 'bg-red-500',
  OFFLINE: 'bg-slate-300 dark:bg-slate-600',
}

export function Avatar({ user, size = 'md', showStatus = true }: AvatarProps) {
  const initial = user.displayName.charAt(0).toUpperCase()

  return (
    <div className="relative shrink-0">
      <div
        className={clsx(
          'flex items-center justify-center rounded-full bg-teal-600 font-medium text-white',
          SIZE_CLASSES[size],
        )}
      >
        {initial}
      </div>
      {showStatus && (
        <span
          className={clsx(
            'absolute right-0 bottom-0 rounded-full ring-2 ring-white dark:ring-slate-900',
            size === 'lg' ? 'h-5 w-5' : 'h-3 w-3',
            STATUS_DOT_CLASSES[user.status],
          )}
        />
      )}
    </div>
  )
}
