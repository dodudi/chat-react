import { useState, type FormEvent } from 'react'
import clsx from 'clsx'
import type { DisplayUser, UserStatus } from '../../user/types'
import { useAuth } from '../../../app/providers/AuthProvider'
import { useCurrentUser } from '../../../app/providers/CurrentUserProvider'
import { Avatar, STATUS_DOT_CLASSES } from '../../../shared/components/Avatar'
import { ChevronDownIcon } from '../../../shared/components/icons/ChevronDownIcon'

type UserMenuProps = {
  user: DisplayUser
}

const STATUS_OPTIONS: UserStatus[] = ['ONLINE', 'IDLE', 'DND', 'OFFLINE']

const STATUS_LABELS: Record<UserStatus, string> = {
  ONLINE: '온라인',
  IDLE: '자리비움',
  DND: '다른 용무 중',
  OFFLINE: '오프라인',
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth()
  const { updateStatus, updateNickname } = useCurrentUser()
  const [isOpen, setIsOpen] = useState(false)
  const [nickname, setNickname] = useState(user.nickname)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSelectStatus(status: UserStatus) {
    setIsOpen(false)
    updateStatus(status)
  }

  async function handleSubmitNickname(event: FormEvent) {
    event.preventDefault()
    const trimmed = nickname.trim()
    if (!trimmed || trimmed === user.nickname) return

    setIsSubmitting(true)
    try {
      await updateNickname(trimmed)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          {user.displayName}
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
          <div className="absolute top-full right-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <form onSubmit={handleSubmitNickname} className="px-3 pt-1 pb-2">
              <p className="pb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                닉네임
              </p>
              <div className="flex gap-1.5">
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  maxLength={30}
                  className="w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-800 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={nickname.trim().length === 0 || nickname.trim() === user.nickname || isSubmitting}
                  className="shrink-0 rounded-md bg-teal-600 px-2 py-1 text-xs font-medium text-white hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
                >
                  저장
                </button>
              </div>
            </form>
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
            <p className="px-3 pt-1 pb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
              상태 설정
            </p>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleSelectStatus(status)}
                className={clsx(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  status === user.status
                    ? 'font-medium text-slate-800 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-300',
                )}
              >
                <span className={clsx('h-2.5 w-2.5 rounded-full', STATUS_DOT_CLASSES[status])} />
                {STATUS_LABELS[status]}
              </button>
            ))}
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
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
