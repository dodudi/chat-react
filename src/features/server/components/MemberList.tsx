import type { ServerMember } from '../types'
import type { DisplayUser } from '../../user/types'
import { Avatar } from '../../../shared/components/Avatar'

type MemberListProps = {
  members: ServerMember[]
}

export function MemberList({ members }: MemberListProps) {
  return (
    <div className="hidden w-56 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-2 py-4 sm:block dark:border-slate-700 dark:bg-slate-800/50">
      <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        멤버 — {members.length}
      </p>
      <ul className="flex flex-col gap-0.5">
        {members.map((member) => (
          <li key={member.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
            >
              <Avatar user={toDisplayUser(member)} size="sm" showStatus={false} />
              <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
                {member.nickname ?? member.externalId}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 서버 멤버 API에는 presence(온라인 상태)가 없어 Avatar에는 상태 점을 숨기고(showStatus=false) 임시 OFFLINE으로 채움
function toDisplayUser(member: ServerMember): DisplayUser {
  const displayName = member.nickname ?? member.externalId
  return {
    id: member.userId,
    externalId: member.externalId,
    nickname: displayName,
    status: 'OFFLINE',
    createdAt: member.joinedAt,
    displayName,
  }
}
