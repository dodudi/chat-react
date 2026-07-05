import { useState, type FormEvent } from 'react'
import type { Channel } from '../types'
import { createChannel } from '../api/channelApi'

type CreateChannelFormProps = {
  serverId: number
  onChannelCreated: (channel: Channel) => void
}

export function CreateChannelForm({ serverId, onChannelCreated }: CreateChannelFormProps) {
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
      const channel = await createChannel(serverId, { name: trimmed, type: 'TEXT', position: 0 })
      setName('')
      onChannelCreated(channel)
    } catch {
      setError('채널 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="채널 이름"
        autoFocus
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-teal-500"
      />
      <button
        type="submit"
        disabled={name.trim().length === 0 || isSubmitting}
        className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
      >
        만들기
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}
