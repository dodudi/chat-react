import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Server } from '../types'
import { createServer, joinServerByInviteCode } from '../api/serverApi'

type CreateOrJoinServerPanelProps = {
  onServerCreated: (server: Server) => void
  onServerJoined: () => void
}

export function CreateOrJoinServerPanel({ onServerCreated, onServerJoined }: CreateOrJoinServerPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <CreateServerForm onServerCreated={onServerCreated} />
      <div className="border-t border-slate-200 dark:border-slate-700" />
      <JoinServerForm onServerJoined={onServerJoined} />
      <div className="border-t border-slate-200 dark:border-slate-700" />
      <Link
        to="/discover"
        className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
      >
        공개 서버 둘러보기 →
      </Link>
    </div>
  )
}

type CreateServerFormProps = {
  onServerCreated: (server: Server) => void
}

function CreateServerForm({ onServerCreated }: CreateServerFormProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    setError(null)

    try {
      const server = await createServer({ name: trimmed, isPublic: false })
      setName('')
      onServerCreated(server)
    } catch {
      setError('서버 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">서버 만들기</p>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="서버 이름"
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={name.trim().length === 0 || isSubmitting}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          만들기
        </button>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}

type JoinServerFormProps = {
  onServerJoined: () => void
}

function JoinServerForm({ onServerJoined }: JoinServerFormProps) {
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    setError(null)

    try {
      await joinServerByInviteCode(trimmed)
      setCode('')
      onServerJoined()
    } catch {
      setError('참여에 실패했습니다. 초대 코드를 확인해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">초대 코드로 참여하기</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="초대 코드"
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={code.trim().length === 0 || isSubmitting}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:text-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:disabled:text-slate-600"
        >
          참여하기
        </button>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}
