import { useState } from 'react'
import type { User } from '../../user/types'
import { useAuth } from '../../../app/providers/AuthProvider'
import { Avatar } from '../../../shared/components/Avatar'
import { ChevronDownIcon } from '../../../shared/components/icons/ChevronDownIcon'

type UserMenuProps = {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative ml-2 border-l border-slate-200 pl-3 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Avatar user={user} size="sm" />
        <span className="hidden text-sm font-medium text-slate-700 md:inline dark:text-slate-200">
          {user.username}
        </span>
        <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 md:inline dark:text-slate-500" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute top-full right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={logout}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-slate-50 dark:text-red-400 dark:hover:bg-slate-700/50"
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  )
}
