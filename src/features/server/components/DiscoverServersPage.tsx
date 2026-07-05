import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Server } from '../types'
import { fetchPublicServers, joinPublicServer } from '../api/serverApi'

export function DiscoverServersPage() {
  const [servers, setServers] = useState<Server[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [joiningId, setJoiningId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    fetchPublicServers()
      .then((data) => {
        if (!isCancelled) setServers(data)
      })
      .catch(() => {
        if (!isCancelled) setServers([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const filteredServers = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return servers

    return servers.filter(
      (server) =>
        server.name.toLowerCase().includes(keyword) ||
        (server.description?.toLowerCase().includes(keyword) ?? false),
    )
  }, [servers, search])

  async function handleJoin(server: Server) {
    setJoiningId(server.id)
    setError(null)

    try {
      await joinPublicServer(server.id)
      setServers((previous) => previous.filter((candidate) => candidate.id !== server.id))
    } catch {
      setError('참여에 실패했습니다.')
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 px-4 dark:border-slate-700">
        <Link to="/" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
          ← 채팅으로 돌아가기
        </Link>
        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">공개 서버 둘러보기</h1>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 py-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="서버 이름 또는 설명으로 검색"
          className="mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-teal-500"
        />

        {isLoading && <p className="text-sm text-slate-400 dark:text-slate-500">불러오는 중...</p>}

        {!isLoading && filteredServers.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {servers.length === 0 ? '둘러볼 공개 서버가 없습니다.' : '검색 결과가 없습니다.'}
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {filteredServers.map((server) => (
            <li
              key={server.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-sm font-semibold text-white">
                {server.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{server.name}</p>
                {server.description && (
                  <p className="truncate text-xs text-slate-400 dark:text-slate-500">{server.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleJoin(server)}
                disabled={joiningId === server.id}
                className="shrink-0 rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                참여
              </button>
            </li>
          ))}
        </ul>

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  )
}
