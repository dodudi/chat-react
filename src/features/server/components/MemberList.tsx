import type { User } from '../../user/types'
import { Avatar } from '../../../shared/components/Avatar'

type MemberListProps = {
  members: User[]
}

export function MemberList({ members }: MemberListProps) {
  const onlineMembers = members.filter((member) => member.status !== 'OFFLINE')
  const offlineMembers = members.filter((member) => member.status === 'OFFLINE')

  return (
    <div className="hidden w-56 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-2 py-4 sm:block dark:border-slate-700 dark:bg-slate-800/50">
      <MemberGroup label={`온라인 — ${onlineMembers.length}`} members={onlineMembers} />
      <MemberGroup label={`오프라인 — ${offlineMembers.length}`} members={offlineMembers} />
    </div>
  )
}

type MemberGroupProps = {
  label: string
  members: User[]
}

function MemberGroup({ label, members }: MemberGroupProps) {
  if (members.length === 0) return null

  return (
    <div className="mb-4">
      <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        {label}
      </p>
      <ul className="flex flex-col gap-0.5">
        {members.map((member) => (
          <li key={member.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
            >
              <Avatar user={member} size="sm" />
              <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
                {member.username}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
