import { useState } from 'react'
import type { ServerMember } from '../types'
import type { DisplayUser } from '../../user/types'
import { Avatar } from '../../../shared/components/Avatar'
import { UsersIcon } from '../../../shared/components/icons/UsersIcon'
import { sendFriendRequest } from '../../friend/api/friendApi'

type MemberListProps = {
  members: ServerMember[]
  currentUserId: number
}

type SendState = 'idle' | 'sending' | 'sent' | 'error'

export function MemberList({ members, currentUserId }: MemberListProps) {
  const [sendStates, setSendStates] = useState<Record<number, SendState>>({})

  async function handleAddFriend(userId: number) {
    setSendStates((previous) => ({ ...previous, [userId]: 'sending' }))
    try {
      await sendFriendRequest(userId)
      setSendStates((previous) => ({ ...previous, [userId]: 'sent' }))
    } catch {
      setSendStates((previous) => ({ ...previous, [userId]: 'error' }))
    }
  }

  return (
    <div className="hidden w-56 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-2 py-4 sm:block dark:border-slate-700 dark:bg-slate-800/50">
      <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        멤버 — {members.length}
      </p>
      <ul className="flex flex-col gap-0.5">
        {members.map((member) => {
          const sendState = sendStates[member.userId] ?? 'idle'

          return (
            <li key={member.id} className="group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-700/50">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar user={toDisplayUser(member)} size="sm" showStatus={false} />
                <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
                  {member.nickname ?? member.externalId}
                </span>
              </div>
              {member.userId !== currentUserId && (
                <button
                  type="button"
                  title={sendState === 'sent' ? '친구 요청 보냄' : '친구 추가'}
                  aria-label={`${member.nickname ?? member.externalId} 친구 추가`}
                  onClick={() => handleAddFriend(member.userId)}
                  disabled={sendState !== 'idle'}
                  className="shrink-0 rounded p-1 text-slate-400 opacity-0 hover:bg-slate-300/50 hover:text-teal-600 group-hover:opacity-100 disabled:opacity-100 dark:text-slate-500 dark:hover:bg-slate-600/50 dark:hover:text-teal-400"
                >
                  <UsersIcon className={sendState === 'sent' ? 'h-3.5 w-3.5 text-teal-600 dark:text-teal-400' : 'h-3.5 w-3.5'} />
                </button>
              )}
            </li>
          )
        })}
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
