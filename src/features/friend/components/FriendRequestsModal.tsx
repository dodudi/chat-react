import { useFriendRequests } from '../hooks/useFriendRequests'

export function FriendRequestsModal() {
  const { received, sent, isLoading, accept, reject, cancel } = useFriendRequests()

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">불러오는 중...</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
          받은 요청
        </p>
        {received.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">받은 친구 요청이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {received.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
              >
                <span className="truncate">{request.requesterExternalId}</span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => accept(request.id)}
                    className="rounded-md bg-teal-600 px-2 py-1 text-xs font-medium text-white hover:bg-teal-700"
                  >
                    수락
                  </button>
                  <button
                    type="button"
                    onClick={() => reject(request.id)}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
          보낸 요청
        </p>
        {sent.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">보낸 친구 요청이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {sent.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
              >
                <span className="truncate">
                  {request.receiverExternalId}
                  {request.status === 'PENDING' && (
                    <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">대기중</span>
                  )}
                </span>
                {request.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => cancel(request.id)}
                    className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    취소
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
