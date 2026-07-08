import { useState } from 'react'
import type { Friendship } from '../../friend/types'
import { useFriends } from '../../friend/hooks/useFriends'
import type { DmChannel } from '../types'

type NewDmModalProps = {
  onCreateDirect: (friend: Friendship) => Promise<DmChannel>
  onCreateGroup: (name: string, participantIds: number[]) => Promise<DmChannel>
  onCreated: (channel: DmChannel) => void
  onClose: () => void
}

export function NewDmModal({ onCreateDirect, onCreateGroup, onCreated, onClose }: NewDmModalProps) {
  const { friends, isLoading } = useFriends()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [groupName, setGroupName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isGroup = selectedIds.length >= 2

  function toggleFriend(friendId: number) {
    setSelectedIds((previous) =>
      previous.includes(friendId) ? previous.filter((id) => id !== friendId) : [...previous, friendId],
    )
  }

  async function handleSubmit() {
    if (selectedIds.length === 0) return
    if (isGroup && groupName.trim().length === 0) return

    setIsSubmitting(true)
    try {
      const channel = isGroup
        ? await onCreateGroup(groupName.trim(), selectedIds)
        : await onCreateDirect(friends.find((friend) => friend.friendId === selectedIds[0])!)
      onCreated(channel)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
          받는 사람 선택
        </p>
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">불러오는 중...</p>
        ) : friends.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">아직 친구가 없습니다.</p>
        ) : (
          <ul className="flex max-h-52 flex-col gap-1 overflow-y-auto">
            {friends.map((friend) => (
              <li key={friend.id}>
                <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(friend.friendId)}
                    onChange={() => toggleFriend(friend.friendId)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                  />
                  {friend.friendExternalId}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isGroup && (
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
            그룹 이름
          </label>
          <input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="그룹 이름을 입력하세요"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-500"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedIds.length === 0 || (isGroup && groupName.trim().length === 0) || isSubmitting}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          {isGroup ? '그룹 만들기' : '메시지 보내기'}
        </button>
      </div>
    </div>
  )
}
